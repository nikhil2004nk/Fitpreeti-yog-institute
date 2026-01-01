import { apiRequest, apiRequestWithRefresh } from './api';

// Institute Info Types
export interface InstituteInfo {
  id: string;
  location: string;
  phone_numbers: string[];
  email: string;
  social_media: {
    instagram?: string | null;
    facebook?: string | null;
    youtube?: string | null;
    whatsapp?: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface UpdateInstituteInfoData {
  location: string;
  phone_numbers: string[];
  email: string;
  social_media?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

// Content Section Types
export interface ContentSection {
  id: string;
  section_key: string;
  content: Record<string, any>;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContentSectionData {
  section_key: string;
  content: Record<string, any>;
  order: number;
  is_active?: boolean;
}

export interface UpdateContentSectionData {
  section_key?: string;
  content?: Record<string, any>;
  order?: number;
  is_active?: boolean;
}

export interface GroupedContentSections {
  [key: string]: ContentSection[];
}

class CMSService {
  // Institute Info Methods
  async getInstituteInfo(): Promise<InstituteInfo | null> {
    try {
      const response = await apiRequest<InstituteInfo>('/institute-info', {
        method: 'GET',
      });
      return response.data || null;
    } catch (error: any) {
      // Return null for 404 (not found) or any other error
      // Components will use fallback data
      if (error.statusCode === 404) {
        return null; // No institute info exists yet
      }
      // For other errors, return null so components can use fallback
      console.warn('CMS: Error fetching institute info:', error);
      return null;
    }
  }

  async updateInstituteInfo(data: UpdateInstituteInfoData): Promise<InstituteInfo> {
    const response = await apiRequestWithRefresh<InstituteInfo>('/institute-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as InstituteInfo;
  }

  // Content Sections Methods
  async getAllContentSections(options?: {
    include_inactive?: boolean;
    grouped?: boolean;
  }): Promise<ContentSection[] | GroupedContentSections> {
    try {
      const params = new URLSearchParams();
      if (options?.include_inactive) {
        params.append('include_inactive', 'true');
      }
      if (options?.grouped !== undefined) {
        params.append('grouped', options.grouped.toString());
      }

      const queryString = params.toString();
      const endpoint = `/content-sections${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest<ContentSection[] | GroupedContentSections>(endpoint, {
        method: 'GET',
      });
      return response.data || (options?.grouped === false ? [] : {});
    } catch (error: any) {
      // Return empty data on error so components can use fallback
      console.warn('CMS: Error fetching all content sections:', error);
      return options?.grouped === false ? [] : {};
    }
  }

  async getContentSectionsByKey(key: string): Promise<ContentSection[]> {
    try {
      const response = await apiRequest<ContentSection[]>(`/content-sections/${key}`, {
        method: 'GET',
      });
      return response.data || [];
    } catch (error: any) {
      // Return empty array on error so components can use fallback
      console.warn(`CMS: Error fetching content sections for key "${key}":`, error);
      return [];
    }
  }

  async createContentSection(data: CreateContentSectionData): Promise<ContentSection> {
    const response = await apiRequestWithRefresh<ContentSection>('/content-sections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as ContentSection;
  }

  async updateContentSection(id: string, data: UpdateContentSectionData): Promise<ContentSection> {
    const response = await apiRequestWithRefresh<ContentSection>(`/content-sections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as ContentSection;
  }

  async deleteContentSection(id: string): Promise<void> {
    await apiRequestWithRefresh(`/content-sections/${id}`, {
      method: 'DELETE',
    });
  }
}

export const cmsService = new CMSService();

