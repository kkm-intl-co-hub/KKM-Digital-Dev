
import * as React from 'react';
import { Page } from './types';
import type { NewsItem, GeminiSearchResult } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import { useLanguage } from './LanguageContext';
import { GoogleGenAI } from '@google/genai';
import BackToTopButton from './components/BackToTopButton';
import { PROJECTS, NEWS_ITEMS } from './constants';
import type { TranslationKey } from './translations';

// Lazy load page components
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutUsPage = React.lazy(() => import('./pages/AboutUsPage'));
const CoreTechnologiesPage = React.lazy(() => import('./pages/CoreTechnologiesPage'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const FuturesPage = React.lazy(() => import('./pages/FuturesPage'));
const InnovationHubPage = React.lazy(() => import('./pages/InnovationHubPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const ComingSoonPage = React.lazy(() => import('./pages/ComingSoonPage'));
const LegalPage = React.lazy(() => import('./pages/LegalPage'));
const NewsPage = React.lazy(() => import('./pages/NewsPage'));
const NewsArticlePage = React.lazy(() => import('./pages/NewsArticlePage'));
const SearchResultsPage = React.lazy(() => import('./pages/SearchResultsPage'));
const CareersPage = React.lazy(() => import('./pages/CareersPage'));
const InternalPortalPage = React.lazy(() => import('./pages/InternalPortalPage'));

interface PageErrorBoundaryProps {
  children?: React.ReactNode;
}

interface PageErrorBoundaryState {
  hasError: boolean;
}

// Error Boundary to catch lazy loading chunk errors
class PageErrorBoundary extends React.Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  public state: PageErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Page Loading Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-gray-50 dark:bg-slate-900">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-200 mb-2">Unable to load content</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">There was a problem loading this page. This might be due to a network issue or a recent update.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-secondary transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
    <p className="text-text-light dark:text-slate-400 font-medium animate-pulse">Loading content...</p>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<Page>(Page.Home);
  const [selectedArticle, setSelectedArticle] = React.useState<NewsItem | null>(null);
  const [searchResults, setSearchResults] = React.useState<GeminiSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { t } = useLanguage();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedArticle]);

  // Determine SEO Properties based on state
  let title: string;
  let description = 'Engineering a Sustainable Future.';

  if (currentPage === Page.News && selectedArticle) {
     title = `${selectedArticle.title} | KKM News`;
     description = selectedArticle.excerpt;
  } else if (currentPage === Page.SearchResults) {
     title = `Search Results: ${searchQuery} | KKM`;
  } else {
     const pageName = t(currentPage as TranslationKey) || currentPage;
     title = `${pageName} | KKM International Group`;
     
     if (currentPage === Page.Home) {
         title = "KKM International Group | Engineering a Sustainable Future";
         description = 'A corporate portal for KKM International Group, showcasing core technologies, projects, and innovations in engineering a sustainable future.';
     } else if (currentPage === Page.Careers) {
         description = 'Join the KKM team. Explore career opportunities and job openings in engineering, R&D, and more.';
     } else if (currentPage === Page.Projects) {
         description = 'Explore KKM International Group\'s pioneering projects and pilots in sustainable infrastructure and energy.';
     } else if (currentPage === Page.CoreTechnologies) {
         // Optimized description with keywords
         description = 'Discover the GMEL Ecosystem and our breakthrough technologies: Closed-Loop Geothermal (CLG), Green Hydrogen (H2Cell), Thermal Desalination, and AI-driven Energy Health Sensors (EHS).';
     }
  }

  const handleSelectArticle = (article: NewsItem) => {
    setSelectedArticle(article);
    setCurrentPage(Page.News);
  };

  const handleBackToToNews = () => {
    setSelectedArticle(null);
    setCurrentPage(Page.News);
  };
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setCurrentPage(Page.SearchResults); // Navigate immediately to show loading state
    setSearchResults(null); // Clear previous results and trigger loading state

    try {
        const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const lowerCaseQuery = query.toLowerCase();

        // 1. Local Search
        const foundProjects = PROJECTS.filter(p => 
            p.name.toLowerCase().includes(lowerCaseQuery) ||
            p.description.toLowerCase().includes(lowerCaseQuery) ||
            p.detailedContent.toLowerCase().includes(lowerCaseQuery) ||
            p.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
        );

        const foundNews = NEWS_ITEMS.filter(n =>
            n.title.toLowerCase().includes(lowerCaseQuery) ||
            n.excerpt.toLowerCase().includes(lowerCaseQuery) ||
            n.content.toLowerCase().includes(lowerCaseQuery)
        );
        
        if (foundProjects.length > 0 || foundNews.length > 0) {
            // 2. Summarize local content
            let context = "INTERNAL KKM DOCUMENTATION:\n\n";
            
            if (foundProjects.length > 0) {
              context += "=== PROJECTS ===\n";
              foundProjects.forEach(p => {
                context += `Project Name: ${p.name}\nDescription: ${p.description}\nDetails: ${p.detailedContent}\n\n`;
              });
            }
            
            if (foundNews.length > 0) {
              context += "=== NEWS ARTICLES ===\n";
              foundNews.forEach(n => {
                context += `Article Title: ${n.title}\nDate: ${n.date}\nContent: ${n.content}\n\n`;
              });
            }
    
            const prompt = `You are a helpful assistant for KKM International Group. Based ONLY on the internal documentation provided below, answer the user's query. Provide a clear and concise summary. Do not use any external knowledge or web search capabilities.\n\nUser Query: "${query}"\n\n${context}`;
    
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
    
            setSearchResults({ summary: response.text || "No summary available.", sources: [], sourceType: 'internal' });

        } else {
            // 3. Fallback to Web Search
            const prompt = `You are a helpful assistant for KKM International Group. Your task is to provide a comprehensive and informative answer to user queries based on real-time, verifiable information from the web. The user is asking about news, projects, or other aspects related to KKM International Group.\nUser Query: "${query}"\nPlease provide a summary based on your search findings.`;

            let response;
            try {
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        tools: [{ googleSearch: {} }],
                    },
                });
            } catch (searchError) {
                 const err = searchError as { message?: string };
                 console.warn("Google Search grounding failed or quota exceeded, falling back to standard generation.", err);
                 response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt + "\n\n(Note: Real-time web search is currently unavailable. Please answer based on your general knowledge base.)",
                });
            }

            const summary = response.text || "No results found.";
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

            setSearchResults({ summary, sources, sourceType: 'web' });
        }

    } catch (error) {
        const err = error as { message?: string; status?: number };
        // Detect Quota errors
        const isQuotaError = err.message?.includes('429') || err.status === 429 || err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED');
        
        if (isQuotaError) {
             console.warn("Search failed due to API quota exhaustion.");
             setSearchResults({
                summary: "Our AI search assistant is experiencing high traffic. Please try again later or browse our Projects and News sections directly.",
                sources: [],
            });
        } else {
            console.error("Error during Gemini API call:", error);
            setSearchResults({
                summary: "Sorry, we couldn't complete your search at this moment. Please try again later.",
                sources: [],
            });
        }
    }
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.5
  } as const;

  const renderPage = () => {
    let pageComponent;
    switch (currentPage) {
      case Page.Home:
        pageComponent = <HomePage setPage={setCurrentPage} onSelectArticle={handleSelectArticle} />;
        break;
      case Page.AboutUs:
        pageComponent = <AboutUsPage setPage={setCurrentPage} />;
        break;
      case Page.CoreTechnologies:
        pageComponent = <CoreTechnologiesPage />;
        break;
      case Page.Projects:
        pageComponent = <ProjectsPage setPage={setCurrentPage} />;
        break;
      case Page.Futures:
        pageComponent = <FuturesPage />;
        break;
      case Page.InnovationHub:
        pageComponent = <InnovationHubPage />;
        break;
      case Page.Contact:
        pageComponent = <ContactPage />;
        break;
      case Page.News:
        pageComponent = selectedArticle 
            ? <NewsArticlePage article={selectedArticle} onBack={handleBackToToNews} /> 
            : <NewsPage onSelectArticle={handleSelectArticle} />;
        break;
      case Page.Legal:
        pageComponent = <LegalPage />;
        break;
      case Page.SearchResults:
        pageComponent = <SearchResultsPage result={searchResults} query={searchQuery} />;
        break;
      case Page.Careers:
        pageComponent = <CareersPage />;
        break;
      case Page.InternalPortal:
        pageComponent = <InternalPortalPage />;
        break;
      default:
        pageComponent = <ComingSoonPage pageTitle={currentPage} />;
        break;
    }

    return (
      <motion.div
        key={currentPage + (selectedArticle?.title || '')}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <PageErrorBoundary>
            <React.Suspense fallback={<PageLoader />}>
            {pageComponent}
            </React.Suspense>
        </PageErrorBoundary>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-text-dark dark:text-slate-200">
      <SEOHead title={title} description={description} />
      <Header currentPage={currentPage} setPage={setCurrentPage} onSearch={handleSearch} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>
      <Footer setPage={setCurrentPage} currentPage={currentPage} />
      <BackToTopButton />
    </div>
  );
};

export default App;
