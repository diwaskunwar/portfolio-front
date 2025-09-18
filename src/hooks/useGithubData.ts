import { useState, useEffect, useReducer } from 'react';
import githubService from '@/services/githubService';
import { GitHubProfile, GitHubRepo, ContributionStats } from '@/types/github';
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

// Define the state interface
interface GithubState {
  profile: {
    data: GitHubProfile | null;
    loading: boolean;
    error: string | null;
  };
  repos: {
    data: GitHubRepo[] | null;
    loading: boolean;
    error: string | null;
  };
  contributions: {
    data: ContributionStats | null;
    loading: boolean;
    error: string | null;
  };
}

// Define action types
type GithubAction = 
  | { type: typeof FETCH_GITHUB_PROFILE_REQUEST }
  | { type: typeof FETCH_GITHUB_PROFILE_SUCCESS; payload: GitHubProfile }
  | { type: typeof FETCH_GITHUB_PROFILE_FAILURE; error: any }
  | { type: typeof FETCH_GITHUB_REPOS_REQUEST }
  | { type: typeof FETCH_GITHUB_REPOS_SUCCESS; payload: GitHubRepo[] }
  | { type: typeof FETCH_GITHUB_REPOS_FAILURE; error: any }
  | { type: typeof FETCH_GITHUB_CONTRIBUTIONS_REQUEST }
  | { type: typeof FETCH_GITHUB_CONTRIBUTIONS_SUCCESS; payload: ContributionStats }
  | { type: typeof FETCH_GITHUB_CONTRIBUTIONS_FAILURE; error: any };

// Initial state
const initialState: GithubState = {
  profile: {
    data: null,
    loading: false,
    error: null,
  },
  repos: {
    data: null,
    loading: false,
    error: null,
  },
  contributions: {
    data: null,
    loading: false,
    error: null,
  },
};

// Reducer function
const githubReducer = (state: GithubState, action: GithubAction): GithubState => {
  switch (action.type) {
    // Profile actions
    case FETCH_GITHUB_PROFILE_REQUEST:
      return {
        ...state,
        profile: {
          ...state.profile,
          loading: true,
          error: null,
        },
      };
    case FETCH_GITHUB_PROFILE_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case FETCH_GITHUB_PROFILE_FAILURE:
      return {
        ...state,
        profile: {
          ...state.profile,
          loading: false,
          error: action.error?.message || 'Failed to fetch GitHub profile',
        },
      };
    
    // Repos actions
    case FETCH_GITHUB_REPOS_REQUEST:
      return {
        ...state,
        repos: {
          ...state.repos,
          loading: true,
          error: null,
          // Don't clear data during loading to prevent flickering
        },
      };
    case FETCH_GITHUB_REPOS_SUCCESS:
      return {
        ...state,
        repos: {
          ...state.repos,
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case FETCH_GITHUB_REPOS_FAILURE:
      return {
        ...state,
        repos: {
          ...state.repos,
          loading: false,
          error: action.error?.message || 'Failed to fetch GitHub repositories',
        },
      };
    
    // Contributions actions
    case FETCH_GITHUB_CONTRIBUTIONS_REQUEST:
      return {
        ...state,
        contributions: {
          ...state.contributions,
          loading: true,
          error: null,
        },
      };
    case FETCH_GITHUB_CONTRIBUTIONS_SUCCESS:
      return {
        ...state,
        contributions: {
          ...state.contributions,
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case FETCH_GITHUB_CONTRIBUTIONS_FAILURE:
      return {
        ...state,
        contributions: {
          ...state.contributions,
          loading: false,
          error: action.error?.message || 'Failed to fetch GitHub contributions',
        },
      };
    
    default:
      return state;
  }
};

// Hook for GitHub data
export const useGithubData = (fetchOnMount: boolean = true) => {
  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Fetch GitHub profile
  const fetchProfile = async () => {
    try {
      await githubService.getProfile({ dispatch });
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
    }
  };

  // Fetch GitHub repositories
  const fetchRepos = async (includeDetails: boolean = true) => {
    try {
      await githubService.getRepos(includeDetails, { dispatch });
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
    }
  };

  // Fetch all GitHub repositories (sorted by Python first)
  const fetchAllRepos = async () => {
    try {
      console.log('useGithubData: fetchAllRepos called');
      await githubService.getAllRepos({ dispatch });
    } catch (error) {
      console.error('Error fetching all GitHub repositories:', error);
    }
  };

  // Fetch GitHub top repositories
  const fetchTopRepos = async (limit: number = 8) => {
    try {
      await githubService.getTopRepos(limit, { dispatch });
    } catch (error) {
      console.error('Error fetching top GitHub repositories:', error);
    }
  };

  // Fetch GitHub contributions
  const fetchContributions = async (months: number = 12) => {
    try {
      await githubService.getContributions(months, { dispatch });
    } catch (error) {
      console.error('Error fetching GitHub contributions:', error);
    }
  };

  // Fetch all GitHub data
  const fetchAllData = async () => {
    await Promise.all([
      fetchProfile(),
      fetchRepos(),
      fetchContributions()
    ]);
  };

  // Fetch data on mount if requested
  useEffect(() => {
    if (fetchOnMount) {
      fetchAllData();
    }
  }, [fetchOnMount]);

  return {
    ...state,
    fetchProfile,
    fetchRepos,
    fetchAllRepos,
    fetchTopRepos,
    fetchContributions,
    fetchAllData,
  };
};

export default useGithubData;
