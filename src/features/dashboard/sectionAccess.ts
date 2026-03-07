import { UserRole } from '@/types/auth.types';

export const DASHBOARD_SECTIONS = [
  'overview',
  'automations',
  'processes',
  'billing',
  'compliance',
  'settings',
] as const;

export type DashboardSection = (typeof DASHBOARD_SECTIONS)[number];

export const SECTION_ROLE_ACCESS: Partial<Record<DashboardSection, UserRole[]>> = {
  automations: [UserRole.EXECUTIVE, UserRole.OPERATIONS, UserRole.IT, UserRole.ADMIN],
  processes: [UserRole.EXECUTIVE, UserRole.OPERATIONS, UserRole.ADMIN],
  billing: [UserRole.EXECUTIVE, UserRole.FINANCE, UserRole.ADMIN],
  compliance: [UserRole.EXECUTIVE, UserRole.IT, UserRole.ADMIN],
  settings: [UserRole.EXECUTIVE, UserRole.IT, UserRole.ADMIN],
};

const SECTION_LABELS: Record<DashboardSection, string> = {
  overview: 'Overview',
  automations: 'Automations',
  processes: 'Processes',
  billing: 'Billing',
  compliance: 'Compliance',
  settings: 'Settings',
};

export const isDashboardSection = (value: string | undefined): value is DashboardSection => {
  if (!value) {
    return false;
  }

  return (DASHBOARD_SECTIONS as readonly string[]).includes(value);
};

export const getDashboardSectionLabel = (section: DashboardSection): string => {
  return SECTION_LABELS[section];
};

export const canAccessDashboardSection = (
  section: DashboardSection,
  hasRole: (roles: UserRole[]) => boolean
): boolean => {
  const allowedRoles = SECTION_ROLE_ACCESS[section];

  if (!allowedRoles) {
    return true;
  }

  return hasRole(allowedRoles);
};
