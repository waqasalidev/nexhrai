import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
export function TiltCard({ children, className = "" }) {
    const ref = useRef(null);
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
    const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
    return (<motion.div ref={ref} className={className} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }} onMouseMove={(e) => {
            const r = ref.current.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width);
            my.set((e.clientY - r.top) / r.height);
        }} onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}>
      {children}
    </motion.div>);
}
