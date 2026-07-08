import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Download, Presentation, Sparkles, Target, 
  BarChart3, ShieldCheck, Users, Zap, 
  ArrowRight, CheckCircle2, Globe, Layout,
  AlertCircle, Clock, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

const MeetingDeck: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    // 1. Force the UI to update to the static slide state and wait
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 100)); // HACK: Ensure React re-render

    if (!componentRef.current) return;
    
    try {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const slides = componentRef.current.querySelectorAll('.slide-container');
      
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement;
        
        const canvas = await html2canvas(slide, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: slide.offsetWidth,
          height: slide.offsetHeight,
          windowWidth: slide.scrollWidth,
          windowHeight: slide.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            // Disable all stylesheets to prevent Tailwind CSS parsing
            while (clonedDoc.styleSheets.length > 0) {
              clonedDoc.styleSheets[0].disabled = true;
            }

            // Recursively clean all elements
            const sanitize = (el: HTMLElement) => {
              // 1. Remove style attributes containing problem colors
              const style = el.getAttribute('style') || '';
              if (style.includes('oklab') || style.includes('oklch')) {
                el.removeAttribute('style');
              }
              
              // 2. Remove class attributes that might be associated with Tailwind's oklab colors
              el.removeAttribute('class');
            };

            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach(el => sanitize(el as HTMLElement));
            sanitize(clonedDoc.body);
          }
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      }
      
      pdf.save('Lumethis_Staff_Presentation.pdf');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try opening the app in a new tab.');
    } finally {
      setIsGenerating(false);
    }
  };

  const StaticSlide = ({ children, title, subtitle, color = "amber" }: any) => (
    <div className="slide-container w-[297mm] h-[210mm] bg-white p-16 flex flex-col relative overflow-hidden page-break-after-always shadow-2xl mb-8 mx-auto border border-slate-100 rounded-3xl"
         style={{ backgroundColor: '#ffffff', color: '#000000', border: '1px solid #e2e8f0' }}>
      
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2" style={{ color: '#0f172a' }}>{title}</h2>
          <p className="text-xl text-slate-500 font-medium" style={{ color: '#64748b' }}>{subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold tracking-widest"
             style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
          <span>LUMETHIS GROUP</span>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        {children}
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center relative z-10"
           style={{ borderTop: '1px solid #f1f5f9' }}>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest" style={{ color: '#94a3b8' }}>Confidential | EIB Group Strategy 2026</p>
        <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0f172a' }}>
                <span className="text-amber-400 font-bold text-xs" style={{ color: '#fbbf24' }}>L</span>
            </div>
            <span className="text-sm font-bold text-slate-900" style={{ color: '#0f172a' }}>LUMETHIS</span>
        </div>
      </div>
    </div>
  );

  const Slide = ({ children, title, subtitle, color = "amber" }: any) => {
    if (isGenerating) {
      return <StaticSlide title={title} subtitle={subtitle} color={color}>{children}</StaticSlide>;
    }
    return (
    <div className="slide-container w-[297mm] h-[210mm] bg-white p-16 flex flex-col relative overflow-hidden page-break-after-always shadow-2xl mb-8 mx-auto border border-slate-100 rounded-3xl">
      {/* Background Accents */}
      <div 
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full ${isGenerating ? '' : 'blur-3xl'}`}
        style={{ backgroundColor: color === 'amber' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(244, 63, 94, 0.05)' }}
      />
      <div 
        className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full ${isGenerating ? '' : 'blur-3xl'}`}
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.05)' }}
      />
      
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div>
          <h2 className={`text-5xl font-black text-slate-900 tracking-tighter mb-2`}>{title}</h2>
          <p className="text-xl text-slate-500 font-medium">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold tracking-widest">
          <Globe size={16} className="text-amber-400" />
          <span>LUMETHIS GROUP</span>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        {children}
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center relative z-10">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Confidential | EIB Group Strategy 2026</p>
        <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 font-bold text-xs">L</span>
            </div>
            <span className="text-sm font-bold text-slate-900">LUMETHIS</span>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="p-8 bg-slate-50 min-h-screen print:p-0 print:bg-white">
      <div className="max-w-6xl mx-auto mb-12 flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Staff Presentation Deck</h1>
          <p className="text-slate-500 mt-2 font-medium">Download this professionally crafted presentation for today's meeting.</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className={`${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'} text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center space-x-3 shadow-xl shadow-amber-500/20`}
        >
          {isGenerating ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span className="text-lg">Generating PDF...</span>
            </>
          ) : (
            <>
              <Download size={24} />
              <span className="text-lg">Download PDF Deck</span>
            </>
          )}
        </button>
      </div>

      <div ref={componentRef} className="print:m-0 print:p-0">
        <style>{`
          .slide-container {
            /* Ensure the container has a layout context */
            contain: layout; 
            box-sizing: border-box;
          }
          
          @media print {
            @page { size: landscape; margin: 0; }
            body { background: white; }
            .page-break-after-always { page-break-after: always; }
            .shadow-2xl { box-shadow: none !important; }
            .rounded-3xl { border-radius: 0 !important; }
            .mx-auto { margin: 0 !important; }
            .mb-8 { margin-bottom: 0 !important; }
            .border { border: none !important; }
            .slide-container { 
              margin: 0 !important; 
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}</style>

        {/* Slide 1: Cover */}
        <div className="slide-container w-[297mm] h-[210mm] bg-slate-900 p-24 flex flex-col justify-center relative overflow-hidden page-break-after-always shadow-2xl mb-8 mx-auto rounded-3xl">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
            </div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
            >
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/40">
                        <Zap size={32} className="text-slate-900" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-widest uppercase">Lumethis</span>
                </div>
                <h1 className="text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                    THE NEW<br />
                    <span className="text-amber-400">STANDARD</span><br />
                    IN REPORTING
                </h1>
                <div className="h-2 w-32 bg-amber-500 mb-8" />
                <p className="text-2xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                    Transforming Group-level oversight through AI-powered strategy and robust operational reporting.
                </p>
            </motion.div>

            <div className="absolute bottom-24 right-24 text-right">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Staff Briefing</p>
                <p className="text-xl font-bold text-white">April 2026</p>
            </div>
        </div>

        {/* Slide 2: The Problem */}
        <Slide title="The Challenge" subtitle="Why we are evolving our reporting standards" color="rose">
            <div className="grid grid-cols-2 gap-12 mt-8">
                <div className="space-y-8">
                    <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100">
                        <div className="w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-rose-200">
                            <AlertCircle size={24} />
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Shallow Reporting</h4>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Current reports lack the analytical depth required for strategic decision-making at the Group level.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-slate-200">
                            <Clock size={24} />
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Operational Friction</h4>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Logistical delays and communication gaps are often hidden in brief, bulleted updates.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-rose-500" />
                        <h3 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                            "Management feels staff are not giving robust reports of activities and work."
                        </h3>
                        <p className="text-xl text-slate-500 italic">
                            — Group Executive Observation
                        </p>
                    </div>
                </div>
            </div>
        </Slide>

        {/* Slide 3: The Solution - AI Robustify */}
        <Slide title="AI-Powered Robustness" subtitle="Leveraging Gemini AI for professional excellence" color="amber">
            <div className="grid grid-cols-3 gap-8 mt-8">
                <div className="col-span-2 bg-slate-900 rounded-[40px] p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]" />
                    <div className="flex items-center space-x-3 mb-8">
                        <Sparkles className="text-amber-400" size={32} />
                        <h4 className="text-3xl font-bold text-white">The "Robustify" Engine</h4>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-900 font-bold">1</div>
                            <p className="text-xl text-slate-300">Staff enters raw operational data and daily highlights.</p>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-900 font-bold">2</div>
                            <p className="text-xl text-slate-300">AI analyzes context, role, and subsidiary standards.</p>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-900 font-bold">3</div>
                            <p className="text-xl text-slate-300 font-bold text-white">Generates professional, analytical, and detailed executive summaries.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-amber-50 rounded-[40px] p-12 border border-amber-100 flex flex-col justify-center items-center text-center">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                        <Zap size={48} className="text-amber-500" />
                    </div>
                    <h4 className="text-3xl font-black text-slate-900 mb-4">Instant<br />Professionalism</h4>
                    <p className="text-slate-600 text-lg">No more shallow reports. Every update reflects EIB excellence.</p>
                </div>
            </div>
        </Slide>

        {/* Slide 4: The New Template */}
        <Slide title="The New Standard" subtitle="Based on the EIB STRATOC Excellence Template" color="blue">
            <div className="grid grid-cols-4 gap-6 mt-8">
                {[
                    { icon: Layout, title: "Overall Situation", desc: "Operational tempo & highlights" },
                    { icon: Target, title: "Weekly Goals", desc: "Strategic alignment" },
                    { icon: Users, title: "Staff Breakdown", desc: "Unit-level accountability" },
                    { icon: BarChart3, title: "Time Analysis", desc: "Efficiency tracking" }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <item.icon size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
            <div className="mt-12 p-8 bg-blue-600 rounded-3xl text-white flex items-center justify-between">
                <div>
                    <h4 className="text-2xl font-bold mb-1">Unified Group Oversight</h4>
                    <p className="text-blue-100">Real-time visibility across all 8+ subsidiaries.</p>
                </div>
                <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-blue-600 bg-blue-400 flex items-center justify-center font-bold text-xs">
                            SUB
                        </div>
                    ))}
                </div>
            </div>
        </Slide>

        {/* Slide 5: Call to Action */}
        <Slide title="Next Steps" subtitle="Implementation starts today" color="emerald">
            <div className="flex flex-col items-center justify-center h-full -mt-12">
                <div className="grid grid-cols-3 gap-12 w-full max-w-4xl">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Adopt</h4>
                        <p className="text-slate-500">Switch to the new Lumethis reporting portal.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles size={40} />
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Utilize</h4>
                        <p className="text-slate-500">Use AI to robustify your daily updates.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ArrowRight size={40} />
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Excel</h4>
                        <p className="text-slate-500">Drive Group success through transparency.</p>
                    </div>
                </div>
                
                <div className="mt-20 text-center">
                    <h3 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">QUESTIONS?</h3>
                    <p className="text-xl text-slate-500 font-medium">Let's build the future of EIB Group together.</p>
                </div>
            </div>
        </Slide>
      </div>
    </div>
  );
};

export default MeetingDeck;
