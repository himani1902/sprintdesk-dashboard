export interface VelocityData {
  sprintName: string;
  completedPoints: number;
  totalPoints: number;
}

export interface StatusDistributionData {
  name: string;
  value: number;
  color: string;
}

export interface PriorityBreakdownData {
  column: string;
  low: number;
  medium: number;
  high: number;
  urgent: number;
}

export interface CompletionTrendData {
  date: string;
  completedTasks: number;
  cumulativeCompleted: number;
}
