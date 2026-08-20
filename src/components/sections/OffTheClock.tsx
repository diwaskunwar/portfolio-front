import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import Reveal from '@/components/common/Reveal';

interface Interest {
  name: string;
  /** Mono tag, so each row has a marker before the eye reaches the words. */
  tag: string;
  /** The straight line. */
  detail: string;
  /** The engineer's aside. Dry, not zany. */
  aside: string;
}

const INTERESTS: Interest[] = [
  {
    name: 'Football',
    tag: 'Multi-agent',
    detail: 'Ninety minutes, twenty two agents, no central orchestrator.',
    aside: 'Expected goals and actual goals are two very different distributions. The residuals are the fun part.',
  },
  {
    name: 'Travelling',
    tag: 'Exploration',
    detail: 'Mountains, mostly. Nepal makes that easy.',
    aside: 'High exploration rate, low exploitation. The view is worth the regret bound.',
  },
  {
    name: 'Movies',
    tag: 'Long context',
    detail: 'Long ones. Slow ones. Subtitles welcome.',
    aside: 'A three hour sequence model with no early stopping, and I am watching every epoch.',
  },
  {
    name: 'Music',
    tag: 'Overfitting',
    detail: 'Whatever is on while the training run finishes.',
    aside: 'My playlist is badly overfit. Forty tracks, zero generalization.',
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const OffTheClock = () => {
  const reduce = useReducedMotion();

  return (
    <Section id="off-the-clock" className="py-10 sm:py-12 md:py-14 xl:py-16">
      <Container className="w-full">
        <SectionHeader
          chapter="off-the-clock"
          command="sudo systemctl stop training.service"
          title="Away from the terminal"
        >
          A training run takes hours, and nobody improves it by watching the
          loss curve. This is where the rest of the time goes.
        </SectionHeader>

        {/* Hairline-divided rows rather than a card grid, so this section does
            not repeat the chip-and-node layout of the timeline above. The row
            fills and the name slides on hover, so the section has a pulse of
            its own instead of reading as a static list. */}
        <ul className="border-t border-border">
          {INTERESTS.map((interest, i) => (
            <Reveal
              as="li"
              key={interest.name}
              delay={i * 0.06}
              y={18}
              className="group relative overflow-hidden border-b border-border"
            >
              {/* Ground wipes in from the left on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-surface transition-transform duration-500 ease-swift group-hover:scale-x-100 motion-reduce:hidden"
              />

              <div className="relative grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:px-5">
                <div className="md:col-span-3">
                  <span className="label-faint transition-colors duration-300 group-hover:text-foreground">
                    {interest.tag}
                  </span>
                  <h3 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-foreground transition-transform duration-500 ease-swift group-hover:translate-x-1.5 motion-reduce:transition-none md:text-[1.75rem]">
                    {interest.name}
                  </h3>
                </div>

                <p className="text-base leading-relaxed text-foreground md:col-span-4">
                  {interest.detail}
                </p>

                {/* The joke sits in mono, visually marked as an aside. */}
                <motion.p
                  initial={reduce ? false : { opacity: 0.55 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex items-start gap-3 font-mono text-[13px] leading-relaxed text-muted-foreground md:col-span-5"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-px w-4 shrink-0 bg-faint transition-all duration-500 ease-swift group-hover:w-7 group-hover:bg-foreground"
                  />
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
