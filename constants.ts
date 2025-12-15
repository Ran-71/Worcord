import { DataItem, ViewMode, MetricType } from './types';

// Helper to generate random number
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Names for generation
const NAMES = [
  '张伟', '李强', '王芳', '赵杰', '孙敏', '周涛', '吴兰', '郑华', '陈明', '刘静',
  '杨洋', '徐辉', '朱丽', '郭平', '马超', '罗薇', '胡康', '林森', '何光', '高建'
];
const PROJECTS = [
  '阿尔法塔楼', '贝塔商业中心', '海湾大桥维修', '地铁3号线', '高新区软件园', 
  '中心医院扩建', '滨江公园景观', '智慧城市系统', '东部快速路', '西城改造',
  '云端数据中心', '未来学校一期', '国际会展中心', '深海探测基地', '航空物流园'
];
const DEPARTMENTS = ['总经办', '工程部', '财务部', '市场部', '人力资源部', '技术研发部', '安全质检部', '后勤保障部'];

// Define which metrics are available for each mode
export const MODE_METRICS_MAP: Record<ViewMode, MetricType[]> = {
  [ViewMode.PERSONNEL]: [MetricType.PRICING, MetricType.PROJECT, MetricType.TEAM_LEADER, MetricType.MEASUREMENT, MetricType.UNIT_PRICE, MetricType.AMOUNT, MetricType.DATE, MetricType.REMARKS],
  [ViewMode.PROJECT]: [MetricType.PROGRESS, MetricType.INCOME, MetricType.EXPENSE, MetricType.PROFIT_RATE, MetricType.MANAGER],
  [ViewMode.LEADER]: [MetricType.SAFETY_SCORE, MetricType.WORK_HOURS, MetricType.MANAGER],
  [ViewMode.ENTERPRISE]: [MetricType.INCOME, MetricType.EXPENSE, MetricType.PROFIT_RATE],
};

export const generateMockData = (mode: ViewMode): DataItem[] => {
  let sourceNames: string[] = [];
  
  switch (mode) {
    case ViewMode.PERSONNEL:
    case ViewMode.LEADER: 
      sourceNames = [...NAMES, ...NAMES.map(n => n + ' (B组)')]; // Increase count
      break;
    case ViewMode.PROJECT:
      sourceNames = [...PROJECTS, ...PROJECTS.map(n => n + ' 二期')]; // Increase count
      break;
    case ViewMode.ENTERPRISE:
      sourceNames = DEPARTMENTS;
      break;
    default:
      sourceNames = NAMES;
  }

  return sourceNames.map((name, index) => {
    const income = random(50000, 500000);
    const expense = Math.floor(income * (random(40, 90) / 100));
    const profitRate = parseFloat(((income - expense) / income * 100).toFixed(1));
    const progress = random(10, 95);
    const workHours = random(120, 200);
    const safetyScore = random(85, 100);

    // Generate 6 months of history for charts
    const history = Array.from({ length: 6 }).map((_, i) => ({
      month: `${i + 1}月`,
      value: random(10000, 100000)
    }));

    return {
      id: `id-${index}`,
      name: name,
      manager: NAMES[random(0, NAMES.length - 1)],
      income,
      expense,
      profitRate,
      progress,
      workHours,
      safetyScore,
      history
    };
  });
};

export const TIME_RANGES = ['本周', '本月', '本季度', '本年'];