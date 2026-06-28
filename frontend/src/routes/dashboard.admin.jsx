import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, FileText, Cpu, Trash2, Shield, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'sonner';
import { Cursor } from '@/components/nexhr/Cursor';
import { Navbar } from '@/components/nexhr/Navbar';

export const Route = createFileRoute('/dashboard/admin')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in or wrong role
  useEffect(() => {
    if (!token) {
      navigate({ to: '/login' });
    } else if (user && user.role !== 'admin') {
      navigate({ to: '/' });
    }
  }, [token, user]);

  // Dashboard Data State
  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Admin metrics and user list
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricRes, usersRes] = await Promise.all([
        api.get('/users/dashboard'),
        api.get('/users')
      ]);
      setMetrics(metricRes.data);
      setUsersList(usersRes.data);
    } catch (err) {
      toast.error('Failed to load admin controls');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  // Handle User Account Deletion
  const handleDeleteUser = async (id, name) => {
    if (id === user._id) {
      toast.error("You cannot delete your own admin account.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${name}'s account? This action is permanent.`)) {
      try {
        await api.delete(`/users/${id}`);
        toast.success(`Account for ${name} removed`);
        fetchAdminData();
      } catch (err) {
        toast.error('Failed to delete user account');
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-glow" />
          <span className="text-sm text-muted-foreground">Syncing administrator desk...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden pb-16">
      {/* Background gradients */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 bg-aurora opacity-70" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <Cursor />
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-28 space-y-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-violet-glow font-medium">Administrator Control desk</div>
            <h1 className="text-3xl font-bold mt-1">Hello, <span className="text-gradient">Admin Workspace</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Review platform user registries and evaluate Gemini AI requests history logs.</p>
          </div>
          <button
            onClick={() => navigate({ to: '/dashboard/recruiter' })}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-violet to-violet-glow text-white text-xs font-semibold glow-violet hover:scale-[1.03] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="h-4 w-4" /> Manage Jobs & Applicants
          </button>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl glass-strong border border-white/5 p-5 relative overflow-hidden">
            <Users className="absolute right-4 top-4 h-5 w-5 text-violet-glow opacity-50" />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Registries</div>
            <div className="text-2xl font-bold mt-1">{metrics?.totalUsers || 0}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{metrics?.candidatesCount || 0} Candidates · {metrics?.recruitersCount || 0} Recruiters</div>
          </div>

          <div className="rounded-2xl glass-strong border border-white/5 p-5 relative overflow-hidden">
            <Briefcase className="absolute right-4 top-4 h-5 w-5 text-violet-glow opacity-50" />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Published Jobs</div>
            <div className="text-2xl font-bold mt-1">{metrics?.totalJobs || 0}</div>
          </div>

          <div className="rounded-2xl glass-strong border border-white/5 p-5 relative overflow-hidden">
            <FileText className="absolute right-4 top-4 h-5 w-5 text-violet-glow opacity-50" />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Applications</div>
            <div className="text-2xl font-bold mt-1">{metrics?.totalApplications || 0}</div>
          </div>

          <div className="rounded-2xl glass-strong border border-white/5 p-5 relative overflow-hidden">
            <Cpu className="absolute right-4 top-4 h-5 w-5 text-violet-glow opacity-50" />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Gemini API Requests</div>
            <div className="text-2xl font-bold mt-1">{metrics?.aiUsageCount || 0}</div>
          </div>
        </div>

        {/* Grid Panels */}
        <div className="grid lg:grid-cols-[1.5fr_1.2fr] gap-8">
          
          {/* User Directory Column */}
          <div className="rounded-2xl glass-strong border border-white/10 p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-glow" /> User Account Registry
            </h2>

            <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-muted-foreground border-b border-white/5 font-semibold">
                      <th className="p-3">User Details</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.length > 0 ? (
                      usersList.map((usr) => (
                        <tr key={usr._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="p-3">
                            <div className="font-semibold text-white">{usr.name}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{usr.title || 'No Title'}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              usr.role === 'admin' 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                : usr.role === 'recruiter'
                                  ? 'bg-violet/10 text-violet-glow border-violet/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {usr.role}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground">{usr.email}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteUser(usr._id, usr.name)}
                              className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/25 transition-colors cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-muted-foreground">No registered users located.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Usage Logs Column */}
          <div className="rounded-2xl glass-strong border border-white/10 p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Cpu className="h-5 w-5 text-violet-glow" /> Gemini Request logs
            </h2>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {metrics?.recentAIUsage && metrics.recentAIUsage.length > 0 ? (
                metrics.recentAIUsage.map((log) => (
                  <div key={log._id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-violet-glow" /> {log.action}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                      <div>User: {log.user?.name} ({log.user?.role})</div>
                      <div className="text-emerald-400">Tokens: {log.totalTokens}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <span className="text-xs text-muted-foreground">No AI operations logged yet.</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
