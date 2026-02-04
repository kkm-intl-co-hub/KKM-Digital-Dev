import * as React from 'react';
import { useLanguage } from '../LanguageContext';

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
  keywords?: string;
}

/**
 * SEOHead Component
 * Manages document head elements including title, meta tags, and Open Graph tags.
 * Handles language and direction attributes on the HTML element.
 * 
 * @param {SEOHeadProps} props - SEO configuration properties
 * @returns {null} This component does not render DOM elements
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  url = 'https://kkm-international.org/',
  image = 'https://picsum.photos/seed/kkm-og-image/1200/630',
  type = 'website',
  keywords = 'KKM International, Sustainable Engineering, Geothermal Energy, Innovation',
}) => {
  const { language, direction } = useLanguage();

  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Update html attributes for accessibility
    document.documentElement.lang = language.toLowerCase();
    document.documentElement.dir = direction;

    // Helper to update or create meta tags
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setOgMeta = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    setMeta('description', description);
    setMeta('keywords', keywords);
    
    // Open Graph
    setOgMeta('og:title', title);
    setOgMeta('og:description', description);
    setOgMeta('og:url', url);
    setOgMeta('og:image', image);
    setOgMeta('og:type', type);
    setOgMeta('og:site_name', 'KKM International Group');

    // Twitter Card
    setOgMeta('twitter:card', 'summary_large_image');
    setOgMeta('twitter:title', title);
    setOgMeta('twitter:description', description);
    setOgMeta('twitter:image', image);

  }, [title, description, url, image, type, keywords, language, direction]);

  return null;
};

export default SEOHead;