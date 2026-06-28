import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
const faqs = [
    { q: "How accurate is the AI resume screening?", a: "Our models achieve 94% agreement with senior recruiters across 50,000+ benchmarked decisions, and improve with every hire you make." },
    { q: "Does NexHR AI integrate with my existing ATS?", a: "Yes — we offer native integrations with Greenhouse, Lever, Ashby and a flexible API for custom systems." },
    { q: "Is my candidate data secure?", a: "All data is encrypted at rest and in transit. We're SOC 2 Type II compliant and GDPR-ready out of the box." },
    { q: "Can I customize scoring criteria?", a: "Absolutely. You can weight skills, experience, education and custom signals per role from a no-code interface." },
    { q: "How long does setup take?", a: "Most teams are running in under 15 minutes. Our onboarding team can help with bulk imports and SSO." },
];
export function FAQ() {
    const [open, setOpen] = useState(0);
    return (<section id="resources" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-violet-glow font-medium">FAQ</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">Questions, <span className="text-gradient">answered</span></h2>
        </motion.div>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (<motion.div key={f.q} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="rounded-2xl glass-strong overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                <span className="font-medium">{f.q}</span>
                <Plus className={`h-5 w-5 text-violet-glow transition-transform ${open === i ? "rotate-45" : ""}`}/>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>)}
              </AnimatePresence>
            </motion.div>))}
        </div>
      </div>
    </section>);
}
