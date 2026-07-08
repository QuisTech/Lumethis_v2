import React from 'react';
import { DollarSign, PlusCircle } from 'lucide-react';

const BudgetManager: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Stats Placeholder */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
                <span className="text-3xl font-bold text-slate-300">₦</span>
            </div>
            <h3 className="text-slate-500 font-medium">Total Approved Budget (FY 2026)</h3>
            <div className="text-4xl font-bold text-slate-800 mt-2">₦ 0.00</div>
            <p className="text-sm text-slate-400 mt-2">No budget data initialized</p>
        </div>

        <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center border-dashed">
            <h3 className="text-lg font-bold text-slate-600 mb-2">Budget Utilization</h3>
            <p className="text-slate-400 text-sm mb-6">No active expenditure records found for this subsidiary/group.</p>
            <button className="flex items-center space-x-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                <PlusCircle size={16} />
                <span>Initialize Budget Cycle</span>
            </button>
        </div>
      </div>

      {/* Empty State Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Expenditure Line Items</h3>
            <span className="text-xs text-slate-500">Currency: Nigerian Naira (NGN)</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="text-slate-300" size={32} />
            </div>
            <h4 className="text-xl font-semibold text-slate-700 mb-2">No Records Available</h4>
            <p className="text-slate-500 max-w-md">
                There are currently no budget allocations or expenditure records for this fiscal period. 
                Please import your financial plan or create a new allocation request.
            </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;