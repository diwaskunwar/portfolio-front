import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import Reveal, { TextReveal } from '@/components/common/Reveal';

interface Product {
  name: string;
  domain: string;
  summary: string;
  detail?: string;
  stack: string[];
  url?: string;
}

/* The three industries the work actually shipped into. */
const DOMAINS = [
  {
    name: 'Education',
    work: 'Multi-modal language learning and multi-domain assistants, combining ASR, TTS, and vision with adaptive generation.',
  },
  {
    name: 'Legal',
    work: 'Agentic legal retrieval grounded strictly in Nepali precedents, Acts, Regulations, and the Constitution.',
  },
  {
    name: 'Pharmaceutical',
    work: 'Regulatory dossier automation with compliance validation and source-grounded calculation.',
  },
] as const;

/* Products that reached real users, ordered by what they are proudest of.
   Distinct from the open source repositories further down the page. */
const FLAGSHIP: Product = {
  name: 'Dolpo',
  domain: 'Pharmaceutical',
  summary:
    'A multi-agent platform automating regulatory dossiers, with orchestrated sub-agents that plan multi-step execution paths and compile technical documentation.',
  detail:
    'Deterministic reverse-engineering verifies every numerical calculation against the original source specification, so compliance reports carry no hallucinated figures.',
  stack: ['Python', 'Hermes Agent', 'LLMs', 'FastAPI'],
  url: 'https://dolpo.ai/',
};

const MAJOR: Product[] = [
  {
    name: 'LEX',
    domain: 'Legal',
    summary:
      'Agentic legal retrieval answering strictly from Nepali precedents (Najir), Acts (Ain), Regulations (Niyamawali), and the Constitution (Sambidhan).',
    detail:
      'Auto-classification agents run multi-fact synthesis across legal corpora to return citation-verified answers.',
    stack: ['LangChain', 'Agentic RAG', 'Qdrant', 'LLMs'],
    url: 'https://lex.nextai.asia/',
  },
  {
    name: 'EKO',
    domain: 'Multi-domain',
    summary:
      'A conversational framework routing autonomously across CRM, healthcare, and e-commerce tools through dynamic tool calling.',
    detail:
      'Persistent state memory and real-time calls to action carry multi-turn workflows through to completion.',
    stack: ['LlamaIndex', 'Qdrant', 'FastAPI', 'Microservices'],
    url: 'https://eko.nextai.asia/',
  },
];

const SUPPORTING: Product[] = [
  {
    name: 'Napp',
    domain: 'Education',
    summary:
      'A multi-modal platform for low-resource language learning, combining real-time speech recognition, synthesis, and vision with adaptive quiz generation.',
    stack: ['LLMs', 'ASR', 'TTS', 'Computer vision'],
  },
  {
    name: 'AROMA',
    domain: 'Documents',
    summary:
      'High-throughput digitization ingesting unstructured document formats and emitting structured JSON through worker queues and webhooks.',
    stack: ['FastAPI', 'OCR', 'Redis', 'Webhooks'],
    url: 'https://aromav2.nextai.asia/',
  },
  {
    name: 'PP-Size Validation',
    domain: 'Computer vision',
    summary:
      'Edge-ready inspection of passport photo compliance across facial geometry, alignment, background, and lighting, with no third-party APIs.',
    stack: ['MediaPipe', 'OpenCV', 'Python'],
  },
];

const Card: React.FC<{ product: Product; featured?: boolean }> = ({ product, featured }) => {
  const Wrapper = product.url ? 'a' : 'div';

  return (
    <Wrapper
      {...(product.url
        ? { href: product.url, target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className={[
        'group relative flex h-full flex-col rounded-lg border border-border bg-surface/60 transition-colors duration-300',
        product.url ? 'hover:border-foreground/30 hover:bg-surface-raised' : '',
        featured ? 'p-8 md:p-12' : 'p-7 md:p-8',
      ].join(' ')}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="label-mono">{product.domain}</span>
        {product.url && (
          <ArrowUpRight
            size={18}
            strokeWidth={1.5}
            className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
          />
        )}
      </div>

      <h3
        className={[
          'font-medium tracking-[-0.025em] text-foreground',
          featured ? 'text-3xl md:text-5xl' : 'text-2xl',
        ].join(' ')}
      >
        {product.name}
      </h3>

      <p
        className={[
          'mt-4 leading-relaxed text-muted-foreground',
          featured ? 'max-w-2xl text-lg' : 'text-[15px]',
        ].join(' ')}
      >
        {product.summary}
      </p>

      {product.detail && (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground/70">
          {product.detail}
        </p>
      )}

      <ul className="mt-auto flex flex-wrap gap-2 pt-8">
        {product.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
          >
            {tech}
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

const ShippedWork = () => (
  <Section id="shipped-work" className="py-28 md:py-36">
    <Container className="w-full">
      <div className="mb-16 max-w-2xl">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
          <TextReveal text="What I have shipped" />
        </h2>
        <Reveal delay={0.15}>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Platforms built for real users in regulated, high-stakes domains.
          </p>
        </Reveal>
      </div>

      {/* The three industries, stated before the products that prove them. */}
      <div className="mb-20 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {DOMAINS.map((domain, i) => (
          <Reveal key={domain.name} delay={i * 0.08} className="bg-background p-6 md:p-8">
            <span className="label-mono">Shipped</span>
            <h3 className="mt-3 text-xl font-medium tracking-[-0.02em] text-foreground">
              {domain.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {domain.work}
            </p>
          </Reveal>
        ))}
      </div>

      {/* Rhythm: one flagship, then a pair, then a trio. Six items, six cells. */}
      <div className="space-y-5">
        <Reveal>
          <Card product={FLAGSHIP} featured />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {MAJOR.map((product, i) => (
            <Reveal key={product.name} delay={i * 0.08} className="h-full">
              <Card product={product} />
            </Reveal>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {SUPPORTING.map((product, i) => (
            <Reveal key={product.name} delay={i * 0.07} className="h-full">
              <Card product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </Container>
  </Section>
);

export default ShippedWork;
