import React, { useEffect, useRef, useState, memo } from 'react';

interface BlockPortraitProps {
    src: string;
    alt: string;
    /** 0 is one huge block, 1 is near-photographic. */
    restClarity?: number;
    /** Clarity while hovered. */
    hoverClarity?: number;
    /**
     * Gate for the build sequence. The boot overlay covers this canvas, so
     * without it the portrait finishes assembling before anyone can see it.
     */
    play?: boolean;
    /**
     * Element that counts as "hovered". Defaults to the canvas. Pass the
     * wrapper when sibling chrome (a readout, a caption) reacts to the same
     * hover via CSS, so the canvas and the CSS agree on the region.
     */
    hoverTarget?: React.RefObject<HTMLElement>;
    /** Fired on phase changes only, never per frame. */
    onPhase?: (phase: PortraitPhase) => void;
    className?: string;
}

const GAP_RATIO = 0.14; // fraction of a cell left as gutter, so blocks read as blocks
const LERP = 0.1;

/* Clarity is the number the design speaks in: 70% at rest, 90% on hover.
   Grid resolution is geometric rather than linear across it, because block
   size is what the eye reads and doubling the column count halves it. On this
   ramp 0.7 lands at 64 columns and 0.9 at 110, both still plainly blocks. */
const MIN_COLS = 9;
const MAX_COLS = 148;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const colsForClarity = (clarity: number) =>
    Math.round(MIN_COLS * Math.pow(MAX_COLS / MIN_COLS, clamp01(clarity)));

/* Build sequence. Blocks are laid bottom to top like courses of masonry, each
   dropping in from above and settling with a little overshoot, so the portrait
   is constructed rather than faded in.
   The first pass is deliberately too coarse to hold a face. It stacks, holds
   for a beat, collapses, and the second pass rebuilds at full resolution: the
   render fails and retries, which is the same story the boot terminal tells. */
const BUILD_MS = 3200;
const FIRST_CLARITY = 0.35; // too few blocks to resolve anything
const COURSE_SPAN = 0.6; // share of a pass spent walking bottom row to top
const JITTER = 0.16; // per-block scatter, so a course is not a rigid line
const BLOCK_SPAN = 0.24; // each block's own drop, in the same 0..1 units
const DROP_CELLS = 2.6; // how far above its slot a block starts
const FALL_CELLS = 7; // how far the failed pass drops out of frame

/* Cue points along the 0..1 build. */
const PASS1_END = 0.28; // first pass has finished stacking
const PASS1_HOLD = 0.37; // it sits there looking done
const FAIL_END = 0.47; // and has fallen away
const BLANK_END = 0.53; // empty beat before the retry

type Mode = 'stack' | 'fail' | 'blank' | 'settled';

/** What the render is doing, for a caller that wants to narrate it. */
export type PortraitPhase = 'first' | 'error' | 'rebuilding' | 'ready';

const phaseAt = (p: number): PortraitPhase => {
    if (p >= 1) return 'ready';
    if (p < PASS1_HOLD) return 'first';
    if (p < BLANK_END) return 'error';
    return 'rebuilding';
};

const BACK = 1.70158;
/** Overshoot on landing. Peaks near 1.1, which the 14% gutter absorbs. */
const easeOutBack = (t: number) => {
    const u = t - 1;
    return 1 + (BACK + 1) * u * u * u + BACK * u * u;
};
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const easeInQuad = (t: number) => t * t;

/**
 * Renders a portrait as a grid of discrete monochrome blocks.
 * Resolution eases up on hover, so the face resolves as the user engages.
 * Source must be same-origin or the canvas taints and getImageData throws.
 */
const BlockPortrait: React.FC<BlockPortraitProps> = ({
    src,
    alt,
    restClarity = 0.7,
    hoverClarity = 0.9,
    play = true,
    hoverTarget,
    onPhase,
    className,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hoverRef = useRef(false);
    const [failed, setFailed] = useState(false);

    // Read through a ref, so a caller passing an inline arrow does not tear
    // down and restart the whole render on every one of its own updates.
    const onPhaseRef = useRef(onPhase);
    onPhaseRef.current = onPhase;

    useEffect(() => {
        if (!play) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const restCols = colsForClarity(restClarity);
        const hoverCols = colsForClarity(hoverClarity);

        let frame = 0;
        let disposed = false;
        let size = 0;
        let dpr = 1;
        let cols = restCols;
        let build = reduceMotion ? 1 : 0;
        let buildStart = 0;
        let phase: PortraitPhase | null = null;

        const reportPhase = (next: PortraitPhase) => {
            if (phase === next) return;
            phase = next;
            onPhaseRef.current?.(next);
        };

        // Offscreen buffer holds the image downsampled to the current grid,
        // so sampling is one drawImage rather than a per-block read of the full image.
        const buffer = document.createElement('canvas');
        const bctx = buffer.getContext('2d', { willReadFrequently: true });
        if (!bctx) return;

        const image = new Image();
        // Same-origin asset in /public, so no crossOrigin dance and no taint.
        image.decoding = 'async';

        /** Per-block scatter, so a course of blocks does not land as one line. */
        let seeds: Float32Array = new Float32Array(0);
        const reseed = (n: number) => {
            seeds = new Float32Array(n * n);
            for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
        };

        const measure = () => {
            const rect = canvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            size = Math.max(1, Math.round(rect.width));
            canvas.width = Math.floor(size * dpr);
            canvas.height = Math.floor(size * dpr);
        };

        const firstCols = colsForClarity(FIRST_CLARITY);

        /** Which pass the build is in, at what grid, and how far through. */
        const planFor = (p: number): { mode: Mode; n: number; t: number } => {
            if (p >= 1) return { mode: 'settled', n: Math.max(8, Math.round(cols)), t: 1 };
            if (p < PASS1_HOLD)
                return { mode: 'stack', n: firstCols, t: clamp01(p / PASS1_END) };
            if (p < FAIL_END)
                return {
                    mode: 'fail',
                    n: firstCols,
                    t: (p - PASS1_HOLD) / (FAIL_END - PASS1_HOLD),
                };
            if (p < BLANK_END) return { mode: 'blank', n: firstCols, t: 0 };
            // Live cols rather than restCols, so hovering part way through the
            // retry rebuilds at the sharper grid instead of snapping to it
            // the moment the build finishes.
            return {
                mode: 'stack',
                n: Math.max(8, Math.round(cols)),
                t: (p - BLANK_END) / (1 - BLANK_END),
            };
        };

        const draw = () => {
            const plan = planFor(build);
            const { mode, t } = plan;
            const n = Math.max(8, plan.n);

            if (mode === 'blank') {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, Math.floor(size * dpr), Math.floor(size * dpr));
                return;
            }

            if (buffer.width !== n) {
                buffer.width = n;
                buffer.height = n;
            }
            if (seeds.length !== n * n) reseed(n);

            // Downsample the source to an n x n grid
            bctx.clearRect(0, 0, n, n);
            bctx.drawImage(image, 0, 0, n, n);
            const data = bctx.getImageData(0, 0, n, n).data;

            // Draw in device pixels with integer edges. In CSS-pixel space the
            // gutter lands on fractional coordinates, antialiases, and the grid
            // washes out into a plain soft photo.
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const px = Math.floor(size * dpr);
            ctx.clearRect(0, 0, px, px);

            const cell = px / n;
            const gap = Math.max(1, Math.round(cell * GAP_RATIO));

            for (let y = 0; y < n; y++) {
                const y0 = Math.round(y * cell);
                const y1 = Math.round((y + 1) * cell);

                // Bottom course first, so the portrait stacks upward.
                const course = n > 1 ? (n - 1 - y) / (n - 1) : 0;

                for (let x = 0; x < n; x++) {
                    const i = (y * n + x) * 4;
                    const a = data[i + 3] / 255;
                    if (a === 0) continue;

                    // Force luminance: the page is monochrome, so the portrait is too.
                    const lum = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) | 0;

                    const x0 = Math.round(x * cell);
                    const x1 = Math.round((x + 1) * cell);
                    const w = Math.max(1, x1 - x0 - gap);
                    const h = Math.max(1, y1 - y0 - gap);

                    if (mode === 'settled') {
                        ctx.globalAlpha = a;
                        ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
                        ctx.fillRect(x0, y0, w, h);
                        continue;
                    }

                    const seed = seeds[y * n + x];
                    let scale: number;
                    let offset: number;
                    let alpha: number;

                    if (mode === 'fail') {
                        // Gives way from the top down, which is the opposite
                        // order it was laid in, so it reads as coming apart
                        // rather than as a second build running backwards.
                        const local = clamp01((t - (1 - course) * 0.3 - seed * 0.2) / 0.5);
                        if (local >= 1) continue;
                        scale = 1 - local * 0.4;
                        offset = -easeInQuad(local) * cell * FALL_CELLS;
                        alpha = a * (1 - local);
                    } else {
                        const delay = course * COURSE_SPAN + seed * JITTER;
                        const local = clamp01((t - delay) / BLOCK_SPAN);
                        if (local <= 0) continue;
                        scale = easeOutBack(local);
                        offset = (1 - easeOutQuint(local)) * cell * DROP_CELLS;
                        alpha = a * Math.min(1, local * 2.4);
                    }

                    const dw = Math.max(1, Math.round(w * scale));
                    const dh = Math.max(1, Math.round(h * scale));

                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
                    ctx.fillRect(
                        x0 + ((w - dw) >> 1),
                        Math.round(y0 + ((h - dh) >> 1) - offset),
                        dw,
                        dh
                    );
                }
            }
            ctx.globalAlpha = 1;
        };

        const loop = (now: number) => {
            if (disposed) return;

            if (build < 1) {
                if (!buildStart) buildStart = now;
                build = clamp01((now - buildStart) / BUILD_MS);
            }
            reportPhase(phaseAt(build));

            const targetCols = hoverRef.current ? hoverCols : restCols;
            const nextCols = cols + (targetCols - cols) * LERP;
            const settled = build >= 1 && Math.abs(nextCols - targetCols) < 0.25;

            cols = settled ? targetCols : nextCols;

            draw();

            // Stop the loop once the grid has settled. It restarts on hover.
            if (settled) {
                frame = 0;
                return;
            }
            frame = requestAnimationFrame(loop);
        };

        const start = () => {
            if (frame || disposed) return;
            frame = requestAnimationFrame(loop);
        };

        const onEnter = () => {
            if (reduceMotion) return;
            hoverRef.current = true;
            start();
        };
        const onLeave = () => {
            if (reduceMotion) return;
            hoverRef.current = false;
            start();
        };

        const onResize = () => {
            measure();
            draw();
        };

        image.onload = () => {
            if (disposed) return;
            measure();
            if (reduceMotion) {
                build = 1;
                cols = restCols;
                reportPhase('ready');
                draw();
            } else {
                start();
            }
        };
        image.onerror = () => setFailed(true);
        image.src = src;

        const hotspot: HTMLElement = hoverTarget?.current ?? canvas;
        hotspot.addEventListener('pointerenter', onEnter);
        hotspot.addEventListener('pointerleave', onLeave);
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            disposed = true;
            if (frame) cancelAnimationFrame(frame);
            hotspot.removeEventListener('pointerenter', onEnter);
            hotspot.removeEventListener('pointerleave', onLeave);
            window.removeEventListener('resize', onResize);
            image.onload = null;
            image.onerror = null;
        };
        // hoverTarget is a ref, stable across renders, so it is read rather
        // than tracked. Listing it would re-run the whole effect on every
        // parent render and reload the image.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src, restClarity, hoverClarity, play]);

    if (failed) {
        // Plain image beats an empty box if the canvas path cannot run.
        return <img src={src} alt={alt} className={className} />;
    }

    return (
        <canvas
            ref={canvasRef}
            role="img"
            aria-label={alt}
            className={className}
        />
    );
};

export default memo(BlockPortrait);
