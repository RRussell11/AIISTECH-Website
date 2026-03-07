import React from 'react';
import { DashboardComplianceResponse, DashboardMetric } from '@/features/dashboard/types';

interface BillingSectionProps {
  summaryMetrics: DashboardMetric[];
  isSummaryLoading: boolean;
  isSummaryError: boolean;
  compliance: DashboardComplianceResponse | undefined;
  isComplianceLoading: boolean;
  isComplianceError: boolean;
}

export const BillingSection: React.FC<BillingSectionProps> = ({
  summaryMetrics,
  isSummaryLoading,
  isSummaryError,
  compliance,
  isComplianceLoading,
  isComplianceError,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Billing & Compliance Snapshot</h3>
      <p className="text-sm text-slate-400 mb-5">
        Billing summary cards are sourced from `useDashboardSummary`, with compliance telemetry from `useDashboardCompliance`.
      </p>

      {(isSummaryError || isComplianceError) && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-xs text-red-300">
            Failed to load billing dependencies. Verify `GET /api/dashboard/:tenantId/summary` and
            `GET /api/dashboard/:tenantId/compliance`.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryMetrics.slice(0, 4).map((metric) => (
          <div key={`billing-${metric.id}`} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-white">{isSummaryLoading ? '...' : metric.value}</p>
            <p className="text-xs text-slate-500 mt-1">{metric.delta ? `Delta: ${metric.delta}` : 'Summary metric'}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-2">Compliance Status</h4>
        {isComplianceLoading ? (
          <p className="text-sm text-slate-500">Loading compliance status...</p>
        ) : compliance ? (
          <>
            <p className="text-sm text-slate-300 mb-2">
              Score: <span className="text-white font-semibold">{compliance.score}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {compliance.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/30"
                >
                  {cert}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">No compliance data returned.</p>
        )}
      </div>
    </div>
  );
};
