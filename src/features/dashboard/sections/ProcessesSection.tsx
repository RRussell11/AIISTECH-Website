import React from 'react';
import { DashboardProcessesResponse } from '@/features/dashboard/types';

interface ProcessesSectionProps {
  processes: DashboardProcessesResponse | undefined;
  isProcessesLoading: boolean;
  isProcessesError: boolean;
}

export const ProcessesSection: React.FC<ProcessesSectionProps> = ({
  processes,
  isProcessesLoading,
  isProcessesError,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Processes Live Metrics</h3>
      <p className="text-sm text-slate-400 mb-5">Process telemetry is now wired to `useDashboardProcesses`.</p>

      {isProcessesError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-xs text-red-300">
            Failed to load processes. Verify endpoint `GET /api/dashboard/:tenantId/processes`.
          </p>
        </div>
      )}

      {isProcessesLoading ? (
        <p className="text-sm text-slate-500">Loading process metrics...</p>
      ) : processes?.processes?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="py-2 pr-4">Process</th>
                <th className="py-2 pr-4">Volume (30d)</th>
                <th className="py-2 pr-4">Avg Cycle Time</th>
                <th className="py-2 pr-4">Success Rate</th>
                <th className="py-2">Savings YTD</th>
              </tr>
            </thead>
            <tbody>
              {processes.processes.map((process) => (
                <tr key={process.id} className="border-b border-slate-800">
                  <td className="py-2 pr-4 text-slate-100">{process.name}</td>
                  <td className="py-2 pr-4 text-slate-300">{process.volume30d}</td>
                  <td className="py-2 pr-4 text-slate-300">{process.avgCycleTime}</td>
                  <td className="py-2 pr-4 text-slate-300">{process.successRate}%</td>
                  <td className="py-2 text-slate-300">{process.savingsYtd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No process metrics returned for this tenant.</p>
      )}
    </div>
  );
};
