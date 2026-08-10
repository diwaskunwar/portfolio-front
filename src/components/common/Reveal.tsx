import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    /** Seconds of delay before this element starts. */
    delay?: number;
    /** Travel distance in px. Negative values come from the opposite side. */
    y?: number;
    x?: number;
    /** Fraction of the element that must be visible before it fires. */
    amount?: number;
    as?: 'div' | 'li' | 'section' | 'ul' | 'ol';
}

/**
 * Scroll-triggered entry. Uses whileInView rather than a scroll listener, so
 * nothing runs per frame. Collapses to a plain static element under
 * prefers-reduced-motion.
 */
export const Reveal: React.FC<RevealProps> = ({
    children,
    className,
    delay = 0,
    y = 22,
    x = 0,
    amount = 0.25,
    as = 'div',
}) => {
    const reduce = useReducedMotion();
    const Component = motion[as] as typeof motion.div;

    const variants: Variants = {
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y, x },
        show: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: { duration: 0.7, ease: EASE, delay: reduce ? 0 : delay },
        },
    };

    return (
        <Component
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount }}
        >
            {children}
        </Component>
    );
};

interface TextRevealProps {
    text: string;
    className?: string;
    /** Seconds between each word. */
    stagger?: number;
    delay?: number;
}

/**
 * Word-by-word mask reveal for display type. Each word rides up from behind
 * its own clipping box, so the line assembles rather than simply fading.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
    text,
    className,
    stagger = 0.055,
    delay = 0,
}) => {
    const reduce = useReducedMotion();
    const words = text.split(' ');

    if (reduce) return <span className={className}>{text}</span>;

    return (
        <motion.span
            className={cn('inline-flex flex-wrap', className)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: stagger, delayChildren: delay } },
            }}
            aria-label={text}
        >
            {words.map((word, i) => (
                <span
                    key={`${word}-${i}`}
                    aria-hidden="true"
                    // pb reserves space so descenders are not clipped by the mask
                    className="inline-block overflow-hidden pb-[0.12em]"
                >
                    <motion.span
                        className="inline-block"
                        variants={{
                            hidden: { y: '110%' },
                            show: { y: '0%', transition: { duration: 0.85, ease: EASE } },
                        }}
                    >
                        {word}
                        {i < words.length - 1 ? ' ' : ''}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
};

export default Reveal;
