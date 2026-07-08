import { UserProfile, ProgramSubmission, Subsidiary, DailyReport } from '../types';

const USERS_KEY = 'lumethis_users_v2';
const SUBMISSIONS_KEY = 'lumethis_submissions_v2';
const REPORTS_KEY = 'lumethis_reports_v2';
const SESSION_KEY = 'lumethis_session_v2';

const SEED_REPORTS: DailyReport[] = [
    {
        id: 'rep-1',
        employeeName: 'Marquis Michael Abimbola',
        position: 'General Manager EIB STRATOC',
        date: '2025-09-26',
        subsidiary: Subsidiary.EIB_STRATOC,
        overallSituation: 'The operational tempo across EIB STRATOC and all subsidiaries remained stable. Initiated the Group L&D integration strategy to migrate all units to their respective specialized industry frameworks.',
        goalForTheWeek: 'Deploy the hybrid "Core + Functional" competency matrix across the entire EIB Group portfolio.',
        objectivesForTheWeek: 'Establish unified Group-wide leadership baselines with Korn Ferry standards while mapping functional lines to SFIA, NICE, and Lean Six Sigma.',
        staffTasks: [
            {
                staffName: 'MR. ISHAKU TARFA',
                role: 'Manager of SAIFC',
                tasks: ['Verify mapping of NICE framework parameters for cyber intelligence operatives.', 'Analyze and compile preliminary security logs.']
            }
        ],
        timeSpent: '08:00–10:00: Subsidiary alignment review | 10:00–12:30: Multi-framework verification | 14:30–16:00: Strategy presentation design',
        tasksForTomorrow: 'Review drone safety operational manuals submitted by Briech UAS against national aviation guidelines.',
        gmNotes: 'Strategic Initiative: Shifting the group away from an IT-only SFIA focus to a blended industry-first model.',
        remarks: 'The subsidiaries are showing high engagement with the custom industry competency matrix.',
        status: 'Approved'
    }
];

// Seed Data for initial load
const SEED_USERS = [
    { id: 'u1', name: 'Marquis Michael Abimbola', email: 'marquis@eib.com', password: 'password', role: 'GROUP_ADMIN', jobTitle: 'Group L&D Director' },
    { id: 'u2', name: 'Benedict Aondofa', email: 'benedict@eib.com', password: 'password', role: 'GROUP_ADMIN', jobTitle: 'Technical Supervisor' },
    { id: 'u3', name: 'Ms. Anita', email: 'anita@brightfm.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIGHT_FM, jobTitle: 'General Manager' },
    { id: 'u4', name: 'Mubarak Sani', email: 'mubarak@briechuas.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIECH_UAS, jobTitle: 'General Manager' },
    { id: 'u5', name: 'Mr. Junaid Raza', email: 'junaid@luftreiber.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.LUFTREIBER_AUTO, jobTitle: 'Director' },
    { id: 'u6', name: 'Mr. Monday Apeh', email: 'monday@briechatlantic.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BRIECH_ATLANTIC, jobTitle: 'General Manager' },
    { id: 'u7', name: 'Colonel Ibrahim', email: 'ibrahim@dci.com', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.DCI_SECURITY, jobTitle: 'Operations Director' },
    { id: 'u8', name: 'Dr. Sarah Yusuf', email: 'sarah@bef.org', password: 'password', role: 'SUBSIDIARY_MANAGER', subsidiary: Subsidiary.BEF_FOUNDATION, jobTitle: 'Foundation Director' },
    // Demo Account
    { id: 'demo_user', name: 'Demo Administrator', email: 'demo@lumethis.com', password: 'demo', role: 'GROUP_ADMIN', jobTitle: 'System Demo User' }
];

const SEED_SUBMISSIONS: ProgramSubmission[] = [
    {
        id: 'sub-001',
        subsidiary: Subsidiary.DCI_SECURITY,
        title: 'Cyber Intelligence & Forensic Operations Manual',
        version: '1.0',
        submittedBy: 'Colonel Ibrahim',
        submissionDate: '2026-03-01',
        status: 'Pending Review',
        complianceScore: 95,
        requestNotes: 'Mapped entirely to the NICE framework (NIST SP 800-181) for cyber defense analyst roles.',
        overview: 'Foundational curriculum training for DCI intelligence operatives and cybersecurity specialists.',
        modules: [
            { 
                title: 'Incident Analysis & Log Forensic Analysis', 
                objectives: ['Identify attack signatures', 'Isolate compromised endpoints'], 
                duration: '3 Days',
                levelOrStandard: 'NICE Specialty Area: Digital Forensics (AN-DFN)'
            },
            { 
                title: 'Operational Communication & Intelligence Tradecraft', 
                objectives: ['Draft secure briefing memos', 'Implement operational security OPSEC protocols'], 
                duration: '2 Days',
                levelOrStandard: 'Intelligence Tradecraft: Collection and Counterintelligence'
            }
        ]
    },
    {
        id: 'sub-002',
        subsidiary: Subsidiary.LUFTREIBER_AUTO,
        title: 'Automotive QA Precision Assembly Induction',
        version: '2.1',
        submittedBy: 'Mr. Junaid Raza',
        submissionDate: '2026-02-28',
        status: 'Group Approved',
        complianceScore: 92,
        requestNotes: 'Aligned with IATF 16949 automotive quality standards and Lean Six Sigma methodologies.',
        overview: 'Comprehensive training manual ensuring that factory operators maintain premium defect-free output.',
        modules: [
            { 
                title: 'Lean Production & Process Efficiency', 
                objectives: ['Minimize waste on the assembly line', 'Map standard value streams'], 
                duration: '1 Week',
                levelOrStandard: 'Lean Six Sigma: Green Belt Certification'
            },
            { 
                title: 'IATF 16949 Standard Compliance Protocols', 
                objectives: ['Understand QA checklist structures', 'Implement corrective actions during audits'], 
                duration: '2 Days',
                levelOrStandard: 'IATF 16949 Clause 7.2: Competency Controls'
            }
        ]
    },
    {
        id: 'sub-003',
        subsidiary: Subsidiary.BEF_FOUNDATION,
        title: 'Logical Framework Approach (LogFrame) for Field Officers',
        version: '1.0',
        submittedBy: 'Dr. Sarah Yusuf',
        submissionDate: '2026-02-15',
        status: 'Group Approved',
        complianceScore: 90,
        requestNotes: 'Required monitoring and evaluation handbook for our NGO donors.',
        overview: 'Equips field officers with the tools to construct verifiable performance indicators and track local project impact.',
        modules: [
            { 
                title: 'Building Verifiable LogFrame Indicators', 
                objectives: ['Create input-to-impact flowcharts', 'Construct logic matrices'], 
                duration: '3 Days',
                levelOrStandard: 'LogFrame / Theory of Change Standard'
            }
        ]
    },
    {
        id: 'sub-004',
        subsidiary: Subsidiary.BRIGHT_FM,
        title: 'Broadcast Operations & Digital Audio Production',
        version: '1.0',
        submittedBy: 'Ms. Anita',
        submissionDate: '2026-02-12',
        status: 'Group Approved',
        complianceScore: 88,
        requestNotes: 'Broadcasting compliance program.',
        overview: 'Foundational training manual for radio presenters, audio engineers, and transmission specialists.',
        modules: [
            { 
                title: 'Digital Media Production & Studio Ethics', 
                objectives: ['Verify broadcast audio levels', 'Manage real-time callers and delays'], 
                duration: '2 Days',
                levelOrStandard: 'ScreenSkills Standard: Broadcast Technician'
            }
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