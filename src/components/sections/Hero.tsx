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
import BlockPortrait from '@/components/effects/BlockPortrait';
import MagneticLink from '@/components/common/MagneticLink';
import { useIsBooted } from '@/lib/bootState';
import { scrollToSection } from '@/lib/scrollToSection';

const PORTRAIT = '/diwas.webp';

const SOCIALS = [
  { href: GITHUB_URL, label: 'GitHub', Icon: Github },
  { href: LINKEDIN_URL, label: 'LinkedIn', Icon: Linkedin },
  { href: EMAIL_URL, label: 'Email', Icon: Mail },
] as const;

/* The full span of the work, not just the retrieval slice. */
const CAPABILITIES = [
  'Agentic AI',
  'LLM systems & RAG',
  'Training & finetuning',
  'Deployment & MLOps',
  'Latency & optimization',
  'Backend, frontend & CI/CD',
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

const Hero = () => {
  const { profileData, loading } = useProfile();
  const reduceMotion = useReducedMotion();
  // Held back until the boot overlay starts lifting, otherwise this entrance
  // plays out of sight and the interface appears fully formed.
  const booted = useIsBooted();

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
      <Section id="hero" fullHeight className="pt-24">
        <Container className="w-full">
          {/* Skeleton mirrors the real layout so nothing shifts on load (CLS) */}
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="space-y-6 lg:col-span-7">
              <div className="skeleton h-20 w-full max-w-xl rounded-md md:h-28" />
              <div className="skeleton h-4 w-52 rounded-full" />
              <div className="skeleton h-4 w-full max-w-md rounded-full" />
              <div className="skeleton h-4 w-2/3 max-w-sm rounded-full" />
              <div className="flex gap-4 pt-4">
                <div className="skeleton h-12 w-40 rounded-full" />
                <div className="skeleton h-12 w-40 rounded-full" />
              </div>
              <div className="skeleton h-20 w-full max-w-lg rounded-md" />
            </div>
            <div className="lg:col-span-5">
              <div className="skeleton aspect-square w-full max-w-[380px] rounded-lg" />
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  const { name, location } = profileData.profile;
  const current = profileData.experience?.companies?.[0];

  return (
    <Section id="hero" fullHeight className="pt-24">
      <Container className="w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate={booted ? 'show' : 'hidden'}
          className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20"
        >
          {/* ---------------- Left: the message ---------------- */}
          <div className="lg:col-span-7">
            {/* Name. Each letter rides up from behind its own mask, so the
                name assembles rather than simply fading in. */}
            <h1
              aria-label={name}
              className="text-[clamp(2.75rem,9vw,6.5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-foreground"
            >
              {name.split(' ').map((word, w, all) => (
                <span key={`${word}-${w}`}>
                <span className="inline-block">
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
                              delay: reduceMotion ? 0 : c * 0.035 + w * 0.08,
                            },
                          },
                        }}
                      >
                        {char}
                      </motion.span>
                    </span>
                  ))}
                </span>
                {/* Real space between words, so the heading stays copyable */}
                {w < all.length - 1 ? ' ' : null}
                </span>
              ))}
            </h1>

            <motion.p
              variants={item}
              className="mt-5 font-mono text-sm uppercase tracking-[0.28em] text-foreground/70"
            >
              AI / ML Engineer
            </motion.p>

            <motion.p
              variants={item}
              className="mt-8 max-w-[48ch] text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              I build systems that solve real problems with AI and machine
              learning. Multi-agent platforms shipped across education, legal,
              and pharmaceutical technology.
            </motion.p>

            {/* Actions */}
            <motion.div
              variants={item}
              className="mt-10 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
              </div>

              <div className="hidden h-8 w-px bg-border sm:block" />

              <div className="flex items-center gap-1">
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
                  className="rounded-full p-2.5 opacity-60 transition-opacity duration-200 hover:opacity-100 grayscale"
                >
                  <img src="/hf-logo.svg" alt="" aria-hidden="true" className="h-[19px] w-[19px]" />
                </a>
              </div>
            </motion.div>

            {/* Range of work. Hairline-grouped, no card chrome. */}
            <motion.ul
              variants={item}
              className="mt-12 grid max-w-xl grid-cols-2 gap-x-8 gap-y-3 border-t border-border pt-6 sm:grid-cols-3"
            >
              {CAPABILITIES.map((capability, i) => (
                <motion.li
                  key={capability}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                    delay: reduceMotion ? 0 : 0.9 + i * 0.07,
                  }}
                  className="cursor-default font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {capability}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ---------------- Right: portrait + current role ---------------- */}
          <motion.div
            variants={item}
            className="relative mx-auto w-full max-w-[380px] lg:col-span-5 lg:ml-auto lg:mr-0"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
              {/* Resolution is high enough that the photo reads as a photo,
                  while the gutters keep it visibly built out of pixels. */}
              <BlockPortrait
                src={PORTRAIT}
                alt={`Portrait of ${name}`}
                restCols={64}
                hoverCols={112}
                className="h-full w-full"
              />
            </div>

            <div className="mt-6 flex items-start justify-between gap-6 border-t border-border pt-5">
              {current && (
                <div>
                  <span className="label-mono">Currently</span>
                  <p className="mt-2 text-base leading-snug text-foreground">
                    {current.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{current.name}</p>
                </div>
              )}
              <div className="text-right">
                <span className="label-mono">Based in</span>
                <p className="mt-2 text-sm text-muted-foreground">
                  {location?.replace(' District', '')}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Hero;
