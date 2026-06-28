import { useEffect, useRef } from "react";
export function Particles({ count = 80, className = "" }) {
    const ref = useRef(null);
    useEffect(() => {
        const c = ref.current;
        if (!c)
            return;
        const ctx = c.getContext("2d");
        if (!ctx)
            return;
        let w = 0, h = 0, raf = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const resize = () => {
            const r = c.getBoundingClientRect();
            w = r.width;
            h = r.height;
            c.width = w * dpr;
            c.height = h * dpr;
            ctx.scale(dpr, dpr);
        };
        resize();
        const pts = Array.from({ length: count }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.6 + 0.4,
            hue: 270 + Math.random() * 60,
        }));
        const tick = () => {
            ctx.clearRect(0, 0, w, h);
            for (const p of pts) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w)
                    p.vx *= -1;
                if (p.y < 0 || p.y > h)
                    p.vy *= -1;
                ctx.beginPath();
                ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, 0.8)`;
                ctx.shadowBlur = 12;
                ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, 0.9)`;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(tick);
        };
        tick();
        window.addEventListener("resize", resize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, [count]);
    return <canvas ref={ref} className={className}/>;
}
