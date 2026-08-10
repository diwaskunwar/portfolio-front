import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import Reveal, { TextReveal } from '@/components/common/Reveal';

interface Interest {
  name: string;
  /** The straight line. */
  detail: string;
  /** The engineer's aside. Dry, not zany. */
  aside: string;
}

const INTERESTS: Interest[] = [
  {
    name: 'Football',
    detail: 'Ninety minutes, twenty two agents, no central orchestrator.',
    aside: 'Expected goals and actual goals are two very different distributions. The residuals are the fun part.',
  },
  {
    name: 'Travelling',
    detail: 'Mountains, mostly. Nepal makes that easy.',
    aside: 'High exploration rate, low exploitation. The view is worth the regret bound.',
  },
  {
    name: 'Movies',
    detail: 'Long ones. Slow ones. Subtitles welcome.',
    aside: 'A three hour sequence model with no early stopping, and I am watching every epoch.',
  },
  {
    name: 'Music',
    detail: 'Whatever is on while the training run finishes.',
    aside: 'My playlist is badly overfit. Forty tracks, zero generalization.',
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const OffTheClock = () => {
  const reduce = useReducedMotion();

  return (
    <Section id="off-the-clock" className="py-28 md:py-36">
      <Container className="w-full">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
            <TextReveal text="Away from the terminal" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              The models train on their own schedule. Here is what fills the gap.
            </p>
          </Reveal>
        </div>

        {/* Hairline-divided rows rather than a card grid, so this section does
            not repeat the chip-and-node layout of the timeline above. */}
        <ul className="border-t border-border">
          {INTERESTS.map((interest, i) => (
            <Reveal
              as="li"
              key={interest.name}
              delay={i * 0.06}
              y={18}
              className="group border-b border-border"
            >
              <div className="grid gap-2 py-8 md:grid-cols-12 md:items-baseline md:gap-8">
                <h3 className="text-2xl font-medium tracking-[-0.02em] text-foreground md:col-span-3 md:text-[1.75rem]">
                  {interest.name}
                </h3>

                <p className="text-base leading-relaxed text-foreground/80 md:col-span-4">
                  {interest.detail}
                </p>

                {/* The joke sits in mono, visually marked as an aside. */}
                <motion.p
                  initial={reduce ? false : { opacity: 0.55 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="font-mono text-[13px] leading-relaxed text-muted-foreground md:col-span-5"
                >
                  {interest.aside}
                </motion.p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
};

export default OffTheClock;
