import React from 'react';
import { DashboardAlertsResponse, DashboardComplianceResponse } from '@/features/dashboard/types';

interface ComplianceSectionProps {
  compliance: DashboardComplianceResponse | undefined;
  alerts: DashboardAlertsResponse | undefined;
  isComplianceLoading: boolean;
  isComplianceError: boolean;
  isAlertsLoading: boolean;
  isAlertsError: boolean;
}

export const ComplianceSection: React.FC<ComplianceSectionProps> = ({
  compliance,
  alerts,
  isComplianceLoading,
  isComplianceError,
  isAlertsLoading,
  isAlertsError,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Compliance & Risk Monitor</h3>
      <p className="text-sm text-slate-400 mb-5">
        Compliance health and active alerts are now wired via `useDashboardCompliance` and `useDashboardAlerts`.
      </p>

      {(isComplianceError || isAlertsError) && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-xs text-red-300">
            Failed to load compliance data. Verify `GET /api/dashboard/:tenantId/compliance` and
            `GET /api/dashboard/:tenantId/alerts`.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Compliance Score</p>
          <p className="text-2xl font-bold text-white">
            {isComplianceLoading ? '...' : compliance?.score ?? '--'}
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 md:col-span-2">
          <p className="text-xs text-slate-400 mb-2">Certifications</p>
          {isComplianceLoading ? (
            <p className="text-sm text-slate-500">Loading certifications...</p>
          ) : compliance?.certifications?.length ? (
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
          ) : (
            <p className="text-sm text-slate-500">No certifications returned.</p>
          )}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Active Alerts</h4>
        {isAlertsLoading ? (
          <p className="text-sm text-slate-500">Loading alerts...</p>
        ) : alerts?.alerts?.length ? (
          <div className="space-y-2">
            {alerts.alerts.map((alert) => (
              <div key={alert.id} className="border border-slate-700 rounded-md p-3 bg-slate-900/50">
                <p className="text-sm text-white">{alert.title}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Severity: <span className="text-slate-200">{alert.severity}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No active alerts returned.</p>
        )}
      </div>
    </div>
  );
};
