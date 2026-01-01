import { useState, useEffect } from 'react';
import { cmsService, type InstituteInfo, type ContentSection, type GroupedContentSections } from '../services/cms';

export const useInstituteInfo = () => {
  const [data, setData] = useState<InstituteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstituteInfo = async () => {
      try {
        setLoading(true);
        const result = await cmsService.getInstituteInfo();
        setData(result);
        setError(null);
      } catch (err: any) {
        // Silently handle errors - components will use fallback data
        console.warn('CMS: Failed to fetch institute info, using fallback data:', err?.message);
        setData(null); // Ensure null so components use fallback
        setError(err?.message || 'Failed to fetch institute info');
      } finally {
        setLoading(false);
      }
    };

    fetchInstituteInfo();
  }, []);

  return { data, loading, error };
};

export const useContentSections = (key?: string, options?: { include_inactive?: boolean }) => {
  const [data, setData] = useState<ContentSection[] | GroupedContentSections>(key ? [] : {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        let result: ContentSection[] | GroupedContentSections;
        
        if (key) {
          result = await cmsService.getContentSectionsByKey(key);
        } else {
          result = await cmsService.getAllContentSections({ 
            grouped: true,
            include_inactive: options?.include_inactive 
          }) as GroupedContentSections;
        }
        
        setData(result);
        setError(null);
      } catch (err: any) {
        // Silently handle errors - components will use fallback data
        console.warn(`CMS: Failed to fetch content sections${key ? ` for key "${key}"` : ''}, using fallback data:`, err?.message);
        setData(key ? [] : {}); // Ensure empty data so components use fallback
        setError(err?.message || 'Failed to fetch content sections');
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [key, options?.include_inactive]);

  return { data, loading, error };
};

export const useContentSection = (key: string) => {
  const { data, loading, error } = useContentSections(key);
  const sections = Array.isArray(data) ? data : [];
  
  // Return the first active section, or first section if none are active
  const activeSection = sections.find(s => s.is_active) || sections[0] || null;
  
  return { 
    section: activeSection, 
    allSections: sections,
    loading, 
    error 
  };
};

