import React, { useState } from 'react';
import { 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Target, 
  Clock, 
  ArrowRight, 
  Lightbulb, 
  ShieldCheck, 
  HelpCircle, 
  BookOpenCheck,
  Shield,
  Briefcase,
  Users,
  Compass,
  Award,
  ChevronRight,
  GraduationCap,
  EyeOff,
  Video,
  Image,
  DollarSign,
  Globe,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Printer,
  Check,
  X,
  RotateCcw
} from 'lucide-react';
import { generateTrainingStrategy, analyzeSkillGap, generateCourseSyllabus } from '../services/geminiService';
import { AIPlanResponse, CourseGenerationResponse, Subsidiary, CourseLesson, QuizQuestion } from '../types';
import { storageService } from '../services/storageService';

const FRAMEWORKS = [
  {
    id: 'auto',
    name: 'Auto-Detect Hybrid Mix',
    businessArea: 'All Business Areas',
    description: 'Let Lumethis dynamically select the best global leadership core and specialized functional frameworks based on your program topic and subsidiary.',
    why: 'Enables seamless blended learning pathways aligning global leaders to Korn Ferry and operational staff to niche standards.'
  },
  {
    id: 'Korn Ferry Leadership Architect',
    name: 'Korn Ferry Leadership Architect',
    businessArea: 'Global Leadership Core',
    description: 'Gold standard for leadership competencies, emotional intelligence, and managerial behaviors across all subsidiaries.',
    why: 'Evaluates and standardizes managers, directors, and executives on a single unified scale group-wide.'
  },
  {
    id: 'PMI Talent Triangle / PMBOK',
    name: 'PMI Talent Triangle / PMBOK',
    businessArea: 'Project Execution',
    description: 'Project management competence, lifecycle delivery, governance, and milestone tracking.',
    why: 'Standardizes project management language across community outreach (BEF) and technical builds (Briech UAS).'
  },
  {
    id: 'Lean Six Sigma (LSS)',
    name: 'Lean Six Sigma (LSS)',
    businessArea: 'Process & Quality Control',
    description: 'Focuses heavily on process improvement, defect reduction, value streams, and Yellow/Green/Black Belt training.',
    why: 'Directly structured into assembly lines and operations at Luftreiber Automotive and Briech UAS.'
  },
  {
    id: 'IATF 16949 / ISO 9001',
    name: 'IATF 16949 / ISO 9001',
    businessArea: 'Automotive & Manufacturing Quality',
    description: 'Quality management systems governing strictly audited competency and compliance parameters.',
    why: 'Ensures premium manufacturing standards and regulatory compliance at Luftreiber Automobile.'
  },
  {
    id: 'NICE Framework',
    name: 'NICE Framework (NIST SP 800-181)',
    businessArea: 'Cybersecurity & Cyber Intel',
    description: 'Absolute benchmark for cyber defense, intelligence analysis, forensic collection, and security operations.',
    why: 'Powers DCI-RAW operations and Giga Forensics training pathways.'
  },
  {
    id: 'Intelligence Tradecraft Core Competencies',
    name: 'Intelligence Tradecraft Core',
    businessArea: 'Intelligence & Clandestine',
    description: 'Competencies in raw collection, strategic analysis, active clandestine tradecraft, and counterintelligence.',
    why: 'Modeled after national intelligence standards to evaluate DCI-SAC and DCI-Intel operatives.'
  },
  {
    id: 'Logical Framework Approach (LogFrame)',
    name: 'Logical Framework / Theory of Change',
    businessArea: 'Non-Profit & Social Impact',
    description: 'Structured planning, Monitoring & Evaluation (M&E), donor reporting, and verification metrics.',
    why: 'Enables BEF Foundation field officers to demonstrate clear social ROI and structured donor alignment.'
  },
  {
    id: 'ScreenSkills Creative Skillset',
    name: 'ScreenSkills (Creative Skillset)',
    businessArea: 'Media & Broadcasting',
    description: 'Standards for radio presenters, transmission engineers, and digital audience managers.',
    why: 'Custom tailored for Bright FM to map broadcasting excellence and content quality.'
  },
  {
    id: 'SFIA (Skills Framework for the Information Age)',
    name: 'SFIA (Skills Framework for the Information Age)',
    businessArea: 'IT, Digital & Software Engineering',
    description: 'Global standard for IT skills and competencies, mapping professional IT and digital capability levels (1-7) across the enterprise.',
    why: 'Enables precise software engineering, tech architectures, and technical resource allocation for digital divisions.'
  }
];

const AIStrategist: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'create' | 'analyze' | 'course' | 'custom'>('create');
  const [selectedFramework, setSelectedFramework] = useState('auto');
  
  // Custom Content Builder State
  const [customCourseTitle, setCustomCourseTitle] = useState('EIB Group Global Orientation');
  const [customCourseDescription, setCustomCourseDescription] = useState('An introductory program establishing the global core standards, compliance protocols, and operational workflows across EIB Group subsidiaries.');
  const [customLessons, setCustomLessons] = useState<CourseLesson[]>([
    {
      title: 'Lesson 1: Introduction to EIB Group & Subsidiaries',
      content: 'Welcome to EIB Group. Our conglomerate spans diverse strategic sectors including Luftreiber Automotive, Briech UAS Aerospace, DCI Security and intelligence division, and the BEF Foundation. This orientation lesson details how our global core leadership frameworks align with specific compliance and functional goals across all operating subsidiaries.',
      duration: '45 mins'
    },
    {
      title: 'Lesson 2: Global Leadership Core Framework',
      content: 'This lesson covers the Korn Ferry Leadership Architect competencies that define executive and management expectations group-wide. Topics include driving engagement, courage, strategic mindset, and managing ambiguity across international operational divisions.',
      duration: '30 mins'
    },
    {
      title: 'Lesson 3: Operational Quality & Compliance Standards',
      content: 'An exploration of technical quality control guidelines across our industrial subsidiaries. Learn about the application of Lean Six Sigma defect-reduction methods, IATF 16949 automotive audits, and flight safety frameworks for unmanned aerial vehicles (UAVs).',
      duration: '30 mins'
    },
    {
      title: 'Lesson 4: Operational Security (OPSEC) & SITREPs',
      content: 'Understand our information classification and physical security standards, particularly for DCI Intelligence units. We review daily situation reporting (SITREPs) structures, data protection baselines, and secure communication channels.',
      duration: '45 mins'
    },
    {
      title: 'Lesson 5: Assessment & Active Portfolio Integration',
      content: 'Transitioning from training completion to active operation logs. We explore how performance tracking, budget variance monitoring, and key milestone reports are updated in the unified Group L&D platform.',
      duration: '30 mins'
    }
  ]);
  const [customQuiz, setCustomQuiz] = useState<QuizQuestion[]>([
    {
      question: 'Which framework serves as the EIB Group Global Leadership Core across all operating subsidiaries?',
      options: ['Korn Ferry Leadership Architect', 'NICE Framework', 'ScreenSkills Creative Skillset', 'Logical Framework Approach'],
      correctAnswer: 'A',
      explanation: 'The Korn Ferry Leadership Architect provides the standardized global leadership core competencies for directors, managers, and unit leaders group-wide.'
    },
    {
      question: 'Which EIB Group subsidiary specializes in Unmanned Aerial Systems (UAS), drone manufacturing, and flight operations?',
      options: ['Luftreiber Automotive', 'Briech UAS (Drone & Aerospace)', 'DCI Security', 'Bright FM'],
      correctAnswer: 'B',
      explanation: 'Briech UAS is the specialized division responsible for tactical unmanned aerial systems and aerospace innovations.'
    },
    {
      question: 'What is the minimum score required in any EIB Group compliance assessment to qualify for a certificate of completion?',
      options: ['50%', '70%', '80%', '90%'],
      correctAnswer: 'C',
      explanation: 'EIB Group standards mandate a minimum score of 80% to ensure operational capability and authorize certification.'
    },
    {
      question: 'Under which framework is DCI Security\'s specialized cybersecurity and digital forensics training aligned?',
      options: ['ISO 9001', 'ScreenSkills Creative', 'NICE Cybersecurity Framework', 'PMI PMBOK'],
      correctAnswer: 'C',
      explanation: 'DCI Security maps its cybersecurity training directly to the NICE Framework to standardise intelligence and defense competencies.'
    },
    {
      question: 'Which standard governs quality assurance, compliance protocols, and factory-level audits in Luftreiber Automotive?',
      options: ['IATF 16949 / ISO 9001', 'Korn Ferry Architect', 'Logical Framework Approach', 'ScreenSkills Framework'],
      correctAnswer: 'A',
      explanation: 'IATF 16949 is the specific international automotive quality standard combined with Lean Six Sigma for factory-level compliance.'
    },
    {
      question: 'Which subsidiary manages the non-profit initiatives, social development partnerships, and community foundations for EIB Group?',
      options: ['Bright FM', "BEF (Foundation & Non-Profit)", 'Briech Atlantic', 'EIB Stratoc'],
      correctAnswer: 'B',
      explanation: 'BEF (Foundation & Non-Profit) handles community-focused, donor-funded, and charitable programs under the LogFrame approach.'
    },
    {
      question: 'Which standard controls on-air presenting, sound engineering, and broadcasting delay panels at Bright FM?',
      options: ['NICE Framework', 'Lean Six Sigma', 'ScreenSkills Creative Skillset', 'PMI PMBOK'],
      correctAnswer: 'C',
      explanation: 'Bright FM adopts the ScreenSkills Creative Skillset standard to align broadcasting talent and production safety protocols.'
    },
    {
      question: 'Which framework is used for project lifecycle governance, scheduling, and risk management across EIB Group construction units?',
      options: ['PMI PMBOK', 'Lean Six Sigma', 'Logical Framework Approach', 'NICE Framework'],
      correctAnswer: 'A',
      explanation: 'The Project Management Institute (PMI) PMBOK Guide provides the global project delivery standard across our engineering and facilities units.'
    },
    {
      question: 'Who is the primary authority responsible for reviewing and standardizing subsidiary training submissions group-wide?',
      options: ['Subsidiary QA Lead', 'Group L&D Director', 'External Auditor', 'Operations General Manager'],
      correctAnswer: 'B',
      explanation: 'The Group Learning & Development Director has the final authority to standardize, approve, or request changes on all training programs.'
    },
    {
      question: 'Which methodology does EIB Group use in BEF Foundation to measure social impact indicators and donor reporting?',
      options: ['Korn Ferry Architect', 'Logical Framework Approach (LogFrame)', 'NICE Specialty Area', 'IATF 16949 Audit'],
      correctAnswer: 'B',
      explanation: 'The Logical Framework Approach (LogFrame) is the industry standard for Monitoring and Evaluation (M&E) in social and NGO projects.'
    }
  ]);

  // Inline forms state
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('30 mins');

  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>(['', '', '', '']);
  const [newQuestionCorrect, setNewQuestionCorrect] = useState('A');
  const [newQuestionExplanation, setNewQuestionExplanation] = useState('');
  
  // Generation State
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<AIPlanResponse | null>(null);

  // Analysis State
  const [role, setRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [goal, setGoal] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string>('');

  // Course Authoring Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('Technical');
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [courseFormat, setCourseFormat] = useState('Online');
  const [courseDuration, setCourseDuration] = useState(8);
  const [coursePrice, setCoursePrice] = useState(0);
  const [courseTargetSubsidiaries, setCourseTargetSubsidiaries] = useState('');
  const [courseIsStrategic, setCourseIsStrategic] = useState(false);
  const [courseVideoUrl, setCourseVideoUrl] = useState('');
  const [courseThumbnailUrl, setCourseThumbnailUrl] = useState('');
  const [generatedCourse, setGeneratedCourse] = useState<CourseGenerationResponse | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Interactive Quiz Player States
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScorePercent, setQuizScorePercent] = useState<number | null>(null);
  const [showPDFGuideModal, setShowPDFGuideModal] = useState(false);

  // Reset quiz answers when a new course is selected or generated
  React.useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScorePercent(null);
  }, [generatedCourse]);

  const handleGenerate = async () => {
    if (!topic || !audience) return;
    setLoading(true);
    setGeneratedPlan(null);
    const plan = await generateTrainingStrategy(topic, audience, duration, selectedFramework);
    setGeneratedPlan(plan);
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!role || !currentSkills) return;
    setLoading(true);
    setAnalysisResult('');
    const result = await analyzeSkillGap(role, currentSkills, goal, selectedFramework);
    setAnalysisResult(result);
    setLoading(false);
  };

  const handleCreateCourse = async () => {
    if (!courseTitle || !courseDescription) return;
    setLoading(true);
    setGeneratedCourse(null);
    setPublishSuccess(false);
    
    try {
      const course = await generateCourseSyllabus(
        courseTitle,
        courseDescription,
        courseCategory,
        courseLevel,
        courseFormat,
        courseDuration,
        courseTargetSubsidiaries,
        courseIsStrategic,
        courseVideoUrl || undefined,
        courseThumbnailUrl || undefined
      );

      if (course) {
        setGeneratedCourse(course);
        
        // Map first target subsidiary
        let mappedSubsidiary = Subsidiary.EIB_STRATOC;
        const targetLower = courseTargetSubsidiaries.toLowerCase();
        if (targetLower.includes('briech') || targetLower.includes('uas') || targetLower.includes('drone')) {
          mappedSubsidiary = Subsidiary.BRIECH_UAS;
        } else if (targetLower.includes('dci') || targetLower.includes('sac') || targetLower.includes('raw') || targetLower.includes('intel') || targetLower.includes('security')) {
          mappedSubsidiary = Subsidiary.DCI_SECURITY;
        } else if (targetLower.includes('bef') || targetLower.includes('foundation') || targetLower.includes('non-profit')) {
          mappedSubsidiary = Subsidiary.BEF_FOUNDATION;
        } else if (targetLower.includes('bright') || targetLower.includes('fm') || targetLower.includes('broadcast') || targetLower.includes('media')) {
          mappedSubsidiary = Subsidiary.BRIGHT_FM;
        } else if (targetLower.includes('auto') || targetLower.includes('luftreiber') || targetLower.includes('manufactur')) {
          mappedSubsidiary = Subsidiary.LUFTREIBER_AUTO;
        } else if (targetLower.includes('atlantic') || targetLower.includes('construction') || targetLower.includes('fm')) {
          mappedSubsidiary = Subsidiary.BRIECH_ATLANTIC;
        }

        // Save in submisssions to dynamically show inside the app
        storageService.createSubmission({
          id: `sub-${Date.now()}`,
          subsidiary: mappedSubsidiary,
          title: course.title,
          version: '1.0 (AI Synthesized)',
          submittedBy: 'Group L&D Director',
          submissionDate: new Date().toISOString().split('T')[0],
          status: 'Group Approved',
          complianceScore: 100,
          requestNotes: `Course category: ${course.category} | Level: ${course.level} | Format: ${course.format} | Target Subsidiaries: ${course.targetSubsidiaries}`,
          overview: course.description,
          modules: course.lessons.map((les) => ({
            title: les.title,
            objectives: [les.content],
            duration: les.duration,
            levelOrStandard: course.frameworkUsed
          }))
        });

        setPublishSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomContent = () => {
    setLoading(true);
    setGeneratedCourse(null);
    setPublishSuccess(false);

    if (customQuiz.length < 10) {
      setValidationError(`EIB Group L&D standards require a minimum of 10 quiz questions to compile a certified training course. (Currently: ${customQuiz.length}/10 questions). Please add more questions to proceed.`);
      setLoading(false);
      return;
    }

    setValidationError(null);

    try {
      const finalTitle = customCourseTitle.trim() || 'EIB Group Global Orientation';
      const finalDescription = customCourseDescription.trim() || 'An introductory program establishing the global core standards, compliance protocols, and operational workflows across EIB Group subsidiaries.';
      
      const mockCourse: CourseGenerationResponse = {
        title: finalTitle,
        description: finalDescription,
        category: 'Orientation',
        level: 'Core',
        format: 'Blended',
        duration: `${customLessons.length * 0.5 + 0.5} Hours`,
        frameworkUsed: 'EIB Group Blended Core Standards',
        targetSubsidiaries: 'All EIB Group Subsidiaries',
        isStrategic: false,
        lessons: customLessons.length > 0 ? customLessons : [
          {
            title: 'EIB Group Mission & Subsidiary Alignment',
            content: 'Welcome to EIB Group. Our conglomerate spans diverse strategic sectors including Luftreiber Automotive, Briech UAS Aerospace, DCI Security and intelligence division, and the BEF Foundation. This orientation lesson details how our global core leadership frameworks align with specific compliance and functional goals across all seven operating subsidiaries.',
            duration: '45 mins'
          }
        ],
        quiz: customQuiz
      };
      
      setGeneratedCourse(mockCourse);
      setPublishSuccess(true);

      // Save inside the global dynamic submissions of the app!
      storageService.createSubmission({
        id: `sub-${Date.now()}`,
        subsidiary: Subsidiary.EIB_STRATOC, // Parent/Group level orientation
        title: mockCourse.title,
        version: '1.0 (Custom Orientation)',
        submittedBy: 'Group L&D Director',
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'Group Approved',
        complianceScore: 100,
        requestNotes: `Custom Content Override. Has ${mockCourse.lessons.length} lessons and ${mockCourse.quiz.length} quiz questions.`,
        overview: mockCourse.description,
        modules: mockCourse.lessons.map((les) => ({
          title: les.title,
          objectives: [les.content],
          duration: les.duration,
          levelOrStandard: mockCourse.frameworkUsed
        }))
      });
    } catch (err) {
      console.error("Error saving custom course content:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 h-full">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 rounded-xl p-8 text-white shadow-xl shadow-orange-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-[-20px] right-[-20px] opacity-20 rotate-12">
            <Sparkles size={150} />
        </div>

        <div className="flex items-center space-x-3 mb-3 relative z-10">
          <Lightbulb className="text-yellow-200 fill-yellow-200 animate-pulse" size={32} />
          <h2 className="text-3xl font-bold tracking-tight">Strategic Illumination Hub</h2>
        </div>
        <p className="text-orange-50 max-w-2xl font-medium text-lg relative z-10 leading-relaxed">
          Ignite workforce potential with custom pathways utilizing standard frameworks. Design structured curriculums or shed light on critical skill gaps.
        </p>
        
        <div className="flex flex-wrap gap-4 mt-8 relative z-10">
          <button 
            onClick={() => setActiveMode('create')}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
              activeMode === 'create' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            Curriculum Builder
          </button>
          <button 
            onClick={() => {
              setActiveMode('analyze');
              // default to auto for gaps or keep selected
            }}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
              activeMode === 'analyze' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            Multi-Framework Gap Analyzer
          </button>
          <button 
            onClick={() => {
              setActiveMode('course');
            }}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
              activeMode === 'course' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            Create New Course
          </button>
          <button 
            onClick={() => {
              setActiveMode('custom');
            }}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
              activeMode === 'custom' 
              ? 'bg-white text-orange-600 transform -translate-y-1' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm'
            }`}
          >
            Custom Content Builder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              {activeMode === 'create' ? (
                <BookOpen className="mr-2 text-orange-500" size={20}/>
              ) : activeMode === 'analyze' ? (
                <Target className="mr-2 text-orange-500" size={20}/>
              ) : activeMode === 'course' ? (
                <GraduationCap className="mr-2 text-orange-500" size={20}/>
              ) : (
                <BookOpenCheck className="mr-2 text-orange-500" size={20}/>
              )}
              {activeMode === 'create' 
                ? 'Program Parameters' 
                : activeMode === 'analyze' 
                  ? 'Analysis Context & Target' 
                  : activeMode === 'course'
                    ? 'Course Synthesizer & LMS Publisher'
                    : 'Custom Content Builder'}
            </h3>
            
            {activeMode === 'create' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Training Topic</label>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-sm"
                    placeholder="e.g., Advanced UAS Operations and Safety Protocols"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Target Audience</label>
                  <input 
                    type="text" 
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-sm"
                    placeholder="e.g., Drone Flight Instructors and Maintainers"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Duration</label>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow bg-white text-sm"
                    >
                      <option value="">Select Duration...</option>
                      <option value="Half Day">Half Day (4 Hours)</option>
                      <option value="Full Day">Full Day (8 Hours)</option>
                      <option value="3 Days">3 Days Intensive</option>
                      <option value="1 Week">1 Week Program</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Target Standard / Framework</label>
                    <select 
                      value={selectedFramework}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow bg-white text-sm"
                    >
                      {FRAMEWORKS.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Framework Description Helper */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-start space-x-2">
                  <HelpCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">
                      {FRAMEWORKS.find(f => f.id === selectedFramework)?.businessArea}:
                    </span>{' '}
                    <span>{FRAMEWORKS.find(f => f.id === selectedFramework)?.description}</span>
                    <div className="mt-1 font-medium text-slate-500 italic">
                      Why: {FRAMEWORKS.find(f => f.id === selectedFramework)?.why}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={loading || !topic || !audience}
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                  <span>Generate Strategy</span>
                </button>
              </div>
            )}

            {activeMode === 'analyze' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Job Role</label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-sm"
                    placeholder="e.g., Cybersecurity Incident Responder / SOC Supervisor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Observed Skills / Critical Issues</label>
                  <textarea 
                    value={currentSkills}
                    onChange={(e) => setCurrentSkills(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none transition-shadow text-sm"
                    placeholder="e.g., High technical knowledge of system logs, but struggles with response timelines and coordination during incidents."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Business Goal</label>
                    <input 
                      type="text" 
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-sm"
                      placeholder="e.g., Reduce incident response time by 40%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Framework Alignment</label>
                    <select 
                      value={selectedFramework}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow bg-white text-sm"
                    >
                      {FRAMEWORKS.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Framework Description Helper */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-start space-x-2">
                  <HelpCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">
                      {FRAMEWORKS.find(f => f.id === selectedFramework)?.businessArea}:
                    </span>{' '}
                    <span>{FRAMEWORKS.find(f => f.id === selectedFramework)?.description}</span>
                    <div className="mt-1 font-medium text-slate-500 italic">
                      Why: {FRAMEWORKS.find(f => f.id === selectedFramework)?.why}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={loading || !role || !currentSkills}
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Target size={18} />}
                  <span>Analyze Gaps</span>
                </button>
              </div>
            )}

            {activeMode === 'course' && (
              <div className="space-y-4 text-slate-700">
                <div className="bg-orange-50 rounded-lg p-3 text-xs border border-orange-100 flex items-start space-x-2">
                  <Sparkles className="text-orange-500 mt-0.5 flex-shrink-0 animate-pulse" size={16} />
                  <p className="text-orange-800 leading-normal font-medium">
                    The generative engine will automatically synthesize <strong className="font-bold">5 dynamic lessons</strong> and a <strong className="font-bold">customized quiz</strong> based on the course category you select.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Title</label>
                  <input 
                    type="text" 
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-sm"
                    placeholder="e.g. Advanced Drone Navigation"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                  <textarea 
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-20 resize-none transition-shadow text-sm"
                    placeholder="Briefly describe what this course will teach..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                    <select 
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Operations">Operations</option>
                      <option value="Media">Media & Broadcast</option>
                      <option value="Non-profit">Non-Profit / NGO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Level</label>
                    <select 
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Format</label>
                    <select 
                      value={courseFormat}
                      onChange={(e) => setCourseFormat(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm"
                    >
                      <option value="Online">Online</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="In-Person">In-Person</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration (Hrs)</label>
                    <input 
                      type="number" 
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(Number(e.target.value))}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (₦)</label>
                    <input 
                      type="number" 
                      value={coursePrice}
                      onChange={(e) => setCoursePrice(Number(e.target.value))}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Subsidiaries</label>
                  <input 
                    type="text" 
                    value={courseTargetSubsidiaries}
                    onChange={(e) => setCourseTargetSubsidiaries(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-sm"
                    placeholder="e.g. Briech UAS, DCI - SAC"
                  />
                </div>

                <div className="flex items-center space-x-2 py-1">
                  <input 
                    type="checkbox" 
                    id="isStrategic"
                    checked={courseIsStrategic}
                    onChange={(e) => setCourseIsStrategic(e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isStrategic" className="text-xs font-bold text-slate-600 flex items-center cursor-pointer select-none">
                    <EyeOff size={14} className="mr-1 text-slate-400" />
                    Mark as Strategic Briefing (Hides from LMS Course Catalog)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center">
                    <Video size={13} className="mr-1 text-slate-400" /> Video Embed URL (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={courseVideoUrl}
                    onChange={(e) => setCourseVideoUrl(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-sm"
                    placeholder="e.g. https://www.youtube.com/embed/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center">
                    <Image size={13} className="mr-1 text-slate-400" /> Thumbnail Image URL (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={courseThumbnailUrl}
                    onChange={(e) => setCourseThumbnailUrl(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-sm"
                    placeholder="e.g. https://images.unsplash.com/..."
                  />
                </div>

                <button 
                  onClick={handleCreateCourse}
                  disabled={loading || !courseTitle || !courseDescription}
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <GraduationCap size={18} />}
                  <span>Publish Course</span>
                </button>
              </div>
            )}

            {activeMode === 'custom' && (
              <div className="space-y-5 text-slate-700">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800">
                      Custom Content Builder
                    </h4>
                    {!customCourseTitle.trim() && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 border border-amber-300 text-amber-800">
                        Template Example Mode
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Design and build any custom course of your choice! Enter your own details, add lessons, and create quiz questions below. If you leave inputs blank, the system automatically uses the <strong className="text-amber-800">EIB Group Global Orientation</strong> template as a demo example.
                  </p>
                </div>

                {/* Course Details (editable template fields) */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Course Title {!customCourseTitle.trim() && <span className="text-amber-600 font-semibold">(Using Example)</span>}
                    </label>
                    <input 
                      type="text" 
                      value={customCourseTitle}
                      onChange={(e) => setCustomCourseTitle(e.target.value)}
                      placeholder="e.g. EIB Group Global Orientation"
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Course Description {!customCourseDescription.trim() && <span className="text-amber-600 font-semibold">(Using Example)</span>}
                    </label>
                    <textarea 
                      value={customCourseDescription}
                      onChange={(e) => setCustomCourseDescription(e.target.value)}
                      placeholder="e.g. An introductory program establishing the global core standards, compliance protocols, and operational workflows across EIB Group subsidiaries."
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none h-16 resize-none"
                    />
                  </div>
                </div>

                {/* Lessons Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-1">
                    <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Lessons</h4>
                    <button 
                      onClick={() => setIsAddingLesson(true)}
                      className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center space-x-1"
                    >
                      <Plus size={14} />
                      <span>Add Lesson</span>
                    </button>
                  </div>

                  {/* Inline Form for New Lesson */}
                  {isAddingLesson && (
                    <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 space-y-3">
                      <h5 className="text-xs font-bold text-orange-800">Add New Lesson</h5>
                      <div>
                        <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Lesson Title</label>
                        <input 
                          type="text" 
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                          placeholder="e.g., EIB Strategic Objectives"
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Duration</label>
                          <input 
                            type="text" 
                            value={newLessonDuration}
                            onChange={(e) => setNewLessonDuration(e.target.value)}
                            placeholder="e.g., 30 mins"
                            className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Lesson Content</label>
                        <textarea 
                          value={newLessonContent}
                          onChange={(e) => setNewLessonContent(e.target.value)}
                          placeholder="Lesson content details..."
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white h-24 resize-none"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 text-xs">
                        <button 
                          onClick={() => setIsAddingLesson(false)}
                          className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            if (newLessonTitle && newLessonContent) {
                              setCustomLessons([...customLessons, { title: newLessonTitle, content: newLessonContent, duration: newLessonDuration }]);
                              setNewLessonTitle('');
                              setNewLessonContent('');
                              setNewLessonDuration('30 mins');
                              setIsAddingLesson(false);
                            }
                          }}
                          className="px-3 py-1.5 bg-orange-600 text-white rounded font-bold hover:bg-orange-700 transition-colors"
                        >
                          Save Lesson
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lessons list or empty state */}
                  {customLessons.length > 0 ? (
                    <div className="space-y-2">
                      {customLessons.map((les, lIdx) => (
                        <div key={lIdx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                          <div className="truncate pr-4 flex-grow">
                            <p className="font-bold text-slate-700 truncate">{les.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Duration: {les.duration}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setCustomLessons(customLessons.filter((_, idx) => idx !== lIdx));
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 transition-colors flex-shrink-0"
                            title="Delete Lesson"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-dashed border-slate-200 bg-amber-50/40 text-center text-xs text-slate-500">
                      No lessons added yet. <span className="text-amber-800 font-semibold">(Will default to the orientation example lesson)</span>. Click "Add Lesson" to build your own.
                    </div>
                  )}
                </div>

                {/* Quiz Questions Section */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center pb-1">
                    <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Quiz Questions</h4>
                    <button 
                      onClick={() => setIsAddingQuestion(true)}
                      className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center space-x-1"
                    >
                      <Plus size={14} />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {/* Inline Form for New Quiz Question */}
                  {isAddingQuestion && (
                    <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 space-y-3">
                      <h5 className="text-xs font-bold text-orange-800">Add New Quiz Question</h5>
                      <div>
                        <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Question Text</label>
                        <input 
                          type="text" 
                          value={newQuestionText}
                          onChange={(e) => setNewQuestionText(e.target.value)}
                          placeholder="e.g., Which subsidiary builds aerospace UAS systems?"
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-extrabold text-slate-400">Options</label>
                        {newQuestionOptions.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-400">{String.fromCharCode(65 + oIdx)}:</span>
                            <input 
                              type="text" 
                              value={opt}
                              onChange={(e) => {
                                const updated = [...newQuestionOptions];
                                updated[oIdx] = e.target.value;
                                setNewQuestionOptions(updated);
                              }}
                              className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Correct Answer</label>
                          <select 
                            value={newQuestionCorrect}
                            onChange={(e) => setNewQuestionCorrect(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Explanation</label>
                          <input 
                            type="text" 
                            value={newQuestionExplanation}
                            onChange={(e) => setNewQuestionExplanation(e.target.value)}
                            placeholder="Why is it correct?"
                            className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 text-xs">
                        <button 
                          onClick={() => setIsAddingQuestion(false)}
                          className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            if (newQuestionText && newQuestionOptions.every(o => o.trim() !== '')) {
                              setCustomQuiz([...customQuiz, {
                                question: newQuestionText,
                                options: [...newQuestionOptions],
                                correctAnswer: newQuestionCorrect,
                                explanation: newQuestionExplanation
                              }]);
                              setNewQuestionText('');
                              setNewQuestionOptions(['', '', '', '']);
                              setNewQuestionCorrect('A');
                              setNewQuestionExplanation('');
                              setIsAddingQuestion(false);
                            }
                          }}
                          className="px-3 py-1.5 bg-orange-600 text-white rounded font-bold hover:bg-orange-700 transition-colors"
                        >
                          Save Question
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quiz list or empty state */}
                  {customQuiz.length > 0 ? (
                    <div className="space-y-2">
                      {customQuiz.map((q, qIdx) => (
                        <div key={qIdx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                          <div className="truncate pr-4 flex-grow">
                            <p className="font-bold text-slate-700 truncate">{q.question}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Correct: Option {q.correctAnswer}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setCustomQuiz(customQuiz.filter((_, idx) => idx !== qIdx));
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 transition-colors flex-shrink-0"
                            title="Delete Question"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-dashed border-slate-200 bg-amber-50/40 text-center text-xs text-slate-500">
                      No quiz questions added. <span className="text-amber-800 font-semibold">(Will default to the orientation example question)</span>. Click "Add Question" to build your own.
                    </div>
                  )}
                </div>

                {validationError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-lg flex items-start space-x-2.5 text-xs font-semibold leading-normal mt-2">
                    <AlertCircle className="text-rose-500 mt-0.5 flex-shrink-0 animate-pulse" size={16} />
                    <span>{validationError}</span>
                  </div>
                )}

                <button 
                  onClick={handleSaveCustomContent}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-sm"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <BookOpenCheck size={18} />}
                  <span>Save Content</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full overflow-y-auto min-h-[480px] max-h-[600px] shadow-inner flex flex-col justify-between">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-24">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-orange-500" />
              <p className="font-medium text-slate-600">
                {activeMode === 'course' 
                  ? 'Synthesizing course curriculum and custom quizzes...' 
                  : `Aligning operational goals with ${selectedFramework === 'auto' ? 'optimal frameworks' : selectedFramework}...`}
              </p>
              <p className="text-xs text-slate-400 mt-2">Connecting with Gemini AI Service</p>
            </div>
          ) : activeMode === 'create' && generatedPlan ? (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600 leading-tight">
                        {generatedPlan.title}
                    </h2>
                    <span className="bg-slate-800 text-white text-[10px] uppercase font-extrabold px-2.5 py-1 rounded tracking-wider flex-shrink-0">
                      Aligned: {generatedPlan.frameworkUsed || 'Standard Framework'}
                    </span>
                </div>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">{generatedPlan.overview}</p>
              </div>
              <div className="space-y-4">
                {generatedPlan.modules.map((mod, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                      <h4 className="font-bold text-slate-800 flex items-center text-md">
                        <span className="bg-orange-100 text-orange-700 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-3 border border-orange-200 flex-shrink-0">{idx + 1}</span>
                        {mod.name}
                      </h4>
                      <div className="flex space-x-2 flex-shrink-0">
                        <div className="flex items-center text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                            <Clock size={11} className="mr-1" />
                            {mod.duration}
                        </div>
                        {(mod.levelOrStandard || mod.sfiaLevel) && (
                            <div className="flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 max-w-xs truncate">
                                <ShieldCheck size={11} className="mr-1 flex-shrink-0" />
                                <span className="truncate">{mod.levelOrStandard || mod.sfiaLevel}</span>
                            </div>
                        )}
                      </div>
                    </div>
                    <ul className="pl-10 space-y-1.5 mt-3">
                      {mod.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-600">
                          <ArrowRight size={12} className="mr-2 mt-0.5 text-orange-500 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 border-2 border-orange-600 text-orange-700 font-bold rounded-lg hover:bg-orange-50 transition-colors text-sm">
                Save to Group Training Calendar
              </button>
            </div>
          ) : activeMode === 'analyze' && analysisResult ? (
            <div className="prose prose-slate max-w-none animate-fade-in">
                <div className="flex items-center mb-6">
                    <div className="bg-rose-100 p-2.5 rounded-lg mr-3">
                        <Target className="text-rose-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 m-0">Multi-Framework Skills Gap Report</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Competencies • Alignment • Action Plan
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="whitespace-pre-wrap text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4">
                        {analysisResult}
                    </div>
                </div>
            </div>
          ) : (activeMode === 'course' || activeMode === 'custom') && generatedCourse ? (
            <div className="space-y-6 animate-fade-in text-slate-700">
              {publishSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-start space-x-3 shadow-sm">
                  <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0 animate-bounce" size={20} />
                  <div>
                    <h4 className="font-bold text-emerald-900">Course Successfully Published!</h4>
                    <p className="text-xs text-emerald-700 leading-normal mt-0.5">
                      "<strong>{generatedCourse.title}</strong>" has been compiled, aligned with <strong>{generatedCourse.frameworkUsed}</strong>, and successfully injected into the LMS active curriculum registry for EIB subsidiaries.
                    </p>
                  </div>
                </div>
              )}

              <div className="border-b border-slate-200 pb-4">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <h2 className="text-2xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600 leading-tight">
                    {generatedCourse.title}
                  </h2>
                  <span className="bg-orange-600 text-white text-[10px] uppercase font-extrabold px-2.5 py-1 rounded tracking-wider flex-shrink-0">
                    Framework Aligned: {generatedCourse.frameworkUsed}
                  </span>
                </div>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">{generatedCourse.description}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs font-semibold">
                  <div className="bg-slate-100 p-2 rounded border border-slate-200">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase font-sans">Category</span>
                    <span className="text-slate-700">{generatedCourse.category}</span>
                  </div>
                  <div className="bg-slate-100 p-2 rounded border border-slate-200">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase font-sans">Level</span>
                    <span className="text-slate-700">{generatedCourse.level}</span>
                  </div>
                  <div className="bg-slate-100 p-2 rounded border border-slate-200">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase font-sans">Format</span>
                    <span className="text-slate-700">{generatedCourse.format}</span>
                  </div>
                  <div className="bg-slate-100 p-2 rounded border border-slate-200">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase font-sans">Duration</span>
                    <span className="text-slate-700">{generatedCourse.duration}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">LMS Portable Export</p>
                    <p className="text-[10px] text-slate-400 font-medium">Download a beautifully formatted corporate Training Guide & Syllabus PDF for manual integration into your LMS.</p>
                  </div>
                  <button
                    onClick={() => setShowPDFGuideModal(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-extrabold rounded-lg flex items-center justify-center gap-2 text-xs transition-all shadow hover:shadow-md hover:from-amber-700 hover:to-orange-700"
                  >
                    <Printer size={14} />
                    <span>Export Course as PDF Guide</span>
                  </button>
                </div>

                {generatedCourse.videoUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video">
                    <iframe 
                      src={generatedCourse.videoUrl} 
                      title="Course Overview Video" 
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>

              {/* 5 Dynamic Lessons */}
              <div>
                <h3 className="text-sm font-extrabold uppercase text-slate-500 tracking-wider mb-3">5 Synthesized Lessons</h3>
                <div className="space-y-3">
                  {generatedCourse.lessons.map((lesson, idx) => (
                    <details key={idx} className="group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow transition-shadow">
                      <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-slate-800 list-none select-none">
                        <span className="flex items-center">
                          <span className="bg-amber-100 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 border border-amber-200 flex-shrink-0">
                            {idx + 1}
                          </span>
                          {lesson.title}
                        </span>
                        <div className="flex items-center text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                          <Clock size={10} className="mr-1" />
                          {lesson.duration}
                        </div>
                      </summary>
                      <div className="p-4 pt-0 border-t border-slate-100 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-50/50">
                        {lesson.content}
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Interactive Quiz Player & Certificate Generator */}
              <div className="bg-orange-50/20 rounded-xl p-5 border border-orange-100 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-orange-100 pb-3 gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase text-orange-800 tracking-wider flex items-center">
                      <Award className="mr-2 text-orange-600 animate-pulse" size={18} /> Aligned Compliance Assessment
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      {generatedCourse.quiz.length} Questions • Minimum 80% passing score required for L&D Certificate
                    </p>
                  </div>
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
                    {Object.keys(selectedAnswers).length} / {generatedCourse.quiz.length} Answered
                  </div>
                </div>

                <div className="space-y-4">
                  {generatedCourse.quiz.map((quizItem, qIdx) => {
                    const isCorrect = selectedAnswers[qIdx] === quizItem.correctAnswer;
                    const selectedOpt = selectedAnswers[qIdx];
                    
                    return (
                      <div key={qIdx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-xs sm:text-sm">
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <p className="font-bold text-slate-800">
                            <strong className="text-orange-600 mr-1.5">Q{qIdx + 1}:</strong> {quizItem.question}
                          </p>
                          {quizSubmitted && (
                            isCorrect ? (
                              <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[10px] flex items-center flex-shrink-0 border border-emerald-200">
                                <Check size={10} className="mr-1" /> Correct
                              </span>
                            ) : (
                              <span className="bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded text-[10px] flex items-center flex-shrink-0 border border-rose-200">
                                <X size={10} className="mr-1" /> Incorrect
                              </span>
                            )
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {quizItem.options.map((opt, oIdx) => {
                            const optLetter = String.fromCharCode(65 + oIdx); // A, B, C, D
                            const isThisSelected = selectedAnswers[qIdx] === optLetter;
                            const isThisCorrectAnswer = quizItem.correctAnswer === optLetter;
                            
                            let optionStyle = "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700";
                            
                            if (quizSubmitted) {
                              if (isThisSelected && isCorrect) {
                                optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold";
                              } else if (isThisSelected && !isCorrect) {
                                optionStyle = "border-rose-500 bg-rose-50 text-rose-950 font-semibold";
                              } else if (isThisCorrectAnswer) {
                                optionStyle = "border-emerald-500 bg-emerald-50/40 text-emerald-900 font-semibold";
                              } else {
                                optionStyle = "border-slate-100 bg-slate-50/50 opacity-60 text-slate-400";
                              }
                            } else {
                              if (isThisSelected) {
                                optionStyle = "border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-sm";
                              }
                            }

                            return (
                              <div 
                                key={oIdx} 
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    setSelectedAnswers({
                                      ...selectedAnswers,
                                      [qIdx]: optLetter
                                    });
                                  }
                                }}
                                className={`p-2.5 rounded border transition-colors text-xs font-medium flex items-center ${
                                  !quizSubmitted ? 'cursor-pointer' : 'cursor-default'
                                } ${optionStyle}`}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center border mr-2.5 text-[10px] font-extrabold ${
                                  isThisSelected 
                                    ? 'bg-orange-600 text-white border-orange-600' 
                                    : 'bg-white text-slate-600 border-slate-200'
                                }`}>
                                  {optLetter}
                                </span>
                                {opt}
                              </div>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-100 text-xs">
                            <p className="font-bold text-slate-700 flex items-center mb-1">
                              Explanation
                            </p>
                            <p className="text-slate-600">{quizItem.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submission Controls and Score Outputs */}
                {!quizSubmitted ? (
                  <div className="pt-3 border-t border-orange-100">
                    <button
                      onClick={() => {
                        const correctCount = generatedCourse.quiz.reduce((acc, q, idx) => q.correctAnswer === selectedAnswers[idx] ? acc + 1 : acc, 0);
                        const scorePercent = Math.round((correctCount / generatedCourse.quiz.length) * 100);
                        setQuizScorePercent(scorePercent);
                        setQuizSubmitted(true);
                      }}
                      disabled={Object.keys(selectedAnswers).length < generatedCourse.quiz.length}
                      className="w-full py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-extrabold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-sm"
                    >
                      <Award size={18} />
                      <span>
                        {Object.keys(selectedAnswers).length < generatedCourse.quiz.length 
                          ? `Complete all questions to submit (${Object.keys(selectedAnswers).length}/${generatedCourse.quiz.length})` 
                          : "Submit Compliance Assessment"}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-orange-100 space-y-6">
                    {/* Score Summary Banner */}
                    <div className={`p-5 rounded-xl border text-center ${
                      quizScorePercent !== null && quizScorePercent >= 80 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}>
                      <h4 className="text-lg font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
                        {quizScorePercent !== null && quizScorePercent >= 80 ? (
                          <>
                            <Award className="text-emerald-600 animate-bounce" size={24} />
                            <span>Assessment Passed!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="text-rose-600 animate-pulse" size={24} />
                            <span>Assessment Failed</span>
                          </>
                        )}
                      </h4>
                      <p className="text-sm font-semibold">
                        Your Score: <span className="text-2xl font-black">{quizScorePercent}%</span> (Minimum required to certify: <strong className="font-bold">80%</strong>)
                      </p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-md mx-auto">
                        {quizScorePercent !== null && quizScorePercent >= 80 
                          ? "Incredible work! You have fully satisfied EIB Group compliance protocols and qualify for an official certificate of completion." 
                          : "You scored below the 80% passing standard. Review the lesson contents and retake the assessment to earn your certificate."}
                      </p>
                    </div>

                    {/* Certificate of Completion */}
                    {quizScorePercent !== null && quizScorePercent >= 80 && (
                      <div className="bg-slate-900 rounded-xl p-3 sm:p-5 shadow-lg border border-slate-800 text-slate-900">
                        <div className="bg-white border-8 border-slate-900 outline outline-4 outline-amber-500/80 p-6 sm:p-12 rounded text-center relative overflow-hidden flex flex-col justify-between min-h-[480px]">
                          {/* Corner Borders */}
                          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600"></div>
                          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600"></div>
                          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600"></div>
                          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600"></div>

                          {/* Top Heading */}
                          <div className="space-y-2 mt-4">
                            <span className="font-mono text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500 block">EIB Group Learning & Development Academy</span>
                            <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase leading-none">Certificate of Completion</h2>
                            <div className="w-24 h-0.5 bg-amber-500 mx-auto mt-2"></div>
                          </div>

                          {/* Recipient */}
                          <div className="my-6">
                            <p className="text-xs text-slate-400 italic">This official credential certifies that</p>
                            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 my-2 px-4 border-b-2 border-slate-100 pb-2 inline-block max-w-full truncate">
                              {storageService.getSession()?.name || "EIB Group Candidate"}
                            </h3>
                            <p className="text-xs font-bold text-amber-700 tracking-wider uppercase font-sans">
                              {storageService.getSession()?.subsidiary || "Group Headquarters (EIB STRATOC)"}
                            </p>
                          </div>

                          {/* Scope */}
                          <div className="max-w-xl mx-auto space-y-2 text-xs text-slate-600 leading-relaxed">
                            <p>has successfully completed the formal curriculum requirements and mastered the operational compliance protocols of</p>
                            <p className="font-serif text-md sm:text-lg font-bold text-slate-800 italic">"{generatedCourse.title}"</p>
                            <p className="text-[10px] font-semibold text-slate-500">
                              Aligned Hybrid Framework: <strong className="font-bold text-slate-700">{generatedCourse.frameworkUsed}</strong>
                            </p>
                          </div>

                          {/* Footer Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-6 mt-8 text-[11px] text-slate-500">
                            <div className="flex flex-col justify-end">
                              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">Passing Score</span>
                              <span className="font-extrabold text-slate-800 text-sm">{quizScorePercent}% (EIB Min: 80%)</span>
                            </div>
                            <div className="flex justify-center items-center py-2 sm:py-0">
                              <div className="w-14 h-14 rounded-full border-4 border-amber-500 flex items-center justify-center text-amber-600 font-extrabold text-[8px] tracking-tighter uppercase rotate-12 select-none">
                                Approved L&D
                              </div>
                            </div>
                            <div className="flex flex-col justify-end">
                              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">Issue Date</span>
                              <span className="font-extrabold text-slate-800">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                          </div>

                          {/* Signatures */}
                          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400">
                            <div>
                              <p className="font-serif italic text-slate-700 text-xs text-center border-b border-slate-100 pb-1 max-w-xs mx-auto">Dr. Marcus Vance</p>
                              <p className="font-semibold text-center uppercase tracking-wider text-[8px] mt-1">Group L&D Director</p>
                            </div>
                            <div>
                              <p className="font-serif italic text-slate-700 text-xs text-center border-b border-slate-100 pb-1 max-w-xs mx-auto">EIB HQ Compliance Board</p>
                              <p className="font-semibold text-center uppercase tracking-wider text-[8px] mt-1">Authorized Audit Lead</p>
                            </div>
                          </div>
                        </div>

                        {/* Print/Download Button block */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4">
                          <button
                            onClick={() => {
                              window.print();
                            }}
                            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-lg flex items-center gap-2 text-xs transition-colors shadow"
                          >
                            <Printer size={14} />
                            <span>Print or Download PDF</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Try again controls */}
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => {
                          setSelectedAnswers({});
                          setQuizSubmitted(false);
                          setQuizScorePercent(null);
                        }}
                        className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg flex items-center gap-2 text-xs hover:bg-slate-100 transition-colors"
                      >
                        <RotateCcw size={14} />
                        <span>{quizScorePercent !== null && quizScorePercent >= 80 ? "Retake Assessment" : "Retake Quiz & Try Again"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-24">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                 <Sparkles className="w-10 h-10 text-slate-300" />
              </div>
              <p className="font-semibold text-center text-slate-600 max-w-xs">
                  Strategic insights will illuminate here.
              </p>
              <p className="text-xs text-slate-400 text-center max-w-xs mt-1">
                Generated pathways automatically map to industry frameworks matching the target sector perfectly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Standards Directory Reference Block */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100">
          <BookOpenCheck size={22} className="text-orange-600" />
          <h3 className="font-bold text-slate-800 text-lg">Group Standards & Frameworks Matrix</h3>
        </div>
        <p className="text-slate-500 text-sm mb-6 max-w-3xl">
          EIB Group incorporates a specialized, mixed-framework approach to skills development and training alignment, mapping each distinct business division to its respective industry-leading compliance and performance framework.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FRAMEWORKS.filter(f => f.id !== 'auto').map((f) => {
            return (
              <div key={f.id} className="border border-slate-100 hover:border-orange-200 rounded-xl p-5 hover:bg-slate-50/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {f.businessArea}
                    </span>
                    <Shield size={14} className="text-slate-300" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{f.name}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mb-3">{f.description}</p>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Strategic Justification</p>
                  <p className="text-slate-600 text-xs italic leading-snug">"{f.why}"</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showPDFGuideModal && generatedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] overflow-y-auto flex justify-center p-0 sm:p-6 print:absolute print:inset-0 print:p-0 print:bg-white print:overflow-visible print:z-0">
          <div className="bg-white w-full max-w-4xl rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none">
            {/* Top Toolbar (Hidden on Print) */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center z-50 shadow-md sticky top-0 print:hidden">
              <div className="flex items-center space-x-2">
                <Printer className="text-amber-400" size={20} />
                <h3 className="font-bold text-sm sm:text-md">LMS Curriculum Guide Exporter</h3>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-lg flex items-center gap-2 text-xs transition-colors shadow cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print or Save to PDF</span>
                </button>
                <button
                  onClick={() => setShowPDFGuideModal(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Content Booklet */}
            <div className="p-8 sm:p-12 overflow-y-auto print:overflow-visible print:p-0 space-y-8 bg-white text-slate-900 leading-relaxed font-sans">
              
              {/* EIB Cover Page Header */}
              <div className="text-center space-y-4 border-b-4 border-double border-slate-900 pb-8">
                <p className="font-mono text-xs uppercase tracking-[0.25em] font-black text-amber-600">EIB Group Strategic Learning Network</p>
                <h1 className="font-serif text-3xl sm:text-4xl font-black uppercase text-slate-900 tracking-tight leading-none mt-2">
                  Training Curriculum Guide
                </h1>
                <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  OFFICIAL INTERNAL USE COMPLIANCE STANDARD
                </p>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-white print:border-slate-300">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="font-serif text-2xl font-black text-slate-900">
                    {generatedCourse.title}
                  </h2>
                  <span className="bg-slate-900 text-white font-mono text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded flex-shrink-0">
                    {generatedCourse.frameworkUsed}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  {generatedCourse.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 text-xs text-slate-700">
                  <div>
                    <span className="block font-mono text-[9px] font-black uppercase text-slate-400">Curriculum Category</span>
                    <strong className="text-slate-900">{generatedCourse.category}</strong>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] font-black uppercase text-slate-400">Target Standard Level</span>
                    <strong className="text-slate-900">{generatedCourse.level}</strong>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] font-black uppercase text-slate-400">Instructional Format</span>
                    <strong className="text-slate-900">{generatedCourse.format}</strong>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] font-black uppercase text-slate-400">Curriculum Duration</span>
                    <strong className="text-slate-900">{generatedCourse.duration}</strong>
                  </div>
                </div>
              </div>

              {/* Framework Context Box */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-2 print:border-slate-300">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Framework Compliance Statement</h4>
                <p className="text-xs text-slate-600">
                  This course is compiled in alignment with the <strong className="text-slate-900">{generatedCourse.frameworkUsed}</strong> standards. 
                  All training assets, objectives, and dynamic quiz elements map fully to verified competencies of this governing body, ensuring subsidiary compliance audits pass unified EIB Group requirements.
                </p>
              </div>

              {/* 5 Detailed Lessons */}
              <div className="space-y-6 pt-4">
                <h3 className="font-serif text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-2 h-4 bg-amber-500 rounded-sm"></span>
                  SECTION I: Curriculum Syllabus & Lessons
                </h3>
                
                <div className="space-y-6">
                  {generatedCourse.lessons.map((lesson, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-sm print:shadow-none print:border-slate-300 break-inside-avoid">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h4 className="font-serif text-md font-extrabold text-slate-800 flex items-center">
                          <span className="bg-amber-100 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2.5 print:border print:border-amber-300">
                            {idx + 1}
                          </span>
                          {lesson.title}
                        </h4>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100">
                          Duration: {lesson.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {lesson.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz Assessment */}
              <div className="space-y-6 pt-4 break-before-page">
                <h3 className="font-serif text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-2 h-4 bg-amber-500 rounded-sm"></span>
                  SECTION II: Internal Compliance Assessment
                </h3>
                <p className="text-xs text-slate-500 italic mt-1">
                  Below is the certified evaluation matrix containing {generatedCourse.quiz.length} assessment items. A minimum grade of 80% is required for EIB Group subsidiaries' formal compliance credit.
                </p>

                <div className="space-y-6 mt-4 font-sans">
                  {generatedCourse.quiz.map((quizItem, qIdx) => (
                    <div key={qIdx} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-sm print:shadow-none print:border-slate-300 break-inside-avoid">
                      <p className="font-bold text-xs sm:text-sm text-slate-800">
                        <strong className="text-amber-600 mr-1.5 font-bold">Question {qIdx + 1}:</strong> {quizItem.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {quizItem.options.map((opt, oIdx) => {
                          const optLetter = String.fromCharCode(65 + oIdx);
                          const isCorrect = quizItem.correctAnswer === optLetter;
                          
                          return (
                            <div 
                              key={oIdx} 
                              className={`p-2.5 rounded border flex items-center ${
                                isCorrect 
                                  ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950 font-semibold print:border-emerald-300 print:bg-emerald-50' 
                                  : 'border-slate-200 bg-slate-50/40 text-slate-600'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-black mr-2 flex-shrink-0 ${
                                isCorrect 
                                  ? 'bg-emerald-600 text-white border-emerald-600' 
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}>
                                {optLetter}
                              </span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] leading-relaxed print:bg-white print:border-slate-200">
                        <p className="font-extrabold text-slate-700 flex items-center mb-0.5 uppercase tracking-wider text-[9px]">
                          Audit Reference Key & Explanation:
                        </p>
                        <p className="text-slate-600 mt-0.5">
                          <strong className="text-emerald-700 font-bold">Answer: Option {quizItem.correctAnswer}</strong>. {quizItem.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Institutional Sign-off Block */}
              <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8 mt-12 break-inside-avoid">
                <div className="text-center space-y-2">
                  <p className="font-serif italic text-slate-800 text-sm border-b border-slate-300 pb-1 max-w-xs mx-auto">
                    Dr. Marcus Vance
                  </p>
                  <p className="font-mono text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Group L&D Director
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">EIB Academy Central Board</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="font-serif italic text-slate-800 text-sm border-b border-slate-300 pb-1 max-w-xs mx-auto">
                    {storageService.getSession()?.name || "EIB Group Candidate"}
                  </p>
                  <p className="font-mono text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Designated Subsidiary Lead
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {storageService.getSession()?.subsidiary || "Group Subsidiary Branch"}
                  </p>
                </div>
              </div>

              {/* Document footer meta */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap justify-between text-[9px] text-slate-400 font-mono font-bold tracking-wider">
                <span>VERIFIED SYLLABUS CODE: LUM-{generatedCourse.level.slice(0,3).toUpperCase()}-{generatedCourse.duration.replace(/\s+/g,'')}</span>
                <span>GENERATED: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStrategist;
