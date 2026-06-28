import { motion } from "framer-motion";
import { Quote } from "lucide-react";
const items = [
    { name: "Sophia Martinez", role: "Head of Talent, Linear", quote: "NexHR AI cut our time-to-hire by 60%. Candidate quality has never been better.", color: "from-violet to-pink-400" },
    { name: "Daniel Chen", role: "VP People, Notion", quote: "The AI scoring is uncannily accurate. It surfaces hidden gems we'd usually miss.", color: "from-cyan-glow to-violet" },
    { name: "Aisha Patel", role: "Recruiting Lead, Stripe", quote: "From job post to offer in under a week. Our recruiters are 4x more productive.", color: "from-amber-400 to-pink-400" },
    { name: "Marcus Johnson", role: "CTO, Vercel", quote: "Best hiring product we've ever used. Period. The 3D dashboards delight every demo.", color: "from-emerald-400 to-cyan-glow" },
];
export function Testimonials() {
    return (<section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-violet-glow font-medium">Loved by recruiters</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">Trusted by teams who <span className="text-gradient">ship</span></h2>
        </motion.div>
        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {items.map((t, i) => (<motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="relative rounded-2xl glass-strong p-7 group hover:border-violet/30 transition-colors">
              <Quote className="absolute top-5 right-5 h-8 w-8 text-violet/30"/>
              <p className="text-lg leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color}`}/>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>))}
        </div>
      </div>
    </section>);
}
