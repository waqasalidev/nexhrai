import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, TrendingUp, Users, Briefcase, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
const candidates = [
    { name: "Wade Warren", role: "UI/UX Designer", score: 92, color: "from-violet to-pink-400" },
    { name: "Jane Cooper", role: "Frontend Developer", score: 88, color: "from-cyan-glow to-violet" },
    { name: "Cameron Williamson", role: "Backend Developer", score: 85, color: "from-emerald-400 to-cyan-glow" },
];
const skills = [
    { name: "JavaScript", pct: 90 },
    { name: "React", pct: 85 },
    { name: "Node.js", pct: 80 },
    { name: "Python", pct: 70 },
];
export function DashboardPreview() {
    const { user } = useAuth();
    
    const getDashboardPath = () => {
        if (!user) return '/login';
        if (user.role === 'admin' || user.role === 'recruiter') return '/dashboard/recruiter';
        return '/dashboard/candidate';
    };
    
    return (<section id="solutions" className="py-24 relative overflow-hidden">
      <div className="absolute -left-32 top-1/2 w-[500px] h-[500px] rounded-full bg-violet/10 blur-[140px]"/>
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="text-xs uppercase tracking-[0.3em] text-violet-glow font-medium">Platform Preview</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">A smarter way to manage <span className="text-gradient">recruitment</span></h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Our AI dashboard gives you complete control and deep insights into your hiring process.
          </p>
          <ul className="mt-6 space-y-3">
            {["Real-time analytics", "Pipeline management", "Team collaboration", "Advanced filtering"].map((f) => (<li key={f} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-violet-glow"/> {f}
              </li>))}
          </ul>
          <Link to={getDashboardPath()} className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-violet to-violet-glow font-medium text-white glow-violet hover:scale-[1.03] transition-transform text-sm">
            {user ? 'Open Dashboard' : 'Explore Dashboard'} <ArrowRight className="h-4 w-4"/>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
          <div className="absolute inset-0 -m-6 rounded-[2rem] bg-gradient-to-tr from-violet/30 to-cyan-glow/20 blur-2xl"/>
          <div className="relative rounded-2xl glass-strong overflow-hidden shadow-2xl">
            {/* dash header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
              <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400/60"/><span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60"/><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60"/></div>
              <div className="ml-2 text-xs text-muted-foreground">NexHR AI · Dashboard</div>
              <div className="ml-auto flex items-center gap-2 text-xs">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet to-violet-glow"/>
                <span className="hidden sm:inline">John Doe</span>
              </div>
            </div>

            {/* KPIs */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
            { icon: Users, label: "Candidates", value: "12,546", trend: "+12.5%" },
            { icon: Briefcase, label: "In Progress", value: "2,340", trend: "+8.1%" },
            { icon: Calendar, label: "Interviews", value: "1,234", trend: "+10.3%" },
            { icon: TrendingUp, label: "Hired", value: "1,234", trend: "+15.3%" },
        ].map((k, i) => (<motion.div key={k.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
                    <k.icon className="h-3.5 w-3.5 text-violet-glow"/>
                  </div>
                  <div className="mt-1 text-lg font-bold">{k.value}</div>
                  <div className="text-[10px] text-emerald-400">{k.trend}</div>
                </motion.div>))}
            </div>

            <div className="px-5 pb-5 grid sm:grid-cols-2 gap-4">
              {/* funnel */}
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <div className="text-xs text-muted-foreground mb-3">Candidates Pipeline</div>
                <div className="space-y-2">
                  {[
            { label: "Applied", pct: 100 },
            { label: "Screened", pct: 70 },
            { label: "Interview", pct: 45 },
            { label: "Offer", pct: 22 },
            { label: "Hired", pct: 12 },
        ].map((s, i) => (<div key={s.label} className="flex items-center gap-3 text-xs">
                      <span className="w-16 text-muted-foreground">{s.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.4 + i * 0.08 }} className="h-full bg-gradient-to-r from-violet to-cyan-glow"/>
                      </div>
                    </div>))}
                </div>
              </div>
              {/* skills */}
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <div className="text-xs text-muted-foreground mb-3">Top Skills</div>
                <div className="space-y-3">
                  {skills.map((s, i) => (<div key={s.name}>
                      <div className="flex justify-between text-[11px] mb-1"><span>{s.name}</span><span className="text-muted-foreground">{s.pct}%</span></div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }} className="h-full bg-gradient-to-r from-cyan-glow to-violet"/>
                      </div>
                    </div>))}
                </div>
              </div>
              {/* recent */}
              <div className="sm:col-span-2 rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <div className="text-xs text-muted-foreground mb-3">Recent Candidates</div>
                <div className="space-y-2">
                  {candidates.map((c, i) => (<motion.div key={c.name} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }} className="flex items-center gap-3 text-xs py-2 border-b border-white/5 last:border-0">
                      <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${c.color}`}/>
                      <div className="flex-1">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground">{c.role}</div>
                      </div>
                      <div className="text-emerald-400 font-medium">{c.score}%</div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground"/>
                    </motion.div>))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);
}
