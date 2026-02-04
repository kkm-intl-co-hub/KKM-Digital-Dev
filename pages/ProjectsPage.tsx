import * as React from 'react';
import { PROJECTS } from '../constants';
import type { Project, MapMarker } from '../types';
import { Page } from '../types';
import { useLanguage } from '../LanguageContext';
import PageHeader from '../components/PageHeader';
import InteractiveMap from '../components/InteractiveMap';
import ProjectMetricsChart from '../components/ProjectMetricsChart';
import ImageGallery from '../components/ImageGallery';
import Accordion from '../components/Accordion';
import { motion, AnimatePresence } from 'framer-motion';
import type { TranslationKey } from '../translations';

interface ProjectsPageProps {
    setPage: (page: Page) => void;
}

const getSnippet = (htmlContent: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    return textContent.split(' ').slice(0, 40).join(' ') + '...';
};

const getYouTubeId = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const ProjectsPage: React.FC<ProjectsPageProps> = ({ setPage }) => {
    const [activeProjectForMap, setActiveProjectForMap] = React.useState<Project | null>(null);
    const [hoveredProjectName, setHoveredProjectName] = React.useState<string | null>(null);
    const [mapHoveredProjectName, setMapHoveredProjectName] = React.useState<string | null>(null);
    const [isDetailsExpanded, setIsDetailsExpanded] = React.useState(false);
    const [playVideo, setPlayVideo] = React.useState(false);
    
    const { t } = useLanguage();
    const detailsPanelRef = React.useRef<HTMLDivElement>(null);
    const listContainerRef = React.useRef<HTMLDivElement>(null);
    const itemRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
    
    const [activeTag, setActiveTag] = React.useState<string>('All');
    const allTags = React.useMemo(() => {
        const tags = new Set<string>();
        PROJECTS.forEach(p => p.tags.forEach(tag => tags.add(tag)));
        return ['All', ...Array.from(tags).sort()];
    }, []);
    
    const filteredProjects = React.useMemo(() => {
        if (activeTag === 'All') {
            return PROJECTS;
        }
        return PROJECTS.filter(p => p.tags.includes(activeTag));
    }, [activeTag]);

    React.useEffect(() => {
        if (filteredProjects.length > 0) {
            if (!activeProjectForMap || !filteredProjects.some(p => p.name === activeProjectForMap.name)) {
                setActiveProjectForMap(filteredProjects[0]);
            }
        } else {
            setActiveProjectForMap(null);
        }
    }, [filteredProjects]);

    React.useEffect(() => {
        // Collapse details when switching projects
        setIsDetailsExpanded(false);
        setPlayVideo(false);

        if (activeProjectForMap) {
            if (detailsPanelRef.current && window.innerWidth < 1024) {
                detailsPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const itemElement = itemRefs.current[activeProjectForMap.name];
            itemElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [activeProjectForMap]);

    const handleViewDetails = () => {
        setIsDetailsExpanded(true);
        // Ensure the details are visible
        setTimeout(() => {
             detailsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleProjectSelect = React.useCallback((projectName: string) => {
        const projectToShow = PROJECTS.find(p => t(p.name as TranslationKey) === projectName || p.name === projectName);
        if (projectToShow) {
            setActiveProjectForMap(projectToShow);
        }
    }, [t]);
    
    const handleMarkerHover = React.useCallback((projectName: string | null) => {
        setMapHoveredProjectName(projectName);
    }, []);

    const projectMarkers = React.useMemo((): MapMarker[] => PROJECTS.map((p) => ({
        name: p.name, 
        description: p.description,
        coordinates: p.coordinates,
        category: p.tags[0],
        imageUrl: p.image,
        type: 'project',
    })), []);

    const translatedMarkers = React.useMemo(() => {
        return projectMarkers.map(m => ({
            ...m,
            name: t(m.name as TranslationKey),
            description: t(m.description as TranslationKey)
        }));
    }, [projectMarkers, t]);
    
    const activeMarker = React.useMemo((): MapMarker | null => {
        if (!activeProjectForMap) return null;
        return {
            name: t(activeProjectForMap.name as TranslationKey),
            description: t(activeProjectForMap.description as TranslationKey),
            coordinates: activeProjectForMap.coordinates,
            category: activeProjectForMap.tags[0],
            imageUrl: activeProjectForMap.image,
            type: 'project',
        };
    }, [activeProjectForMap, t]);

    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    // Helper for video
    const videoId = activeProjectForMap?.videoUrl ? getYouTubeId(activeProjectForMap.videoUrl) : null;

    return (
        <div>
            <PageHeader title={t(Page.Projects)} subtitle={t('ProjectsPageSubtitle')}/>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Panel: Details View */}
                    <div className="lg:col-span-5" ref={detailsPanelRef}>
                        <motion.div 
                            key={activeProjectForMap ? activeProjectForMap.name : 'empty'}
                            className="sticky top-24"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-display font-bold text-primary-dark dark:text-secondary mb-4">{t('ProjectDetails')}</h2>
                            {activeProjectForMap ? (
                                <motion.div 
                                    className="bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-none overflow-hidden"
                                    whileHover={{ scale: 1.01, y: -2, boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08)" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {!isDetailsExpanded && (
                                        <div className="relative group overflow-hidden">
                                            <img src={activeProjectForMap.image} alt={t(activeProjectForMap.name as TranslationKey)} loading="lazy" className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                                            <button 
                                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 cursor-pointer w-full h-full border-0" 
                                                onClick={handleViewDetails}
                                                aria-label={t('ViewCaseStudy')}
                                            >
                                                <div className="text-center text-white p-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                                    <p className="font-bold mt-2">{t('ViewCaseStudy')}</p>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                    
                                    {isDetailsExpanded && (
                                        <ImageGallery images={activeProjectForMap.gallery} altText={t(activeProjectForMap.name as TranslationKey)} />
                                    )}

                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {activeProjectForMap.tags.map(tag => (
                                                <span key={tag} className="text-xs font-semibold bg-accent-yellow/20 text-accent-dark dark:text-accent-yellow px-2 py-1 rounded-full">{t(tag as TranslationKey)}</span>
                                            ))}
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-primary-dark dark:text-white">{t(activeProjectForMap.name as TranslationKey)}</h3>
                                        
                                        {!isDetailsExpanded && (
                                            <>
                                                <p className="text-sm text-text-light dark:text-slate-300 mt-2 mb-6">{getSnippet(t(activeProjectForMap.detailedContent as TranslationKey))}</p>
                                                <button onClick={handleViewDetails} className="inline-block px-6 py-2 font-semibold text-white bg-primary rounded-full hover:bg-secondary transition-colors duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary dark:focus:ring-offset-slate-800">
                                                    {t('ViewCaseStudy')}
                                                </button>
                                            </>
                                        )}
                                        
                                        <AnimatePresence>
                                            {isDetailsExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 space-y-6">
                                                         <div 
                                                            className="prose dark:prose-invert max-w-none text-text-light dark:text-slate-300 text-sm" 
                                                            dangerouslySetInnerHTML={{ __html: t(activeProjectForMap.detailedContent as TranslationKey) }}
                                                        />
                                                        
                                                        {activeProjectForMap.metrics && (
                                                            <div className="border-t dark:border-slate-700 pt-4">
                                                                <h4 className="font-bold text-text-dark dark:text-slate-200 mb-2">Project Metrics</h4>
                                                                <ProjectMetricsChart metrics={activeProjectForMap.metrics} />
                                                            </div>
                                                        )}

                                                        {activeProjectForMap.videoUrl && videoId && (
                                                            <div className="border-t dark:border-slate-700 pt-4">
                                                                 <h4 className="font-bold text-text-dark dark:text-slate-200 mb-2">Video Tour</h4>
                                                                {playVideo ? (
                                                                    <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                                                                        <iframe
                                                                            width="100%"
                                                                            height="100%"
                                                                            src={`${activeProjectForMap.videoUrl}?autoplay=1`}
                                                                            title={`${t(activeProjectForMap.name as TranslationKey)} Video`}
                                                                            frameBorder="0"
                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                            allowFullScreen
                                                                        ></iframe>
                                                                    </div>
                                                                ) : (
                                                                    <button 
                                                                        className="aspect-video rounded-lg overflow-hidden shadow-lg relative cursor-pointer group w-full border-0 p-0"
                                                                        onClick={() => setPlayVideo(true)}
                                                                        aria-label="Play project video"
                                                                    >
                                                                        <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="Video Thumbnail" loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/50">
                                                                            <svg className="h-16 w-16 text-white/80 group-hover:text-white transition-all group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                        
                                                        <div className="text-center pt-4">
                                                            <button 
                                                                onClick={() => setIsDetailsExpanded(false)}
                                                                className="text-sm text-text-light dark:text-slate-400 hover:text-primary dark:hover:text-secondary underline"
                                                            >
                                                                Collapse Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 text-center h-full flex flex-col justify-center items-center min-h-[400px]">
                                    <p className="text-text-light dark:text-slate-400">Select a project from the list or map to see details.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Panel: Controls & Map */}
                    <div className="lg:col-span-7">
                        <div className="mb-6">
                            <h2 className="text-2xl font-display font-bold text-primary-dark dark:text-secondary mb-4">{t('OurKeyInitiatives')}</h2>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setActiveTag(tag)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${activeTag === tag ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-700 text-text-dark dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                                    >
                                        {tag === 'All' ? t('AllDepartments') : t(tag as TranslationKey)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <motion.div 
                            ref={listContainerRef} 
                            className="max-h-80 overflow-y-auto pr-2 mb-6 p-2"
                            variants={listVariants}
                            initial="hidden"
                            animate="show"
                            key={activeTag} // Rerender animation on tag change
                        >
                            {filteredProjects.map((project) => {
                                const isActive = activeProjectForMap?.name === project.name;
                                const isHoveredByMap = mapHoveredProjectName === t(project.name as TranslationKey);
                                return (
                                    <motion.button 
                                        key={project.name} 
                                        variants={listItemVariants}
                                        whileHover={{ scale: 1.02, y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        ref={el => { itemRefs.current[project.name] = el; }}
                                        className={`w-full text-left p-4 mb-3 rounded-xl transition-all duration-200 border border-transparent shadow-sm hover:shadow-lg ${
                                            isActive 
                                                ? 'bg-white dark:bg-slate-800 border-primary ring-2 ring-primary/20 shadow-md' 
                                                : isHoveredByMap 
                                                    ? 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-500 scale-[1.02] shadow-md' 
                                                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'
                                        }`}
                                        onClick={() => setActiveProjectForMap(project)}
                                        onMouseEnter={() => setHoveredProjectName(t(project.name as TranslationKey))}
                                        onMouseLeave={() => setHoveredProjectName(null)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className={`text-md font-display font-bold ${isActive ? 'text-primary' : 'text-text-dark dark:text-slate-200'}`}>
                                                {t(project.name as TranslationKey)}
                                            </h3>
                                            {isActive && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                                        </div>
                                        <p className="text-xs text-text-light dark:text-slate-400 mt-1 line-clamp-1">{t(project.description as TranslationKey)}</p>
                                    </motion.button>
                                );
                            })}
                        </motion.div>

                        <h2 className="text-2xl font-display font-bold text-primary-dark dark:text-secondary mb-4">{t('OurGlobalFootprint')}</h2>
                        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg bg-gray-200">
                            <InteractiveMap 
                                projects={translatedMarkers} 
                                activeProject={activeMarker} 
                                onMarkerSelect={handleProjectSelect} 
                                hoveredProjectName={hoveredProjectName} 
                                mapHoveredProjectName={mapHoveredProjectName} 
                                onMarkerHover={handleMarkerHover} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;