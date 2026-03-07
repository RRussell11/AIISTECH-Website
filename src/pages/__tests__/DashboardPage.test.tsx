import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { DashboardPage } from '@/pages/DashboardPage';
import { UserRole } from '@/types/auth.types';

const mockUseAuth = vi.fn();
const mockUseDashboardSummary = vi.fn();
const mockUseDashboardTrends = vi.fn();
const mockUseDashboardAlerts = vi.fn();
const mockUseDashboardBots = vi.fn();
const mockUseDashboardProcesses = vi.fn();
const mockUseDashboardCompliance = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/features/dashboard/hooks/useDashboardQueries', () => ({
  useDashboardSummary: (...args: unknown[]) => mockUseDashboardSummary(...args),
  useDashboardTrends: (...args: unknown[]) => mockUseDashboardTrends(...args),
  useDashboardAlerts: (...args: unknown[]) => mockUseDashboardAlerts(...args),
  useDashboardBots: (...args: unknown[]) => mockUseDashboardBots(...args),
  useDashboardProcesses: (...args: unknown[]) => mockUseDashboardProcesses(...args),
  useDashboardCompliance: (...args: unknown[]) => mockUseDashboardCompliance(...args),
}));

const createAuthMock = (role: UserRole) => ({
  user: {
    id: '1',
    email: 'user@aiistech.com',
    firstName: 'Test',
    lastName: 'User',
    role,
    tenantId: 'tenant-1',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  },
  logout: vi.fn(),
  hasRole: (roles: UserRole[]) => roles.includes(role),
});

const renderAt = (path: string) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/dashboard/:section" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue(createAuthMock(UserRole.FINANCE));
    mockUseDashboardSummary.mockReturnValue({ data: undefined, isLoading: false, isError: false });
    mockUseDashboardTrends.mockReturnValue({ data: undefined, isLoading: false, isError: false });
    mockUseDashboardAlerts.mockReturnValue({ data: undefined, isLoading: false, isError: false });
    mockUseDashboardBots.mockReturnValue({ data: undefined, isLoading: false, isError: false });
    mockUseDashboardProcesses.mockReturnValue({ data: undefined, isLoading: false, isError: false });
    mockUseDashboardCompliance.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  });

  it('hides inaccessible nav chips based on role', () => {
    renderAt('/dashboard/overview');

    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Billing' })).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: 'Automations' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Processes' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Compliance' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument();
  });

  it('renders overview loading data states', () => {
    mockUseDashboardSummary.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    mockUseDashboardTrends.mockReturnValue({ data: undefined, isLoading: true, isError: false });

    renderAt('/dashboard/overview');

    expect(screen.getAllByText('Loading live data...').length).toBeGreaterThan(0);
    expect(screen.getByText('Loading trend points...')).toBeInTheDocument();
  });

  it('renders overview error data states', () => {
    mockUseDashboardSummary.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    mockUseDashboardTrends.mockReturnValue({ data: undefined, isLoading: false, isError: true });

    renderAt('/dashboard/overview');

    expect(screen.getByText('Failed to load overview metrics')).toBeInTheDocument();
    expect(screen.getByText('Failed to load trends. Verify endpoint `GET /api/dashboard/:tenantId/trends`.')).toBeInTheDocument();
  });

  it('renders automations empty state', () => {
    mockUseAuth.mockReturnValue(createAuthMock(UserRole.EXECUTIVE));
    mockUseDashboardBots.mockReturnValue({
      data: { tenantId: 'tenant-1', generatedAt: '', bots: [] },
      isLoading: false,
      isError: false,
    });

    renderAt('/dashboard/automations');

    expect(screen.getByText('No bots returned for this tenant.')).toBeInTheDocument();
  });

  it('renders automations error state', () => {
    mockUseAuth.mockReturnValue(createAuthMock(UserRole.EXECUTIVE));
    mockUseDashboardBots.mockReturnValue({ data: undefined, isLoading: false, isError: true });

    renderAt('/dashboard/automations');

    expect(screen.getByText('Failed to load bots. Verify endpoint `GET /api/dashboard/:tenantId/bots`.')).toBeInTheDocument();
  });

  it('renders processes loading state', () => {
    mockUseAuth.mockReturnValue(createAuthMock(UserRole.OPERATIONS));
    mockUseDashboardProcesses.mockReturnValue({ data: undefined, isLoading: true, isError: false });

    renderAt('/dashboard/processes');

    expect(screen.getByText('Loading process metrics...')).toBeInTheDocument();
  });

  it('renders processes error state', () => {
    mockUseAuth.mockReturnValue(createAuthMock(UserRole.OPERATIONS));
    mockUseDashboardProcesses.mockReturnValue({ data: undefined, isLoading: false, isError: true });

    renderAt('/dashboard/processes');

    expect(screen.getByText('Failed to load processes. Verify endpoint `GET /api/dashboard/:tenantId/processes`.')).toBeInTheDocument();
  });

  it('renders billing compliance loading state', () => {
    mockUseDashboardCompliance.mockReturnValue({ data: undefined, isLoading: true, isError: false });

    renderAt('/dashboard/billing');

    expect(screen.getByText('Loading compliance status...')).toBeInTheDocument();
  });

  it('renders billing compliance success state', () => {
    mockUseDashboardSummary.mockReturnValue({
      data: {
        tenantId: 'tenant-1',
        role: 'FINANCE',
        generatedAt: '',
        metrics: [
          { id: 'm1', label: 'Revenue', value: '$4.8M', delta: '+5%' },
          { id: 'm2', label: 'Cost Savings', value: '$1.2M', delta: '+12%' },
          { id: 'm3', label: 'FTE Hours Freed', value: '12400', delta: '+800' },
          { id: 'm4', label: 'ROI', value: '3.4x', delta: '+0.2' },
        ],
      },
      isLoading: false,
      isError: false,
    });
    mockUseDashboardCompliance.mockReturnValue({
      data: {
        tenantId: 'tenant-1',
        generatedAt: '',
        score: 94,
        certifications: ['SOC2', 'HIPAA'],
      },
      isLoading: false,
      isError: false,
    });

    renderAt('/dashboard/billing');

    expect(screen.getByText('Score:')).toBeInTheDocument();
    expect(screen.getByText('94')).toBeInTheDocument();
    expect(screen.getByText('SOC2')).toBeInTheDocument();
    expect(screen.getByText('HIPAA')).toBeInTheDocument();
  });

  it('renders billing compliance error state', () => {
    mockUseDashboardCompliance.mockReturnValue({ data: undefined, isLoading: false, isError: true });

    renderAt('/dashboard/billing');

    expect(
      screen.getByText(
        'Failed to load billing dependencies. Verify `GET /api/dashboard/:tenantId/summary` and `GET /api/dashboard/:tenantId/compliance`.'
      )
    ).toBeInTheDocument();
  });

  it('renders compliance loading state', () => {
    mockUseAuth.mockReturnValue(createAuthMock(UserRole.IT));
    mockUseDashboardCompliance.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    mockUseDashboardAlerts.mockReturnValue({ data: undefined, isLoading: true, isError: false });

    renderAt('/dashboard/compliance');

    expect(screen.getByText('Loading certifications...')).toBeInTheDocument();
    expect(screen.getByText('Loading alerts...')).toBeInTheDocument();
  });

  it('renders compliance success state', () => {
    mockUseAuth.mockReturnValue(createAuthMock(UserRole.IT));
    mockUseDashboardCompliance.mockReturnValue({
      data: {
        tenantId: 'tenant-1',
        generatedAt: '',
        score: 97,
        certifications: ['SOC2', 'ISO27001'],
      },
      isLoading: false,
      isError: false,
    });
    mockUseDashboardAlerts.mockReturnValue({
      data: {
        tenantId: 'tenant-1',
        generatedAt: '',
        alerts: [
          { id: 'a1', severity: 'HIGH', title: 'Bot Failure: Logistics_Sync', createdAt: '' },
          { id: 'a2', severity: 'LOW', title: 'Scheduled maintenance window', createdAt: '' },
        ],
      },
      isLoading: false,
      isError: false,
    });

    renderAt('/dashboard/compliance');

    expect(screen.getByText('97')).toBeInTheDocument();
    expect(screen.getByText('SOC2')).toBeInTheDocument();
    expect(screen.getByText('ISO27001')).toBeInTheDocument();
    expect(screen.getByText('Bot Failure: Logistics_Sync')).toBeInTheDocument();
    expect(screen.getByText('Scheduled maintenance window')).toBeInTheDocument();
  });

  it('renders compliance error state', () => {
    mockUseAuth.mockReturnValue(createAuthMock(UserRole.IT));
    mockUseDashboardCompliance.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    mockUseDashboardAlerts.mockReturnValue({ data: undefined, isLoading: false, isError: true });

    renderAt('/dashboard/compliance');

    expect(
      screen.getByText(
        'Failed to load compliance data. Verify `GET /api/dashboard/:tenantId/compliance` and `GET /api/dashboard/:tenantId/alerts`.'
      )
    ).toBeInTheDocument();
  });

  it('renders settings branch with user profile context', () => {
    mockUseAuth.mockReturnValue(createAuthMock(UserRole.IT));

    renderAt('/dashboard/settings');

    expect(screen.getByText('Phase 4 baseline settings view is live with authenticated profile context.')).toBeInTheDocument();
    expect(screen.getAllByText('Test User').length).toBeGreaterThan(0);
    expect(screen.getByText('user@aiistech.com')).toBeInTheDocument();
    expect(screen.getAllByText('IT').length).toBeGreaterThan(0);
    expect(screen.getByText('tenant-1')).toBeInTheDocument();
  });
});
