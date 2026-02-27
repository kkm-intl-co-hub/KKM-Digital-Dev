import * as React from 'react';
import type { Project } from '../types';

import { useLanguage } from '../LanguageContext';
import type { TranslationKey } from '../translations';

interface ProjectMetricsChartProps {
    metrics: Project['metrics'];
}

const ProjectMetricsChart: React.FC<ProjectMetricsChartProps> = ({ metrics }) => {
    const { t } = useLanguage();
    if (!metrics) return null;

    const { budget, timeline } = metrics;
    
    return (
        <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
            <div>
                <h3 className="text-lg font-display font-semibold text-text-dark dark:text-slate-200 text-center mb-4">{t('BudgetAllocation')} ({budget.total} {budget.currency})</h3>
                <div className="space-y-3">
                    {budget.allocation.map(item => (
                        <div key={item.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-text-light dark:text-slate-300">{t(item.name as TranslationKey)}</span>
                                <span className="font-medium text-text-dark dark:text-slate-200">{item.value} {budget.currency}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2.5">
                                <div 
                                    className="h-2.5 rounded-full" 
                                    style={{ width: `${(item.value / budget.total) * 100}%`, backgroundColor: item.fill }}
                                    title={`${((item.value / budget.total) * 100).toFixed(1)}%`}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-display font-semibold text-text-dark dark:text-slate-200 mb-4">{t('ProjectTimeline')}</h3>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-text-light dark:text-slate-300">{t('StartDate')}:</span>
                        <span className="font-mono text-text-dark dark:text-slate-200">{timeline.start}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="font-semibold text-text-light dark:text-slate-300">{t('EndDate')}:</span>
                        <span className="font-mono text-text-dark dark:text-slate-200">{timeline.end}</span>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-primary dark:text-secondary">{t('Progress')}</span>
                            <span className="text-sm font-medium text-primary dark:text-secondary">{timeline.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-4">
                            <div 
                                className="bg-accent-yellow h-4 rounded-full transition-all duration-500" 
                                style={{width: `${timeline.progress}%`}}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectMetricsChart;