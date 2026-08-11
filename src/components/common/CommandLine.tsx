import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandLineProps {
    children: string;
    /**
     * `block` is a boxed terminal row for content. `prompt` is a bare line
     * with no chrome, used above a heading. Keeping the two visually apart
     * stops the page reading as one long uninterrupted terminal.
     */
    tone?: 'block' | 'prompt';
    /**
     * Prompt symbol. `null` for source rather than shell, so a listing is not
     * mislabelled as something you could paste into a terminal.
     */
    prefix?: string | null;
    /** Trailing caret. One per screen at most: it is an attention magnet. */
    caret?: boolean;
    className?: string;
}

const COPIED_MS = 1600;

/**
 * A shell command, set as a shell command.
 *
 * Used for section headings, career chapters, and how each shipped product is
 * actually run. Everything is real: nothing here is invented syntax.
 *
 * Commands wrap rather than scroll. A horizontal scrollbar hid the end of
 * every long one, and the end of a command is where the interesting flags
 * live. Block form is also click-to-copy, since a command you cannot take
 * with you is only decoration.
 */
const CommandLine: React.FC<CommandLineProps> = ({
    children,
    tone = 'block',
    prefix = '$',
    caret = false,
    className,
}) => {
    const [copied, setCopied] = useState(false);
    const timer = useRef<number>();

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const copy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(children);
        } catch {
            return; // insecure context or denied permission: stay silent
        }
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
    }, [children]);

    const body = (
        <>
            {prefix && (
                <span aria-hidden="true" className="select-none text-foreground/70">
                    {prefix}
                </span>
            )}
            <span
                className={cn(
                    'whitespace-pre-wrap break-words',
                    prefix && 'ml-1.5',
                    tone === 'block' && 'flex-1'
                )}
            >
                {children}
            </span>
            {caret && (
                <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-[1em] w-[0.5em] shrink-0 animate-caret bg-foreground align-middle motion-reduce:hidden"
                />
            )}
        </>
    );

    if (tone === 'prompt') {
        return (
            <p
                className={cn(
                    'flex items-baseline font-mono text-[12px] leading-relaxed tracking-[0.02em] text-muted-foreground md:text-[13px]',
                    className
                )}
            >
                {body}
            </p>
        );
    }

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={`Copy: ${children}`}
            className={cn(
                'group/cmd flex w-full items-start gap-2 rounded-md border border-border bg-surface px-3.5 py-2.5 text-left font-mono text-[11px] leading-relaxed tracking-[0.02em] text-muted-foreground transition-colors duration-300 hover:border-foreground/40 hover:text-foreground group-hover:border-foreground/30 group-hover:text-foreground sm:text-[12px]',
                className
            )}
        >
            <span className="flex flex-1 items-baseline">{body}</span>
            <span
                aria-hidden="true"
                className="mt-[0.15em] shrink-0 text-faint transition-colors duration-200 group-hover/cmd:text-foreground"
            >
                {copied ? (
                    <Check size={13} strokeWidth={2} />
                ) : (
                    <Copy size={13} strokeWidth={1.75} />
                )}
            </span>
        </button>
    );
};

export default CommandLine;
