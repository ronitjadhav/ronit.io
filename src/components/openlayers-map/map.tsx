'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { List, CaretLeft, MapPin, House } from '@phosphor-icons/react/ssr';
import { cn } from '@/lib/utils';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import type BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { MapboxVectorLayer } from 'ol-mapbox-style';
import { useTheme } from 'next-themes';
import { timelineData, type TimelineEntry } from '@/data/site-config';

interface TimelineItemProps {
  entry: TimelineEntry;
  isActive: boolean;
  onClick: () => void;
}

interface TimelineContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ZoomControlProps {
  onZoom: (direction: 'in' | 'out') => void;
  onReset: () => void;
}

// --- Constants (module scope: none of this depends on props or state) ---
const MARKER_ICON = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
  <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="marker-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#marker-shadow)">
      <circle cx="18" cy="18" r="14" fill="#FFD700" stroke="#000000" stroke-width="2"/>
      <circle cx="18" cy="18" r="6" fill="#000000"/>
    </g>
  </svg>
`)}`;

const MARKER_STYLE = new Style({
  image: new Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: MARKER_ICON,
    scale: 1,
  }),
});

const INITIAL_VIEW = { center: fromLonLat([10, 45]), zoom: 3 };
const BASEMAP_Z = 0;
const MARKER_Z = 10;

// --- Components ---

const TimelineItem: React.FC<TimelineItemProps> = ({ entry, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={isActive}
    className={`
      relative cursor-pointer w-full text-left transition-colors duration-200 rounded-md
      pl-10 sm:pl-14 md:pl-16 pr-2 sm:pr-4 py-3 sm:py-4
      border-l-4 border-transparent
      ${isActive ? 'bg-yellow-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}
    `}
  >
    {/* Minimalistic pointer only - vertical line is now in the container */}
    <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-black dark:bg-white rounded-full z-10"></div>

    {/* Content Area */}
    <div className="flex-1">
      <h3 className="font-black text-base sm:text-lg md:text-xl mb-1">{entry.title}</h3>
      <p className="text-xs sm:text-sm font-mono font-bold text-gray-600 dark:text-gray-400">
        {entry.date}
      </p>
      <p className="mt-1.5 sm:mt-2 text-sm sm:text-base leading-relaxed">{entry.description}</p>
      <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
        <MapPin size={14} className="sm:w-4 sm:h-4" />
        <span>{entry.locationName}</span>
      </div>
    </div>
  </button>
);

const Popup: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="relative">
    {/* Popup Box */}
    <div
      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50
                    bg-white dark:bg-darkBg border-2 sm:border-4 border-black dark:border-darkBorder
                    p-2 sm:p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
                    min-w-[180px] sm:min-w-[250px] max-w-[250px] sm:max-w-[350px]"
    >
      <h3
        className="font-black text-base sm:text-xl mb-1 sm:mb-2 border-b-2 sm:border-b-4 border-black dark:border-darkBorder pb-1 sm:pb-2
                       text-black dark:text-white"
      >
        {title}
      </h3>
      <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </div>
    {/* Pointer triangle */}
    <div
      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4
                    bg-white dark:bg-darkBg border-b-4 border-r-4
                    border-black dark:border-darkBorder rotate-45 z-40" // Ensure triangle is below box but above map elements potentially
    ></div>
  </div>
);

const TimelineContainer: React.FC<TimelineContainerProps> = ({ isOpen, onClose, children }) => (
  <div
    className={`
        absolute top-0 left-0
        h-full w-full sm:w-[380px] md:w-[420px]
        bg-white/95 dark:bg-darkBg/95 backdrop-blur-md
        border-r-2 sm:border-r-4 border-black dark:border-darkBorder
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        z-20
        flex flex-col
        overflow-hidden
        ${!isOpen ? 'invisible md:visible' : 'visible'}
    `}
    // Added md:visible when closed to prevent layout shift on desktop if it was fully hidden
  >
    <div className="flex-none flex items-center justify-between p-3 sm:p-4 border-b-2 sm:border-b-4 border-black dark:border-darkBorder bg-white dark:bg-darkBg">
      <h3 className="font-black text-lg sm:text-xl text-black dark:text-white">Journey Timeline</h3>
      <button
        onClick={onClose}
        className="p-2 bg-black dark:bg-darkBg text-white dark:text-darkText hover:bg-gray-800 dark:hover:bg-black transition-colors rounded md:hidden" // Hide close button on desktop
        aria-label="Close timeline"
      >
        <CaretLeft size={24} />
      </button>
    </div>
    {/* Scrollable area with continuous vertical line */}
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 relative">{children}</div>
  </div>
);

const ZoomControl: React.FC<ZoomControlProps> = ({ onZoom, onReset }) => (
  <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:top-4 right-2 sm:right-4 flex flex-col gap-1.5 sm:gap-2 z-10">
    {[
      { label: '+', direction: 'in' as const, aria: 'Zoom in' },
      { label: '−', direction: 'out' as const, aria: 'Zoom out' },
    ].map(({ label, direction, aria }) => (
      <button
        key={direction}
        onClick={() => onZoom(direction)}
        aria-label={aria}
        className="bg-bg dark:bg-darkBg text-text dark:text-darkText w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-lg sm:text-xl md:text-2xl font-black
                         border-2 sm:border-4 border-black dark:border-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
                         hover:shadow-none hover:translate-x-1 hover:translate-y-1
                         transition-all duration-200"
      >
        {label}
      </button>
    ))}
    {/* Reset to Initial View Button */}
    <button
      onClick={onReset}
      aria-label="Reset to initial view"
      className="bg-bg dark:bg-darkBg text-text dark:text-darkText w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sm sm:text-base md:text-lg font-black
                       border-2 sm:border-4 border-black dark:border-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
                       hover:shadow-none hover:translate-x-1 hover:translate-y-1
                       transition-all duration-200 flex items-center justify-center"
    >
      <House size={16} className="sm:w-5 sm:h-5" />
    </button>
  </div>
);

// --- Main Map Component ---
const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupElRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const basemapRef = useRef<BaseLayer | null>(null);

  const [map, setMap] = useState<Map | null>(null);
  const [popupEntry, setPopupEntry] = useState<TimelineEntry | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { theme } = useTheme();

  // The map's event handlers are installed once, so they read these through refs
  // rather than being torn down and rebuilt whenever the values change.
  const activeIndexRef = useRef(activeIndex);
  const isMobileRef = useRef(isMobile);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    isMobileRef.current = isMobile;
  });

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxLightStyle = process.env.NEXT_PUBLIC_MAPBOX_LIGHT_STYLE_URL;
  const mapboxDarkStyle = process.env.NEXT_PUBLIC_MAPBOX_DARK_STYLE_URL;

  // Track the mobile breakpoint. matchMedia fires only when the breakpoint is
  // crossed; the old resize listener fired on every pixel of a window drag.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = (mobile: boolean) => {
      setIsMobile(mobile);
      setIsTimelineOpen(!mobile);
    };
    apply(mq.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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

    const markers = timelineData.map((entry) => {
      const feature = new Feature({ geometry: new Point(fromLonLat(entry.location)), ...entry });
      feature.setStyle(MARKER_STYLE);
      return feature;
    });

    const markerLayer = new VectorLayer({
      source: new VectorSource({ features: markers, wrapX: false }),
      zIndex: MARKER_Z,
    });

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [markerLayer],
      overlays: [overlay],
      controls: [],
      view: new View({ ...INITIAL_VIEW, maxZoom: 18, minZoom: 2 }),
    });

    const showPopup = (feature: Feature) => {
      setPopupEntry(feature.getProperties() as TimelineEntry);
      overlay.setPosition((feature.getGeometry() as Point).getCoordinates());
    };

    const featureAt = (event: MapBrowserEvent) =>
      mapInstance.forEachFeatureAtPixel(event.pixel, (f) => f as Feature, {
        layerFilter: (l) => l === markerLayer,
      });

    // Hover. Browsers already coalesce pointermove to one event per frame and
    // hit-testing a handful of points is trivial, so no throttling is needed.
    let hovered: Feature | null = null;
    const handlePointerMove = (event: MapBrowserEvent) => {
      if (event.dragging) return;
      const feature = featureAt(event);
      mapInstance.getTargetElement().style.cursor = feature ? 'pointer' : '';

      if (feature) {
        if (feature !== hovered) {
          hovered = feature;
          showPopup(feature);
        }
        return;
      }

      // Keep the popup up if it belongs to the item selected in the timeline.
      const active = activeIndexRef.current >= 0 ? timelineData[activeIndexRef.current] : null;
      if (!active || hovered?.get('id') !== active.id) overlay.setPosition(undefined);
      hovered = null;
    };

    const handleClick = (event: MapBrowserEvent) => {
      const feature = featureAt(event);
      if (!feature) return;

      const props = feature.getProperties() as TimelineEntry;
      setActiveIndex(timelineData.findIndex((item) => item.id === props.id));
      showPopup(feature);

      const view = mapInstance.getView();
      view.animate({
        center: (feature.getGeometry() as Point).getCoordinates(),
        zoom: Math.max((view.getZoom() ?? INITIAL_VIEW.zoom) + 2, 8),
        duration: 1000,
      });

      if (isMobileRef.current) setIsTimelineOpen(false);
    };

    mapInstance.on('pointermove', handlePointerMove);
    mapInstance.on('singleclick', handleClick);
    setMap(mapInstance);

    return () => {
      mapInstance.dispose(); // also drops its listeners, layers and overlays
      overlayRef.current = null;
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

  const handleTimelineClick = (index: number) => {
    if (!map || !overlayRef.current) return;
    const entry = timelineData[index];
    const coords = fromLonLat(entry.location);

    setActiveIndex(index);
    setPopupEntry(entry);
    overlayRef.current.setPosition(coords);

    map.getView().animate({
      center: coords,
      zoom: Math.max(map.getView().getZoom() ?? 8, 8),
      duration: 800,
    });

    if (isMobile) setIsTimelineOpen(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map) return;
    const view = map.getView();
    const target = (view.getZoom() ?? INITIAL_VIEW.zoom) + (direction === 'in' ? 1 : -1);
    view.animate({
      zoom: Math.min(Math.max(target, view.getMinZoom()), view.getMaxZoom()),
      duration: 250,
    });
  };

  const handleReset = useCallback(() => {
    if (!map) return;
    map.getView().animate({ ...INITIAL_VIEW, duration: 800 });
    setActiveIndex(-1);
    overlayRef.current?.setPosition(undefined);
  }, [map]);

  const toggleTimeline = () => setIsTimelineOpen((prev) => !prev);

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

        {/* Map and Timeline Container */}
        <div
          className="relative border-2 sm:border-4 border-black dark:border-darkBorder bg-white dark:bg-darkBg
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            dark:shadow-[4px_4px_0px_0px_#555555] dark:sm:shadow-[8px_8px_0px_0px_#555555]
                            h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[750px]
                            overflow-hidden rounded-md" // Added slight rounding
        >
          {/* Map viewport. Everything else is a sibling: OpenLayers owns this
              element's children, so React-rendered UI must stay outside it. */}
          <div ref={mapRef} className="w-full h-full" aria-label="Interactive Journey Map" />

          {/* Timeline Sidebar */}
          <TimelineContainer isOpen={isTimelineOpen} onClose={toggleTimeline}>
            {timelineData.map((entry, index) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                isActive={index === activeIndex}
                onClick={() => handleTimelineClick(index)}
              />
            ))}
          </TimelineContainer>

          {/* Instructional Text Overlay - improved positioning */}
          <div
            className="absolute top-4 right-4 left-auto md:right-20 lg:right-24 z-10
                            bg-white/80 dark:bg-black/80 backdrop-blur-sm p-2 px-3 rounded-md
                            border-2 border-black dark:border-darkBorder shadow-md
                            text-xs sm:text-sm text-black dark:text-white font-medium max-w-[200px] sm:max-w-xs"
          >
            Click markers or timeline items to explore!
          </div>

          {/* Mobile Toggle Button for Timeline */}
          {!isTimelineOpen && (
            <button
              onClick={toggleTimeline}
              aria-label="Open timeline"
              className="md:hidden absolute top-4 left-4 z-30 p-3 bg-bg dark:bg-darkBg text-black dark:text-darkText
                                 border-4 border-black dark:border-white rounded-lg
                                 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
                                 hover:shadow-none hover:translate-x-1 hover:translate-y-1
                                 transition-all duration-200"
            >
              <List size={24} />
            </button>
          )}

          {/* Zoom Controls */}
          <ZoomControl onZoom={handleZoom} onReset={handleReset} />

          {/* Popup body. OpenLayers moves this node into its own overlay
              container and positions it; React keeps rendering its contents. */}
          <div ref={popupElRef}>
            {popupEntry && (
              <Popup title={popupEntry.popupTitle} description={popupEntry.popupDescription} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
