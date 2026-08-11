import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { PortraitPhase } from './BlockPortrait';

type Kind = 'cmd' | 'out' | 'err';
interface Line {
    kind: Kind;
    text: string;
}

const CPS = 58; // characters per second while typing
const PAUSE_MS = 130; // beat between finished lines
const HISTORY = 14; // lines kept before the top is dropped

/* The render narrates itself: a first attempt at a grid too coarse to hold a
   face, the assertion it trips, the retry, and what a hover costs. Every
   number is the real one the canvas is using. */
const SCRIPT: Record<PortraitPhase, Line[]> = {
    first: [
        { kind: 'cmd', text: 'python -m cv.render --src diwas.webp --grid 24' },
        { kind: 'out', text: 'sampling 576 blocks' },
    ],
    error: [
        { kind: 'err', text: 'cv2.error: (-215) grid too coarse to resolve' },
        { kind: 'err', text: 'render aborted at 24x24' },
    ],
    rebuilding: [
        { kind: 'cmd', text: 'python -m cv.render --grid 64 --retry' },
        { kind: 'out', text: 'rebuilding 4096 blocks' },
    ],
    ready: [{ kind: 'out', text: 'ok  4096 blocks  clarity 70%' }],
};

const HOVER_IN: Line[] = [
    { kind: 'cmd', text: 'cv2.resize(src, (112,112), INTER_LANCZOS4)' },
    { kind: 'out', text: 'ok  12544 blocks  clarity 90%' },
];

const HOVER_OUT: Line[] = [
    { kind: 'cmd', text: 'cv2.resize(src, (64,64), INTER_LANCZOS4)' },
    { kind: 'out', text: 'ok  4096 blocks  clarity 70%' },
];

const TONE: Record<Kind, string> = {
    cmd: 'text-muted-foreground',
    out: 'text-faint',
    // The failure is the one line here that has to be read.
    err: 'font-medium text-foreground',
};

const Row: React.FC<{ line: Line; children?: React.ReactNode }> = ({ line, children }) => (
    <p className={`break-words ${TONE[line.kind]}`}>
        {line.kind === 'cmd' && (
            <span aria-hidden="true" className="select-none text-foreground/70">
                ${' '}
            </span>
        )}
        {children ?? line.text}
    </p>
);

interface RenderTerminalProps {
    phase: PortraitPhase;
    hovered: boolean;
}

/**
 * Small terminal under the portrait. Lines accumulate rather than replace, so
 * the failed first render stays on screen as history once the retry succeeds.
 *
 * Each line types out through a ref written from the animation frame, so a
 * forty character line costs one React render rather than forty.
 */
const RenderTerminal: React.FC<RenderTerminalProps> = ({ phase, hovered }) => {
    const reduce = useReducedMotion();
    const [committed, setCommitted] = useState<Line[]>([]);
    const [active, setActive] = useState<Line | null>(null);
    const queue = useRef<Line[]>([]);
    const emitted = useRef(new Set<PortraitPhase>());
    const lastHover = useRef<boolean | null>(null);
    const typingRef = useRef<HTMLSpanElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const pump = useCallback(() => {
        // Returning the same value when the queue is empty makes React bail
        // out, so this cannot loop with the effect that calls it.
        setActive((current) => current ?? queue.current.shift() ?? null);
    }, []);

    const enqueue = useCallback(
        (lines: Line[]) => {
            queue.current.push(...lines);
            pump();
        },
        [pump]
    );

    /* Build phases, once each. */
    useEffect(() => {
        if (emitted.current.has(phase)) return;
        emitted.current.add(phase);
        enqueue(SCRIPT[phase]);
    }, [phase, enqueue]);

    /* Hover, only once the render has settled, and only on a real change so
       a jittery pointer cannot flood the log. */
    useEffect(() => {
        if (phase !== 'ready') return;
        if (lastHover.current === hovered) return;
        const first = lastHover.current === null;
        lastHover.current = hovered;
        if (first && !hovered) return; // resting state is already on screen
        enqueue(hovered ? HOVER_IN : HOVER_OUT);
    }, [hovered, phase, enqueue]);

    /* Type the active line. */
    useEffect(() => {
        if (!active) return;

        const finish = () => {
            setCommitted((prev) => [...prev, active].slice(-HISTORY));
            window.setTimeout(() => setActive(null), PAUSE_MS);
        };

        if (reduce) {
            finish();
            return;
        }

        let frame = 0;
        let start = 0;
        const tick = (now: number) => {
            if (!start) start = now;
            const shown = Math.floor(((now - start) / 1000) * CPS);
            const node = typingRef.current;
            if (node) node.textContent = active.text.slice(0, shown);
            if (shown >= active.text.length) {
                finish();
                return;
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [active, reduce]);

    /* Start the next line once the previous one lands. */
    useEffect(() => {
        if (!active) pump();
    }, [active, committed, pump]);

    /* Keep the newest line in view as the log fills the box. */
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [committed, active]);

    return (
        <div
            aria-hidden="true"
            className="mt-5 overflow-hidden rounded-lg border border-border bg-surface"
        >
            {/* Chrome, so it reads as a terminal and not as a caption */}
            <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-2.5">
                <span className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-border" />
                    <span className="h-2 w-2 rounded-full bg-border" />
                    <span className="h-2 w-2 rounded-full bg-border" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-faint">
                    cv.render
                </span>
            </div>

            <div
                ref={scrollRef}
                className="h-[8.5rem] overflow-hidden px-3.5 py-3 font-mono text-[11px] leading-[1.75] tracking-[0.02em]"
            >
                {committed.map((line, i) => (
                    <Row key={`${line.text}-${i}`} line={line} />
                ))}

                {active && (
                    <Row line={active}>
                        <span ref={typingRef} />
                        <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-foreground align-baseline motion-reduce:hidden" />
                    </Row>
                )}
            </div>
        </div>
    );
};

export default RenderTerminal;
