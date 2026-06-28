import { useEffect, useRef } from "react";
export function Cursor() {
    const dot = useRef(null);
    const ring = useRef(null);
    useEffect(() => {
        let rx = 0, ry = 0, x = 0, y = 0;
        const move = (e) => {
            x = e.clientX;
            y = e.clientY;
            if (dot.current) {
                dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            }
            const t = e.target;
            const interactive = t.closest("a, button, [data-magnetic]");
            if (ring.current) {
                ring.current.style.width = interactive ? "64px" : "36px";
                ring.current.style.height = interactive ? "64px" : "36px";
                ring.current.style.backgroundColor = interactive ? "oklch(0.78 0.2 305 / 0.15)" : "transparent";
            }
        };
        const loop = () => {
            rx += (x - rx) * 0.15;
            ry += (y - ry) * 0.15;
            if (ring.current)
                ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            raf = requestAnimationFrame(loop);
        };
        let raf = requestAnimationFrame(loop);
        window.addEventListener("mousemove", move);
        return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
    }, []);
    return (<>
      <div ref={ring} className="cursor-ring" aria-hidden/>
      <div ref={dot} className="cursor-dot" aria-hidden/>
    </>);
}
