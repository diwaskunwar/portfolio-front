import React from 'react';
import { cn } from '@/lib/utils';
import CommandLine from '@/components/common/CommandLine';
import Reveal, { TextReveal } from '@/components/common/Reveal';
import {
    CHAPTER_COUNT,
    chapterLabel,
    chapterNumber,
    type ChapterId,
} from '@/lib/chapters';

/**
 * The command / heading / lead block every section opens with.
 *
 * This existed eight times as copied markup, and had drifted: five different
 * bottom margins, two different measures, one heading on its own type scale,
 * and one section whose heading and lead were the only ones that did not
 * animate. Holding it in one place means the left edge, the type scale, and
 * the rhythm into the content below are identical down the page by
 * construction rather than by vigilance.
 */
interface SectionHeaderProps {
    /**
     * Position in the sequence. Draws the chapter rule above the heading and
     * numbers it from `src/lib/chapters.ts`, so no section carries a number
     * that disagrees with the one before it.
     */
    chapter?: ChapterId;
    /** Shell line above the heading. Sets the section's voice. */
    command: string;
    title: string;
    children?: React.ReactNode;
    /**
     * Widen the measure from 2xl to 3xl. For a lead long enough that the
     * narrower column turns it into a tall thin block.
     */
    wide?: boolean;
    className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    chapter,
    command,
    title,
    children,
    wide = false,
    className,
}) => (
    <>
        {/* Chapter rule. Full container width rather than the header's measure,
            and the same masthead shape the hero opens with — label left, index
            right, hairline between. The hero is the cover; every rule below it
            is a chapter break.

            Deliberately thin: pt-4 and mb-5, not a second helping of section
            padding. The gap between sections already comes from the section's
            own py; this only needs to be tall enough to read as a rule, not
            tall enough to be a second gap stacked on the first — that was the
            mistake the first version of this made. */}
        {chapter && (
            <div className="mb-5 flex items-baseline justify-between gap-6 border-t border-border pt-4 md:mb-6 md:pt-5">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-foreground sm:text-xs">
                    Chapter {chapterLabel(chapter)}
                </span>
                <span
                    className="label-faint tabular-nums"
                    aria-label={`Chapter ${chapterNumber(chapter)} of ${CHAPTER_COUNT}`}
                >
                    {chapterLabel(chapter)} / {CHAPTER_COUNT}
                </span>
            </div>
        )}

        <div
            className={cn(
                /* One rhythm into the content below, scaling with the page. */
                'mb-10 md:mb-12 xl:mb-14',
                wide ? 'max-w-3xl' : 'max-w-2xl',
                className
            )}
        >
            <CommandLine tone="prompt" className="mb-5">
                {command}
            </CommandLine>

            <h2 className="text-[clamp(2rem,4.6vw,4.25rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
                <TextReveal text={title} />
            </h2>

            {children && (
                <Reveal delay={0.15}>
                    <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                        {children}
                    </p>
                </Reveal>
            )}
        </div>
    </>
);

export default SectionHeader;
