
import * as React from 'react';
import { useLanguage } from '../LanguageContext';
import type { TranslationKey } from '../translations';
import PageHeader from '../components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';

const NotifyModal: React.FC<{onClose: () => void; t: (key: TranslationKey) => string;}> = ({ onClose, t }) => {
    const [email, setEmail] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && email.includes('@')) {
            setSubmitted(true);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                {submitted ? (
                    <>
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-display font-bold text-primary-dark dark:text-secondary mb-4">{t('NotifyModalSuccessTitle')}</h2>
                        <p className="text-text-light dark:text-slate-300 mb-6">{t('NotifyModalSuccessText')}</p>
                        <button 
                            onClick={onClose} 
                            className="px-6 py-2 font-bold text-white bg-primary rounded-full hover:bg-secondary transition-colors duration-300 shadow-md"
                        >
                            {t('Close')}
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-display font-bold text-primary-dark dark:text-secondary mb-2">{t('NotifyModalTitle')}</h2>
                        <p className="text-text-light dark:text-slate-300 mb-6 text-sm">{t('NotifyModalText')}</p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input 
                                type="email"
                                placeholder={t('NotifyModalPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-text-dark dark:text-slate-200 transition-all"
                            />
                            <button 
                                type="submit" 
                                className="px-6 py-3 font-bold text-text-dark bg-accent-yellow rounded-lg hover:bg-secondary transition-colors duration-300 shadow-lg"
                            >
                                {t('NotifyMe')}
                            </button>
                        </form>
                        <button onClick={onClose} className="mt-4 text-sm text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                            {t('NotifyModalNoThanks')}
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

// --- Sub-Components ---

const VisionCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700 transition-all hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center h-full">
        <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-full text-white mb-6 shadow-lg">
            {icon}
        </div>
        <h3 className="text-xl font-display font-bold text-primary-dark dark:text-white mb-4">{title}</h3>
        <ul className="text-text-light dark:text-slate-300 leading-relaxed text-sm list-disc list-inside text-left w-full space-y-3">
            {/* Split description by sentences for bullet points to improve readability */}
            {description.split('. ').map((sentence, idx) => (
                sentence.trim() && <li key={idx} className="pl-1">{sentence.trim()}{!sentence.endsWith('.') && '.'}</li>
            ))}
        </ul>
    </div>
);

const RoadmapNode: React.FC<{ year: string; title: string; description: string; icon: React.ReactNode; isLast?: boolean }> = ({ year, title, description, icon, isLast }) => (
    <div className="flex relative pb-12 last:pb-0">
        {!isLast && <div className="absolute top-10 left-6 -ml-px h-full w-0.5 bg-gray-200 dark:bg-slate-700"></div>}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-4 border-primary dark:border-secondary flex items-center justify-center relative z-10 shadow-md">
            {icon}
        </div>
        <div className="ml-6 flex-grow pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                <span className="text-2xl font-display font-extrabold text-primary dark:text-secondary mr-3">{year}</span>
                <h4 className="text-lg font-bold text-text-dark dark:text-white">{title}</h4>
            </div>
            <p className="text-text-light dark:text-slate-400 max-w-lg">{description}</p>
        </div>
    </div>
);

const ProjectPipelineCard: React.FC<{ name: string; description: string; index: number }> = ({ name, description, index }) => (
    <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 border-l-4 border-accent-yellow shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-lg text-text-dark dark:text-white">{name}</h4>
            <span className="text-xs font-mono bg-gray-200 dark:bg-slate-800 px-2 py-1 rounded text-text-light dark:text-slate-400">Concept #{index + 1}</span>
        </div>
        <p className="text-sm text-text-light dark:text-slate-300">{description}</p>
    </div>
);

const EmergingTechCard: React.FC<{ title: string; description: string; imageUrl: string }> = ({ title, description, imageUrl }) => (
    <div className="group relative overflow-hidden rounded-xl shadow-lg h-72">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end transition-opacity">
            <h3 className="text-xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform">{title}</h3>
            <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{description}</p>
        </div>
    </div>
);

const LocalNavLink: React.FC<{id: string, label: string, activeId: string}> = ({id, label, activeId}) => (
    <a 
        href={`#${id}`} 
        className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
            activeId === id 
                ? 'bg-primary border-primary text-white shadow-md' 
                : 'bg-white/80 dark:bg-slate-800/80 border-transparent text-text-light dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:border-gray-200 dark:hover:border-slate-600'
        }`}
    >
        {label}
    </a>
);

const FuturesPage: React.FC = () => {
    const { t } = useLanguage();
    const [isNotifyModalOpen, setIsNotifyModalOpen] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState('vision');

    const sectionIds = ['vision', 'sustainability', 'roadmap', 'innovation', 'emerging-tech', 'pipeline'];

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: `-25% 0px -70% 0px`, threshold: 0 }
        );

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            sectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    return (
        <div>
            {isNotifyModalOpen && <NotifyModal onClose={() => setIsNotifyModalOpen(false)} t={t} />}
            <PageHeader title={t('Futures_Hero_Title')} subtitle={t('Futures_Hero_Subtitle')} />
            
            {/* Local Sticky Navigation */}
            <div className="sticky top-16 md:top-20 z-30 py-3 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 overflow-x-auto no-scrollbar flex gap-2 pb-1 justify-start md:justify-center">
                    <LocalNavLink id="vision" label={t('Vision_Title')} activeId={activeSection} />
                    <LocalNavLink id="sustainability" label="Sustainability" activeId={activeSection} />
                    <LocalNavLink id="roadmap" label="Roadmap" activeId={activeSection} />
                    <LocalNavLink id="innovation" label="Research" activeId={activeSection} />
                    <LocalNavLink id="emerging-tech" label="Emerging Tech" activeId={activeSection} />
                    <LocalNavLink id="pipeline" label="Pipeline" activeId={activeSection} />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-12 space-y-24">
                
                {/* 1. Vision Section */}
                <section id="vision" className="scroll-mt-40">
                    <h2 className="text-3xl font-display font-bold text-center text-primary-dark dark:text-white mb-12">{t('Vision_Title')}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <VisionCard 
                            title={t('Vision_1_Title')} 
                            description={t('Vision_1_Desc')} 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.523-1.16a.5.5 0 01.88.397V7.5a.5.5 0 01-.5.5h-2a.5.5 0 01-.397-.88l1.16-.523zM10.5 13.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" /></svg>}
                        />
                        <VisionCard 
                            title={t('Vision_2_Title')} 
                            description={t('Vision_2_Desc')} 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        />
                        <VisionCard 
                            title={t('Vision_3_Title')} 
                            description={t('Vision_3_Desc')} 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                        />
                    </div>
                </section>

                {/* 2. Sustainability Commitments - Dedicated Subsection */}
                <section id="sustainability" className="bg-green-50/50 dark:bg-green-900/10 rounded-3xl p-8 md:p-12 border border-green-100 dark:border-green-900/30 shadow-sm relative overflow-hidden scroll-mt-40">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-xs mb-2 block">{t('Vision_1_Title')}</span>
                        <h2 className="text-3xl font-display font-bold text-green-900 dark:text-green-100">{t('Sustainability_Title')}</h2>
                        <p className="mt-4 text-text-light dark:text-slate-300">{t('Sustainability_Desc')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Decarbonization */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-t-4 border-green-500">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.523-1.16a.5.5 0 01.88.397V7.5a.5.5 0 01-.5.5h-2a.5.5 0 01-.397-.88l1.16-.523zM10.5 13.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-text-dark dark:text-white mb-2">{t('Sus_Carbon_Title')}</h3>
                            <p className="text-sm text-text-light dark:text-slate-400">{t('Sus_Carbon_Desc')}</p>
                        </div>

                        {/* Zero-Waste */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-t-4 border-teal-500">
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-text-dark dark:text-white mb-2">{t('Sus_Waste_Title')}</h3>
                            <p className="text-sm text-text-light dark:text-slate-400">{t('Sus_Waste_Desc')}</p>
                        </div>

                        {/* Biodiversity */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-t-4 border-emerald-500">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-text-dark dark:text-white mb-2">{t('Sus_Bio_Title')}</h3>
                            <p className="text-sm text-text-light dark:text-slate-400">{t('Sus_Bio_Desc')}</p>
                        </div>
                    </div>
                </section>

                {/* 3. Strategic Roadmap */}
                <section id="roadmap" className="scroll-mt-40">
                    <h2 className="text-3xl font-display font-bold text-center text-primary-dark dark:text-white mb-12">{t('Roadmap_Title')}</h2>
                    <div className="max-w-3xl mx-auto pl-4 md:pl-0">
                        <RoadmapNode 
                            year="2025" 
                            title={t('Roadmap_2025_Title')} 
                            description={t('Roadmap_2025_Desc')} 
                            icon={<svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                        />
                        <RoadmapNode 
                            year="2028" 
                            title={t('Roadmap_2028_Title')} 
                            description={t('Roadmap_2028_Desc')} 
                            icon={<svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        />
                        <RoadmapNode 
                            year="2035" 
                            title={t('Roadmap_2035_Title')} 
                            description={t('Roadmap_2035_Desc')} 
                            icon={<svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.523-1.16a.5.5 0 01.88.397V7.5a.5.5 0 01-.5.5h-2a.5.5 0 01-.397-.88l1.16-.523zM10.5 13.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" /></svg>}
                        />
                        <RoadmapNode 
                            year="2050" 
                            title={t('Roadmap_2050_Title')} 
                            description={t('Roadmap_2050_Desc')} 
                            icon={<svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.92.577-4.247M9 10l1 2h2l1-2" /></svg>}
                            isLast
                        />
                    </div>
                </section>

                {/* 4. Research Frontiers */}
                <section id="innovation" className="scroll-mt-40">
                    <h2 className="text-2xl font-display font-bold text-primary-dark dark:text-white mb-2">{t('Research_Title')}</h2>
                    <p className="text-text-light dark:text-slate-400 mb-8">{t('Research_Subtitle')}</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-l-4 border-blue-500">
                            <h3 className="font-bold text-lg dark:text-white">{t('Research_1_Title')}</h3>
                            <p className="text-sm text-text-light dark:text-slate-400 mt-2">{t('Research_1_Desc')}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-l-4 border-purple-500">
                            <h3 className="font-bold text-lg dark:text-white">{t('Research_2_Title')}</h3>
                            <p className="text-sm text-text-light dark:text-slate-400 mt-2">{t('Research_2_Desc')}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-l-4 border-cyan-500">
                            <h3 className="font-bold text-lg dark:text-white">{t('Research_3_Title')}</h3>
                            <p className="text-sm text-text-light dark:text-slate-400 mt-2">{t('Research_3_Desc')}</p>
                        </div>
                    </div>
                </section>

                {/* 5. Emerging Technologies */}
                <section id="emerging-tech" className="scroll-mt-40 py-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="relative z-10 container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold text-white mb-2">{t('EmergingTech_SectionTitle')}</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">{t('EmergingTech_SectionSubtitle')}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <EmergingTechCard 
                                title={t('Tech_AR_Title')} 
                                description={t('Tech_AR_Desc')} 
                                imageUrl="https://images.unsplash.com/photo-1614726365723-49cfae96a604?auto=format&fit=crop&w=800&q=80"
                            />
                            <EmergingTechCard 
                                title={t('Tech_Graphene_Title')} 
                                description={t('Tech_Graphene_Desc')} 
                                imageUrl="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                            />
                            <EmergingTechCard 
                                title={t('Tech_AI_Title')} 
                                description={t('Tech_AI_Desc')} 
                                imageUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                            />
                        </div>
                    </div>
                </section>

                {/* 6. Future Projects Pipeline */}
                <section id="pipeline" className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 scroll-mt-40">
                    <h2 className="text-2xl font-display font-bold text-primary-dark dark:text-white mb-2 text-center">{t('FutureProjects_Title')}</h2>
                    <p className="text-text-light dark:text-slate-400 mb-8 text-center">{t('FutureProjects_Subtitle')}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <ProjectPipelineCard 
                            name={t('Project_Alpha_Name')}
                            description={t('Project_Alpha_Desc')}
                            index={0}
                        />
                        <ProjectPipelineCard 
                            name={t('Project_Beta_Name')}
                            description={t('Project_Beta_Desc')}
                            index={1}
                        />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default FuturesPage;
