import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MetricSelector from './components/MetricSelector';
import BottomSelector from './components/BottomSelector';
import DataDashboard from './components/DataDashboard';
import { ViewMode, MetricType, DataItem } from './types';
import { generateMockData, MODE_METRICS_MAP } from './constants';

const App: React.FC = () => {
  // State
  const [mode, setMode] = useState<ViewMode>(ViewMode.PERSONNEL);
  
  // Date Range State: Default to current month
  const [dateRange, setDateRange] = useState<{start: string, end: string}>(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    return {
      start: formatDate(firstDay),
      end: formatDate(today)
    };
  });

  // Metrics State
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>([]);
  
  const [rawData, setRawData] = useState<DataItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Effect: Generate data and reset metrics when mode changes
  useEffect(() => {
    const newData = generateMockData(mode);
    setRawData(newData);
    
    // Select first 3 items by default for better UX
    setSelectedIds(newData.slice(0, 3).map(item => item.id));

    // Reset metrics to the default for this mode (e.g., first item)
    const availableMetrics = MODE_METRICS_MAP[mode];
    if (availableMetrics && availableMetrics.length > 0) {
      setSelectedMetrics([availableMetrics[0]]);
    }
  }, [mode]);

  // Derived state for available metrics in current mode
  const availableMetrics = useMemo(() => MODE_METRICS_MAP[mode] || [], [mode]);

  // Handler: Update Date Range
  const handleDateRangeChange = (range: { start: string, end: string }) => {
    setDateRange(range);
  };

  // Handler: Toggle Metric
  const handleToggleMetric = (metric: MetricType) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metric)) {
        // Prevent deselecting the last metric
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== metric);
      } else {
        return [...prev, metric];
      }
    });
  };

  // Handler: Toggle Item Selection
  const handleToggleId = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        // Prevent empty selection
        if (prev.length === 1) return prev;
        return prev.filter(curr => curr !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Memo: Filter displayed data
  const filteredData = useMemo(() => {
    return rawData.filter(item => selectedIds.includes(item.id));
  }, [rawData, selectedIds]);

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans">
      {/* 1. Top Header: Mode & Date Range */}
      <Header 
        currentMode={mode} 
        onModeChange={setMode}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* 2. Second Row: Metrics (Multi-select) - Now Dynamic */}
      <MetricSelector 
        availableMetrics={availableMetrics}
        selectedMetrics={selectedMetrics} 
        onToggleMetric={handleToggleMetric} 
      />

      {/* 3. Middle: Data Display (Scrollable) */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="absolute inset-0">
          <DataDashboard 
            data={filteredData} 
            metrics={selectedMetrics} 
          />
        </div>
      </main>

      {/* 4. Bottom: Item Selector - Compact & Scrollable */}
      <footer className="shrink-0 z-40 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <BottomSelector 
          items={rawData} 
          selectedIds={selectedIds} 
          onToggleId={handleToggleId} 
        />
      </footer>
    </div>
  );
};

export default App;