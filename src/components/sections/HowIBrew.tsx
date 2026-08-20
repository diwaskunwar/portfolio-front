import React from 'react';
import { ArrowRight } from 'lucide-react';
import { EMAIL_URL } from '@/lib/links';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import Reveal from '@/components/common/Reveal';

/**
 * The rest of the page argues that the work is real. This one argues that the
 * person is worth having in the room.
 *
 * Named Brew rather than Work on purpose — "work" is the one word this page
 * cannot afford to repeat as a section title when six others already orbit
 * it. Brew reads two ways at once: the Homebrew/apt sense (a formula, its
 * ingredients, what it depends on) and the literal one (something steeped
 * over time, not assembled in an afternoon). Both are true of a person.
 *
 * Positions, not adjectives. "Team player" and "detail oriented" are on every
 * CV ever written and carry no information; a stated position carries a cost,
 * which is what makes it believable. Each of these commits to something that
 * a different engineer would reasonably disagree with.
 */
interface Principle {
    /** Mono tag, so the grid can be scanned before it is read. */
    tag: string;
    /** The position. Short enough to land in one glance. */
    claim: string;
    /** What it costs, or where it came from. Never a restatement. */
    body: string;
}

const PRINCIPLES: Principle[] = [
    {
        tag: 'Handover',
        claim: 'If I am the only one who understands it, I built it wrong.',
        body: 'Code outlives whoever wrote it. I write for the person who inherits it — usually a colleague at 2am, occasionally me, having forgotten everything.',
    },
    {
        tag: 'Shipping',
        claim: 'A demo is not a product.',
        body: 'The interesting part starts after it works once: the retries, the rate limits, the case that only breaks on the last day of the month.',
    },
    {
        tag: 'Questions',
        claim: 'I ask the stupid question on day one.',
        body: 'Much cheaper than a confident wrong assumption discovered in month three. I have done both. Only one of them was cheap.',
    },
    {
        tag: 'Curiosity',
        claim: 'The unreasonable idea gets ten minutes.',
        body: 'Dolpo verifies every figure by reverse-engineering it against the source specification, because "the model is probably right" was never going to survive an audit.',
    },
    {
        tag: 'Definition of done',
        claim: 'Done means someone else is using it.',
        body: 'Not merged. Not deployed. Not demoed on a call. Someone outside the building opened it and got what they came for.',
    },
    {
        tag: 'Unglamorous',
        claim: 'Nobody thanks you for the runbook.',
        body: 'Right up until 2am on a Sunday, when they do. I write it anyway, and I keep it current, which is the part everyone skips.',
    },
];

const HowIBrew = () => (
    <Section id="how-i-brew" className="py-10 sm:py-12 md:py-14 xl:py-16">
        <Container className="w-full">
            {/* `brew info` asks a package manager what is inside a formula
                before you install it — dependencies, version, what it was
                built from. This is the same question about a person, and the
                pun runs both directions: Homebrew, or an actual pot of tea. */}
            <SectionHeader chapter="how-i-brew" command="brew info diwas" title="How I brew">
                Anyone can list the frameworks. Harder to tell from a CV whether
                someone is a pleasure to have on a team, and whether the thing
                they start is the thing they finish. Six ingredients, so you can
                decide before we ever speak.
            </SectionHeader>

            {/* Same hairline grid the rest of the page uses. Two registers per
                cell: the claim carries the weight, the line under it pays for
                the claim. */}
            <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {PRINCIPLES.map((principle, i) => (
                    <Reveal
                        key={principle.tag}
                        delay={i * 0.06}
                        amount={0.15}
                        className="group/principle flex flex-col bg-background p-6 transition-colors duration-500 hover:bg-surface md:p-8"
                    >
                        <span className="label-faint transition-colors duration-500 group-hover/principle:text-foreground">
                            {principle.tag}
                        </span>
                        <p className="mt-4 text-xl font-medium leading-[1.25] tracking-[-0.02em] text-foreground md:text-[1.375rem]">
                            {principle.claim}
                        </p>
                        <p className="mt-3.5 text-[15px] leading-relaxed text-muted-foreground">
                            {principle.body}
                        </p>
                    </Reveal>
                ))}
            </div>

            {/* The ask. The page has spent this long making a case; it should
                say what it wants rather than trailing off into a footer. */}
            <Reveal delay={0.1} className="mt-10 md:mt-12 xl:mt-14">
                <div className="flex flex-col gap-6 rounded-lg border border-border p-7 sm:flex-row sm:items-center sm:justify-between md:p-10">
                    <p className="max-w-xl text-lg leading-relaxed text-foreground md:text-xl">
                        If that sounds like someone you want on the team, the
                        quickest way to find out is to ask me something hard.
                        <span className="mt-2 block text-[15px] text-muted-foreground md:text-base">
                            I reply to everything, including the ones that go
                            nowhere.
                        </span>
                    </p>
                    <a
                        href={EMAIL_URL}
                        className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-transform duration-200 active:translate-y-px"
                    >
                        Ask me something hard
                        <ArrowRight
                            size={16}
                            strokeWidth={2}
                            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                    </a>
                </div>
            </Reveal>
        </Container>
    </Section>
);

export default HowIBrew;
