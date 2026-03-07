import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SettingsSection } from '@/features/dashboard/sections/SettingsSection';
import { UserRole } from '@/types/auth.types';

describe('SettingsSection', () => {
  it('renders user profile fields when user exists', () => {
    render(
      <SettingsSection
        user={{
          id: '1',
          email: 'user@aiistech.com',
          firstName: 'Test',
          lastName: 'User',
          role: UserRole.IT,
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: '',
          updatedAt: '',
        }}
      />
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('user@aiistech.com')).toBeInTheDocument();
    expect(screen.getByText('IT')).toBeInTheDocument();
    expect(screen.getByText('tenant-1')).toBeInTheDocument();
  });

  it('renders fallback placeholders when user is null', () => {
    render(<SettingsSection user={null} />);

    const placeholders = screen.getAllByText('--');
    expect(placeholders.length).toBeGreaterThanOrEqual(4);
  });
});
