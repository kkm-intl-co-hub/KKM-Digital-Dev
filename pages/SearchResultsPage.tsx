import * as React from 'react';
import { Page } from '../types';
import type { GeminiSearchResult } from '../types';
import { useLanguage } from '../LanguageContext';
import SimpleMarkdown from '../components/SimpleMarkdown';

interface SearchResultsPageProps {
    result: GeminiSearchResult | null;
    query: string;
}

const LoadingIndicator = () => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md flex flex-col items-center justify-center text-center min-h-[200px]">
        <svg className="animate-spin h-10 w-10 text-primary dark:text-secondary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="text-xl font-display font-semibold text-primary dark:text-secondary">Searching...</h2>
        <p className="text-text-light dark:text-slate-300 mt-2">Please wait while we gather the latest information for you.</p>
    </div>
);

const getHostname = (url: string) => {
  try {
      return new URL(url).hostname;
  } catch (e) {
      return '';
  }
};

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ result, query }) => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary dark:text-white">
        {t(Page.SearchResults)}
      </h1>
      <p className="mt-2 text-lg text-text-light dark:text-slate-300">
        Showing results for: <span className="font-semibold text-text-dark dark:text-slate-200">"{query}"</span>
      </p>

      <div className="mt-12 space-y-6">
        {!result ? (
            <LoadingIndicator />
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              {result.sourceType && (
                <div className="mb-6 p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg text-sm text-text-light dark:text-slate-300 inline-flex items-center gap-3 border border-gray-200 dark:border-slate-700">
                    {result.sourceType === 'internal' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary dark:text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary dark:text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 9a9 9 0 019-9" /></svg>
                    )}
                    <span className="font-semibold">
                        {result.sourceType === 'internal'
                            ? 'Summarized from KKM Internal Documents'
                            : 'Summarized from Web Search'}
                    </span>
                </div>
              )}
              <SimpleMarkdown text={result.summary} />

              {result.sources && result.sources.filter(s => s.web?.uri).length > 0 && (
                <div className="mt-8 border-t dark:border-slate-700 pt-6">
                    <h3 className="text-lg font-display font-bold text-primary dark:text-secondary mb-4">Sources</h3>
                    <ul className="space-y-3">
                        {result.sources.filter(s => s.web?.uri).map((source, index) => {
                            const hostname = getHostname(source.web!.uri!);
                            return (
                                <li key={index} className="flex items-start">
                                    <img
                                        src={`https://www.google.com/s2/favicons?sz=16&domain_url=${hostname}`}
                                        alt="favicon"
                                        className="w-4 h-4 mr-3 mt-1 flex-shrink-0"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                    <a href={source.web!.uri} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-secondary hover:text-accent-yellow dark:hover:text-accent-yellow transition-colors break-all">
                                        {source.web!.title || source.web!.uri}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;