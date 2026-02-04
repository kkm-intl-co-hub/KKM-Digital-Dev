
import * as React from 'react';
import { useLanguage } from '../LanguageContext';
import type { TranslationKey } from '../translations';
import PageHeader from '../components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedStats from '../components/AnimatedStats'; 

const NotifyModal: React.FC<{onClose: () => void; t: (key: TranslationKey) => string;}> = ({ onClose, t }) => {
    const [email, setEmail] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && email.includes('@')) {
            setSubmitted(true);
            console.log(`Email submitted for notification: ${email}`);
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

const FuturesSection: React.FC<{title: string; icon: React.ReactNode; children: React.ReactNode}> = ({ title, icon, children }) => (
    <motion.div 
        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg h-full transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-primary/30"
    >
        <div className="flex items-center mb-6">
            <div className="text-accent-dark dark:text-accent-yellow mr-4 bg-primary/5 dark:bg-slate-700 p-4 rounded-xl shadow-inner">{icon}</div>
            <h3 className="text-xl font-display font-bold text-primary-dark dark:text-secondary">{title}</h3>
        </div>
        <ul className="space-y-3">
            {React.Children.map(children, (child) => (
                <div className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-text-light dark:text-slate-300 text-sm leading-relaxed">{child}</span>
                </div>
            ))}
        </ul>
    </motion.div>
);

const StrategicHorizonCard: React.FC<{ title: string; range: string; description: string; items: string[]; colorClass: string }> = ({ title, range, description, items, colorClass }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className={`relative p-6 rounded-2xl border-t-4 ${colorClass} bg-white dark:bg-slate-800 shadow-xl overflow-hidden`}
    >
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-display font-bold text-text-dark dark:text-white">{title}</h3>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-slate-700 text-text-light dark:text-slate-300 shadow-sm">{range}</span>
        </div>
        <p className="text-sm text-text-light dark:text-slate-400 mb-6 leading-relaxed min-h-[40px]">{description}</p>
        <div className="space-y-3">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center text-sm font-medium text-text-dark dark:text-slate-200 bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {item}
                </div>
            ))}
        </div>
    </motion.div>
);

type OrgMember = {
    name: TranslationKey;
    role: TranslationKey;
    desc: TranslationKey;
    rbac: TranslationKey;
}

const RoleCard: React.FC<{ member: OrgMember, t: any, onClick?: () => void }> = ({ member, t, onClick }) => {
    const isTBD = t(member.name) === '(TBD)' || t(member.name) === '(Vacant)';
    
    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all relative group overflow-hidden"
        >
            <div className={`absolute top-0 left-0 w-1 h-full ${t(member.rbac) === 'Admin' ? 'bg-red-500' : t(member.rbac) === 'Manager' ? 'bg-primary' : 'bg-secondary'}`}></div>
            <div className="flex justify-between items-start pl-3">
                <div>
                    <h4 className="font-display font-bold text-lg text-text-dark dark:text-slate-200">
                        {isTBD && onClick ? (
                            <button onClick={onClick} className="text-accent-dark dark:text-accent-yellow hover:underline text-left decoration-dashed underline-offset-4">
                                {t(member.name)}
                            </button>
                        ) : (
                             t(member.name)
                        )}
                    </h4>
                    <p className="text-primary-dark dark:text-secondary font-bold text-xs uppercase tracking-wide mt-1">{t(member.role)}</p>
                </div>
                 <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wide border ${t(member.rbac) === 'Admin' ? 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-900 dark:text-red-300' : 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900 dark:text-blue-300'}`}>
                    {t(member.rbac)}
                </span>
            </div>
            <p className="text-text-light dark:text-slate-400 text-sm mt-4 pl-3 leading-relaxed">{t(member.desc)}</p>
        </motion.div>
    )
}

const MetricCard: React.FC<{ label: string; value: string; trend?: string }> = ({ label, value, trend }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
        <p className="text-3xl md:text-4xl font-display font-extrabold text-primary dark:text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-text-light dark:text-slate-400 uppercase tracking-wider">{label}</p>
        {trend && <p className="text-xs text-green-500 mt-2 font-bold">{trend}</p>}
    </div>
);

const FuturesPage: React.FC = () => {
    const { t } = useLanguage();
    const [isNotifyModalOpen, setIsNotifyModalOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<string>('ExecutiveLeadership');

    const executiveLeadership: OrgMember[] = [
        { name: 'GinoAyyoubian', role: 'CEO', desc: 'CEODesc', rbac: 'Admin' },
        { name: 'DrRezaAsakereh', role: 'CTO', desc: 'CTODesc', rbac: 'Admin' },
        { name: 'DrKhosroJarrahian', role: 'CSO', desc: 'CSODesc', rbac: 'Manager' },
        { name: 'FaridImani', role: 'CIO', desc: 'CIODesc', rbac: 'Manager' },
        { name: 'DrPedramAbdarzadeh', role: 'CFO', desc: 'CFODesc', rbac: 'Manager' },
        { name: 'HeidarYarveicy', role: 'COO', desc: 'COODesc', rbac: 'Manager' },
    ];
    
    const seniorManagement: OrgMember[] = [
        { name: 'DrSalarHashemi', role: 'DirectorOfEnergySystems', desc: 'EnergySystemsDesc', rbac: 'Manager' },
        { name: 'MahdiGhiasy', role: 'DirectorOfBIM', desc: 'BIMDesc', rbac: 'Manager' },
        { name: 'AshkanTofangchiha', role: 'QAQCManager', desc: 'QAQCDesc', rbac: 'Reviewer' },
        { name: 'MostafaSharifi', role: 'OpExManager', desc: 'OpExDesc', rbac: 'Reviewer' },
        { name: 'BadieRazi', role: 'DirectorOfProcess', desc: 'ProcessDesc', rbac: 'Manager' },
    ];

    const corporateFunctions: OrgMember[] = [
        { name: 'MasoumehMoshar', role: 'DirectorOfPR', desc: 'PRDesc', rbac: 'Manager' },
        { name: 'HamedZatajam', role: 'DirectorOfLegal', desc: 'LegalDesc', rbac: 'Manager' },
        { name: 'SeyedJasemHosseini', role: 'DirectorOfHSE', desc: 'HSEDesc', rbac: 'Manager' },
        { name: 'Vacant', role: 'HeadOfCommercial', desc: 'CommercialDesc', rbac: 'Manager' },
        { name: 'Vacant', role: 'PeopleCultureLead', desc: 'PeopleCultureDesc', rbac: 'Manager' },
    ];
    
    const specializedRD: OrgMember[] = [
        { name: 'DrMasoumehEinabadi', role: 'HeadOfBiomedical', desc: 'BiomedicalDesc', rbac: 'Contributor' },
        { name: 'SinaAyyoubian', role: 'RDSpecialist', desc: 'RDDesc', rbac: 'Contributor' },
    ];

    const advisoryBoard: OrgMember[] = [
        { name: 'SinaAyyoubian', role: 'YouthAmbassador', desc: 'YouthAmbassadorDesc', rbac: 'Guest' },
        { name: 'DrRezaBaghdadchi', role: 'RegulatoryAdvisor', desc: 'RegulatoryDesc', rbac: 'Guest' },
        { name: 'TBD', role: 'SustainabilityAdvisor', desc: 'SustainabilityDesc', rbac: 'Guest' },
        { name: 'TBD', role: 'TechTrendsAdvisor', desc: 'TechTrendsDesc', rbac: 'Guest' },
    ];
    
    const tabs = [
        { id: 'ExecutiveLeadership', label: t('ExecutiveLeadership'), data: executiveLeadership },
        { id: 'SeniorManagement', label: t('SeniorManagement'), data: seniorManagement },
        { id: 'CorporateFunctions', label: t('CorporateFunctions'), data: corporateFunctions },
        { id: 'SpecializedRD', label: t('SpecializedRD'), data: specializedRD },
        { id: 'AdvisoryBoard', label: t('AdvisoryBoard'), data: advisoryBoard },
    ];

    const rbacLogic = [
        { level: 'Admin', scope: 'AdminScope' },
        { level: 'Manager', scope: 'ManagerScope' },
        { level: 'Reviewer', scope: 'ReviewerScope' },
        { level: 'Contributor', scope: 'ContributorScope' },
        { level: 'Guest', scope: 'GuestScope' },
    ];
    
    return (
        <div>
            {isNotifyModalOpen && <NotifyModal onClose={() => setIsNotifyModalOpen(false)} t={t} />}
            <PageHeader title={t('FuturesPageTitle')} subtitle={t('FuturesPageSubtitle')} />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-16">
                
                {/* R&D Impact Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20">
                    <MetricCard label={t('Metric_Patents')} value="12" trend="+3 this quarter" />
                    <MetricCard label={t('Metric_Prototypes')} value="7" trend="GMEL-CLG Gen 4" />
                    <MetricCard label={t('Metric_Partners')} value="15+" trend="Global Universities" />
                    <MetricCard label={t('Metric_Fund')} value="$25M" trend="Allocated 2024" />
                </div>

                {/* Strategic Horizons Map */}
                <section className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-display font-bold text-primary-dark dark:text-white">{t('StrategicHorizonsTitle')}</h2>
                        <p className="text-text-light dark:text-slate-400 mt-3 max-w-2xl mx-auto">{t('StrategicHorizonsSubtitle')}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <StrategicHorizonCard 
                            title={t('Horizon1Title')}
                            range={t('Horizon1Range')}
                            description={t('Horizon1Desc')}
                            items={[t('Horizon1Item1'), t('Horizon1Item2'), t('Horizon1Item3')]}
                            colorClass="border-blue-500"
                        />
                        <StrategicHorizonCard 
                            title={t('Horizon2Title')}
                            range={t('Horizon2Range')}
                            description={t('Horizon2Desc')}
                            items={[t('Horizon2Item1'), t('Horizon2Item2'), t('Horizon2Item3')]}
                            colorClass="border-purple-500"
                        />
                        <StrategicHorizonCard 
                            title={t('Horizon3Title')}
                            range={t('Horizon3Range')}
                            description={t('Horizon3Desc')}
                            items={[t('Horizon3Item1'), t('Horizon3Item2'), t('Horizon3Item3')]}
                            colorClass="border-accent-yellow"
                        />
                    </div>
                </section>

                {/* Strategic Pillars Grid */}
                <h2 className="text-3xl font-display font-bold text-primary-dark dark:text-white mb-8 text-center">{t('ResearchFocusAreas')}</h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-24">
                    <FuturesSection title={t('CaseStudiesTitle')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>
                        {t('CaseStudiesDesc1')}
                        {t('CaseStudiesDesc2')}
                        {t('CaseStudiesDesc3')}
                    </FuturesSection>
                    <FuturesSection title={t('MedicalEngineeringTitle')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}>
                        {t('MedicalEngineeringDesc1')}
                        {t('MedicalEngineeringDesc2')}
                        {t('MedicalEngineeringDesc3')}
                    </FuturesSection>
                    <FuturesSection title={t('IndustrialDesignTitle')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}>
                        {t('IndustrialDesignDesc1')}
                        {t('IndustrialDesignDesc2')}
                        {t('IndustrialDesignDesc3')}
                    </FuturesSection>
                    <FuturesSection title={t('TechPipelineTitle')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                        {t('TechPipelineDesc1')}
                        {t('TechPipelineDesc2')}
                        {t('TechPipelineDesc3')}
                    </FuturesSection>
                </div>

                {/* Commitment Banner */}
                <div className="bg-gradient-to-r from-primary to-text-dark text-white p-10 md:p-14 rounded-3xl shadow-2xl mb-24 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="md:w-1/3 text-center md:text-left">
                            <h2 className="text-3xl font-display font-bold text-white mb-4">{t('CommitmentTitle')}</h2>
                            <p className="text-blue-100 leading-relaxed">We dedicate significant resources to ensuring our innovations not only solve today's problems but anticipate tomorrow's needs.</p>
                        </div>
                        <div className="md:w-2/3 grid sm:grid-cols-3 gap-6 w-full">
                            {[t('CommitmentPoint1'), t('CommitmentPoint2'), t('CommitmentPoint3')].map((point, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p className="text-white font-semibold text-center">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                     {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-yellow/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                </div>

                {/* Innovation Leadership & Governance */}
                <div className="mb-24">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-display font-bold text-primary-dark dark:text-white">{t('InnovationLeadership')}</h2>
                        <p className="text-text-light dark:text-slate-400 mt-2 max-w-2xl mx-auto">{t('InnovationLeadershipDesc')}</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                    activeTab === tab.id 
                                    ? 'bg-primary text-white shadow-lg transform scale-105 ring-2 ring-offset-2 ring-primary dark:ring-offset-slate-900' 
                                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-text-dark dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-3xl min-h-[400px] border border-gray-100 dark:border-slate-700/50">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {tabs.find(t => t.id === activeTab)?.data.map((member, index) => (
                                    <RoleCard 
                                        key={member.name + index} 
                                        member={member} 
                                        t={t} 
                                        onClick={t(member.name) === '(TBD)' || t(member.name) === '(Vacant)' ? () => setIsNotifyModalOpen(true) : undefined}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Digital Operating Model (RBAC & Templates) */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-display font-bold text-text-dark dark:text-white">{t('RBACLogicTitle')}</h2>
                                <p className="text-xs text-text-light dark:text-slate-400">Security & Access Protocol</p>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="font-semibold p-4 text-text-dark dark:text-slate-200">{t('RBACLevel')}</th>
                                        <th className="font-semibold p-4 text-text-dark dark:text-slate-200">{t('AccessScope')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {rbacLogic.map(item => (
                                        <tr key={item.level} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="p-4 font-bold text-primary-dark dark:text-secondary">{t(item.level as TranslationKey)}</td>
                                            <td className="p-4 text-text-light dark:text-slate-300">{t(item.scope as TranslationKey)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
                         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-dark dark:text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-display font-bold text-text-dark dark:text-white">{t('TemplatesTitle')}</h2>
                                <p className="text-xs text-text-light dark:text-slate-400">Standardized Ops Documents</p>
                            </div>
                        </div>
                         <div className="grid sm:grid-cols-2 gap-8">
                             <div>
                                 <h3 className="font-bold text-text-dark dark:text-slate-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                                     {t('LinkedDatabases')}
                                 </h3>
                                 <ul className="text-sm text-text-light dark:text-slate-300 space-y-3 pl-3 border-l-2 border-primary/20 dark:border-secondary/20">
                                     <li className="hover:text-primary dark:hover:text-secondary cursor-pointer transition-colors">{t('RolesDatabase')}</li>
                                     <li className="hover:text-primary dark:hover:text-secondary cursor-pointer transition-colors">{t('AccessModulesDatabase')}</li>
                                     <li className="hover:text-primary dark:hover:text-secondary cursor-pointer transition-colors">{t('GovernanceChecklistDatabase')}</li>
                                 </ul>
                             </div>
                             <div>
                                 <h3 className="font-bold text-text-dark dark:text-slate-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                                     {t('WorkflowTemplates')}
                                 </h3>
                                 <ul className="text-sm text-text-light dark:text-slate-300 space-y-3 pl-3 border-l-2 border-accent-dark/20 dark:border-accent-yellow/20">
                                     <li className="hover:text-primary dark:hover:text-secondary cursor-pointer transition-colors">{t('IntakeTracker')}</li>
                                     <li className="hover:text-primary dark:hover:text-secondary cursor-pointer transition-colors">{t('ReviewerDashboard')}</li>
                                     <li className="hover:text-primary dark:hover:text-secondary cursor-pointer transition-colors">{t('EvidenceVault')}</li>
                                     <li className="hover:text-primary dark:hover:text-secondary cursor-pointer transition-colors">{t('ComplianceMatrix')}</li>
                                 </ul>
                             </div>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FuturesPage;
