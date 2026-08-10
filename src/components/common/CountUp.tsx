import React, { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
    to: number;
    duration?: number;
    className?: string;
}

/**
 * Counts to a value once it scrolls into view.
 *
 * Writes to the DOM node directly from the animation frame rather than through
 * state, so a two second count does not cost ~120 React renders.
 */
const CountUp: React.FC<CountUpProps> = ({ to, duration = 1.6, className }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const reduce = useReducedMotion();

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if (reduce || !inView) {
            node.textContent = reduce ? to.toLocaleString() : '0';
            return;
        }

        const controls = animate(0, to, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
                node.textContent = Math.round(value).toLocaleString();
            },
        });

        return () => controls.stop();
    }, [inView, to, duration, reduce]);

    return <span ref={ref} className={className}>0</span>;
};

export default CountUp;
