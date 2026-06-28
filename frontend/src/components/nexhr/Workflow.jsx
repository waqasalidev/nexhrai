import { motion } from "framer-motion";
import { Upload, Brain, UserCheck, Rocket } from "lucide-react";
const steps = [
    { icon: Upload, title: "Upload Jobs & Resumes", desc: "Bring data from any source. We parse and structure everything automatically." },
    { icon: Brain, title: "AI Analysis", desc: "Our models score candidates on skill fit, experience, and culture signals." },
    { icon: UserCheck, title: "Smart Shortlist", desc: "Get an explainable ranked list with red flags and standout traits highlighted." },
    { icon: Rocket, title: "Hire & Onboard", desc: "Schedule interviews, send offers, and onboard — all from one place." },
];
export function Workflow() {
    return (<section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-violet-glow font-medium">AI Workflow</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">From <span className="text-gradient">application</span> to hire</h2>
          <p className="mt-4 text-muted-foreground">An end-to-end pipeline designed for modern recruiters.</p>
        </motion.div>

        <div className="mt-16 relative grid md:grid-cols-4 gap-6">
          <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-violet/50 to-transparent"/>
          {steps.map((s, i) => (<motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} className="relative text-center">
              <div className="mx-auto h-14 w-14 grid place-items-center rounded-2xl glass-strong glow-violet relative z-10">
                <s.icon className="h-6 w-6 text-violet-glow"/>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">Step 0{i + 1}</div>
              <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>))}
        </div>
      </div>
    </section>);
}
