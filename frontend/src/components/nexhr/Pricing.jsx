import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { Link } from "@tanstack/react-router";
const plans = [
    { name: "Starter", price: "$29", desc: "For small teams getting started.",
        features: ["50 resume analyses /mo", "AI resume screening", "Basic candidate ranking", "Email support"] },
    { name: "Growth", price: "$99", featured: true, desc: "For growing recruitment teams.",
        features: ["Unlimited resumes", "All AI modules", "Interview generator", "Pipeline analytics", "Priority support"] },
    { name: "Enterprise", price: "Custom", desc: "For organizations at scale.",
        features: ["Dedicated AI model", "SSO & SCIM", "Audit logs", "Custom integrations", "24/7 dedicated CSM"] },
];
export function Pricing() {
    return (<section id="pricing" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-violet-glow font-medium">Pricing</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">Simple, <span className="text-gradient">predictable</span> pricing</h2>
          <p className="mt-4 text-muted-foreground">Pick the plan that grows with your hiring goals.</p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (<motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className={`relative rounded-2xl p-8 ${p.featured ? "glass-strong glow-violet border-violet/40" : "glass"} overflow-hidden`}>
              {p.featured && (<>
                  <div className="absolute top-0 right-0 px-3 py-1 text-[10px] uppercase tracking-wider bg-gradient-to-br from-violet to-violet-glow text-white rounded-bl-xl">Popular</div>
                  <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-violet/30 blur-3xl"/>
                </>)}
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-bold tracking-tight">{p.price}</span>
                {p.price !== "Custom" && <span className="pb-2 text-sm text-muted-foreground">/mo</span>}
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (<li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-violet-glow mt-0.5 shrink-0"/> {f}
                  </li>))}
              </ul>
              <Magnetic>
                <Link to="/signup" className={`mt-8 w-full py-3 rounded-xl font-medium transition-all text-center block ${p.featured
                ? "bg-gradient-to-br from-violet to-violet-glow text-white hover:scale-[1.02]"
                : "glass-strong hover:bg-white/10 text-white"}`}>
                  {p.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </Link>
              </Magnetic>
            </motion.div>))}
        </div>
      </div>
    </section>);
}
