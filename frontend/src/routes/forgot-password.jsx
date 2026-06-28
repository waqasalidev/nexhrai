import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Cursor } from '@/components/nexhr/Cursor';

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setSent(true);
      toast.success('Reset email sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send password reset email.');
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
            <h2 className="text-2xl font-bold tracking-tight text-center">Reset Password</h2>
            <p className="text-sm text-muted-foreground mt-1 text-center">We will email you a secure link to reset your password</p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Registered Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-glow focus:ring-1 focus:ring-violet-glow transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-br from-violet to-violet-glow hover:scale-[1.02] text-white font-medium shadow-lg glow-violet hover:shadow-violet-glow/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Requesting...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <MailCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-white">Email Sent</h3>
              <p className="text-sm text-muted-foreground">
                Please check your inbox at <strong className="text-white">{email}</strong> for instructions to reset your password.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Log In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
