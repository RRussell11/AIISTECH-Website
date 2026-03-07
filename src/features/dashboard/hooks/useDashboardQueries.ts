import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

const STALE_TIME_MS = 30 * 1000;

export const useDashboardSummary = (tenantId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['dashboard', 'summary', tenantId],
    queryFn: () => dashboardService.getSummary(tenantId as string),
    enabled: Boolean(tenantId) && enabled,
    staleTime: STALE_TIME_MS,
  });
};

export const useDashboardTrends = (tenantId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['dashboard', 'trends', tenantId],
    queryFn: () => dashboardService.getTrends(tenantId as string),
    enabled: Boolean(tenantId) && enabled,
    staleTime: STALE_TIME_MS,
  });
};

export const useDashboardBots = (tenantId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['dashboard', 'bots', tenantId],
    queryFn: () => dashboardService.getBots(tenantId as string),
    enabled: Boolean(tenantId) && enabled,
    staleTime: STALE_TIME_MS,
  });
};

export const useDashboardProcesses = (tenantId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['dashboard', 'processes', tenantId],
    queryFn: () => dashboardService.getProcesses(tenantId as string),
    enabled: Boolean(tenantId) && enabled,
    staleTime: STALE_TIME_MS,
  });
};

export const useDashboardAlerts = (tenantId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['dashboard', 'alerts', tenantId],
    queryFn: () => dashboardService.getAlerts(tenantId as string),
    enabled: Boolean(tenantId) && enabled,
    staleTime: STALE_TIME_MS,
  });
};

export const useDashboardCompliance = (tenantId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['dashboard', 'compliance', tenantId],
    queryFn: () => dashboardService.getCompliance(tenantId as string),
    enabled: Boolean(tenantId) && enabled,
    staleTime: STALE_TIME_MS,
  });
};
