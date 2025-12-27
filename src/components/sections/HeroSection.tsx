import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import services from '../../data/services';
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
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 bg-gradient-to-b from-neutral-900 via-black to-neutral-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#ff000020_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#ff000020_0%,transparent_50%)]" />

      <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            FitPreeti Yog Institute
          </h1>

          <p className="text-xl md:text-2xl text-neutral-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Yoga for <span className="text-primary-400 font-semibold">calm</span>. 
            Zumba for <span className="text-primary-400 font-semibold">energy</span>. 
            Dance for <span className="text-primary-400 font-semibold">joy</span>. 
            Fitness for <span className="text-white font-semibold">transformation</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              variant="accent"
              size="lg"
              onClick={onBookNow}
              className="hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Book Your Class
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.hash = '/services'}
              className="border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              Explore Classes
            </Button>
          </div>

          {/* SERVICES ICON GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {services.slice(0, 4).map((service: any, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="group p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-primary-500/50 transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-xl bg-white/20 group-hover:bg-primary-100 transition-colors">
                  <span className="text-white group-hover:text-neutral-900 transition-colors">
                    {serviceIcons[service.name]}
                  </span>
                </div>

                <p className="text-sm font-medium text-neutral-100 text-center">
                  {service.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
