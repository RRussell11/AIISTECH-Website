import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth.types';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleDashboardConfig = () => {
    switch (user?.role) {
      case UserRole.EXECUTIVE:
        return {
          title: 'Executive Dashboard',
          kpis: ['Cost Savings YTD', 'Revenue (PSA)', 'Automation Rate', 'Compliance Score'],
          description: 'High-level KPIs and strategic insights'
        };
      case UserRole.FINANCE:
        return {
          title: 'Finance Dashboard',
          kpis: ['Revenue', 'Cost Savings', 'FTE Hours Freed', 'ROI'],
          description: 'Financial metrics and savings analysis'
        };
      case UserRole.OPERATIONS:
        return {
          title: 'Operations Dashboard',
          kpis: ['Process Volume', 'Cycle Time', 'Success Rate', 'Bot Uptime'],
          description: 'Operational performance and process metrics'
        };
      case UserRole.IT:
        return {
          title: 'IT Dashboard',
          kpis: ['Bot Uptime', 'Error Rate', 'System Health', 'Active Alerts'],
          description: 'Technical metrics and system monitoring'
        };
      default:
        return {
          title: 'Dashboard',
          kpis: [],
          description: 'Welcome to your dashboard'
        };
    }
  };

  const config = getRoleDashboardConfig();

  return (
    <div className="min-h-screen bg-aiistech-dark">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="text-sm text-slate-400">{config.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.kpis.map((kpi, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm text-slate-400 mb-2">{kpi}</h3>
              <p className="text-3xl font-bold text-white">--</p>
              <p className="text-xs text-slate-500 mt-2">Connecting to API...</p>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-2">🚀 Integration Complete!</h3>
          <p className="text-slate-300">
            Authentication is working! The dashboard is now connected to the backend API.
            Real-time data will be displayed here once the Dashboard API endpoints are implemented in Phase 2.
          </p>
        </div>
      </main>
    </div>
  );
};
