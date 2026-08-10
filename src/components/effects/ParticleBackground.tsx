import React, { useEffect, useRef, memo } from 'react';

interface ParticleBackgroundProps {
    /** Target count at a 1440px-wide viewport. Scaled down on smaller screens. */
    particleCount?: number;
    color?: string;
}

interface Particle {
    x: number;
    y: number;
    sprite: number;
    speedX: number;
    speedY: number;
    opacity: number;
    rotation: number;
    rotationSpeed: number;
}

/** Number of pre-rendered width variants. Blitting a sprite is far cheaper
 *  than building and filling a rounded path per particle per frame. */
const SPRITE_COUNT = 6;
const MOUSE_RADIUS = 150;
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
    particleCount = 90,
    color = 'rgba(255, 255, 255, 0.5)'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let frame = 0;
        let width = 0;
        let height = 0;
        let dpr = 1;
        let particles: Particle[] = [];
        const mouse = { x: -9999, y: -9999 };

        /* -- sprite atlas ------------------------------------------------ */
        const sprites: HTMLCanvasElement[] = [];
        const spriteSizes: { w: number; h: number }[] = [];

        const buildSprites = () => {
            sprites.length = 0;
            spriteSizes.length = 0;
            for (let i = 0; i < SPRITE_COUNT; i++) {
                const w = 4 + (i / (SPRITE_COUNT - 1)) * 14;
                const h = 1 + (i / (SPRITE_COUNT - 1)) * 1.6;
                const sprite = document.createElement('canvas');
                sprite.width = Math.ceil(w * dpr);
                sprite.height = Math.ceil(h * dpr);
                const sctx = sprite.getContext('2d');
                if (sctx) {
                    sctx.scale(dpr, dpr);
                    sctx.fillStyle = color;
                    sctx.beginPath();
                    sctx.roundRect(0, 0, w, h, h / 2);
                    sctx.fill();
                }
                sprites.push(sprite);
                spriteSizes.push({ w, h });
            }
        };

        /* -- sizing ------------------------------------------------------ */
        const resize = () => {
            // Cap DPR at 2. Retina phones report 3 and quadruple the fill cost
            // for no visible gain on 1px hairline shapes.
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            const parent = canvas.parentElement;
            width = parent ? parent.offsetWidth : window.innerWidth;
            height = parent ? parent.offsetHeight : window.innerHeight;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            buildSprites();
        };

        const targetCount = () => {
            // Scale with viewport area so phones do not pay desktop cost.
            const scale = Math.min(1, width / 1440);
            return Math.max(24, Math.round(particleCount * (0.45 + 0.55 * scale)));
        };

        const initParticles = () => {
            const count = targetCount();
            particles = new Array(count);
            for (let i = 0; i < count; i++) {
                particles[i] = {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    sprite: (Math.random() * SPRITE_COUNT) | 0,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.2 - 0.1,
                    opacity: Math.random() * 0.5 + 0.1,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.01
                };
            }
        };

        /* -- draw -------------------------------------------------------- */
        const render = (animate: boolean) => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (animate) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const distSq = dx * dx + dy * dy;
                    // Squared-distance compare avoids a sqrt for every particle
                    // on every frame; the sqrt only runs inside the small radius.
                    if (distSq < MOUSE_RADIUS_SQ && distSq > 0) {
                        const dist = Math.sqrt(distSq);
                        const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.02;
                        p.x -= (dx / dist) * force;
                        p.y -= (dy / dist) * force;
                    }

                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.rotation += p.rotationSpeed;

                    if (p.x < -20) p.x = width + 20;
                    else if (p.x > width + 20) p.x = -20;
                    if (p.y < -20) p.y = height + 20;
                    else if (p.y > height + 20) p.y = -20;
                }

                const sprite = sprites[p.sprite];
                const size = spriteSizes[p.sprite];
                const cos = Math.cos(p.rotation);
                const sin = Math.sin(p.rotation);

                // setTransform beats save/rotate/restore: no state-stack churn.
                ctx.setTransform(
                    cos * dpr, sin * dpr,
                    -sin * dpr, cos * dpr,
                    p.x * dpr, p.y * dpr
                );
                ctx.globalAlpha = p.opacity;
                ctx.drawImage(sprite, -size.w / 2, -size.h / 2, size.w, size.h);
            }

            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        };

        const loop = () => {
            render(true);
            frame = requestAnimationFrame(loop);
        };

        const start = () => {
            if (frame) return;
            frame = requestAnimationFrame(loop);
        };

        const stop = () => {
            if (!frame) return;
            cancelAnimationFrame(frame);
            frame = 0;
        };

        /* -- listeners --------------------------------------------------- */
        let resizeTimer = 0;
        const handleResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                resize();
                initParticles();
                if (reduceMotion) render(false);
            }, 150);
        };

        // Listens on window, not the canvas, so the canvas can stay
        // pointer-events:none and never sit in the page hit-test path.
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleVisibility = () => {
            if (document.hidden) stop();
            else if (!reduceMotion) start();
        };

        resize();
        initParticles();

        if (reduceMotion) {
            // Static field, drawn once. No rAF loop at all.
            render(false);
        } else {
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
            document.addEventListener('visibilitychange', handleVisibility);
            start();
        }
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            stop();
            window.clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [particleCount, color]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full pointer-events-none"
        />
    );
};

export default memo(ParticleBackground);
