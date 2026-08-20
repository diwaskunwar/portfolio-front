import React, { useEffect, useRef, memo } from 'react';

interface StatusTickerProps {
    lines: readonly string[];
    /** Hold until the boot overlay lifts, so the first line is not missed. */
    play?: boolean;
    className?: string;
}

const TYPE_CPS = 64; // characters per second while writing
const ERASE_CPS = 150; // faster on the way out, as a real backspace is
const HOLD_MS = 1600; // beat on the finished line before it clears
const GAP_MS = 180; // beat on an empty line before the next one starts

type Phase = 'typing' | 'holding' | 'erasing' | 'gap';

/**
 * Types one line at a time in a loop, echoing the boot terminal.
 *
 * Writes straight to the DOM node from the animation frame. Driving this
 * through state would re-render the hero roughly forty times a second for
 * the life of the page.
 */
const StatusTicker: React.FC<StatusTickerProps> = ({ lines, play = true, className }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node || !play || lines.length === 0) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // A looping type-out is exactly what this preference is about.
            node.textContent = lines[0];
            return;
        }

        let frame = 0;
        let index = 0;
        let phase: Phase = 'typing';
        let phaseStart = 0;

        const tick = (now: number) => {
            if (!phaseStart) phaseStart = now;
            const line = lines[index];
            const elapsed = now - phaseStart;

            switch (phase) {
                case 'typing': {
                    const shown = Math.min(line.length, Math.floor((elapsed / 1000) * TYPE_CPS));
                    node.textContent = line.slice(0, shown);
                    if (shown >= line.length) {
                        phase = 'holding';
                        phaseStart = now;
                    }
                    break;
                }
                case 'holding': {
                    if (elapsed >= HOLD_MS) {
                        phase = 'erasing';
                        phaseStart = now;
                    }
                    break;
                }
                case 'erasing': {
                    const gone = Math.floor((elapsed / 1000) * ERASE_CPS);
                    const left = Math.max(0, line.length - gone);
                    node.textContent = line.slice(0, left);
                    if (left === 0) {
                        phase = 'gap';
                        phaseStart = now;
                    }
                    break;
                }
                case 'gap': {
                    if (elapsed >= GAP_MS) {
                        index = (index + 1) % lines.length;
                        phase = 'typing';
                        phaseStart = now;
                    }
                    break;
                }
            }

            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [lines, play]);

    return <span ref={ref} className={className} />;
};

export default memo(StatusTicker);
