import React from 'react';
import { LayoutDashboard, GraduationCap, DollarSign, BrainCircuit, PieChart, ClipboardList, LogOut, Presentation } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'assessment', label: 'Diagnostic Pulse', icon: ClipboardList },
    { id: 'strategy', label: 'AI Strategist', icon: BrainCircuit },
    { id: 'training', label: 'Training Programs', icon: GraduationCap },
    { id: 'budget', label: 'Budget & Cost', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'presentation', label: 'Meeting Deck', icon: Presentation },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50 print:hidden">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent tracking-tight">Lumethis</h1>
        <p className="text-xs text-slate-400 mt-1 tracking-widest">
            {user.role === 'GROUP_ADMIN' ? 'EIB GROUP CONTROL' : 'SUBSIDIARY ACCESS'}
        </p>
      </div>
      
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Logged in as</p>
        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
        <p className="text-xs text-amber-400 truncate">{user.jobTitle || user.subsidiary || 'Group HQ'}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-amber-500/10 text-amber-200 border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? "text-amber-300" : ""} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-4">
        <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-rose-400 transition-colors"
        >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;