import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIStrategist from './components/AIStrategist';
import BudgetManager from './components/BudgetManager';
import NeedsAssessment from './components/NeedsAssessment';
import TrainingManager from './components/TrainingManager';
import ReportingManager from './components/ReportingManager';
import MeetingDeck from './components/MeetingDeck';
import { Building2, Plus, Loader2, Lock, Mail, User, Briefcase, ArrowRight, Sparkles, Presentation } from 'lucide-react';
import { UserProfile, Subsidiary, UserRole } from './types';
import { storageService } from './services/storageService';

// Initialize DB on load
storageService.init();

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
    <Building2 size={48} className="mb-4 opacity-50" />
    <h2 className="text-xl font-semibold text-slate-600">{title} Module</h2>
    <p className="mt-2">This module is part of the full EIB Group implementation.</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('SUBSIDIARY_MANAGER');
  const [subsidiary, setSubsidiary] = useState<Subsidiary>(Subsidiary.BRIGHT_FM);
  const [jobTitle, setJobTitle] = useState('');
  const [authError, setAuthError] = useState('');

  // Check for existing session
  useEffect(() => {
    const session = storageService.getSession();
    if (session) {
        setCurrentUser(session);
    }
    setLoading(false);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      
      try {
          if (authMode === 'login') {
              const user = storageService.login(email, password);
              if (user) {
                  setCurrentUser(user);
              } else {
                  setAuthError('Invalid credentials. Try "password".');
              }
          } else {
              // Sign Up
              const newUser = storageService.signup({
                  name,
                  email,
                  password,
                  role,
                  subsidiary: role === 'SUBSIDIARY_MANAGER' ? subsidiary : undefined,
                  jobTitle
              });
              setCurrentUser(newUser);
          }
      } catch (err: any) {
          setAuthError(err.message || 'An error occurred');
      }
  };

  const handleDemoLogin = () => {
      const demoUser = storageService.login('demo@lumethis.com', 'demo');
      if (demoUser) {
          setCurrentUser(demoUser);
      } else {
          setAuthError('Error initializing demo account. Please refresh.');
      }
  };

  const handleLogout = () => {
      storageService.logout();
      setCurrentUser(null);
      setEmail('');
      setPassword('');
      setAuthError('');
  };

  if (loading) return null;

  if (!currentUser) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent tracking-tight mb-2">Lumethis</h1>
                    <p className="text-slate-500">
                        {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {authError && (
                        <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-medium border border-rose-100">
                            {authError}
                        </div>
                    )}

                    {authMode === 'signup' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input 
                                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                                    <select 
                                        value={role} onChange={(e) => setRole(e.target.value as UserRole)}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-sm"
                                    >
                                        <option value="SUBSIDIARY_MANAGER">Subsidiary Mgr</option>
                                        <option value="GROUP_ADMIN">Group Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
                                    <input 
                                        type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                        placeholder="e.g. Director"
                                    />
                                </div>
                            </div>
                            {role === 'SUBSIDIARY_MANAGER' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subsidiary</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <select 
                                            value={subsidiary} onChange={(e) => setSubsidiary(e.target.value as Subsidiary)}
                                            className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                                        >
                                            {Object.values(Subsidiary).map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all flex justify-center items-center"
                    >
                        <span>{authMode === 'login' ? 'Access Portal' : 'Create Account'}</span>
                        <ArrowRight size={18} className="ml-2" />
                    </button>

                    {authMode === 'login' && (
                        <button 
                            type="button"
                            onClick={handleDemoLogin}
                            className="w-full py-3 mt-3 bg-white text-slate-700 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex justify-center items-center"
                        >
                            <Sparkles size={18} className="mr-2 text-amber-500" />
                            <span>Try Demo Account</span>
                        </button>
                    )}
                </form>
                
                <div className="mt-6 text-center pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            onClick={() => {
                                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                                setAuthError('');
                            }}
                            className="ml-2 text-amber-600 font-bold hover:underline"
                        >
                            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
      );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'assessment':
        return <NeedsAssessment />;
      case 'strategy':
        return <AIStrategist />;
      case 'training':
        return <TrainingManager user={currentUser} />;
      case 'budget':
        return <BudgetManager />;
      case 'reports':
        return <ReportingManager user={currentUser!} />;
      case 'presentation':
        return <MeetingDeck />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-64 p-8 print:m-0 print:p-0 print:ml-0">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            <div className="flex items-center space-x-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${currentUser.role === 'GROUP_ADMIN' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                <p className="text-slate-500 text-sm">
                    {currentUser.jobTitle ? `${currentUser.jobTitle} View` : (currentUser.role === 'GROUP_ADMIN' ? 'Group Control View' : `${currentUser.subsidiary} View`)}
                </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
             {currentUser.role === 'GROUP_ADMIN' && (
                <button className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                    <span>Scope: All Subsidiaries</span>
                </button>
             )}
             <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors">
                <Plus size={16} />
                <span>New Initiative</span>
             </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;