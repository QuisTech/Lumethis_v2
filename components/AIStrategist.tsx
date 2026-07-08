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
  ChevronRight
} from 'lucide-react';
import { generateTrainingStrategy, analyzeSkillGap } from '../services/geminiService';
import { AIPlanResponse } from '../types';

const FRAMEWORKS = [
  {
    id: 'auto',
    name: 'Auto-Detect Framework',
    businessArea: 'All Business Areas',
    description: 'Let the AI dynamically select the most appropriate global standard based on your topic and target audience.',
    why: 'Uses contextual intelligence to match the exact requirements of your program automatically.'
  },
  {
    id: 'SFIA Foundation',
    name: 'SFIA Foundation',
    businessArea: 'Enterprise Skills',
    description: 'Defines skills, proficiency levels, and career paths across technology and business roles.',
    why: 'Provides a global common language for skills and competencies in the digital world.'
  },
  {
    id: 'Korn Ferry',
    name: 'Korn Ferry',
    businessArea: 'Leadership',
    description: 'Focuses on leadership, behavioral, executive, and management competencies.',
    why: 'The industry-standard for leadership development, organizational design, and talent management.'
  },
  {
    id: 'National Initiative for Cybersecurity Education (NICE)',
    name: 'NICE Framework',
    businessArea: 'Cybersecurity',
    description: 'Covers SOC analysts, security engineers, incident responders, and cyber operations.',
    why: 'Standardizes cybersecurity roles, skills, and activities under the US National Institute of Standards and Technology (NIST).'
  },
  {
    id: 'ISACA',
    name: 'ISACA Standards',
    businessArea: 'IT Governance',
    description: 'Governance, risk, compliance, COBIT standards, and information security.',
    why: 'Aligns IT systems directly with business strategies while ensuring strict compliance, auditability, and risk control.'
  },
  {
    id: 'Project Management Institute (PMI)',
    name: 'PMI Standards',
    businessArea: 'Project Delivery',
    description: 'Best practices for managing drone deployments, agile teams, and client delivery projects.',
    why: 'The absolute benchmark for professional project delivery, governance, and milestone tracking.'
  },
  {
    id: 'National Aviation Regulations and Operational Standards',
    name: 'Aviation Regulations',
    businessArea: 'Aviation Operations',
    description: 'Meets national aviation regulatory standards for UAS drone pilots, flight safety, operations, and aircraft maintenance.',
    why: 'Ensures absolute safety, regulatory compliance, and legally valid certifications for aerospace and drone activities.'
  }
];

const AIStrategist: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'create' | 'analyze'>('create');
  const [selectedFramework, setSelectedFramework] = useState('auto');
  
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
        
        <div className="flex space-x-4 mt-8 relative z-10">
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              {activeMode === 'create' ? <BookOpen className="mr-2 text-orange-500" size={20}/> : <Target className="mr-2 text-orange-500" size={20}/>}
              {activeMode === 'create' ? 'Program Parameters' : 'Analysis Context & Target'}
            </h3>
            
            {activeMode === 'create' ? (
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
            ) : (
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
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full overflow-y-auto min-h-[480px] max-h-[600px] shadow-inner flex flex-col justify-between">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-24">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-orange-500" />
              <p className="font-medium text-slate-600">
                Aligning operational goals with {selectedFramework === 'auto' ? 'optimal frameworks' : selectedFramework}...
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
    </div>
  );
};

export default AIStrategist;
