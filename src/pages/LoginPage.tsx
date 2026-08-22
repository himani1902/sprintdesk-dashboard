import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Kanban, Lock, User as UserIcon, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const targetRoute =
    location.state?.from?.pathname && location.state.from.pathname !== '/login'
      ? location.state.from.pathname
      : '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setFormError('Please enter your username');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await login({ username, password, rememberMe });
      success('Welcome back!', 'Authenticated session established successfully.');
      navigate(targetRoute, { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please verify credentials.';
      setFormError(msg);
      toastError('Authentication Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setFormError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 bg-orange-50/50 text-slate-800 relative overflow-hidden">
      {/* Decorative Warm Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-orange-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl z-10 animate-fade-in">
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 shrink-0">
            <Kanban className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              Sign in to SprintDesk
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Sprint Management & Agile Workspace
            </p>
          </div>
        </div>

        {/* Enterprise Test Sign-in Helper */}
        <div className="mb-6 p-3.5 rounded-2xl bg-orange-100/80 border border-orange-300/90 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Lead Engineer: <strong className="font-bold text-slate-950">emilys</strong> / <strong className="font-bold text-slate-950">••••••••</strong></span>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="text-[11px] font-bold text-brand-700 hover:text-brand-800 hover:underline cursor-pointer"
          >
            Quick Fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username"
            required
            placeholder="e.g. emilys"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            showPasswordStrength={true}
          />

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs my-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-orange-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
              />
              <span>Remember me (30 days)</span>
            </label>
            <span className="text-slate-600 hover:text-brand-700 font-semibold cursor-pointer transition-colors">Need help?</span>
          </div>

          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 shadow-2xs">
              {formError}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-2 font-bold"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
