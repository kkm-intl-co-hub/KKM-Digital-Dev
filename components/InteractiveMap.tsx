
import * as React from 'react';
import type { MapMarker } from '../types';
import { useLanguage } from '../LanguageContext';

declare global {
    interface Window {
        google: any;
        __googleMapsApiCallback: (() => void) | undefined;
        gm_authFailure: (() => void) | undefined;
    }
}

// Icon configurations
const ICON_COLORS: { [key: string]: string } = {
    'Head Office': '#001A33',
    'Branch Office': '#002D56',
    'Oil & Gas Infrastructure': '#FFC107',
    'Power Generation': '#0A92EF',
    'Upstream Services': '#89CFF0',
    'Industrial Solutions': '#5a646a',
    'Default': '#F85959',
};

let mapsApiPromise: Promise<any> | null = null;
const SCRIPT_ID = 'google-maps-api-script';
const MAP_CALLBACK_NAME = '__googleMapsApiCallback';

interface MapErrorBoundaryProps {
    children?: React.ReactNode;
    fallback: React.ReactNode;
}

interface MapErrorBoundaryState {
    hasError: boolean;
}

// Error Boundary Component for Map
class MapErrorBoundary extends React.Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
    state: MapErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: any): MapErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("Map component crashed:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (this as any).props.fallback;
        }
        return (this as any).props.children;
    }
}

const loadMapsApi = () => {
    if (mapsApiPromise) {
        return mapsApiPromise;
    }

    mapsApiPromise = new Promise((resolve, reject) => {
        const resolveLibraries = () => {
             if (!window.google || !window.google.maps) {
                 reject(new Error("Google Maps API not found"));
                 return;
             }
             
             Promise.all([
                window.google.maps.importLibrary('maps'),
                window.google.maps.importLibrary('marker'),
                window.google.maps.importLibrary('core'), 
            ]).then(([mapsLib, markerLib, coreLib]) => {
                const api = {
                    Map: mapsLib.Map,
                    InfoWindow: mapsLib.InfoWindow,
                    AdvancedMarkerElement: markerLib.AdvancedMarkerElement,
                    PinElement: markerLib.PinElement,
                    ControlPosition: coreLib.ControlPosition,
                };
                
                if (!api.Map) {
                    reject(new Error("Map class missing from Google Maps library"));
                    return;
                }
                
                resolve(api);
            }).catch(error => {
                console.error("Failed to import Google Maps libraries:", error);
                reject(error);
            });
        };

        if (window.google && window.google.maps) {
            resolveLibraries();
            return;
        }

        const cleanup = () => {
            // @ts-ignore
            delete window.__googleMapsApiCallback;
        };

        window.__googleMapsApiCallback = () => {
            cleanup();
            resolveLibraries();
        };
        
        // 2. Sanitize and Validate API Key
        let apiKey = '';
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            apiKey = process.env.API_KEY;
        }

        apiKey = apiKey ? apiKey.replace(/['";]/g, '').trim() : '';
        
        // Heuristic check: Google Maps keys are typically ~39 chars.
        if (!apiKey || apiKey.length < 20 || apiKey === 'TODO' || apiKey.includes('YOUR_API_KEY')) {
            const error = new Error("Invalid or missing Google Maps API Key.");
            cleanup();
            reject(error);
            return;
        }

        if (document.getElementById(SCRIPT_ID)) {
            if (window.google && window.google.maps) {
                resolveLibraries();
            }
            return;
        }

        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&callback=${MAP_CALLBACK_NAME}&loading=async`;
        script.async = true;
        script.defer = true;
        script.onerror = (e) => {
            script.remove();
            cleanup();
            const error = new Error(`Failed to load Google Maps script.`);
            console.error(error);
            mapsApiPromise = null;
            reject(error);
        };
        
        document.head.appendChild(script);
    });

    return mapsApiPromise;
};

interface InteractiveMapProps {
    projects: MapMarker[];
    activeProject: MapMarker | null;
    hoveredProjectName?: string | null;
    mapHoveredProjectName?: string | null;
    onMarkerSelect?: (projectName: string) => void;
    onMarkerHover?: (projectName: string | null) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ projects, activeProject, hoveredProjectName, mapHoveredProjectName, onMarkerSelect, onMarkerHover }) => {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const [mapIsReady, setMapIsReady] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState<string | null>(null);
    
    const mapApi = React.useRef<any>(null);
    const mapInstance = React.useRef<any>(null);
    const markers = React.useRef<Map<string, any>>(new Map());
    const userLocationMarker = React.useRef<any>(null);
    
    const locationButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const locationClickListenerRef = React.useRef<(() => void) | null>(null);
    
    const { t } = useLanguage();

    // Hook to capture auth failure even after the script loads successfully
    React.useEffect(() => {
        const originalAuthFailure = window.gm_authFailure;
        
        window.gm_authFailure = () => {
            console.error("Google Maps authentication failed.");
            setLoadError("Map Service Unavailable"); // More user friendly
            setIsLoading(false);
            if (originalAuthFailure) originalAuthFailure();
        };

        return () => {
            window.gm_authFailure = originalAuthFailure;
        };
    }, []);

    React.useEffect(() => {
        const mapElement = mapRef.current;
        if (!mapElement) return;

        let isMounted = true;
        setIsLoading(true);
        setLoadError(null);

        loadMapsApi().then(api => {
            if (!isMounted) return;
            if (!mapElement) return;

            mapApi.current = api;
            
            const { Map, ControlPosition } = mapApi.current;
            
            try {
                mapInstance.current = new Map(mapElement, {
                    center: { lat: 32.4279, lng: 53.6880 },
                    zoom: 5,
                    mapId: 'KKM_MAP_ID', // Requires Map ID in Google Cloud Console
                    disableDefaultUI: true,
                    zoomControl: true,
                });
                
                // Custom Location Button
                const locationButton = document.createElement("button");
                locationButtonRef.current = locationButton; 
                locationButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#333"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7-7z"/></svg>`;
                locationButton.title = "Center on my location";
                Object.assign(locationButton.style, { backgroundColor: '#fff', border: 'none', borderRadius: '3px', boxShadow: '0 2px 6px rgba(0,0,0,.3)', cursor: 'pointer', margin: '10px', padding: '8px' });
                
                if(ControlPosition && mapInstance.current.controls) {
                    const pos = ControlPosition.RIGHT_BOTTOM; 
                    if (mapInstance.current.controls[pos]) {
                        mapInstance.current.controls[pos].push(locationButton);
                    }
                }
                
                const locationClickListener = () => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(pos => {
                            const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                            if (!userLocationMarker.current && mapApi.current) {
                                const { PinElement, AdvancedMarkerElement } = mapApi.current;
                                if (PinElement && AdvancedMarkerElement) {
                                    const userPin = new PinElement({ background: '#4285F4', borderColor: '#ffffff', glyph: '', scale: 0.8 });
                                    userLocationMarker.current = new AdvancedMarkerElement({ content: userPin.element, map: mapInstance.current });
                                }
                            }
                            if (userLocationMarker.current) userLocationMarker.current.position = userPos;
                            mapInstance.current.setCenter(userPos);
                            mapInstance.current.setZoom(12);
                        }, () => {
                            console.warn("Geolocation service failed.");
                        });
                    } else {
                        console.warn("Browser doesn't support geolocation.");
                    }
                };
                locationClickListenerRef.current = locationClickListener;
                locationButton.addEventListener("click", locationClickListener);
                
                setMapIsReady(true);
                setIsLoading(false);
            } catch (initError) {
                console.error("Map initialization failed", initError);
                setLoadError(t('MapRenderError'));
                setIsLoading(false);
            }
        }).catch(err => {
             if (!isMounted) return;
             console.error("Error loading Maps API:", err);
             // Check if message relates to authorization to show user-friendly error
             const isAuthError = err.message && (err.message.toLowerCase().includes("authentication") || err.message.toLowerCase().includes("api key") || err.message.includes("InvalidKeyMapError"));
             // Also treat missing key explicitly as a service unavailable error to show the fallback UI
             const isMissingKey = err.message && err.message.includes("Invalid or missing Google Maps API Key");
             
             setLoadError((isAuthError || isMissingKey) ? "Map Service Unavailable" : t('MapLoadError'));
             setIsLoading(false);
        });

        return () => {
            isMounted = false;
            if (locationButtonRef.current && locationClickListenerRef.current) {
                locationButtonRef.current.removeEventListener("click", locationClickListenerRef.current);
            }
            if (mapInstance.current) {
                markers.current.forEach(marker => marker.map = null);
                markers.current.clear();
                if (userLocationMarker.current) userLocationMarker.current.map = null;
            }
        };
    }, [t]);

    React.useEffect(() => {
        if (!mapIsReady || !mapInstance.current || !mapApi.current) return;
        
        const { AdvancedMarkerElement, PinElement } = mapApi.current;
        const currentMarkers = markers.current;
        
        const projectNames = new Set(projects.map(p => p.name));
        currentMarkers.forEach((marker, name) => {
            if (!projectNames.has(name)) {
                marker.map = null;
                currentMarkers.delete(name);
            }
        });

        projects.forEach(project => {
            let marker = currentMarkers.get(project.name);
            const color = ICON_COLORS[project.category || 'Default'] || ICON_COLORS['Default'];
            
            if (!marker) {
                try {
                    const pin = new PinElement({
                        background: color,
                        borderColor: '#ffffff',
                        glyphColor: '#ffffff',
                        scale: 1,
                    });

                    const markerContent = document.createElement('div');
                    markerContent.appendChild(pin.element);
                    markerContent.title = project.name;

                    marker = new AdvancedMarkerElement({
                        map: mapInstance.current,
                        position: project.coordinates,
                        title: project.name,
                        content: markerContent,
                    });
                    
                    marker.addListener('click', () => {
                        if (onMarkerSelect) onMarkerSelect(project.name);
                    });
                    
                    marker.addListener('pointerenter', () => {
                        if (onMarkerHover) onMarkerHover(project.name);
                        pin.scale = 1.2;
                    });
                    
                    marker.addListener('pointerleave', () => {
                        if (onMarkerHover) onMarkerHover(null);
                        pin.scale = 1;
                    });

                    currentMarkers.set(project.name, marker);
                } catch (markerError) {
                    console.error("Error creating marker", markerError);
                }
            } else {
                marker.position = project.coordinates;
            }
        });
    }, [mapIsReady, projects, onMarkerSelect, onMarkerHover]);

    React.useEffect(() => {
        if (!mapIsReady || !mapInstance.current) return;
        if (activeProject) {
            mapInstance.current.panTo(activeProject.coordinates);
            mapInstance.current.setZoom(10);
        }
    }, [mapIsReady, activeProject]);

    return (
        <div className="w-full h-full relative bg-gray-200 dark:bg-slate-700 overflow-hidden rounded-lg">
            <MapErrorBoundary fallback={
                <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-slate-800 text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-text-light dark:text-slate-300 font-semibold">{t('MapRenderError')}</p>
                </div>
            }>
                <div ref={mapRef} className="w-full h-full" />
                
                {isLoading && !loadError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/90 dark:bg-slate-800/90 z-10 backdrop-blur-sm transition-opacity duration-300">
                        <svg className="animate-spin h-10 w-10 text-primary dark:text-secondary mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div className="text-primary-dark dark:text-secondary font-bold text-sm tracking-wider uppercase">{t('LoadingMap')}</div>
                    </div>
                )}
                
                {loadError && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-800 z-20 overflow-hidden">
                        {/* Static Map Placeholder Background */}
                        <img 
                            src="https://picsum.photos/seed/worldmap/800/600" 
                            alt="Map Placeholder" 
                            className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-10 blur-[2px]"
                        />
                        <div className="relative z-30 p-8 text-center max-w-sm mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.523-1.16a.5.5 0 01.88.397V7.5a.5.5 0 01-.5.5h-2a.5.5 0 01-.397-.88l1.16-.523zM10.5 13.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" />
                            </svg>
                            <h3 className="text-lg font-bold text-text-dark dark:text-white mb-2">{loadError}</h3>
                            <p className="text-sm text-text-light dark:text-slate-300">
                                Interactive map features are currently unavailable.
                            </p>
                        </div>
                    </div>
                )}
            </MapErrorBoundary>
        </div>
    );
};

export default InteractiveMap;
