'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapPin, House, Play, Stop } from '@phosphor-icons/react/ssr';
import { cn } from '@/lib/utils';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import type BaseLayer from 'ol/layer/Base';
import type { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import type { AttributionLike } from 'ol/source/Source';
import { boundingExtent } from 'ol/extent';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style';
import { defaults as defaultInteractions, DragPan, MouseWheelZoom } from 'ol/interaction';
import { primaryAction } from 'ol/events/condition';
import { Attribution } from 'ol/control';
import { MapboxVectorLayer } from 'ol-mapbox-style';
import { useTheme } from 'next-themes';
import { timelineData, type TimelineEntry } from '@/data/site-config';

// --- Constants (module scope: none of this depends on props or state) ---

const MARKER_FILL = '#FFD700';
const ACTIVE_FILL = '#76fbd9'; // tailwind `main`, the site's button colour
const ROUTE_COLOR = '#2b55ff'; // the hero greeting's blue
const BASEMAP_Z = 0;
const ROUTE_Z = 5;
const MARKER_Z = 10;
const PLAY_STEP_MS = 3200;

// Markers carry their timeline number, with the site's hard offset shadow.
// Index 0 is the normal style, index 1 the selected one (bigger, drawn on top).
const markerStyles = (n: number) =>
  [false, true].map((active) => {
    const radius = active ? 17 : 13;
    return [
      new Style({
        image: new CircleStyle({
          radius,
          fill: new Fill({ color: '#000' }),
          displacement: [3, -3],
        }),
        zIndex: active ? 3 : 1,
      }),
      new Style({
        image: new CircleStyle({
          radius,
          fill: new Fill({ color: active ? ACTIVE_FILL : MARKER_FILL }),
          stroke: new Stroke({ color: '#000', width: 2 }),
        }),
        text: new Text({
          text: String(n),
          font: `bold ${active ? 15 : 13}px sans-serif`,
          fill: new Fill({ color: '#000' }),
        }),
        zIndex: active ? 4 : 2,
      }),
    ];
  });
const MARKER_STYLES = timelineData.map((_, i) => markerStyles(i + 1));

const COORDS = timelineData.map((entry) => fromLonLat(entry.location));
const JOURNEY_EXTENT = boundingExtent(COORDS);

// Timeline order is newest first; the journey runs oldest first.
const CHRONOLOGICAL = timelineData.map((_, i) => i).reverse();

// A curved hop between two places: a quadratic Bézier whose control point is
// the midpoint pushed sideways by a sixth of the distance. Always to the north,
// so the back-and-forth hops between Europe and India bend the same way instead
// of crossing.
const arc = ([x1, y1]: Coordinate, [x2, y2]: Coordinate): Coordinate[] => {
  const side = x2 >= x1 ? 1 : -1;
  const cx = (x1 + x2) / 2 - (side * (y2 - y1)) / 6;
  const cy = (y1 + y2) / 2 + (side * (x2 - x1)) / 6;
  return Array.from({ length: 33 }, (_, i) => {
    const t = i / 32;
    const u = 1 - t;
    return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2];
  });
};

const ROUTE = new LineString(
  CHRONOLOGICAL.slice(1).flatMap((to, i) => arc(COORDS[CHRONOLOGICAL[i]], COORDS[to])),
);

// The text credit Mapbox requires. Their TileJSON gives OpenLayers none, so it is
// set here; "Improve this map" opens their feedback tool at the current view.
const MAPBOX_ATTRIBUTION: AttributionLike = ({ viewState }) => {
  const [lon, lat] = toLonLat(viewState.center);
  const link = (href: string, text: string) =>
    `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  return [
    link('https://www.mapbox.com/about/maps/', '© Mapbox'),
    link('https://www.openstreetmap.org/copyright', '© OpenStreetMap'),
    link(
      `https://apps.mapbox.com/feedback/#/${lon.toFixed(4)}/${lat.toFixed(4)}/${Math.round(viewState.zoom)}`,
      '<strong>Improve this map</strong>',
    ),
  ];
};

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Out, across and back in (the OpenLayers "fly to" pattern), so a long hop such
// as Pune to Cologne reads as travel rather than a blur.
const flyTo = (view: View, [x, y]: Coordinate, zoom = 8) => {
  const duration = reducedMotion() ? 0 : 1600;
  // Land with the place 90px below the middle: the popup above it then fits
  // even in the short map on phones.
  const center = [x, y + 90 * view.getResolutionForZoom(zoom)];
  view.cancelAnimations();
  view.animate({ center, duration });
  view.animate(
    { zoom: Math.min(view.getZoom() ?? zoom, 4), duration: duration / 2 },
    { zoom, duration: duration / 2 },
  );
};

// Every place in view, clear of the zoom buttons (right) and the popups (top).
const fitJourney = (view: View, duration = 0) =>
  view.fit(JOURNEY_EXTENT, { padding: [70, 72, 40, 40], maxZoom: 6, duration });

// --- Components ---

const NumberBadge: React.FC<{ n: number; active: boolean }> = ({ n, active }) => (
  <span
    className={cn(
      'absolute left-3 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full',
      'border-2 border-black text-sm font-black text-black shadow-[2px_2px_0px_0px_#000]',
      active ? 'bg-main' : 'bg-[#FFD700]',
    )}
  >
    {n}
  </span>
);

const TimelineItem: React.FC<{
  entry: TimelineEntry;
  n: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ entry, n, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={isActive}
    className={cn(
      'relative w-full text-left transition-colors duration-200 rounded-md pl-14 pr-3 py-3 sm:py-4',
      isActive ? 'bg-yellow-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-600',
    )}
  >
    <NumberBadge n={n} active={isActive} />
    <h3 className="font-black text-base sm:text-lg mb-1">{entry.title}</h3>
    <p className="text-xs sm:text-sm font-mono font-bold text-gray-600 dark:text-gray-400">
      {entry.date}
    </p>
    <p className="mt-1.5 sm:mt-2 text-sm sm:text-base leading-relaxed">{entry.description}</p>
    <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
      <MapPin size={14} />
      <span>{entry.locationName}</span>
    </div>
  </button>
);

const Popup: React.FC<{ entry: TimelineEntry }> = ({ entry }) => (
  <div className="relative">
    <div
      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50
                    bg-white dark:bg-darkBg border-2 sm:border-4 border-black dark:border-darkBorder
                    p-2 sm:p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
                    min-w-[180px] sm:min-w-[250px] max-w-[250px] sm:max-w-[350px]"
    >
      <h3
        className="font-black text-base sm:text-xl border-b-2 sm:border-b-4 border-black dark:border-darkBorder pb-1 sm:pb-2
                       text-black dark:text-white"
      >
        {entry.popupTitle}
      </h3>
      <p className="mt-1 sm:mt-2 text-xs font-mono font-bold text-gray-600 dark:text-gray-400">
        {entry.date}
      </p>
      <p className="mt-1 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
        {entry.popupDescription}
      </p>
    </div>
    {/* Pointer triangle */}
    <div
      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4
                    bg-white dark:bg-darkBg border-b-4 border-r-4
                    border-black dark:border-darkBorder rotate-45 z-40"
    ></div>
  </div>
);

const MAP_BUTTON = `bg-bg dark:bg-darkBg text-text dark:text-darkText w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 font-black
  border-2 sm:border-4 border-black dark:border-white rounded-lg flex items-center justify-center
  shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
  hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200`;

const ZoomControl: React.FC<{ onZoom: (direction: 'in' | 'out') => void; onReset: () => void }> = ({
  onZoom,
  onReset,
}) => (
  <div className="absolute top-3 right-3 flex flex-col gap-1.5 sm:gap-2 z-10">
    <button
      onClick={() => onZoom('in')}
      aria-label="Zoom in"
      className={cn(MAP_BUTTON, 'text-lg sm:text-xl md:text-2xl')}
    >
      +
    </button>
    <button
      onClick={() => onZoom('out')}
      aria-label="Zoom out"
      className={cn(MAP_BUTTON, 'text-lg sm:text-xl md:text-2xl')}
    >
      −
    </button>
    <button onClick={onReset} aria-label="Show the whole journey" className={MAP_BUTTON}>
      <House size={18} />
    </button>
  </div>
);

// --- Main Map Component ---
const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const popupElRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const markerLayerRef = useRef<VectorLayer | null>(null);
  const basemapRef = useRef<BaseLayer | null>(null);

  const [map, setMap] = useState<Map | null>(null);
  const [popupEntry, setPopupEntry] = useState<TimelineEntry | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [playing, setPlaying] = useState(false);
  // The text outlives `visible`, so it stays on screen while the hint fades out.
  const [hint, setHint] = useState({ text: '', visible: false });
  const { theme } = useTheme();

  // The map's event handlers are installed once, so they read this through a ref
  // rather than being torn down and rebuilt whenever it changes.
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    markerLayerRef.current?.changed(); // restyle: the selected marker grows
  }, [activeIndex]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxLightStyle = process.env.NEXT_PUBLIC_MAPBOX_LIGHT_STYLE_URL;
  const mapboxDarkStyle = process.env.NEXT_PUBLIC_MAPBOX_DARK_STYLE_URL;

  // Create the map once. Nothing in here depends on the theme or the viewport,
  // so neither a theme toggle nor a resize throws away the map — and with it the
  // user's current pan and zoom.
  useEffect(() => {
    if (!mapRef.current || !popupElRef.current) return;

    const overlay = new Overlay({
      element: popupElRef.current,
      positioning: 'bottom-center',
      offset: [0, -25],
      stopEvent: false,
    });
    overlayRef.current = overlay;

    const markers = timelineData.map(
      (entry, i) => new Feature({ geometry: new Point(COORDS[i]), ...entry }),
    );
    const markerLayer = new VectorLayer({
      source: new VectorSource({ features: markers, wrapX: false }),
      style: (feature) => {
        const i = timelineData.findIndex((e) => e.id === feature.get('id'));
        return MARKER_STYLES[i][i === activeIndexRef.current ? 1 : 0];
      },
      zIndex: MARKER_Z,
    });
    markerLayerRef.current = markerLayer;

    const routeLayer = new VectorLayer({
      source: new VectorSource({ features: [new Feature(ROUTE)] }),
      style: new Style({ stroke: new Stroke({ color: ROUTE_COLOR, width: 3, lineDash: [8, 8] }) }),
      zIndex: ROUTE_Z,
    });

    // The map sits in a long page, so it must not take over page scrolling:
    // the wheel zooms only with Ctrl/⌘ (a trackpad pinch sends ctrlKey too), and
    // on a touch screen one finger scrolls the page while two move the map.
    const dragPan: DragPan = new DragPan({
      condition: (e) =>
        (e.originalEvent as PointerEvent).pointerType === 'touch'
          ? dragPan.getPointerCount() === 2
          : primaryAction(e),
    });
    const mouseWheelZoom = new MouseWheelZoom({
      condition: (e) =>
        (e.originalEvent as WheelEvent).ctrlKey || (e.originalEvent as WheelEvent).metaKey,
    });

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [routeLayer, markerLayer],
      overlays: [overlay],
      // Shows the basemap's credit, expanded as Mapbox requires (logo further down).
      controls: [new Attribution({ collapsible: false })],
      interactions: defaultInteractions({
        dragPan: false,
        mouseWheelZoom: false,
        altShiftDragRotate: false,
        pinchRotate: false, // nothing on screen could turn the map back north
      }).extend([dragPan, mouseWheelZoom]),
      view: new View({ center: [0, 0], zoom: 2, maxZoom: 18, minZoom: 2 }),
    });
    fitJourney(mapInstance.getView());

    // Explain the gestures when someone tries the old ones.
    const modKey = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl';
    let hintTimer = 0;
    const flashHint = (text: string) => {
      setHint({ text, visible: true });
      window.clearTimeout(hintTimer);
      hintTimer = window.setTimeout(() => setHint((h) => ({ ...h, visible: false })), 1500);
    };
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) flashHint(`Use ${modKey} + scroll to zoom the map`);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) flashHint('Use two fingers to move the map');
    };
    const viewport = mapInstance.getViewport();
    viewport.addEventListener('wheel', onWheel, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: true });

    const showPopup = (entry: TimelineEntry) => {
      setPopupEntry(entry);
      overlay.setPosition(COORDS[timelineData.indexOf(entry)]);
    };

    const entryAt = (event: MapBrowserEvent) => {
      const feature = mapInstance.forEachFeatureAtPixel(event.pixel, (f) => f, {
        layerFilter: (l) => l === markerLayer,
      });
      return feature ? timelineData.find((e) => e.id === feature.get('id')) : undefined;
    };

    // Hover previews a place; leaving it brings back the selected one, if any.
    let hovered: TimelineEntry | undefined;
    const handlePointerMove = (event: MapBrowserEvent) => {
      if (event.dragging) return;
      const entry = entryAt(event);
      mapInstance.getTargetElement().style.cursor = entry ? 'pointer' : '';
      if (entry === hovered) return;
      hovered = entry;

      const active = timelineData[activeIndexRef.current];
      if (entry) showPopup(entry);
      else if (active) showPopup(active);
      else overlay.setPosition(undefined);
    };

    const handleClick = (event: MapBrowserEvent) => {
      const entry = entryAt(event);
      if (!entry) return;
      setPlaying(false);
      setActiveIndex(timelineData.indexOf(entry));
      showPopup(entry);
      flyTo(mapInstance.getView(), COORDS[timelineData.indexOf(entry)]);
    };

    mapInstance.on('pointermove', handlePointerMove);
    mapInstance.on('singleclick', handleClick);
    setMap(mapInstance);

    return () => {
      window.clearTimeout(hintTimer);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('touchmove', onTouchMove);
      mapInstance.dispose(); // also drops its listeners, layers and overlays
      overlayRef.current = null;
      markerLayerRef.current = null;
      basemapRef.current = null;
      setMap(null);
    };
  }, []);

  // Basemap follows the theme: swap the one layer instead of rebuilding the map.
  useEffect(() => {
    if (!map || !mapboxToken || !mapboxLightStyle || !mapboxDarkStyle) return;

    const basemap = new MapboxVectorLayer({
      styleUrl: theme === 'dark' ? mapboxDarkStyle : mapboxLightStyle,
      accessToken: mapboxToken,
      zIndex: BASEMAP_Z,
    });
    basemap.getSource()?.setAttributions(MAPBOX_ATTRIBUTION);
    map.addLayer(basemap);

    // Drop the old basemap only once the new one is in place, so the map never
    // flashes empty mid-swap.
    const previous = basemapRef.current;
    basemapRef.current = basemap;
    if (previous) map.removeLayer(previous);

    return () => {
      if (basemapRef.current === basemap) basemapRef.current = null;
      map.removeLayer(basemap);
    };
  }, [map, theme, mapboxToken, mapboxLightStyle, mapboxDarkStyle]);

  const select = useCallback(
    (index: number) => {
      if (!map || !overlayRef.current) return;
      setActiveIndex(index);
      setPopupEntry(timelineData[index]);
      overlayRef.current.setPosition(COORDS[index]);
      flyTo(map.getView(), COORDS[index]);
    },
    [map],
  );

  // Keep the selected entry in sight. Only the list scrolls (on desktop it is its
  // own scroll box; on phones it is not, and this does nothing).
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[activeIndex] as HTMLElement | undefined;
    if (!list || !item) return;
    list.scrollTo({ top: item.offsetTop - 8, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [activeIndex]);

  // Play the journey oldest first, one stop every few seconds, ending on today.
  useEffect(() => {
    if (!playing) return;
    let step = 0;
    let timer = 0;
    const next = () => {
      if (step === CHRONOLOGICAL.length) {
        setPlaying(false);
        return;
      }
      select(CHRONOLOGICAL[step++]);
      timer = window.setTimeout(next, PLAY_STEP_MS);
    };
    next();
    return () => window.clearTimeout(timer);
  }, [playing, select]);

  const handleTimelineClick = (index: number) => {
    setPlaying(false);
    select(index);
    // On phones the list sits under the map: bring the map back into view.
    mapBoxRef.current?.scrollIntoView({
      behavior: reducedMotion() ? 'auto' : 'smooth',
      block: 'nearest',
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map) return;
    const view = map.getView();
    const target = (view.getZoom() ?? 2) + (direction === 'in' ? 1 : -1);
    view.animate({
      zoom: Math.min(Math.max(target, view.getMinZoom()), view.getMaxZoom()),
      duration: 250,
    });
  };

  const handleReset = () => {
    if (!map) return;
    setPlaying(false);
    setActiveIndex(-1);
    overlayRef.current?.setPosition(undefined);
    fitJourney(map.getView(), reducedMotion() ? 0 : 800);
  };

  // --- Render ---
  return (
    // Outer container for padding and background
    <div className="relative p-2 sm:p-4 md:p-6 lg:p-8 bg-white dark:bg-black py-8 sm:py-12 md:py-16">
      {/* Grid background */}
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:20px_20px]',
          '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
          'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]',
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <div className="max-w-full mx-auto px-2 sm:px-5 relative z-10">
        {/* Title Section */}
        <div
          className="w-full bg-bg border-2 sm:border-4 border-black dark:border-darkBorder dark:bg-darkBg
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            dark:shadow-[4px_4px_0px_0px_#555555] dark:sm:shadow-[8px_8px_0px_0px_#555555]
                            transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_#555555]
                            transition-all duration-300 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-black dark:text-darkText text-center">
            My Journey Through Time &amp; Space
          </h2>
        </div>

        {/* Timeline beside the map on desktop, under it on phones. Side by side,
            the panel never covers the map, so the whole map is usable. */}
        <div
          className="grid md:grid-cols-[minmax(300px,380px)_1fr] md:h-[600px] lg:h-[680px]
                            border-2 sm:border-4 border-black dark:border-darkBorder bg-white dark:bg-darkBg
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            dark:shadow-[4px_4px_0px_0px_#555555] dark:sm:shadow-[8px_8px_0px_0px_#555555]
                            overflow-hidden rounded-md"
        >
          <div
            ref={mapBoxRef}
            className="relative h-[360px] sm:h-[460px] md:h-auto md:order-2 scroll-mt-24 [&_.ol-attribution]:max-w-[calc(100%-6.5rem)]
                              border-b-2 sm:border-b-4 md:border-b-0 md:border-l-4 border-black dark:border-darkBorder"
          >
            {/* Map viewport. Everything else is a sibling: OpenLayers owns this
                element's children, so React-rendered UI must stay outside it. */}
            <div
              ref={mapRef}
              className="absolute inset-0"
              aria-label="Map of the places in my journey"
            />

            <ZoomControl onZoom={handleZoom} onReset={handleReset} />

            {/* Mapbox's logo, required alongside the text credit. Their unaltered
                artwork, from the mapbox-gl stylesheet. */}
            <a
              href="https://www.mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mapbox"
              className="absolute bottom-1 left-2 z-10 block h-[23px] w-[88px] bg-[url('/mapbox-logo.svg')] bg-no-repeat"
            />

            {/* Gesture hint, shown briefly when someone scrolls or swipes over the map */}
            <div
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-4',
                'text-center text-lg sm:text-xl font-bold text-white transition-opacity duration-300',
                hint.visible ? 'opacity-100' : 'opacity-0',
              )}
            >
              {hint.text}
            </div>

            {/* Popup body. OpenLayers moves this node into its own overlay
                container and positions it; React keeps rendering its contents. */}
            <div ref={popupElRef}>{popupEntry && <Popup entry={popupEntry} />}</div>
          </div>

          <div className="flex min-h-0 flex-col md:order-1">
            <div className="flex flex-none items-center justify-between gap-3 p-3 sm:p-4 border-b-2 sm:border-b-4 border-black dark:border-darkBorder">
              <h3 className="font-black text-lg sm:text-xl text-black dark:text-white">
                Journey Timeline
              </h3>
              <button
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={playing}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-black bg-main rounded-base
                                  border-2 border-black shadow-[3px_3px_0px_0px_#000]
                                  hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
              >
                {playing ? <Stop size={16} weight="fill" /> : <Play size={16} weight="fill" />}
                {playing ? 'Stop' : 'Play journey'}
              </button>
            </div>

            {/* `relative` makes this the items' offsetParent, for the scroll above */}
            <ol ref={listRef} className="relative flex-1 min-h-0 md:overflow-y-auto p-2 space-y-1">
              {timelineData.map((entry, index) => (
                <li key={entry.id} className="relative">
                  {/* Dashed link down to the next badge, like the route on the map */}
                  {index < timelineData.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[25px] top-[30px] -bottom-[34px] z-[1] border-l-2 border-dashed border-black/30 dark:border-white/30"
                    />
                  )}
                  <TimelineItem
                    entry={entry}
                    n={index + 1}
                    isActive={index === activeIndex}
                    onClick={() => handleTimelineClick(index)}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
