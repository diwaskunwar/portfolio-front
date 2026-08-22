import { useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight, Download } from 'lucide-react';
import {
  RESUME_DOWNLOAD_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  HUGGINGFACE_URL,
  EMAIL_URL,
} from '@/lib/links';
import { useProfile } from '@/store/ProfileContext';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import BlockPortrait, { type PortraitPhase } from '@/components/effects/BlockPortrait';
import MagneticLink from '@/components/common/MagneticLink';
import Strike from '@/components/common/Strike';
import StatusTicker from '@/components/effects/StatusTicker';
import RenderTerminal from '@/components/effects/RenderTerminal';
import { useIsBooted } from '@/lib/bootState';
import { scrollToSection } from '@/lib/scrollToSection';

const PORTRAIT = '/diwas.webp';

const SOCIALS = [
  { href: GITHUB_URL, label: 'GitHub', Icon: Github },
  { href: LINKEDIN_URL, label: 'LinkedIn', Icon: Linkedin },
  { href: EMAIL_URL, label: 'Email', Icon: Mail },
] as const;

/* The full span of the work, not just the retrieval slice.

   Two registers per cell, because two different people read this page. An
   engineer scans the term and knows exactly what it means. A hiring manager
   or a founder reads the line under it and learns what it buys them. Neither
   has to decode the other's vocabulary. */
const CAPABILITIES = [
  {
    term: 'Agentic AI',
    plain: 'Software that plans a task, takes the steps, and reports back.',
  },
  {
    term: 'LLM systems & RAG',
    plain: 'Answers drawn from your own documents, with every source cited.',
  },
  {
    term: 'Training & finetuning',
    plain: 'Models taught your domain instead of guessing at it.',
  },
  {
    term: 'Deployment & MLOps',
    plain: 'Shipped, monitored, and kept running long after launch day.',
  },
  {
    term: 'Latency & cost',
    plain: 'Faster answers on smaller hardware, so the bill stays sane.',
  },
  {
    term: 'Backend, frontend & CI/CD',
    plain: 'The whole product around the model, not just the model.',
  },
] as const;

/* The five-second read, for someone deciding whether to keep scrolling.
   Plain counts, no vocabulary to learn. These are the same figures the
   shipped-work section derives from its own list — if a product is added
   there, update them here too. */
const PROOF = [
  { value: '6', label: 'platforms in production' },
  { value: '3', label: 'regulated industries' },
  { value: '4', label: 'live, open them yourself' },
] as const;

const REST_CLARITY = 0.7;
const HOVER_CLARITY = 0.9;

/* Carries the boot terminal's voice into the page. Real commands from the
   real stack, so a developer reads the working day rather than a tagline. */
const STATUS_LINES = [
  'git checkout -b feat/agentic-retrieval',
  'docker compose up -d --force-recreate inference',
  'kubectl rollout status deploy/hermes-orchestrator',
  'torchrun --nproc_per_node 2 finetune.py --bf16',
  'curl -s localhost:8000/health | jq .status',
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

const Hero = () => {
  const { profileData, loading } = useProfile();
  const reduceMotion = useReducedMotion();
  // Held back until the boot overlay starts lifting, otherwise this entrance
  // plays out of sight and the interface appears fully formed.
  const booted = useIsBooted();
  const portraitRef = useRef<HTMLDivElement>(null);
  const [renderPhase, setRenderPhase] = useState<PortraitPhase>('first');
  // The terminal logs the hover, so it needs it in React rather than only
  // as a CSS group-hover state.
  const [portraitHovered, setPortraitHovered] = useState(false);

  /* Entry stagger. Motivated by hierarchy: name, discipline, what he does,
     the two things worth clicking, then the supporting range.

     Deliberately brisk. The whole entrance lands inside a second, because a
     reader who came here to judge someone's work should be reading it, not
     waiting on a curtain. The earlier timing spent over two seconds before
     the paragraph was legible. */
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.05, delayChildren: 0.03 },
    },
  };

  const item: Variants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  if (loading || !profileData) {
    return (
      <Section
        id="hero"
        className="pt-7 pb-10 sm:pt-8 md:pt-10 md:pb-14 xl:pt-12 xl:pb-16"
      >
        <Container className="w-full">
          {/* Skeleton mirrors the real layout so nothing shifts on load (CLS).
              Its breakpoints have to track the real ones or the placeholder
              stacks at a width where the content does not, which is the shift
              it exists to prevent. */}
          <div className="skeleton h-4 w-full max-w-md rounded-full" />
          <div className="mt-8 grid grid-cols-1 gap-10 md:mt-12 md:grid-cols-12 md:gap-8 lg:gap-16">
            <div className="space-y-6 md:col-span-7">
              <div className="skeleton h-20 w-full max-w-xl rounded-md md:h-28" />
              <div className="skeleton h-20 w-full max-w-lg rounded-md md:h-28" />
              <div className="skeleton h-4 w-full max-w-md rounded-full" />
              <div className="flex gap-4 pt-4">
                <div className="skeleton h-12 w-40 rounded-full" />
                <div className="skeleton h-12 w-40 rounded-full" />
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="skeleton mx-auto aspect-square w-full max-w-[300px] rounded-lg xs:max-w-[340px] md:ml-auto md:mr-0 xl:max-w-[380px] 3xl:max-w-[420px]" />
            </div>
          </div>
          <div className="skeleton mt-16 h-20 w-full rounded-lg" />
        </Container>
      </Section>
    );
  }

  const { name, location } = profileData.profile;
  const current = profileData.experience?.companies?.[0];

  return (
    <Section
      id="hero"
      className="pt-7 pb-10 sm:pt-8 md:pt-10 md:pb-14 xl:pt-12 xl:pb-16"
    >
      <Container className="w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate={booted ? 'show' : 'hidden'}
        >
          {/* ---------------- Masthead rule ---------------- */}
          <motion.div
            variants={item}
            className="flex items-baseline justify-between gap-6 border-b border-border pb-4 pr-14 can-hover:md:pr-0"
          >
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-foreground sm:text-xs">
              AI / ML Engineer
            </span>
            <span className="label-mono truncate">
              {location?.replace(' District', '')}
            </span>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 items-start gap-10 md:mt-12 md:grid-cols-12 md:gap-8 lg:gap-16">
            {/* ---------------- Left: the message ---------------- */}
            <div className="md:col-span-7">
              {/* Name, one word per line, each riding up from behind its own
                  mask. This was per-letter, which cost about a second and a
                  half and, worse, put every letter into the parent's stagger
                  queue — the paragraph below was waiting on eleven slots that
                  had nothing to do with it. Per word reads the same and the
                  whole heading is standing in under half a second. */}
              <h1
                aria-label={name}
                className="text-[clamp(2.5rem,8.5vw,7rem)] font-medium leading-[0.94] tracking-[-0.045em] text-foreground"
              >
                {name.split(' ').map((word, w) => (
                  <span
                    key={`${word}-${w}`}
                    aria-hidden="true"
                    className="block overflow-hidden pb-[0.08em]"
                  >
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: reduceMotion ? { y: '0%' } : { y: '110%' },
                        show: {
                          y: '0%',
                          transition: {
                            duration: 0.62,
                            ease: EASE,
                            delay: reduceMotion ? 0 : w * 0.07,
                          },
                        },
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>

              {/* The hook. Same correction device as the footer credit, and
                  the one line on this page that needs no vocabulary at all:
                  words crossed out and replaced read identically to a
                  recruiter, a founder, and an engineer.

                  The joke and the argument are the same sentence: anyone can
                  say they code, the job is finishing something and keeping it
                  standing. Passed as a list because Strike takes one — more
                  verbs can be struck here later without touching anything but
                  this array. */}
              <motion.p
                variants={item}
                className="mt-4 text-[clamp(1.25rem,3.2vw,2rem)] font-medium leading-[1.15] tracking-[-0.03em] text-foreground md:mt-5"
              >
                I <Strike from={['code']} to="build" /> things that stay built.
              </motion.p>

              {/* Lead, in plain English on purpose. Non-technical readers
                  told me they could not tell what any of this was, and the
                  previous version opened with "agents that plan and act,
                  retrieval that cites every source" — true, and meaningless
                  to a founder or an HR lead. Three concrete pictures of what
                  the software actually does for someone, no vocabulary to
                  learn, then the count. The engineer's version follows it. */}
              <motion.p
                variants={item}
                className="mt-7 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground xs:text-base md:mt-9 md:text-lg 3xl:text-xl"
              >
                Software that answers legal questions straight from a national
                law archive and shows its sources, catches the wrong number in
                a drug filing before a regulator does, and teaches a language
                by listening. Six of them run inside real companies today.
              </motion.p>

              {/* The same sentence for the other reader. Demoted to a
                  footnote rather than removed: an engineer scanning for the
                  stack should still find it in two seconds. */}
              <motion.p
                variants={item}
                className="mt-3 max-w-[52ch] font-mono text-[12px] leading-relaxed text-faint md:text-[12.5px]"
              >
                Agentic orchestration, RAG with citations, finetuned and
                quantized models, deployed and kept alive.
              </motion.p>

              {/* The five-second read. Numbers first, so someone skimming
                  gets the scale of the work before any of the vocabulary. */}
              <motion.ul
                variants={item}
                className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2.5 sm:gap-x-6 md:mt-9 xl:gap-x-8"
              >
                {PROOF.map(({ value, label }) => (
                  <li key={label} className="flex items-baseline gap-2">
                    <span className="font-mono text-lg font-medium tracking-[-0.02em] text-foreground md:text-xl">
                      {value}
                    </span>
                    <span className="text-sm text-muted-foreground">{label}</span>
                  </li>
                ))}
              </motion.ul>

              {/* Actions */}
              <motion.div
                variants={item}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              >
                {/* Points at the journey, not the repositories: the story
                    starts there and the rest of the page follows from it. */}
                <MagneticLink
                  href="#professional-journey"
                  onClick={(e) => {
                    // The href stays for middle-click and copy-link, but the
                    // section mounts lazily, so a native anchor jump can miss.
                    if (scrollToSection('professional-journey')) e.preventDefault();
                  }}
                  className="group inline-flex items-center justify-center whitespace-nowrap rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground"
                >
                  Walk my journey
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </MagneticLink>

                <a
                  href={EMAIL_URL}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-foreground/35 hover:bg-surface-raised active:translate-y-px"
                >
                  Get in touch
                </a>

                {/* Tertiary on purpose: recruiters look for it, but it should
                    not compete with the two primary actions. */}
                <a
                  href={RESUME_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap px-2 py-3.5 text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  <Download
                    size={16}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none"
                  />
                  Résumé
                </a>
              </motion.div>

              <motion.div
                variants={item}
                className="mt-7 flex items-center gap-1 border-t border-border pt-5"
              >
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className="rounded-full p-2.5 text-muted-foreground transition-colors duration-200 hover:bg-surface-raised hover:text-foreground"
                  >
                    <Icon size={19} strokeWidth={1.5} />
                  </a>
                ))}
                <a
                  href={HUGGINGFACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hugging Face"
                  className="rounded-full p-2.5 opacity-60 grayscale transition-opacity duration-200 hover:opacity-100"
                >
                  <img src="/hf-logo.svg" alt="" aria-hidden="true" className="h-[19px] w-[19px]" />
                </a>
              </motion.div>
            </div>

            {/* ---------------- Right: portrait + readout ---------------- */}
            <motion.div
              variants={item}
              className="relative mx-auto w-full max-w-[300px] xs:max-w-[340px] md:col-span-5 md:ml-auto md:mr-0 xl:max-w-[380px] 3xl:max-w-[420px]"
            >
              {/* One hover region covering the image and its readout, so the
                  canvas and the CSS-driven meter respond to the same pointer. */}
              <div
                ref={portraitRef}
                className="group/portrait"
                onPointerEnter={() => setPortraitHovered(true)}
                onPointerLeave={() => setPortraitHovered(false)}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
                  {/* Held until the boot overlay lifts, so the blocks are seen
                      stacking rather than finishing behind the terminal. */}
                  <BlockPortrait
                    src={PORTRAIT}
                    alt={`Portrait of ${name}`}
                    restClarity={REST_CLARITY}
                    hoverClarity={HOVER_CLARITY}
                    play={booted}
                    hoverTarget={portraitRef}
                    onPhase={setRenderPhase}
                    className="h-full w-full"
                  />
                </div>

                <RenderTerminal phase={renderPhase} hovered={portraitHovered} />
              </div>

              {current && (
                <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-border pt-3.5">
                  <span className="label-mono shrink-0">Currently</span>
                  <p className="text-right text-sm leading-snug text-foreground">
                    {current.title}
                    <span className="mx-2 text-border">/</span>
                    <span className="text-muted-foreground">{current.name}</span>
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ---------------- Range of work ----------------
              Six cells across a hairline grid: the same spec-sheet motif the
              rest of the page uses, rather than a loose two-column list. */}
          {/* Live prompt. Decorative churn, so it is hidden from assistive
              tech: every line it types is stated as real text further down. */}
          <motion.div
            variants={item}
            aria-hidden="true"
            className="mt-10 flex items-center gap-3 border-t border-border pt-5 font-mono text-[11.5px] tracking-[0.02em] md:mt-12 md:text-[13px] xl:mt-16 3xl:text-[14px]"
          >
            <span className="shrink-0 select-none text-foreground/70">$</span>
            <StatusTicker
              lines={STATUS_LINES}
              play={booted}
              // The ticker types one command at a time, so this one does
              // truncate: a mid-type line reflowing the row would jitter.
              className="min-w-0 truncate text-muted-foreground"
            />
            <span
              className="h-[1em] w-[0.5em] shrink-0 animate-caret bg-foreground motion-reduce:hidden"
            />
          </motion.div>

          {/* Three columns rather than six. Six cells one term wide left no
              room for the plain-English line, and a lone uppercase label is
              only readable to someone who already knows the field. */}
          <motion.ul
            variants={item}
            className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
          >
            {CAPABILITIES.map(({ term, plain }, i) => (
              <motion.li
                key={term}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={booted ? { opacity: 1 } : undefined}
                transition={{
                  duration: 0.4,
                  ease: EASE,
                  delay: reduceMotion ? 0 : 0.4 + i * 0.04,
                }}
                className="group/cap flex items-start gap-3 bg-background p-4 transition-colors duration-300 hover:bg-surface xs:p-5 md:p-6 xl:p-7"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-faint transition-all duration-300 group-hover/cap:scale-150 group-hover/cap:bg-foreground"
                />
                <div className="min-w-0">
                  <p className="font-mono text-[11.5px] uppercase leading-snug tracking-[0.08em] text-muted-foreground transition-colors duration-300 group-hover/cap:text-foreground">
                    {term}
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-faint transition-colors duration-300 group-hover/cap:text-muted-foreground xs:text-[13.5px] 3xl:text-sm">
                    {plain}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Hero;
