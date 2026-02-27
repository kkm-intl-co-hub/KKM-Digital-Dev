

import * as React from 'react';
import { Page } from '../types';
import type { MapMarker } from '../types';
import { useLanguage } from '../LanguageContext';
import PageHeader from '../components/PageHeader';
import InteractiveMap from '../components/InteractiveMap';
import { motion, AnimatePresence } from 'framer-motion';

const FormField: React.FC<{
    id: string;
    label: string;
    children: React.ReactNode;
    error?: string;
}> = ({ id, label, children, error }) => (
    <div className="relative">
        <label htmlFor={id} className="block text-sm font-medium text-text-light dark:text-slate-300 mb-1">{label}</label>
        {children}
        <AnimatePresence>
            {error && (
                <motion.p
                    id={`${id}-error`}
                    role="alert"
                    aria-live="polite"
                    className="text-red-500 text-xs mt-1 font-semibold flex items-center gap-1"
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
);

const CommTierCard: React.FC<{ title: string; description: string; icon: React.ReactNode; color: string }> = ({ title, description, icon, color }) => (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-t-4 ${color} flex flex-col h-full hover:shadow-xl transition-shadow`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gray-50 dark:bg-slate-700">
                {icon}
            </div>
            <h3 className="font-display font-bold text-lg text-primary-dark dark:text-white leading-tight">{title}</h3>
        </div>
        <p className="text-sm text-text-light dark:text-slate-300 leading-relaxed flex-grow">{description}</p>
    </div>
);

const ContactPage: React.FC = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = React.useState({ name: '', email: '', subject: '', message: '', _gotcha: '' });
    const [captcha, setCaptcha] = React.useState({ a: 0, b: 0, answer: '' });
    const [errors, setErrors] = React.useState<{ [key: string]: string | undefined }>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formSubmittedSuccessfully, setFormSubmittedSuccessfully] = React.useState(false);
    const [activeLocation, setActiveLocation] = React.useState<MapMarker | null>(null);

    const officeLocations: MapMarker[] = React.useMemo(() => [
        {
            name: t('HeadOffice'),
            description: t('TehranOfficeAddress'),
            coordinates: { lat: 35.7646896, lng: 51.4163221 },
            category: 'Head Office',
            imageUrl: 'https://picsum.photos/seed/tehran-office/200/150',
            type: 'office',
        },
        {
            name: t('BranchOffice'),
            description: t('QeshmAddress'),
            coordinates: { lat: 26.9583, lng: 56.2722 },
            category: 'Branch Office',
            imageUrl: 'https://picsum.photos/seed/qeshm-office/200/150',
            type: 'office',
        },
    ], [t]);
    
    const generateCaptcha = React.useCallback(() => {
        setCaptcha({
            a: Math.floor(Math.random() * 10) + 1,
            b: Math.floor(Math.random() * 10) + 1,
            answer: ''
        });
    }, []);

    React.useEffect(() => {
        // Set the head office as the default active location on load
        if (officeLocations.length > 0) {
            setActiveLocation(officeLocations[0]);
        }
        generateCaptcha();
    }, [officeLocations, generateCaptcha]);

    const validateField = (name: string, value: string): string => {
        const trimmed = value.trim();
        switch (name) {
            case 'name':
                if (!trimmed) return t('ValidationRequired', { field: t('FullName') });
                if (trimmed.length < 2) return t('ValidationMinLength', { field: t('FullName'), min: 2 });
                if (trimmed.length > 50) return t('ValidationMaxLength', { field: t('FullName'), max: 50 });
                break;
            case 'email':
                if (!trimmed) return t('ValidationRequired', { field: t('EmailAddress') });
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t('ValidationInvalid', { field: t('EmailAddress') });
                break;
            case 'subject':
                if (!trimmed) return t('ValidationRequired', { field: t('Subject') });
                if (trimmed.length < 5) return t('ValidationMinLength', { field: t('Subject'), min: 5 });
                if (trimmed.length > 100) return t('ValidationMaxLength', { field: t('Subject'), max: 100 });
                break;
            case 'message':
                if (!trimmed) return t('ValidationRequired', { field: t('Message') });
                if (trimmed.length < 10) return t('ValidationMinLength', { field: t('Message'), min: 10 });
                if (trimmed.length > 1000) return t('ValidationMaxLength', { field: t('Message'), max: 1000 });
                break;
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'captcha') {
            setCaptcha(prev => ({ ...prev, answer: value }));
            if (errors.captcha) setErrors(prev => ({ ...prev, captcha: undefined }));
            return;
        }

        // Honeypot handler
        if (name === '_gotcha') {
            setFormData(prev => ({ ...prev, [name]: value }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Real-time validation
        const error = validateField(name, value);
        // Only show validation errors if the field is not empty, or if there was already an error.
        if (value.trim() !== '' || errors[name]) {
             setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'captcha' || name === '_gotcha') return;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Bot check: Honeypot
        if (formData._gotcha) {
            // Silently act as if successful to fool the bot
            setFormSubmittedSuccessfully(true);
            return;
        }

        const formErrors: Partial<Record<string, string>> = {};
        let isValid = true;

        const nameError = validateField('name', formData.name);
        if (nameError) { formErrors.name = nameError; isValid = false; }
        
        const emailError = validateField('email', formData.email);
        if (emailError) { formErrors.email = emailError; isValid = false; }

        const subjectError = validateField('subject', formData.subject);
        if (subjectError) { formErrors.subject = subjectError; isValid = false; }
        
        const messageError = validateField('message', formData.message);
        if (messageError) { formErrors.message = messageError; isValid = false; }

        // Bot check: Math Captcha
        if (!captcha.answer.trim()) {
            formErrors.captcha = t('ValidationRequired', { field: t('SecurityQuestion') });
            isValid = false;
        } else if (parseInt(captcha.answer) !== captcha.a + captcha.b) {
            formErrors.captcha = t('ValidationCaptcha');
            isValid = false;
        }

        setErrors(formErrors);

        if (isValid) {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                setFormSubmittedSuccessfully(true);
            }, 1500);
        } else {
            // Optional: Regenerate captcha on error to force re-verification if desired, 
            // but usually keeping it allows user to correct typos without frustration.
        }
    };
    
    const resetForm = () => {
        setFormData({ name: '', email: '', subject: '', message: '', _gotcha: '' });
        generateCaptcha();
        setErrors({});
        setFormSubmittedSuccessfully(false);
    }
    
    const inputClasses = "w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 transition-all duration-200";
    const normalClasses = "border-gray-300 dark:border-slate-600 focus:ring-secondary";
    const errorClasses = "border-red-500 dark:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10";

    const hasErrors = Object.values(errors).some(error => error !== '' && error !== undefined);

    // Success Checkmark Animation
    const checkmarkVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: { 
            pathLength: 1, 
            opacity: 1,
            transition: { 
                duration: 0.8, 
                ease: "easeInOut",
                delay: 0.2
            } 
        }
    };

    return (
        <div>
            <PageHeader title={t(Page.Contact)} subtitle={t('ContactSubtitle')} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                         <AnimatePresence mode="wait">
                            {formSubmittedSuccessfully ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center flex flex-col items-center justify-center h-full min-h-[500px]"
                                >
                                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-16 h-16 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <motion.path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={3} 
                                                d="M5 13l4 4L19 7" 
                                                variants={checkmarkVariants}
                                                initial="hidden"
                                                animate="visible"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-display font-bold text-primary dark:text-secondary mb-4">{t('ContactFormSuccessTitle')}</h2>
                                    <p className="text-text-light dark:text-slate-300 mb-6 max-w-sm mx-auto">{t('ContactFormSuccess')}</p>
                                    <button onClick={resetForm} className="px-8 py-3 font-bold text-white bg-primary rounded-full hover:bg-secondary transition-colors duration-300 shadow-md">
                                        {t('SendAnotherMessage')}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <h2 className="text-2xl font-display font-bold text-primary dark:text-secondary mb-6">{t('SendMessage')}</h2>
                                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                        {/* Honeypot Field (Hidden) */}
                                        <div className="hidden opacity-0 h-0 w-0 overflow-hidden">
                                            <label htmlFor="_gotcha">Don't fill this out if you're human</label>
                                            <input type="text" id="_gotcha" name="_gotcha" value={formData._gotcha} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                                        </div>

                                        <FormField id="name" label={t('FullName')} error={errors.name}>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                maxLength={50}
                                                aria-label={t('FullName')}
                                                aria-required="true"
                                                aria-invalid={!!errors.name}
                                                aria-describedby={errors.name ? 'name-error' : undefined}
                                                className={`${inputClasses} ${errors.name ? errorClasses : normalClasses}`}
                                            />
                                        </FormField>
                                        <FormField id="email" label={t('EmailAddress')} error={errors.email}>
                                             <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-label={t('EmailAddress')}
                                                aria-required="true"
                                                aria-invalid={!!errors.email}
                                                aria-describedby={errors.email ? 'email-error' : undefined}
                                                className={`${inputClasses} ${errors.email ? errorClasses : normalClasses}`}
                                            />
                                        </FormField>
                                        <FormField id="subject" label={t('Subject')} error={errors.subject}>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                maxLength={100}
                                                aria-label={t('Subject')}
                                                aria-required="true"
                                                aria-invalid={!!errors.subject}
                                                aria-describedby={errors.subject ? 'subject-error' : undefined}
                                                className={`${inputClasses} ${errors.subject ? errorClasses : normalClasses}`}
                                            />
                                        </FormField>
                                        <FormField id="message" label={t('Message')} error={errors.message}>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={5}
                                                value={formData.message}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                maxLength={1000}
                                                aria-label={t('Message')}
                                                aria-required="true"
                                                aria-invalid={!!errors.message}
                                                aria-describedby={errors.message ? 'message-error' : undefined}
                                                className={`${inputClasses} ${errors.message ? errorClasses : normalClasses}`}
                                            />
                                            <div className="text-right text-xs text-gray-400 mt-1">
                                                {formData.message.length}/1000
                                            </div>
                                        </FormField>

                                        {/* Math CAPTCHA */}
                                        <FormField id="captcha" label={t('SecurityQuestion')} error={errors.captcha}>
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-md font-mono font-bold text-text-dark dark:text-white select-none">
                                                    {t('MathChallenge', { a: captcha.a, b: captcha.b })}
                                                </div>
                                                <input
                                                    type="number"
                                                    id="captcha"
                                                    name="captcha"
                                                    value={captcha.answer}
                                                    onChange={handleChange}
                                                    placeholder="?"
                                                    className={`w-24 ${inputClasses} ${errors.captcha ? errorClasses : normalClasses}`}
                                                    aria-label={t('SecurityQuestion')}
                                                    aria-required="true"
                                                />
                                            </div>
                                        </FormField>

                                        <div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || hasErrors}
                                                className="w-full px-8 py-3 font-bold text-white bg-primary rounded-full hover:bg-secondary transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                        {t('Submitting')}
                                                    </span>
                                                ) : t('SubmitInquiry')}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                         <div>
                            <h2 className="text-2xl font-display font-bold text-primary dark:text-secondary mb-4">{t('ContactInformation')}</h2>
                            <div className="space-y-4">
                            {officeLocations.map(loc => (
                                <div key={loc.name} className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${activeLocation?.name === loc.name ? 'bg-secondary/20 shadow-md' : 'hover:bg-gray-100 dark:hover:bg-slate-700/50'}`} onClick={() => setActiveLocation(loc)}>
                                    <h3 className="font-bold text-text-dark dark:text-slate-200">{loc.name}</h3>
                                    <p className="text-sm text-text-light dark:text-slate-400">{loc.description}</p>
                                </div>
                            ))}
                             <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                                <h3 className="font-bold text-text-dark dark:text-slate-200 mb-2">{t('PhoneLines')}</h3>
                                <div className="flex flex-col space-y-1">
                                    <a href={`tel:${t('CompanyPhone').replace(/\s/g, '')}`} className="text-sm text-text-light dark:text-slate-400 hover:text-primary dark:hover:text-secondary flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        {t('CompanyPhone')}
                                    </a>
                                    <div className="text-sm text-text-light dark:text-slate-400 flex items-center gap-2">
                                        <span className="font-semibold">{t('IVRLabel')}:</span>
                                        <a href={`tel:${t('IVRPhone').replace(/\s/g, '')}`} className="hover:text-primary dark:hover:text-secondary">{t('IVRPhone')}</a>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg bg-gray-200">
                            <InteractiveMap projects={officeLocations} activeProject={activeLocation} />
                        </div>
                    </div>
                </div>

                {/* Organizational Communication Matrix */}
                <div className="mt-20">
                    <h2 className="text-3xl font-display font-bold text-primary dark:text-white text-center mb-6">{t('CommMatrixTitle')}</h2>
                    <p className="text-center text-text-light dark:text-slate-300 max-w-3xl mx-auto mb-12">{t('CommMatrixSubtitle')}</p>
                    
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <CommTierCard 
                            title={t('CommTier1Title')} 
                            description={t('CommTier1Desc')} 
                            color="border-accent-dark dark:border-accent-yellow"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-dark dark:text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                        />
                        <CommTierCard 
                            title={t('CommTier2Title')} 
                            description={t('CommTier2Desc')} 
                            color="border-primary"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>}
                        />
                        <CommTierCard 
                            title={t('CommTier3Title')} 
                            description={t('CommTier3Desc')} 
                            color="border-green-500"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        />
                    </div>

                    {/* Operational Model Flow Visual */}
                    <div className="bg-gray-100 dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-slate-700">
                        <h3 className="text-xl font-display font-bold text-center text-primary-dark dark:text-white mb-8">{t('CommFlowTitle')}</h3>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm w-full md:w-auto border border-gray-200 dark:border-slate-600">
                                <span className="text-sm font-semibold text-text-light dark:text-slate-400 block mb-1">{t('CommFlowInput')}</span>
                                <div className="text-lg font-bold text-primary dark:text-secondary">+98 21 9103 0822</div>
                            </div>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            
                            <div className="bg-primary text-white p-4 rounded-lg shadow-md w-full md:w-auto">
                                <span className="text-xs opacity-80 block mb-1 uppercase tracking-wide">IVR Gateway</span>
                                <div className="text-lg font-bold">{t('CommFlowProcess')}</div>
                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>

                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm w-full md:w-auto border border-gray-200 dark:border-slate-600">
                                <span className="text-sm font-semibold text-text-light dark:text-slate-400 block mb-1">{t('CommFlowOutput')}</span>
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">Strategic / Ops / Support</div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-text-light dark:text-slate-400 mt-8 max-w-2xl mx-auto italic">
                            "{t('CommFlowDesc')}"
                        </p>
                    </div>
                </div>

                <div className="mt-20 text-center bg-white dark:bg-slate-800 p-12 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-display font-bold text-primary dark:text-secondary">{t('OtherLocationsTitle')}</h2>
                    <p className="mt-4 text-lg text-text-light dark:text-slate-300 max-w-3xl mx-auto">{t('OtherLocationsSubtitle')}</p>
                    <button 
                        className="mt-8 px-8 py-3 font-bold text-white bg-primary rounded-full hover:bg-secondary transition-colors duration-300 opacity-60 cursor-not-allowed"
                        aria-disabled="true"
                    >
                        {t('ExploreOtherLocations')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
