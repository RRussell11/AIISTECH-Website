import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComplianceSection } from '@/features/dashboard/sections/ComplianceSection';
import { DashboardAlertsResponse, DashboardComplianceResponse } from '@/features/dashboard/types';

const baseCompliance: DashboardComplianceResponse = {
  tenantId: 'tenant-1',
  generatedAt: '',
  score: 94,
  certifications: ['SOC2', 'HIPAA'],
};

const baseAlerts: DashboardAlertsResponse = {
  tenantId: 'tenant-1',
  generatedAt: '',
  alerts: [
    { id: 'a1', severity: 'HIGH', title: 'Bot Failure: Logistics_Sync', createdAt: '' },
    { id: 'a2', severity: 'LOW', title: 'Scheduled maintenance window', createdAt: '' },
  ],
};

describe('ComplianceSection', () => {
  it('renders loading states', () => {
    render(
      <ComplianceSection
        compliance={undefined}
        alerts={undefined}
        isComplianceLoading
        isComplianceError={false}
        isAlertsLoading
        isAlertsError={false}
      />
    );

    expect(screen.getByText('Loading certifications...')).toBeInTheDocument();
    expect(screen.getByText('Loading alerts...')).toBeInTheDocument();
  });

  it('renders success states with score, certifications, and alerts', () => {
    render(
      <ComplianceSection
        compliance={baseCompliance}
        alerts={baseAlerts}
        isComplianceLoading={false}
        isComplianceError={false}
        isAlertsLoading={false}
        isAlertsError={false}
      />
    );

    expect(screen.getByText('94')).toBeInTheDocument();
    expect(screen.getByText('SOC2')).toBeInTheDocument();
    expect(screen.getByText('HIPAA')).toBeInTheDocument();
    expect(screen.getByText('Bot Failure: Logistics_Sync')).toBeInTheDocument();
    expect(screen.getByText('Scheduled maintenance window')).toBeInTheDocument();
  });

  it('renders error banner when compliance or alerts fail', () => {
    render(
      <ComplianceSection
        compliance={undefined}
        alerts={undefined}
        isComplianceLoading={false}
        isComplianceError
        isAlertsLoading={false}
        isAlertsError={false}
      />
    );

    expect(
      screen.getByText(
        'Failed to load compliance data. Verify `GET /api/dashboard/:tenantId/compliance` and `GET /api/dashboard/:tenantId/alerts`.'
      )
    ).toBeInTheDocument();
  });

  it('renders empty states when no certifications and no alerts are returned', () => {
    render(
      <ComplianceSection
        compliance={{ ...baseCompliance, certifications: [] }}
        alerts={{ ...baseAlerts, alerts: [] }}
        isComplianceLoading={false}
        isComplianceError={false}
        isAlertsLoading={false}
        isAlertsError={false}
      />
    );

    expect(screen.getByText('No certifications returned.')).toBeInTheDocument();
    expect(screen.getByText('No active alerts returned.')).toBeInTheDocument();
  });
});
