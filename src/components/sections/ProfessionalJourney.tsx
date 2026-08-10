import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import Reveal, { TextReveal } from '@/components/common/Reveal';

interface Entry {
  kind: 'study' | 'work';
  /** Large chapter marker. Free text so an undated chapter is not invented. */
  year: string;
  title: string;
  org: string;
  location?: string;
  period: string;
  /** Aside, such as a promotion track or an overlap with study. */
  note?: string;
  current?: boolean;
  domains?: string[];
  description: string[];
  skills?: string[];
}

/* One chronological thread. Study and work are the same story: the first job
   started during the final year of the degree, so splitting them into
   separate sections broke the sequence in half. */
const ENTRIES: Entry[] = [
  {
    kind: 'study',
    year: 'Earlier',
    title: 'High School',
    org: 'Caspian Valley College, Kumaripati',
    location: 'Lalitpur, Nepal',
    period: 'Completed',
    description: ['Management with Computer Science. The first time code was on the timetable.'],
  },
  {
    kind: 'study',
    year: '2019',
    title: 'Bachelor in Computer Application',
    org: 'Kathmandu College of Technology, Tribhuvan University',
    location: 'Bhaktapur, Nepal',
    period: 'Sep 2019 - Jun 2024',
    description: [
      'Five years of computer applications, and the point where Python stopped being coursework and started being the tool.',
    ],
  },
  {
    kind: 'work',
    year: '2023',
    title: 'Data Science Intern',
    org: 'Inspiring Lab',
    location: 'Lalitpur, Nepal',
    period: 'Nov 2023 - Mar 2024',
    note: 'Began during the final year of the degree',
    domains: ['Data pipelines', 'Visualization'],
    description: [
      'Where the working half of the story starts, one year before graduating.',
      'Built automated ingestion and preprocessing pipelines to clean multi-source datasets, and dashboards to track what they produced.',
    ],
    skills: ['Python', 'Pandas', 'Selenium', 'Scrapy', 'FastAPI', 'Git'],
  },
  {
    kind: 'work',
    year: '2024',
    title: 'Machine Learning Engineer',
    org: 'Next AI',
    location: 'Kathmandu, Nepal',
    period: 'Jun 2024 - Mar 2026',
    note: 'Graduated and went full time. Trainee to L1 to L2',
    domains: ['EdTech', 'Legal tech', 'Agentic AI', 'Computer vision'],
    description: [
      'Architected production Agentic RAG pipelines on Qdrant hybrid vector search, improving retrieval precision by roughly 35% while cutting query latency.',
      'Ran the full lifecycle for 5+ domain LLMs: instruction tuning, benchmark evaluation, quantization, and deployment, for roughly 30% accuracy over baseline.',
      'Built ML microservices across 3+ enterprise deployments, reducing integration overhead by roughly 40%.',
    ],
    skills: [
      'PyTorch', 'Hugging Face', 'Finetuning', 'Quantization', 'Agentic RAG',
      'Qdrant', 'FastAPI', 'MongoDB', 'MinIO', 'CI/CD',
    ],
  },
  {
    kind: 'work',
    year: '2026',
    title: 'Senior AI Engineer',
    org: 'CantorDust',
    location: 'Kathmandu, Nepal',
    period: 'Apr 2026 to now',
    current: true,
    domains: ['Agentic AI', 'Open source AI', 'Pharmaceutical tech'],
    description: [
      'Architecting Hermes, an adaptive multi-agent orchestration framework that plans, delegates across sub-agents, executes dynamic tool calls, and reverse-engineers its own decision paths for auditability.',
      'Engineering the pharmaceutical AI infrastructure behind Dolpo: multi-agent reasoning for regulatory dossier compilation, compliance validation, and source-grounded calculation.',
    ],
    skills: [
      'Python', 'Hermes Agent', 'LangGraph', 'Multi-agent orchestration',
      'FastAPI', 'Kubernetes', 'Docker',
    ],
  },
];

const ProfessionalJourney = () => {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLOListElement>(null);

  /* The rail draws itself as the section passes. Storytelling: the line is
     the career, and it advances with the reader. Driven by motion values,
     so no React render happens on scroll. */
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 0.85', 'end 0.4'],
  });
  const railScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <Section id="professional-journey" className="py-24 md:py-36">
      <Container className="w-full">
        <div className="mb-16 max-w-2xl md:mb-20">
          <h2 className="text-[clamp(1.85rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
            <TextReveal text="How I got here" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              School, then a degree, then a job that started before the degree
              finished. One line, in order.
            </p>
          </Reveal>
        </div>

        <ol ref={railRef} className="relative pl-7 sm:pl-8 md:pl-16">
          {/* Static track */}
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-border" />
          {/* Progress line, scaled on the GPU */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px origin-top bg-foreground/60"
            style={{ scaleY: reduce ? 1 : railScale }}
          />

          {ENTRIES.map((entry) => {
            const Icon = entry.kind === 'study' ? GraduationCap : Briefcase;
            return (
              <Reveal
                as="li"
                key={`${entry.org}-${entry.year}`}
                y={40}
                amount={0.3}
                className="group relative pb-16 last:pb-0 md:pb-24"
              >
                {/* Node. Filled marks the present role; study chapters read as
                    outlined, so the two kinds are distinguishable at a glance. */}
                <span
                  aria-hidden="true"
                  className={[
                    'absolute top-2 h-2.5 w-2.5 rounded-full ring-4 ring-background transition-all duration-500',
                    '-left-[calc(1.75rem+5px)] sm:-left-[calc(2rem+5px)] md:-left-[calc(4rem+5px)]',
                    entry.current
                      ? 'bg-foreground'
                      : entry.kind === 'study'
                        ? 'border border-muted-foreground bg-background'
                        : 'bg-border group-hover:scale-125 group-hover:bg-muted-foreground',
                  ].join(' ')}
                />

                <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 md:mb-4">
                  <span className="font-mono text-[clamp(1.75rem,7vw,4rem)] font-medium leading-none tracking-[-0.04em] text-foreground/12">
                    {entry.year}
                  </span>
                  <span className="label-mono flex items-center gap-2">
                    <Icon size={13} strokeWidth={1.75} />
                    {entry.kind === 'study' ? 'Study' : 'Work'}
                  </span>
                  {entry.current && (
                    <span className="label-mono text-foreground/70">Now</span>
                  )}
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl md:text-[1.75rem]">
                    {entry.title}
                  </h3>
                  <span className="label-mono shrink-0 sm:text-right">{entry.period}</span>
                </div>

                <p className="mt-2 text-[15px] text-foreground/80 md:text-base">
                  {entry.org}
                  {entry.location && (
                    <>
                      <span className="mx-2 text-border">/</span>
                      <span className="text-muted-foreground">{entry.location}</span>
                    </>
                  )}
                </p>

                {entry.note && (
                  <p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground/70">
                    {entry.note}
                  </p>
                )}

                {entry.domains && (
                  <ul className="mt-5 flex flex-wrap items-center gap-2">
                    {entry.domains.map((domain) => (
                      <li
                        key={domain}
                        className="rounded-full bg-surface-raised px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75"
                      >
                        {domain}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 max-w-2xl space-y-3 md:mt-6">
                  {entry.description.map((line) => (
                    <p key={line} className="text-[15px] leading-relaxed text-muted-foreground md:text-base">
                      {line}
                    </p>
                  ))}
                </div>

                {entry.skills && (
                  <ul className="mt-6 flex flex-wrap gap-2 md:mt-7">
                    {entry.skills.map((skill, s) => (
                      <motion.li
                        key={skill}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.4, delay: reduce ? 0 : s * 0.035 }}
                        className="rounded-full border border-border px-3 py-1.5 font-mono text-[10px] tracking-[0.06em] text-muted-foreground transition-colors duration-200 hover:border-foreground/40 hover:text-foreground sm:text-[11px] sm:px-3.5"
                      >
                        {skill}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
};

export default ProfessionalJourney;
