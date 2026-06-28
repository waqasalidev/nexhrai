import { motion } from "framer-motion";
import { Slack, Github, Mail, Calendar, Linkedin, Zap, Cloud, Database } from "lucide-react";
const icons = [Slack, Github, Mail, Calendar, Linkedin, Zap, Cloud, Database];
export function Integrations() {
    return (<section className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[420px] grid place-items-center">
          {/* concentric rings */}
          {[140, 220, 300].map((r, i) => (<motion.div key={r} animate={{ rotate: 360 }} transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }} className="absolute rounded-full border border-violet/15" style={{ width: r, height: r }}/>))}
          <div className="absolute h-20 w-20 rounded-2xl glass-strong glow-violet grid place-items-center">
            <span className="text-2xl font-bold text-gradient">N</span>
          </div>
          {icons.map((Ico, i) => {
            const ang = (i / icons.length) * Math.PI * 2;
            const r = 150;
            return (<motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="absolute h-12 w-12 rounded-xl glass-strong grid place-items-center animate-float" style={{
                    left: `calc(50% + ${Math.cos(ang) * r}px - 24px)`,
                    top: `calc(50% + ${Math.sin(ang) * r}px - 24px)`,
                    animationDelay: `${i * 0.3}s`,
                }}>
                <Ico className="h-5 w-5 text-violet-glow"/>
              </motion.div>);
        })}
        </div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="text-xs uppercase tracking-[0.3em] text-violet-glow font-medium">Integrations</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">Connect with <span className="text-gradient">100+ tools</span> you already use</h2>
          <p className="mt-4 text-muted-foreground max-w-md">From Slack to LinkedIn, Google Calendar to your ATS — NexHR plays beautifully with your stack.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
            {["Slack", "GitHub", "Gmail", "Google Calendar", "LinkedIn", "Zapier", "AWS", "Postgres"].map((t) => (<div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-glow"/> {t}
              </div>))}
          </div>
        </motion.div>
      </div>
    </section>);
}
