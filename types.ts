export enum Subsidiary {
  EIB_STRATOC = 'EIB Stratoc (Group HQ)',
  LUFTREIBER_AUTO = 'Luftreiber Automotive',
  BRIECH_UAS = 'Briech UAS (Drone & Aerospace)',
  DCI_SECURITY = 'DCI (RAW, SAC, PSAP, Intel)',
  BEF_FOUNDATION = 'BEF (Foundation & Non-Profit)',
  BRIGHT_FM = 'Bright FM (Media & Broadcasting)',
  BRIECH_ATLANTIC = 'Briech Atlantic (Construction & FM)'
}

export type UserRole = 'GROUP_ADMIN' | 'SUBSIDIARY_MANAGER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subsidiary?: Subsidiary; // If undefined, they are Group level
  jobTitle?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  subsidiary: Subsidiary;
  status: 'Planned' | 'In Progress' | 'Completed';
  participants: number;
  budget: number;
  startDate: string;
  category: 'Technical' | 'Leadership' | 'Operational' | 'Soft Skills';
}

export interface ModuleContent {
  title: string;
  objectives: string[];
  duration?: string;
  keyTopics?: string[];
  levelOrStandard?: string;
}

export interface ProgramSubmission {
  id: string;
  submittedBy: string;
  submissionDate: string;
  title: string;
  subsidiary: Subsidiary;
  version: string;
  status: 'Pending Review' | 'Changes Requested' | 'Group Approved' | 'Active';
  complianceScore: number; // 0-100 based on Group Standards
  overview: string;
  modules: ModuleContent[];
  requestNotes?: string; // Content from the memo
}

export interface BudgetRecord {
  category: string;
  allocated: number;
  spent: number;
  variance: number; // positive means under budget
}

export interface Asset {
  id: string;
  name: string;
  location: string;
  condition: 'Good' | 'Fair' | 'Maintenance Required';
  lastInspection: string;
}

export interface StaffTask {
  staffName: string;
  role: string;
  tasks: string[];
}

export interface DailyReport {
  id: string;
  employeeName: string;
  position: string;
  date: string;
  subsidiary: Subsidiary;
  overallSituation: string;
  goalForTheWeek: string;
  objectivesForTheWeek: string;
  staffTasks: StaffTask[];
  timeSpent: string;
  tasksForTomorrow: string;
  gmNotes: string;
  remarks: string;
  status: 'Draft' | 'Submitted' | 'Approved';
}

export interface AIPlanResponse {
  title: string;
  overview: string;
  frameworkUsed?: string;
  modules: {
    name: string;
    objectives: string[];
    duration: string;
    sfiaLevel?: string;
    levelOrStandard?: string;
  }[];
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'scale' | 'text' | 'choice';
  rationale: string;
  options?: string[];
}

export interface SurveyPlan {
  title: string;
  description: string;
  targetAudience: string;
  questions: SurveyQuestion[];
}

export interface CourseLesson {
  title: string;
  content: string;
  duration: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface CourseGenerationResponse {
  title: string;
  description: string;
  category: string;
  level: string;
  format: string;
  duration: string;
  frameworkUsed: string;
  targetSubsidiaries: string;
  isStrategic: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  lessons: CourseLesson[];
  quiz: QuizQuestion[];
}