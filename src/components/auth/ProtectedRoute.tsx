import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aiistech-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aiistech-primary mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Phase 2 — per-project subdomain access check
  // If we're on a project subdomain (*.aiistech.com, not app. or dashboard.),
  // the user's projects[] claim must include this slug.
  const hostname = window.location.hostname;
  const projectSlug = hostname.split('.')[0];
  const isProjectSubdomain =
    hostname.endsWith('.aiistech.com') &&
    projectSlug !== 'app' &&
    projectSlug !== 'dashboard' &&
    projectSlug !== 'api';

  if (isProjectSubdomain && !(user?.projects ?? []).includes(projectSlug)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aiistech-dark px-4">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-6">
            You don't have access to this project workspace.
          </p>
          <a
            href="https://app.aiistech.com/dashboard"
            className="inline-block px-6 py-3 bg-aiistech-primary text-aiistech-dark font-bold rounded-lg hover:opacity-90 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (roles && !hasRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aiistech-dark px-4">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-block px-6 py-3 bg-aiistech-primary text-aiistech-dark font-bold rounded-lg hover:opacity-90 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
