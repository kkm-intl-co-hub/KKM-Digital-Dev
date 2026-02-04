
import * as React from 'react';
import { Page } from '../types';
import type { NewsItem, Video } from '../types';
import { GMEL_TECHNOLOGIES, PROJECTS, NEWS_ITEMS, VIDEOS } from '../constants';
import Card from '../components/Card';
import { useLanguage } from '../LanguageContext';
import NewsCard from '../components/NewsCard';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedStats from '../components/AnimatedStats';
import type { TranslationKey } from '../translations';

interface HomePageProps {
  setPage: (page: Page) => void;
  onSelectArticle: (article: NewsItem) => void;
}

const SectionTitle: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary-dark dark:text-white text-center">{children}</h2>
);

const SectionSubtitle: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <p className="mt-4 text-lg text-text-light dark:text-slate-300 text-center max-w-3xl mx-auto">{children}</p>
);

// Animated Icons for GMEL Tech
const ClgIcon = () => (
    <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        variants={{
            rest: { scale: 1 },
            hover: { 
                scale: 1.1, 
                transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" } 
            }
        }}
    >
        <path d="M21.5 2v6h-6M2.5 22v-6h6" />
        <path d="M2 11.5a10 10 0 0 1 18.8-4.3" />
        <path d="M22 12.5a10 10 0 0 1-18.8 4.2" />
    </motion.svg>
);

const EhsIcon = () => (
    <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        variants={{
            rest: { scale: 1 },
            hover: { scale: 1.1, transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" } }
        }}
    >
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <motion.path d="M16.24 7.76a6 6 0 0 1 0 8.49" variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1, transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" } } }} />
        <motion.path d="M19.07 4.93a10 10 0 0 1 0 14.14" variants={{ rest: { opacity: 0.3 }, hover: { opacity: 1, transition: { duration: 0.8, delay: 0.1, repeat: Infinity, repeatType: "reverse" } } }} />
        <motion.path d="M7.76 16.24a6 6 0 0 1 0-8.49" variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1, transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" } } }} />
        <motion.path d="M4.93 19.07a10 10 0 0 1 0-14.14" variants={{ rest: { opacity: 0.3 }, hover: { opacity: 1, transition: { duration: 0.8, delay: 0.1, repeat: Infinity, repeatType: "reverse" } } }} />
    </motion.svg>
);

const DrillIcon = () => (
    <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        variants={{
             rest: { rotate: 0 },
             hover: { rotate: 45, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
        }}
    >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </motion.svg>
);

const getTechIcon = (name: string) => {
    switch (name) {
        case "GMEL_CLG_Name": return <ClgIcon />;
        case "GMEL_EHS_Name": return <EhsIcon />;
        case "GMEL_DrillX_Name": return <DrillIcon />;
        default: return null;
    }
};

const HomePage: React.FC<HomePageProps> = ({ setPage, onSelectArticle }) => {
  const [playingVideoId, setPlayingVideoId] = React.useState<string | null>(null);
  const { t } = useLanguage();
  
  // Parallax Effect Hooks
  const { scrollY } = useScroll();
  const yBg1 = useTransform(scrollY, [0, 500], [0, 150]);
  const yBg2 = useTransform(scrollY, [0, 500], [0, -100]);

  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1,
      },
    },
  };

  const heroItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // Custom cubic-bezier for a smooth "slide up" feel
      },
    },
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center relative z-10"
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-display font-extrabold !text-white leading-tight"
            variants={heroItemVariants}
          >
            {t('HeroTitle')}
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-gray-100"
            variants={heroItemVariants}
          >
            {t('HeroSubtitle')}
          </motion.p>
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
            variants={heroItemVariants}
          >
            <button
              onClick={() => setPage(Page.CoreTechnologies)}
              className="px-8 py-3 font-bold text-text-dark bg-accent-yellow rounded-full hover:bg-secondary transition-colors duration-300 transform hover:scale-105 shadow-lg"
            >
              {t('ExploreTech')}
            </button>
            <button
              onClick={() => setPage(Page.Contact)}
              className="px-8 py-3 font-bold text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-primary transition-colors duration-300"
            >
              {t('PartnerWithUs')}
            </button>
          </motion.div>
        </motion.div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <motion.div 
                style={{ y: yBg1 }}
                className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-60"
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
                style={{ y: yBg2 }}
                className="absolute top-1/2 right-0 w-64 h-64 bg-accent-yellow/20 rounded-full blur-3xl opacity-60" 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
        </div>
      </section>

      {/* Who We Are Summary - Moved Up after removing CEO Briefing */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-30 relative">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-slate-700">
              <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-2xl font-display font-bold text-primary-dark dark:text-secondary uppercase tracking-wider mb-4">{t('WhoWeAre')}</h2>
                  <p className="text-lg md:text-xl text-text-dark dark:text-slate-200 leading-relaxed font-medium">
                      {t('WhoWeAreSummary')}
                  </p>
                  <button 
                      onClick={() => setPage(Page.AboutUs)}
                      className="mt-6 text-accent-dark dark:text-accent-yellow font-bold hover:underline inline-flex items-center gap-1"
                  >
                      {t('ReadOurStory')} &rarr;
                  </button>
              </div>
          </div>
      </section>

      {/* Animated Stats */}
      <AnimatedStats />

      {/* Core Technologies Teaser */}
      <section id="core-technologies-section" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>{t('GmelEcosystem')}</SectionTitle>
        <SectionSubtitle>
          {t('GmelEcosystemSubtitle')}
        </SectionSubtitle>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GMEL_TECHNOLOGIES.slice(0, 3).map(tech => (
            <Card
              key={tech.name}
              title={t(tech.name as TranslationKey)}
              description={t(tech.description as TranslationKey)}
              icon={getTechIcon(tech.name)}
              actionText={t('LearnMore')}
              onActionClick={() => setPage(Page.CoreTechnologies)}
            />
          ))}
        </div>
      </section>

      {/* Innovation Hub Spotlight */}
      <section id="innovation-hub-section" className="bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h3 className="text-base text-accent-dark dark:text-accent-yellow font-semibold tracking-wider uppercase">{t('InnovationHubTitle')}</h3>
            <SectionTitle>{t('FromIdeaToImpact')}</SectionTitle>
            <SectionSubtitle>
             {t('InnovationHubSubtitle')}
            </SectionSubtitle>
            <button
              onClick={() => setPage(Page.InnovationHub)}
              className="mt-8 px-8 py-3 font-bold text-white bg-primary rounded-full hover:bg-secondary transition-colors duration-300"
            >
              {t('JoinTheInnovation')}
            </button>
          </div>
        </div>
      </section>

      {/* Projects & Pilots */}
      <section id="projects-section" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>{t('ProjectsShowcaseTitle')}</SectionTitle>
        <SectionSubtitle>
          {t('ProjectsShowcaseSubtitle')}
        </SectionSubtitle>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.slice(0,3).map(project => (
            <Card
              key={project.name}
              title={t(project.name as TranslationKey)}
              description={t(project.description as TranslationKey)}
              imageUrl={project.image}
              actionText={t('ViewProject')}
              onActionClick={() => setPage(Page.Projects)}
            />
          ))}
        </div>
      </section>

      {/* Videos Section */}
      <section className="bg-gray-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <SectionTitle>{t('VisionInMotionTitle')}</SectionTitle>
              <SectionSubtitle>{t('VisionInMotionSubtitle')}</SectionSubtitle>
              <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {VIDEOS.map(video => (
                      <div key={video.youtubeId} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden flex flex-col group transform hover:-translate-y-1 transition-all duration-300">
                          {playingVideoId === video.youtubeId ? (
                              <div className="aspect-video">
                                  <iframe
                                      width="100%"
                                      height="100%"
                                      src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                                      title={t(video.title as TranslationKey)}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                  ></iframe>
                              </div>
                          ) : (
                              <button 
                                  className="cursor-pointer text-left w-full p-0 border-0 bg-transparent" 
                                  onClick={() => setPlayingVideoId(video.youtubeId)}
                                  aria-label={`Play video: ${t(video.title as TranslationKey)}`}
                              >
                                  <div className="relative overflow-hidden">
                                    <img src={video.thumbnail} alt={t(video.title as TranslationKey)} loading="lazy" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                  </div>
                                  <div className="p-6 flex flex-col flex-grow">
                                      <h3 className="text-lg font-bold text-primary-dark dark:text-secondary">{t(video.title as TranslationKey)}</h3>
                                      <p className="mt-2 text-sm text-text-light dark:text-slate-400 flex-grow">{t(video.description as TranslationKey)}</p>
                                  </div>
                              </button>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </section>
      
      {/* News & Insights */}
      <section id="news-insights-section" className="bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <SectionTitle>{t('NewsInsightsTitle')}</SectionTitle>
              <SectionSubtitle>{t('NewsInsightsSubtitle')}</SectionSubtitle>
              <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {NEWS_ITEMS.map(item => (
                     <NewsCard key={item.title} item={item} onSelectArticle={onSelectArticle} />
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;
