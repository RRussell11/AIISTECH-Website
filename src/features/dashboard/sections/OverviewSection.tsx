import React from 'react';
import { DashboardMetric, DashboardTrendsResponse } from '@/features/dashboard/types';

interface OverviewSectionProps {
  overviewKpis: DashboardMetric[];
  isSummaryLoading: boolean;
  isSummaryError: boolean;
  trends: DashboardTrendsResponse | undefined;
  isTrendsLoading: boolean;
  isTrendsError: boolean;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  overviewKpis,
  isSummaryLoading,
  isSummaryError,
  trends,
  isTrendsLoading,
  isTrendsError,
}) => {
  return (
    <>
      {isSummaryError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-red-400 mb-1">Failed to load overview metrics</h3>
          <p className="text-xs text-slate-300">
            The dashboard summary API is unavailable right now. Verify backend endpoint
            `GET /api/dashboard/:tenantId/summary` and try again.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewKpis.map((kpi) => (
          <div key={kpi.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm text-slate-400 mb-2">{kpi.label}</h3>
            <p className="text-3xl font-bold text-white">{isSummaryLoading ? '...' : kpi.value}</p>
            <p className="text-xs text-slate-500 mt-2">
              {isSummaryLoading
                ? 'Loading live data...'
                : kpi.delta
                ? `Delta: ${kpi.delta}`
                : 'Live summary metric'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Overview Trends</h3>
        <p className="text-sm text-slate-400 mb-5">Savings and automation trend points from live API data.</p>

        {isTrendsError && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-xs text-red-300">
              Failed to load trends. Verify endpoint `GET /api/dashboard/:tenantId/trends`.
            </p>
          </div>
        )}

        {isTrendsLoading ? (
          <p className="text-sm text-slate-500">Loading trend points...</p>
        ) : trends?.points?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trends.points.map((point) => (
              <div key={point.date} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-300 mb-1">{point.date}</p>
                <p className="text-sm text-slate-400">Savings: <span className="text-slate-100">{point.savings ?? '--'}</span></p>
                <p className="text-sm text-slate-400">Automation: <span className="text-slate-100">{point.automationRate ?? '--'}%</span></p>
                <p className="text-sm text-slate-400">Error Rate: <span className="text-slate-100">{point.errorRate ?? '--'}%</span></p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No trend data returned.</p>
        )}
      </div>
    </>
  );
};
