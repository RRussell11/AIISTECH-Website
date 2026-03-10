import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,  // send httpOnly cookies on every request
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor — no manual token injection; cookies are sent automatically
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => config,
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor - Handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Cookie-based refresh — the refresh_token cookie is sent automatically
            await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed — emit logout event so AuthContext clears user state
            window.dispatchEvent(new CustomEvent('auth:logout'));
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  getInstance(): AxiosInstance {
    return this.api;
  }
}

export const apiService = new ApiService();
export default apiService.getInstance();
