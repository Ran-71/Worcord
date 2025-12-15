import React, { useState } from 'react';
import { ViewMode } from '../types';
import { ChevronDown, Calendar, Menu, ArrowRight, Clock, CalendarDays, CalendarRange } from 'lucide-react';

type DateMode = 'range' | 'daily' | 'monthly';

interface HeaderProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange, dateRange, onDateRangeChange }) => {
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>('range');

  // Format date for display (YYYY/MM/DD)
  const formatDateDisplay = (start: string, end: string) => {
    if (!start || !end) return '';
    if (start === end) return start.replace(/-/g, '/'); // Daily
    return `${start.replace(/-/g, '/')} - ${end.replace(/-/g, '/')}`;
  };

  const handleDailyChange = (date: string) => {
    onDateRangeChange({ start: date, end: date });
  };

  const handleMonthlyChange = (monthStr: string) => {
    // monthStr is YYYY-MM
    const [year, month] = monthStr.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0); // Last day of month
    
    // Format to YYYY-MM-DD using local time
    const format = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    onDateRangeChange({ start: format(startDate), end: format(endDate) });
  };

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-white shadow-sm z-50 sticky top-0 border-b border-slate-100">
      {/* Left: Mode Selector */}
      <div className="relative">
        <button 
          onClick={() => { setIsModeOpen(!isModeOpen); setIsTimeOpen(false); }}
          className="flex items-center space-x-2 text-slate-800 font-bold text-lg active:opacity-70"
        >
          <Menu className="w-5 h-5 text-indigo-600" />
          <span>{currentMode}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isModeOpen ? 'rotate-180' : ''}`} />
        </button>

        {isModeOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            {Object.values(ViewMode).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  onModeChange(mode);
                  setIsModeOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium ${
                  currentMode === mode ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Date Range Picker */}
      <div className="relative">
        <button 
          onClick={() => { setIsTimeOpen(!isTimeOpen); setIsModeOpen(false); }}
          className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs text-slate-600 font-medium active:bg-slate-200 transition-colors max-w-[160px]"
        >
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{formatDateDisplay(dateRange.start, dateRange.end)}</span>
        </button>

        {isTimeOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-4 animate-in fade-in zoom-in duration-200">
            
            {/* Tabs */}
            <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
              {[
                { id: 'daily', label: '日报', icon: Clock },
                { id: 'monthly', label: '月报', icon: CalendarDays },
                { id: 'range', label: '区间', icon: CalendarRange }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDateMode(tab.id as DateMode)}
                  className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    dateMode === tab.id 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="space-y-4">
              {dateMode === 'daily' && (
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500">选择日期</label>
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => handleDailyChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {dateMode === 'monthly' && (
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500">选择月份</label>
                  <input 
                    type="month" 
                    // Use start date's YYYY-MM
                    value={dateRange.start.slice(0, 7)}
                    onChange={(e) => handleMonthlyChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {dateMode === 'range' && (
                <>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-slate-500">开始日期</label>
                    <input 
                      type="date" 
                      value={dateRange.start}
                      onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex justify-center">
                     <ArrowRight className="w-4 h-4 text-slate-300 transform rotate-90" />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-slate-500">结束日期</label>
                    <input 
                      type="date" 
                      value={dateRange.end}
                      onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => setIsTimeOpen(false)}
              className="w-full mt-4 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all"
            >
              确定
            </button>
          </div>
        )}
      </div>
      
      {/* Backdrop for closing dropdowns */}
      {(isModeOpen || isTimeOpen) && (
        <div 
          className="fixed inset-0 z-[-1] bg-transparent"
          onClick={() => { setIsModeOpen(false); setIsTimeOpen(false); }}
        />
      )}
    </header>
  );
};

export default Header;