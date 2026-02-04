
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
        case 'EN': // US Flag
            return (
                <svg viewBox="0 0 640 480" className={className}>
                    <path fill="#bd3d44" d="M0 0h640v480H0"/>
                    <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
                    <path fill="#192f5d" d="M0 0h296v259H0"/>
                    <marker id="us-a" markerHeight="30" markerWidth="30">
                        <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z"/>
                    </marker>
                    <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" transform="translate(35 25) scale(0.7)"/>
                    {/* Simplified stars for file size/rendering */}
                    <circle cx="35" cy="25" r="15" fill="#fff" opacity="0.8" /> 
                    <circle cx="100" cy="25" r="10" fill="#fff" opacity="0.8" />
                    <circle cx="165" cy="25" r="10" fill="#fff" opacity="0.8" />
                    <circle cx="230" cy="25" r="10" fill="#fff" opacity="0.8" />
                    <circle cx="67" cy="65" r="10" fill="#fff" opacity="0.8" />
                    <circle cx="132" cy="65" r="10" fill="#fff" opacity="0.8" />
                    <circle cx="197" cy="65" r="10" fill="#fff" opacity="0.8" />
                    <circle cx="262" cy="65" r="10" fill="#fff" opacity="0.8" />
                </svg>
            );
        case 'FA': // Iran Flag
            return (
                <svg viewBox="0 0 640 480" className={className}>
                    <path fill="#239f40" d="M0 0h640v160H0z"/>
                    <path fill="#fff" d="M0 160h640v160H0z"/>
                    <path fill="#da0000" d="M0 320h640v160H0z"/>
                    <path fill="#da0000" d="M320 205c-15 0-20 10-20 20s10 20 20 20 20-10 20-20-5-20-20-20m0-15c-10 0-15-20-15-30 0 15 5 25 15 25s15-10 15-25c0 10-5 30-15 30" transform="scale(0.8) translate(130, 60)" /> 
                </svg>
            );
        case 'KU': // Kurdistan Flag
            return (
                <svg viewBox="0 0 640 480" className={className}>
                    <path fill="#eb2d32" d="M0 0h640v160H0z"/>
                    <path fill="#fff" d="M0 160h640v160H0z"/>
                    <path fill="#278e43" d="M0 320h640v160H0z"/>
                    <circle cx="320" cy="240" r="50" fill="#ffc20e"/>
                    {/* Simplified Sun rays */}
                    <path fill="#ffc20e" d="M320 170l15 50-15-50z" />
                </svg>
            );
        case 'AR': // Generic Arab/League Flag style (Green)
            return (
                <svg viewBox="0 0 640 480" className={className}>
                    <path fill="#007a3d" d="M0 0h640v480H0z"/>
                    <path fill="#fff" d="M0 0h640v160H0z" opacity="0.2"/> {/* Texture/Variant */}
                    <text x="320" y="260" fontSize="150" fill="white" textAnchor="middle" fontFamily="serif" opacity="0.9">ع</text>
                </svg>
            );
        default:
            return null;
    }
}

/**
 * Accessible KKM Logo Component
 * Matches the visual identity of the "Drop & Sun" logo.
 */
const KkmLogo: React.FC = () => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? 'white' : '#002D56';

    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="cursor-pointer"
        >
            <motion.svg 
                width="140" height="160" viewBox="0 0 220 260" 
                className="h-20 md:h-24 w-auto overflow-visible" 
                role="img"
                aria-hidden="true"
                variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.05 }
                }}
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
                    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                
                <g transform="translate(10, 10)">
                    {/* The Sun - Central Core */}
                    <motion.circle 
                        cx="100" cy="110" r="38" 
                        fill="url(#logoSunGrad)"
                        variants={{
                            rest: { scale: 1 },
                            hover: { 
                                scale: 1.15,
                                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.7))",
                                transition: { duration: 0.6, yoyo: Infinity }
                            }
                        }}
                    />

                    {/* The Blue Drop / Wave Wrapper - Carefully drawn to look like the brand image */}
                    {/* Left swoosh curving up */}
                    <motion.path 
                        d="M 100 175 C 60 175 30 145 30 110 C 30 80 50 40 85 10 C 95 20 100 35 90 55 C 60 70 55 90 55 110 C 55 135 75 155 100 155 C 125 155 145 135 145 110 C 145 90 135 75 125 50 C 145 40 165 30 170 60 C 175 90 160 135 140 155 C 130 165 115 175 100 175 Z"
                        fill="url(#logoBlueGrad)"
                        fillRule="evenodd"
                        variants={{
                            rest: { y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" },
                            hover: { 
                                y: -4,
                                filter: "drop-shadow(0 6px 8px rgba(0, 45, 86, 0.3))",
                                transition: { duration: 0.5, ease: "easeInOut" }
                            }
                        }}
                    />
                </g>

                {/* Text: K.K.M. */}
                <text
                    x="110"
                    y="215"
                    textAnchor="middle"
                    fontSize="46"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="900"
                    fill={textColor}
                    letterSpacing="2"
                >
                    K.K.M.
                </text>

                {/* Text: INTERNATIONAL */}
                <text
                    x="110"
                    y="245"
                    textAnchor="middle"
                    fontSize="19"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="700"
                    fill={textColor}
                    letterSpacing="2.5"
                >
                    INTERNATIONAL
                </text>
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
  
  const headerRef = React.useRef<HTMLElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const langMenuRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Language Display Names
  const langNames: Record<Language, string> = {
      'EN': 'English',
      'FA': 'فارسی',
      'AR': 'العربية',
      'KU': 'کوردی'
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  React.useEffect(() => {
    if (isLangMenuOpen || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLangMenuOpen, isMenuOpen]);
  
  React.useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setOpenMobileSubMenu(null);
  }, [currentPage]);
  
  React.useEffect(() => {
      if(isSearchOpen) {
          searchInputRef.current?.focus();
      }
  }, [isSearchOpen]);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
            setIsLangMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langMenuRef]);

  const handleLangKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
          setIsLangMenuOpen(false);
      }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  
  const handleMouseEnter = (linkName: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setHoveredLink(linkName);
  };

  const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
          setHoveredLink(null);
      }, 150);
  };

  const mobileMenuVariants = {
    closed: { 
        height: 0, 
        opacity: 0,
        transition: {
            duration: 0.3,
            when: "afterChildren",
        }
    },
    open: { 
        height: 'auto', 
        opacity: 1,
        transition: {
            duration: 0.3,
            when: "beforeChildren",
            staggerChildren: 0.05
        }
    }
  };

  const mobileItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const desktopDropdownVariants = {
      hidden: { opacity: 0, y: -5, height: 0, overflow: 'hidden' },
      visible: { opacity: 1, y: 0, height: 'auto', overflow: 'visible' },
      exit: { opacity: 0, y: -5, height: 0, overflow: 'hidden' }
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out ${
        isScrolled || isMenuOpen || isSearchOpen 
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg py-1 border-b border-gray-200 dark:border-slate-800' 
        : 'bg-transparent py-2'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button 
                onClick={() => setPage(Page.Home)} 
                className="block logo-container focus:outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-accent-yellow" 
                aria-label={t('AriaLabel_GoHome')}
            >
              <KkmLogo />
            </button>
            <p className={`text-center text-[10px] italic -mt-3 hidden md:block opacity-80 transition-colors ${isScrolled ? 'text-text-light dark:text-slate-400' : 'text-text-dark dark:text-slate-300'}`}>{t('FooterSlogan')}</p>
          </div>

          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label={t('AriaLabel_MainNavigation')}>
            {NAV_LINKS.map(link => {
              const isActive = currentPage === link.name;
              
              if (link.subLinks && link.subLinks.length > 0) {
                return (
                  <div 
                    key={link.name} 
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter(link.name)}
                    onMouseLeave={handleMouseLeave}
                    onFocus={() => handleMouseEnter(link.name)}
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            handleMouseLeave();
                        }
                    }}
                  >
                    <button
                      onClick={() => setPage(link.name)}
                      className={`relative flex items-center gap-1 transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium z-10 ${ 
                        isActive 
                        ? 'text-white font-bold' 
                        : isScrolled ? 'text-text-dark dark:text-slate-200 hover:text-primary-dark dark:hover:text-secondary' : 'text-text-dark dark:text-slate-100 hover:text-primary-dark dark:hover:text-secondary'
                      }`}
                      aria-haspopup="true"
                      aria-expanded={hoveredLink === link.name}
                      aria-current={isActive ? 'page' : undefined}
                    >
                       {isActive && (
                        <motion.div
                            layoutId="navbar-active"
                            className="absolute inset-0 bg-primary-dark shadow-lg shadow-primary/30 rounded-md -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span>{t(link.name)}</span>
                      <motion.svg 
                        animate={{ rotate: hoveredLink === link.name ? 180 : 0 }}
                        className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        aria-hidden="true"
                      >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>
                    <AnimatePresence>
                        {hoveredLink === link.name && (
                            <motion.div 
                                key="dropdown"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={desktopDropdownVariants}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-20 w-64"
                            >
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl py-2 ring-1 ring-black ring-opacity-5 dark:ring-slate-700 overflow-hidden" role="menu">
                                    {link.subLinks.map(subLink => (
                                    <button
                                        key={subLink.id}
                                        onClick={() => {
                                            setPage(link.name);
                                            setHoveredLink(null);
                                        }}
                                        className="block px-4 py-3 text-sm text-text-dark dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left transition-colors duration-150 border-l-4 border-transparent hover:border-primary-dark focus:outline-none focus:bg-gray-100 dark:focus:bg-slate-700"
                                        role="menuitem"
                                    >
                                        {subLink.name}
                                    </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <button
                  key={link.name}
                  onClick={() => setPage(link.name)}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 z-10 ${ 
                    isActive 
                    ? 'text-white font-bold' 
                    : isScrolled ? 'text-text-dark dark:text-slate-200 hover:text-primary-dark dark:hover:text-secondary' : 'text-text-dark dark:text-slate-100 hover:text-primary-dark dark:hover:text-secondary'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                    {isActive && (
                        <motion.div
                            layoutId="navbar-active"
                            className="absolute inset-0 bg-primary-dark shadow-lg shadow-primary/30 rounded-md -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                  <span>{t(link.name)}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <motion.button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${isScrolled ? 'hover:bg-gray-200 dark:hover:bg-slate-700' : 'hover:bg-white/20'}`}
                aria-label={t('AriaLabel_SearchToggle')}
                aria-expanded={isSearchOpen}
                whileTap={{ scale: 0.9 }}
            >
                <motion.div
                    animate={{ rotate: isSearchOpen ? 90 : 0, scale: isSearchOpen ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isScrolled ? 'text-text-dark dark:text-slate-200' : 'text-text-dark dark:text-slate-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </motion.div>
            </motion.button>
            
            <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${isScrolled ? 'hover:bg-gray-200 dark:hover:bg-slate-700' : 'hover:bg-white/20'}`} 
                aria-label={t('AriaLabel_ThemeToggle')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isScrolled ? 'text-text-dark' : 'text-text-dark dark:text-slate-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    )}
                </motion.div>
              </AnimatePresence>
            </button>
            
            <div className="relative" ref={langMenuRef}>
                <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    onKeyDown={handleLangKeyDown}
                    className={`p-2 rounded-full transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary ${isScrolled ? 'hover:bg-gray-200 dark:hover:bg-slate-700' : 'hover:bg-white/20'}`}
                    aria-haspopup="true"
                    aria-expanded={isLangMenuOpen}
                    aria-label={t('AriaLabel_LanguageSelector')}
                >
                    <FlagIcon lang={language} className="w-6 h-6 shadow-sm rounded-sm overflow-hidden" />
                    <span className={`hidden sm:inline text-sm font-bold ${isScrolled ? 'text-text-dark dark:text-slate-200' : 'text-text-dark dark:text-slate-100'}`}>{language}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isScrolled ? 'text-text-dark dark:text-slate-200' : 'text-text-dark dark:text-slate-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <AnimatePresence>
                    {isLangMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl py-2 ring-1 ring-black ring-opacity-5 dark:ring-slate-700 z-50 overflow-hidden"
                            role="menu"
                        >
                            {(['EN', 'FA', 'AR', 'KU'] as Language[]).map(lang => (
                                <button 
                                    key={lang} 
                                    onClick={() => {
                                        setLanguage(lang);
                                        setIsLangMenuOpen(false);
                                    }} 
                                    className={`flex items-center gap-3 px-4 py-3 text-sm w-full text-left transition-colors ${
                                        language === lang 
                                            ? 'bg-primary/10 text-primary-dark dark:text-secondary font-bold' 
                                            : 'text-text-dark dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                                    }`}
                                    role="menuitem"
                                >
                                    <FlagIcon lang={lang} className="w-5 h-5 rounded-sm shadow-sm" />
                                    <span>{langNames[lang]}</span>
                                    {language === lang && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="lg:hidden">
              <motion.button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`p-2 rounded-md transition-colors ${isScrolled ? 'hover:bg-gray-200 dark:hover:bg-slate-700' : 'hover:bg-white/20'}`}
                aria-controls="mobile-menu" 
                aria-expanded={isMenuOpen} 
                aria-label={t('AriaLabel_MobileMenu')}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isScrolled ? 'text-text-dark dark:text-slate-200' : 'text-text-dark dark:text-slate-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></motion.svg>
                    ) : (
                      <motion.svg key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isScrolled ? 'text-text-dark dark:text-slate-200' : 'text-text-dark dark:text-slate-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></motion.svg>
                    )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <form onSubmit={handleSearchSubmit} className="py-4">
                <div className="relative">
                  <input ref={searchInputRef} type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('SearchPlaceholder')} className="w-full pl-4 pr-20 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary text-text-dark dark:text-slate-200" aria-label={t('Search')} />
                  <button type="submit" className="absolute inset-y-0 right-0 px-6 font-bold text-sm text-primary-dark dark:text-secondary hover:text-accent-dark dark:hover:text-accent-yellow">
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
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="lg:hidden overflow-hidden h-screen absolute top-20 left-0 right-0 z-50" 
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('AriaLabel_MobileMenu')}
          >
            <div className="px-2 pt-2 pb-20 space-y-1 sm:px-3 bg-white/95 dark:bg-slate-900/95 border-t border-gray-200 dark:border-slate-700 backdrop-blur-sm overflow-y-auto h-full">
              {NAV_LINKS.map(link => {
                if (link.subLinks && link.subLinks.length > 0) {
                    const isOpen = openMobileSubMenu === link.name;
                    return (
                        <motion.div key={link.name} variants={mobileItemVariants}>
                            <button
                                onClick={() => setOpenMobileSubMenu(isOpen ? null : link.name)}
                                className={`flex justify-between items-center w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${ currentPage === link.name ? 'text-primary-dark dark:text-secondary' : 'text-text-dark dark:text-slate-200 hover:text-primary-dark dark:hover:text-secondary'}`}
                                aria-expanded={isOpen}
                                aria-haspopup="true"
                            >
                                <span>{t(link.name)}</span>
                                <motion.svg
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>
                             <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pl-5 mt-1"
                                    >
                                        <div className="flex flex-col space-y-1 border-l-2 border-secondary/50 dark:border-primary/50">
                                            {link.subLinks.map(subLink => (
                                                <button
                                                    key={subLink.id}
                                                    onClick={() => {
                                                        setPage(link.name);
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="block w-full text-left pl-3 py-2 rounded-md text-base font-medium text-text-dark dark:text-slate-200 hover:text-primary-dark dark:hover:text-secondary"
                                                >
                                                    {subLink.name}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </motion.div>
                    );
                }
                return (
                    <motion.button
                        key={link.name}
                        variants={mobileItemVariants}
                        onClick={() => {
                            setPage(link.name);
                            setIsMenuOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${ currentPage === link.name ? 'text-primary-dark dark:text-secondary font-bold bg-primary/5 dark:bg-secondary/5' : 'text-text-dark dark:text-slate-200 hover:text-primary-dark dark:hover:text-secondary'}`}
                        aria-current={currentPage === link.name ? 'page' : undefined}
                    >
                        {t(link.name)}
                    </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-primary origin-left"
        style={{ scaleX }}
      />
    </header>
  );
};

export default Header;
