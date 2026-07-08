import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Send, History, CheckCircle, Clock, 
  AlertCircle, Sparkles, ChevronRight, User, Briefcase, 
  Calendar, MessageSquare, Save, Trash2, Eye
} from 'lucide-react';
import { DailyReport, UserProfile, StaffTask, Subsidiary } from '../types';
import { storageService } from '../services/storageService';
import { robustifyReport } from '../services/geminiService';

interface ReportingManagerProps {
  user: UserProfile;
}

const ReportingManager: React.FC<ReportingManagerProps> = ({ user }) => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [view, setView] = useState<'list' | 'create' | 'view'>('list');
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [isRobustifying, setIsRobustifying] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<DailyReport>>({
    employeeName: user.name,
    position: user.jobTitle || 'Manager',
    date: new Date().toISOString().split('T')[0],
    subsidiary: user.subsidiary || Subsidiary.EIB_HOLDINGS,
    overallSituation: '',
    goalForTheWeek: '',
    objectivesForTheWeek: '',
    staffTasks: [{ staffName: '', role: '', tasks: [''] }],
    timeSpent: '',
    tasksForTomorrow: '',
    gmNotes: '',
    remarks: '',
    status: 'Draft'
  });

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = () => {
    const data = storageService.getReports(user);
    setReports(data);
  };

  const handleCreateReport = () => {
    const newReport: DailyReport = {
      ...formData as DailyReport,
      id: `rep-${Date.now()}`,
      status: 'Submitted'
    };
    storageService.createReport(newReport);
    loadReports();
    setView('list');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      employeeName: user.name,
      position: user.jobTitle || 'Manager',
      date: new Date().toISOString().split('T')[0],
      subsidiary: user.subsidiary || Subsidiary.EIB_HOLDINGS,
      overallSituation: '',
      goalForTheWeek: '',
      objectivesForTheWeek: '',
      staffTasks: [{ staffName: '', role: '', tasks: [''] }],
      timeSpent: '',
      tasksForTomorrow: '',
      gmNotes: '',
      remarks: '',
      status: 'Draft'
    });
  };

  const handleRobustify = async (field: keyof DailyReport) => {
    const content = formData[field] as string;
    if (!content || content.length < 10) return;

    setIsRobustifying(field);
    try {
      const context = `${user.jobTitle} at ${user.subsidiary || 'Group HQ'}`;
      const robustContent = await robustifyReport(content, context);
      setFormData(prev => ({ ...prev, [field]: robustContent }));
    } finally {
      setIsRobustifying(null);
    }
  };

  const addStaffTask = () => {
    setFormData(prev => ({
      ...prev,
      staffTasks: [...(prev.staffTasks || []), { staffName: '', role: '', tasks: [''] }]
    }));
  };

  const updateStaffTask = (index: number, field: keyof StaffTask, value: any) => {
    const updated = [...(formData.staffTasks || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, staffTasks: updated }));
  };

  const addSubTask = (staffIndex: number) => {
    const updated = [...(formData.staffTasks || [])];
    updated[staffIndex].tasks.push('');
    setFormData(prev => ({ ...prev, staffTasks: updated }));
  };

  const updateSubTask = (staffIndex: number, taskIndex: number, value: string) => {
    const updated = [...(formData.staffTasks || [])];
    updated[staffIndex].tasks[taskIndex] = value;
    setFormData(prev => ({ ...prev, staffTasks: updated }));
  };

  if (view === 'create') {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Daily Work Report</h1>
            <p className="text-slate-500 text-sm">Complete the form below to submit your daily activities.</p>
          </div>
          <button 
            onClick={() => setView('list')}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="grid grid-cols-3 gap-6 p-6 bg-slate-50 border-b border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employee Name</label>
              <div className="flex items-center space-x-2 text-slate-900 font-medium">
                <User size={16} className="text-slate-400" />
                <span>{formData.employeeName}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Position</label>
              <div className="flex items-center space-x-2 text-slate-900 font-medium">
                <Briefcase size={16} className="text-slate-400" />
                <span>{formData.position}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
              <div className="flex items-center space-x-2 text-slate-900 font-medium">
                <Calendar size={16} className="text-slate-400" />
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-transparent border-none focus:ring-0 p-0 text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Overall Situation */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Overall Situation</h3>
                <button 
                  onClick={() => handleRobustify('overallSituation')}
                  disabled={isRobustifying === 'overallSituation'}
                  className="flex items-center space-x-1 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <Sparkles size={14} className={isRobustifying === 'overallSituation' ? 'animate-spin' : ''} />
                  <span>{isRobustifying === 'overallSituation' ? 'Robustifying...' : 'Robustify with AI'}</span>
                </button>
              </div>
              <textarea 
                value={formData.overallSituation}
                onChange={(e) => setFormData(prev => ({ ...prev, overallSituation: e.target.value }))}
                placeholder="Describe the general operational tempo and key highlights..."
                className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-slate-700"
              />
            </section>

            {/* Weekly Goals & Objectives */}
            <div className="grid grid-cols-2 gap-8">
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Goal for the Week</h3>
                <textarea 
                  value={formData.goalForTheWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, goalForTheWeek: e.target.value }))}
                  placeholder="Primary objective for this week..."
                  className="w-full h-24 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-slate-700 text-sm"
                />
              </section>
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Objectives for the Week</h3>
                <textarea 
                  value={formData.objectivesForTheWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, objectivesForTheWeek: e.target.value }))}
                  placeholder="Specific milestones to achieve..."
                  className="w-full h-24 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-slate-700 text-sm"
                />
              </section>
            </div>

            {/* Completed Tasks for Today */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Completed Tasks for Today</h3>
                <button 
                  onClick={addStaffTask}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Plus size={14} />
                  <span>Add Staff/Role</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {formData.staffTasks?.map((staff, sIdx) => (
                  <div key={sIdx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input 
                        placeholder="Staff Name or Unit"
                        value={staff.staffName}
                        onChange={(e) => updateStaffTask(sIdx, 'staffName', e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-sm font-medium"
                      />
                      <input 
                        placeholder="Role/Designation"
                        value={staff.role}
                        onChange={(e) => updateStaffTask(sIdx, 'role', e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      {staff.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <input 
                            placeholder="Describe task completed..."
                            value={task}
                            onChange={(e) => updateSubTask(sIdx, tIdx, e.target.value)}
                            className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                      ))}
                      <button 
                        onClick={() => addSubTask(sIdx)}
                        className="text-xs text-slate-500 hover:text-slate-900 ml-4 flex items-center space-x-1"
                      >
                        <Plus size={12} />
                        <span>Add Task</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Time Spent & Tomorrow */}
            <div className="grid grid-cols-2 gap-8">
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Total Time Spent</h3>
                <textarea 
                  value={formData.timeSpent}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeSpent: e.target.value }))}
                  placeholder="e.g. 08:00-10:00: Report Analysis..."
                  className="w-full h-24 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-slate-700 text-sm"
                />
              </section>
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Tasks for Tomorrow</h3>
                <textarea 
                  value={formData.tasksForTomorrow}
                  onChange={(e) => setFormData(prev => ({ ...prev, tasksForTomorrow: e.target.value }))}
                  placeholder="What's on the agenda for tomorrow?"
                  className="w-full h-24 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-slate-700 text-sm"
                />
              </section>
            </div>

            {/* GM Notes & Remarks */}
            <div className="grid grid-cols-2 gap-8">
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">GM Notes (Executive Insights)</h3>
                <textarea 
                  value={formData.gmNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, gmNotes: e.target.value }))}
                  placeholder="Strategic insights for executive review..."
                  className="w-full h-24 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-slate-700 text-sm"
                />
              </section>
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Remarks</h3>
                <textarea 
                  value={formData.remarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Final comments or observations..."
                  className="w-full h-24 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-slate-700 text-sm"
                />
              </section>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-4">
            <button 
              onClick={resetForm}
              className="px-6 py-2 text-slate-600 font-bold hover:text-slate-900 transition-colors"
            >
              Reset Form
            </button>
            <button 
              onClick={handleCreateReport}
              className="px-8 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center space-x-2"
            >
              <Send size={18} />
              <span>Submit Report</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'view' && selectedReport) {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <button 
                    onClick={() => setView('list')}
                    className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
                >
                    <ChevronRight size={20} className="rotate-180" />
                    <span>Back to Reports</span>
                </button>
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedReport.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                        {selectedReport.status}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none">
                <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Daily Work Report</h1>
                        <p className="text-slate-500 font-medium">{selectedReport.subsidiary}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-xl font-bold text-slate-900">{selectedReport.date}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-slate-100">
                    <div className="bg-white p-6">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Employee</p>
                        <p className="text-lg font-bold text-slate-800">{selectedReport.employeeName}</p>
                        <p className="text-sm text-slate-500">{selectedReport.position}</p>
                    </div>
                    <div className="bg-white p-6">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Goal for the Week</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{selectedReport.goalForTheWeek}</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">Overall Situation</h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedReport.overallSituation}</p>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">Completed Tasks for Today</h3>
                        <div className="space-y-6">
                            {selectedReport.staffTasks.map((staff, idx) => (
                                <div key={idx} className="bg-slate-50 p-6 rounded-xl">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="font-bold text-slate-900">{staff.staffName}</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase">{staff.role}</p>
                                    </div>
                                    <ul className="space-y-2">
                                        {staff.tasks.map((task, tIdx) => (
                                            <li key={tIdx} className="flex items-start space-x-3 text-sm text-slate-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                                <span>{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-8">
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">Tasks for Tomorrow</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{selectedReport.tasksForTomorrow}</p>
                        </section>
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">Time Spent</h3>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedReport.timeSpent}</p>
                        </section>
                    </div>

                    <section className="bg-slate-900 text-white p-8 rounded-2xl">
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">GM Notes & Executive Insights</h3>
                        <p className="text-slate-300 leading-relaxed italic">"{selectedReport.gmNotes}"</p>
                        <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
                            <p className="text-xs text-slate-500">Remarks: {selectedReport.remarks}</p>
                            <div className="flex items-center space-x-2">
                                <CheckCircle size={16} className="text-emerald-400" />
                                <span className="text-xs font-bold uppercase tracking-widest">Verified by Group HQ</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Group Reporting</h1>
          <p className="text-slate-500 mt-1 font-medium">
            {user.role === 'GROUP_ADMIN' 
              ? 'Consolidated subsidiary reports and operational insights.' 
              : `Daily activity reporting for ${user.subsidiary}.`}
          </p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center space-x-2 shadow-lg shadow-slate-200"
        >
          <Plus size={20} />
          <span>New Daily Report</span>
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <FileText size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Reports Found</h3>
          <p className="text-slate-500 max-w-xs text-center mt-2">
            Start by creating your first daily work report to track activities and insights.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <div 
              key={report.id}
              onClick={() => {
                setSelectedReport(report);
                setView('view');
              }}
              className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                  <FileText size={28} />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">Daily Report - {report.date}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      report.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{report.employeeName}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Briefcase size={14} />
                      <span>{report.subsidiary}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tasks Logged</p>
                  <p className="text-sm font-bold text-slate-700">{report.staffTasks.length} Units/Staff</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportingManager;
