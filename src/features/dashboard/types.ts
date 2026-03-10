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

export type ProjectLifecycleStatus = 'undeployed' | 'provisioning' | 'deployed' | 'failed';

export interface DashboardProject {
  id: string;
  slug: string;
  name: string;
  tenantId: string;
  ownerId: string;
  status: ProjectLifecycleStatus;
  url: string | null;
  deployedAt: string | null;
  updatedAt: string;
}

export interface ProjectProvisioningRun {
  runId: string;
  operation: 'deploy' | 'teardown';
  slug: string;
  status: 'running' | 'rolling_back' | 'completed' | 'failed';
  currentStep: string;
  error: string | null;
  failedStep?: string;
  steps?: ProjectSagaStep[];
  rollbackSteps?: ProjectSagaRollbackStep[];
  startedAt: string;
  finishedAt?: string;
}

export interface ProjectSagaStep {
  name: string;
  state: 'running' | 'completed' | 'rolling_back' | 'failed';
  details?: string;
  at: string;
}

export interface ProjectSagaRollbackStep {
  name: string;
  state: 'completed' | 'failed';
  error?: string;
  at: string;
}

export interface ProjectStatusResponse {
  slug: string;
  status: ProjectLifecycleStatus;
  url: string | null;
  deployedAt: string | null;
  provisioning: {
    runId: string | null;
    operation: 'deploy' | 'teardown' | null;
    currentStep: string | null;
    error: string | null;
    saga: ProjectProvisioningRun | null;
  };
}

export interface ProjectDeployOperationResponse {
  status: string;
  runId: string;
  operation: 'deploy' | 'teardown';
  message?: string;
}
