import * as React from 'react';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import { useLanguage } from '../LanguageContext';
import { Page } from '../types';

const LegalPage: React.FC = () => {
    const { t } = useLanguage();

  return (
    <div>
        <PageHeader title={t(Page.Legal)} subtitle={t('LegalPageSubtitle')}/>
        
        <Section title={t('CorporateInformation')} id="corporate" className="bg-white dark:bg-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 not-prose">
                <div>
                    <h3 className="font-semibold text-text-dark dark:text-slate-200">{t('LegalName')}</h3>
                    <p className="text-text-light dark:text-slate-300">{t('LegalNameText')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-text-dark dark:text-slate-200">{t('RegistrationNumber')}</h3>
                    <p className="text-text-light dark:text-slate-300">384054</p>
                </div>
                <div>
                    <h3 className="font-semibold text-text-dark dark:text-slate-200">{t('NationalID')}</h3>
                    <p className="text-text-light dark:text-slate-300">10320351200</p>
                </div>
                <div>
                    <h3 className="font-semibold text-text-dark dark:text-slate-200">{t('RegistrationDate')}</h3>
                    <p className="text-text-light dark:text-slate-300">21 September 2010</p>
                </div>
                <div className="md:col-span-2">
                    <h3 className="font-semibold text-text-dark dark:text-slate-200">{t('CompanyCapital')}</h3>
                    <p className="text-text-light dark:text-slate-300">{t('CompanyCapitalText')}</p>
                </div>
            </div>
        </Section>
        
        <Section title={t('PrivacyPolicy')} id="privacy" className="bg-white dark:bg-slate-800">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            <p>KKM International Group ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
            
            <h3 className="font-bold mt-4">Collection of Your Information</h3>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</p>

            <h3 className="font-bold mt-4">Use of Your Information</h3>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to: create and manage your account, email you regarding your account or order, fulfill and manage purchases, orders, payments, and other transactions related to the Site, and increase the efficiency and operation of the Site.</p>
        </Section>

        <Section title={t('TermsOfUse')} id="terms" className="bg-white dark:bg-slate-800">
             <p><strong>Agreement to Terms</strong></p>
             <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and KKM International Group (“Company”, “we”, “us”, or “our”), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).</p>
            
            <h3 className="font-bold mt-4">Intellectual Property Rights</h3>
            <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>

            <h3 className="font-bold mt-4">Prohibited Activities</h3>
            <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
        </Section>
    </div>
  );
};

export default LegalPage;