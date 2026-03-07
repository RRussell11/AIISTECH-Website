import api from './api';
import {
  DashboardAlertsResponse,
  DashboardBotsResponse,
  DashboardComplianceResponse,
  DashboardProcessesResponse,
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
};
