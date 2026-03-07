import { UserRole } from '@/types/auth.types';

export type DashboardRoleLabel = 'Executive' | 'Finance' | 'Operations' | 'IT';

const ROLE_LABELS: Record<UserRole, DashboardRoleLabel> = {
  [UserRole.EXECUTIVE]: 'Executive',
  [UserRole.FINANCE]: 'Finance',
  [UserRole.OPERATIONS]: 'Operations',
  [UserRole.IT]: 'IT',
  // Admins default to executive-level view until dedicated admin dashboards are added.
  [UserRole.ADMIN]: 'Executive',
};

export const normalizeUserRoleForDashboard = (
  role: UserRole | null | undefined
): DashboardRoleLabel => {
  if (!role) {
    return 'Executive';
  }

  return ROLE_LABELS[role] ?? 'Executive';
};

export const getRoleDisplayName = (role: UserRole | null | undefined): string => {
  return normalizeUserRoleForDashboard(role);
};
