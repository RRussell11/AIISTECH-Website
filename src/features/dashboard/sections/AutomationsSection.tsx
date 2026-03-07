import React from 'react';
import { DashboardBotsResponse } from '@/features/dashboard/types';

interface AutomationsSectionProps {
  bots: DashboardBotsResponse | undefined;
  isBotsLoading: boolean;
  isBotsError: boolean;
}

export const AutomationsSection: React.FC<AutomationsSectionProps> = ({
  bots,
  isBotsLoading,
  isBotsError,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Automations Live Status</h3>
      <p className="text-sm text-slate-400 mb-5">Bot telemetry is now wired to `useDashboardBots`.</p>

      {isBotsError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-xs text-red-300">
            Failed to load bots. Verify endpoint `GET /api/dashboard/:tenantId/bots`.
          </p>
        </div>
      )}

      {isBotsLoading ? (
        <p className="text-sm text-slate-500">Loading automation fleet...</p>
      ) : bots?.bots?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Process</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Uptime %</th>
                <th className="py-2">Errors (7d)</th>
              </tr>
            </thead>
            <tbody>
              {bots.bots.map((bot) => (
                <tr key={bot.id} className="border-b border-slate-800">
                  <td className="py-2 pr-4 text-slate-100">{bot.name}</td>
                  <td className="py-2 pr-4 text-slate-300">{bot.processName}</td>
                  <td className="py-2 pr-4 text-slate-300">{bot.status}</td>
                  <td className="py-2 pr-4 text-slate-300">{bot.uptimePct}</td>
                  <td className="py-2 text-slate-300">{bot.errorCount7d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No bots returned for this tenant.</p>
      )}
    </div>
  );
};
