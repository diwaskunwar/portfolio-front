import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { GraduationCap, Briefcase, GitBranch } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import CommandLine from '@/components/common/CommandLine';
import Reveal, { TextReveal } from '@/components/common/Reveal';

interface Entry {
  /** `detour` is the self-taught stretch: no institution, no employer. */
  kind: 'study' | 'work' | 'detour';
  /** Large chapter marker. Free text so an undated chapter is not invented. */
  year: string;
  title: string;
  org: string;
  location?: string;
  period: string;
  /** Aside, such as a promotion track or an overlap with study. */
  note?: string;
  /** The chapter as a developer would type it. Read before the prose is. */
  command: string;
  /** Prompt symbol. null where the chapter is source, not shell. */
  prefix?: string | null;
  current?: boolean;
  domains?: string[];
  description: string[];
  skills?: string[];
}

/* One chronological thread. Study, the self-taught detour, and work are the
   same story: the path ran through JavaScript and PHP before it reached
   Python, and the first job started during the final year of the degree.
   Splitting any of that into separate sections broke the sequence. */
const ENTRIES: Entry[] = [
  {
    kind: 'study',
    year: 'Earlier',
    title: 'High School',
    command: '10 CLS\n20 PRINT "HELLO, WORLD"\n30 GOTO 20\nRUN',
    prefix: null,
    org: 'Caspian Valley College, Kumaripati',
    location: 'Lalitpur, Nepal',
    period: 'Completed',
    description: [
      'Management with Computer Science. The first time code was on the timetable, and the first time it was more interesting than the timetable.',
    ],
  },
  {
    kind: 'study',
    year: '2019',
    title: 'Bachelor in Computer Application',
    command: 'git checkout -b bca-2019   # ran 5 years, not 4',
    org: 'Kathmandu College of Technology, Tribhuvan University',
    location: 'Bhaktapur, Nepal',
    period: 'Sep 2019 - Jun 2024',
    note: 'Five years, not four. COVID took the extra one',
    description: [
      'A four-year degree that ran to five, because the world closed halfway through it.',
      'Campus shut, lectures moved to a laptop, and the syllabus slowed to a crawl. What that actually bought was time, and most of what stuck got learned in it rather than in class.',
    ],
  },
  {
    kind: 'detour',
    year: '2020',
    title: 'Learning it in the wrong order',
    command: 'npm create vite@latest && php artisan serve',
    org: 'Self-taught, between lockdowns',
    period: '2020 - 2023',
    note: 'The part nobody puts on a resume',
    description: [
      'Nobody starts at machine learning. The first thing that worked was JavaScript, then React, because a page that changes the instant you click it is the fastest reward programming gives a beginner.',
      'PHP and Laravel came next, on the backend, where the reward is quieter and the bugs live a lot longer. That is where the habit of caring how a system actually runs came from.',
      'Python and AI/ML sat in the background the whole time. Borrowed notebooks, small models, no plan, and no idea it would become the job. It was just the tab that never got closed.',
    ],
    skills: ['JavaScript', 'React', 'PHP', 'Laravel', 'MySQL', 'Python'],
  },
  {
    kind: 'work',
    year: '2023',
    title: 'Data Science Intern',
    command: 'pip install pandas scrapy fastapi',
    org: 'Inspiring Lab',
    location: 'Lalitpur, Nepal',
    period: 'Nov 2023 - Mar 2024',
    note: 'Final year of the degree. The side interest became the job',
    domains: ['Data pipelines', 'Visualization'],
    description: [
      'The background tab turned into the discipline, one year before graduating.',
      'Built automated ingestion and preprocessing pipelines to clean multi-source datasets, and the dashboards that made their output legible to people who were never going to read a notebook.',
    ],
    skills: ['Python', 'Pandas', 'Selenium', 'Scrapy', 'FastAPI', 'Git'],
  },
  {
    kind: 'work',
    year: '2024',
    title: 'Machine Learning Engineer',
    command: 'python finetune.py --model domain-llm --quantize int8',
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
    command: 'hermes run --agents 6 --trace --reverse-engineer',
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

/* Icon and label per chapter type, so the three kinds are distinguishable
   without reading a word of the entry. */
const KIND = {
  study: { Icon: GraduationCap, kindLabel: 'Study' },
  work: { Icon: Briefcase, kindLabel: 'Work' },
  detour: { Icon: GitBranch, kindLabel: 'Detour' },
} as const;

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
          <CommandLine tone="prompt" className="mb-5">{'git log --reverse --oneline --author=diwas'}</CommandLine>
          <h2 className="text-[clamp(1.85rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
            <TextReveal text="How I got here" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              It did not start with Python. It started with a page that changed
              when you clicked it, went through PHP, took five years of degree
              instead of four, and only turned into machine learning at the
              end. One line, in the order it actually happened.
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
            const { Icon, kindLabel } = KIND[entry.kind];
            return (
              <Reveal
                as="li"
                key={`${entry.org}-${entry.year}`}
                y={40}
                amount={0.3}
                className="group relative pb-16 last:pb-0 md:pb-24"
              >
                {/* Node. Filled marks the present role, study chapters are
                    outlined, and the detour is a hollow ring, so the three
                    kinds are distinguishable before anything is read. */}
                <span
                  aria-hidden="true"
                  className={[
                    'absolute top-2 h-2.5 w-2.5 rounded-full ring-4 ring-background transition-all duration-500',
                    '-left-[calc(1.75rem+5px)] sm:-left-[calc(2rem+5px)] md:-left-[calc(4rem+5px)]',
                    entry.current
                      ? 'bg-foreground'
                      : entry.kind === 'study'
                        ? 'border border-muted-foreground bg-background'
                        : entry.kind === 'detour'
                          ? 'border border-dashed border-foreground/50 bg-background group-hover:rotate-45'
                          : 'bg-border group-hover:scale-125 group-hover:bg-muted-foreground',
                  ].join(' ')}
                />

                <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 md:mb-4">
                  {/* Chapter marker. Bright enough to read as a date, dim
                      enough that it stays behind the job title. */}
                  <span className="font-mono text-[clamp(1.75rem,7vw,4rem)] font-medium leading-none tracking-[-0.04em] text-foreground/35 transition-colors duration-500 group-hover:text-foreground/60">
                    {entry.year}
                  </span>
                  <span className="label-mono flex items-center gap-2">
                    <Icon size={13} strokeWidth={1.75} />
                    {kindLabel}
                  </span>
                  {entry.current && (
                    <span className="label-mono flex items-center gap-2 text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                      Now
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl md:text-[1.75rem]">
                    {entry.title}
                  </h3>
                  <span className="label-mono shrink-0 sm:text-right">{entry.period}</span>
                </div>

                <p className="mt-2 text-[15px] text-foreground md:text-base">
                  {entry.org}
                  {entry.location && (
                    <>
                      <span className="mx-2 text-border">/</span>
                      <span className="text-muted-foreground">{entry.location}</span>
                    </>
                  )}
                </p>

                {/* The chapter as a command. Reads faster than the prose and
                    says the same thing to anyone who has used a terminal. */}
                <CommandLine className="mt-4" prefix={entry.prefix}>
                  {entry.command}
                </CommandLine>

                {entry.note && (
                  <p className="mt-2.5 flex items-start gap-2.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                    <span aria-hidden="true" className="mt-[0.55em] h-px w-4 shrink-0 bg-faint" />
                    {entry.note}
                  </p>
                )}

                {entry.domains && (
                  <ul className="mt-5 flex flex-wrap items-center gap-2">
                    {entry.domains.map((domain) => (
                      <li
                        key={domain}
                        className="rounded-full bg-surface-raised px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
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
                        className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] text-muted-foreground transition-colors duration-200 hover:border-foreground/40 hover:text-foreground sm:px-3.5 sm:text-[12px]"
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
