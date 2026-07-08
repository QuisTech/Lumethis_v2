import React, { useState } from 'react';
import { FileQuestion, Send, Loader2, Copy, Check, MessageSquare, Sliders, Eye, AlertCircle } from 'lucide-react';
import { generateNeedsAssessmentSurvey } from '../services/geminiService';
import { SurveyPlan } from '../types';

const NeedsAssessment: React.FC = () => {
  const [focusArea, setFocusArea] = useState('');
  const [respondentRole, setRespondentRole] = useState('Subsidiary Training Managers');
  const [intent, setIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [surveyPlan, setSurveyPlan] = useState<SurveyPlan | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!focusArea || !intent) return;
    setLoading(true);
    setError(null);
    setSurveyPlan(null);
    
    try {
        const result = await generateNeedsAssessmentSurvey(focusArea, respondentRole, intent);
        if (result) {
            setSurveyPlan(result);
        } else {
            setError("The AI responded but returned an empty plan. Try refining your request.");
        }
    } catch (err: any) {
        console.error("Survey Gen Error:", err);
        const errorMessage = err.message || "Unknown error occurred";
        if (errorMessage.includes("API Configuration Error")) {
             setError("API Key is missing. Please check your environment configuration.");
        } else {
             setError(`Generation Failed: ${errorMessage}. Check console for details.`);
        }
    } finally {
        setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!surveyPlan) return;
    const text = surveyPlan.questions.map(q => `${q.question} (${q.type})`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="bg-indigo-900 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex items-center space-x-3 mb-3 relative z-10">
          <FileQuestion className="text-indigo-300" size={32} />
          <h2 className="text-3xl font-bold tracking-tight">Diagnostic Pulse</h2>
        </div>
        <p className="text-indigo-200 max-w-2xl font-medium text-lg relative z-10">
          Don't just guess what the subsidiaries need. Generate intelligent, diagnostic questionnaires to uncover hidden friction points and opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <Sliders className="mr-2 text-indigo-600" size={20}/>
                Survey Configuration
            </h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Focus Area</label>
                    <input 
                        type="text" 
                        value={focusArea}
                        onChange={(e) => setFocusArea(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="e.g., LMS Adoption, Leadership Skills, Budget Process"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Target Respondent</label>
                    <select 
                        value={respondentRole}
                        onChange={(e) => setRespondentRole(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                    >
                        <option>Subsidiary Training Managers</option>
                        <option>Department Heads</option>
                        <option>End Learners / Employees</option>
                        <option>HR Directors</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Strategic Intent</label>
                    <textarea 
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-32 resize-none"
                        placeholder="Why are we asking this? e.g., We want to centralize vendor contracts but need to know who they are currently using and if they are happy."
                    />
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={loading || !focusArea || !intent}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <FileQuestion size={18} />}
                    <span>Generate Instrument</span>
                </button>
            </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 space-y-4">
            {error ? (
                <div className="h-full min-h-[400px] bg-rose-50 rounded-xl border border-rose-200 flex flex-col items-center justify-center text-rose-500 p-6 text-center animate-fade-in">
                    <AlertCircle size={48} className="mb-4" />
                    <h3 className="text-lg font-bold text-rose-700">Generation Failed</h3>
                    <p className="mt-2 text-sm max-w-sm text-rose-600">{error}</p>
                    <button onClick={() => setError(null)} className="mt-4 text-xs font-bold text-rose-500 underline">Dismiss</button>
                </div>
            ) : surveyPlan ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{surveyPlan.title}</h2>
                            <p className="text-slate-500 text-sm mt-1">{surveyPlan.description}</p>
                        </div>
                        <button 
                            onClick={copyToClipboard}
                            className="flex items-center space-x-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                            {copied ? <Check size={14}/> : <Copy size={14} />}
                            <span>{copied ? 'Copied' : 'Copy Questions'}</span>
                        </button>
                    </div>

                    <div className="p-8 space-y-8 bg-white">
                        {surveyPlan.questions.map((q, idx) => (
                            <div key={idx} className="relative group">
                                <div className="flex items-start">
                                    <span className="text-slate-300 font-bold text-lg mr-4 select-none">0{idx + 1}</span>
                                    <div className="flex-1">
                                        <p className="text-slate-800 font-medium text-lg mb-3">{q.question}</p>
                                        
                                        {/* Input Simulation based on type */}
                                        {q.type.toLowerCase() === 'scale' && (
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full"></div>
                                                <div className="flex justify-between w-full text-xs text-slate-400 uppercase font-bold tracking-wider mt-2">
                                                    <span>Strongly Disagree</span>
                                                    <span>Strongly Agree</span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {q.type.toLowerCase() === 'text' && (
                                            <div className="w-full h-20 bg-slate-50 border border-slate-200 rounded-lg border-dashed"></div>
                                        )}

                                        {q.type.toLowerCase() === 'choice' && q.options && (
                                            <div className="space-y-2">
                                                {q.options.map((opt, i) => (
                                                    <div key={i} className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                                                        <span className="text-slate-600 text-sm">{opt}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* AI Strategic Rationale */}
                                <div className="mt-4 ml-10 bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
                                    <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1 flex items-center">
                                        <Eye size={12} className="mr-1"/> Strategic Rationale
                                    </p>
                                    <p className="text-sm text-amber-800 italic">
                                        "{q.rationale}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
                        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-bold transition-colors">
                            <Send size={16} />
                            <span>Deploy to Subsidiaries</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="h-full min-h-[400px] bg-slate-50 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400">
                    <MessageSquare size={48} className="mb-4 opacity-30" />
                    <h3 className="text-lg font-semibold text-slate-600">No Assessment Generated</h3>
                    <p className="text-sm max-w-sm text-center mt-2">
                        Configure the focus area on the left to generate a tailored diagnostic instrument for your subsidiaries.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NeedsAssessment;