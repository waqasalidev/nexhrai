import { motion } from "framer-motion";
import { FileSearch, Shuffle, MessageSquare, Award, PieChart, FileBarChart, BrainCircuit, Calendar } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
const items = [
    { icon: FileSearch, title: "AI Resume Screening", desc: "Automatically analyze resumes and rank candidates by fit.", color: "from-violet to-violet-glow", to: "/dashboard/candidate" },
    { icon: Shuffle, title: "Smart Matching", desc: "Match candidates with job descriptions intelligently.", color: "from-cyan-glow to-violet", to: "/dashboard/recruiter" },
    { icon: MessageSquare, title: "Interview Generator", desc: "Generate role-specific interview questions instantly.", color: "from-pink-400 to-violet", to: "/dashboard/candidate" },
    { icon: Award, title: "Candidate Ranking", desc: "Rank candidates based on skills, experience & potential.", color: "from-amber-400 to-pink-400", to: "/dashboard/recruiter" },
    { icon: PieChart, title: "Skill Insights", desc: "AI-powered insights on candidate skills and gaps.", color: "from-violet-glow to-cyan-glow", to: "/dashboard/candidate" },
    { icon: FileBarChart, title: "Automated Reports", desc: "Generate detailed reports in one click.", color: "from-emerald-400 to-cyan-glow", to: "/dashboard/admin" },
    { icon: BrainCircuit, title: "ATS Score Checker", desc: "Test resumes against ATS to optimize results.", color: "from-violet to-pink-400", to: "/dashboard/candidate" },
    { icon: Calendar, title: "Interview Scheduling", desc: "Coordinate interviews across teams in seconds.", color: "from-cyan-glow to-emerald-400", to: "/dashboard/recruiter" },
];
export function Features() {
    const { user } = useAuth();
    return (<section id="features" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-violet-glow font-medium">Powerful Features</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">
            Everything you need to <span className="text-gradient">hire the best</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Eight specialized AI modules working together to make recruitment feel effortless.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (<motion.div key={it.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.05 }}>
              <Link to={user ? it.to : '/signup'} className="block h-full">
                <TiltCard className="group relative h-full rounded-2xl glass-strong p-6 overflow-hidden hover:border-violet/40 transition-colors cursor-pointer">
                  <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${it.color} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`}/>
                  <div className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${it.color} shadow-lg`}>
                    <it.icon className="h-5 w-5 text-white"/>
                  </div>
                  <h3 className="relative mt-5 text-lg font-semibold">{it.title}</h3>
                  <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                </TiltCard>
              </Link>
            </motion.div>))}
        </div>
      </div>
    </section>);
}

