import { UserProfile, ProgramSubmission, Subsidiary, DailyReport } from '../types';

const USERS_KEY = 'lumethis_users_v1';
const SUBMISSIONS_KEY = 'lumethis_submissions_v1';
const REPORTS_KEY = 'lumethis_reports_v1';
const SESSION_KEY = 'lumethis_session_v1';

const SEED_REPORTS: DailyReport[] = [
    {
        id: 'rep-1',
        employeeName: 'Marquis Michael Abimbola',
        position: 'General Manager EIB STRATOC',
        date: '2025-09-26',
        subsidiary: Subsidiary.EIB_HOLDINGS,
        overallSituation: 'The operational tempo across all units (SAIFC, NNPC, CITEC, and P-SAC) remained stable. SAIFC focused on intelligence gathering, analysis, and professional development.',
        goalForTheWeek: 'To achieve comprehensive situational awareness and enhance decision-making by systematically monitoring, analyzing, and reporting.',
        objectivesForTheWeek: 'Achieve and maintain superior situational awareness and operational command across all camps and the wider Area of Operations (AO).',
        staffTasks: [
            {
                staffName: 'MR. ISHAKU TARFA',
                role: 'MANAGER OF SAIFC',
                tasks: ['Ensure updating of story maps', 'Ensure effective gathering of intelligence for analysis']
            },
            {
                staffName: 'AGBENIYI BUKOLA FAVOUR',
                role: 'Fusion Intelligence Officer',
                tasks: ['Intelligence gathering from Open-Source', 'September incident report spreadsheet update']
            }
        ],
        timeSpent: '8:00–10:00: Report analysis | 10:00–12:30: Floor management | 14:30–16:00: Strategy & reporting',
        tasksForTomorrow: 'Assess feasibility of recommending immediate protection measures for the Agwan Rogo area.',
        gmNotes: 'Strategic Training Initiative: The team-wide viewing and analysis of Sicario served as an effective, low-cost training tool.',
        remarks: 'The fusion centre staff are actively engaged in their core duties and self-development.',
        status: 'Approved'
    }
];

// Seed Data for initial load
const SEED_USERS = [
    { id: 'u1', name: 'Marquis Michael Abimbola', email: 'marquis@eib.com', password: 'password', role: 'GROUP_ADMIN', jobTitle: 'Group Manager - Training' },
    { id: 'u2', name: 'Benedict Aondofa', email: 'benedict@eib.com', password: 'password', role: 'GROUP_ADMIN', jobTitle: 'Technical Supervisor' },
    { id: 'u3', name: 'Ms. Anita', email: 'anita@brightfm.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIGHT_FM, jobTitle: 'General Manager' },
    { id: 'u4', name: 'Mubarak Sani', email: 'mubarak@briechuas.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIECH_UAS, jobTitle: 'General Manager' },
    { id: 'u5', name: 'Mr. Junaid Raza', email: 'junaid@luftreiber.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.LUFTREIBER_AUTO, jobTitle: 'Director' },
    { id: 'u6', name: 'Mr. Monday Apeh', email: 'monday@briechatlantic.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIECH_ATLANTIC, jobTitle: 'General Manager' },
    // Demo Account
    { id: 'demo_user', name: 'Demo Administrator', email: 'demo@lumethis.com', password: 'demo', role: 'GROUP_ADMIN', jobTitle: 'System Demo User' }
];

const SEED_SUBMISSIONS: ProgramSubmission[] = [
    {
        id: 'sub-004',
        subsidiary: Subsidiary.BRIECH_ATLANTIC,
        title: 'Standard Operating Procedures (Construction & FM)',
        version: '1.0',
        submittedBy: 'Mr. Monday Apeh',
        submissionDate: '2026-02-20',
        status: 'Pending Review',
        complianceScore: 85,
        requestNotes: 'Submitted for Group review. Covers Construction, FM, Assets, and Logistics units.',
        overview: 'Comprehensive SOPs guiding all staff through standardized procedures.',
        modules: [
            { title: 'General Operational Guidelines', objectives: ['Define work hours', 'HSE compliance'], duration: '2 Hours' },
            { title: 'Construction Services SOP', objectives: ['Project Initiation', 'Quality Control'], duration: '4 Hours' }
        ]
    },
    {
        id: 'sub-001',
        subsidiary: Subsidiary.BRIGHT_FM,
        title: 'Broadcast Training Manual',
        version: '1.0',
        submittedBy: 'Ms. Anita',
        submissionDate: '2026-02-12',
        status: 'Group Approved',
        complianceScore: 88,
        requestNotes: 'Seeking approval for pilot implementation.',
        overview: 'Foundational training manual for broadcast operations.',
        modules: [
            { title: 'Module 1: Staff Induction', objectives: ['Values', 'Ethics'], duration: '1 Day' },
            { title: 'Module 2: Programme Prep', objectives: ['Outlines', 'Delivery'], duration: '2 Days' }
        ]
    }
];

export const storageService = {
    // Initialize DB if empty
    init: () => {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (!storedUsers) {
            localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
        } else {
            // Ensure Demo User exists even if DB was previously created
            const users = JSON.parse(storedUsers);
            const demoUser = SEED_USERS.find(u => u.id === 'demo_user');
            if (demoUser && !users.find((u: any) => u.email === demoUser.email)) {
                users.push(demoUser);
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
            }
        }

        if (!localStorage.getItem(SUBMISSIONS_KEY)) {
            localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(SEED_SUBMISSIONS));
        }

        if (!localStorage.getItem(REPORTS_KEY)) {
            localStorage.setItem(REPORTS_KEY, JSON.stringify(SEED_REPORTS));
        }
    },

    // Auth Methods
    login: (email: string, password: string): UserProfile | null => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
            const { password, ...profile } = user; // Exclude password from return
            localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
            return profile;
        }
        return null;
    },

    signup: (user: Omit<UserProfile, 'id'> & { password: string }): UserProfile => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        
        if (users.find((u: any) => u.email === user.email)) {
            throw new Error('User already exists');
        }

        const newUser = { ...user, id: `u-${Date.now()}` };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        const { password, ...profile } = newUser;
        localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
        return profile;
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    getSession: (): UserProfile | null => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    // Data Methods
    getSubmissions: (user: UserProfile): ProgramSubmission[] => {
        const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
        if (user.role === 'GROUP_ADMIN') return all;
        return all.filter((s: ProgramSubmission) => s.subsidiary === user.subsidiary);
    },

    updateSubmissionStatus: (id: string, status: ProgramSubmission['status']) => {
        const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
        const updated = all.map((s: ProgramSubmission) => s.id === id ? { ...s, status } : s);
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
        return updated;
    },

    createSubmission: (submission: ProgramSubmission) => {
        const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
        all.unshift(submission);
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
    },

    getReports: (user: UserProfile) => {
        const all = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
        if (user.role === 'GROUP_ADMIN') return all;
        return all.filter((r: any) => r.subsidiary === user.subsidiary);
    },

    createReport: (report: any) => {
        const all = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
        all.unshift(report);
        localStorage.setItem(REPORTS_KEY, JSON.stringify(all));
    }
};