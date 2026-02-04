
import * as React from 'react';
import { Page } from '../types';
import { useLanguage } from '../LanguageContext';
import type { TranslationKey } from '../translations';

interface FooterProps {
    setPage: (page: Page) => void;
}

const KkmLogoWhite: React.FC = () => (
    <svg width="140" height="160" viewBox="0 0 220 260" className="h-20 md:h-24 w-auto" aria-labelledby="kkm-logo-title-footer">
        <title id="kkm-logo-title-footer">KKM International Group Logo</title>
        <defs>
            <radialGradient id="logoSunGradFooter" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FF8C00" />
            </radialGradient>
            <linearGradient id="logoBlueGradFooter" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E0E0E0" />
            </linearGradient>
        </defs>
        
        <g transform="translate(10, 10)">
            <circle cx="100" cy="110" r="38" fill="url(#logoSunGradFooter)"/>
            <path
                d="M 100 175 C 60 175 30 145 30 110 C 30 80 50 40 85 10 C 95 20 100 35 90 55 C 60 70 55 90 55 110 C 55 135 75 155 100 155 C 125 155 145 135 145 110 C 145 90 135 75 125 50 C 145 40 165 30 170 60 C 175 90 160 135 140 155 C 130 165 115 175 100 175 Z"
                fill="url(#logoBlueGradFooter)"
                fillRule="evenodd"
                opacity="0.9"
            />
        </g>

        <text
            x="110"
            y="215"
            textAnchor="middle"
            fontSize="46"
            fontFamily="Montserrat, sans-serif"
            fontWeight="900"
            fill="white"
            letterSpacing="2"
        >
            K.K.M.
        </text>
        <text
            x="110"
            y="245"
            textAnchor="middle"
            fontSize="19"
            fontFamily="Montserrat, sans-serif"
            fontWeight="700"
            fill="white"
            letterSpacing="2.5"
        >
            INTERNATIONAL
        </text>
    </svg>
);

const FooterLink: React.FC<{
    page: Page;
    setPage: (page: Page) => void;
    t: (key: TranslationKey, options?: { [key: string]: string | number }) => string;
    children?: React.ReactNode;
}> = ({ page, setPage, t, children }) => (
    <li>
        <button onClick={() => setPage(page)} className="text-gray-200 hover:text-white transition-colors duration-200 text-left">
            {children || t(page as TranslationKey)}
        </button>
    </li>
);

const Footer: React.FC<FooterProps> = ({ setPage }) => {
    const { t } = useLanguage();
    const [email, setEmail] = React.useState('');
    const [subscriptionState, setSubscriptionState] = React.useState<'idle' | 'loading' | 'success'>('idle');

    const quickLinks = [Page.Home, Page.AboutUs, Page.CoreTechnologies, Page.Futures, Page.Projects];
    const engagementLinks = [Page.Careers, Page.InnovationHub, Page.News, Page.Contact, Page.InternalPortal];
    
    const socialLinks = [
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/KKM.Intl.Co',
            path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z'
        },
        {
            name: 'WhatsApp',
            url: 'https://wa.me/+982191030822',
            path: 'M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.1 1.2 4.74 1.2 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2zM12.05 20.21c-1.5 0-2.97-.39-4.27-1.17l-.3-.18-3.15.83.84-3.07-.19-.31c-.82-1.32-1.25-2.85-1.25-4.4 0-4.52 3.67-8.19 8.19-8.19 2.19 0 4.24.85 5.79 2.4 1.54 1.55 2.39 3.6 2.39 5.79 0 4.52-3.68 8.19-8.2 8.19zm4.5-6.14c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.66.81-.81.98-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.24-.18-.49-.31z'
        },
        {
            name: 'WhatsApp Meeting Request',
            url: 'https://wa.me/+9891030822?text=greeting%2C%20i%20would%20like%20to%20request%20an%20in%20person%20meeting%20with%20KKM%20International%20Group.%20Thank%20you.%20Full%20Name%20%3A%20.....%20%20%20%20%2C%20Email%3A%20.............%2C%20Company%3A%20....................',
            path: 'M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.1 1.2 4.74 1.2 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2zM12.05 20.21c-1.5 0-2.97-.39-4.27-1.17l-.3-.18-3.15.83.84-3.07-.19-.31c-.82-1.32-1.25-2.85-1.25-4.4 0-4.52 3.67-8.19 8.19-8.19 2.19 0 4.24.85 5.79 2.4 1.54 1.55 2.39 3.6 2.39 5.79 0 4.52-3.68 8.19-8.2 8.19zm4.5-6.14c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.66.81-.81.98-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.24-.18-.49-.31z'
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/company/kkm-intl-co',
            path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
        },
        {
            name: 'X',
            url: 'https://x.com/i/kkm_intl_co',
            path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.617l-5.21-6.817-6.045 6.817h-3.308l7.746-8.875-7.492-10.62h6.617l4.636 6.518 5.549-6.518zm-1.465 18.885h2.32l-10.45-14.12h-2.14l10.27 14.12z'
        },
        {
            name: 'Telegram',
            url: 'https://t.me/kkm_intl',
            path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.4-1.08.39-.35-.01-1.03-.2-1.54-.37-.62-.21-1.12-.31-1.07-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z'
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/kkm.intl.co',
            path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.26.143 4.78 1.66 4.923 4.92.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.143 3.225-1.64 4.78-4.923 4.92-1.265.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.143-4.779-1.66-4.923-4.92-.058-1.265-.07-1.644-.069-4.849 0-3.204.013-3.583.069-4.849.144-3.26 1.66-4.78 4.923-4.92 1.265-.058 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'
        }
    ];

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscriptionState('loading');
            // Simulate API call
            setTimeout(() => {
                setSubscriptionState('success');
                setTimeout(() => {
                    setSubscriptionState('idle');
                    setEmail('');
                }, 3000);
            }, 1000);
        }
    };

    return (
        <footer className="bg-text-dark text-white border-t border-secondary/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo and Socials */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <button onClick={() => setPage(Page.Home)} className="flex items-center" aria-label="Go to Home page">
                             <KkmLogoWhite />
                        </button>
                        <p className="mt-4 text-gray-300 text-sm">{t('FooterSlogan')}</p>
                        
                        <div className="flex flex-wrap gap-4 mt-6">
                            {socialLinks.map(link => (
                                <a 
                                    key={link.name}
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label={link.name} 
                                    className="text-gray-300 hover:text-primary transition-all duration-300 transform hover:scale-110"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={link.path}/>
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-semibold tracking-wider uppercase border-b border-gray-700 pb-2 mb-4">{t('QuickLinks')}</h3>
                        <ul className="space-y-2">
                           {quickLinks.map(page => <FooterLink key={page} page={page} setPage={setPage} t={t} />)}
                        </ul>
                    </div>

                    {/* Engagement */}
                    <div>
                        <h3 className="font-display font-semibold tracking-wider uppercase border-b border-gray-700 pb-2 mb-4">{t('Engagement')}</h3>
                        <ul className="space-y-2">
                           {engagementLinks.map(page => <FooterLink key={page} page={page} setPage={setPage} t={t} />)}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                         <h3 className="font-display font-semibold tracking-wider uppercase border-b border-gray-700 pb-2 mb-4">{t('ConnectWithUs')}</h3>
                        <p className="text-gray-300 text-sm font-semibold">{t('HeadOffice')}</p>
                        <p className="mt-1 text-gray-300 text-sm">{t('TehranOfficeAddress')}</p>
                        <p className="mt-1 text-gray-300 text-sm"><a href={`tel:${t('CompanyPhone').replace(/\s/g, '')}`} className="hover:text-white transition-colors">{t('CompanyPhone')}</a></p>
                        <p className="mt-1 text-gray-300 text-sm"><span className="opacity-70">{t('IVRLabel')}: </span><a href={`tel:${t('IVRPhone').replace(/\s/g, '')}`} className="hover:text-white transition-colors">{t('IVRPhone')}</a></p>
                        <p className="mt-2 text-gray-300 text-sm"><a href="mailto:info@kkm-intl.org" className="hover:text-white transition-colors">info@kkm-intl.org</a></p>
                        
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <h4 className="text-sm font-semibold mb-3">Newsletter</h4>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <div className="relative">
                                    <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
                                    <input 
                                        id="newsletter-email"
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email address"
                                        className="w-full bg-gray-800 border border-gray-500 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                        required
                                        aria-required="true"
                                        aria-label="Email address for newsletter subscription"
                                        disabled={subscriptionState !== 'idle'}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={subscriptionState !== 'idle'}
                                    className={`w-full py-2 px-4 rounded text-sm font-bold transition-all duration-300 flex items-center justify-center ${subscriptionState === 'success' ? 'bg-green-600 text-white' : 'bg-primary hover:bg-secondary text-white'}`}
                                >
                                    {subscriptionState === 'loading' ? (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : subscriptionState === 'success' ? (
                                        'Subscribed!'
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>
                            </form>
                            <button 
                                onClick={() => setPage(Page.Contact)}
                                className="mt-3 text-xs text-gray-400 hover:text-white underline transition-colors w-full text-center block"
                            >
                                Or contact us directly
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm text-center md:text-left">&copy; {new Date().getFullYear()} KKM International Group. {t('AllRightsReserved')}</p>
                    <div className="flex space-x-6">
                         <button onClick={() => setPage(Page.Legal)} className="text-gray-300 hover:text-white text-sm transition-colors">{t('PrivacyPolicy')}</button>
                         <button onClick={() => setPage(Page.Legal)} className="text-gray-300 hover:text-white text-sm transition-colors">{t('TermsOfUse')}</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
