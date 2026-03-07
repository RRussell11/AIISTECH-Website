import React from 'react';
import { User } from '@/types/auth.types';

interface SettingsSectionProps {
  user: User | null;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ user }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Settings</h3>
      <p className="text-sm text-slate-400 mb-5">
        Phase 4 baseline settings view is live with authenticated profile context.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Full Name</p>
          <p className="text-sm text-white">{user ? `${user.firstName} ${user.lastName}` : '--'}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Email</p>
          <p className="text-sm text-white">{user?.email ?? '--'}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Role</p>
          <p className="text-sm text-white">{user?.role ?? '--'}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Tenant</p>
          <p className="text-sm text-white">{user?.tenantId ?? '--'}</p>
        </div>
      </div>
    </div>
  );
};
