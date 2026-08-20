import React, { useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Download, ArrowUpRight } from 'lucide-react';
import {
    EMAIL,
    EMAIL_URL,
    GITHUB_URL,
    LINKEDIN_URL,
    HUGGINGFACE_URL,
    RESUME_DOWNLOAD_URL,
} from '@/lib/links';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import Reveal from '@/components/common/Reveal';

/**
 * The page's ending.
 *
 * It previously stopped rather than ended: the last thing before the footer
 * was a list of hobbies, so a hiring reader's final impression was football
 * and film. Every other section makes a case; none of them said what to do
 * about it.
 *
 * The posture here is deliberate and was corrected once already. This is not
 * an availability notice. Nothing on this page asks for a job — it states what
 * he is building, what he says yes to, and where to write. The reader is left
 * making the case, which is the only position worth negotiating from.
 */

/* Deliberately not an availability badge.
   "Open to roles" reads as someone waiting to be picked, and it invites the
   reader to weigh whether to do him a favour. Stating that he is busy and
   selective puts the same door in the wall and makes the reader argue for
   walking through it. */
const STATUS = {
    headline: 'Currently building at CantorDust',
    detail:
        'Not on the market. A harder problem is a different conversation, and worth having.',
} as const;

/* What he says yes to. The reverse of a job advert: the reader arrives
   expecting to assess, and finds criteria pointed back at them. Someone with
   standards is worth more than someone who is free. */
const CRITERIA = [
    {
        tag: 'The problem',
        claim: 'It has to be genuinely hard.',
        body: 'If the answer is a thin wrapper around somebody else’s API, you do not need me and I will tell you so.',
    },
    {
        tag: 'The outcome',
        claim: 'Somebody has to use it.',
        body: 'I have built enough things that impressed a room and shipped to nobody. Once was educational.',
    },
    {
        tag: 'The team',
        claim: 'Argue about the right things.',
        body: 'Disagreement about the approach is the job. Disagreement about whether to write tests is a different problem.',
    },
] as const;

/* Nepal is UTC+05:45 — the only country in the world on a 45-minute offset,
   which is a genuinely useful thing for someone hiring across timezones to
   see stated rather than have to work out. */
const TIME_ZONE = 'Asia/Kathmandu';

const CHANNELS = [
    { href: GITHUB_URL, label: 'GitHub', handle: 'diwaskunwar', Icon: Github },
    { href: LINKEDIN_URL, label: 'LinkedIn', handle: 'diwas-kunwar', Icon: Linkedin },
    { href: EMAIL_URL, label: 'Email', handle: EMAIL, Icon: Mail },
] as const;

/**
 * His current local time, ticking.
 *
 * Writes straight to the node on an interval rather than through state, the
 * same way StatusTicker and CountUp do, so a clock that updates every second
 * does not re-render the section for the life of the page.
 */
const LocalTime: React.FC = () => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const format = new Intl.DateTimeFormat('en-GB', {
            timeZone: TIME_ZONE,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        const write = () => {
            node.textContent = format.format(new Date());
        };

        write();
        const timer = window.setInterval(write, 1000);
        return () => window.clearInterval(timer);
    }, []);

    return <span ref={ref} className="tabular-nums">--:--</span>;
};

const GetInTouch = () => {
    return (
        <Section id="get-in-touch" className="py-10 sm:py-12 md:py-14 xl:py-16">
            <Container className="w-full">
                <SectionHeader chapter="get-in-touch" command="ping diwas" title="Get in touch">
                    Everything above is what I have built. Below is what would
                    make me say yes, and the address that reaches me directly.
                    No form, no scheduling link, no recruiter in between.
                </SectionHeader>

                {/* The dot means "actively building", not "available". Same
                    signal of life, opposite posture. */}
                <Reveal className="mb-10 md:mb-12 xl:mb-14">
                    <div className="flex flex-col gap-8 rounded-lg border border-border p-7 sm:flex-row sm:items-center sm:justify-between md:p-10">
                        <div className="flex items-start gap-4">
                            <span
                                aria-hidden="true"
                                className="relative mt-[0.45em] flex h-2 w-2 shrink-0"
                            >
                                <span className="absolute inline-flex h-full w-full animate-live-ping rounded-full bg-foreground motion-reduce:hidden" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
                            </span>
                            <div>
                                <p className="text-xl font-medium tracking-[-0.02em] text-foreground md:text-2xl">
                                    {STATUS.headline}
                                </p>
                                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                                    {STATUS.detail}
                                </p>
                            </div>
                        </div>

                        {/* Local time, live. Answers "when is this person
                            actually awake" without anyone doing the arithmetic. */}
                        <div className="shrink-0 border-t border-border pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0 sm:text-right">
                            <p className="label-mono">Kathmandu &middot; UTC+05:45</p>
                            <p className="mt-2 font-mono text-2xl font-medium tracking-[-0.02em] text-foreground md:text-3xl">
                                <LocalTime />
                            </p>
                        </div>
                    </div>
                </Reveal>

                {/* Criteria, before the address. The reader came to evaluate
                    and is handed a standard to clear instead. */}
                <div className="mb-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 md:mb-12 xl:mb-14">
                    {CRITERIA.map((item, i) => (
                        <Reveal
                            key={item.tag}
                            delay={i * 0.06}
                            amount={0.2}
                            className="group/criterion flex flex-col bg-background p-6 transition-colors duration-500 hover:bg-surface md:p-8"
                        >
                            <span className="label-faint transition-colors duration-500 group-hover/criterion:text-foreground">
                                {item.tag}
                            </span>
                            <p className="mt-4 text-lg font-medium leading-[1.3] tracking-[-0.02em] text-foreground md:text-xl">
                                {item.claim}
                            </p>
                            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                                {item.body}
                            </p>
                        </Reveal>
                    ))}
                </div>

                {/* The address itself, set as large as a heading. It is the
                    single thing this section exists to hand over. */}
                <Reveal delay={0.08}>
                    <a
                        href={EMAIL_URL}
                        className="group block border-t border-border pt-8 md:pt-10"
                    >
                        <span className="label-mono">Write to me</span>
                        <span className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                            <span className="break-all text-[clamp(1.5rem,4.2vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.035em] text-foreground transition-opacity duration-300 group-hover:opacity-70">
                                {EMAIL}
                            </span>
                            <ArrowUpRight
                                size={28}
                                strokeWidth={1.5}
                                aria-hidden="true"
                                className="shrink-0 translate-y-1 text-faint transition-all duration-300 group-hover:-translate-y-0 group-hover:text-foreground motion-reduce:transition-none"
                            />
                        </span>
                        <span className="mt-4 block text-[15px] leading-relaxed text-muted-foreground md:text-base">
                            Tell me what is broken and why it matters. A real
                            question about the work gets a real answer, usually the
                            same day. A copied-and-pasted job description gets
                            whatever it deserves.
                        </span>
                    </a>
                </Reveal>

                {/* Everywhere else, with handles shown rather than icons alone,
                    so the row is scannable by someone who wants to check a
                    profile before writing. */}
                <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4 md:mt-12 xl:mt-14">
                    {CHANNELS.map(({ href, label, handle, Icon }, i) => (
                        <Reveal
                            key={label}
                            delay={i * 0.05}
                            amount={0.2}
                            className="bg-background transition-colors duration-300 hover:bg-surface"
                        >
                            <a
                                href={href}
                                target={href.startsWith('http') ? '_blank' : undefined}
                                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="group/channel flex h-full items-start gap-4 p-6 md:p-7"
                            >
                                <Icon
                                    size={19}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0 text-faint transition-colors duration-300 group-hover/channel:text-foreground"
                                />
                                <span className="min-w-0">
                                    <span className="label-mono block">{label}</span>
                                    <span className="mt-1.5 block truncate text-[15px] text-foreground">
                                        {handle}
                                    </span>
                                </span>
                            </a>
                        </Reveal>
                    ))}

                    <Reveal
                        delay={0.15}
                        amount={0.2}
                        className="bg-background transition-colors duration-300 hover:bg-surface"
                    >
                        <a
                            href={RESUME_DOWNLOAD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/channel flex h-full items-start gap-4 p-6 md:p-7"
                        >
                            <Download
                                size={19}
                                strokeWidth={1.5}
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-faint transition-all duration-300 group-hover/channel:translate-y-0.5 group-hover/channel:text-foreground motion-reduce:transition-none"
                            />
                            <span className="min-w-0">
                                <span className="label-mono block">Résumé</span>
                                <span className="mt-1.5 block truncate text-[15px] text-foreground">
                                    PDF, one page
                                </span>
                            </span>
                        </a>
                    </Reveal>
                </div>

                {/* Hugging Face is here rather than in the grid above because it
                    is a profile worth having, not a channel to reach him on. */}
                <Reveal delay={0.1}>
                    <p className="mt-8 text-[15px] text-muted-foreground">
                        Models and datasets live on{' '}
                        <a
                            href={HUGGINGFACE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground underline decoration-border underline-offset-4 transition-colors duration-200 hover:decoration-foreground"
                        >
                            Hugging Face
                        </a>
                        .
                    </p>
                </Reveal>
            </Container>
        </Section>
    );
};

export default GetInTouch;
