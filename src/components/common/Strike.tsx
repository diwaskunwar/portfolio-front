import React from 'react';
import { cn } from '@/lib/utils';

/**
 * One or more words crossed out and corrected by the one that follows.
 *
 * The footer already does this once — "Designed and developed by ~~Claude~~
 * Diwas Kunwar" — and it is the single most legible joke on the page,
 * because striking a word and replacing it needs no vocabulary at all. A
 * recruiter, a founder, and an engineer all read it identically and
 * instantly. Pulled into a component so the device is consistent wherever it
 * appears rather than reinvented per call site.
 *
 * `<del>` and `<ins>` are the correct elements rather than styled spans:
 * they are exactly "removed text" and "replacement text", so a screen reader
 * announces the correction instead of reading "code innovate solve build" as
 * one baffling phrase. `<del>` also carries line-through natively, so the
 * visual comes free with the semantics.
 */
interface StrikeProps {
    /**
     * The word or words being corrected. Struck through and dimmed.
     *
     * A list reads as escalating self-correction — each one a thing every
     * portfolio claims, discarded in turn until the honest verb is left.
     */
    from: string | string[];
    /** The word that stands. */
    to: React.ReactNode;
    className?: string;
}

const Strike: React.FC<StrikeProps> = ({ from, to, className }) => {
    const struck = Array.isArray(from) ? from : [from];

    return (
        /* `nowrap` sits on each word rather than the whole component: a
           wrapper-level nowrap would force every struck word and the
           replacement onto one unbreakable line, which overflows a narrow
           phone. Each word stays glued to its own strike, and the line is
           free to wrap between them. */
        <span className={className}>
            {struck.map((word) => (
                <React.Fragment key={word}>
                    <del className="whitespace-nowrap text-faint decoration-foreground/40 decoration-1">
                        {word}
                    </del>{' '}
                </React.Fragment>
            ))}
            <ins className="whitespace-nowrap text-foreground no-underline">{to}</ins>
        </span>
    );
};

export default Strike;
