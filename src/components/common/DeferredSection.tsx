import React, { Suspense, useEffect, useRef, useState } from 'react';

interface DeferredSectionProps {
    children: React.ReactNode;
    /**
     * Id of the section inside. Exposed on the placeholder so navigation can
     * still scroll here before the real section has mounted.
     */
    sectionId: string;
    /**
     * Space held open before the section mounts, so scroll position and the
     * page height do not jump when it arrives.
     */
    minHeight?: number;
    /** How far ahead of the viewport to start loading. */
    rootMargin?: string;
}

/**
 * Mounts its children only once the reader approaches them.
 *
 * Paired with `React.lazy`, this means the chunk is not even requested until
 * it is nearly needed, while the reserved height keeps layout stable so
 * nothing shifts underfoot.
 */
const DeferredSection: React.FC<DeferredSectionProps> = ({
    children,
    sectionId,
    minHeight = 640,
    rootMargin = '900px 0px',
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || mounted) return;

        // No IntersectionObserver, no deferral: render rather than hide content.
        if (typeof IntersectionObserver === 'undefined') {
            setMounted(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setMounted(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [mounted, rootMargin]);

    return (
        <div
            ref={ref}
            data-section-placeholder={mounted ? undefined : sectionId}
            style={mounted ? undefined : { minHeight }}
        >
            {mounted ? <Suspense fallback={null}>{children}</Suspense> : null}
        </div>
    );
};

export default DeferredSection;
