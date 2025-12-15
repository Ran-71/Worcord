export enum ViewMode {
  PERSONNEL = '人员模式',
  PROJECT = '项目模式',
  LEADER = '带班模式',
  ENTERPRISE = '企业模式'
}

export enum MetricType {
  INCOME = '收入',
  EXPENSE = '支出',
  MANAGER = '负责人',
  PROFIT_RATE = '盈利率',
  PROGRESS = '进度',
  WORK_HOURS = '工时',
  SAFETY_SCORE = '安全分',

  PRICING = '计价',
  PROJECT = '项目',
  TEAM_LEADER = '带班',
  MEASUREMENT = '计量',
  UNIT_PRICE = '单价',
  AMOUNT = '金额',
  DATE = '日期',
  REMARKS = '备注'
}

export interface DataItem {
  id: string;
  name: string; 
  manager: string; 
  income: number;
  expense: number;
  profitRate: number; 
  progress: number;    // 0-100
  workHours: number;
  safetyScore: number; // 0-100
  history: { month: string; value: number }[]; 
}

export interface FilterState {
  mode: ViewMode;
  dateRange: { start: string; end: string };
  metrics: MetricType[];
  selectedIds: string[];
}