import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";

const links = ["Features", "Solutions", "Pricing", "Resources", "About"];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 20);
        on();
        window.addEventListener("scroll", on);
        return () => window.removeEventListener("scroll", on);
    }, []);

    const handleLogout = () => {
        logout();
        navigate({ to: '/' });
    };

    const getDashboardPath = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/dashboard/admin';
        if (user.role === 'recruiter') return '/dashboard/recruiter';
        return '/dashboard/candidate';
    };

    return (<motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className={`mx-auto max-w-7xl px-6`}>
        <div className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all ${scrolled ? "glass-strong" : ""}`}>
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo-icon.svg" alt="NexHR AI Logo" className="h-9 w-9 object-contain group-hover:scale-105 transition-transform" />
            <span className="text-lg font-semibold tracking-tight">
              Nex<span className="text-gradient">HR</span> AI
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (<a key={l} href={`#${l.toLowerCase()}`} className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l}
              </a>))}
          </nav>
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                  Login
                </Link>
                <Magnetic>
                  <Link to="/signup" className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-br from-violet to-violet-glow text-white shadow-lg glow-violet hover:scale-[1.03] transition-transform">
                    Get Started
                  </Link>
                </Magnetic>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-xs text-muted-foreground">
                  Hey, <span className="text-white font-medium">{user.name}</span>
                </span>
                <Link to={getDashboardPath()} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
                  <LayoutDashboard className="h-4 w-4 text-violet-glow" />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" title="Log Out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>);
}

