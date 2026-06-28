import { motion } from "framer-motion";
import { ArrowRight, Play, Star, CheckCircle2, TrendingUp, Briefcase } from "lucide-react";
import { HeroScene } from "./HeroScene";
import { Magnetic } from "./Magnetic";
import { Particles } from "./Particles";
import { Link } from "@tanstack/react-router";
const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    show: (i) => ({
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
};
export function Hero() {
    return (<section className="relative pt-32 pb-24 overflow-hidden">
      <Particles className="absolute inset-0 -z-10 opacity-60"/>
      <div className="absolute inset-0 -z-20 bg-aurora pointer-events-none"/>
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-violet/20 blur-[120px] -z-10 animate-pulse-glow"/>
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-cyan-glow/15 blur-[120px] -z-10 animate-pulse-glow"/>

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative z-10">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-glow animate-pulse"/>
            AI-Powered Recruitment Platform
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show" className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Hire Smarter.
            <br />
            <span className="text-gradient">Not Harder.</span>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show" className="mt-6 max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed">
            NexHR AI helps recruiters find the best talent faster with
            AI-powered resume screening, intelligent insights, and end-to-end automation.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <Link to="/signup" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-br from-violet to-violet-glow text-white font-medium shadow-xl glow-violet hover:scale-[1.03] transition-transform">
                Start Free Trial
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </Magnetic>
            <Magnetic>
              <a href="#solutions" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-strong font-medium hover:bg-white/5 transition-colors">
                <Play className="h-4 w-4"/> See Demo
              </a>
            </Magnetic>
          </motion.div>

          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#a855f7", "#22d3ee", "#ec4899", "#f59e0b"].map((c, i) => (<div key={i} className="h-8 w-8 rounded-full border-2 border-background" style={{ background: `linear-gradient(135deg, ${c}, ${c}88)` }}/>))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-violet-glow text-violet-glow"/>)}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Trusted by 1,200+ companies worldwide</p>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2 }} className="relative h-[520px] lg:h-[600px]">
          <div className="absolute inset-0">
            <HeroScene />
          </div>

          {/* Floating stat cards */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.8 }} className="absolute top-6 left-0 glass-strong rounded-2xl p-4 w-52 animate-float">
            <div className="text-xs text-muted-foreground">AI Resume Score</div>
            <div className="mt-2 flex items-end gap-2">
              <div className="text-4xl font-bold text-gradient">85</div>
              <div className="pb-1 text-xs text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3 w-3"/>Excellent</div>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.5, delay: 1.4 }} className="h-full bg-gradient-to-r from-violet to-violet-glow"/>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="absolute top-12 right-0 glass-strong rounded-2xl p-4 w-56 animate-float" style={{ animationDelay: "1s" }}>
            <div className="text-xs text-muted-foreground mb-2">Top Skills</div>
            {["JavaScript", "React", "Node.js", "TypeScript"].map((s, i) => (<div key={s} className="flex items-center justify-between text-xs mb-1.5">
                <span>{s}</span>
                <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${95 - i * 8}%` }} transition={{ duration: 1, delay: 1.6 + i * 0.1 }} className="h-full bg-gradient-to-r from-cyan-glow to-violet"/>
                </div>
              </div>))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }} className="absolute bottom-12 left-4 glass-strong rounded-2xl p-4 w-48 animate-float" style={{ animationDelay: "2s" }}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5"/> Experience
            </div>
            <div className="mt-1 text-2xl font-bold">5+ Years</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3"/> Strong Background
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>);
}
