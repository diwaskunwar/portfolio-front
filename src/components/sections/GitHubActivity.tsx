import React, { memo, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, Star, GitFork } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import CommandLine from '@/components/common/CommandLine';
import Reveal, { TextReveal } from '@/components/common/Reveal';
import CountUp from '@/components/common/CountUp';
import ContributionsChart from './ContributionsChart';
import { useGithubData } from '@/hooks/useGithubData';
import { GITHUB_URL } from '@/lib/links';

const EASE = [0.16, 1, 0.3, 1] as const;

const GitHubActivity = () => {
  const { repos, fetchTopRepos } = useGithubData(false);
  const reduce = useReducedMotion();
  const requested = useRef(false);

  /* Public endpoints only, no credential. This section used to require a
     token that shipped in the bundle. */
  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    fetchTopRepos(6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topRepos = repos.data ?? [];

  /* Derived from what the public API actually returns. Nothing invented. */
  const totalStars = topRepos.reduce((sum, r) => sum + (r.stars ?? 0), 0);
  const totalForks = topRepos.reduce((sum, r) => sum + (r.forks ?? 0), 0);
  const languages = Array.from(
    new Set(topRepos.map((r) => r.language).filter(Boolean))
  );

  return (
    <Section id="github-activity" className="py-28 md:py-36">
      <Container className="w-full">
        <div className="mb-16 max-w-2xl">
          <CommandLine tone="prompt" className="mb-5">{'git shortlog -sn --all'}</CommandLine>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
            <TextReveal text="On GitHub" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Public repositories, pulled without a token.
            </p>
          </Reveal>
        </div>

        {/* Commit art. The calendar shape is real, the pattern is drawn. */}
        <Reveal className="mb-20" amount={0.15}>
          <div className="rounded-lg border border-border p-6 md:p-8">
            <ContributionsChart greeting="HELLO WORLD" />
            <p className="mt-6 border-t border-border pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Commit art, not real history
            </p>
          </div>
        </Reveal>

        {repos.loading && topRepos.length === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-lg" />
            ))}
          </div>
        )}

        {!repos.loading && repos.error && (
          <div className="rounded-lg border border-border p-10">
            <p className="text-muted-foreground">Could not reach GitHub just now.</p>
            <button
              onClick={() => fetchTopRepos(6)}
              className="mt-5 rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/35 hover:bg-surface-raised"
            >
              Try again
            </button>
          </div>
        )}

        {topRepos.length > 0 && (
          <>
            <div className="mb-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
              {[
                { label: 'Public repositories', value: topRepos.length, icon: Github },
                { label: 'Stars', value: totalStars, icon: Star },
                { label: 'Forks', value: totalForks, icon: GitFork },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : i * 0.07 }}
                  className="bg-background p-6"
                >
                  <stat.icon size={16} strokeWidth={1.5} className="text-muted-foreground" />
                  <p className="mt-4 font-mono text-3xl font-medium tracking-[-0.03em] text-foreground">
                    <CountUp to={stat.value} duration={1.2} />
                  </p>
                  <p className="label-mono mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {languages.length > 0 && (
              <Reveal className="mb-14">
                <ul className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <li
                      key={lang}
                      className="rounded-full border border-border px-4 py-2 font-mono text-[11px] tracking-[0.06em] text-muted-foreground"
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </>
        )}

        <Reveal>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition-opacity duration-200 hover:opacity-90 active:translate-y-px"
          >
            <Github size={17} strokeWidth={1.75} />
            View full profile
          </a>
        </Reveal>
      </Container>
    </Section>
  );
};

export default memo(GitHubActivity);
