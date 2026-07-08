import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const data = [
  { name: 'EIB Holdings', completion: 85 },
  { name: 'Tech Sol.', completion: 65 },
  { name: 'Logistics', completion: 92 },
  { name: 'Retail Arm', completion: 45 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Trainees" 
          value="1,245" 
          change="+12% from last Q" 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Active Programs" 
          value="8" 
          change="3 ending soon" 
          icon={BookOpen} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Budget Utilized" 
          value="0%" 
          change="Pending Init." 
          icon={CheckCircle} 
          color="bg-slate-400" 
        />
        <StatCard 
          title="Compliance Gaps" 
          value="3" 
          change="Action Required" 
          icon={AlertCircle} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Training Completion by Subsidiary</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.completion < 50 ? '#f43f5e' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Pending Approvals</h2>
          <div className="space-y-4">
            <ApprovalItem 
              title="Leadership Seminar Budget" 
              requestor="Sarah Jenkins (HR)" 
              amount="₦ 4,500,000" 
            />
            <ApprovalItem 
              title="External Vendor: Safety Co." 
              requestor="Mike Ross (Ops)" 
              amount="₦ 2,200,000" 
            />
            <ApprovalItem 
              title="New Hire Induction Kit" 
              requestor="Admin Team" 
              amount="₦ 800,000" 
            />
          </div>
          <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
            View All Requests
          </button>
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
      <p className={`text-xs font-medium mt-1 ${change.includes('Action') ? 'text-rose-500' : 'text-emerald-600'}`}>
        {change}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${color} text-white shadow-lg shadow-${color}/30`}>
      <Icon size={20} />
    </div>
  </div>
);

const ApprovalItem = ({ title, requestor, amount }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
    <div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500">{requestor}</p>
    </div>
    <span className="text-sm font-bold text-slate-700">{amount}</span>
  </div>
);

export default Dashboard;