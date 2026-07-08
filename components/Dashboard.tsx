import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, BookOpen, AlertCircle, CheckCircle, Shield, Award, Sparkles, Building } from 'lucide-react';

const data = [
  { name: 'EIB Stratoc', completion: 88, framework: 'Korn Ferry & PMI PMBOK' },
  { name: 'Luftreiber Auto', completion: 74, framework: 'Lean Six Sigma & IATF 16949' },
  { name: 'Briech UAS', completion: 81, framework: 'LSS & Aviation Standards' },
  { name: 'DCI Security', completion: 92, framework: 'NICE Framework & IC Tradecraft' },
  { name: 'BEF Foundation', completion: 68, framework: 'Logical Framework Approach' },
  { name: 'Bright FM', completion: 79, framework: 'ScreenSkills Creative' },
  { name: 'Briech Atlantic', completion: 85, framework: 'PMI PMBOK & LSS' }
];

const matrixData = [
  {
    subsidiary: 'EIB Stratoc (Group HQ)',
    core: 'Korn Ferry Leadership Architect + PMI PMBOK',
    functional: 'Enterprise Strategy & Governance Standards',
    audience: 'Executive Directors, GMs, Unit Leaders',
    compliance: 'Standardized',
    color: 'border-slate-500 bg-slate-50/50'
  },
  {
    subsidiary: 'Luftreiber Automotive',
    core: 'Korn Ferry Leadership Core',
    functional: 'Lean Six Sigma (Green/Black Belt) & IATF 16949',
    audience: 'Factory Managers, Quality Inspectors, QA Lead',
    compliance: 'Audited',
    color: 'border-blue-500 bg-blue-50/20'
  },
  {
    subsidiary: 'Briech UAS (Drone & Aerospace)',
    core: 'PMI Talent Triangle / PMBOK Core',
    functional: 'Lean Six Sigma & National Aviation Regulations',
    audience: 'UAS Drone Pilots, Flight Safety Officers, Maintainers',
    compliance: 'Standardized',
    color: 'border-amber-500 bg-amber-50/20'
  },
  {
    subsidiary: 'DCI (RAW, SAC, PSAP, Intel)',
    core: 'Korn Ferry Leadership Core',
    functional: 'NICE Framework & Intelligence Tradecraft Core',
    audience: 'Operatives, Cyber Analysts, Forensics Experts',
    compliance: 'Highly Standardized',
    color: 'border-rose-500 bg-rose-50/20'
  },
  {
    subsidiary: 'BEF (Foundation & Non-Profit)',
    core: 'PMI Talent Triangle / PMBOK Core',
    functional: 'Logical Framework Approach / Theory of Change',
    audience: 'Field Officers, Project Coordinators, M&E Specialists',
    compliance: 'Active Integration',
    color: 'border-emerald-500 bg-emerald-50/20'
  },
  {
    subsidiary: 'Bright FM (Broadcast)',
    core: 'Korn Ferry Leadership Core',
    functional: 'ScreenSkills (Creative Skillset Standards)',
    audience: 'Radio Presenters, Transmission Engineers, Content Managers',
    compliance: 'Standardized',
    color: 'border-violet-500 bg-violet-50/20'
  },
  {
    subsidiary: 'Briech Atlantic (Construction & FM)',
    core: 'PMI Talent Triangle / PMBOK Core',
    functional: 'Lean Six Sigma & Facilities Management Standards',
    audience: 'Project Managers, HSE Auditors, Site Engineers',
    compliance: 'Active Integration',
    color: 'border-cyan-500 bg-cyan-50/20'
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Group Trainees" 
          value="1,480" 
          change="+18% from last Q" 
          icon={Users} 
          color="bg-amber-600 animate-pulse" 
        />
        <StatCard 
          title="Active Standards Programs" 
          value="12" 
          change="Multi-framework hybrid mode" 
          icon={BookOpen} 
          color="bg-indigo-600" 
        />
        <StatCard 
          title="LMS Framework Alignment" 
          value="100%" 
          change="All subsidiaries mapped" 
          icon={Shield} 
          color="bg-emerald-600" 
        />
        <StatCard 
          title="Group Compliance Score" 
          value="91%" 
          change="Outstanding alignment" 
          icon={Award} 
          color="bg-slate-800" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Training Completion by Subsidiary</h2>
          <p className="text-xs text-slate-500 mb-4">Percentage of staff fully aligned to their respective custom framework standards.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value, name, props) => [`${value}% Complete`, `Standard: ${props.payload.framework}`]}
                />
                <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.completion < 70 ? '#f43f5e' : entry.completion < 85 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Pending Standards Reviews</h2>
          <div className="space-y-4">
            <ApprovalItem 
              title="DCI Forensics NICE Mapping" 
              requestor="Colonel Ibrahim (Ops)" 
              amount="95% Match" 
            />
            <ApprovalItem 
              title="Luftreiber Lean QA Syllabus" 
              requestor="Junaid Raza (QA)" 
              amount="92% Match" 
            />
            <ApprovalItem 
              title="BEF LogFrame Workshop" 
              requestor="Dr. Yusuf (BEF)" 
              amount="90% Match" 
            />
          </div>
          <button className="w-full mt-6 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-200">
            View All Pending Reviews
          </button>
        </div>
      </div>

      {/* NEW EIB GROUP HYBRID COMPETENCY MATRIX SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Building className="text-amber-500" size={24} />
            <div>
              <h2 className="text-xl font-bold text-slate-800">EIB Group Competency Matrix</h2>
              <p className="text-xs text-slate-500 mt-0.5">Dynamic mixed-framework mapping assigned automatically based on subsidiary profile.</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center">
            <Sparkles size={10} className="mr-1 animate-pulse" /> Unified HR View
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Subsidiary</th>
                <th className="py-3 px-4">Leadership Core Framework</th>
                <th className="py-3 px-4">Specialized Functional Framework</th>
                <th className="py-3 px-4">Target Audience Group</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {matrixData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800">{row.subsidiary}</td>
                  <td className="py-4 px-4 text-slate-600">
                    <span className="inline-flex items-center space-x-1.5 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>{row.core}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-amber-700 font-bold">
                    <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200/50">
                      {row.functional}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500 font-medium">{row.audience}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      row.compliance === 'Highly Standardized' || row.compliance === 'Standardized' || row.compliance === 'Audited'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {row.compliance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      <p className="text-xs font-semibold mt-1 text-slate-400">
        {change}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${color} text-white shadow-lg`}>
      <Icon size={20} />
    </div>
  </div>
);

const ApprovalItem = ({ title, requestor, amount }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
    <div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500">{requestor}</p>
    </div>
    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">{amount}</span>
  </div>
);

export default Dashboard;