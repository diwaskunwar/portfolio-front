import httpBase, { RequestOptions } from './httpBase';
import {
  LinkedInExperience,
  LinkedInEducation,
  LinkedInCertificate
} from './apiService';
import {
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

// Create API action creators
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

// LinkedIn service class
class LinkedInService {
  // Get LinkedIn experience
  async getExperience(options?: RequestOptions<LinkedInExperience>): Promise<LinkedInExperience> {
    if (options?.dispatch) {
      options.dispatch(linkedinExperienceActions.request());
    }

    try {
      const res = await fetch('/response.json');
      const json = await res.json();
      const companies = (json.experience?.companies || []).map((c: any) => ({
        name: c.name,
        title: c.title,
        duration: c.dateRange ? `${c.dateRange.start?.month || ''}/${c.dateRange.start?.year || ''} - ${c.dateRange.end ? `${c.dateRange.end?.month}/${c.dateRange.end?.year}` : 'Present'}` : '',
        description: c.description || '',
        employmentType: c.employmentType || '',
        location: c.location || '',
        skills: c.skills || [],
      }));
      const data: LinkedInExperience = { companies };

      options?.dispatch?.(linkedinExperienceActions.success(data));
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      options?.dispatch?.(linkedinExperienceActions.failure(error));
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get LinkedIn education
  async getEducation(options?: RequestOptions<LinkedInEducation[]>): Promise<LinkedInEducation[]> {
    if (options?.dispatch) {
      options.dispatch(linkedinEducationActions.request());
    }

    try {
      const res = await fetch('/response.json');
      const json = await res.json();
      const data: LinkedInEducation[] = (json.education || []).map((e: any) => ({
        schoolName: e.schoolName,
        degreeName: e.degreeName,
        fieldOfStudy: e.fieldOfStudy,
        dateRange: `${e.dateRange?.start?.month || ''}/${e.dateRange?.start?.year || ''} - ${e.dateRange?.end ? `${e.dateRange.end?.month}/${e.dateRange.end?.year}` : 'Present'}`,
        description: e.description || '',
        logoUrl: e.schoolLogo || '',
        schoolUrl: e.schoolUrl || '',
        startDate: { month: e.dateRange?.start?.month || 0, year: e.dateRange?.start?.year || 0 },
        endDate: { month: e.dateRange?.end?.month || 0, year: e.dateRange?.end?.year || 0 },
      }));

      options?.dispatch?.(linkedinEducationActions.success(data));
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      options?.dispatch?.(linkedinEducationActions.failure(error));
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get LinkedIn certificates
  async getCertificates(options?: RequestOptions<LinkedInCertificate[]>): Promise<LinkedInCertificate[]> {
    if (options?.dispatch) {
      options.dispatch(linkedinCertificatesActions.request());
    }

    try {
      const res = await fetch('/response.json');
      const json = await res.json();
      const data: LinkedInCertificate[] = (json.certifications || []).map((c: any) => ({
        name: c.name,
        authority: c.authority,
        url: c.url,
        credentialId: c.credentialId || '',
        displaySource: c.displaySource || '',
        issueDate: c.issueDate?.month || 0,
        issueYear: c.issueDate?.year || 0,
        formattedDate: c.issueDate ? `${c.issueDate.month}/${c.issueDate.year}` : '',
      }));

      options?.dispatch?.(linkedinCertificatesActions.success(data));
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      options?.dispatch?.(linkedinCertificatesActions.failure(error));
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get LinkedIn skills
  async getSkills(options?: RequestOptions<string[]>): Promise<string[]> {
    if (options?.dispatch) {
      options.dispatch(linkedinSkillsActions.request());
    }

    try {
      const res = await fetch('/response.json');
      const json = await res.json();
      const data: string[] = json.skills || [];

      options?.dispatch?.(linkedinSkillsActions.success(data));
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      options?.dispatch?.(linkedinSkillsActions.failure(error));
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get categorized LinkedIn skills
  async getCategorizedSkills(options?: RequestOptions<Record<string, string[]>>): Promise<Record<string, string[]>> {
    try {
      const res = await fetch('/response.json');
      const json = await res.json();
      const data: Record<string, string[]> = json.categorizedSkills || {};
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Get all LinkedIn data
  async getAllData(options?: RequestOptions<any>): Promise<any> {
    try {
      const res = await fetch('/response.json');
      const json = await res.json();
      options?.onSuccess?.(json);
      return json;
    } catch (error) {
      options?.onError?.(error);
      throw error;
    } finally {
      options?.onFinally?.();
    }
  }

  // Check LinkedIn status
  async checkStatus(options?: RequestOptions<any>): Promise<any> {
    // For static JSON, return OK
    const data = { status: 'ok' };
    options?.onSuccess?.(data);
    return data;
  }

  // Refresh LinkedIn cookies
  async refreshCookies(options?: RequestOptions<any>): Promise<any> {
    // No-op in static mode
    const data = { refreshed: false };
    options?.onSuccess?.(data);
    return data;
  }
}

// Create and export a singleton instance
const linkedinService = new LinkedInService();
export default linkedinService;
