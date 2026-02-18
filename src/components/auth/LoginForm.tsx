import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BrainCircuit, AlertCircle } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aiistech-dark px-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-aiistech-primary to-blue-600 rounded-2xl mb-4">
            <BrainCircuit size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your AIISTECH account</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-aiistech-primary focus:border-transparent transition"
                placeholder="you@company.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-aiistech-primary focus:border-transparent transition"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-aiistech-primary text-aiistech-dark font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center mb-3">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800 p-2 rounded">
                <span className="text-slate-400">Executive:</span>
                <br />
                <span className="text-aiistech-primary">exec@aiistech.com</span>
              </div>
              <div className="bg-slate-800 p-2 rounded">
                <span className="text-slate-400">Finance:</span>
                <br />
                <span className="text-aiistech-primary">finance@aiistech.com</span>
              </div>
              <div className="bg-slate-800 p-2 rounded">
                <span className="text-slate-400">Operations:</span>
                <br />
                <span className="text-aiistech-primary">ops@aiistech.com</span>
              </div>
              <div className="bg-slate-800 p-2 rounded">
                <span className="text-slate-400">IT:</span>
                <br />
                <span className="text-aiistech-primary">it@aiistech.com</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
