import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code, Filter, Loader2 } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import RepositoryCard from '@/components/github/RepositoryCard';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { GitHubRepo } from '@/types/github';
import { useGithubData } from '@/hooks/useGithubData';

const Projects = () => {
  // State for view type (top or all)
  const [viewType, setViewType] = useState<'top' | 'all'>('top');

  // Get GitHub data from custom hook
  const { repos, fetchTopRepos, fetchAllRepos, fetchRepos } = useGithubData(false);

  // State for repositories to display
  const [displayedRepos, setDisplayedRepos] = useState<GitHubRepo[]>([]);

  // Track if initial fetch has been done
  const initialFetchDoneRef = useRef<boolean>(false);
  const lastViewTypeRef = useRef<string>(viewType);

  // Memoized fetch function to prevent infinite loops
  const fetchRepositories = useCallback(() => {
    console.log('Fetching repositories for viewType:', viewType);
    if (viewType === 'top') {
      fetchTopRepos(8);
    } else {
      fetchAllRepos();
    }
    lastViewTypeRef.current = viewType;
  }, [viewType, fetchTopRepos, fetchAllRepos]);

  // Initial fetch and fetch on view type change
  useEffect(() => {
    // Only fetch if view type changed or initial fetch hasn't been done
    if (!initialFetchDoneRef.current || lastViewTypeRef.current !== viewType) {
      fetchRepositories();
      initialFetchDoneRef.current = true;
    }
  }, [viewType, fetchRepositories]);

  // Update displayed repos when repos data changes
  useEffect(() => {
    console.log('Repos data changed:', repos.data);
    if (repos.data) {
      setDisplayedRepos(repos.data);
    }
  }, [repos.data]);

  return (
    <Section id="projects" className="bg-gray-900 text-white">
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Projects
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A showcase of my GitHub repositories and projects I've worked on
          </p>
        </motion.div>

        {/* Toggle between Top and All repositories */}
        <div className="flex justify-center mb-8">
          <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as 'top' | 'all')}>
            <ToggleGroupItem value="top" aria-label="Show top repositories" className="text-sm">
              Top Repositories
            </ToggleGroupItem>
            <ToggleGroupItem value="all" aria-label="Show all repositories" className="text-sm">
              All Repositories
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Loading state - only show if no data exists */}
        {repos.loading && (!displayedRepos || displayedRepos.length === 0) && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-400">Loading repositories...</span>
          </div>
        )}

        {/* Error state */}
        {repos.error && (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">Failed to load repositories: {repos.error}</p>
            <Button
              variant="outline"
              onClick={fetchRepositories}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* No repositories found state */}
        {!repos.loading && !repos.error && (!displayedRepos || displayedRepos.length === 0) && (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">No repositories found</p>
            <Button
              variant="outline"
              onClick={fetchRepositories}
            >
              Refresh
            </Button>
          </div>
        )}

        {/* Repositories grid */}
        {!repos.error && displayedRepos && displayedRepos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedRepos.map((repo, index) => (
                <RepositoryCard key={repo.name} repo={repo} index={index} />
              ))}
            </div>

            {/* View more button for top repositories */}
            {viewType === 'top' && displayedRepos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 text-center"
              >
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
                  onClick={() => setViewType('all')}
                >
                  View All Repositories
                </Button>
              </motion.div>
            )}

            {/* GitHub profile link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 text-center"
            >
              <Button
                variant="default"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                asChild
              >
                <a href="https://github.com/witcher9591" target="_blank" rel="noopener noreferrer">
                  <Code className="mr-2 h-4 w-4" />
                  View GitHub Profile
                </a>
              </Button>
            </motion.div>
          </>
        )}
      </Container>
    </Section>
  );
};

export default Projects;
