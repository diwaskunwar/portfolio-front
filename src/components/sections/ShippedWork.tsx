import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowUpRight, Layers } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import CommandLine from '@/components/common/CommandLine';
import Reveal from '@/components/common/Reveal';
import CountUp from '@/components/common/CountUp';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Product {
  name: string;
  domain: string;
  /** The company it was built inside. The point of the section. */
  org: string;
  summary: string;
  detail?: string;
  /** One factual line on what it actually handles in production. */
  scope: string;
  /** How it is actually run or reached. Legible to anyone with a shell. */
  command: string;
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
  command: 'docker compose up -d --force-recreate dolpo-api',
  domain: 'Pharmaceutical',
  org: 'CantorDust',
  summary:
    'A multi-agent platform automating regulatory dossiers, with orchestrated sub-agents that plan multi-step execution paths and compile technical documentation.',
  detail:
    'Deterministic reverse-engineering verifies every numerical calculation against the original source specification, so compliance reports carry no hallucinated figures.',
  scope: 'Regulatory dossiers, end to end, under audit',
  stack: ['Python', 'Hermes Agent', 'LLMs', 'FastAPI'],
  url: 'https://dolpo.ai/',
};

const MAJOR: Product[] = [
  {
    name: 'LEX',
    command: 'curl -s lex.nextai.asia/answer -d @najir.json',
    domain: 'Legal',
    org: 'Next AI',
    summary:
      'Agentic legal retrieval answering strictly from Nepali precedents (Najir), Acts (Ain), Regulations (Niyamawali), and the Constitution (Sambidhan).',
    detail:
      'Auto-classification agents run multi-fact synthesis across legal corpora to return citation-verified answers.',
    scope: 'National legal corpus, citation-verified answers',
    stack: ['LangChain', 'Agentic RAG', 'Qdrant', 'LLMs'],
    url: 'https://lex.nextai.asia/',
  },
  {
    name: 'EKO',
    command: 'kubectl scale deploy/eko-router --replicas 4',
    domain: 'Multi-domain',
    org: 'Next AI',
    summary:
      'A conversational framework routing autonomously across CRM, healthcare, and e-commerce tools through dynamic tool calling.',
    detail:
      'Persistent state memory and real-time calls to action carry multi-turn workflows through to completion.',
    scope: 'Real-time tool calling across live business systems',
    stack: ['LlamaIndex', 'Qdrant', 'FastAPI', 'Microservices'],
    url: 'https://eko.nextai.asia/',
  },
];

const SUPPORTING: Product[] = [
  {
    name: 'Napp',
    command: 'python -m asr.serve --stream --lang ne --tts',
    domain: 'Education',
    org: 'Next AI',
    summary:
      'A multi-modal platform for low-resource language learning, combining real-time speech recognition, synthesis, and vision with adaptive quiz generation.',
    scope:
      'Speech, vision and text in one real-time loop, shipped as the AI layer of a larger platform',
    stack: ['LLMs', 'ASR', 'TTS', 'Computer vision'],
  },
  {
    name: 'AROMA',
    command: 'celery -A aroma worker -Q ocr --concurrency 8',
    domain: 'Documents',
    org: 'Next AI',
    summary:
      'High-throughput digitization ingesting unstructured document formats and emitting structured JSON through worker queues and webhooks.',
    scope: 'Unstructured documents in, structured JSON out, at volume',
    stack: ['FastAPI', 'OCR', 'Redis', 'Webhooks'],
    url: 'https://aromav2.nextai.asia/',
  },
  {
    name: 'PP-Size Validation',
    command: 'python -m ppsize.validate --edge --no-remote',
    domain: 'Computer vision',
    org: 'Next AI',
    summary:
      'Edge-ready inspection of passport photo compliance across facial geometry, alignment, background, and lighting, with no third-party APIs.',
    scope:
      'Runs on the edge with no third-party API in the path, shipped inside a larger backend',
    stack: ['MediaPipe', 'OpenCV', 'Python'],
  },
];

const ALL: Product[] = [FLAGSHIP, ...MAJOR, ...SUPPORTING];

/* Counted, not asserted, so the header cannot drift from the list below it. */
const LIVE_COUNT = ALL.filter((product) => product.url).length;
const EMBEDDED_COUNT = ALL.length - LIVE_COUNT;
const ORG_COUNT = new Set(ALL.map((product) => product.org)).size;

const FACTS = [
  { value: ALL.length, label: 'Production platforms' },
  { value: LIVE_COUNT, label: 'Live at a public URL' },
  { value: DOMAINS.length, label: 'Regulated industries' },
  { value: ORG_COUNT, label: 'Companies shipped for' },
] as const;

/** Hostname alone, so the card can show proof without a full URL. */
const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, '');

/* Card entrance. The card lifts and settles, its contents run a beat behind
   it, so each one assembles instead of appearing whole. Built per card
   because siblings in a row cross the viewport on the same frame. */
const makeCardVariants = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: EASE,
      delay,
      staggerChildren: 0.05,
      delayChildren: delay + 0.16,
    },
  },
});

const partVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* The product name rides up from behind its own mask, which is the one piece
   of display type in the card and worth the extra beat. */
const titleVariants: Variants = {
  hidden: { y: '108%' },
  show: { y: '0%', transition: { duration: 0.8, ease: EASE } },
};

/* Drifting index numeral behind the flagship. Its own component so only the
   one card that shows it subscribes to scroll, and motion values carry the
   position, so no scroll frame ever reaches React. */
const Watermark: React.FC<{ target: React.RefObject<HTMLElement> }> = ({ target }) => {
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['22%', '-22%']);

  return (
    <motion.span
      aria-hidden="true"
      style={{ y }}
      className="pointer-events-none absolute -right-4 top-1/2 select-none font-mono text-[12rem] font-medium leading-none tracking-[-0.06em] text-foreground/[0.045] md:text-[18rem]"
    >
      01
    </motion.span>
  );
};

/** Serving traffic right now. The only looping animation on the page. */
const LiveTag: React.FC<{ host: string }> = ({ host }) => (
  <span className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.17em] text-foreground">
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-foreground animate-live-ping motion-reduce:hidden"
      />
      <span className="relative h-1.5 w-1.5 rounded-full bg-foreground" />
    </span>
    Live
    <span aria-hidden="true" className="h-3 w-px bg-border" />
    <span className="tracking-[0.06em] text-muted-foreground normal-case">{host}</span>
  </span>
);

const Card: React.FC<{
  product: Product;
  index: number;
  delay?: number;
  featured?: boolean;
}> = ({ product, index, delay = 0, featured }) => {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    // Always a div. The link is an overlay at the end of the card, so the
    // copy button inside can be a real button: interactive content is not
    // allowed inside an anchor, and nesting it there also swallowed the click.
    <motion.div
      ref={cardRef}
      variants={reduce ? undefined : makeCardVariants(delay)}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, amount: 0.2 }}
      // Lift is a spring rather than a duration: a card that answers the
      // cursor with a little weight feels physical, an eased one feels timed.
      whileHover={reduce || !product.url ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={[
        'group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface/60 transition-colors duration-300',
        product.url ? 'hover:border-foreground/30 hover:bg-surface-raised' : '',
        featured ? 'p-8 md:p-12' : 'p-7 md:p-8',
      ].join(' ')}
    >
      {/* Hairline that draws itself across the top edge on hover. Cheap,
          transform-only, and it gives the pointer something to answer to. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-foreground transition-transform duration-700 ease-swift group-hover:scale-x-100 motion-reduce:hidden"
      />

      {featured && !reduce && <Watermark target={cardRef} />}

      <motion.div
        variants={reduce ? undefined : partVariants}
        className="relative mb-5 flex items-start justify-between gap-4"
      >
        <span className="flex items-baseline gap-3">
          <span className="label-faint">{String(index).padStart(2, '0')}</span>
          <span className="label-mono">{product.domain}</span>
        </span>
        {product.url && (
          <ArrowUpRight
            size={18}
            strokeWidth={1.5}
            className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
          />
        )}
      </motion.div>

      {/* pb reserves room for descenders the mask would otherwise clip */}
      <span className="relative inline-block overflow-hidden pb-[0.08em]">
        <motion.h3
          variants={reduce ? undefined : titleVariants}
          className={[
            'font-medium tracking-[-0.025em] text-foreground',
            featured ? 'text-3xl md:text-5xl' : 'text-2xl',
          ].join(' ')}
        >
          {product.name}
        </motion.h3>
      </span>

      {/* Who it was built for, and whether it is serving traffic. This is the
          line that separates a shipped product from a weekend repository. */}
      <motion.div
        variants={reduce ? undefined : partVariants}
        className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"
      >
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.17em] text-muted-foreground">
          Built at {product.org}
        </span>
        {product.url ? (
          <>
            <span aria-hidden="true" className="h-3 w-px bg-border" />
            <LiveTag host={hostOf(product.url)} />
          </>
        ) : (
          <>
            <span aria-hidden="true" className="h-3 w-px bg-border" />
            {/* Not a lesser status. These went out as components of something
                bigger, which is why there is no address to point at. */}
            <span className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.17em] text-muted-foreground">
              <Layers size={12} strokeWidth={1.75} className="shrink-0" />
              Embedded subsystem
            </span>
          </>
        )}
      </motion.div>

      <motion.p
        variants={reduce ? undefined : partVariants}
        className={[
          'relative mt-5 leading-relaxed text-muted-foreground',
          featured ? 'max-w-2xl text-lg' : 'text-[15px]',
        ].join(' ')}
      >
        {product.summary}
      </motion.p>

      {product.detail && (
        <motion.p
          variants={reduce ? undefined : partVariants}
          className="relative mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground"
        >
          {product.detail}
        </motion.p>
      )}

      <motion.p
        variants={reduce ? undefined : partVariants}
        className="relative mt-6 flex items-start gap-3 border-t border-border pt-5 font-mono text-[11px] leading-relaxed tracking-[0.02em] text-muted-foreground"
      >
        <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-faint" />
        {product.scope}
      </motion.p>

      {/* How it is actually run. One line of shell says "this is deployed
          software" faster than a paragraph claiming the same thing. */}
      {/* z-10 lifts it clear of the card-wide link overlay below, so the
          copy button stays clickable while the rest of the card navigates. */}
      <motion.div
        variants={reduce ? undefined : partVariants}
        className="relative z-10 mt-4"
      >
        <CommandLine className="bg-background/60">{product.command}</CommandLine>
      </motion.div>

      <motion.ul
        variants={reduce ? undefined : partVariants}
        className="relative mt-auto flex flex-wrap gap-2 pt-6"
      >
        {product.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-300 group-hover:border-foreground/25 group-hover:text-foreground"
          >
            {tech}
          </li>
        ))}
      </motion.ul>

      {/* Last child, so it paints over everything before it and the whole
          card is clickable. The command block opts back out with z-10. */}
      {product.url && (
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 rounded-lg focus-visible:outline-offset-[-3px]"
        >
          <span className="sr-only">{`Open ${product.name} at ${hostOf(product.url)}`}</span>
        </a>
      )}
    </motion.div>
  );
};

const ShippedWork = () => (
  <Section id="shipped-work" className="py-10 sm:py-12 md:py-14 xl:py-16">
    <Container className="w-full">
      <SectionHeader
        chapter="shipped-work"
        command="docker ps --filter status=running"
        title="What I have shipped"
        wide
      >
        None of this is a side project. Every platform below was built inside a
        company, runs against real users in a regulated industry, and{' '}
        {LIVE_COUNT} of them are serving traffic at a public URL you can open
        right now.
      </SectionHeader>

      {/* The claim above, counted. Numbers derive from the list itself. */}
      <div className="mb-10 md:mb-12 xl:mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {FACTS.map((fact, i) => (
          <Reveal key={fact.label} delay={i * 0.07} className="bg-background p-6 md:p-7">
            <p className="font-mono text-4xl font-medium tracking-[-0.04em] text-foreground md:text-5xl">
              <CountUp to={fact.value} duration={1.1} />
            </p>
            <p className="label-mono mt-3">{fact.label}</p>
          </Reveal>
        ))}
      </div>

      {/* The three industries, stated before the products that prove them.
          Each cell lights on its own beat, left to right. */}
      <div className="mb-10 md:mb-12 xl:mb-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {DOMAINS.map((domain, i) => (
          <Reveal
            key={domain.name}
            delay={i * 0.1}
            className="group/domain relative overflow-hidden bg-background p-6 transition-colors duration-500 hover:bg-surface md:p-8"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-foreground transition-transform duration-700 ease-swift group-hover/domain:scale-x-100 motion-reduce:hidden"
            />
            <span className="label-mono">Shipped into</span>
            <h3 className="mt-3 text-xl font-medium tracking-[-0.02em] text-foreground">
              {domain.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {domain.work}
            </p>
          </Reveal>
        ))}
      </div>

      {/* Rhythm: one flagship, then a pair, then a trio. Six items, six cells.
          Index numbers run 01 to 06 straight through, so the three rows read
          as one sequence rather than three unrelated grids. */}
      <div className="space-y-4 md:space-y-5">
        <Card product={FLAGSHIP} index={1} featured />

        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          {MAJOR.map((product, i) => (
            <Card key={product.name} product={product} index={i + 2} delay={i * 0.1} />
          ))}
        </div>

        <div className="grid gap-4 md:gap-5 md:grid-cols-3">
          {SUPPORTING.map((product, i) => (
            <Card key={product.name} product={product} index={i + 4} delay={i * 0.09} />
          ))}
        </div>
      </div>

      {/* Says out loud why two cards have no link, so the missing address
          reads as context rather than as the weaker end of the list. */}
      <Reveal delay={0.1}>
        <p className="mt-10 flex max-w-3xl items-start gap-4 border-t border-border pt-6 text-[15px] leading-relaxed text-muted-foreground md:mt-12 xl:mt-14">
          <Layers
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className="mt-1 shrink-0 text-faint"
          />
          <span>
            {EMBEDDED_COUNT} of these carry no link. They shipped as AI
            subsystems inside larger products rather than as standalone
            services, and those products have since been renamed or folded into
            something else, so I am unable to get hold of them or keep track of
            where they ended up. Production work does not always leave a URL
            behind.
          </span>
        </p>
      </Reveal>
    </Container>
  </Section>
);

export default ShippedWork;
