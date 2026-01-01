import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useContentSections } from '../../hooks/useCMS';
import { Bell, AlertCircle, Info, ExternalLink, Sparkles, Megaphone, Gift, Calendar, PartyPopper, Tag, Ticket } from 'lucide-react';

export const AnnouncementsSection: React.FC = () => {
  const { data: announcementsData, loading } = useContentSections('announcements');
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(announcementsData)) {
      // Filter active announcements and check expiry dates
      const now = new Date();
      const activeAnnouncements = announcementsData
        .filter((ann: any) => {
          if (!ann.is_active) return false;
          
          // Check expiry date if present
          if (ann.content?.expiry_date) {
            const expiryDate = new Date(ann.content.expiry_date);
            if (expiryDate < now) return false;
          }
          
          return true;
        })
        .sort((a: any, b: any) => {
          // Sort by priority: high > medium > low
          const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.content?.priority || 'low'] || 1;
          const bPriority = priorityOrder[b.content?.priority || 'low'] || 1;
          if (aPriority !== bPriority) return bPriority - aPriority;
          // Then by order
          return a.order - b.order;
        });
      
      setAnnouncements(activeAnnouncements);
    } else {
      setAnnouncements([]);
    }
  }, [announcementsData]);

  const handleLinkClick = (link: string, action?: string) => {
    if (action === 'external' || link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      if (window.location.hostname.includes('github.io')) {
        window.location.href = `/Fitpreeti-yog-institute/#${link}`;
      } else {
        window.location.hash = link;
      }
    }
  };

  const getCategoryStyles = (category: string = 'general', priority: string = 'medium') => {
    // Category-based styling takes precedence
    const categoryStyles: Record<string, any> = {
      festival: {
        bg: 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600',
        border: 'border-orange-400',
        text: 'text-white',
        icon: PartyPopper,
        badge: 'bg-yellow-400/30 text-yellow-100 backdrop-blur-sm',
        button: 'bg-white text-orange-600 hover:bg-orange-50 shadow-lg',
        badgeText: 'Festival',
        pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]'
      },
      offer: {
        bg: 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600',
        border: 'border-green-400',
        text: 'text-white',
        icon: Tag,
        badge: 'bg-emerald-400/30 text-emerald-100 backdrop-blur-sm',
        button: 'bg-white text-green-600 hover:bg-green-50 shadow-lg',
        badgeText: 'Special Offer',
        pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]'
      },
      event: {
        bg: 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600',
        border: 'border-purple-400',
        text: 'text-white',
        icon: Calendar,
        badge: 'bg-indigo-400/30 text-indigo-100 backdrop-blur-sm',
        button: 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg',
        badgeText: 'Event',
        pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]'
      },
      promotion: {
        bg: 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600',
        border: 'border-pink-400',
        text: 'text-white',
        icon: Gift,
        badge: 'bg-rose-400/30 text-rose-100 backdrop-blur-sm',
        button: 'bg-white text-pink-600 hover:bg-pink-50 shadow-lg',
        badgeText: 'Promotion',
        pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]'
      },
      general: {
        bg: 'bg-gradient-to-r from-red-600 to-red-700',
        border: 'border-red-500',
        text: 'text-white',
        icon: Bell,
        badge: 'bg-red-500/30 text-red-100 backdrop-blur-sm',
        button: 'bg-white text-red-600 hover:bg-red-50 shadow-lg',
        badgeText: 'Announcement',
        pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]'
      }
    };

    // Priority-based fallback if category not found
    if (!categoryStyles[category]) {
      switch (priority) {
        case 'high':
          return {
            bg: 'bg-gradient-to-r from-red-600 to-red-700',
            border: 'border-red-500',
            text: 'text-white',
            icon: AlertCircle,
            badge: 'bg-red-500/20 text-red-100',
            button: 'bg-white text-red-600 hover:bg-red-50',
            badgeText: 'Important',
            pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]'
          };
        case 'medium':
          return {
            bg: 'bg-gradient-to-r from-red-600 to-red-700',
            border: 'border-red-500',
            text: 'text-white',
            icon: Bell,
            badge: 'bg-red-500/20 text-red-100',
            button: 'bg-white text-red-600 hover:bg-red-50',
            badgeText: 'Notice',
            pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]'
          };
        case 'low':
        default:
          return {
            bg: 'bg-gradient-to-r from-gray-50 to-gray-100',
            border: 'border-gray-300',
            text: 'text-gray-800',
            icon: Info,
            badge: 'bg-gray-200 text-gray-700',
            button: 'bg-gray-800 text-white hover:bg-gray-700',
            badgeText: 'Info',
            pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)]'
          };
      }
    }

    return categoryStyles[category];
  };

  const getIcon = (iconName?: string, category?: string, defaultIcon: any = Bell) => {
    // Auto-select icon based on category if icon not specified
    if (!iconName && category) {
      const categoryIcons: Record<string, any> = {
        festival: PartyPopper,
        offer: Tag,
        event: Calendar,
        promotion: Gift,
        general: Bell
      };
      if (categoryIcons[category]) {
        return categoryIcons[category];
      }
    }

    const iconMap: Record<string, any> = {
      bell: Bell,
      alert: AlertCircle,
      info: Info,
      sparkles: Sparkles,
      megaphone: Megaphone,
      gift: Gift,
      calendar: Calendar,
      party: PartyPopper,
      tag: Tag,
      ticket: Ticket
    };
    return iconName ? (iconMap[iconName.toLowerCase()] || defaultIcon) : defaultIcon;
  };

  // Don't render if no announcements or still loading
  if (loading || announcements.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative z-10">
      <AnimatePresence>
        {announcements.map((announcement, index) => {
          const category = announcement.content?.category || 'general';
          const priority = announcement.content?.priority || 'medium';
          const styles = getCategoryStyles(category, priority);
          const IconComponent = getIcon(announcement.content?.icon, category, styles.icon);
          const textColor = announcement.content?.text_color || styles.text;
          const customBg = announcement.content?.bg_color;
          const hasCustomBg = !!customBg;

          return (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              className={`relative overflow-hidden border-b-2 ${styles.border} shadow-xl`}
              style={hasCustomBg ? { 
                backgroundColor: customBg,
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.05) 100%)'
              } : {}}
            >
              {/* Decorative background pattern */}
              <div className={`absolute inset-0 ${hasCustomBg ? '' : styles.bg}`}>
                <div className={`absolute inset-0 ${styles.pattern || 'bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]'}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                {/* Animated shimmer effect for special categories */}
                {(category === 'festival' || category === 'offer' || category === 'promotion') && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "linear"
                    }}
                  />
                )}
              </div>

              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center py-5 md:py-6">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Icon with enhanced styling */}
                    <motion.div
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl ${hasCustomBg ? 'bg-white/25 backdrop-blur-md' : styles.badge} flex items-center justify-center ${textColor} shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <IconComponent className="h-7 w-7" />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {/* Category Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles.badge} ${textColor} shadow-md backdrop-blur-sm`}>
                          {styles.badgeText || 'Announcement'}
                        </span>
                        {/* Priority Badge for high priority */}
                        {priority === 'high' && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/30 text-red-100 backdrop-blur-sm">
                            ⚠️ Urgent
                          </span>
                        )}
                      </div>
                      {announcement.content?.title && (
                        <h3 className={`font-bold text-lg md:text-xl mb-2 ${textColor} drop-shadow-sm`}>
                          {announcement.content.title}
                        </h3>
                      )}
                      {announcement.content?.message && (
                        <p className={`text-sm md:text-base leading-relaxed mb-4 ${textColor} opacity-95`}>
                          {announcement.content.message}
                        </p>
                      )}
                      {announcement.content?.link && announcement.content?.link_text && (
                        <motion.button
                          onClick={() => handleLinkClick(
                            announcement.content.link,
                            announcement.content.link_action
                          )}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${styles.button} shadow-lg`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {announcement.content.link_text}
                          <ExternalLink className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom accent line with gradient */}
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${hasCustomBg ? '' : styles.bg} opacity-60`} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

