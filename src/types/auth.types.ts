export enum UserRole {
  EXECUTIVE = 'EXECUTIVE',
  FINANCE = 'FINANCE',
  OPERATIONS = 'OPERATIONS',
  IT = 'IT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  projects?: string[];  // slugs of deployed projects this user may access
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Tokens are now httpOnly cookies — LoginResponse only returns the user object
export interface LoginResponse {
  user: User;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}
