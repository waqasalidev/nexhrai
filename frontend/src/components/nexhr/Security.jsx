import { motion } from "framer-motion";
import { Shield, BarChart3, Puzzle, Headphones } from "lucide-react";
const items = [
    { icon: Shield, title: "Secure & Compliant", desc: "SOC 2, GDPR, and enterprise-grade encryption." },
    { icon: BarChart3, title: "Scalable", desc: "Built to scale from 10 to 100,000 candidates." },
    { icon: Puzzle, title: "Integrations", desc: "Connect with 100+ tools out of the box." },
    { icon: Headphones, title: "24/7 Support", desc: "Our team is always here to help you ship." },
];
export function Security() {
    return (<section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-strong rounded-3xl p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (<motion.div key={it.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex items-start gap-4">
              <div className="h-12 w-12 grid place-items-center rounded-xl bg-violet/15 text-violet-glow shrink-0">
                <it.icon className="h-5 w-5"/>
              </div>
              <div>
                <h3 className="font-semibold">{it.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{it.desc}</p>
              </div>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
