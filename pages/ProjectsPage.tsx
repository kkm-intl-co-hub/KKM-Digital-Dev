import * as React from 'react';
import { PROJECTS } from '../constants';
import type { Project, MapMarker } from '../types';
import { Page } from '../types';
import { useLanguage } from '../LanguageContext';
import PageHeader from '../components/PageHeader';
import InteractiveMap from '../components/InteractiveMap';
import { motion, AnimatePresence } from 'framer-motion';
import type { TranslationKey } from '../translations';

// Lazy load the modal
const ProjectDetailModal = React.lazy(() => import('./ProjectDetailModal'));

interface ProjectsPageProps {
    setPage: (page: Page) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ setPage }) => {
    const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
    const [hoveredProjectName, setHoveredProjectName] = React.useState<string | null>(null);
    const [mapHoveredProjectName, setMapHoveredProjectName] = React.useState<string | null>(null);
    const [activeTag, setActiveTag] = React.useState<string>('All');
    
    const { t } = useLanguage();
    const itemRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
    
    // Filter Logic
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

    // Handlers
    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
    };

    const handleMarkerSelect = React.useCallback((projectName: string) => {
        // Find project by translated name (from map) or raw name
        const projectToShow = PROJECTS.find(p => t(p.name as TranslationKey) === projectName || p.name === projectName);
        if (projectToShow) {
            setSelectedProject(projectToShow);
        }
    }, [t]);
    
    const handleMarkerHover = React.useCallback((projectName: string | null) => {
        setMapHoveredProjectName(projectName);
    }, []);

    const handleCloseModal = () => {
        setSelectedProject(null);
    };

    // Map Data Preparation
    const projectMarkers = React.useMemo((): MapMarker[] => filteredProjects.map((p) => ({
        name: t(p.name as TranslationKey), 
        description: t(p.description as TranslationKey),
        coordinates: p.coordinates,
        category: p.tags[0],
        imageUrl: p.image,
        type: 'project',
    })), [filteredProjects, t]);

    // Animations
    const listContainerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div>
            <PageHeader title={t(Page.Projects)} subtitle={t('ProjectsPageSubtitle')}/>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-12">
                
                {/* Filters */}
                <div className="mb-8">
                    <h2 className="text-xl font-display font-bold text-primary-dark dark:text-secondary mb-4">{t('OurKeyInitiatives')}</h2>
                    <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${activeTag === tag ? 'bg-primary text-white shadow-md transform scale-105' : 'bg-gray-100 dark:bg-slate-700 text-text-dark dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                            >
                                {tag === 'All' ? t('AllDepartments') : t(tag as TranslationKey)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List View */}
                    <div className="lg:col-span-1 h-[600px] flex flex-col">
                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            <motion.div
                                variants={listContainerVariants}
                                initial="hidden"
                                animate="show"
                                key={activeTag} 
                            >
                                {filteredProjects.map((project) => {
                                    const isHovered = (hoveredProjectName === t(project.name as TranslationKey)) || (mapHoveredProjectName === t(project.name as TranslationKey));
                                    
                                    return (
                                        <motion.button 
                                            key={project.name} 
                                            variants={listItemVariants}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            ref={el => { itemRefs.current[project.name] = el; }}
                                            className={`w-full text-left p-3 rounded-xl transition-all duration-300 border group flex gap-4 items-start ${
                                                isHovered
                                                    ? 'bg-white dark:bg-slate-700 border-primary ring-1 ring-primary/30 shadow-xl z-10 relative' 
                                                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg'
                                            }`}
                                            onClick={() => handleProjectClick(project)}
                                            onMouseEnter={() => setHoveredProjectName(t(project.name as TranslationKey))}
                                            onMouseLeave={() => setHoveredProjectName(null)}
                                        >
                                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                                <img src={project.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className={`text-sm font-display font-bold leading-tight ${isHovered ? 'text-primary dark:text-secondary' : 'text-text-dark dark:text-slate-200'}`}>
                                                        {t(project.name as TranslationKey)}
                                                    </h3>
                                                </div>
                                                <p className="text-xs text-text-light dark:text-slate-400 mt-1 line-clamp-2">{t(project.description as TranslationKey)}</p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {project.tags.slice(0,2).map(tag => (
                                                        <span key={tag} className="text-[10px] bg-gray-100 dark:bg-slate-600/50 text-text-light dark:text-slate-300 px-1.5 py-0.5 rounded">
                                                            {t(tag as TranslationKey)}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="mt-3 flex items-center text-xs font-bold text-primary dark:text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    {t('ViewCaseStudy')} <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                                                </div>
                                            </div>
                                            <div className="self-center text-gray-300 dark:text-slate-600 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                            {filteredProjects.length === 0 && (
                                <div className="text-center py-10 text-text-light dark:text-slate-400">
                                    {t('NoProjectsMatchFilter')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map View */}
                    <div className="lg:col-span-2">
                        <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900">
                            <InteractiveMap 
                                projects={projectMarkers} 
                                activeProject={null} // We don't center actively to keep map free, but we could
                                onMarkerSelect={handleMarkerSelect} 
                                hoveredProjectName={hoveredProjectName} 
                                mapHoveredProjectName={mapHoveredProjectName} 
                                onMarkerHover={handleMarkerHover} 
                            />
                            
                            {/* Map Overlay Info */}
                            <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-xs border border-gray-200 dark:border-slate-600 pointer-events-none">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-text-light dark:text-slate-400 mb-1">{t('OurGlobalFootprint')}</h4>
                                <p className="text-sm font-bold text-primary-dark dark:text-white">
                                    {filteredProjects.length} {t('ActiveLocations')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <React.Suspense fallback={
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="bg-white p-4 rounded-lg shadow-lg">Loading...</div>
                        </div>
                    }>
                        <ProjectDetailModal 
                            project={selectedProject} 
                            onClose={handleCloseModal} 
                            setPage={setPage}
                        />
                    </React.Suspense>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectsPage;