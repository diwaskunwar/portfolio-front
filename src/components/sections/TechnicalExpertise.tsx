import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import CommandLine from '@/components/common/CommandLine';
import Reveal, { TextReveal } from '@/components/common/Reveal';

interface Group {
  title: string;
  lead: string;
  /** The layer as it is actually driven from a shell. */
  command: string;
  skills: string[];
}

/* Grouped as on the resume. No proficiency percentages: the previous version
   invented them, and a self-assigned "95%" is not evidence of anything. */
const GROUPS: Group[] = [
  {
    title: 'Agentic AI & LLM systems',
    command: 'hermes run --plan --delegate --tools auto',
    lead: 'Planning, delegation, and tool use that holds together under real workloads.',
    skills: [
      'Multi-agent orchestration',
      'Self-learning agents',
      'Dynamic tool calling',
      'Reasoning pipelines',
      'Agentic RAG',
      'Stateful memory',
    ],
  },
  {
    title: 'Machine learning & vision',
    command: 'python -m torch.quantization.quantize_dynamic ckpt/',
    lead: 'Taking models from checkpoint to something small enough to serve.',
    skills: [
      'PyTorch',
      'Hugging Face',
      'Finetuning',
      'Quantization',
      'Model evaluation',
      'OpenCV',
      'MediaPipe',
    ],
  },
  {
    title: 'Backend & interfaces',
    command: 'uv sync && uvicorn app.main:app --workers 4',
    lead: 'The services around the model, which is where most of the work lives.',
    skills: [
      'Python',
      'uv',
      'FastAPI',
      'Django',
      'React',
      'RESTful APIs',
      'Microservices',
      'System design',
    ],
  },
  {
    title: 'Data, search & storage',
    command: 'qdrant-cli collection info career --hybrid',
    lead: 'Where the vectors, the records, and the raw files actually sit.',
    skills: [
      'Qdrant',
      'FAISS',
      'MongoDB',
      'PostgreSQL',
      'SQL',
      'Redis',
      'MinIO',
      'SeaweedFS',
    ],
  },
  {
    title: 'Pipelines & messaging',
    command: 'rabbitmqctl list_queues name messages consumers',
    lead: 'Moving work between services without losing any of it.',
    skills: [
      'RabbitMQ',
      'DAG pipelines',
      'Distributed task execution',
      'Queue workers',
      'Webhooks',
    ],
  },
  {
    title: 'Infrastructure & operations',
    command: 'kubectl get pods -o wide --watch',
    lead: 'Shipping it, scheduling the GPUs, and keeping the processes alive.',
    skills: [
      'Docker',
      'Kubernetes',
      'Jenkins',
      'Woodpecker',
      'CI/CD',
      'GPU allocation & scaling',
      'Ubuntu',
      'CentOS',
      'systemctl',
      'supervisorctl',
      'Git',
    ],
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/* Counted rather than written down, so the number cannot drift out of sync
   with the list the moment something is added. */
const TOTAL = GROUPS.reduce((sum, group) => sum + group.skills.length, 0);

const TechnicalExpertise = () => {
  const reduce = useReducedMotion();

  return (
    <Section id="technical-expertise" className="py-28 md:py-36">
      <Container className="w-full">
        <div className="mb-16 max-w-2xl">
          <CommandLine tone="prompt" className="mb-5">{'uv pip list && which docker kubectl'}</CommandLine>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
            <TextReveal text="What I work with" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Grouped by the part of the system it belongs to. Six layers,{' '}
              {TOTAL} things.
            </p>
          </Reveal>
        </div>

        {/* Numbered rows, and each group's tools set as a ruled column list
            rather than wrapped pills. Forty-odd chips in a ragged flow are a
            wall; ruled rows in aligned columns can be read down. */}
        <div className="border-t border-border">
          {GROUPS.map((group, g) => (
            <Reveal
              as="div"
              key={group.title}
              amount={0.2}
              className="group border-b border-border py-10 md:py-14"
            >
              <div className="grid gap-6 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-3">
                    <span className="label-faint transition-colors duration-500 group-hover:text-foreground">
                      {String(g + 1).padStart(2, '0')}
                    </span>
                    <span className="label-faint">
                      {group.skills.length} tools
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.02em] text-foreground md:text-2xl">
                    {group.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                    {group.lead}
                  </p>
                  <CommandLine className="mt-4">{group.command}</CommandLine>
                </div>

                {/* Each entry arrives on its own beat, so the group fills in
                    rather than appearing as one block. */}
                <ul className="grid content-start gap-x-10 sm:grid-cols-2 md:col-span-8 lg:grid-cols-3">
                  {group.skills.map((skill, s) => (
                    <motion.li
                      key={skill}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        duration: 0.45,
                        ease: EASE,
                        delay: reduce ? 0 : s * 0.04,
                      }}
                      // Every row keeps its rule. In a multi-column grid the
                      // last DOM child is not the last row on screen, so
                      // stripping it there leaves one arbitrary gap.
                      className="group/skill flex items-center gap-3 border-b border-border py-2.5"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 rounded-full bg-faint transition-all duration-300 group-hover/skill:scale-150 group-hover/skill:bg-foreground"
                      />
                      <span className="font-mono text-[12px] leading-snug tracking-[0.02em] text-muted-foreground transition-colors duration-200 group-hover/skill:text-foreground">
                        {skill}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default TechnicalExpertise;
