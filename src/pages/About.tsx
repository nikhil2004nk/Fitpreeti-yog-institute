import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { 
  FiAward, FiHeart, FiUsers, FiActivity, FiInstagram, FiFacebook, FiLinkedin,
  FiStar, FiTrendingUp, FiTarget, FiZap, FiSmile, FiCalendar, FiClock,
  FiDollarSign, FiGlobe, FiHome, FiBook, FiVideo, FiMusic
} from 'react-icons/fi';
import instituteData from '../data/institute.json';
import { trainerService, type Trainer } from '../services/trainers';
import { getAssetUrl } from '../utils/url';
import { useContentSection } from '../hooks/useCMS';
import { fallbackTrainers } from '../data/fallbackData';

interface Milestone {
  year: string;
  title: string;
  description: string;
}

// Fallback data
const fallbackMilestones: Milestone[] = [
  {
    year: '2014',
    title: 'Humble Beginnings',
    description:
      'Started as a small neighborhood studio in Narnaund, bringing yoga to the community with personalized attention and care.',
  },
  {
    year: '2016',
    title: 'Expanding Horizons',
    description:
      'Introduced specialized yoga programs for different age groups and fitness levels, establishing ourselves as a community wellness hub.',
  },
  {
    year: '2018',
    title: 'Dance & Fitness',
    description:
      'Launched Zumba and Bollywood dance fitness programs, adding energy and variety to our class offerings.',
  },
  {
    year: '2020',
    title: 'Digital Transformation',
    description:
      'Pivoted to online classes during the pandemic, expanding our reach beyond Narnaund to students across India.',
  },
  {
    year: '2022',
    title: 'Corporate Wellness',
    description:
      'Partnered with local businesses to provide corporate wellness programs and team-building fitness sessions.',
  },
  {
    year: 'Today',
    title: '10+ Years Strong',
    description:
      'A trusted name in fitness with a decade of transforming lives through yoga, dance, and holistic wellness programs.',
  },
];

const fallbackStats = [
  { id: 1, name: 'Years of Excellence', value: '10+', icon: FiAward },
  { id: 2, name: 'Happy Students', value: '500+', icon: FiHeart },
  { id: 3, name: 'Classes Taught', value: '5000+', icon: FiUsers },
  { id: 4, name: 'Programs Offered', value: '10+', icon: FiActivity },
];

import type { Variants } from 'framer-motion';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: 'easeOut'
    } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: 5, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    },
  },
  hover: {
    y: -5,
    rotateX: 0,
    rotateY: 2,
    rotateZ: 0.5,
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -4,
    scale: 1.03,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

const milestoneVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};


export const About: React.FC = () => {
  const { name } = instituteData as any;
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch CMS data
  const { section: heroSection } = useContentSection('about_hero');
  const { section: statsSection } = useContentSection('about_stats');
  const { section: timelineSection } = useContentSection('about_timeline');

  // Get hero content with fallbacks
  const heroBadge = heroSection?.content?.badge || 'About Our Journey';
  const heroTitle = heroSection?.content?.title || `Empowering <span className="text-red-600">Lives</span> Through <br /><span className="text-red-600">Fitness</span> & Wellness`;
  const heroDescription = heroSection?.content?.description || `For over a decade, ${name} has been transforming lives in Narnaund and beyond through our passionate approach to yoga, dance, and holistic fitness. What started as a small neighborhood studio has grown into a thriving wellness community.`;
  const heroCTA = heroSection?.content?.cta_primary || { text: 'Start Your Journey Today', link: '/booking' };

  // Get stats with fallbacks
  const stats = useMemo(() => {
    if (statsSection?.content?.stats && Array.isArray(statsSection.content.stats) && statsSection.content.stats.length > 0) {
      return statsSection.content.stats.map((stat: any, index: number) => {
        const iconMap: Record<string, any> = {
          'award': FiAward,
          'heart': FiHeart,
          'users': FiUsers,
          'activity': FiActivity,
          'star': FiStar,
          'trending-up': FiTrendingUp,
          'target': FiTarget,
          'zap': FiZap,
          'smile': FiSmile,
          'calendar': FiCalendar,
          'clock': FiClock,
          'dollar-sign': FiDollarSign,
          'globe': FiGlobe,
          'home': FiHome,
          'book': FiBook,
          'video': FiVideo,
          'music': FiMusic,
        };
        const iconName = stat.icon?.toLowerCase() || '';
        return {
          id: index + 1,
          name: stat.name || '',
          value: stat.value || '',
          icon: iconMap[iconName] || fallbackStats[index]?.icon || FiAward
        };
      });
    }
    return fallbackStats;
  }, [statsSection]);

  // Get milestones with fallbacks
  const milestones = useMemo(() => {
    if (timelineSection?.content?.milestones && Array.isArray(timelineSection.content.milestones) && timelineSection.content.milestones.length > 0) {
      return timelineSection.content.milestones.map((milestone: any) => ({
        year: milestone.year || '',
        title: milestone.title || '',
        description: milestone.description || ''
      }));
    }
    return fallbackMilestones;
  }, [timelineSection]);

  // Get timeline section title and description
  const timelineTitle = timelineSection?.content?.title || 'A Decade of <span className="text-red-600">Transformation</span>';
  const timelineDescription = timelineSection?.content?.description || 'From our humble beginnings to becoming a cornerstone of the Narnaund community, our journey has been one of passion, dedication, and countless success stories.';

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await trainerService.getAllTrainers();
        // Filter only active trainers
        const activeTrainers = data.filter(t => t.isActive);
        if (activeTrainers.length > 0) {
          setTrainers(activeTrainers);
        } else {
          // Use fallback data if no active trainers from backend
          setTrainers(fallbackTrainers);
        }
      } catch (err) {
        console.error('Failed to load trainers:', err);
        // Use fallback data when backend fails
        setTrainers(fallbackTrainers);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  // Helper function to map backend trainer to frontend format
  const mapTrainer = (trainer: Trainer) => ({
    id: trainer.id,
    name: trainer.name,
    role: trainer.title || 'Trainer',
    bio: trainer.bio || '',
    image: trainer.profileImage ? getAssetUrl(trainer.profileImage) : '/images/trainer-placeholder.jpg',
    specialties: trainer.specializations || [],
    experience: trainer.experienceYears ? `${trainer.experienceYears}+ years` : 'Experienced',
    certifications: trainer.certifications || [],
    social: {
      instagram: trainer.socialMedia?.instagram,
      facebook: undefined, // Backend doesn't have facebook
      linkedin: undefined, // Backend doesn't have linkedin
    }
  });

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative pt-32 pb-16 md:pb-24 bg-white text-gray-900 overflow-hidden border-b border-gray-100"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-white opacity-80"></div>
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeIn} className="mb-6">
              <span className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                {heroBadge}
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
              dangerouslySetInnerHTML={{ __html: heroTitle }}
            />
            
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8 leading-relaxed"
            >
              {heroDescription}
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 mt-12">
              {heroCTA?.text && (
                <button
                  onClick={() => {
                    if (heroCTA.action === 'external' && heroCTA.link) {
                      window.open(heroCTA.link, '_blank', 'noopener,noreferrer');
                    } else if (heroCTA.link) {
                      if (window.location.hostname.includes('github.io')) {
                        window.location.href = `/Fitpreeti-yog-institute/#${heroCTA.link}`;
                      } else {
                        window.location.hash = heroCTA.link;
                      }
                    }
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-300"
                >
                  {heroCTA.text}
                </button>
              )}
              <button
                onClick={() => {
                  const element = document.getElementById('our-story');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 border-2 border-gray-900 rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                Our Story
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  variants={statCardVariants}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100 hover:border-transparent transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-red-700 transition-colors duration-300">{stat.value}</p>
                  <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{stat.name}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeIn}
              className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4"
            >
              Our Journey
            </motion.span>
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              dangerouslySetInnerHTML={{ __html: timelineTitle }}
            />
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              {timelineDescription}
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600 -ml-px"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={milestoneVariants}
                  className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
                >
                  <div className="hidden md:block flex-1">
                    {index % 2 === 0 && (
                      <motion.div
                        className="pr-12 text-right"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ x: -5 }}
                      >
                        <h3 className="text-xl font-bold text-gray-900 hover:text-red-700 transition-colors duration-300">{milestone.title}</h3>
                        <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">{milestone.description}</p>
                      </motion.div>
                    )}
                  </div>

                  <motion.div 
                    className="relative z-10 flex-shrink-0 w-24 h-24 rounded-full bg-white border-4 border-red-500 flex items-center justify-center shadow-lg mx-6 my-4 group"
                    whileHover={{ scale: 1.1, rotate: 2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <span className="text-2xl font-bold text-gray-900 group-hover:text-red-700 transition-colors duration-300">{milestone.year}</span>
                  </motion.div>

                  <div className="md:hidden flex-1 mt-4 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-red-700 transition-colors duration-300">{milestone.title}</h3>
                    <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">{milestone.description}</p>
                  </div>

                  <div className="hidden md:block flex-1">
                    {index % 2 !== 0 && (
                      <motion.div
                        className="pl-12"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ x: 5 }}
                      >
                        <h3 className="text-xl font-bold text-gray-900 hover:text-red-700 transition-colors duration-300">{milestone.title}</h3>
                        <p className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-300">{milestone.description}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeIn}
              className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4"
            >
              Our Philosophy
            </motion.span>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              More Than Just <span className="text-red-600">Fitness</span>
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
            >
              At {name}, we believe in a holistic approach to wellness that nurtures 
              the body, mind, and spirit through movement, community, and self-discovery.
            </motion.p>
          </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              className="p-8 rounded-2xl bg-white shadow-lg border border-gray-100 hover:border-transparent transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors duration-300">
                <FiHeart className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors duration-300">Why We Exist</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                We created {name} to be more than just a fitness center—it's a sanctuary where 
                everyone, regardless of age or fitness level, can find their path to wellness. 
                Our welcoming environment breaks down the barriers that often keep people from 
                starting their fitness journey.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-white shadow-lg border border-gray-100 hover:border-transparent transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors duration-300">
                <FiUsers className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors duration-300">Our Promise</h3>
              <ul className="space-y-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-red-500 mr-2 mt-1 group-hover:scale-125 transition-transform duration-300">•</span>
                  <span>Expert, personalized attention in every class</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-red-500 mr-2 mt-1 group-hover:scale-125 transition-transform duration-300">•</span>
                  <span>Safe, progressive training methods that respect your body</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-red-500 mr-2 mt-1 group-hover:scale-125 transition-transform duration-300">•</span>
                  <span>A supportive community that celebrates every achievement</span>
                </li>
                <li className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-red-500 mr-2 mt-1 group-hover:scale-125 transition-transform duration-300">•</span>
                  <span>Programs that evolve with your fitness journey</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-red-600">Expert Trainers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our certified and experienced trainers are passionate about helping you achieve your fitness goals.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading trainers...</p>
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No trainers available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => {
                const mappedTrainer = mapTrainer(trainer);
                return (
                  <motion.div
                    key={mappedTrainer.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={mappedTrainer.image} 
                        alt={mappedTrainer.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.dataset.fallbackSet) {
                            target.dataset.fallbackSet = 'true';
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e5e7eb" width="300" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                          } else {
                            target.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{mappedTrainer.name}</h3>
                          <p className="text-red-600 font-medium">{mappedTrainer.role}</p>
                        </div>
                        <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
                          {mappedTrainer.experience} Exp
                        </div>
                      </div>
                      
                      {mappedTrainer.bio && (
                        <p className="text-gray-600 mb-4">{mappedTrainer.bio}</p>
                      )}
                      
                      {mappedTrainer.specialties.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Specializes in:</h4>
                          <div className="flex flex-wrap gap-2">
                            {mappedTrainer.specialties.map((specialty, index) => (
                              <span 
                                key={index}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {mappedTrainer.certifications.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-2">Certifications:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {mappedTrainer.certifications.map((cert, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-red-500 mr-2 mt-1">•</span>
                                <span>{cert}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {mappedTrainer.social && (mappedTrainer.social.instagram || mappedTrainer.social.facebook || mappedTrainer.social.linkedin) && (
                        <div className="mt-6 flex space-x-4">
                          {mappedTrainer.social.instagram && (
                            <a 
                              href={mappedTrainer.social.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-pink-600 transition-colors"
                              aria-label={`${mappedTrainer.name}'s Instagram`}
                            >
                              <FiInstagram className="w-5 h-5" />
                            </a>
                          )}
                          {mappedTrainer.social.facebook && (
                            <a 
                              href={mappedTrainer.social.facebook} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              aria-label={`${mappedTrainer.name}'s Facebook`}
                            >
                              <FiFacebook className="w-5 h-5" />
                            </a>
                          )}
                          {mappedTrainer.social.linkedin && (
                            <a 
                              href={mappedTrainer.social.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-700 transition-colors"
                              aria-label={`${mappedTrainer.name}'s LinkedIn`}
                            >
                              <FiLinkedin className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Our Programs */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeIn}
              className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4"
            >
              What We Offer
            </motion.span>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Transformative <span className="text-red-600">Programs</span> for Everyone
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              From high-energy dance workouts to mindful yoga practices, our diverse 
              range of programs is designed to meet you where you are in your fitness journey.
            </motion.p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Yoga & Meditation',
                description: 'From gentle Hatha to dynamic Vinyasa, find your perfect practice to build strength, flexibility, and inner peace.',
                icon: '🧘‍♀️',
                color: 'bg-amber-50 text-amber-700',
                hoverColor: 'hover:bg-amber-100 hover:text-amber-800',
                borderColor: 'border-amber-200',
                iconBg: 'bg-amber-100'
              },
              {
                title: 'Zumba & Dance Fitness',
                description: 'High-energy dance workouts that make exercise feel like a celebration. No experience needed, just bring your energy!',
                icon: '💃',
                color: 'bg-pink-50 text-pink-700',
                hoverColor: 'hover:bg-pink-100 hover:text-pink-800',
                borderColor: 'border-pink-200',
                iconBg: 'bg-pink-100'
              },
              {
                title: 'Strength & Conditioning',
                description: 'Build functional strength and endurance with our progressive training programs suitable for all fitness levels.',
                icon: '💪',
                color: 'bg-blue-50 text-blue-700',
                hoverColor: 'hover:bg-blue-100 hover:text-blue-800',
                borderColor: 'border-blue-200',
                iconBg: 'bg-blue-100'
              },
              {
                title: 'Prenatal & Postnatal',
                description: 'Specialized programs to support women through pregnancy and the postpartum recovery journey.',
                icon: '🤰',
                color: 'bg-purple-50 text-purple-700',
                hoverColor: 'hover:bg-purple-100 hover:text-purple-800',
                borderColor: 'border-purple-200',
                iconBg: 'bg-purple-100'
              },
              {
                title: 'Kids & Teens',
                description: 'Fun, engaging fitness programs that help young people build healthy habits and confidence.',
                icon: '👧👦',
                color: 'bg-green-50 text-green-700',
                hoverColor: 'hover:bg-green-100 hover:text-green-800',
                borderColor: 'border-green-200',
                iconBg: 'bg-green-100'
              },
              {
                title: 'Senior Wellness',
                description: 'Gentle movement and strength exercises designed specifically for older adults to maintain mobility and independence.',
                icon: '👵👴',
                color: 'bg-indigo-50 text-indigo-700',
                hoverColor: 'hover:bg-indigo-100 hover:text-indigo-800',
                borderColor: 'border-indigo-200',
                iconBg: 'bg-indigo-100'
              }
            ].map((program, _index) => (
              <motion.div
                key={program.title}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className={`p-6 rounded-2xl ${program.color} ${program.borderColor ? `border ${program.borderColor}` : ''} shadow-sm hover:shadow-md transition-all duration-300 group h-full`}
              >
                <div className={`w-16 h-16 ${program.iconBg || 'bg-gray-100'} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{program.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:-translate-y-1 transition-transform duration-300">{program.title}</h3>
                <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">{program.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800 py-24 text-white">
        {/* Subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-[0.06]" />

        {/* Glow shapes */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />

        <div className="container relative mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              Begin Your Journey Towards a
              <span className="block text-white/95">Healthier & Balanced Life</span>
            </h2>

            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-red-100">
              At <strong>FitPreeti Yog Institute</strong>, we blend traditional yoga
              with modern fitness techniques to help you build strength, flexibility,
              and inner peace — guided by certified instructors.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => window.location.hash = '/booking'}
                className="group relative overflow-hidden bg-white px-8 text-red-700 hover:bg-red-50"
              >
                <span className="relative z-10 font-semibold">
                  Book a Free Trial Class
                </span>
                <span className="absolute inset-0 translate-x-full bg-red-100/40 transition-transform duration-500 group-hover:translate-x-0" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                href="https://wa.me/917039142314?text=Hello%20FitPreeti%20Yog%20Institute,%20I%20would%20like%20to%20know%20more%20about%20your%20classes."
                target="_blank"
                rel="noopener noreferrer"
                className="border-white/70 text-white hover:bg-white/10"
              >
                Talk to Us on WhatsApp
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-col items-center justify-center gap-2 text-white/90 sm:flex-row">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/40 bg-white/20 text-xs font-bold"
                  >
                    {['🧘‍♀️', '💪', '✨', '🌟', '🕉️'][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm sm:text-base">
                Trusted by <strong>500+ Happy Students</strong>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};
