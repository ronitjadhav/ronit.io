'use client';
import React, { useRef, useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client'; // Import Root type
import { Menu, ChevronLeft, MapPin } from 'lucide-react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { MapboxVectorLayer } from 'ol-mapbox-style';
import { useTheme } from 'next-themes';
import { Geometry } from 'ol/geom';

// --- Interfaces ---
interface TimelineEntry {
  id: number;
  title: string;
  date: string;
  description: string;
  location: [number, number];
  locationName: string;
  popupTitle: string;
  popupDescription: string;
}

interface TimelineItemProps {
  entry: TimelineEntry;
  isActive: boolean;
  onClick: () => void;
}

interface PopupProps {
  title: string;
  description: string;
}

interface TimelineContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ZoomControlProps {
  onZoom: (direction: 'in' | 'out') => void;
}

// --- Data ---
const timelineData: TimelineEntry[] = [
  {
    id: 1,
    title: 'Software Engineer @ Camptocamp',
    date: 'Oct 2023 - Present',
    description:
      'Kicked off my journey into the open-source geospatial realm at Camptocamp, working with QGIS, Geonetwork-UI, developing custom GIS dashboards, and contributing to QGIS plugins. Diving into Docker, web GIS, and everything open-source!',
    location: [13.427683548268714, 52.499819181584776],
    locationName: 'Berlin, Germany (Hybrid)',
    popupTitle: 'Camptocamp',
    popupDescription:
      'Became part of the open-source geospatial world, building geospatial solutions and exploring the power of QGIS.'
  },
  {
    id: 2,
    title: 'Software Engineering for Industrial Applications @ Hochschule Hof',
    date: '2022 - 2024',
    description:
      'Diving deep into advanced programming, software engineering, and IoT, while focusing on Industry 4.0. Gaining expertise in applied cloud computing, non-relational databases, and spatial technologies to bridge software and the real world.',
    location: [11.941048555260455, 50.325469419408954],
    locationName: 'Hof, Germany',
    popupTitle: 'Hochschule Hof',
    popupDescription:
      'Expanding my skillset in software engineering, focusing on Industry 4.0, cloud computing, and real-world applications.'
  },
  {
    id: 3,
    title: 'GIS Developer @ Gistec',
    date: '2019 - 2022',
    description:
      'Joined Gistec to create custom geoprocessing tools, work with ArcGIS Enterprise, and develop web mapping apps with Esri tech. Basically, a geospatial problem-solver.',
    location: [78.39265742273773, 17.489373568497363],
    locationName: 'Hyderabad, India',
    popupTitle: 'Gistec',
    popupDescription:
      'Built mapping tools and apps while mastering Python (ArcPy), ArcGIS Server, and the Esri stack.'
  },
  {
    id: 4,
    title: 'Student Intern @ University of Cologne',
    date: '2019 - 2019',
    description:
      'Interned at the University of Cologne, applying GIS and spatial analysis to hydrological modeling with ArcSWAT for the Mula-Mutha river. Automated tasks using Python and supported geospatial research for water resources.',
    location: [6.936245553273681, 50.92747527039799],
    locationName: 'Cologne, Germany',
    popupTitle: 'University of Cologne',
    popupDescription:
      "Leveraged GIS and spatial data to contribute to water flux modeling and the SWAT tool's application in India."
  },
  {
    id: 5,
    title: 'M.Sc. in Geoinformatics: The Spatial Awakening',
    date: '2017 - 2019',
    description:
      'Learned to wield GIS, remote sensing, and code like a spatial wizard. Maps and code—what could go wrong?',
    location: [73.85215058309475, 18.460275536163216],
    locationName: 'Pune, India',
    popupTitle: 'BVIEER',
    popupDescription:
      'Where I discovered that geography is more than just knowing where places are.'
  },
];

// --- Helper Functions ---
const createSVGMarker = (): string => {
  const svg = `
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
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// --- Components ---

// ** Improved TimelineItem **
const TimelineItem: React.FC<TimelineItemProps> = ({ entry, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`
      relative cursor-pointer w-full transition-colors duration-200 rounded-md
      pl-16 pr-4 py-4
      border-l-4 border-transparent       /* reserve 4px for the spine always */
      ${isActive
        ? 'bg-yellow-100 dark:bg-gray-700' /* only background changes when active */
        : 'hover:bg-gray-100 dark:hover:bg-gray-600'
      }
    `}
  >
    {/* Minimalistic pointer only - vertical line is now in the container */}
    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-black dark:bg-white rounded-full z-10"></div>

    {/* Content Area */}
    <div className="flex-1">
      <h3 className="font-black text-xl mb-1">{entry.title}</h3>
      <p className="text-sm font-mono font-bold text-gray-600 dark:text-gray-400">{entry.date}</p>
      <p className="mt-2 text-base leading-relaxed">{entry.description}</p>
      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <MapPin size={16} />
        <span>{entry.locationName}</span>
      </div>
    </div>
  </div>
);

const Popup: React.FC<PopupProps> = ({ title, description }) => (
  <div className="relative">
    {/* Popup Box */}
    <div
      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50
                    bg-white dark:bg-darkBg border-4 border-black dark:border-darkBorder
                    p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
                    min-w-[250px] max-w-[350px]"
    >
      <h2
        className="font-black text-xl mb-2 border-b-4 border-black dark:border-darkBorder pb-2
                       text-black dark:text-white"
      >
        {title}
      </h2>
      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{description}</p>
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
        h-full w-full sm:w-[420px]
        bg-white/95 dark:bg-darkBg/95 backdrop-blur-md
        border-r-4 border-black dark:border-darkBorder
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        z-20
        flex flex-col
        overflow-hidden
        ${!isOpen ? 'invisible md:visible' : 'visible'} // Keep visible on md+ when closed
    `}
    // Added md:visible when closed to prevent layout shift on desktop if it was fully hidden
  >
    <div className="flex-none flex items-center justify-between p-4 border-b-4 border-black dark:border-darkBorder bg-white dark:bg-darkBg">
      <h2 className="font-black text-xl text-black dark:text-white">Journey Timeline</h2>
      <button
        onClick={onClose}
        className="p-2 bg-black dark:bg-darkBg text-white dark:text-darkText hover:bg-gray-800 dark:hover:bg-black transition-colors rounded md:hidden" // Hide close button on desktop
        aria-label="Close timeline"
      >
        <ChevronLeft size={24} />
      </button>
    </div>
    {/* Scrollable area with continuous vertical line */}
    <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
      {children}
    </div>
  </div>
);

const ZoomControl: React.FC<ZoomControlProps> = ({ onZoom }) => (
  <div className="absolute bottom-4 md:bottom-6 lg:top-4 right-4 flex flex-col gap-2 z-10">
    {[
      { label: '+', direction: 'in' as const, aria: 'Zoom in' },
      { label: '−', direction: 'out' as const, aria: 'Zoom out' },
    ].map(({ label, direction, aria }) => (
      <button
        key={direction}
        onClick={() => onZoom(direction)}
        aria-label={aria}
        className="bg-bg dark:bg-darkBg text-text dark:text-darkText w-12 h-12 text-2xl font-black
                         border-4 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
                         hover:shadow-none hover:translate-x-1 hover:translate-y-1
                         transition-all duration-200 "
      >
        {label}
      </button>
    ))}
  </div>
);

// --- Main Map Component ---
const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement | null>(null); // Ref for the DOM element where the popup will be mounted
  const popupRootRef = useRef<Root | null>(null); // Ref for the React root attached to the popup element
  const [map, setMap] = useState<Map | null>(null);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1); // Start with no active item
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(true); // Default to open, will adjust based on screen size
  const markerIconUrl = useRef<string>(createSVGMarker());
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { theme } = useTheme();

  // --- Environment Variables (Ensure these are set in your .env.local) ---
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxLightStyle = process.env.NEXT_PUBLIC_MAPBOX_LIGHT_STYLE_URL;
  const mapboxDarkStyle = process.env.NEXT_PUBLIC_MAPBOX_DARK_STYLE_URL;

  // --- Effects ---

  // Check initial screen size and setup resize listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Close timeline by default on mobile, open on desktop
      setIsTimelineOpen(!mobile);
    };

    checkSize(); // Initial check
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || !mapboxToken || !mapboxLightStyle || !mapboxDarkStyle) {
        console.warn('Map initialization prerequisites not met (window, mapRef, or Mapbox vars missing).');
        return;
    }


    // Create the DOM element for the popup only once
    if (!popupRef.current) {
        popupRef.current = document.createElement('div');
        popupRef.current.id = 'popup-container'; // Optional: for debugging
    }
    // Create React root for the popup element only once
    if (!popupRootRef.current && popupRef.current) {
        popupRootRef.current = createRoot(popupRef.current);
    }


    const overlayInstance = new Overlay({
      element: popupRef.current, // Use the persistent DOM element
      positioning: 'bottom-center',
      offset: [0, -25], // Adjusted offset slightly for marker size
      stopEvent: false,
    });

    const initialStyleUrl = theme === 'dark' ? mapboxDarkStyle : mapboxLightStyle;

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [
        new MapboxVectorLayer({
          styleUrl: initialStyleUrl,
          accessToken: mapboxToken,
        }),
      ],
      controls: [], // Remove default controls
      view: new View({
        center: fromLonLat([10, 45]), // Adjusted initial center
        zoom: 3, // Adjusted initial zoom
        maxZoom: 18,
        minZoom: 2,
      }),
    });

    mapInstance.addOverlay(overlayInstance);
    setMap(mapInstance);
    setOverlay(overlayInstance);

    // Define Marker Style
     const markerStyle = new Style({
       image: new Icon({
         anchor: [0.5, 0.5], // Center the anchor
         anchorXUnits: 'fraction',
         anchorYUnits: 'fraction',
         src: markerIconUrl.current, // Use the generated SVG URL
         scale: 1,
       }),
     });


    // Create Features from Data
    const features = timelineData.map((entry) => {
      const transformedCoords = fromLonLat(entry.location);
      const feature = new Feature({
        geometry: new Point(transformedCoords),
        // Store all necessary data directly on the feature
        ...entry
      });
      feature.setStyle(markerStyle); // Apply the style
      return feature;
    });

    // Add Vector Layer
    const vectorSource = new VectorSource({ features });
    const vectorLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 10 // Ensure markers are above the base layer
    });
    mapInstance.addLayer(vectorLayer);

    // --- Map Interactions ---
    let currentHoverFeature: Feature<Geometry> | null = null;

    // Hover Effect (Pointer Move)
    mapInstance.on('pointermove', (event) => {
      if (event.dragging || !overlayInstance || !popupRootRef.current) return; // Ignore while dragging or if overlay/root not ready

      const pixel = mapInstance.getEventPixel(event.originalEvent);
      const feature = mapInstance.forEachFeatureAtPixel(
        pixel,
        (f) => f as Feature<Geometry>, // Type assertion
        { layerFilter: (l) => l === vectorLayer } // Only check features on our vector layer
      );

      // Change cursor
      mapInstance.getTargetElement().style.cursor = feature ? 'pointer' : '';

      if (feature) {
        if (feature !== currentHoverFeature) { // Only update if hover feature changes
          currentHoverFeature = feature;
          const props = feature.getProperties() as TimelineEntry; // Get data
          const coords = (feature.getGeometry() as Point).getCoordinates();

          // Render popup content using the React root
          popupRootRef.current.render(
            <Popup title={props.popupTitle} description={props.popupDescription} />
          );
          overlayInstance.setPosition(coords); // Show popup at feature location
        }
      } else {
        // Only hide popup if the currently active item is NOT the one being hovered off
        const activeEntry = activeIndex >= 0 ? timelineData[activeIndex] : null;
        if (!activeEntry || currentHoverFeature?.get('id') !== activeEntry.id) {
           overlayInstance.setPosition(undefined); // Hide popup
        }
        currentHoverFeature = null;
      }
    });

    // Click Effect
    mapInstance.on('click', (event) => {
       if (!overlayInstance || !popupRootRef.current) return;

      const pixel = mapInstance.getEventPixel(event.originalEvent);
       const feature = mapInstance.forEachFeatureAtPixel(
         pixel,
         (f) => f as Feature<Geometry>,
         { layerFilter: (l) => l === vectorLayer }
       );

      if (feature) {
        const props = feature.getProperties() as TimelineEntry;
        const coords = (feature.getGeometry() as Point).getCoordinates();
        const index = timelineData.findIndex((item) => item.id === props.id);

        setActiveIndex(index); // Set this item as active

         // Ensure popup is visible and updated for the clicked item
        popupRootRef.current.render(
          <Popup title={props.popupTitle} description={props.popupDescription} />
        );
        overlayInstance.setPosition(coords);

        // Animate map view to the feature
        mapInstance.getView().animate({
          center: coords,
          zoom: Math.max(mapInstance.getView().getZoom() ?? 8, 8), // Zoom in, but not too much if already zoomed
          duration: 800,
        });

        // Optional: If on mobile, close the timeline sidebar after clicking a map marker
        if (isMobile) {
           setIsTimelineOpen(false);
        }

      } else {
        // Clicked outside a feature - potentially clear active state?
        // setActiveIndex(-1); // Uncomment to deselect on map click outside features
        // overlayInstance.setPosition(undefined); // Uncomment to hide popup on map click outside features
      }
    });

    // Cleanup function
    return () => {
      // Important: Unmount the React root when the component unmounts or map re-initializes
       popupRootRef.current?.unmount();
       popupRootRef.current = null; // Clear the ref
       popupRef.current = null; // Clear the DOM element ref
      mapInstance.setTarget(undefined); // Detach map from DOM
       console.log("Map instance disposed");
    };
    // Dependencies include theme and Mapbox details for re-initialization if they change
    // Removed activeIndex from dependencies to prevent map re-initialization on selection
  }, [theme, mapboxToken, mapboxLightStyle, mapboxDarkStyle, isMobile]); // Removed activeIndex to fix double-click issue

  // Update Map Style on Theme Change
  useEffect(() => {
    if (!map || !mapboxToken || !mapboxLightStyle || !mapboxDarkStyle) return;

    const layers = map.getLayers();
    const firstLayer = layers.item(0); // Get the first layer (should be the base map)

    if (firstLayer instanceof MapboxVectorLayer) {
        // Replace the existing Mapbox layer with a new one using the updated style
        const newStyleUrl = theme === 'dark' ? mapboxDarkStyle : mapboxLightStyle;
        layers.setAt(0, new MapboxVectorLayer({
            styleUrl: newStyleUrl,
            accessToken: mapboxToken,
        }));
        console.log("Map style updated for theme:", theme);
    } else {
        console.warn("Could not find MapboxVectorLayer at index 0 to update theme.");
    }
  }, [theme, map, mapboxToken, mapboxLightStyle, mapboxDarkStyle]);


  // --- Handlers ---

  const handleTimelineClick = (index: number) => {
    if (!map || !overlay || !popupRootRef.current) return;

    setActiveIndex(index); // Set selected item as active
    const entry = timelineData[index];
    const transformedCoords = fromLonLat(entry.location);

    // Animate map view
    map.getView().animate({
      center: transformedCoords,
      zoom: Math.max(map.getView().getZoom() ?? 8, 8), // Zoom in, but don't zoom out if already close
      duration: 800,
    });

    // Update and show popup for the selected item
    popupRootRef.current.render(
        <Popup title={entry.popupTitle} description={entry.popupDescription} />
    );
    overlay.setPosition(transformedCoords);

    // Close timeline automatically on mobile after selection
    if (isMobile) {
      setIsTimelineOpen(false);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map) return;
    const view = map.getView();
    const currentZoom = view.getZoom() || 0;
    const newZoom = direction === 'in' ? currentZoom + 1 : currentZoom - 1;
    // Use OL animate for smooth zoom
    view.animate({
      zoom: Math.max(view.getMinZoom() || 2, Math.min(newZoom, view.getMaxZoom() || 18)), // Clamp zoom level
      duration: 250, // Smooth animation
    });
  };

  const toggleTimeline = () => {
    setIsTimelineOpen((prev) => !prev);
  };

  // --- Render ---
  return (
    // Outer container for padding and background
    <div className="p-4 sm:p-6 md:p-8 bg-bg dark:bg-secondaryBlack min-h-screen">
      {/* Title Section */}
      <div
        className="w-full bg-bg border-4 border-black dark:bg-darkBg
                          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                          transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
                          transition-all duration-300 p-6 mb-10"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-darkText text-center">
          My Journey Through Time & Space 🗺️
        </h1>
      </div>

      {/* Map and Timeline Container */}
      <div
        className="relative border-4 border-black dark:border-darkBorder bg-white dark:bg-darkBg
                          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                          h-[calc(100vh-12rem)] md:h-[700px] lg:h-[800px] // Responsive height
                          overflow-hidden rounded-md" // Added slight rounding
      >
        {/* Map Container */}
        <div ref={mapRef} className="w-full h-full" aria-label="Interactive Journey Map">
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
          <div className="absolute top-4 right-4 left-auto md:right-20 lg:right-24 z-10
                            bg-white/80 dark:bg-black/80 backdrop-blur-sm p-2 px-3 rounded-md
                            border-2 border-black dark:border-darkBorder shadow-md
                            text-xs sm:text-sm text-black dark:text-white font-medium max-w-[200px] sm:max-w-xs">
             Click markers or timeline items to explore!
          </div>
        </div>

        {/* Mobile Toggle Button for Timeline */}
        {isMobile && !isTimelineOpen && (
          <button
            onClick={toggleTimeline}
            aria-label="Open timeline"
            className="absolute top-4 left-4 z-30 p-3 bg-bg dark:bg-darkBg text-black dark:text-darkText
                                 border-4 border-black dark:border-white rounded-lg
                                 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
                                 hover:shadow-none hover:translate-x-1 hover:translate-y-1
                                 transition-all duration-200"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Zoom Controls */}
        <ZoomControl onZoom={handleZoom} />
      </div>
    </div>
  );
};

export default MapComponent;
