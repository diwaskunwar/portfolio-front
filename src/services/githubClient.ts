/**
 * GitHub API Client - Direct implementation to replace backend dependency
 * Handles all GitHub API interactions directly from the frontend
 */

export interface GitHubConfig {
  token: string;
  username: string;
  org?: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  updated_at: string;
  created_at: string;
  topics: string[];
  is_fork: boolean;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export interface GitHubProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ActivityBreakdown {
  commits: { count: number; percentage: number };
  pull_requests: { count: number; percentage: number };
  issues: { count: number; percentage: number };
  code_reviews: { count: number; percentage: number };
}

export interface ContributionStats {
  total_contributions: number;
  activity_breakdown: ActivityBreakdown;
  contribution_calendar: ContributionDay[];
  monthly_contributions: {
    month: string;
    year: string;
    count: number;
  }[];
  contributed_repositories: {
    name: string;
    url: string;
    stars: number;
    language: string;
  }[];
}

export class GitHubClient {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private get headers() {
    return {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${this.config.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  private async fetchWithRetry<T>(url: string, options: RequestInit = {}, retries = 3): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(fullUrl, {
          ...options,
          headers: {
            ...this.headers,
            ...options.headers,
          },
        });

        if (!response.ok) {
          if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
            // Rate limit exceeded, wait and retry
            const resetTime = parseInt(response.headers.get('X-RateLimit-Reset') || '0') * 1000;
            const waitTime = Math.max(0, resetTime - Date.now()) + 1000; // Add 1 second buffer
            
            if (i < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          }
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  async getUserProfile(): Promise<GitHubProfile> {
    return this.fetchWithRetry<GitHubProfile>(`/users/${this.config.username}`);
  }

  async getRepositories(): Promise<GitHubRepo[]> {
    // Always fetch personal repositories only, not organization repos
    const endpoint = `/users/${this.config.username}/repos?sort=updated&per_page=100&type=owner`;

    const repos = await this.fetchWithRetry<any[]>(endpoint);
    
    const mappedRepos = repos.map(repo => ({
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || 'Unknown',
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      topics: repo.topics || [],
      is_fork: repo.fork || false,
      open_issues: repo.open_issues_count || 0,
      watchers: repo.watchers_count || 0,
      default_branch: repo.default_branch || 'main',
    }));
    
    console.log('githubClient: mapped repos', mappedRepos.length, 'repos');
    return mappedRepos;
  }

  async getTopRepositories(limit: number = 8): Promise<GitHubRepo[]> {
    const repos = await this.getRepositories();
    
    // Calculate how many repos to show from each category
    const pythonCount = Math.min(4, Math.floor(limit / 2));
    const otherCount = limit - pythonCount;

    // Sort all repositories by stars in descending order
    const sortedRepos = repos.sort((a, b) => b.stars - a.stars);

    // Filter Python repositories
    const pythonRepos = sortedRepos.filter(repo => 
      repo.language && repo.language.toLowerCase() === 'python'
    );
    const pythonResult = pythonRepos.slice(0, pythonCount);

    // Filter repositories of other languages (excluding Python and None)
    // Ensure we get distinct languages
    const otherLanguages = new Set<string>();
    const otherResult: GitHubRepo[] = [];

    for (const repo of sortedRepos) {
      if (repo.language && 
          repo.language.toLowerCase() !== 'python' && 
          !otherLanguages.has(repo.language) && 
          otherResult.length < otherCount) {
        otherLanguages.add(repo.language);
        otherResult.push(repo);
      }
    }

    return [...pythonResult, ...otherResult];
  }

  async getContributionStats(months: number = 12): Promise<ContributionStats> {
    const today = new Date();
    const daysToFetch = months * 30; // Approximate days in the requested months
    const startDate = new Date(today.getTime() - (daysToFetch * 24 * 60 * 60 * 1000));

    // Initialize day-wise and month-wise contribution counters
    const dayWiseContributions: Record<string, number> = {};
    const monthWiseContributions: Record<string, { name: string; count: number }> = {};

    // Initialize the requested months with zero counts
    for (let i = 0; i < months; i++) {
      const monthDate = new Date(today.getTime() - (30 * i * 24 * 60 * 60 * 1000));
      const monthKey = monthDate.toISOString().slice(0, 7); // YYYY-MM format
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
      monthWiseContributions[monthKey] = {
        name: monthName,
        count: 0
      };
    }

    // Initialize the days in the requested period with zero counts
    for (let i = 0; i < daysToFetch; i++) {
      const dayDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayKey = dayDate.toISOString().slice(0, 10); // YYYY-MM-DD format
      dayWiseContributions[dayKey] = 0;
    }

    // Get user events and repositories in parallel
    const [events, repos] = await Promise.all([
      this.fetchWithRetry<any[]>(`/users/${this.config.username}/events?per_page=100`),
      this.getRepositories()
    ]);

    // Get top repositories for commit data
    const topRepos = repos.sort((a, b) => b.stars - a.stars).slice(0, 5);

    // Fetch commits for each repository in parallel
    const commitPromises = topRepos.flatMap(repo => {
      // Always use username for personal repos, but contributions can include org work
      const owner = this.config.username;
      // Create tasks for each page of commits (up to 3 pages per repo to avoid rate limits)
      return Array.from({ length: 3 }, (_, page) => 
        this.fetchCommitsPage(owner, repo.name, page + 1, startDate)
      );
    });

    const commitResults = await Promise.allSettled(commitPromises);
    const allCommits = commitResults
      .filter((result): result is PromiseFulfilledResult<any[]> => result.status === 'fulfilled')
      .flatMap(result => result.value);

    // Count different types of contributions
    let commitCount = 0;
    let prCount = 0;
    let issueCount = 0;
    let reviewCount = 0;

    // Process commits and update day-wise and month-wise data
    for (const commit of allCommits) {
      if (commit?.commit?.author?.date) {
        const commitDate = new Date(commit.commit.author.date);

        // Only count commits from the requested period
        if (commitDate >= startDate) {
          commitCount++;

          // Update day-wise contributions
          const dayKey = commitDate.toISOString().slice(0, 10);
          if (dayKey in dayWiseContributions) {
            dayWiseContributions[dayKey]++;
          }

          // Update month-wise contributions
          const monthKey = commitDate.toISOString().slice(0, 7);
          if (monthKey in monthWiseContributions) {
            monthWiseContributions[monthKey].count++;
          }
        }
      }
    }

    // Count from events for PRs, issues, and reviews
    for (const event of events) {
      const eventType = event.type;
      const createdAt = event.created_at;

      if (createdAt) {
        const eventDate = new Date(createdAt);
        const dayKey = eventDate.toISOString().slice(0, 10);
        const monthKey = eventDate.toISOString().slice(0, 7);

        // Only count events from the requested period
        if (eventDate >= startDate) {
          let contributionValue = 0;

          if (eventType === 'PullRequestEvent') {
            prCount++;
            contributionValue = 1;
          } else if (eventType === 'IssuesEvent') {
            issueCount++;
            contributionValue = 1;
          } else if (eventType === 'PullRequestReviewEvent') {
            reviewCount++;
            contributionValue = 1;
          }

          // Update day-wise and month-wise contributions for non-commit events
          if (contributionValue > 0) {
            if (dayKey in dayWiseContributions) {
              dayWiseContributions[dayKey] += contributionValue;
            }

            if (monthKey in monthWiseContributions) {
              monthWiseContributions[monthKey].count += contributionValue;
            }
          }
        }
      }
    }

    // Get contributed repositories (simplified)
    const contributedRepos = repos.slice(0, 10).map(repo => ({
      name: repo.name,
      url: repo.url,
      stars: repo.stars,
      language: repo.language
    }));

    // Calculate total contributions
    const totalContributions = commitCount + prCount + issueCount + reviewCount;

    // Calculate percentages for the activity breakdown
    const total = Math.max(1, totalContributions); // Avoid division by zero
    const commitPercentage = Math.round((commitCount / total) * 100);
    const prPercentage = Math.round((prCount / total) * 100);
    const issuePercentage = Math.round((issueCount / total) * 100);
    const reviewPercentage = Math.round((reviewCount / total) * 100);

    // Convert day-wise contributions to a format suitable for the contribution graph
    const contributionCalendar: ContributionDay[] = Object.entries(dayWiseContributions)
      .map(([date, count]) => ({
        date,
        count,
        level: this.getContributionLevel(count)
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Convert month-wise contributions to a list sorted by date
    const monthlyContributions = Object.entries(monthWiseContributions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, data]) => ({
        month: data.name,
        year: monthKey.split('-')[0],
        count: data.count
      }));

    return {
      total_contributions: totalContributions,
      activity_breakdown: {
        commits: {
          count: commitCount,
          percentage: commitPercentage
        },
        pull_requests: {
          count: prCount,
          percentage: prPercentage
        },
        issues: {
          count: issueCount,
          percentage: issuePercentage
        },
        code_reviews: {
          count: reviewCount,
          percentage: reviewPercentage
        }
      },
      contribution_calendar: contributionCalendar,
      monthly_contributions: monthlyContributions,
      contributed_repositories: contributedRepos
    };
  }

  private async fetchCommitsPage(owner: string, repoName: string, page: number, sinceDate: Date): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        author: this.config.username,
        since: sinceDate.toISOString(),
        per_page: '100',
        page: page.toString()
      });

      const commits = await this.fetchWithRetry<any[]>(
        `/repos/${owner}/${repoName}/commits?${params}`
      );

      return Array.isArray(commits) ? commits : [];
    } catch (error) {
      console.warn(`Failed to fetch commits for ${owner}/${repoName} page ${page}:`, error);
      return [];
    }
  }

  private getContributionLevel(count: number): number {
    /**
     * Convert contribution count to a level (0-4) for the contribution graph
     * This matches GitHub's contribution graph levels:
     * - 0: No contributions
     * - 1: 1-3 contributions (light green)
     * - 2: 4-7 contributions (medium-light green)
     * - 3: 8-12 contributions (medium green)
     * - 4: 13+ contributions (dark green)
     */
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 7) return 2;
    if (count <= 12) return 3;
    return 4;
  }
}
