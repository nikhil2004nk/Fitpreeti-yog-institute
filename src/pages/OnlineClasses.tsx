import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { weeklySchedule, type ClassSchedule } from '../data/schedule';
import { 
  Video, Clock, Users, ShieldCheck, Calendar, 
  UserCheck, Smartphone, Heart, Award, 
  MessageCircle, Clock3, User 
} from 'lucide-react';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: 5, scale: 0.98 },
  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  hover: { y: -5, scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)', transition: { duration: 0.3, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const ClassCard: React.FC<{ cls: ClassSchedule }> = ({ cls }) => {
  const levelStyles = {
    'Beginner': 'bg-red-100 text-red-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-purple-100 text-purple-800',
    'All Levels': 'bg-green-100 text-green-800',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="md:col-span-2 flex items-center">
        <Clock3 className="w-5 h-5 text-red-600 mr-2" />
        <span className="font-medium">{cls.time}</span>
      </div>
      <div className="md:col-span-4">
        <h4 className="font-semibold text-gray-900">{cls.name}</h4>
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <User className="w-4 h-4 mr-1" />
          <span>With {cls.instructor}</span>
          <span className="mx-2">•</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{cls.type}</span>
        </div>
      </div>
      <div className="md:col-span-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${levelStyles[cls.level]}`}>
          {cls.level}
        </span>
      </div>
      <div className="md:col-span-3 flex justify-end">
        <a
          href={`/booking?class=${encodeURIComponent(cls.name.toLowerCase().replace(/\s+/g, '-'))}`}
          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center"
        >
          Join Now
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export const OnlineClasses: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Mon');
  const days = Object.keys(weeklySchedule);

  const stats = [
    { id: 1, name: "Live Sessions", value: "1000+", icon: Video },
    { id: 2, name: "Happy Students", value: "500+", icon: Users },
    { id: 3, name: "Years Experience", value: "8+", icon: Award },
    { id: 4, name: "Satisfaction", value: "98%", icon: Heart },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-gradient-to-b from-red-800 via-red-700/90 to-white">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.span variants={fadeIn} className="mb-6 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              Join Us From Anywhere
            </motion.span>
            <motion.h1 variants={fadeIn} className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">
              Live Online Yoga & Fitness
              <span className="block">Classes That Inspire</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="mb-10 text-lg text-white/90 md:text-xl max-w-3xl">
              Practice yoga, dance, and fitness from the comfort of your home —
              guided live by certified FitPreeti Yog Institute trainers.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-wrap gap-6 mt-8">
              <a
                href="https://wa.me/917039142314"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden px-8 py-3.5 text-base font-semibold bg-white text-red-600 hover:bg-gray-100 rounded-full transition-all duration-300 flex items-center justify-center"
              >
                <span className="relative z-10">Join Live Class</span>
              </a>
              <a
                href="#schedule"
                className="px-8 py-3.5 text-base font-semibold border-2 border-white text-white hover:bg-white/10 transition-all duration-300 rounded-full flex items-center justify-center"
              >
                View Schedule
              </a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map(stat => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.id} variants={fadeIn} whileHover={{ y: -4 }} className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm shadow-lg">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="mb-1 text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm font-medium text-white/90">{stat.name}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Weekly Schedule */}
    <section id="schedule" className="py-24 bg-white">
  <div className="container mx-auto max-w-6xl px-6 lg:px-12">
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.6 }} 
      className="text-center mb-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Weekly Class Schedule</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Join our live classes from anywhere. Times are in IST (UTC+5:30).
      </p>
    </motion.div>

    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex w-max border-b border-gray-200">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-4 px-4 text-center font-medium text-sm md:text-base transition-colors whitespace-nowrap ${
                selectedDay === day
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="p-4 md:p-6 space-y-4">
        {weeklySchedule[selectedDay].length > 0 ? (
          weeklySchedule[selectedDay].map((cls, index) => (
            <ClassCard key={`${selectedDay}-${index}`} cls={cls} />
          ))
        ) : (
          <p className="text-center py-8 text-gray-500">
            No classes scheduled for {selectedDay}day.
          </p>
        )}

        {/* Custom Schedule CTA */}
        <div className="mt-12 text-center px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Can't Find a Suitable Time?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We offer private sessions and custom group classes. Contact us to schedule at your convenience.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 text-base font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition-all duration-300"
          >
            Contact Us for Custom Schedule
          </a>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Features & Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12">
          {/* Features */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid gap-8 md:grid-cols-2 mb-20">
            {/* How it Works */}
            <motion.div variants={cardVariants} whileHover="hover" className="group p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors duration-300">
                <Video className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors duration-300">How Online Classes Work</h2>
              <ul className="space-y-3 text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                <li className="flex gap-3"><Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /> Live morning & evening batches</li>
                <li className="flex gap-3"><Smartphone className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /> Zoom link shared before each session</li>
                <li className="flex gap-3"><Video className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /> Session recordings available</li>
              </ul>
            </motion.div>

            {/* Who Should Join */}
            <motion.div variants={cardVariants} whileHover="hover" className="group p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors duration-300">
                <Users className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors duration-300">Who Should Join</h2>
              <ul className="space-y-3 text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                <li className="flex gap-3"><span className="w-5 h-5 text-red-600">•</span> Working professionals</li>
                <li className="flex gap-3"><span className="w-5 h-5 text-red-600">•</span> Students & remote learners</li>
                <li className="flex gap-3"><span className="w-5 h-5 text-red-600">•</span> Beginners to intermediate</li>
                <li className="flex gap-3"><span className="w-5 h-5 text-red-600">•</span> Home workout enthusiasts</li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Benefits */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What You'll Experience</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[{icon:ShieldCheck,text:'Safe & guided sessions',description:'Expert-led classes focused on proper form and technique'},
                {icon:UserCheck,text:'Certified instructors',description:'Learn from experienced and certified yoga professionals'},
                {icon:Calendar,text:'Structured schedule',description:'Consistent class times to build a regular practice'},
                {icon:Video,text:'Live interaction',description:'Real-time feedback and personalized attention'},
                {icon:Clock,text:'Flexible timings',description:'Morning and evening sessions to fit your schedule'},
                {icon:Users,text:'Community support',description:'Connect with like-minded individuals on the same journey'}].map((item,index)=>{
                const Icon=item.icon;
                return(
                  <motion.div key={index} variants={cardVariants} whileHover="hover" className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-700 transition-colors duration-300">{item.text}</h3>
                    <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-700 to-red-900 text-white">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Practice?</h2>
            <p className="mx-auto mb-10 text-lg text-red-100 max-w-2xl">Join our online community and experience guided yoga & fitness at home.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={()=>window.location.href='/booking?mode=online'} className="group relative overflow-hidden px-8 py-3.5 text-base font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition-all duration-300">
                <span className="relative z-10 font-semibold">Book Your First Class</span>
                <span className="absolute inset-0 translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0"/>
              </button>
              <a href="https://wa.me/917039142314" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border-2 border-white/70 text-white hover:bg-white/10 rounded-full transition-all duration-300">
                <MessageCircle className="w-5 h-5 mr-2"/> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      <Footer />

    </div>
  )};
