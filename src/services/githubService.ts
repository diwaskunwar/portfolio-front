import { RequestOptions } from './httpBase';
import { 
  GitHubClient, 
  GitHubRepo, 
  GitHubProfile, 
  ContributionStats 
} from './githubClient';
import { preprocessGitHubData, ProcessedGitHubData } from './githubProcessor';
import {
  FETCH_GITHUB_PROFILE_REQUEST,
  FETCH_GITHUB_PROFILE_SUCCESS,
  FETCH_GITHUB_PROFILE_FAILURE,
  FETCH_GITHUB_REPOS_REQUEST,
  FETCH_GITHUB_REPOS_SUCCESS,
  FETCH_GITHUB_REPOS_FAILURE,
  FETCH_GITHUB_CONTRIBUTIONS_REQUEST,
  FETCH_GITHUB_CONTRIBUTIONS_SUCCESS,
  FETCH_GITHUB_CONTRIBUTIONS_FAILURE
} from '@/types/actionTypes';
import { createApiActions } from '@/utils/dispatchUtils';

// Simple cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// Cache storage
const cache = new Map<string, CacheEntry<any>>();

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  PROFILE: 5 * 60 * 1000, // 5 minutes
  REPOS: 2 * 60 * 1000,   // 2 minutes
  CONTRIBUTIONS: 5 * 60 * 1000, // 5 minutes
};

// Cache utility functions
const getCacheKey = (type: string, params?: any): string => {
  return params ? `${type}_${JSON.stringify(params)}` : type;
};

const getCachedData = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
};

const setCachedData = <T>(key: string, data: T, ttl: number): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

// Create API action creators
const githubProfileActions = createApiActions<GitHubProfile>(
  FETCH_GITHUB_PROFILE_REQUEST,
  FETCH_GITHUB_PROFILE_SUCCESS,
  FETCH_GITHUB_PROFILE_FAILURE
);

const githubReposActions = createApiActions<GitHubRepo[]>(
  FETCH_GITHUB_REPOS_REQUEST,
  FETCH_GITHUB_REPOS_SUCCESS,
  FETCH_GITHUB_REPOS_FAILURE
);

const githubContributionsActions = createApiActions<ContributionStats>(
  FETCH_GITHUB_CONTRIBUTIONS_REQUEST,
  FETCH_GITHUB_CONTRIBUTIONS_SUCCESS,
  FETCH_GITHUB_CONTRIBUTIONS_FAILURE
);

// GitHub configuration - these should be set via environment variables
const getGitHubConfig = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const username = import.meta.env.VITE_GITHUB_USERNAME;
  const org = import.meta.env.VITE_GITHUB_ORG;

  if (!token || !username) {
    throw new Error('GitHub credentials not configured. Please set VITE_GITHUB_TOKEN and VITE_GITHUB_USERNAME in your environment variables.');
  }

  return { token, username, org };
};

// GitHub service class
class GithubService {
  private client: GitHubClient | null = null;

  private getClient(): GitHubClient {
    if (!this.client) {
      const config = getGitHubConfig();
      this.client = new GitHubClient(config);
    }
    return this.client;
  }

  // Get GitHub profile
  async getProfile(options?: RequestOptions<GitHubProfile>): Promise<GitHubProfile> {
    try {
      if (options?.dispatch) {
        options.dispatch(githubProfileActions.request());
      }

      // Check cache first
      const cacheKey = getCacheKey('profile');
      const cachedData = getCachedData<GitHubProfile>(cacheKey);
      if (cachedData) {
        if (options?.dispatch) {
          options.dispatch(githubProfileActions.success(cachedData));
        }
        return cachedData;
      }

      const client = this.getClient();
      const data = await client.getUserProfile();

      // Cache the result
      setCachedData(cacheKey, data, CACHE_TTL.PROFILE);

      if (options?.dispatch) {
        options.dispatch(githubProfileActions.success(data));
      }
      options?.onSuccess?.(data);
      
      return data;
    } catch (error) {
      if (options?.dispatch) {
        options.dispatch(githubProfileActions.failure(error));
      }
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get all GitHub repositories
  async getRepos(includeDetails: boolean = true, options?: RequestOptions<GitHubRepo[]>): Promise<GitHubRepo[]> {
    try {
      if (options?.dispatch) {
        options.dispatch(githubReposActions.request());
      }

      // Check cache first
      const cacheKey = getCacheKey('repos', { includeDetails });
      const cachedData = getCachedData<GitHubRepo[]>(cacheKey);
      if (cachedData) {
        if (options?.dispatch) {
          options.dispatch(githubReposActions.success(cachedData));
        }
        return cachedData;
      }

      const client = this.getClient();
      const data = await client.getRepositories();

      // Cache the result
      setCachedData(cacheKey, data, CACHE_TTL.REPOS);

      if (options?.dispatch) {
        options.dispatch(githubReposActions.success(data));
      }
      options?.onSuccess?.(data);
      
      return data;
    } catch (error) {
      if (options?.dispatch) {
        options.dispatch(githubReposActions.failure(error));
      }
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get top GitHub repositories
  async getTopRepos(limit: number = 8, options?: RequestOptions<GitHubRepo[]>): Promise<GitHubRepo[]> {
    try {
      if (options?.dispatch) {
        options.dispatch(githubReposActions.request());
      }

      // Check cache first
      const cacheKey = getCacheKey('topRepos', { limit });
      const cachedData = getCachedData<GitHubRepo[]>(cacheKey);
      if (cachedData) {
        if (options?.dispatch) {
          options.dispatch(githubReposActions.success(cachedData));
        }
        return cachedData;
      }

      const client = this.getClient();
      const data = await client.getTopRepositories(limit);

      // Cache the result
      setCachedData(cacheKey, data, CACHE_TTL.REPOS);

      if (options?.dispatch) {
        options.dispatch(githubReposActions.success(data));
      }
      options?.onSuccess?.(data);
      
      return data;
    } catch (error) {
      if (options?.dispatch) {
        options.dispatch(githubReposActions.failure(error));
      }
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get all repositories sorted by Python first
  async getAllRepos(options?: RequestOptions<GitHubRepo[]>): Promise<GitHubRepo[]> {
    try {
      console.log('githubService: getAllRepos called');
      if (options?.dispatch) {
        options.dispatch(githubReposActions.request());
      }

      // Check cache first
      const cacheKey = getCacheKey('allRepos');
      const cachedData = getCachedData<GitHubRepo[]>(cacheKey);
      if (cachedData) {
        console.log('githubService: returning cached data', cachedData.length, 'repos');
        if (options?.dispatch) {
          options.dispatch(githubReposActions.success(cachedData));
        }
        return cachedData;
      }

      const client = this.getClient();
      const repos = await client.getRepositories();
      console.log('githubService: fetched repos from API', repos.length, 'repos');
      
      // Sort by Python first and then others
      const sortedRepos = repos.sort((a, b) => {
        if (a.language === 'Python' && b.language !== 'Python') return -1;
        if (a.language !== 'Python' && b.language === 'Python') return 1;
        return 0;
      });

      console.log('githubService: sorted repos', sortedRepos.length, 'repos');

      // Cache the result
      setCachedData(cacheKey, sortedRepos, CACHE_TTL.REPOS);

      if (options?.dispatch) {
        options.dispatch(githubReposActions.success(sortedRepos));
      }
      options?.onSuccess?.(sortedRepos);
      
      return sortedRepos;
    } catch (error) {
      if (options?.dispatch) {
        options.dispatch(githubReposActions.failure(error));
      }
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get GitHub contributions
  async getContributions(months: number = 12, options?: RequestOptions<ContributionStats>): Promise<ContributionStats> {
    try {
      if (options?.dispatch) {
        options.dispatch(githubContributionsActions.request());
      }

      // Check cache first
      const cacheKey = getCacheKey('contributions', { months });
      const cachedData = getCachedData<ContributionStats>(cacheKey);
      if (cachedData) {
        if (options?.dispatch) {
          options.dispatch(githubContributionsActions.success(cachedData));
        }
        return cachedData;
      }

      const client = this.getClient();
      const data = await client.getContributionStats(months);

      // Cache the result
      setCachedData(cacheKey, data, CACHE_TTL.CONTRIBUTIONS);

      if (options?.dispatch) {
        options.dispatch(githubContributionsActions.success(data));
      }
      options?.onSuccess?.(data);
      
      return data;
    } catch (error) {
      if (options?.dispatch) {
        options.dispatch(githubContributionsActions.failure(error));
      }
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get recent GitHub contributions
  async getRecentContributions(months: number = 3, options?: RequestOptions<ContributionStats>): Promise<ContributionStats> {
    return this.getContributions(months, options);
  }

  // Get processed GitHub data for portfolio display
  async getPortfolioData(months: number = 3, options?: RequestOptions<ProcessedGitHubData>): Promise<ProcessedGitHubData> {
    try {
      const client = this.getClient();
      
      // Fetch all required data in parallel
      const [profile, repositories, contributions] = await Promise.all([
        client.getUserProfile().catch(() => null), // Allow profile to fail gracefully
        client.getRepositories(),
        client.getContributionStats(months)
      ]);

      // Process the combined data
      const processedData = preprocessGitHubData({
        profile: profile || undefined,
        repositories,
        contributions
      });

      options?.onSuccess?.(processedData);
      return processedData;
    } catch (error) {
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }
}

// Create and export a singleton instance
const githubService = new GithubService();
export default githubService;
