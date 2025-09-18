import httpBase, { RequestOptions } from './httpBase';
import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  FETCH_GITHUB_PROFILE_REQUEST,
  FETCH_GITHUB_PROFILE_SUCCESS,
  FETCH_GITHUB_PROFILE_FAILURE,
  FETCH_GITHUB_REPOS_REQUEST,
  FETCH_GITHUB_REPOS_SUCCESS,
  FETCH_GITHUB_REPOS_FAILURE,
  FETCH_GITHUB_CONTRIBUTIONS_REQUEST,
  FETCH_GITHUB_CONTRIBUTIONS_SUCCESS,
  FETCH_GITHUB_CONTRIBUTIONS_FAILURE,
  FETCH_LINKEDIN_EXPERIENCE_REQUEST,
  FETCH_LINKEDIN_EXPERIENCE_SUCCESS,
  FETCH_LINKEDIN_EXPERIENCE_FAILURE,
  FETCH_LINKEDIN_EDUCATION_REQUEST,
  FETCH_LINKEDIN_EDUCATION_SUCCESS,
  FETCH_LINKEDIN_EDUCATION_FAILURE,
  FETCH_LINKEDIN_CERTIFICATES_REQUEST,
  FETCH_LINKEDIN_CERTIFICATES_SUCCESS,
  FETCH_LINKEDIN_CERTIFICATES_FAILURE,
  FETCH_LINKEDIN_SKILLS_REQUEST,
  FETCH_LINKEDIN_SKILLS_SUCCESS,
  FETCH_LINKEDIN_SKILLS_FAILURE
} from '@/types/actionTypes';
import { createApiActions } from '@/utils/dispatchUtils';

// Define interfaces for API responses
export interface ProfileData {
  profile: {
    name: string;
    headline: string;
    location: string;
    industry: string;
    summary: string;
    picture: string;
    publicIdentifier: string;
    address: string;
    birthDate: Record<string, unknown>;
    Urls: {
      name: string;
      url: string;
    }[];
    quote?: string;
  };
}

export interface GithubProfile {
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

export interface GithubRepo {
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

export interface GithubContribution {
  total_contributions: number;
  activity_breakdown: {
    commits: { count: number; percentage: number };
    pull_requests: { count: number; percentage: number };
    issues: { count: number; percentage: number };
    code_reviews: { count: number; percentage: number };
  };
  contribution_calendar: {
    date: string;
    count: number;
    level: number;
  }[];
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

export interface LinkedInExperience {
  companies: {
    name: string;
    title: string;
    duration: string;
    description: string;
    employmentType: string;
    location: string;
    skills: string[];
  }[];
}

export interface LinkedInEducation {
  schoolName: string;
  degreeName: string;
  fieldOfStudy: string;
  dateRange: string;
  description: string;
  logoUrl: string;
  schoolUrl: string;
  startDate: {
    month: number;
    year: number;
  };
  endDate: {
    month: number;
    year: number;
  };
}

export interface LinkedInCertificate {
  name: string;
  authority: string;
  url: string;
  credentialId: string;
  displaySource: string;
  issueDate: number;
  issueYear: number;
  formattedDate: string;
}

// Create API action creators
const profileActions = createApiActions<ProfileData>(
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE
);

const githubProfileActions = createApiActions<GithubProfile>(
  FETCH_GITHUB_PROFILE_REQUEST,
  FETCH_GITHUB_PROFILE_SUCCESS,
  FETCH_GITHUB_PROFILE_FAILURE
);

const githubReposActions = createApiActions<GithubRepo[]>(
  FETCH_GITHUB_REPOS_REQUEST,
  FETCH_GITHUB_REPOS_SUCCESS,
  FETCH_GITHUB_REPOS_FAILURE
);

const githubContributionsActions = createApiActions<GithubContribution>(
  FETCH_GITHUB_CONTRIBUTIONS_REQUEST,
  FETCH_GITHUB_CONTRIBUTIONS_SUCCESS,
  FETCH_GITHUB_CONTRIBUTIONS_FAILURE
);

const linkedinExperienceActions = createApiActions<LinkedInExperience>(
  FETCH_LINKEDIN_EXPERIENCE_REQUEST,
  FETCH_LINKEDIN_EXPERIENCE_SUCCESS,
  FETCH_LINKEDIN_EXPERIENCE_FAILURE
);

const linkedinEducationActions = createApiActions<LinkedInEducation[]>(
  FETCH_LINKEDIN_EDUCATION_REQUEST,
  FETCH_LINKEDIN_EDUCATION_SUCCESS,
  FETCH_LINKEDIN_EDUCATION_FAILURE
);

const linkedinCertificatesActions = createApiActions<LinkedInCertificate[]>(
  FETCH_LINKEDIN_CERTIFICATES_REQUEST,
  FETCH_LINKEDIN_CERTIFICATES_SUCCESS,
  FETCH_LINKEDIN_CERTIFICATES_FAILURE
);

const linkedinSkillsActions = createApiActions<string[]>(
  FETCH_LINKEDIN_SKILLS_REQUEST,
  FETCH_LINKEDIN_SKILLS_SUCCESS,
  FETCH_LINKEDIN_SKILLS_FAILURE
);

// API service methods
class ApiService {
  // Profile endpoints
  async getProfile(options?: RequestOptions<ProfileData>): Promise<ProfileData> {
    if (options?.dispatch) {
      options.dispatch(profileActions.request());
    }

    try {
      const res = await fetch('/response.json');
      const json = await res.json();
      const p = json.profile || {};
      const data: ProfileData = {
        profile: {
          name: p.name || '',
          headline: p.headline || '',
          location: p.location || '',
          industry: p.industry || '',
          summary: p.summary || '',
          picture: p.picture || '',
          publicIdentifier: p.publicIdentifier || '',
          address: p.address || '',
          birthDate: p.birthDate || {},
          Urls: Array.isArray(p.Urls) ? p.Urls : [],
          quote: p.quote,
        },
      };

      options?.dispatch?.(profileActions.success(data));
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      options?.dispatch?.(profileActions.failure(error));
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // GitHub endpoints
  async getGithubProfile(options?: RequestOptions<GithubProfile>): Promise<GithubProfile> {
    if (options?.dispatch) {
      options.dispatch(githubProfileActions.request());

      return httpBase.get<GithubProfile>('/github/profile', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubProfileActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubProfileActions.failure(error));
          options.onError?.(error);
        }
      });
    }

    return httpBase.get<GithubProfile>('/github/profile', undefined, undefined, options);
  }

  async getGithubRepos(includeDetails: boolean = true, options?: RequestOptions<GithubRepo[]>): Promise<GithubRepo[]> {
    if (options?.dispatch) {
      options.dispatch(githubReposActions.request());

      return httpBase.get<GithubRepo[]>('/github/repos', { include_details: includeDetails }, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubReposActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubReposActions.failure(error));
          options.onError?.(error);
        }
      });
    }

    return httpBase.get<GithubRepo[]>('/github/repos', { include_details: includeDetails }, undefined, options);
  }

  async getTopGithubRepos(limit: number = 8, options?: RequestOptions<GithubRepo[]>): Promise<GithubRepo[]> {
    if (options?.dispatch) {
      options.dispatch(githubReposActions.request());

      return httpBase.get<GithubRepo[]>('/github/top-repos', { limit }, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubReposActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubReposActions.failure(error));
          options.onError?.(error);
        }
      });
    }

    return httpBase.get<GithubRepo[]>('/github/top-repos', { limit }, undefined, options);
  }

  async getGithubContributions(months: number = 12, options?: RequestOptions<GithubContribution>): Promise<GithubContribution> {
    if (options?.dispatch) {
      options.dispatch(githubContributionsActions.request());

      return httpBase.get<GithubContribution>('/github/contributions', { months }, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubContributionsActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubContributionsActions.failure(error));
          options.onError?.(error);
        }
      });
    }

    return httpBase.get<GithubContribution>('/github/contributions', { months }, undefined, options);
  }

  // LinkedIn endpoints
  async getLinkedInExperience(options?: RequestOptions<LinkedInExperience>): Promise<LinkedInExperience> {
    if (options?.dispatch) {
      options.dispatch(linkedinExperienceActions.request());

      return httpBase.get<LinkedInExperience>('/linkedin/experience', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(linkedinExperienceActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(linkedinExperienceActions.failure(error));
          options.onError?.(error);
        }
      });
    }

    return httpBase.get<LinkedInExperience>('/linkedin/experience', undefined, undefined, options);
  }

  async getLinkedInEducation(options?: RequestOptions<LinkedInEducation[]>): Promise<LinkedInEducation[]> {
    if (options?.dispatch) {
      options.dispatch(linkedinEducationActions.request());

      return httpBase.get<LinkedInEducation[]>('/linkedin/education', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(linkedinEducationActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(linkedinEducationActions.failure(error));
          options.onError?.(error);
        }
      });
    }

    return httpBase.get<LinkedInEducation[]>('/linkedin/education', undefined, undefined, options);
  }

  async getLinkedInCertificates(options?: RequestOptions<LinkedInCertificate[]>): Promise<LinkedInCertificate[]> {
    if (options?.dispatch) {
      options.dispatch(linkedinCertificatesActions.request());

      return httpBase.get<LinkedInCertificate[]>('/linkedin/certificates/', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(linkedinCertificatesActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(linkedinCertificatesActions.failure(error));
          options.onError?.(error);
        }
      });
    }

    return httpBase.get<LinkedInCertificate[]>('/linkedin/certificates/', undefined, undefined, options);
  }

  async getLinkedInSkills(options?: RequestOptions<string[]>): Promise<string[]> {
    if (options?.dispatch) {
      options.dispatch(linkedinSkillsActions.request());

      return httpBase.get<string[]>('/linkedin/skills', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(linkedinSkillsActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(linkedinSkillsActions.failure(error));
          options.onError?.(error);
        }
      });
    }

    return httpBase.get<string[]>('/linkedin/skills', undefined, undefined, options);
  }

  async getCategorizedLinkedInSkills(options?: RequestOptions<Record<string, string[]>>): Promise<Record<string, string[]>> {
    return httpBase.get<Record<string, string[]>>('/linkedin/skills/categorized', undefined, undefined, options);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
