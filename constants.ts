
import { Page } from './types';
import type { Project, NavLink, NewsItem, Video, JobOpening } from './types';

export const NAV_LINKS: NavLink[] = [
  { name: Page.Home },
  { name: Page.AboutUs },
  { 
    name: Page.CoreTechnologies,
    // Sub-menu removed to only display the main page
  },
  { name: Page.Futures },
  { name: Page.Projects },
  { name: Page.InnovationHub },
  { name: Page.Careers },
  { name: Page.News },
  { name: Page.Contact },
  { name: Page.InternalPortal },
];

export const GMEL_TECHNOLOGIES = [
    { id: "gmel-clg", name: "GMEL_CLG_Name", description: "GMEL_CLG_Desc", relatedIds: ["gmel-drillx", "gmel-thermofluid"] },
    { id: "gmel-ehs", name: "GMEL_EHS_Name", description: "GMEL_EHS_Desc", relatedIds: ["gmel-clg"] },
    { id: "gmel-drillx", name: "GMEL_DrillX_Name", description: "GMEL_DrillX_Desc", relatedIds: ["gmel-clg"] },
    { id: "gmel-thermofluid", name: "GMEL_ThermoFluid_Name", description: "GMEL_ThermoFluid_Desc", relatedIds: ["gmel-clg", "gmel-desal"] },
    { id: "gmel-desal", name: "GMEL_Desal_Name", description: "GMEL_Desal_Desc", relatedIds: ["gmel-thermofluid", "gmel-agricell"] },
    { id: "gmel-h2cell", name: "GMEL_H2Cell_Name", description: "GMEL_H2Cell_Desc", relatedIds: ["gmel-ecocluster"] },
    { id: "gmel-agricell", name: "GMEL_AgriCell_Name", description: "GMEL_AgriCell_Desc", relatedIds: ["gmel-desal", "gmel-ecocluster"] },
    { id: "gmel-lithiumloop", name: "GMEL_LithiumLoop_Name", description: "GMEL_LithiumLoop_Desc", relatedIds: ["gmel-clg", "gmel-ecocluster"] },
    { id: "gmel-ecocluster", name: "GMEL_EcoCluster_Name", description: "GMEL_EcoCluster_Desc", relatedIds: ["gmel-h2cell", "gmel-lithiumloop"] },
    { id: "gmel-smartfund", name: "GMEL_SmartFund_Name", description: "GMEL_SmartFund_Desc", relatedIds: ["gmel-geocredit"] },
    { id: "gmel-geocredit", name: "GMEL_GeoCredit_Name", description: "GMEL_GeoCredit_Desc", relatedIds: ["gmel-smartfund"] },
];

export const OTHER_CORE_AREAS = [
    { id: "biomedical", name: "Biomedical_Name", description: "Biomedical_Desc" },
    { id: "sports-mgmt", name: "SportsMgmt_Name", description: "SportsMgmt_Desc" },
    { id: "rural-studies", name: "RuralStudies_Name", description: "RuralStudies_Desc" },
];

export const PROJECTS: Project[] = [
    { 
        name: "Project_Qeshm_Name",
        description: "Project_Qeshm_Desc",
        image: "https://images.unsplash.com/photo-1565514020125-99b5e589df68?auto=format&fit=crop&w=800&q=80",
        tags: ["Tag_OilGas", "Tag_EPCI", "Tag_Midstream"],
        coordinates: { lat: 26.907, lng: 56.002 },
        gallery: [
            "https://images.unsplash.com/photo-1596237563267-8456f0b0c256?auto=format&fit=crop&w=800&q=80", 
            "https://images.unsplash.com/photo-1626117367344-9359a383d062?auto=format&fit=crop&w=800&q=80", 
            "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80"
        ],
        videoUrl: "https://www.youtube.com/embed/GLK6DErFBPA",
        detailedContent: "Project_Qeshm_Content",
        metrics: {
            budget: {
                total: 120, currency: "M USD",
                allocation: [
                    { name: "Metric_Engineering", value: 24, fill: "#0A92EF" },
                    { name: "Metric_Procurement", value: 54, fill: "#002D56" },
                    { name: "Metric_Construction", value: 36, fill: "#89CFF0" },
                    { name: "Metric_Commissioning", value: 6, fill: "#5a646a" },
                ]
            },
            timeline: { start: "2021-03-01", end: "2023-09-30", progress: 100 }
        }
    },
    { 
        name: "Project_ICOFC_Name",
        description: "Project_ICOFC_Desc",
        image: "https://images.unsplash.com/photo-1516937941348-c09645f3a26d?auto=format&fit=crop&w=800&q=80",
        tags: ["Tag_OilGas", "Tag_Upstream", "Tag_FieldDev"],
        coordinates: { lat: 36.544, lng: 61.157 },
        gallery: [
            "https://images.unsplash.com/photo-1533241242337-8173ef820422?auto=format&fit=crop&w=800&q=80", 
            "https://images.unsplash.com/photo-1574577457802-0a7b5e3962d3?auto=format&fit=crop&w=800&q=80"
        ],
        detailedContent: "Project_ICOFC_Content",
    }
];

export const NEWS_ITEMS: NewsItem[] = [
    {
        title: "News_1_Title",
        date: "2023-10-26",
        excerpt: "News_1_Excerpt",
        image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80",
        content: "News_1_Content",
        category: 'Technology'
    },
    {
        title: "News_2_Title",
        date: "2023-09-15",
        excerpt: "News_2_Excerpt",
        image: "https://images.unsplash.com/photo-1535922379374-2bc0d743a530?auto=format&fit=crop&w=800&q=80",
        content: "News_2_Content",
        category: 'Projects'
    },
    {
        title: "News_3_Title",
        date: "2023-08-01",
        excerpt: "News_3_Excerpt",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
        content: "News_3_Content",
        category: 'Corporate'
    },
    {
        title: "News_4_Title",
        date: "2023-07-20",
        excerpt: "News_4_Excerpt",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
        content: "News_4_Content",
        category: 'Technology'
    }
];

export const VIDEOS: Video[] = [
    {
        title: "News_1_Title", 
        description: "News_1_Excerpt",
        thumbnail: "https://i.ytimg.com/vi/GLK6DErFBPA/hqdefault.jpg",
        youtubeId: "GLK6DErFBPA"
    },
    {
        title: "News_2_Title",
        description: "News_2_Excerpt",
        thumbnail: "https://i.ytimg.com/vi/7atwO8GZ2Qk/hqdefault.jpg",
        youtubeId: "7atwO8GZ2Qk"
    },
    {
        title: "News_3_Title",
        description: "News_3_Excerpt",
        thumbnail: "https://i.ytimg.com/vi/VqY8b0Qj0h0/hqdefault.jpg",
        youtubeId: "VqY8b0Qj0h0"
    }
];

export const JOB_OPENINGS: JobOpening[] = [
    {
        id: 'sr-geothermal-engineer',
        title: 'Job_1_Title',
        department: 'Dept_Engineering',
        location: 'Loc_Tehran',
        type: 'Type_FullTime',
        description: 'Job_1_Desc',
        responsibilities: ['Job_1_Resp_1', 'Job_1_Resp_2', 'Job_1_Resp_3', 'Job_1_Resp_4'],
        qualifications: ['Job_1_Qual_1', 'Job_1_Qual_2', 'Job_1_Qual_3', 'Job_1_Qual_4'],
    },
    {
        id: 'biomed-research-scientist',
        title: 'Job_2_Title',
        department: 'Dept_RD',
        location: 'Loc_Tehran',
        type: 'Type_FullTime',
        description: 'Job_2_Desc',
        responsibilities: ['Job_2_Resp_1', 'Job_2_Resp_2', 'Job_2_Resp_3', 'Job_2_Resp_4'],
        qualifications: ['Job_2_Qual_1', 'Job_2_Qual_2', 'Job_2_Qual_3', 'Job_2_Qual_4'],
    },
    {
        id: 'project-controls-manager',
        title: 'Job_3_Title',
        department: 'Dept_Operations',
        location: 'Loc_Qeshm',
        type: 'Type_Contract',
        description: 'Job_3_Desc',
        responsibilities: ['Job_3_Resp_1', 'Job_3_Resp_2', 'Job_3_Resp_3', 'Job_3_Resp_4'],
        qualifications: ['Job_3_Qual_1', 'Job_3_Qual_2', 'Job_3_Qual_3', 'Job_3_Qual_4'],
    },
    {
        id: 'hr-business-partner',
        title: 'Job_4_Title',
        department: 'Dept_Corporate',
        location: 'Loc_Tehran',
        type: 'Type_FullTime',
        description: 'Job_4_Desc',
        responsibilities: ['Job_4_Resp_1', 'Job_4_Resp_2', 'Job_4_Resp_3', 'Job_4_Resp_4'],
        qualifications: ['Job_4_Qual_1', 'Job_4_Qual_2', 'Job_4_Qual_3', 'Job_4_Qual_4'],
    },
    {
        id: 'remote-software-dev',
        title: 'Job_5_Title',
        department: 'Dept_RD',
        location: 'Loc_Remote',
        type: 'Type_FullTime',
        description: 'Job_5_Desc',
        responsibilities: ['Job_5_Resp_1', 'Job_5_Resp_2', 'Job_5_Resp_3', 'Job_5_Resp_4'],
        qualifications: ['Job_5_Qual_1', 'Job_5_Qual_2', 'Job_5_Qual_3', 'Job_5_Qual_4'],
    },
];

export const EMPLOYEE_TESTIMONIALS: { quote: string; name: string; role: string; image: string; }[] = [
    {
        quote: "Emp_Testimonial_1_Quote",
        name: 'Sara Ahmadi',
        role: 'Emp_Testimonial_1_Role',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    {
        quote: 'Emp_Testimonial_2_Quote',
        name: 'Dr. Benyamin Rezaei',
        role: 'Emp_Testimonial_2_Role',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    {
        quote: "Emp_Testimonial_3_Quote",
        name: 'Fatemeh Ghasemi',
        role: 'Emp_Testimonial_3_Role',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    }
];
