import React, { useCallback, useEffect, useRef, useState } from 'react';
import { markBooted } from '@/lib/bootState';

/* Plays once per browser session. Repeat visitors and internal navigation
   should never sit through it twice. */
const SESSION_KEY = 'boot-sequence-played';

/* Beat between the last character and the hand-off, so the log can be read
   rather than snatched away the instant it finishes. */
const HOLD_MS = 1150;
/* Terminal text clears first, then the ground fades, so the interface is
   revealed rather than swapped. */
const TEXT_EXIT_MS = 420;
const OVERLAY_EXIT_MS = 900;

const SCRIPT = `$ wg-quick up wg0
[#] interface wg0 configured
[#] handshake with 10.8.0.1 ... complete
[#] tunnel established (chacha20-poly1305)

$ ssh diwas@inference-node-01
Authenticating .............................. ok
Welcome to Ubuntu 24.04.2 LTS (6.8.0-generic)

$ nvidia-smi --query-gpu=name,memory.total --format=csv
NVIDIA A100-SXM4-80GB, 81920 MiB
CUDA 12.4 ................................... ready

$ python -m serve --model diwas-7b --quantize int8
Loading weights ......................... 100%
Warming KV cache ............................ ok
Qdrant collection "career" .......... 1284 vectors
Hermes orchestrator ..................... online

$ ./portfolio --render
All systems nominal. Handing over to the interface.`;

type Phase = 'typing' | 'holding' | 'exiting';

interface BootSequenceProps {
    /** Characters revealed per second. */
    speed?: number;
}

const BootSequence: React.FC<BootSequenceProps> = ({ speed = 260 }) => {
    // Decided synchronously so the overlay never flashes for repeat visitors.
    const [active, setActive] = useState(() => {
        if (typeof window === 'undefined') return false;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
        try {
            return sessionStorage.getItem(SESSION_KEY) !== '1';
        } catch {
            return true;
        }
    });
    const [shown, setShown] = useState(0);
    const [phase, setPhase] = useState<Phase>('typing');
    const frameRef = useRef(0);
    const timersRef = useRef<number[]>([]);
    const scrollRef = useRef<HTMLPreElement>(null);

    /* If the sequence is not going to play, the interface is free immediately. */
    useEffect(() => {
        if (!active) markBooted();
    }, [active]);

    const dismiss = useCallback(() => {
        setPhase((current) => (current === 'exiting' ? current : 'exiting'));
    }, []);

    /* Drive the exit as its own effect so click, key, and auto-finish all
       follow one path, and the unmount always outlasts the fade. */
    useEffect(() => {
        if (phase !== 'exiting') return;

        try {
            sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
            /* private mode, fine, it just replays next visit */
        }

        // Released as the ground starts to fade, so the hero's own entrance
        // plays into the reveal instead of after it.
        const handOff = window.setTimeout(markBooted, TEXT_EXIT_MS);
        const unmount = window.setTimeout(
            () => setActive(false),
            TEXT_EXIT_MS + OVERLAY_EXIT_MS
        );
        timersRef.current.push(handOff, unmount);

        return () => {
            window.clearTimeout(handOff);
            window.clearTimeout(unmount);
        };
    }, [phase]);

    /* Lock scrolling underneath while the overlay owns the viewport. */
    useEffect(() => {
        if (!active) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [active]);

    /* Time-based reveal. One state value drives the whole thing, so a
       ~600 character script costs far fewer renders than per-character
       timers would, and it stays correct if a frame is dropped. */
    useEffect(() => {
        if (!active || phase !== 'typing') return;

        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = (now - start) / 1000;
            const next = Math.min(SCRIPT.length, Math.floor(elapsed * speed));
            setShown(next);

            if (next >= SCRIPT.length) {
                setPhase('holding');
                return;
            }
            frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameRef.current);
    }, [active, phase, speed]);

    /* Hold on the finished log, then hand over. */
    useEffect(() => {
        if (phase !== 'holding') return;
        const timer = window.setTimeout(dismiss, HOLD_MS);
        return () => window.clearTimeout(timer);
    }, [phase, dismiss]);

    /* Any key, or a click, skips ahead. */
    useEffect(() => {
        if (!active) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Tab') return; // let focus reach the skip button
            dismiss();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [active, dismiss]);

    /* Keep the newest line in view as the log grows past the fold. */
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [shown]);

    useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

    if (!active) return null;

    const exiting = phase === 'exiting';

    return (
        <div
            className={[
                'fixed inset-0 z-[200] flex items-center justify-center bg-background px-4 sm:px-6',
                'transition-opacity ease-swift',
                exiting ? 'opacity-0' : 'opacity-100',
            ].join(' ')}
            style={{ transitionDuration: `${OVERLAY_EXIT_MS}ms` }}
            onClick={dismiss}
        >
            {/* Scanlines. Fixed and non-interactive, so no scroll repaint cost. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.045]"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)',
                }}
            />

            <div
                className={[
                    'relative w-full max-w-2xl transition-all ease-swift',
                    exiting ? '-translate-y-2 opacity-0' : 'translate-y-0 opacity-100',
                ].join(' ')}
                style={{ transitionDuration: `${TEXT_EXIT_MS}ms` }}
            >
                <pre
                    ref={scrollRef}
                    aria-hidden="true"
                    // Longest line is 52 characters, so the size is capped by
                    // what fits on one line at 390px wide: the log must never
                    // wrap or it stops reading as a terminal. Full-strength
                    // white with a phosphor halo, since the scanline overlay
                    // sits on top of it and a dimmed grey disappeared under it.
                    className="crt-text max-h-[70vh] overflow-hidden whitespace-pre-wrap font-mono text-[10.5px] font-medium leading-[1.75] sm:text-[13px] sm:leading-[1.8] md:text-[14px]"
                >
                    {SCRIPT.slice(0, shown)}
                    {!exiting && (
                        <span
                            className={[
                                'ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-foreground align-baseline',
                                // Only blinks once the log is done, so it reads as
                                // an idle prompt rather than competing with the type-out.
                                phase === 'holding' ? 'animate-caret' : '',
                            ].join(' ')}
                        />
                    )}
                </pre>
            </div>

            <button
                type="button"
                onClick={dismiss}
                className="absolute bottom-6 right-6 rounded-full border border-border px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.17em] text-muted-foreground transition-colors hover:border-foreground/35 hover:text-foreground sm:bottom-8 sm:right-8"
            >
                Skip
            </button>
        </div>
    );
};

export default BootSequence;
