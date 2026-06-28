import { motion } from "framer-motion";
import { FileText, Users, Trophy, ShieldCheck } from "lucide-react";
const stats = [
    { icon: FileText, label: "Resumes Analyzed", value: "10,000+" },
    { icon: Users, label: "Companies", value: "1,200+" },
    { icon: Trophy, label: "Hires Made", value: "50,000+" },
    { icon: ShieldCheck, label: "Client Satisfaction", value: "95%" },
];
export function Stats() {
    return (<section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="glass-strong rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (<motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex items-center gap-4">
              <div className="h-12 w-12 grid place-items-center rounded-xl bg-violet/15 text-violet-glow">
                <s.icon className="h-5 w-5"/>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
