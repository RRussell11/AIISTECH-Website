import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleDisplayName, normalizeUserRoleForDashboard } from '@/features/dashboard/roleConfig';
import {
  canAccessDashboardSection,
  DASHBOARD_SECTIONS,
  getDashboardSectionLabel,
  isDashboardSection,
} from '@/features/dashboard/sectionAccess';
import {
  useDashboardAlerts,
  useDashboardBots,
  useDashboardCompliance,
  useDashboardProcesses,
  useDashboardSummary,
  useDashboardTrends,
} from '@/features/dashboard/hooks/useDashboardQueries';
import { DashboardMetric } from '@/features/dashboard/types';
import { OverviewSection } from '@/features/dashboard/sections/OverviewSection';
import { ProjectDeploymentSection } from '@/features/dashboard/sections/ProjectDeploymentSection';
import { AutomationsSection } from '@/features/dashboard/sections/AutomationsSection';
import { ProcessesSection } from '@/features/dashboard/sections/ProcessesSection';
import { BillingSection } from '@/features/dashboard/sections/BillingSection';
import { ScaffoldedSection } from '@/features/dashboard/sections/ScaffoldedSection';
import { ComplianceSection } from '@/features/dashboard/sections/ComplianceSection';
import { SettingsSection } from '@/features/dashboard/sections/SettingsSection';

export const DashboardPage: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const { section } = useParams<{ section: string }>();

  const normalizedRole = normalizeUserRoleForDashboard(user?.role);

  const getRoleDashboardConfig = () => {
    switch (normalizedRole) {
      case 'Executive':
        return {
          title: 'Executive Dashboard',
          kpis: ['Cost Savings YTD', 'Revenue (PSA)', 'Automation Rate', 'Compliance Score'],
          description: 'High-level KPIs and strategic insights',
        };
      case 'Finance':
        return {
          title: 'Finance Dashboard',
          kpis: ['Revenue', 'Cost Savings', 'FTE Hours Freed', 'ROI'],
          description: 'Financial metrics and savings analysis',
        };
      case 'Operations':
        return {
          title: 'Operations Dashboard',
          kpis: ['Process Volume', 'Cycle Time', 'Success Rate', 'Bot Uptime'],
          description: 'Operational performance and process metrics',
        };
      case 'IT':
        return {
          title: 'IT Dashboard',
          kpis: ['Bot Uptime', 'Error Rate', 'System Health', 'Active Alerts'],
          description: 'Technical metrics and system monitoring',
        };
      default:
        return {
          title: 'Dashboard',
          kpis: [],
          description: 'Welcome to your dashboard',
        };
    }
  };

  const config = getRoleDashboardConfig();
  const currentSection = isDashboardSection(section) ? section : 'overview';
  const activeSectionLabel = getDashboardSectionLabel(currentSection);

  const visibleSections = DASHBOARD_SECTIONS.filter((item) => canAccessDashboardSection(item, hasRole));
  const isSectionAllowed = canAccessDashboardSection(currentSection, hasRole);

  const isOverviewSection = currentSection === 'overview';
  const isProjectsSection = currentSection === 'projects';
  const isAutomationsSection = currentSection === 'automations';
  const isProcessesSection = currentSection === 'processes';
  const isBillingSection = currentSection === 'billing';
  const isComplianceSection = currentSection === 'compliance';
  const isSettingsSection = currentSection === 'settings';

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useDashboardSummary(user?.tenantId, isOverviewSection || isBillingSection);

  const {
    data: trends,
    isLoading: isTrendsLoading,
    isError: isTrendsError,
  } = useDashboardTrends(user?.tenantId, isOverviewSection);

  const {
    data: bots,
    isLoading: isBotsLoading,
    isError: isBotsError,
  } = useDashboardBots(user?.tenantId, isAutomationsSection);

  const {
    data: processes,
    isLoading: isProcessesLoading,
    isError: isProcessesError,
  } = useDashboardProcesses(user?.tenantId, isProcessesSection);

  const {
    data: compliance,
    isLoading: isComplianceLoading,
    isError: isComplianceError,
  } = useDashboardCompliance(user?.tenantId, isBillingSection || isComplianceSection);

  const {
    data: alerts,
    isLoading: isAlertsLoading,
    isError: isAlertsError,
  } = useDashboardAlerts(user?.tenantId, isComplianceSection);

  const fallbackKpis: DashboardMetric[] = config.kpis.map((label, index) => ({
    id: `fallback-${index}`,
    label,
    value: '--',
    trend: 'neutral',
    severity: 'neutral',
  }));

  const overviewKpis = summary?.metrics?.length ? summary.metrics : fallbackKpis;
  const billingSummaryMetrics = summary?.metrics?.length ? summary.metrics : fallbackKpis;

  if (!isSectionAllowed) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return (
    <div className="min-h-screen bg-aiistech-dark">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="text-sm text-slate-400">{config.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-400">{getRoleDisplayName(user?.role)}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {visibleSections.map((item) => {
            const isActive = item === currentSection;
            return (
              <Link
                key={item}
                to={`/dashboard/${item}`}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-aiistech-primary text-aiistech-dark font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {getDashboardSectionLabel(item)}
              </Link>
            );
          })}
        </div>

        {isOverviewSection ? (
          <OverviewSection
            overviewKpis={overviewKpis}
            isSummaryLoading={isSummaryLoading}
            isSummaryError={isSummaryError}
            trends={trends}
            isTrendsLoading={isTrendsLoading}
            isTrendsError={isTrendsError}
          />
        ) : isProjectsSection ? (
          <ProjectDeploymentSection userId={user?.id} />
        ) : isAutomationsSection ? (
          <AutomationsSection
            bots={bots}
            isBotsLoading={isBotsLoading}
            isBotsError={isBotsError}
          />
        ) : isProcessesSection ? (
          <ProcessesSection
            processes={processes}
            isProcessesLoading={isProcessesLoading}
            isProcessesError={isProcessesError}
          />
        ) : isBillingSection ? (
          <BillingSection
            summaryMetrics={billingSummaryMetrics}
            isSummaryLoading={isSummaryLoading}
            isSummaryError={isSummaryError}
            compliance={compliance}
            isComplianceLoading={isComplianceLoading}
            isComplianceError={isComplianceError}
          />
        ) : isComplianceSection ? (
          <ComplianceSection
            compliance={compliance}
            alerts={alerts}
            isComplianceLoading={isComplianceLoading}
            isComplianceError={isComplianceError}
            isAlertsLoading={isAlertsLoading}
            isAlertsError={isAlertsError}
          />
        ) : isSettingsSection ? (
          <SettingsSection user={user} />
        ) : (
          <ScaffoldedSection sectionLabel={activeSectionLabel} />
        )}

        <div className="mt-8 bg-blue-500/10 border border-blue-500/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-2">Integration Complete</h3>
          <p className="text-slate-300">
            Overview is now wired to live API data through `dashboardService` and React Query.
            Automations, processes, billing, compliance, and settings are now live.
          </p>
          <p className="text-slate-400 text-sm mt-3">
            Active section: <span className="font-semibold text-slate-200">{activeSectionLabel}</span>
          </p>
        </div>
      </main>
    </div>
  );
};
