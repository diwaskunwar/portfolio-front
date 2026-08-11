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

/* The full span of the work, not just the retrieval slice. Six items, so the
   strip divides evenly at two, three, and six columns with no ragged cell. */
const CAPABILITIES = [
  'Agentic AI',
  'LLM systems & RAG',
  'Training & finetuning',
  'Deployment & MLOps',
  'Latency & optimization',
  'Backend, frontend & CI/CD',
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
     the two things worth clicking, then the supporting range. */
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.08 },
    },
  };

  const item: Variants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  if (loading || !profileData) {
    return (
      <Section id="hero" className="pt-16 pb-10 md:pt-20">
        <Container className="w-full">
          {/* Skeleton mirrors the real layout so nothing shifts on load (CLS) */}
          <div className="skeleton h-4 w-full max-w-md rounded-full" />
          <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="space-y-6 lg:col-span-7">
              <div className="skeleton h-20 w-full max-w-xl rounded-md md:h-28" />
              <div className="skeleton h-20 w-full max-w-lg rounded-md md:h-28" />
              <div className="skeleton h-4 w-full max-w-md rounded-full" />
              <div className="flex gap-4 pt-4">
                <div className="skeleton h-12 w-40 rounded-full" />
                <div className="skeleton h-12 w-40 rounded-full" />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="skeleton aspect-square w-full max-w-[340px] rounded-lg" />
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
    <Section id="hero" className="pt-16 pb-10 md:pt-20">
      <Container className="w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate={booted ? 'show' : 'hidden'}
        >
          {/* ---------------- Masthead rule ---------------- */}
          <motion.div
            variants={item}
            className="flex items-baseline justify-between gap-6 border-b border-border pb-4"
          >
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-foreground sm:text-xs">
              AI / ML Engineer
            </span>
            <span className="label-mono truncate">
              {location?.replace(' District', '')}
            </span>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 items-start gap-10 md:mt-12 lg:grid-cols-12 lg:gap-16">
            {/* ---------------- Left: the message ---------------- */}
            <div className="lg:col-span-7">
              {/* Name, one word per line. Each letter rides up from behind its
                  own mask, so the name assembles rather than fading in. */}
              <h1
                aria-label={name}
                className="text-[clamp(2.75rem,9.5vw,6rem)] font-medium leading-[0.94] tracking-[-0.045em] text-foreground"
              >
                {name.split(' ').map((word, w, all) => (
                  <span key={`${word}-${w}`} className="block">
                    {word.split('').map((char, c) => (
                      <span
                        key={`${char}-${c}`}
                        aria-hidden="true"
                        className="inline-block overflow-hidden pb-[0.1em] align-bottom"
                      >
                        <motion.span
                          className="inline-block"
                          variants={{
                            hidden: reduceMotion ? { y: '0%' } : { y: '110%' },
                            show: {
                              y: '0%',
                              transition: {
                                duration: 0.85,
                                ease: EASE,
                                delay: reduceMotion ? 0 : c * 0.035 + w * 0.1,
                              },
                            },
                          }}
                        >
                          {char}
                        </motion.span>
                      </span>
                    ))}
                    {/* Real space between words, so the heading stays copyable */}
                    {w < all.length - 1 ? ' ' : null}
                  </span>
                ))}
              </h1>

              <motion.p
                variants={item}
                className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted-foreground md:mt-7 md:text-lg"
              >
                I build systems that solve real problems with AI and machine
                learning. Agents that plan and act, retrieval that cites its
                sources, models small enough to serve. Running today in
                education, legal, and pharmaceutical technology.
              </motion.p>

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
              className="relative mx-auto w-full max-w-[340px] lg:col-span-5 lg:ml-auto lg:mr-0"
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
            className="mt-12 flex items-center gap-3 border-t border-border pt-5 font-mono text-[12px] tracking-[0.02em] md:text-[13px]"
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

          <motion.ul
            variants={item}
            className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-6"
          >
            {CAPABILITIES.map((capability, i) => (
              <motion.li
                key={capability}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={booted ? { opacity: 1 } : undefined}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  delay: reduceMotion ? 0 : 0.9 + i * 0.06,
                }}
                className="group/cap flex items-start gap-3 bg-background p-4 transition-colors duration-300 hover:bg-surface md:p-5"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-faint transition-all duration-300 group-hover/cap:scale-150 group-hover/cap:bg-foreground"
                />
                <p className="font-mono text-[11.5px] uppercase leading-snug tracking-[0.08em] text-muted-foreground transition-colors duration-300 group-hover/cap:text-foreground">
                  {capability}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Hero;
