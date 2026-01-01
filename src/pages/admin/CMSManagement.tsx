import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { cmsService, type ContentSection, type CreateContentSectionData, type UpdateContentSectionData } from '../../services/cms';
import { Plus, Edit, Trash2, X, Save, Home, Info, Mail, Video, Building2, Settings, Link as LinkIcon, Power } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { WeeklyScheduleForm } from '../../components/admin/WeeklyScheduleForm';

// Page definitions with their sections
interface PageDefinition {
  id: string;
  name: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: SectionDefinition[];
}

interface SectionDefinition {
  key: string;
  name: string;
  description: string;
  fields: FieldDefinition[];
}

interface FieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'number' | 'color' | 'select' | 'array' | 'object' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  nestedFields?: FieldDefinition[];
}

const PAGE_DEFINITIONS: PageDefinition[] = [
  {
    id: 'home',
    name: 'Home Page',
    route: '/',
    icon: Home,
    sections: [
      {
        key: 'hero',
        name: 'Hero Section',
        description: 'Main landing section with title, subtitle, and CTAs',
        fields: [
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'subtitle', label: 'Subtitle', type: 'textarea', required: true },
          { key: 'cta_primary', label: 'Primary CTA', type: 'object', nestedFields: [
            { key: 'text', label: 'Button Text', type: 'text', required: true },
            { key: 'link', label: 'Link', type: 'text', required: true },
            { key: 'action', label: 'Action', type: 'select', options: [
              { value: 'navigate', label: 'Navigate' },
              { value: 'external', label: 'External' },
              { value: 'scroll', label: 'Scroll' }
            ] }
          ]},
          { key: 'cta_secondary', label: 'Secondary CTA', type: 'object', nestedFields: [
            { key: 'text', label: 'Button Text', type: 'text' },
            { key: 'link', label: 'Link', type: 'text' },
            { key: 'action', label: 'Action', type: 'select', options: [
              { value: 'navigate', label: 'Navigate' },
              { value: 'external', label: 'External' },
              { value: 'scroll', label: 'Scroll' }
            ] }
          ]},
          { key: 'background_image', label: 'Background Image URL', type: 'url' },
          { key: 'background_color', label: 'Background Color', type: 'color' }
        ]
      },
      {
        key: 'cta_home',
        name: 'CTA Section',
        description: 'Call-to-action section at the bottom of home page',
        fields: [
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'subtitle', label: 'Subtitle', type: 'textarea', required: true },
          { key: 'cta_primary', label: 'Primary CTA', type: 'object', nestedFields: [
            { key: 'text', label: 'Button Text', type: 'text', required: true },
            { key: 'link', label: 'Link', type: 'text', required: true },
            { key: 'action', label: 'Action', type: 'select', options: [
              { value: 'navigate', label: 'Navigate' },
              { value: 'external', label: 'External' }
            ] }
          ]},
          { key: 'cta_secondary', label: 'Secondary CTA', type: 'object', nestedFields: [
            { key: 'text', label: 'Button Text', type: 'text' },
            { key: 'link', label: 'Link', type: 'text' },
            { key: 'action', label: 'Action', type: 'select', options: [
              { value: 'navigate', label: 'Navigate' },
              { value: 'external', label: 'External' }
            ] }
          ]},
          { key: 'social_proof', label: 'Social Proof', type: 'object', nestedFields: [
            { key: 'text', label: 'Text', type: 'text' },
            { key: 'show_avatars', label: 'Show Avatars', type: 'select', options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' }
            ] }
          ]},
          { key: 'background_color', label: 'Background Color', type: 'color' }
        ]
      },
      {
        key: 'announcements',
        name: 'Announcements',
        description: 'Banner announcements for promotions and notices - appears after hero section',
        fields: [
          // Basic Information
          { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g., Diwali Special Offer, New Morning Classes' },
          { key: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Enter the announcement message...' },
          
          // Category & Type
          { key: 'category', label: 'Announcement Category', type: 'select', required: true, options: [
            { value: 'festival', label: '🎉 Festival (Diwali, Holi, etc.)' },
            { value: 'offer', label: '💰 Special Offer / Discount' },
            { value: 'event', label: '📅 Event / Workshop' },
            { value: 'promotion', label: '🎁 Promotion / Sale' },
            { value: 'general', label: '📢 General Announcement' }
          ], placeholder: 'Select announcement type' },
          
          // Call-to-Action
          { key: 'link', label: 'Action Link', type: 'text', placeholder: 'Link URL (optional)' },
          { key: 'link_text', label: 'Button Text', type: 'text', placeholder: 'e.g., Learn More, View Details, Claim Offer' },
          { key: 'link_action', label: 'Link Action Type', type: 'select', options: [
            { value: 'navigate', label: 'Navigate (Internal Page)' },
            { value: 'external', label: 'External (New Tab)' }
          ]},
          
          // Styling & Priority
          { key: 'priority', label: 'Priority Level', type: 'select', options: [
            { value: 'high', label: 'High (Red - Urgent/Important)' },
            { value: 'medium', label: 'Medium (Blue - General Notice)' },
            { value: 'low', label: 'Low (Gray - Informational)' }
          ]},
          { key: 'icon', label: 'Icon Name', type: 'select', options: [
            { value: 'bell', label: 'Bell' },
            { value: 'alert', label: 'Alert' },
            { value: 'info', label: 'Info' },
            { value: 'sparkles', label: 'Sparkles' },
            { value: 'megaphone', label: 'Megaphone' },
            { value: 'gift', label: 'Gift' },
            { value: 'calendar', label: 'Calendar' }
          ], placeholder: 'Select an icon (auto-selected based on category if not set)' },
          
          // Colors (Optional - uses default if not set)
          { key: 'bg_color', label: 'Background Color (Optional)', type: 'color', placeholder: 'Leave empty for default category/priority colors' },
          { key: 'text_color', label: 'Text Color (Optional)', type: 'color', placeholder: 'Leave empty for default text color' },
          
          // Scheduling
          { key: 'expiry_date', label: 'Expiry Date (Optional)', type: 'date', placeholder: 'Select expiry date' }
        ]
      }
    ]
  },
  {
    id: 'about',
    name: 'About Page',
    route: '/about',
    icon: Info,
    sections: [
      {
        key: 'about_hero',
        name: 'About Hero',
        description: 'Hero section for about page',
        fields: [
          { key: 'badge', label: 'Badge', type: 'text' },
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea', required: true },
          { key: 'cta_primary', label: 'Primary CTA', type: 'object', nestedFields: [
            { key: 'text', label: 'Button Text', type: 'text' },
            { key: 'link', label: 'Link', type: 'text' }
          ]}
        ]
      },
      {
        key: 'about_stats',
        name: 'Statistics',
        description: 'Statistics section',
        fields: [
          { key: 'stats', label: 'Stats', type: 'array', nestedFields: [
            { key: 'name', label: 'Name', type: 'text', required: true },
            { key: 'value', label: 'Value', type: 'text', required: true },
            { key: 'icon', label: 'Icon', type: 'select', required: true, options: [
              { value: 'award', label: '🏆 Award (Years of Excellence)' },
              { value: 'heart', label: '❤️ Heart (Happy Students)' },
              { value: 'users', label: '👥 Users (Classes/Students)' },
              { value: 'activity', label: '📊 Activity (Programs/Stats)' },
              { value: 'star', label: '⭐ Star' },
              { value: 'trending-up', label: '📈 Trending Up' },
              { value: 'target', label: '🎯 Target' },
              { value: 'zap', label: '⚡ Zap (Energy)' },
              { value: 'smile', label: '😊 Smile' },
              { value: 'calendar', label: '📅 Calendar' },
              { value: 'clock', label: '⏰ Clock' },
              { value: 'dollar-sign', label: '💰 Dollar Sign' },
              { value: 'globe', label: '🌍 Globe' },
              { value: 'home', label: '🏠 Home' },
              { value: 'book', label: '📚 Book' },
              { value: 'video', label: '🎥 Video' },
              { value: 'music', label: '🎵 Music' }
            ], placeholder: 'Select an icon' }
          ]}
        ]
      },
      {
        key: 'about_timeline',
        name: 'Timeline',
        description: 'Milestones timeline',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'milestones', label: 'Milestones', type: 'array', nestedFields: [
            { key: 'year', label: 'Year', type: 'text', required: true },
            { key: 'title', label: 'Title', type: 'text', required: true },
            { key: 'description', label: 'Description', type: 'textarea', required: true }
          ]}
        ]
      }
    ]
  },
  {
    id: 'contact',
    name: 'Contact Page',
    route: '/contact',
    icon: Mail,
    sections: [
      {
        key: 'contact_hero',
        name: 'Contact Hero',
        description: 'Hero section for contact page',
        fields: [
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea', required: true }
        ]
      },
      {
        key: 'contact_cta',
        name: 'Contact CTA',
        description: 'CTA section at the bottom of contact page',
        fields: [
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'cta_primary', label: 'Primary CTA', type: 'object', nestedFields: [
            { key: 'text', label: 'Button Text', type: 'text', required: true },
            { key: 'link', label: 'Link', type: 'text', required: true },
            { key: 'action', label: 'Action', type: 'select', options: [
              { value: 'navigate', label: 'Navigate (Internal)' },
              { value: 'external', label: 'External (New Tab)' }
            ] }
          ]},
          { key: 'cta_secondary', label: 'Secondary CTA', type: 'object', nestedFields: [
            { key: 'text', label: 'Button Text', type: 'text' },
            { key: 'link', label: 'Link', type: 'text' },
            { key: 'action', label: 'Action', type: 'select', options: [
              { value: 'navigate', label: 'Navigate (Internal)' },
              { value: 'external', label: 'External (New Tab)' }
            ] }
          ]},
          { key: 'background_color', label: 'Background Color', type: 'color' }
        ]
      }
    ]
  },
  {
    id: 'online-classes',
    name: 'Online Classes',
    route: '/online-classes',
    icon: Video,
    sections: [
      {
        key: 'online_classes_hero',
        name: 'Online Classes Hero',
        description: 'Hero section for online classes page',
        fields: [
          { key: 'badge', label: 'Badge', type: 'text' },
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'description', type: 'textarea', label: 'Description', required: true },
          { key: 'cta_primary', label: 'Primary CTA', type: 'object', nestedFields: [
            { key: 'text', label: 'Button Text', type: 'text' },
            { key: 'link', label: 'Link', type: 'text' }
          ]}
        ]
      },
      {
        key: 'online_classes_stats',
        name: 'Online Classes Stats',
        description: 'Statistics for online classes',
        fields: [
          { key: 'stats', label: 'Stats', type: 'array', nestedFields: [
            { key: 'name', label: 'Name', type: 'text', required: true },
            { key: 'value', label: 'Value', type: 'text', required: true },
            { key: 'icon', label: 'Icon', type: 'text' }
          ]}
        ]
      },
      {
        key: 'weekly_schedule',
        name: 'Weekly Class Schedule',
        description: 'Manage weekly class schedule with days and class times',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text', required: true, placeholder: 'e.g., Weekly Class Schedule' },
          { key: 'description', label: 'Section Description', type: 'textarea', required: true, placeholder: 'e.g., Join our live classes from anywhere. Times are in IST (UTC+5:30).' },
          { key: 'cta_title', label: 'CTA Title', type: 'text', placeholder: 'e.g., Can\'t Find a Suitable Time?' },
          { key: 'cta_description', label: 'CTA Description', type: 'textarea', placeholder: 'e.g., We offer private sessions and custom group classes...' },
          { key: 'cta_button_text', label: 'CTA Button Text', type: 'text', placeholder: 'e.g., Contact Us for Custom Schedule' },
          { key: 'cta_button_link', label: 'CTA Button Link', type: 'text', placeholder: 'e.g., /contact' },
          { key: 'schedule', label: 'Weekly Schedule', type: 'array', nestedFields: [
            { key: 'day', label: 'Day', type: 'select', required: true, options: [
              { value: 'Mon', label: 'Monday' },
              { value: 'Tue', label: 'Tuesday' },
              { value: 'Wed', label: 'Wednesday' },
              { value: 'Thu', label: 'Thursday' },
              { value: 'Fri', label: 'Friday' },
              { value: 'Sat', label: 'Saturday' },
              { value: 'Sun', label: 'Sunday' }
            ]},
            { key: 'classes', label: 'Classes', type: 'array', nestedFields: [
              { key: 'time', label: 'Time', type: 'text', required: true, placeholder: 'e.g., 6:00 AM - 7:00 AM' },
              { key: 'name', label: 'Class Name', type: 'text', required: true, placeholder: 'e.g., Morning Yoga Flow' },
              { key: 'instructor', label: 'Instructor', type: 'text', required: true, placeholder: 'e.g., Priya' },
              { key: 'level', label: 'Level', type: 'select', required: true, options: [
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
                { value: 'All Levels', label: 'All Levels' }
              ]},
              { key: 'type', label: 'Class Type', type: 'select', required: true, options: [
                { value: 'Yoga', label: 'Yoga' },
                { value: 'Dance', label: 'Dance' },
                { value: 'Fitness', label: 'Fitness' },
                { value: 'Meditation', label: 'Meditation' }
              ]}
            ]}
          ]}
        ]
      }
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate Wellness',
    route: '/corporate-wellness',
    icon: Building2,
    sections: [
      {
        key: 'corporate_hero',
        name: 'Corporate Hero',
        description: 'Hero section for corporate wellness page',
        fields: [
          { key: 'badge', label: 'Badge', type: 'text' },
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea', required: true },
          { key: 'cta_primary', label: 'Primary CTA', type: 'object', nestedFields: [
            { key: 'text', label: 'Button Text', type: 'text' },
            { key: 'link', label: 'Link', type: 'text' }
          ]}
        ]
      }
    ]
  }
];

// Available pages for link dropdown
const AVAILABLE_PAGES = [
  { value: ROUTES.HOME, label: 'Home' },
  { value: ROUTES.ABOUT, label: 'About' },
  { value: ROUTES.SERVICES, label: 'Services' },
  { value: ROUTES.CONTACT, label: 'Contact' },
  { value: ROUTES.BOOKING, label: 'Booking' },
  { value: ROUTES.CORPORATE, label: 'Corporate Wellness' },
  { value: ROUTES.ONLINE, label: 'Online Classes' },
];

export const CMSManagement: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sections, setSections] = useState<Record<string, ContentSection[]>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstituteForm, setShowInstituteForm] = useState(false);
  const [instituteInfo, setInstituteInfo] = useState<any>(null);
  const [instituteFormData, setInstituteFormData] = useState({
    location: '',
    phone_numbers: [''],
    email: '',
    social_media: {
      instagram: '',
      facebook: '',
      youtube: '',
      whatsapp: ''
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sectionsData, instituteData] = await Promise.all([
        cmsService.getAllContentSections({ grouped: true, include_inactive: true }) as Promise<Record<string, ContentSection[]>>,
        cmsService.getInstituteInfo()
      ]);
      setSections(sectionsData);
      setInstituteInfo(instituteData);
      if (instituteData) {
        setInstituteFormData({
          location: instituteData.location,
          phone_numbers: instituteData.phone_numbers,
          email: instituteData.email,
          social_media: {
            instagram: instituteData.social_media.instagram || '',
            facebook: instituteData.social_media.facebook || '',
            youtube: instituteData.social_media.youtube || '',
            whatsapp: instituteData.social_media.whatsapp || ''
          }
        });
      }
    } catch (err: any) {
      console.error('Failed to load CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentPage = PAGE_DEFINITIONS.find(p => p.id === selectedPage);
  const currentSectionDef = currentPage?.sections.find(s => s.key === selectedSection || '');

  const getSectionsForPage = (pageId: string): ContentSection[] => {
    const page = PAGE_DEFINITIONS.find(p => p.id === pageId);
    if (!page) return [];
    
    const pageSections: ContentSection[] = [];
    page.sections.forEach(sectionDef => {
      const sectionData = sections[sectionDef.key] || [];
      pageSections.push(...sectionData);
    });
    return pageSections.sort((a, b) => a.order - b.order);
  };

  const openCreateForm = (sectionKey: string) => {
    setSelectedSection(sectionKey);
    const sectionDef = currentPage?.sections.find(s => s.key === sectionKey);
    if (sectionDef) {
      const initialData: Record<string, any> = {};
      sectionDef.fields.forEach(field => {
        if (field.type === 'object' && field.nestedFields) {
          initialData[field.key] = {};
          field.nestedFields.forEach(nf => {
            // Initialize nested fields with empty strings
            initialData[field.key][nf.key] = '';
          });
        } else if (field.type === 'array') {
          initialData[field.key] = [];
        } else {
          initialData[field.key] = '';
        }
      });
      setFormData(initialData);
      setEditingSection(null);
      setShowForm(true);
    }
  };

  const openEditForm = (section: ContentSection) => {
    setEditingSection(section);
    setSelectedSection(section.section_key);
    setFormData(section.content);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await cmsService.deleteContentSection(id);
      await fetchData();
      alert('Section deleted successfully');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete section');
    }
  };

  const handleToggleActive = async (section: ContentSection) => {
    try {
      const sectionData: UpdateContentSectionData = {
        section_key: section.section_key,
        content: section.content,
        order: section.order,
        is_active: !section.is_active
      };
      await cmsService.updateContentSection(section.id, sectionData);
      await fetchData();
    } catch (err: any) {
      alert(err?.message || 'Failed to update section status');
    }
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection || !currentSectionDef) return;

    setIsSubmitting(true);
    try {
      const sectionData: CreateContentSectionData | UpdateContentSectionData = {
        section_key: selectedSection,
        content: formData,
        order: editingSection?.order || 0,
        is_active: editingSection?.is_active !== false
      };

      if (editingSection) {
        await cmsService.updateContentSection(editingSection.id, sectionData);
        alert('Section updated successfully');
      } else {
        await cmsService.createContentSection(sectionData as CreateContentSectionData);
        alert('Section created successfully');
      }

      await fetchData();
      setShowForm(false);
      setFormData({});
      setEditingSection(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to save section');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstituteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const phoneNumbers = instituteFormData.phone_numbers.filter(p => p.trim());
      if (phoneNumbers.length === 0) {
        alert('At least one phone number is required');
        return;
      }

      await cmsService.updateInstituteInfo({
        location: instituteFormData.location,
        phone_numbers: phoneNumbers,
        email: instituteFormData.email,
        social_media: {
          instagram: instituteFormData.social_media.instagram || undefined,
          facebook: instituteFormData.social_media.facebook || undefined,
          youtube: instituteFormData.social_media.youtube || undefined,
          whatsapp: instituteFormData.social_media.whatsapp || undefined
        }
      });

      alert('Institute info updated successfully');
      await fetchData();
      setShowInstituteForm(false);
    } catch (err: any) {
      alert(err?.message || 'Failed to update institute info');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to update form data for nested fields (handles both objects and arrays)
  const updateNestedField = (path: string, fieldKey: string, newValue: any) => {
    const pathParts = path.split('.');
    
    if (pathParts.length === 1) {
      // Simple object path (e.g., "parent")
      const parent = pathParts[0];
      setFormData({
        ...formData,
        [parent]: { ...(formData[parent] || {}), [fieldKey]: newValue }
      });
    } else if (pathParts.length === 2) {
      // Array path (e.g., "milestones.0")
      const [parent, indexStr] = pathParts;
      const index = parseInt(indexStr);
      const parentArray = formData[parent] || [];
      const newArray = [...parentArray];
      newArray[index] = { ...(newArray[index] || {}), [fieldKey]: newValue };
      setFormData({ ...formData, [parent]: newArray });
    }
  };

  const renderField = (field: FieldDefinition, value: any, path: string = ''): React.ReactElement => {
    const fieldPath = path ? `${path}.${field.key}` : field.key;
    // For nested fields, value is already the parent object, so access field.key directly
    // For top-level fields, access from formData using field.key
    const currentValue = path 
      ? (value?.[field.key] ?? '') 
      : (formData?.[field.key] ?? '');

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={fieldPath}
            value={currentValue}
            onChange={(e) => {
              if (path) {
                updateNestedField(path, field.key, e.target.value);
              } else {
                setFormData({ ...formData, [field.key]: e.target.value });
              }
            }}
            required={field.required}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        );

      case 'url':
        return (
          <input
            key={fieldPath}
            type="url"
            value={currentValue}
            onChange={(e) => {
              if (path) {
                updateNestedField(path, field.key, e.target.value);
              } else {
                setFormData({ ...formData, [field.key]: e.target.value });
              }
            }}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        );

      case 'date':
        // Format date value for input (YYYY-MM-DD)
        const dateValue = currentValue ? (currentValue.includes('T') ? currentValue.split('T')[0] : currentValue) : '';
        return (
          <div key={fieldPath} className="space-y-2">
            <input
              type="date"
              value={dateValue}
              onChange={(e) => {
                const selectedDate = e.target.value;
                if (path) {
                  updateNestedField(path, field.key, selectedDate);
                } else {
                  setFormData({ ...formData, [field.key]: selectedDate });
                }
              }}
              required={field.required}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent cursor-pointer"
            />
            {dateValue && (
              <p className="text-xs text-gray-500">
                Selected: <span className="font-semibold text-gray-700">{new Date(dateValue).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            )}
          </div>
        );

      case 'color':
        return (
          <div key={fieldPath} className="flex items-center space-x-2">
            <input
              type="color"
              value={currentValue || '#000000'}
              onChange={(e) => {
                if (path) {
                  updateNestedField(path, field.key, e.target.value);
                } else {
                  setFormData({ ...formData, [field.key]: e.target.value });
                }
              }}
              className="h-10 w-20 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={currentValue || ''}
              onChange={(e) => {
                if (path) {
                  updateNestedField(path, field.key, e.target.value);
                } else {
                  setFormData({ ...formData, [field.key]: e.target.value });
                }
              }}
              placeholder="#000000"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
        );

      case 'select':
        return (
          <select
            key={fieldPath}
            value={currentValue || ''}
            onChange={(e) => {
              if (path) {
                updateNestedField(path, field.key, e.target.value);
              } else {
                setFormData({ ...formData, [field.key]: e.target.value });
              }
            }}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'object':
        return (
          <div key={fieldPath} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-700">{field.label}</h4>
            {field.nestedFields?.map(nf => (
              <div key={nf.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {nf.label} {nf.required && <span className="text-red-600">*</span>}
                </label>
                {renderField(nf, formData[field.key] || {}, field.key)}
              </div>
            ))}
          </div>
        );

      case 'array':
        // Special handling for weekly schedule
        if (field.key === 'schedule' && selectedSection === 'weekly_schedule') {
          const scheduleValue = currentValue || [];
          return (
            <div key={fieldPath} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label} {field.required && <span className="text-red-600">*</span>}
              </label>
              <WeeklyScheduleForm
                value={scheduleValue}
                onChange={(newValue) => {
                  setFormData({ ...formData, [field.key]: newValue });
                }}
              />
            </div>
          );
        }

        // Default array handling
        const arrayValue = currentValue || [];
        return (
          <div key={fieldPath} className="space-y-4">
            {arrayValue.map((item: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Item {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newArray = arrayValue.filter((_: any, i: number) => i !== index);
                      setFormData({ ...formData, [field.key]: newArray });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {field.nestedFields?.map(nf => (
                  <div key={nf.key} className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {nf.label} {nf.required && <span className="text-red-600">*</span>}
                    </label>
                    {renderField(nf, item, `${field.key}.${index}`)}
                  </div>
                ))}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItem: any = {};
                field.nestedFields?.forEach(nf => {
                  newItem[nf.key] = '';
                });
                setFormData({ ...formData, [field.key]: [...arrayValue, newItem] });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              + Add Item
            </button>
          </div>
        );

      default:
        // Special handling for "link" fields - show page dropdown + custom input
        if (field.key === 'link' || field.key === 'link_url') {
          const updateValue = (newValue: string) => {
            if (path) {
              updateNestedField(path, field.key, newValue);
            } else {
              setFormData({ ...formData, [field.key]: newValue });
            }
          };

          // Check if current value matches any page route
          const selectedPageRoute = AVAILABLE_PAGES.find((page: { value: string; label: string }) => page.value === currentValue)?.value || '';

          return (
            <div key={fieldPath} className="space-y-2">
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-4 w-4 text-gray-500" />
                <label className="text-xs font-medium text-gray-600">Quick Select Page</label>
              </div>
              <select
                value={selectedPageRoute}
                onChange={(e) => {
                  if (e.target.value && e.target.value !== 'custom') {
                    updateValue(e.target.value);
                  } else if (e.target.value === 'custom') {
                    // Clear the value to allow custom input
                    updateValue('');
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white"
              >
                <option value="">-- Select a page or enter custom --</option>
                {AVAILABLE_PAGES.map((page: { value: string; label: string }) => (
                  <option key={page.value} value={page.value}>{page.label}</option>
                ))}
                <option value="custom">-- Enter custom link --</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => updateValue(e.target.value)}
                  required={field.required}
                  placeholder={field.placeholder || "Enter custom link (e.g., /custom-page or https://example.com)"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                {selectedPageRoute && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Page Selected</span>
                  </div>
                )}
              </div>
              {currentValue && (
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-semibold">Link:</span> <span className="font-mono text-gray-700">{currentValue}</span>
                </p>
              )}
            </div>
          );
        }

        return (
          <input
            key={fieldPath}
            type={field.type}
            value={currentValue}
            onChange={(e) => {
              if (path) {
                updateNestedField(path, field.key, e.target.value);
              } else {
                setFormData({ ...formData, [field.key]: e.target.value });
              }
            }}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading CMS data...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">CMS Management</h1>
              <p className="text-gray-600">Manage content sections and institute information</p>
            </div>
            <button
              onClick={() => setShowInstituteForm(true)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Settings className="h-5 w-5" />
              <span>Institute Info</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Pages Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pages</h2>
                <div className="space-y-2">
                  {PAGE_DEFINITIONS.map((page) => {
                    const Icon = page.icon;
                    const pageSections = getSectionsForPage(page.id);
                    return (
                      <button
                        key={page.id}
                        onClick={() => {
                          setSelectedPage(page.id);
                          setSelectedSection(null);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                          selectedPage === page.id
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{page.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedPage === page.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {pageSections.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sections List */}
            <div className="lg:col-span-3">
              {currentPage && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{currentPage.name}</h2>
                      <p className="text-gray-600 mt-1">Manage sections for this page</p>
                    </div>
                  </div>

                  {/* Institute Info Section (Special - only for Contact page) */}
                  {selectedPage === 'contact' && (
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Settings className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Institute Information</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Contact details displayed on Contact page and Footer</p>
                        </div>
                        <button
                          onClick={() => setShowInstituteForm(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                        >
                          <Edit className="h-4 w-4" />
                          <span>{instituteInfo ? 'Edit' : 'Create'}</span>
                        </button>
                      </div>

                      {instituteInfo ? (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 font-medium mb-1">Location</p>
                              <p className="text-gray-900">{instituteInfo.location}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium mb-1">Email</p>
                              <p className="text-gray-900">{instituteInfo.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium mb-1">Phone Numbers</p>
                              <p className="text-gray-900">{instituteInfo.phone_numbers.join(', ')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium mb-1">Social Media</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {instituteInfo.social_media.instagram && (
                                  <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">Instagram</span>
                                )}
                                {instituteInfo.social_media.facebook && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Facebook</span>
                                )}
                                {instituteInfo.social_media.youtube && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">YouTube</span>
                                )}
                                {instituteInfo.social_media.whatsapp && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">WhatsApp</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic mt-2">No institute information set yet. Click "Create" to add.</p>
                      )}
                    </div>
                  )}

                  {/* Sections */}
                  <div className="space-y-4">
                    {currentPage.sections.map((sectionDef) => {
                      const sectionData = sections[sectionDef.key] || [];
                      return (
                        <div key={sectionDef.key} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{sectionDef.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{sectionDef.description}</p>
                            </div>
                            <button
                              onClick={() => openCreateForm(sectionDef.key)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add</span>
                            </button>
                          </div>

                          {sectionData.length === 0 ? (
                            <p className="text-sm text-gray-500 italic mt-2">No sections created yet</p>
                          ) : (
                            <div className="mt-4 space-y-2">
                              {sectionData.map((section) => (
                                <div
                                  key={section.id}
                                  className={`flex items-center justify-between p-3 rounded-lg border ${
                                    section.is_active
                                      ? 'bg-gray-50 border-gray-200'
                                      : 'bg-gray-100 border-gray-300 opacity-75'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3 flex-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                      section.is_active ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className={`text-sm font-medium ${
                                          section.is_active ? 'text-gray-900' : 'text-gray-600'
                                        }`}>
                                          {section.content.title || section.content.badge || `Section #${section.order + 1}`}
                                        </p>
                                        {!section.is_active && (
                                          <span className="px-2 py-0.5 bg-gray-300 text-gray-700 text-xs font-semibold rounded">
                                            INACTIVE
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500">Order: {section.order}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {/* Active/Inactive Toggle */}
                                    <button
                                      onClick={() => handleToggleActive(section)}
                                      className={`relative inline-flex items-center px-3 py-1.5 rounded-full transition-all duration-200 ${
                                        section.is_active
                                          ? 'bg-green-100 hover:bg-green-200'
                                          : 'bg-gray-200 hover:bg-gray-300'
                                      }`}
                                      title={section.is_active ? 'Click to deactivate' : 'Click to activate'}
                                    >
                                      <div className={`flex items-center space-x-1.5 ${
                                        section.is_active ? 'text-green-700' : 'text-gray-600'
                                      }`}>
                                        <Power className={`h-3.5 w-3.5 ${section.is_active ? '' : 'opacity-60'}`} />
                                        <span className="text-xs font-semibold">
                                          {section.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                      </div>
                                    </button>
                                    <button
                                      onClick={() => openEditForm(section)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit section"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(section.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete section"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section Form Modal */}
      {showForm && currentSectionDef && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSection ? 'Edit Section' : 'Create New Section'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({});
                  setEditingSection(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSectionSubmit} className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Section:</strong> {currentSectionDef.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{currentSectionDef.description}</p>
              </div>

              <div className="space-y-6">
                {currentSectionDef.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-600">*</span>}
                    </label>
                    {renderField(field, formData)}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({});
                    setEditingSection(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? 'Saving...' : editingSection ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Institute Info Form Modal */}
      {showInstituteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Institute Information</h2>
              <button
                onClick={() => setShowInstituteForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInstituteSubmit} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={instituteFormData.location}
                    onChange={(e) => setInstituteFormData({ ...instituteFormData, location: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Numbers <span className="text-red-600">*</span>
                  </label>
                  {instituteFormData.phone_numbers.map((phone, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const newPhones = [...instituteFormData.phone_numbers];
                          newPhones[index] = e.target.value;
                          setInstituteFormData({ ...instituteFormData, phone_numbers: newPhones });
                        }}
                        required={index === 0}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                      {instituteFormData.phone_numbers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newPhones = instituteFormData.phone_numbers.filter((_, i) => i !== index);
                            setInstituteFormData({ ...instituteFormData, phone_numbers: newPhones });
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setInstituteFormData({
                        ...instituteFormData,
                        phone_numbers: [...instituteFormData.phone_numbers, '']
                      });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Phone Number
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={instituteFormData.email}
                    onChange={(e) => setInstituteFormData({ ...instituteFormData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Media</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Instagram</label>
                      <input
                        type="url"
                        value={instituteFormData.social_media.instagram}
                        onChange={(e) => setInstituteFormData({
                          ...instituteFormData,
                          social_media: { ...instituteFormData.social_media, instagram: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Facebook</label>
                      <input
                        type="url"
                        value={instituteFormData.social_media.facebook}
                        onChange={(e) => setInstituteFormData({
                          ...instituteFormData,
                          social_media: { ...instituteFormData.social_media, facebook: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">YouTube</label>
                      <input
                        type="url"
                        value={instituteFormData.social_media.youtube}
                        onChange={(e) => setInstituteFormData({
                          ...instituteFormData,
                          social_media: { ...instituteFormData.social_media, youtube: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">WhatsApp</label>
                      <input
                        type="url"
                        value={instituteFormData.social_media.whatsapp}
                        onChange={(e) => setInstituteFormData({
                          ...instituteFormData,
                          social_media: { ...instituteFormData.social_media, whatsapp: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="https://wa.me/..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowInstituteForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

