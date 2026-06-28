import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { Particles } from "./Particles";
import { Link } from "@tanstack/react-router";
export function CTA() {
    return (<section id="about" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative rounded-3xl glass-strong overflow-hidden p-10 md:p-16 text-center">
          <Particles count={50} className="absolute inset-0 opacity-50"/>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet/20 blur-[120px]"/>
          <div className="relative">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Ready to <span className="text-gradient">transform</span> your hiring?
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Join thousands of companies already using NexHR AI to hire smarter — not harder.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Magnetic>
                <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-br from-violet to-violet-glow text-white font-medium glow-violet hover:scale-[1.03] transition-transform">
                  Start Free Trial <ArrowRight className="h-4 w-4"/>
                </Link>
              </Magnetic>
              <Magnetic>
                <a href="#solutions" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-strong font-medium hover:bg-white/5 transition-colors">
                  <Calendar className="h-4 w-4"/> Book a Demo
                </a>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);
}
