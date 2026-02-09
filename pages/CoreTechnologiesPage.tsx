import * as React from 'react';
import { GMEL_TECHNOLOGIES, OTHER_CORE_AREAS } from '../constants';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../LanguageContext';
import { Page } from '../types';
import Card from '../components/Card';
import Tooltip from '../components/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import type { TranslationKey } from '../translations';

// Icon Definitions
const ClgIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={{ rest: { scale: 1 }, hover: { scale: 1.1, transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" } } }}>
        <path d="M21.5 2v6h-6M2.5 22v-6h6" />
        <path d="M2 11.5a10 10 0 0 1 18.8-4.3" />
        <path d="M22 12.5a10 10 0 0 1-18.8 4.2" />
    </motion.svg>
);

const EhsIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={{ rest: { scale: 1 }, hover: { scale: 1.1, transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" } } }}>
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <motion.path d="M16.24 7.76a6 6 0 0 1 0 8.49" variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1, transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" } } }} />
        <motion.path d="M19.07 4.93a10 10 0 0 1 0 14.14" variants={{ rest: { opacity: 0.3 }, hover: { opacity: 1, transition: { duration: 0.8, delay: 0.1, repeat: Infinity, repeatType: "reverse" } } }} />
        <motion.path d="M7.76 16.24a6 6 0 0 1 0-8.49" variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1, transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" } } }} />
        <motion.path d="M4.93 19.07a10 10 0 0 1 0-14.14" variants={{ rest: { opacity: 0.3 }, hover: { opacity: 1, transition: { duration: 0.8, delay: 0.1, repeat: Infinity, repeatType: "reverse" } } }} />
    </motion.svg>
);

const DrillIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={{ rest: { rotate: 0 }, hover: { rotate: 45, transition: { duration: 0.5, type: "spring", stiffness: 100 } } }}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </motion.svg>
);

const ThermoFluidIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
        <motion.path d="M12 9V4" variants={{ rest: { y: 0 }, hover: { y: [0, -2, 0], transition: { duration: 1, repeat: Infinity } } }} />
        <motion.path d="M12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" variants={{ rest: { scale: 1 }, hover: { scale: [1, 1.2, 1], transition: { duration: 1.5, repeat: Infinity } } }} />
    </motion.svg>
);

const DesalIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        <motion.circle cx="12" cy="15" r="1" variants={{ rest: { y: 0, opacity: 0 }, hover: { y: [0, 5], opacity: [0, 1, 0], transition: { duration: 1.2, repeat: Infinity } } }} />
    </motion.svg>
);

const H2CellIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={{ rest: { rotate: 0 }, hover: { rotate: 360, transition: { duration: 4, ease: "linear", repeat: Infinity } } }}>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="4" r="2" />
        <circle cx="20" cy="12" r="2" />
        <circle cx="12" cy="20" r="2" />
        <circle cx="4" cy="12" r="2" />
        <line x1="12" y1="9" x2="12" y2="6" />
        <line x1="15" y1="12" x2="18" y2="12" />
        <line x1="12" y1="15" x2="12" y2="18" />
        <line x1="9" y1="12" x2="6" y2="12" />
    </motion.svg>
);

const AgriCellIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={{ rest: { rotate: 0 }, hover: { rotate: [0, 10, -5, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } } }}>
        <path d="M12 20v-8" />
        <path d="M6 22v-4" />
        <path d="M18 22v-2" />
        <path d="M12 12a4 4 0 0 1 4-4" />
        <path d="M12 12a4 4 0 0 0-4-4" />
        <path d="M16 8a4 4 0 0 1 0-8" />
        <path d="M8 8a4 4 0 0 0 0-8" />
    </motion.svg>
);

const LithiumLoopIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="7" width="12" height="10" rx="2" />
        <line x1="12" y1="7" x2="12" y2="17" />
        <line x1="6" y1="12" x2="18" y2="12" />
        <motion.path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9" variants={{ rest: { rotate: 0 }, hover: { rotate: 360, transition: { duration: 2, repeat: Infinity, ease: "linear" } } }} style={{ transformOrigin: "12px 12px" }} />
    </motion.svg>
);

const EcoClusterIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <motion.circle cx="12" cy="4" r="2" variants={{ rest: { scale: 1 }, hover: { scale: [1, 1.3, 1], transition: { duration: 1, delay: 0, repeat: Infinity } } }} />
        <motion.circle cx="20" cy="18" r="2" variants={{ rest: { scale: 1 }, hover: { scale: [1, 1.3, 1], transition: { duration: 1, delay: 0.3, repeat: Infinity } } }} />
        <motion.circle cx="4" cy="18" r="2" variants={{ rest: { scale: 1 }, hover: { scale: [1, 1.3, 1], transition: { duration: 1, delay: 0.6, repeat: Infinity } } }} />
        <line x1="12" y1="9" x2="12" y2="6" />
        <line x1="14.5" y1="13.5" x2="18.5" y2="16.5" />
        <line x1="9.5" y1="13.5" x2="5.5" y2="16.5" />
    </motion.svg>
);

const SmartFundIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={{ rest: { scale: 1 }, hover: { scale: 1.1, transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" } } }}>
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </motion.svg>
);

const GeoCreditIcon = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <motion.path d="m9 12 2 2 4-4" variants={{ rest: { pathLength: 1, opacity: 1 }, hover: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 1, repeat: Infinity } } }} />
    </motion.svg>
);

const getTechIcon = (name: string) => {
    switch (name) {
        case "GMEL_CLG_Name": return <ClgIcon />;
        case "GMEL_EHS_Name": return <EhsIcon />;
        case "GMEL_DrillX_Name": return <DrillIcon />;
        case "GMEL_ThermoFluid_Name": return <ThermoFluidIcon />;
        case "GMEL_Desal_Name": return <DesalIcon />;
        case "GMEL_H2Cell_Name": return <H2CellIcon />;
        case "GMEL_AgriCell_Name": return <AgriCellIcon />;
        case "GMEL_LithiumLoop_Name": return <LithiumLoopIcon />;
        case "GMEL_EcoCluster_Name": return <EcoClusterIcon />;
        case "GMEL_SmartFund_Name": return <SmartFundIcon />;
        case "GMEL_GeoCredit_Name": return <GeoCreditIcon />;
        default: return null;
    }
};

const GLOSSARY: Record<string, string> = {
    'GMEL': 'Geothermal Multi-Energy Loop - Our proprietary framework integrating various renewable energy technologies into a unified, efficient system.',
    'CLG': 'Closed-Loop Geothermal - A method of extracting geothermal energy that circulates fluid through a sealed loop, preventing contamination and water loss.',
    'EHS': 'Environment, Health & Safety (also Energy Health Sensors in our context) - Protocols and devices ensuring operational safety and environmental protection.',
    'DrillX': 'Advanced Drilling Technologies - Next-generation drilling techniques designed to reach deeper geothermal reservoirs with higher precision and speed.',
    'ThermoFluid': 'Optimized Heat Transfer Fluid - Specialized fluids engineered to maximize heat absorption and transport efficiency in geothermal systems.',
    'Desal': 'Thermal Desalination - The process of removing salt from water using heat energy, integrated here with geothermal waste heat.',
    'H2Cell': 'Hydrogen Fuel Cell - Technology that converts the chemical energy of hydrogen directly into electricity, with water as the only byproduct.',
    'EPCI': 'Engineering, Procurement, Construction, and Installation - A contract form where the contractor is responsible for the entire project cycle.',
    'AgriCell': 'Smart agricultural solutions powered by geothermal energy, often involving vertical farming or controlled-environment agriculture.',
    'LithiumLoop': 'Sustainable lithium extraction from geothermal brine, enabling critical mineral recovery with minimal environmental impact.',
    'EcoCluster': 'Integrated industrial clusters designed for a circular economy, where waste from one process becomes input for another.',
    'SmartFund': 'Blockchain-based financing platform for transparent and decentralized funding of green energy projects.',
    'GeoCredit': 'A platform for the verification and trading of carbon credits generated by geothermal and renewable energy projects.',
};

// Mock API function to simulate fetching data
const fetchTechnologies = async (): Promise<typeof GMEL_TECHNOLOGIES> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(GMEL_TECHNOLOGIES);
        }, 1200); // Simulate 1.2s network latency
    });
};

const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 flex flex-col h-full border border-gray-100 dark:border-slate-700">
        <div className="h-12 w-12 bg-gray-200 dark:bg-slate-700 rounded-full mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="space-y-2 flex-grow mb-4">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6 animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 animate-pulse"></div>
    </div>
);

const CoreTechnologiesPage: React.FC = () => {
    const { t, language } = useLanguage();
    const [selectedGlossaryTerm, setSelectedGlossaryTerm] = React.useState<string | null>(null);
    const [technologies, setTechnologies] = React.useState<typeof GMEL_TECHNOLOGIES>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            try {
                const data = await fetchTechnologies();
                if (isMounted) {
                    setTechnologies(data);
                }
            } catch (error) {
                console.error("Failed to load technologies", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, []);

    const handleTechClick = (id: string) => {
        // Updated to use the correct domain structure
        const url = `https://gmel.vision.kkm-intl.org/?lang=${language}&id=${id}`;
        window.location.href = url;
    };

    const handleScrollToTech = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add momentary highlight
            element.classList.add('ring-4', 'ring-accent-yellow', 'ring-offset-4', 'dark:ring-offset-slate-900');
            setTimeout(() => {
                element.classList.remove('ring-4', 'ring-accent-yellow', 'ring-offset-4', 'dark:ring-offset-slate-900');
            }, 1500);
        }
    };

    const getTechName = (id: string) => {
        const tech = technologies.find(t => t.id === id);
        return tech ? tech.name : id;
    };

    const processTextWithTooltips = (text: string): React.ReactNode => {
        if (!text) return null;
        
        // Sort keys by length descending to match longest terms first (e.g. "GMEL-CLG" before "GMEL")
        const keys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
        if (keys.length === 0) return text;
    
        // Create regex that matches keys but ensures word boundaries
        const pattern = new RegExp(`\\b(${keys.join('|')})\\b`, 'g');
        const parts = text.split(pattern);
        
        return parts.map((part, index) => {
            if (GLOSSARY[part]) {
                return (
                    <button 
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setSelectedGlossaryTerm(part); }}
                        className="inline-block group relative"
                        aria-haspopup="dialog"
                        aria-label={`See definition for ${part}`}
                    >
                        <span className="font-semibold text-primary dark:text-secondary border-b-2 border-dotted border-current cursor-help hover:text-accent-dark dark:hover:text-accent-yellow transition-colors">
                            {part}
                        </span>
                    </button>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div>
            <PageHeader title={t(Page.CoreTechnologies)} subtitle={t('CoreTechPageSubtitle')}/>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-16">
                <h2 className="text-3xl font-display font-bold text-primary dark:text-white mb-8 text-center">{t('GmelEcosystem')}</h2>
                <p className="text-center text-text-light dark:text-slate-300 max-w-3xl mx-auto mb-16">
                    {t('GmelEcosystemSubtitle')}
                </p>
                
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
                        {technologies.map(tech => {
                            const relatedLinks = tech.relatedIds ? (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                                    <span className="text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-wider mb-2 block">Related Technologies:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {tech.relatedIds.map(rid => (
                                            <button 
                                                key={rid} 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleScrollToTech(rid);
                                                }} 
                                                className="group flex items-center gap-1 text-xs font-semibold text-primary dark:text-secondary bg-primary/5 dark:bg-slate-700 px-3 py-1.5 rounded-full hover:bg-primary/10 dark:hover:bg-slate-600 transition-all border border-primary/10 dark:border-slate-600 hover:border-primary/30"
                                            >
                                                <span>{t(getTechName(rid) as TranslationKey).replace('GMEL-', '').replace(/\s\(.*\)/, '')}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null;

                            return (
                                <motion.div 
                                    key={tech.id} 
                                    id={tech.id} 
                                    className="scroll-mt-32 transition-all duration-300 rounded-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card 
                                        title={t(tech.name as TranslationKey)}
                                        description={() => processTextWithTooltips(t(tech.description as TranslationKey))}
                                        icon={getTechIcon(tech.name)}
                                        actionText={t('LearnMore')}
                                        onActionClick={() => handleTechClick(tech.id)}
                                        footer={relatedLinks}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-24">
                    <h2 className="text-3xl font-display font-bold text-primary dark:text-white mb-8 text-center">{t('ExpandingHorizons')}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {OTHER_CORE_AREAS.map(area => (
                           <Card 
                                key={area.name}
                                title={t(area.name as TranslationKey)}
                                description={t(area.description as TranslationKey)}
                                actionText={t('LearnMore')}
                                onActionClick={() => handleTechClick(area.id)}
                           />
                        ))}
                    </div>
                </div>

                <section className="mt-24" id="digital-platforms">
                    <h2 className="text-3xl font-display font-bold text-primary dark:text-white mb-4 text-center">{t('DigitalPlatforms')}</h2>
                    <p className="text-center text-text-light dark:text-slate-300 max-w-3xl mx-auto mb-12">{t('DigitalPlatformsSubtitle')}</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* GMEL Vision */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col group">
                            <div className="h-56 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="GMEL Vision" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-primary/20 dark:bg-primary/40 group-hover:bg-primary/10 transition-colors duration-300"></div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-2xl font-display font-bold text-primary dark:text-white mb-3">{t('GMELVisionWebAppTitle')}</h3>
                                <p className="text-text-light dark:text-slate-300 mb-6 flex-grow">{t('GMELVisionWebAppSubtitle')}</p>
                                <div>
                                    <button 
                                        onClick={() => handleTechClick('vision-app')}
                                        className="inline-block px-8 py-3 font-bold text-text-dark bg-accent-yellow rounded-full hover:bg-secondary transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
                                    >
                                        {t('LaunchGMELVision')}
                                    </button>
                                    <p className="text-xs text-text-light dark:text-slate-400 opacity-70 font-mono">gmel.vision.kkm-intl.org</p>
                                </div>
                            </div>
                        </div>

                        {/* GMEL Navigator */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col group">
                            <div className="h-56 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" alt="GMEL Navigator" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-secondary/20 dark:bg-secondary/40 group-hover:bg-secondary/10 transition-colors duration-300"></div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-2xl font-display font-bold text-primary dark:text-white mb-3">{t('GMELNavigatorWebAppTitle')}</h3>
                                <p className="text-text-light dark:text-slate-300 mb-6 flex-grow">{t('GMELNavigatorWebAppSubtitle')}</p>
                                <div>
                                    <button 
                                        onClick={() => {
                                            const url = `https://gmel.navigator.kkm-intl.org/?lang=${language}`;
                                            window.location.href = url;
                                        }}
                                        className="inline-block px-8 py-3 font-bold text-white bg-primary rounded-full hover:bg-secondary transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
                                    >
                                        {t('LaunchGMELNavigator')}
                                    </button>
                                    <p className="text-xs text-text-light dark:text-slate-400 opacity-70 font-mono">gmel.navigator.kkm-intl.org</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Glossary Sidebar */}
            <AnimatePresence>
                {selectedGlossaryTerm && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                            onClick={() => setSelectedGlossaryTerm(null)}
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-white dark:bg-slate-900 shadow-2xl z-[70] border-l border-gray-200 dark:border-slate-700 overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-sm font-bold text-text-light dark:text-slate-400 uppercase tracking-wider">Glossary Term</h3>
                                    <button 
                                        onClick={() => setSelectedGlossaryTerm(null)}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                        aria-label="Close glossary sidebar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-dark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="mb-6">
                                    <h2 className="text-4xl font-display font-extrabold text-primary dark:text-secondary mb-4">{selectedGlossaryTerm}</h2>
                                    <div className="w-16 h-1.5 bg-accent-yellow rounded-full mb-6"></div>
                                    <p className="text-lg font-medium text-text-dark dark:text-white leading-relaxed">
                                        {GLOSSARY[selectedGlossaryTerm]}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
                                    <p className="text-sm text-text-light dark:text-slate-400 italic">
                                        This term is part of the KKM International proprietary technology glossary. For detailed technical specifications, please consult the Internal Portal or authorized documentation.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CoreTechnologiesPage;