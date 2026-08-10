import React, { useEffect, useRef, useState, memo } from 'react';

interface BlockPortraitProps {
    src: string;
    alt: string;
    /** Grid resolution at rest. Lower reads blockier. */
    restCols?: number;
    /** Grid resolution while hovered. Higher resolves more of the face. */
    hoverCols?: number;
    className?: string;
}

const GAP_RATIO = 0.14; // fraction of a cell left as gutter, so blocks read as blocks
const LERP = 0.12;

/**
 * Renders a portrait as a grid of discrete monochrome blocks.
 * Resolution eases up on hover, so the face resolves as the user engages.
 * Source must be same-origin or the canvas taints and getImageData throws.
 */
const BlockPortrait: React.FC<BlockPortraitProps> = ({
    src,
    alt,
    restCols = 64,
    hoverCols = 112,
    className,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hoverRef = useRef(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let frame = 0;
        let disposed = false;
        let size = 0;
        let dpr = 1;
        let cols = restCols;
        let reveal = reduceMotion ? 1 : 0;

        // Offscreen buffer holds the image downsampled to the current grid,
        // so sampling is one drawImage rather than a per-block read of the full image.
        const buffer = document.createElement('canvas');
        const bctx = buffer.getContext('2d', { willReadFrequently: true });
        if (!bctx) return;

        const image = new Image();
        // Same-origin asset in /public, so no crossOrigin dance and no taint.
        image.decoding = 'async';

        /** Per-block reveal offsets, so blocks do not all arrive together. */
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

        const draw = () => {
            const n = Math.max(8, Math.round(cols));

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
                for (let x = 0; x < n; x++) {
                    const i = (y * n + x) * 4;
                    const a = data[i + 3] / 255;
                    if (a === 0) continue;

                    // Force luminance: the page is monochrome, so the portrait is too.
                    const lum = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) | 0;

                    // Each block waits its turn, then fades and scales in.
                    const seed = seeds[y * n + x];
                    const local = Math.min(1, Math.max(0, (reveal - seed * 0.55) / 0.45));
                    if (local <= 0) continue;

                    const x0 = Math.round(x * cell);
                    const x1 = Math.round((x + 1) * cell);
                    const w = Math.max(1, x1 - x0 - gap);
                    const h = Math.max(1, y1 - y0 - gap);

                    const dw = Math.max(1, Math.round(w * local));
                    const dh = Math.max(1, Math.round(h * local));

                    ctx.globalAlpha = a * local;
                    ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
                    ctx.fillRect(
                        x0 + ((w - dw) >> 1),
                        y0 + ((h - dh) >> 1),
                        dw,
                        dh
                    );
                }
            }
            ctx.globalAlpha = 1;
        };

        const loop = () => {
            if (disposed) return;

            const targetCols = hoverRef.current ? hoverCols : restCols;
            const nextCols = cols + (targetCols - cols) * LERP;
            const nextReveal = Math.min(1, reveal + 0.02);

            const settled =
                Math.abs(nextCols - targetCols) < 0.25 && nextReveal >= 1 && reveal >= 1;

            cols = settled ? targetCols : nextCols;
            reveal = nextReveal;

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
                reveal = 1;
                cols = restCols;
                draw();
            } else {
                start();
            }
        };
        image.onerror = () => setFailed(true);
        image.src = src;

        canvas.addEventListener('pointerenter', onEnter);
        canvas.addEventListener('pointerleave', onLeave);
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            disposed = true;
            if (frame) cancelAnimationFrame(frame);
            canvas.removeEventListener('pointerenter', onEnter);
            canvas.removeEventListener('pointerleave', onLeave);
            window.removeEventListener('resize', onResize);
            image.onload = null;
            image.onerror = null;
        };
    }, [src, restCols, hoverCols]);

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
