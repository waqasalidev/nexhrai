import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/nexhr/Navbar";
import { Hero } from "@/components/nexhr/Hero";
import { Marquee } from "@/components/nexhr/Marquee";
import { Stats } from "@/components/nexhr/Stats";
import { Features } from "@/components/nexhr/Features";
import { Workflow } from "@/components/nexhr/Workflow";
import { DashboardPreview } from "@/components/nexhr/DashboardPreview";
import { Pricing } from "@/components/nexhr/Pricing";
import { Testimonials } from "@/components/nexhr/Testimonials";
import { Integrations } from "@/components/nexhr/Integrations";
import { Security } from "@/components/nexhr/Security";
import { FAQ } from "@/components/nexhr/FAQ";
import { CTA } from "@/components/nexhr/CTA";
import { Footer } from "@/components/nexhr/Footer";
import { Cursor } from "@/components/nexhr/Cursor";
export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "NexHR AI — Hire Smarter. Not Harder." },
            { name: "description", content: "AI-powered recruitment platform with resume screening, candidate ranking, and intelligent automation for modern HR teams." },
            { property: "og:title", content: "NexHR AI — AI-Powered Recruitment Platform" },
            { property: "og:description", content: "Hire the best talent faster with AI-powered resume screening, intelligent insights, and end-to-end automation." },
        ],
    }),
    component: Index,
});
function Index() {
    return (<div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Persistent gradient grid backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 bg-aurora opacity-70"/>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 opacity-[0.04]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
        }}/>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Features />
        <Workflow />
        <DashboardPreview />
        <Integrations />
        <Pricing />
        <Testimonials />
        <Security />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>);
}
