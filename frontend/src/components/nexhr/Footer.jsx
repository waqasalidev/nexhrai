import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";
const cols = [
    { title: "Product", items: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"] },
    { title: "Company", items: ["About", "Careers", "Blog", "Press", "Contact"] },
    { title: "Resources", items: ["Documentation", "API Reference", "Help Center", "Status", "Security"] },
    { title: "Legal", items: ["Privacy", "Terms", "Cookies", "DPA", "Compliance"] },
];
export function Footer() {
    return (<footer className="border-t border-white/5 mt-12">
      <div className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-[1.4fr_3fr] gap-12">
        <div>
          <a href="#" className="flex items-center gap-2.5 group">
            <img src="/logo-icon.svg" alt="NexHR AI Logo" className="h-9 w-9 object-contain group-hover:scale-105 transition-transform" />
            <span className="text-lg font-semibold">Nex<span className="text-gradient">HR</span> AI</span>
          </a>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            AI-powered recruitment built for modern teams. Hire smarter, not harder.
          </p>
          <div className="mt-6 flex gap-3">
            {[Twitter, Github, Linkedin].map((I, i) => (<a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-lg glass-strong hover:border-violet/40 transition-colors">
                <I className="h-4 w-4"/>
              </a>))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {cols.map((c) => (<div key={c.title}>
              <div className="text-xs uppercase tracking-wider text-foreground/80 font-medium">{c.title}</div>
              <ul className="mt-4 space-y-2">
                {c.items.map((i) => (<li key={i}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{i}</a></li>))}
              </ul>
            </div>))}
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NexHR AI · Crafted with care.
      </div>
    </footer>);
}
