import { motion, type Variants } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { ServicesSection } from '../components/sections/ServicesSection';
import { Users, Clock, Award, Heart, MessageCircle, Zap } from 'lucide-react';

/* =======================
   Animations
======================= */

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* =======================
   Page
======================= */

export const Services: React.FC = () => {
  const handleBook = (serviceId: string) => {
    window.location.href = `/booking?service=${serviceId}`;
  };

  const stats = [
    { id: 1, name: "Happy Students", value: "500+", icon: Users },
    { id: 2, name: "Sessions Conducted", value: "5000+", icon: Clock },
    { id: 3, name: "Years of Experience", value: "10+", icon: Award },
    { id: 4, name: "Student Satisfaction", value: "98%", icon: Heart },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-gradient-to-b from-red-800 via-red-700/90 to-white">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeIn}
              className="mb-6 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm"
            >
              What We Offer
            </motion.span>

            <motion.h1 
              variants={fadeIn}
              className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-md"
            >
              Holistic Programs for a
              <span className="block">Healthier Body & Mind</span>
            </motion.h1>

            <motion.p 
              variants={fadeIn}
              className="mb-10 text-lg text-white/90 md:text-xl max-w-3xl"
            >
              At <strong>FitPreeti Yog Institute</strong>, we offer thoughtfully 
              designed yoga and fitness programs that focus on strength, 
              flexibility, mental clarity, and long-term wellness.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  variants={fadeIn}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="mb-1 text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-white/90">{stat.name}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <ServicesSection onBook={handleBook} />

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-600 to-red-800">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl bg-white/5 p-12 backdrop-blur-sm">
            <div className="relative z-10 text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-6 text-3xl font-bold text-white md:text-4xl"
              >
                Start Your Wellness Journey Today
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mx-auto mb-10 max-w-2xl text-lg text-white/90"
              >
                Experience expert-led yoga sessions, personalized guidance,
                and a supportive community committed to your growth.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => (window.location.href = '/booking')}
                  className="group"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Book a Free Trial Class
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  href="https://wa.me/91XXXXXXXXXX?text=Hello%20FitPreeti%20Yog%20Institute,%20I%20want%20to%20know%20more%20about%20your%20classes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-400/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-yellow-400/20 blur-3xl"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
