import React from 'react';
import { DataItem, MetricType } from '../types';
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts';
import { TrendingUp, AlertCircle, Clock, ShieldCheck, Activity } from 'lucide-react';

interface DataDashboardProps {
  data: DataItem[];
  metrics: MetricType[];
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumSignificantDigits: 3 }).format(val);
};

const DataDashboard: React.FC<DataDashboardProps> = ({ data, metrics }) => {
  
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
        <p>请在下方选择至少一项条目</p>
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
          <p>请在上方选择至少一个指标</p>
        </div>
      );
  }

  const renderMetricContent = (metric: MetricType, item: DataItem) => {
    switch (metric) {
      case MetricType.INCOME:
      case MetricType.EXPENSE:
        const isIncome = metric === MetricType.INCOME;
        const mainValue = isIncome ? item.income : item.expense;
        const color = isIncome ? '#6366f1' : '#f43f5e'; // Indigo or Rose
        const label = isIncome ? '收入' : '支出';

        return (
          <div className="h-40 w-full mt-2">
             <div className="flex justify-between items-center mb-1 px-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${isIncome ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'}`}>
                    {label}
                </span>
                <span className={`text-lg font-bold ${isIncome ? 'text-indigo-600' : 'text-rose-500'}`}>
                  {formatCurrency(mainValue)}
                </span>
             </div>
             <ResponsiveContainer width="100%" height="80%">
                <BarChart data={item.history}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" hide />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {item.history.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={color} fillOpacity={0.6 + (index / 10)} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        );

      case MetricType.PROFIT_RATE:
        return (
          <div className="h-40 w-full mt-2 relative">
             <div className="flex justify-between items-center mb-1 px-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    盈利率
                </span>
                <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                    <span className="text-lg font-bold text-emerald-700">{item.profitRate}%</span>
                </div>
             </div>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={item.history}>
                <defs>
                  <linearGradient id={`colorProfit-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill={`url(#colorProfit-${item.id})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case MetricType.MANAGER:
        return (
          <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-xl border border-slate-100 mt-2">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              {item.manager.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">当前负责人</p>
              <p className="text-base font-bold text-slate-800">{item.manager}</p>
            </div>
            <div className="ml-auto flex flex-col items-end gap-1">
               <span className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-500">PMP认证</span>
            </div>
          </div>
        );
      
      case MetricType.PROGRESS:
        return (
          <div className="mt-4 px-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 flex items-center gap-1">
                <Activity className="w-3 h-3" /> 进度
              </span>
              <span className="text-lg font-bold text-blue-600">{item.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">预计完工: 2024-12-31</p>
          </div>
        );
      
      case MetricType.WORK_HOURS:
        return (
          <div className="mt-4 px-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold">本月工时</p>
                <p className="text-lg font-bold text-slate-800">{item.workHours} <span className="text-xs font-normal text-slate-400">小时</span></p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md inline-block">
                正常出勤
              </div>
            </div>
          </div>
        );

      case MetricType.SAFETY_SCORE:
        return (
          <div className="mt-4 px-1 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <ShieldCheck className={`w-8 h-8 ${item.safetyScore > 90 ? 'text-emerald-500' : 'text-amber-500'}`} />
                <div>
                  <p className="text-xs text-slate-500 font-bold">安全评分</p>
                  <p className={`text-xl font-bold ${item.safetyScore > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {item.safetyScore}
                  </p>
                </div>
             </div>
             <div className="w-24 h-12 relative overflow-hidden">
                {/* Simplified sparkline for visual flair */}
                <div className="absolute inset-0 flex items-end justify-between gap-1 opacity-50">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="w-full bg-emerald-200 rounded-t-sm" style={{height: `${Math.random() * 100}%`}}></div>
                  ))}
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {data.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start mb-2 border-b border-slate-50 pb-2">
            <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
             <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-md">ID: {item.id.split('-')[1]}</span>
          </div>
          
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <React.Fragment key={metric}>
                {index > 0 && <div className="h-px bg-slate-100 my-2" />}
                {renderMetricContent(metric, item)}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataDashboard;