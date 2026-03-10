import api from './api';
import {
  DashboardAlertsResponse,
  DashboardBotsResponse,
  DashboardComplianceResponse,
  ProjectDeployOperationResponse,
  DashboardProject,
  DashboardProcessesResponse,
  ProjectStatusResponse,
  DashboardSummaryResponse,
  DashboardTrendsResponse,
} from '@/features/dashboard/types';

export const dashboardService = {
  async getSummary(tenantId: string): Promise<DashboardSummaryResponse> {
    const { data } = await api.get<DashboardSummaryResponse>(`/dashboard/${tenantId}/summary`);
    return data;
  },

  async getTrends(tenantId: string): Promise<DashboardTrendsResponse> {
    const { data } = await api.get<DashboardTrendsResponse>(`/dashboard/${tenantId}/trends`);
    return data;
  },

  async getBots(tenantId: string): Promise<DashboardBotsResponse> {
    const { data } = await api.get<DashboardBotsResponse>(`/dashboard/${tenantId}/bots`);
    return data;
  },

  async getProcesses(tenantId: string): Promise<DashboardProcessesResponse> {
    const { data } = await api.get<DashboardProcessesResponse>(`/dashboard/${tenantId}/processes`);
    return data;
  },

  async getAlerts(tenantId: string): Promise<DashboardAlertsResponse> {
    const { data } = await api.get<DashboardAlertsResponse>(`/dashboard/${tenantId}/alerts`);
    return data;
  },

  async getCompliance(tenantId: string): Promise<DashboardComplianceResponse> {
    const { data } = await api.get<DashboardComplianceResponse>(`/dashboard/${tenantId}/compliance`);
    return data;
  },

  async getProjects(): Promise<DashboardProject[]> {
    const { data } = await api.get<DashboardProject[]>('/projects');
    return data;
  },

  async createProject(payload: { name: string; slug: string }): Promise<DashboardProject> {
    const { data } = await api.post<DashboardProject>('/projects', payload);
    return data;
  },

  async deployProject(slug: string): Promise<ProjectDeployOperationResponse> {
    const { data } = await api.post<ProjectDeployOperationResponse>(`/projects/${slug}/deploy`);
    return data;
  },

  async undeployProject(slug: string): Promise<ProjectDeployOperationResponse> {
    const { data } = await api.delete<ProjectDeployOperationResponse>(`/projects/${slug}/deploy`);
    return data;
  },

  async getProjectStatus(slug: string): Promise<ProjectStatusResponse> {
    const { data } = await api.get<ProjectStatusResponse>(`/projects/${slug}/status`);
    return data;
  },
};
