
import React, { memo } from 'react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Github, GitPullRequest, GitCommit, GitMerge, FileCode, Users, Star, ExternalLink } from 'lucide-react';
import ContributionsChart from './ContributionsChart';
import { useGithubData } from '@/hooks/useGithubData';

const GitHubActivity = () => {
  const { contributions, repos } = useGithubData(false);

  // Fallback defaults for ML Engineer profile
  const defaultBreakdown = {
    commits: { count: 342, percentage: 65, icon: GitCommit },
    pull_requests: { count: 48, percentage: 15, icon: GitPullRequest },
    issues: { count: 12, percentage: 10, icon: FileCode },
    code_reviews: { count: 24, percentage: 10, icon: Users }
  };

  const getStat = (path: string, fallback: number) => {
    const parts = path.split('.');
    let current: any = contributions.data;
    for (const part of parts) {
      if (current === undefined || current === null) return fallback;
      current = current[part];
    }
    return current || fallback;
  };

  // Stats for the breakdown
  const activityBreakdown = [
    { label: 'Commits', value: getStat('activity_breakdown.commits.count', defaultBreakdown.commits.count), percentage: getStat('activity_breakdown.commits.percentage', defaultBreakdown.commits.percentage), icon: GitCommit },
    { label: 'Pull Requests', value: getStat('activity_breakdown.pull_requests.count', defaultBreakdown.pull_requests.count), percentage: getStat('activity_breakdown.pull_requests.percentage', defaultBreakdown.pull_requests.percentage), icon: GitPullRequest },
    { label: 'Issues', value: getStat('activity_breakdown.issues.count', defaultBreakdown.issues.count), percentage: getStat('activity_breakdown.issues.percentage', defaultBreakdown.issues.percentage), icon: FileCode },
    { label: 'Code Reviews', value: getStat('activity_breakdown.code_reviews.count', defaultBreakdown.code_reviews.count), percentage: getStat('activity_breakdown.code_reviews.percentage', defaultBreakdown.code_reviews.percentage), icon: Users },
  ];

  return (
    <Section id="github-activity">
      <Container className="py-24 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.5em] text-white/80 uppercase mb-4 block font-light">Open Source Analytics</span>
          <h2 className="text-4xl md:text-6xl font-extralight text-white tracking-tighter mb-4">
            GitHub Activity
          </h2>
          <div className="w-24 h-px bg-white/40 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Main Contribution Matrix Card */}
          <Card className="bg-white/[0.03] backdrop-blur-md border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-white/5 pb-8">
                <div>
                  <h3 className="text-xl font-light text-white mb-1">GitHub Contributions</h3>
                  <p className="text-white text-xs tracking-widest uppercase">{getStat('total_contributions', 342)} contributions in the last year</p>
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                    <GitCommit size={14} className="text-white" />
                    <span className="text-xs text-white font-medium">{getStat('activity_breakdown.commits.count', defaultBreakdown.commits.count)} commits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitPullRequest size={14} className="text-white" />
                    <span className="text-xs text-white font-medium">{getStat('activity_breakdown.pull_requests.count', defaultBreakdown.pull_requests.count)} PRs</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto pb-4 custom-scrollbar">
                <ContributionsChart data={contributions.data?.contribution_calendar} />
              </div>

              {/* Activity Breakdown Section */}
              <div className="mt-20">
                <h4 className="text-[10px] tracking-[0.4em] text-white uppercase mb-8 font-bold">Activity Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                  {activityBreakdown.map((item, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-end mb-3">
                        <div className="flex items-center gap-3">
                          <item.icon size={14} className="text-white" />
                          <span className="text-xs tracking-[0.2em] uppercase text-white font-bold">{item.label}</span>
                        </div>
                        <span className="text-[10px] text-white font-bold">{item.percentage}%</span>
                      </div>
                      <div className="h-[2px] w-full bg-white/20 relative">
                        <div
                          className="absolute inset-0 bg-white group-hover:scale-y-150 transition-all duration-700"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recently Contributed Repositories */}
          <div className="space-y-8">
            <h4 className="text-[10px] tracking-[0.4em] text-white uppercase font-bold pl-4 border-l-2 border-white">Contributed Repositories</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(repos.data || []).slice(0, 4).map((repo: any, i: number) => (
                <Card key={i} className="bg-white/[0.05] border-white/20 hover:bg-white/[0.1] transition-all group rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="text-sm font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform">{repo.name}</h5>
                      <div className="flex items-center gap-1.5 text-white text-[10px] font-bold">
                        <Star size={10} fill="white" /> {repo.stargazers_count}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      <span className="text-[10px] uppercase tracking-widest text-white font-bold">{repo.language || 'Project'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => window.open('https://github.com/witcher9591', '_blank')}
              className="group flex items-center gap-3 px-10 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Github size={18} />
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase">View Full GitHub Profile</span>
              <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default memo(GitHubActivity);
