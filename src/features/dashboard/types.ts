export type DashboardTrendDirection = 'up' | 'down' | 'neutral';

export type DashboardMetricSeverity = 'success' | 'warn' | 'error' | 'neutral';

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend?: DashboardTrendDirection;
  unit?: string;
  severity?: DashboardMetricSeverity;
}

export interface DashboardSummaryResponse {
  tenantId: string;
  role: string;
  generatedAt: string;
  metrics: DashboardMetric[];
}

export interface DashboardTrendPoint {
  date: string;
  savings?: number;
  automationRate?: number;
  errorRate?: number;
}

export interface DashboardTrendsResponse {
  tenantId: string;
  generatedAt: string;
  points: DashboardTrendPoint[];
}

export interface DashboardBot {
  id: string;
  name: string;
  processName: string;
  status: 'Running' | 'Idle' | 'Error' | 'Maintenance';
  uptimePct: number;
  errorCount7d: number;
}

export interface DashboardBotsResponse {
  tenantId: string;
  generatedAt: string;
  bots: DashboardBot[];
}

export interface DashboardProcessMetric {
  id: string;
  name: string;
  volume30d: number;
  avgCycleTime: string;
  successRate: number;
  savingsYtd: string;
}

export interface DashboardProcessesResponse {
  tenantId: string;
  generatedAt: string;
  processes: DashboardProcessMetric[];
}

export interface DashboardAlert {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  createdAt: string;
}

export interface DashboardAlertsResponse {
  tenantId: string;
  generatedAt: string;
  alerts: DashboardAlert[];
}

export interface DashboardComplianceResponse {
  tenantId: string;
  generatedAt: string;
  score: number;
  certifications: string[];
}
