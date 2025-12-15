import React from 'react';
import { MetricType } from '../types';
import { 
  Wallet, CreditCard, UserCircle, TrendingUp, CheckCircle2, 
  Clock, ShieldCheck, Activity 
} from 'lucide-react';

interface MetricSelectorProps {
  availableMetrics: MetricType[];
  selectedMetrics: MetricType[];
  onToggleMetric: (metric: MetricType) => void;
}

const MetricSelector: React.FC<MetricSelectorProps> = ({ availableMetrics, selectedMetrics, onToggleMetric }) => {
  const getIcon = (metric: MetricType) => {
    switch (metric) {
      case MetricType.INCOME: return <Wallet className="w-4 h-4" />;
      case MetricType.EXPENSE: return <CreditCard className="w-4 h-4" />;
      case MetricType.MANAGER: return <UserCircle className="w-4 h-4" />;
      case MetricType.PROFIT_RATE: return <TrendingUp className="w-4 h-4" />;
      case MetricType.PROGRESS: return <Activity className="w-4 h-4" />;
      case MetricType.WORK_HOURS: return <Clock className="w-4 h-4" />;
      case MetricType.SAFETY_SCORE: return <ShieldCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white border-b border-slate-100 py-3 px-4 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)] z-10">
      <div className="flex justify-start gap-3 overflow-x-auto no-scrollbar">
        {availableMetrics.map((metric) => {
          const isActive = selectedMetrics.includes(metric);
          return (
            <button
              key={metric}
              onClick={() => onToggleMetric(metric)}
              className={`relative flex flex-col items-center justify-center flex-shrink-0 w-[72px] py-2 px-1 rounded-lg transition-all duration-200 border ${
                isActive 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                </div>
              )}
              <div className={`mb-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {getIcon(metric)}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{metric}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MetricSelector;