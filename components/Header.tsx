import * as React from 'react';
import { Page } from '../types';
import { NAV_LINKS } from '../constants';
import { useLanguage } from '../LanguageContext';
import type { Language } from '../LanguageContext';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '../ThemeContext';

interface HeaderProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  onSearch: (query: string) => void;
}

const FlagIcon: React.FC<{ lang: Language, className?: string }> = ({ lang, className = "w-6 h-6" }) => {
    switch (lang) {
        case 'EN': // Detailed US Flag
            return (
                <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect width="640" height="480" fill="#3c3b6e"/>
                    <path d="M0 37h640m0 74H0m0 74h640m0 74H0m0 74h640m0 74H0" stroke="#fff" strokeWidth="37"/>
                    <path d="M0 0h256v175.4H0" fill="#3c3b6e"/>
                    <g fill="#fff">
                        <g id="s">
                            <g id="t">
                                <path id="u" d="M30 22h10v10h10v10H40v10H30V42H20V32h10z" transform="scale(.1)"/>
                                <use href="#u" x="40"/><use href="#u" x="80"/><use href="#u" x="120"/><use href="#u" x="160"/><use href="#u" x="200"/>
                            </g>
                            <use href="#t" x="20" y="20"/>
                            <use href="#t" y="40"/>
                            <use href="#t" x="20" y="60"/>
                            <use href="#t" y="80"/>
                        </g>
                    </g>
                    <rect width="640" height="480" fill="none" stroke="#eee" strokeWidth="1" opacity="0.1"/>
                </svg>
            );
        case 'FA': // Detailed Iran Flag
            return (
                <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path fill="#239f40" d="M0 0h640v160H0z"/>
                    <path fill="#fff" d="M0 160h640v160H0z"/>
                    <path fill="#da0000" d="M0 320h640v160H0z"/>
                    <circle cx="320" cy="240" r="45" fill="#da0000"/>
                    <path fill="#fff" d="M320 205c-15 0-20 10-20 20s10 20 20 20 20-10 20-20-5-20-20-20m0-15c-10 0-15-20-15-30 0 15 5 25 15 25s15-10 15-25c0 10-5 30-15 30" transform="scale(0.8) translate(80, 60)" /> 
                </svg>
            );
        case 'KU': // Detailed Kurdistan Flag
            return (
                <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
                    <path fill="#ed2024" d="M0 0h640v160H0z"/>
                    <path fill="#fff" d="M0 160h640v160H0z"/>
                    <path fill="#278e43" d="M0 320h640v160H0z"/>
                    <circle cx="320" cy="240" r="60" fill="#febd11"/>
                    <path fill="#febd11" d="M320 150l10 50 40-30-20 50 50 10-50 10 20 50-40-30-10 50-10-50-40 30 20-50-50-10 50-10-20-50 40 30z"/>
                </svg>
            );
        case 'AR': // Arabic Language Icon (Calligraphic)
            return (
                <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect width="640" height="480" rx="40" fill="#007a3d"/>
                    <text x="320" y="320" fontSize="240" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="serif">ع</text>
                    <path d="M0 0h640v120H0z" fill="#fff" opacity="0.1"/>
                </svg>
            );
        default:
            return null;
    }
}

const KkmLogo: React.FC = () => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? 'white' : '#002D56';

    return (
        <motion.div initial="rest" whileHover="hover" animate="rest" className="cursor-pointer">
            <motion.svg 
                width="140" height="160" viewBox="0 0 220 260" 
                className="h-16 md:h-24 w-auto overflow-visible" 
                role="img" aria-hidden="true"
                variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <defs>
                    <linearGradient id="logoBlueGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#002D56" />
                        <stop offset="100%" stopColor="#00BFFF" />
                    </linearGradient>
                    <radialGradient id="logoSunGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FF8C00" />
                    </radialGradient>
                </defs>
                <g transform="translate(10, 10)">
                    <motion.circle cx="100" cy="110" r="38" fill="url(#logoSunGrad)" variants={{ rest: { scale: 1 }, hover: { scale: 1.12 } }} />
                    <motion.path 
                        d="M 100 175 C 60 175 30 145 30 110 C 30 80 50 40 85 10 C 95 20 100 35 90 55 C 60 70 55 90 55 110 C 55 135 75 155 100 155 C 125 155 145 135 145 110 C 145 90 135 75 125 50 C 145 40 165 30 170 60 C 175 90 160 135 140 155 C 130 165 115 175 100 175 Z"
                        fill="url(#logoBlueGrad)" fillRule="evenodd"
                        variants={{ rest: { y: 0 }, hover: { y: -4 } }}
                    />
                </g>
                <text x="110" y="215" textAnchor="middle" fontSize="46" fontFamily="Montserrat, sans-serif" fontWeight="900" fill={textColor} letterSpacing="2">K.K.M.</text>
                <text x="110" y="245" textAnchor="middle" fontSize="19" fontFamily="Montserrat, sans-serif" fontWeight="700" fill={textColor} letterSpacing="2.5">INTERNATIONAL</text>
            </motion.svg>
        </motion.div>
    );
};

const Header: React.FC<HeaderProps> = ({ currentPage, setPage, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState<boolean>(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = React.useState<Page | null>(null);
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);
  
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const langMenuRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const langNames: Record<Language, string> = {
      'EN': 'English',
      'FA': 'فارسی',
      'AR': 'العربية',
      'KU': 'کوردی'
  };

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  React.useEffect(() => {
    document.body.style.overflow = (isLangMenuOpen || isMenuOpen) ? 'hidden' : 'unset';
  }, [isLangMenuOpen, isMenuOpen]);
  
  React.useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [currentPage]);
  
  React.useEffect(() => {
    if(isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);
  
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setIsLangMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled || isMenuOpen || isSearchOpen ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-slate-800' : 'bg-transparent py-1'}`} role="banner">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="flex-shrink-0">
            <button onClick={() => setPage(Page.Home)} className="block logo-container focus:outline-none rounded-lg" aria-label={t('AriaLabel_GoHome')}>
              <KkmLogo />
            </button>
          </div>

          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label={t('AriaLabel_MainNavigation')}>
            {NAV_LINKS.map(link => {
              const isActive = currentPage === link.name;
              return (
                <button key={link.name} onClick={() => setPage(link.name)} className={`relative px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 z-10 ${isActive ? 'text-white' : isScrolled ? 'text-text-dark dark:text-slate-200 hover:text-primary' : 'text-text-dark dark:text-slate-100 hover:text-primary-dark'}`}>
                  {isActive && <motion.div layoutId="navbar-active" className="absolute inset-0 bg-primary-dark shadow-lg rounded-md -z-10" />}
                  <span>{t(link.name)}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-2">
            <motion.button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-gray-200 dark:hover:bg-slate-700' : 'hover:bg-white/20'}`} aria-label={t('AriaLabel_SearchToggle')} whileTap={{ scale: 0.9 }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </motion.button>
            
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-gray-200 dark:hover:bg-slate-700' : 'hover:bg-white/20'}`} aria-label={t('AriaLabel_ThemeToggle')}>
              {theme === 'light' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            </button>
            
            <div className="relative" ref={langMenuRef}>
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className={`p-1.5 md:p-2 rounded-full transition-colors flex items-center gap-2 border border-transparent ${isScrolled ? 'hover:bg-gray-200 dark:hover:bg-slate-700' : 'hover:bg-white/20'} ${isLangMenuOpen ? 'bg-primary/10 border-primary/20' : ''}`} aria-label={t('AriaLabel_LanguageSelector')}>
                    <FlagIcon lang={language} className="w-6 h-6 shadow-md rounded-sm overflow-hidden" />
                    <span className="hidden md:inline text-xs font-black uppercase tracking-widest text-primary-dark dark:text-secondary">{langNames[language]}</span>
                    <span className="md:hidden text-[10px] font-bold dark:text-slate-200">{language}</span>
                </button>
                <AnimatePresence>
                    {isLangMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl py-2 ring-1 ring-black/5 dark:ring-slate-700 z-50 overflow-hidden">
                            {(['EN', 'FA', 'AR', 'KU'] as Language[]).map(lang => (
                                <button key={lang} onClick={() => { setLanguage(lang); setIsLangMenuOpen(false); }} className={`flex items-center gap-4 px-4 py-3.5 text-sm w-full transition-all ${language === lang ? 'bg-primary/10 text-primary-dark dark:text-secondary font-extrabold border-l-4 border-primary' : 'text-text-dark dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 border-l-4 border-transparent'}`}>
                                    <FlagIcon lang={lang} className="w-6 h-6 rounded-sm shadow-sm" />
                                    <div className="flex flex-col items-start">
                                        <span className="leading-none">{langNames[lang]}</span>
                                        <span className="text-[9px] opacity-60 font-mono mt-0.5">{lang} Standard</span>
                                    </div>
                                    {language === lang && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-md ${isScrolled ? 'hover:bg-gray-200 dark:hover:bg-slate-700' : 'hover:bg-white/20'}`} aria-label={t('AriaLabel_MobileMenu')}>
                {isMenuOpen ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
              </button>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <form onSubmit={handleSearchSubmit} className="pb-6 pt-2">
                <div className="relative group">
                  <input ref={searchInputRef} type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('SearchPlaceholder')} className="w-full pl-6 pr-24 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 rounded-2xl outline-none text-text-dark dark:text-slate-200 shadow-inner transition-all" />
                  <button type="submit" className="absolute inset-y-1 right-1 px-5 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-colors text-xs tracking-widest uppercase">
                    {t('Search')}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="lg:hidden fixed inset-0 top-20 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg z-50 overflow-y-auto">
            <div className="px-6 py-8 space-y-4">
              {NAV_LINKS.map(link => (
                <button key={link.name} onClick={() => setPage(link.name)} className={`block w-full text-left p-4 rounded-2xl text-xl font-display font-bold transition-all ${currentPage === link.name ? 'bg-primary text-white shadow-xl translate-x-2' : 'text-text-dark dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
                    {t(link.name)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary origin-left" style={{ scaleX }} />
    </header>
  );
};

export default Header;