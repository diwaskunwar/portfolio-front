import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface MagneticLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
    /** How far the element is allowed to drift toward the cursor, in px. */
    strength?: number;
}

/**
 * Pulls toward the cursor on hover.
 *
 * Pointer position is held in motion values, never in state, so tracking the
 * cursor does not re-render the React tree on every pointermove.
 */
const MagneticLink: React.FC<MagneticLinkProps> = ({
    children,
    strength = 14,
    ...props
}) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const reduce = useReducedMotion();

    const mx = useMotionValue(0);
    const my = useMotionValue(0);

    const spring = { stiffness: 220, damping: 20, mass: 0.4 };
    const x = useSpring(mx, spring);
    const y = useSpring(my, spring);

    // The inner content trails slightly further, which reads as depth
    const innerX = useTransform(x, (v) => v * 0.35);
    const innerY = useTransform(y, (v) => v * 0.35);

    const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        mx.set((relX / (rect.width / 2)) * strength);
        my.set((relY / (rect.height / 2)) * strength);
    };

    const reset = () => {
        mx.set(0);
        my.set(0);
    };

    return (
        <motion.a
            ref={ref}
            style={reduce ? undefined : { x, y }}
            onPointerMove={onPointerMove}
            onPointerLeave={reset}
            {...(props as React.ComponentProps<typeof motion.a>)}
        >
            <motion.span
                style={reduce ? undefined : { x: innerX, y: innerY }}
                className="inline-flex items-center gap-2.5"
            >
                {children}
            </motion.span>
        </motion.a>
    );
};

export default MagneticLink;
