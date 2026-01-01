import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { serviceService, type Service } from '../../services/services';
import { useContentSection } from '../../hooks/useCMS';
import { fallbackServices } from '../../data/fallbackData';
import type { ReactNode } from 'react';

import { Dumbbell, Music, Flame, Leaf } from 'lucide-react';


interface HeroProps {
  onBookNow: () => void;
}

const serviceIcons: Record<string, ReactNode> = {
  'Hatha Yoga Flow': <Leaf className="w-5 h-5" />,
  'Zumba Fitness Party': <Music className="w-5 h-5" />,
  'Bollywood Dance Fusion': <Flame className="w-5 h-5" />,
  'Strength & HIIT': <Dumbbell className="w-5 h-5" />,
};


export const HeroSection: React.FC<HeroProps> = ({ onBookNow }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const { section: heroSection } = useContentSection('hero');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAllServices();
        // Filter only active services
        const activeServices = data.filter(s => s.is_active);
        if (activeServices.length > 0) {
          setServices(activeServices);
        } else {
          // Use fallback data if no active services from backend
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
        // Use fallback data when backend fails
        setServices(fallbackServices);
      }
    };
    fetchServices();
  }, []);

  // Fallback to hardcoded content if CMS data is unavailable
  // This ensures the site works even if the CMS API is down or not configured
  const title = heroSection?.content?.title || 'FitPreeti Yog Institute';
  const subtitle = heroSection?.content?.subtitle || 'Yoga for calm. Zumba for energy. Dance for joy. Fitness for transformation.';
  const ctaPrimary = heroSection?.content?.cta_primary || { text: 'Book Your Class', link: '/booking', action: 'navigate' };
  const ctaSecondary = heroSection?.content?.cta_secondary || { text: 'Explore Classes', link: '/services', action: 'navigate' };
  const bgColor = heroSection?.content?.background_color || '#000000';
  const bgImage = heroSection?.content?.background_image;

  const handleCTAClick = (cta: any) => {
    if (cta?.action === 'external' && cta?.link) {
      window.open(cta.link, '_blank', 'noopener,noreferrer');
    } else if (cta?.action === 'scroll' && cta?.target) {
      const element = document.getElementById(cta.target);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (cta?.link) {
      if (window.location.hostname.includes('github.io')) {
        window.location.href = `/Fitpreeti-yog-institute/#${cta.link}`;
      } else {
        window.location.hash = cta.link;
      }
    } else {
      onBookNow();
    }
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 bg-gradient-to-b from-neutral-900 via-black to-neutral-900"
      style={{
        backgroundColor: bgColor,
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#ff000020_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#ff000020_0%,transparent_50%)]" />

      <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            {title}
          </h1>

          <p className="text-xl md:text-2xl text-neutral-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 md:mb-16">
            {ctaPrimary && (
              <Button
                variant="accent"
                size="lg"
                onClick={() => handleCTAClick(ctaPrimary)}
                className="hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {ctaPrimary.text}
              </Button>
            )}

            {ctaSecondary && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleCTAClick(ctaSecondary)}
                className="border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
              >
                {ctaSecondary.text}
              </Button>
            )}
          </div>

          {/* SERVICES ICON GRID */}
          {services.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8 md:mt-0">
                {(showAllServices ? services : services.slice(0, 4)).map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="group p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-primary-500/50 transition-all"
                >
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-xl bg-white/20 group-hover:bg-primary-100 transition-colors">
                    <span className="text-white group-hover:text-neutral-900 transition-colors">
                      {serviceIcons[service.service_name] || <Leaf className="w-5 h-5" />}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-neutral-100 text-center">
                    {service.service_name}
                  </p>
                </motion.div>
                ))}
              </div>
              {services.length > 4 && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  onClick={() => setShowAllServices(!showAllServices)}
                  className="mt-6 mx-auto px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-primary-500/50 transition-all duration-300"
                >
                  {showAllServices ? 'Show Less' : `Show All (${services.length} services)`}
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};
