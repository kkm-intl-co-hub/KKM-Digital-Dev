import * as React from 'react';
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

const CEOBriefingWidget: React.FC = () => {
    const [headlines, setHeadlines] = React.useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const { t } = useLanguage();

    // Auto-rotate headlines
    React.useEffect(() => {
        if (headlines.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % headlines.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [headlines]);

    React.useEffect(() => {
        let isMounted = true;

        const fetchBriefing = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
                // Fallback content if no key is available to prevent crash
                if (!apiKey) {
                     if (isMounted) {
                        setHeadlines([
                            "Advancing sustainable infrastructure through closed-loop geothermal innovation.",
                            "Expanding our global footprint with new strategic partnerships in the Middle East.",
                            "Pioneering zero-emission lithium extraction to power the battery revolution.",
                            "Integrating AI-driven health sensors into next-gen energy systems."
                        ]);
                        setIsLoading(false);
                    }
                    return;
                }

                const ai = new GoogleGenAI({ apiKey });
                // Prompt asking for a list of headlines specifically
                const prompt = `From the perspective of Gino Ayyoubian, CEO of KKM International Group, generate 5 short, punchy, one-sentence news headlines about the future of geothermal energy, sustainable infrastructure, and KKM's strategic growth. Return ONLY a bulleted list. Do not use markdown formatting like bold or headers.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                if (isMounted) {
                    const text = response.text || '';
                    // Parse bullet points into an array
                    const items = text.split('\n')
                        .map(line => line.replace(/^[*•-]\s*/, '').trim())
                        .filter(line => line.length > 0);

                    if (items.length > 0) {
                        setHeadlines(items);
                    } else {
                        throw new Error("Empty response from AI");
                    }
                }
            } catch (err) {
                // Graceful handling for Quota Exceeded (429) or other API errors
                const errorObj = err as { message?: string; status?: number };
                const isQuotaError = errorObj.message?.includes('429') || errorObj.status === 429 || errorObj.message?.includes('quota') || errorObj.message?.includes('RESOURCE_EXHAUSTED');
                
                if (isQuotaError) {
                    console.warn("Gemini API Quota Exceeded for CEO Briefing. Switching to fallback content.");
                } else {
                    console.error("Error fetching CEO briefing:", err);
                }

                if (isMounted) {
                    // Fallback content on error so the widget still looks good
                    setHeadlines([
                        "Advancing sustainable infrastructure through closed-loop geothermal innovation.",
                        "Expanding our global footprint with new strategic partnerships in the Middle East.",
                        "Pioneering zero-emission lithium extraction to power the battery revolution.",
                        "Integrating AI-driven health sensors into next-gen energy systems.",
                        "KKM commits to net-zero carbon goals by 2030."
                    ]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchBriefing();

        return () => {
            isMounted = false;
        };
    }, []);
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden relative">
            <div className="flex items-center p-4 gap-4">
                {/* CEO Avatar */}
                <div className="flex-shrink-0 relative">
                    <Avatar name="Gino Ayyoubian" className="w-16 h-16 ring-2 ring-primary dark:ring-secondary" textSize="text-xl" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <h4 className="font-display font-bold text-sm text-primary dark:text-white leading-none">{t('GinoAyyoubian')}</h4>
                            <span className="text-[10px] text-text-light dark:text-slate-400 uppercase tracking-wider font-semibold">{t('CEO')}</span>
                        </div>
                        <span className="text-[10px] bg-accent-yellow/20 text-accent-dark dark:text-accent-yellow px-2 py-0.5 rounded-full font-bold">
                            {t('CEOBriefingTitle')}
                        </span>
                    </div>

                    <div className="relative h-12 flex items-center">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xs text-text-light dark:text-slate-400 italic"
                                >
                                    Loading updates...
                                </motion.div>
                            ) : (
                                <motion.p
                                    key={currentIndex}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="text-sm text-text-dark dark:text-slate-200 font-medium leading-tight line-clamp-2 absolute w-full"
                                >
                                    "{headlines[currentIndex]}"
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            {/* Progress Bar */}
            {!isLoading && headlines.length > 1 && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 dark:bg-slate-700">
                    <motion.div 
                        className="h-full bg-primary dark:bg-secondary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                    />
                </div>
            )}
        </div>
    );
};

export default CEOBriefingWidget;