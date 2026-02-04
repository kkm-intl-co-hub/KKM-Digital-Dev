export enum Page {
  Home = 'Home',
  AboutUs = 'About Us',
  CoreTechnologies = 'Core Technologies',
  Futures = 'Futures',
  Biomedical = 'Biomedical & Health Innovation',
  SportsManagement = 'Sports Management',
  RuralStudies = 'Rural Studies & Development',
  InnovationHub = 'Innovation & Ideation Hub',
  IntellectualProperty = 'Intellectual Property Office',
  Projects = 'Projects & Pilots',
  Careers = 'Careers & Engagement',
  News = 'News & Insights',
  Contact = 'Contact Us',
  Legal = 'Legal & Policies',
  SearchResults = 'Search Results',
  InternalPortal = 'Internal Portal',
}

export interface Project {
    name: string;
    description: string;
    image: string;
    tags: string[];
    coordinates: { lat: number; lng: number };
    gallery: string[];
    videoUrl?: string;
    detailedContent: string;
    metrics?: {
        budget: {
            total: number;
            currency: string;
            allocation: { name: string; value: number; fill: string; }[];
        };
        timeline: {
            start: string;
            end: string;
            progress: number;
        };
    };
}

export interface NavLink {
  name: Page;
  subLinks?: { name: string; id: string }[];
}

export interface NewsItem {
    title: string;
    date: string;
    excerpt: string;
    image: string;
    content: string;
    category: 'Technology' | 'Projects' | 'Corporate';
}

export interface Video {
    title: string;
    description: string;
    thumbnail: string;
    youtubeId: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  [key: string]: any;
}

export interface GeminiSearchResult {
  summary: string;
  sources: GroundingChunk[];
  sourceType?: 'internal' | 'web';
}


export interface MapMarker {
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  imageUrl?: string;
  category?: string;
  type?: 'project' | 'office';
}

export interface JobOpening {
  id: string;
  title: string;
  department: 'Engineering' | 'R&D' | 'Corporate' | 'Operations';
  location: 'Tehran, Iran' | 'Qeshm, Iran' | 'Remote';
  type: 'Full-time' | 'Contract';
  description: string;
  responsibilities: string[];
  qualifications: string[];
}
