import { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Loader2, User as UserIcon, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Cursor } from '@/components/nexhr/Cursor';

export const Route = createFileRoute('/signup')({
  component: Signup,
});

function Signup() {
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@nexhrai.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('candidate'); // 'candidate' or 'recruiter'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const user = await register(name, email, password, role);
      toast.success(`Account created! Welcome, ${user.name}!`);

      if (user.role === 'candidate') {
        navigate({ to: '/dashboard/candidate' });
      } else if (user.role === 'recruiter') {
        navigate({ to: '/dashboard/recruiter' });
      } else {
        navigate({ to: '/' });
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground overflow-hidden px-4 py-12">
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
        className="w-full max-w-lg relative"
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
            <h2 className="text-2xl font-bold tracking-tight text-center">Create Your Account</h2>
            <p className="text-sm text-muted-foreground mt-1 text-center">Sign up to hire or get hired smarter with AI</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">I want to join as a:</label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setRole('candidate')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 ${
                    role === 'candidate'
                      ? 'border-violet-glow bg-violet/10 shadow-glow'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                  }`}
                >
                  <UserIcon className={`h-6 w-6 ${role === 'candidate' ? 'text-violet-glow' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-semibold">Candidate</span>
                  <span className="text-[10px] text-muted-foreground text-center">Upload resume, optimize ATS, apply for jobs.</span>
                </div>

                <div
                  onClick={() => setRole('recruiter')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 ${
                    role === 'recruiter'
                      ? 'border-violet-glow bg-violet/10 shadow-glow'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                  }`}
                >
                  <Briefcase className={`h-6 w-6 ${role === 'recruiter' ? 'text-violet-glow' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-semibold">Recruiter</span>
                  <span className="text-[10px] text-muted-foreground text-center">Publish job descriptions, rank candidates.</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                id="name"
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-glow focus:ring-1 focus:ring-violet-glow transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-glow focus:ring-1 focus:ring-violet-glow transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-glow focus:ring-1 focus:ring-violet-glow transition-all"
                  placeholder="At least 6 characters"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-br from-violet to-violet-glow hover:scale-[1.02] text-white font-medium shadow-lg glow-violet hover:shadow-violet-glow/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-glow font-medium hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
