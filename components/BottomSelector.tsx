import React from 'react';
import { DataItem } from '../types';

interface BottomSelectorProps {
  items: DataItem[];
  selectedIds: string[];
  onToggleId: (id: string) => void;
}

const BottomSelector: React.FC<BottomSelectorProps> = ({ items, selectedIds, onToggleId }) => {
  return (
    <div className="bg-white border-t border-slate-200 pb-safe">
      <div className="px-3 py-2">
        <div className="flex justify-between items-center mb-2">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
             可选列表 ({items.length})
           </p>
           <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
             已选 {selectedIds.length}
           </span>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onToggleId(item.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border select-none ${
                  isSelected
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomSelector;