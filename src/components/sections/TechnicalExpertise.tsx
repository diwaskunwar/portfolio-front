import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import Reveal, { TextReveal } from '@/components/common/Reveal';

interface Group {
  title: string;
  lead: string;
  skills: string[];
}

/* Grouped as on the resume. No proficiency percentages: the previous version
   invented them, and a self-assigned "95%" is not evidence of anything. */
const GROUPS: Group[] = [
  {
    title: 'Agentic AI & LLM systems',
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
    lead: 'The services around the model, which is where most of the work lives.',
    skills: [
      'Python',
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

const TechnicalExpertise = () => {
  const reduce = useReducedMotion();

  return (
    <Section id="technical-expertise" className="py-28 md:py-36">
      <Container className="w-full">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
            <TextReveal text="What I work with" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Grouped by the part of the system it belongs to.
            </p>
          </Reveal>
        </div>

        {/* Numbered rows rather than a card grid, so this reads differently
            from the shipped-work and domain sections. */}
        <div className="border-t border-border">
          {GROUPS.map((group, g) => (
            <Reveal
              as="div"
              key={group.title}
              amount={0.3}
              className="group border-b border-border py-10 md:py-12"
            >
              <div className="grid gap-6 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-5">
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-foreground md:text-2xl">
                    {group.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                    {group.lead}
                  </p>
                </div>

                {/* Each skill arrives on its own beat, so the group assembles
                    left to right instead of appearing as one block. */}
                <ul className="flex flex-wrap content-start gap-2 md:col-span-7">
                  {group.skills.map((skill, s) => (
                    <motion.li
                      key={skill}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.45,
                        ease: EASE,
                        delay: reduce ? 0 : s * 0.045 + g * 0.04,
                      }}
                      className="rounded-full border border-border px-4 py-2 font-mono text-[11px] tracking-[0.06em] text-muted-foreground transition-colors duration-200 hover:border-foreground/40 hover:text-foreground"
                    >
                      {skill}
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
