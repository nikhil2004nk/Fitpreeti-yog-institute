import { motion, type Variants } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ROUTES } from '../constants/routes';
import { navigateTo } from '../utils/navigation';
import { Users, Clock, Award, Heart, Briefcase, Calendar, Target, Users as Team, Zap, Shield, MessageCircle } from 'lucide-react';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: 5, scale: 0.98 },
  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  hover: {
    y: -5,
    rotateX: 0,
    rotateY: 2,
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export const CorporateWellness: React.FC = () => {
  const stats = [
    { id: 1, name: "Corporate Clients", value: "50+", icon: Briefcase },
    { id: 2, name: "Sessions Conducted", value: "1000+", icon: Clock },
    { id: 3, name: "Years of Experience", value: "8+", icon: Award },
    { id: 4, name: "Employee Satisfaction", value: "96%", icon: Heart },
  ];

  const features = [
    { icon: Team, title: "For HR & Leaders", description: "Offer a meaningful benefit that improves mood, health, and employee retention." },
    { icon: Calendar, title: "Flexible Formats", description: "One-time events, weekly sessions, or monthly wellness programs at your office or online." },
    { icon: Target, title: "Custom for Your Team", description: "We adapt intensity, timing, and focus areas based on your team's profile and needs." },
  ];

  const benefits = [
    { icon: Zap, text: 'Reduced stress & anxiety' },
    { icon: Shield, text: 'Improved team cohesion' },
    { icon: MessageCircle, text: 'Better communication' },
    { icon: Users, text: 'Increased productivity' },
    { icon: Heart, text: 'Enhanced wellbeing' },
    { icon: Clock, text: 'Flexible scheduling' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 bg-gradient-to-b from-red-800 via-red-700/90 to-white">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.span
              variants={fadeIn}
              className="mb-6 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm"
            >
              Corporate Wellness Programs
            </motion.span>

            <motion.h1
              variants={fadeIn}
              className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-md"
            >
              Transform Your Workplace
              <span className="block">Through Wellness</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="mb-10 text-lg text-white/90 md:text-xl max-w-3xl"
            >
              On-site and online yoga sessions designed to reduce stress, improve focus, and boost energy levels across your organization.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-wrap gap-6 mt-8">
              <button
                onClick={() => navigateTo('/booking?service=corporate')}
                className="relative overflow-hidden px-8 py-3.5 text-base font-semibold bg-white text-red-600 hover:bg-gray-100 rounded-full transition-all duration-300 flex items-center justify-center"
              >
                <span className="relative z-10">Request Corporate Program</span>
              </button>
              <button
                onClick={() => navigateTo(ROUTES.CONTACT)}
                className="px-8 py-3.5 text-base font-semibold border-2 border-white text-white hover:bg-white/10 transition-all duration-300 rounded-full flex items-center justify-center"
              >
                Contact Us
              </button>
            </motion.div>
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
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="mb-1 text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm font-medium text-white/90">{stat.name}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid gap-8 md:grid-cols-3 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={cardVariants} whileHover="hover" className="group p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:border-transparent transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-700 group-hover:text-gray-800 transition-colors duration-300">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Benefits */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Benefits for Your Team</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4 hover:bg-white hover:shadow-sm transition">
                    <Icon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800">{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-red-700 to-red-900 text-white">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Workplace?</h2>
            <p className="mx-auto mb-10 text-lg text-red-100 max-w-2xl">Request a complimentary consultation to discuss how our corporate wellness programs can benefit your team.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.hash = '/booking?service=corporate'}
                className="group relative overflow-hidden px-8 py-4 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 inline-flex items-center justify-center"
              >
                <span className="relative z-10">Request Consultation</span>
                <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                onClick={() => window.location.hash = ROUTES.CONTACT}
                className="px-8 py-4 text-lg font-semibold border-2 border-white/70 text-white hover:bg-white/10 transition-all duration-300 rounded-full inline-flex items-center justify-center"
              >
                Contact Our Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
