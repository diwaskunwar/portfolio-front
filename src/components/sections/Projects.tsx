import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Code, ArrowRight } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import RepositoryCard from '@/components/github/RepositoryCard';
import { GitHubRepo } from '@/types/github';
import { useGithubData } from '@/hooks/useGithubData';

const Projects = () => {
  const [viewType, setViewType] = useState<'top' | 'all'>('top');
  const { repos, fetchTopRepos, fetchAllRepos } = useGithubData(false);
  const [displayedRepos, setDisplayedRepos] = useState<GitHubRepo[]>([]);
  const initialFetchDoneRef = useRef<boolean>(false);
  const lastViewTypeRef = useRef<string>(viewType);

  const fetchRepositories = useCallback(() => {
    if (viewType === 'top') {
      fetchTopRepos(6);
    } else {
      fetchAllRepos();
    }
    lastViewTypeRef.current = viewType;
  }, [viewType, fetchTopRepos, fetchAllRepos]);

  useEffect(() => {
    if (!initialFetchDoneRef.current || lastViewTypeRef.current !== viewType) {
      fetchRepositories();
      initialFetchDoneRef.current = true;
    }
  }, [viewType, fetchRepositories]);

  useEffect(() => {
    if (repos.data) {
      setDisplayedRepos(repos.data);
    }
  }, [repos.data]);

  return (
    <Section id="projects" className="relative overflow-hidden py-28 md:py-36">
      <Container className="relative z-10 w-full">
        {/* Header. Distinct from "What I have shipped": this is the public
            repository trail, not the products that reached users. */}
        <div className="mb-14 max-w-2xl">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
            Open source
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Public repositories and things built for their own sake.
          </p>
        </div>

        <div className="mb-12 flex justify-start">
          <div className="inline-flex overflow-hidden rounded-full border border-border">
            <button
              onClick={() => setViewType('top')}
              className={`px-7 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 ${viewType === 'top'
                ? 'bg-foreground text-background'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Featured
            </button>
            <button
              onClick={() => setViewType('all')}
              className={`px-7 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 ${viewType === 'all'
                ? 'bg-foreground text-background'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Loading. Skeletons match the card grid, so nothing shifts on arrival. */}
        {repos.loading && (!displayedRepos || displayedRepos.length === 0) && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-44 rounded-lg" />
            ))}
          </div>
        )}

        {/* Error */}
        {repos.error && (
          <div className="rounded-lg border border-border p-10">
            <p className="text-muted-foreground">
              Could not reach GitHub just now.
            </p>
            <button
              onClick={fetchRepositories}
              className="mt-5 rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/35 hover:bg-surface-raised"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!repos.loading && !repos.error && (!displayedRepos || displayedRepos.length === 0) && (
          <div className="rounded-lg border border-border p-10">
            <p className="text-muted-foreground">
              No public repositories to show yet.
            </p>
          </div>
        )}

        {/* Grid */}
        {!repos.error && displayedRepos && displayedRepos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedRepos.map((repo, index) => (
                <RepositoryCard key={repo.name} repo={repo} index={index} />
              ))}
            </div>

            {/* Actions */}
            <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <a
                href="https://github.com/diwaskunwar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition-opacity duration-200 hover:opacity-90 active:translate-y-px"
              >
                <Code className="h-4 w-4" strokeWidth={1.75} />
                GitHub profile
              </a>

              {viewType === 'top' && (
                <button
                  onClick={() => setViewType('all')}
                  className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all repositories
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </button>
              )}
            </div>
          </>
        )}
      </Container>
    </Section>
  );
};

export default memo(Projects);
