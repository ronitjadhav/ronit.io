'use client';
import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
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
import {Geometry} from "ol/geom";

interface TimelineEntry {
    id: number;
    title: string;
    date: string;
    description: string;
    location: [number, number];
    locationName: string;
    popupTitle: string;
    popupDescription: string;
    icon?: string;
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

const timelineData: TimelineEntry[] = [
    {
        id: 1,
        title: "Early Education in Mumbai",
        date: "2010-2014",
        description: "Started my journey in computer science with a focus on web development and programming fundamentals.",
        location: [72.8777, 19.0760],
        locationName: "Mumbai, India",
        popupTitle: "Mumbai University",
        popupDescription: "Completed Bachelor's in Computer Science with distinction.",
        icon: "🎓"
    },
    {
        id: 2,
        title: "First Tech Role",
        date: "2014-2016",
        description: "Worked as a junior developer at a startup, focusing on frontend development and UI/UX design.",
        location: [77.5946, 12.9716],
        locationName: "Bangalore, India",
        popupTitle: "Tech Startup - Bangalore",
        popupDescription: "Frontend Developer working with React and Node.js",
        icon: "💻"
    },
    {
        id: 3,
        title: "Senior Developer",
        date: "2016-2020",
        description: "Led development teams and architected large-scale applications using modern tech stacks.",
        location: [2.3522, 48.8566],
        locationName: "Paris, France",
        popupTitle: "Tech Lead - Paris",
        popupDescription: "Senior Developer position focusing on system architecture",
        icon: "👨‍💻"
    },
    {
        id: 4,
        title: "Tech Architect",
        date: "2020-Present",
        description: "Currently working as a Technical Architect, designing scalable solutions and mentoring teams.",
        location: [-0.1276, 51.5074],
        locationName: "London, UK",
        popupTitle: "Lead Architect - London",
        popupDescription: "Technical Architect role with focus on cloud infrastructure",
        icon: "🚀"
    }
];

const createSVGMarker = (): string => {
    const svg = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#76fbd9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#76fbd9;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.5)"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <circle cx="24" cy="24" r="20" fill="url(#grad1)" stroke="#333" stroke-width="3"/>
        <circle cx="24" cy="24" r="8" fill="#FFF" stroke="#333" stroke-width="2"/>
      </g>
    </svg>
  `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const TimelineItem: React.FC<TimelineItemProps> = ({ entry, onClick }) => (
    <div onClick={onClick} className="cursor-pointer w-full transition-all duration-300 hover:bg-yellow-100">
        <div className="flex items-center gap-3">
            <span className="text-3xl bg-white p-2 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {entry.icon}
            </span>
            <div className="flex-1">
                <h3 className="font-black text-xl mb-2">{entry.title}</h3>
                <p className="text-sm font-mono font-bold">{entry.date}</p>
            </div>
        </div>
        <p className="mt-3 text-base leading-relaxed">{entry.description}</p>
        <div className="mt-3 flex items-center gap-2 text-sm font-medium">
            <MapPin size={16} className="text-gray-700" />
            <span>{entry.locationName}</span>
        </div>
        <hr className="border-black my-4" />
    </div>
);

const Popup: React.FC<PopupProps> = ({ title, description }) => (
    <div className="relative">
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50
                    bg-white dark:bg-gray-800 border-4 border-black dark:border-white
                    p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                    min-w-[250px] max-w-[350px]">
            <h2 className="font-black text-xl mb-2 border-b-4 border-black dark:border-white pb-2
                       text-black dark:text-white">
                {title}
            </h2>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {description}
            </p>
        </div>
        {/* Pointer triangle */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4
                    bg-white dark:bg-gray-800 border-b-4 border-r-4
                    border-black dark:border-white rotate-45">
        </div>
    </div>
);

const TimelineContainer: React.FC<TimelineContainerProps> = ({ isOpen, onClose, children }) => (
    <div
        className={`
            fixed md:absolute top-0 left-0
            max-h-[100vh] md:h-full w-full sm:w-[420px]
            bg-white/95 backdrop-blur-md
            border-r-4 border-black
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            z-20
            flex flex-col
            overflow-hidden
            ${!isOpen ? 'invisible md:visible' : 'visible'}
        `}
    >
        <div className="flex-none flex items-center justify-between p-4 border-b-4 border-black bg-white">
            <h2 className="font-black text-xl">Journey Timeline</h2>
            <button
                onClick={onClose}
                className="p-2 bg-black text-white hover:bg-gray-800 transition-colors rounded"
            >
                <ChevronLeft size={24} />
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
            {children}
        </div>
    </div>
);


const ZoomControl: React.FC<ZoomControlProps> = ({ onZoom }) => (
    <div className="absolute bottom-4 md:top-4 right-4 flex flex-col gap-2">
        {[
            { label: '+', direction: 'in' as const },
            { label: '−', direction: 'out' as const }
        ].map(({ label, direction }) => (
            <button
                key={direction}
                onClick={() => onZoom(direction)}
                className="bg-bg text-text w-12 h-12 text-2xl font-black
                         border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         hover:shadow-none hover:translate-x-1 hover:translate-y-1
                         transition-all duration-200 dark:bg-darkBg dark:border-white dark:text-white"
            >
                {label}
            </button>
        ))}
    </div>
);

const MapComponent: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<Map | null>(null);
    const [overlay, setOverlay] = useState<Overlay | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(window.innerWidth >= 768);
    const popupRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<string>(createSVGMarker());
    const [isMobile] = useState<boolean>(window.innerWidth < 768);
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const mapboxLightStyle = String(process.env.NEXT_PUBLIC_MAPBOX_LIGHT_STYLE_URL);
    const mapboxDarkStyle = String(process.env.NEXT_PUBLIC_MAPBOX_DARK_STYLE_URL);
    const { theme } = useTheme();

    useEffect(() => {
        if (!mapRef.current) return;

        const popupElement = document.createElement('div');
        popupRef.current = popupElement;
        const popupRoot = createRoot(popupElement);

        const overlayInstance = new Overlay({
            element: popupElement,
            positioning: 'bottom-center',
            offset: [0, -20],
            stopEvent: false
        });

        const mapInstance = new Map({
            target: mapRef.current,
            layers: [
                new MapboxVectorLayer({
                    styleUrl: theme === 'dark' ? mapboxDarkStyle : mapboxLightStyle,
                    accessToken: mapboxToken,
                }),
            ],
            controls: [],
            view: new View({
                center: fromLonLat([0, 0]),
                zoom: 2,
                maxZoom: 18,
                minZoom: 2
            })
        });

        mapInstance.addOverlay(overlayInstance);
        setMap(mapInstance);
        setOverlay(overlayInstance);

        const markerStyle = new Style({
            image: new Icon({
                src: markerRef.current,
                scale: 1
            })
        });

        // Create features with explicit property setting
        const features = timelineData.map(entry => {
            const transformedCoords = fromLonLat(entry.location);
            const feature = new Feature({
                geometry: new Point(transformedCoords)
            });
            // Explicitly set properties on the feature
            feature.setProperties({
                id: entry.id,
                title: entry.title,
                date: entry.date,
                description: entry.description,
                locationName: entry.locationName,
                popupTitle: entry.popupTitle,
                popupDescription: entry.popupDescription,
                icon: entry.icon
            });
            feature.setStyle(markerStyle);
            return feature;
        });

        const vectorSource = new VectorSource({ features });
        const vectorLayer = new VectorLayer({ source: vectorSource });
        mapInstance.addLayer(vectorLayer);

        // Handle hover events
        let currentFeature: Feature | null = null;

        mapInstance.on('pointermove', (event) => {
            const pixel = mapInstance.getEventPixel(event.originalEvent);
            const hit = mapInstance.hasFeatureAtPixel(pixel);
            mapInstance.getTargetElement().style.cursor = hit ? 'pointer' : '';

            if (hit) {
                const feature = mapInstance.forEachFeatureAtPixel(pixel, feature => feature);
                if (feature && feature !== currentFeature) {
                    currentFeature = feature as Feature<Geometry>;
                    const coords = (feature.getGeometry() as Point).getCoordinates();
                    const props = feature.getProperties();

                    // Debug log to verify properties
                    console.log('Hover properties:', props);

                    // Only render popup if we have the required properties
                    if (props.popupTitle && props.popupDescription) {
                        popupRoot.render(
                            <Popup
                                title={props.popupTitle}
                                description={props.popupDescription}
                            />
                        );
                        overlayInstance.setPosition(coords);
                    }
                }
            } else {
                if (!activeIndex) {  // Only hide if no point is actively selected
                    currentFeature = null;
                    overlayInstance.setPosition(undefined);
                }
            }
        });

        // Handle click events
        mapInstance.on('click', (event) => {
            const pixel = mapInstance.getEventPixel(event.originalEvent);
            const feature = mapInstance.forEachFeatureAtPixel(pixel, feature => feature);

            if (feature) {
                const props = feature.getProperties();
                const transformedCoords = (feature.getGeometry() as Point).getCoordinates();

                // Find the index in timelineData
                const index = timelineData.findIndex(item => item.id === props.id);
                setActiveIndex(index);

                popupRoot.render(
                    <Popup
                        title={props.popupTitle}
                        description={props.popupDescription}
                    />
                );
                overlayInstance.setPosition(transformedCoords);

                mapInstance.getView().animate({
                    center: transformedCoords,
                    zoom: 12,
                    duration: 1000
                });
            }
        });

        return () => {
            popupRoot.unmount();
            mapInstance.setTarget(undefined);
        };
    }, [theme, mapboxToken, mapboxLightStyle, mapboxDarkStyle, activeIndex]);

    useEffect(() => {
        if (!map) return;

        const layers = map.getLayers();
        const baseLayer = layers.getArray()[0];

        if (baseLayer instanceof MapboxVectorLayer) {
            layers.setAt(0, new MapboxVectorLayer({
                styleUrl: theme === 'dark' ? mapboxDarkStyle : mapboxLightStyle,
                accessToken: mapboxToken,
            }));
        }
    }, [theme, map, mapboxToken, mapboxLightStyle, mapboxDarkStyle]);

    const handleTimelineClick = (index: number) => {
        if (!map || !overlay || !popupRef.current) return;

        setActiveIndex(index);
        const entry = timelineData[index];
        const transformedCoords = fromLonLat(entry.location);

        // Update all features to use normal marker style
        const vectorLayer = map.getLayers().getArray()
            .find(layer => layer instanceof VectorLayer) as VectorLayer<VectorSource>;

        if (vectorLayer) {
            const source = vectorLayer.getSource();
            if (source) {
                source.getFeatures().forEach(feature => {
                    feature.setStyle(new Style({
                        image: new Icon({
                            src: markerRef.current,
                            scale: 1
                        })
                    }));
                });
            }
        }

        map.getView().animate({
            center: transformedCoords,
            zoom: 12,
            duration: 1000
        });

        const root = createRoot(popupRef.current);
        root.render(<Popup title={entry.popupTitle} description={entry.popupDescription} />);
        overlay.setPosition(transformedCoords);
    };

    const handleZoom = (direction: 'in' | 'out') => {
        if (!map) return;
        const view = map.getView();
        const currentZoom = view.getZoom() || 0;
        view.animate({
            zoom: direction === 'in' ? Math.min(currentZoom + 1, 18) : Math.max(currentZoom - 1, 2),
            duration: 250
        });
    };

    const toggleTimeline = () => {
        setIsTimelineOpen(prev => !prev);
    };

    return (
        <div className="relative border-4 border-black dark:border-white bg-white dark:bg-gray-900
                      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]
                      h-[100dvh] md:h-[800px] overflow-hidden">
            {/* Title Section */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
                <h1 className="text-xl md:text-2xl font-bold bg-white dark:bg-gray-900
                             border-2 border-black dark:border-white py-2 px-4 rounded-lg
                             shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                             whitespace-nowrap text-black dark:text-white">
                    My Journey Through Time and Space 🗺️
                </h1>
            </div>

            {/* Map container */}
            <div ref={mapRef} className="w-full h-full relative">
                {/* Timeline Container */}
                <TimelineContainer
                    isOpen={isTimelineOpen}
                    onClose={toggleTimeline}
                >
                    <div className="space-y-4">
                        {timelineData.map((entry, index) => (
                            <TimelineItem
                                key={entry.id}
                                entry={entry}
                                isActive={index === activeIndex}
                                onClick={() => {
                                    handleTimelineClick(index);
                                    if (isMobile) {
                                        setIsTimelineOpen(false);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </TimelineContainer>
            </div>

            {/* Toggle Timeline Button */}
            {(isMobile || !isTimelineOpen) && (
                <button
                    onClick={toggleTimeline}
                    className="absolute top-4 left-4 z-30 p-3 bg-black dark:bg-white text-white dark:text-black
                             border-4 border-black dark:border-white rounded-lg
                             shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                             hover:shadow-none hover:translate-x-1 hover:translate-y-1
                             transition-all duration-200"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Zoom Controls */}
            <ZoomControl onZoom={handleZoom} />
        </div>
    );
};

export default MapComponent;