import * as React from 'react';
import { useInView, useMotionValue, useSpring, animate, motion, useTransform } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import type { TranslationKey } from '../translations';

interface CounterProps {
    from?: number;
    to: number;
    suffix?: string;
}

const Counter: React.FC<CounterProps> = ({ from = 0, to, suffix = '' }) => {
    const nodeRef = React.useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(from);
    
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 200,
    });
    
    const transformedValue = useTransform(springValue, (latest) => {
        return Math.round(latest).toLocaleString() + suffix;
    });

    const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

    React.useEffect(() => {
        if (isInView) {
            animate(motionValue, to, { duration: 2, ease: 'easeOut' });
        }
    }, [motionValue, isInView, to]);

    return <motion.span ref={nodeRef}>{transformedValue}</motion.span>;
};

const AnimatedStats: React.FC = () => {
    const { t } = useLanguage();

    const stats: { label: TranslationKey; value: number; suffix: string; }[] = [
        { label: 'ProjectsCompleted', value: 50, suffix: '+' },
        { label: 'TechnologiesDeveloped', value: 11, suffix: '' },
        { label: 'GlobalReachCountries', value: 8, suffix: '+' },
    ];

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };

    return (
        <section className="bg-white dark:bg-slate-800/50 border-y border-gray-200 dark:border-slate-700">
            <motion.div 
                className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map(stat => (
                        <motion.div key={stat.label} className="p-4" variants={itemVariants}>
                            <p className="text-4xl md:text-5xl font-display font-extrabold text-primary dark:text-secondary">
                                <Counter to={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="mt-2 text-lg text-text-light dark:text-slate-300">{t(stat.label)}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default AnimatedStats;