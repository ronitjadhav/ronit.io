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
        title: "Software Engineer @ Camptocamp",
        date: "Oct 2023 - Present",
        description: "Kicked off my journey into the open-source geospatial realm at Camptocamp, working with QGIS, Geonetwork-UI, developing custom GIS dashboards, and contributing to QGIS plugins. Diving into Docker, web GIS, and everything open-source!",
        location: [13.427691769504001, 52.49983698027357],
        locationName: "Berlin, Germany (Hybrid)",
        popupTitle: "Camptocamp",
        popupDescription: "Became part of the open-source geospatial world, building geospatial solutions and exploring the power of QGIS.",
        icon: "🌍"
    },
    {
        id: 2,
        title: "Software Engineering for Industrial Applications @ Hochschule Hof",
        date: "2022 - 2024",
        description: "Diving deep into advanced programming, software engineering, and IoT, while focusing on Industry 4.0. Gaining expertise in applied cloud computing, non-relational databases, and spatial technologies to bridge software and the real world.",
        location: [11.8954, 50.3217],
        locationName: "Hof, Germany",
        popupTitle: "Hochschule Hof",
        popupDescription: "Expanding my skillset in software engineering, focusing on Industry 4.0, cloud computing, and real-world applications.",
        icon: "💡"
    },
    {
        id: 3,
        title: "GIS Developer @ Gistec",
        date: "2019 - 2022",
        description: "Joined Gistec to create custom geoprocessing tools, work with ArcGIS Enterprise, and develop web mapping apps with Esri tech. Basically, a geospatial problem-solver.",
        location: [78.4867, 17.3850],
        locationName: "Hyderabad, India",
        popupTitle: "Gistec",
        popupDescription: "Built mapping tools and apps while mastering Python (ArcPy), ArcGIS Server, and the Esri stack.",
        icon: "🌐"
    },
    {
        id: 4,
        title: "Student Intern @ University of Cologne",
        date: "2019 - 2019",
        description: "Interned at the University of Cologne, applying GIS and spatial analysis to hydrological modeling with ArcSWAT for the Mula-Mutha river. Automated tasks using Python and supported geospatial research for water resources.",
        location: [6.9603, 50.9375],
        locationName: "Cologne, Germany",
        popupTitle: "University of Cologne",
        popupDescription: "Leveraged GIS and spatial data to contribute to water flux modeling and the SWAT tool's application in India.",
        icon: "🌍"
    },
    {
        id: 5,
        title: "M.Sc. in Geoinformatics: The Spatial Awakening",
        date: "2017 - 2019",
        description: "Learned to wield GIS, remote sensing, and code like a spatial wizard. Maps and code—what could go wrong?",
        location: [72.8777, 19.0760],
        locationName: "Pune, India",
        popupTitle: "BVIEER",
        popupDescription: "Where I discovered that geography is more than just knowing where places are.",
        icon: "🗺️"
    },
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
    <div onClick={onClick} className="cursor-pointer w-full transition-all duration-300 hover:bg-yellow-100 dark:hover:bg-gray-500">
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
                    bg-white dark:bg-darkBg border-4 border-black dark:border-darkBorder
                    p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    dark:shadow-darkBorder
                    min-w-[250px] max-w-[350px]">
            <h2 className="font-black text-xl mb-2 border-b-4 border-black dark:border-darkBorder pb-2
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
                    border-black dark:border-darkBorder rotate-45">
        </div>
    </div>
);

const TimelineContainer: React.FC<TimelineContainerProps> = ({ isOpen, onClose, children }) => (
    <div
        className={`
        absolute top-0 left-0 
        h-full w-full sm:w-[420px]
        bg-white/95 dark:bg-darkBg backdrop-blur-md
        border-r-4 border-black dark:border-darkBorder
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        z-20
        flex flex-col
        overflow-hidden
        ${!isOpen ? 'invisible md:visible' : 'visible'}
    `}
    >
        <div
            className="flex-none flex items-center justify-between p-4 border-b-4 border-black dark:border-darkBorder bg-white dark:bg-darkBg">
            <h2 className="font-black text-xl text-black dark:text-white">Journey Timeline</h2>
            <button
                onClick={onClose}
                className="p-2 bg-black dark:bg-darkBg text-white dark:text-darkText hover:bg-gray-800 dark:hover:bg-black transition-colors rounded"
            >
                <ChevronLeft size={24}/>
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
            {children}
        </div>
    </div>
);


const ZoomControl: React.FC<ZoomControlProps> = ({onZoom}) => (
    <div className="absolute bottom-4 md:top-4 right-4 flex flex-col gap-2">
        {[
            {label: '+', direction: 'in' as const},
            {label: '−', direction: 'out' as const}
        ].map(({label, direction}) => (
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
    const [activeIndex, setActiveIndex] = useState<number>(-1); // Set initial activeIndex to -1
    const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(typeof window !== 'undefined' && window.innerWidth >= 768);
    const popupRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<string>(createSVGMarker());
    const [isMobile] = useState<boolean>(typeof window !== 'undefined' && window.innerWidth < 768);
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const mapboxLightStyle = String(process.env.NEXT_PUBLIC_MAPBOX_LIGHT_STYLE_URL);
    const mapboxDarkStyle = String(process.env.NEXT_PUBLIC_MAPBOX_DARK_STYLE_URL);
    const { theme } = useTheme();

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current) return;

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
                center: fromLonLat([0, 38]),
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

        const features = timelineData.map(entry => {
            const transformedCoords = fromLonLat(entry.location);
            const feature = new Feature({
                geometry: new Point(transformedCoords)
            });
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
                if (activeIndex === -1) {
                    currentFeature = null;
                    overlayInstance.setPosition(undefined);
                }
            }
        });

        mapInstance.on('click', (event) => {
            const pixel = mapInstance.getEventPixel(event.originalEvent);
            const feature = mapInstance.forEachFeatureAtPixel(pixel, feature => feature);

            if (feature) {
                const props = feature.getProperties();
                const transformedCoords = (feature.getGeometry() as Point).getCoordinates();

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
    }, [theme, mapboxToken, mapboxLightStyle, mapboxDarkStyle]);

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
        <div className="flex flex-col gap-8 p-8 dark:bg-darkBg">
            <div className="w-full bg-bg border-4 border-black dark:bg-darkBg
                          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                          transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
                          transition-all duration-300 p-6">
                <h1 className="text-4xl md:text-5xl font-black text-black text-center dark:text-darkText">
                    My Journey Through Time and Space 🗺️
                </h1>
            </div>

            <div className="relative border-4 border-black dark:darkBorder bg-white dark:bg-darkBg
                          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-darkBorder
                          h-[100dvh] md:h-[800px] overflow-hidden">
                <div ref={mapRef} className="w-full h-full relative">
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

                {(isMobile || !isTimelineOpen) && (
                    <button
                        onClick={toggleTimeline}
                        className="absolute top-4 left-4 z-30 p-3 bg-bg dark:bg-black text-black dark:text-white
                                 border-4 border-black rounded-lg dark:border-white
                                 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]]
                                 hover:shadow-none hover:translate-x-1 hover:translate-y-1
                                 transition-all duration-200"
                    >
                        <Menu size={24}/>
                    </button>
                )}

                <ZoomControl onZoom={handleZoom}/>
            </div>
        </div>
    );
};

export default MapComponent;