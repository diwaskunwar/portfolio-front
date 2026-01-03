import React, { useState, useEffect, useRef, useCallback, memo, lazy, Suspense } from 'react';
import { Code, Loader2, ArrowRight } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import RepositoryCard from '@/components/github/RepositoryCard';
import { GitHubRepo } from '@/types/github';
import { useGithubData } from '@/hooks/useGithubData';

// Lazy load the particle background for better performance
const ParticleBackground = lazy(() => import('@/components/effects/ParticleBackground'));

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
    <Section id="projects" className="relative overflow-hidden min-h-screen">
      <Container className="py-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-white uppercase mb-4 block font-bold">Portfolio</span>
          <h2 className="text-4xl md:text-6xl font-extralight mb-6 text-white tracking-tight">
            Projects
          </h2>
          <div className="w-24 h-px bg-white/40 mx-auto mb-6"></div>
          <p className="text-white/80 max-w-lg mx-auto text-base font-light">
            Open source work and personal projects
          </p>
        </div>

        {/* Minimal Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex border border-white/20 rounded-full backdrop-blur-sm overflow-hidden">
            <button
              onClick={() => setViewType('top')}
              className={`px-8 py-3 text-sm tracking-wider transition-all duration-300 font-bold ${viewType === 'top'
                ? 'bg-white text-black'
                : 'bg-transparent text-white/50 hover:text-white'
                }`}
            >
              FEATURED
            </button>
            <button
              onClick={() => setViewType('all')}
              className={`px-8 py-3 text-sm tracking-wider transition-all duration-300 font-bold ${viewType === 'all'
                ? 'bg-white text-black'
                : 'bg-transparent text-white/50 hover:text-white'
                }`}
            >
              ALL
            </button>
          </div>
        </div>

        {/* Loading */}
        {repos.loading && (!displayedRepos || displayedRepos.length === 0) && (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}

        {/* Error */}
        {repos.error && (
          <div className="text-center py-16">
            <p className="text-white/60 mb-6 text-sm font-medium">Unable to load repositories</p>
            <button onClick={fetchRepositories} className="text-white text-sm border-b border-white pb-1 hover:text-white/70 hover:border-white/70 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!repos.loading && !repos.error && (!displayedRepos || displayedRepos.length === 0) && (
          <div className="text-center py-16">
            <p className="text-white/60 text-sm font-medium">No repositories found</p>
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
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
              {viewType === 'top' && (
                <button
                  onClick={() => setViewType('all')}
                  className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm tracking-wider font-bold"
                >
                  VIEW ALL PROJECTS
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <a
                href="https://github.com/witcher9591"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black text-sm tracking-wider hover:bg-gray-200 transition-colors rounded-full"
              >
                <Code className="h-4 w-4" />
                GITHUB PROFILE
              </a>
            </div>
          </>
        )}
      </Container>
    </Section>
  );
};

export default memo(Projects);
