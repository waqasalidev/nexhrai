import { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Cursor } from '@/components/nexhr/Cursor';

export const Route = createFileRoute('/reset-password')({
  component: ResetPassword,
  validateSearch: (search) => ({
    token: search.token || '',
  }),
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Please enter both password fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/reset-password`, { token, password });
      setSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => {
        navigate({ to: '/login' });
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Link might be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground overflow-hidden px-4">
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 bg-aurora opacity-70" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <Cursor />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute inset-0 -m-4 rounded-[2rem] bg-gradient-to-tr from-violet/20 to-cyan-glow/10 blur-2xl -z-10" />

        <div className="rounded-2xl glass-strong p-8 shadow-2xl border border-white/10">
          <div className="flex flex-col items-center mb-6">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <img src="/logo-icon.svg" alt="NexHR AI Logo" className="h-10 w-10 object-contain group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold tracking-tight">
                Nex<span className="text-gradient">HR</span> AI
              </span>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-center">New Password</h2>
            <p className="text-sm text-muted-foreground mt-1 text-center">Set your new secure password below</p>
          </div>

          {!token ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-white">Missing Token</h3>
              <p className="text-sm text-muted-foreground">
                No reset token found in URL. Please click the reset link in your email carefully.
              </p>
            </div>
          ) : !success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="pass" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <input
                    id="pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-glow focus:ring-1 focus:ring-violet-glow transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPass" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Confirm New Password</label>
                <input
                  id="confirmPass"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-glow focus:ring-1 focus:ring-violet-glow transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-br from-violet to-violet-glow hover:scale-[1.02] text-white font-medium shadow-lg glow-violet hover:shadow-violet-glow/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-emerald-400 font-semibold mb-2">Password changed successfully!</p>
              <p className="text-xs text-muted-foreground">Redirecting to Log In screen...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
