import { motion, type Variants } from "framer-motion";
import type { Service } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import services from "../../data/services";

/* =======================
   Animations
======================= */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2
    } 
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: 5, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1],
    } 
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

/* =======================
   Props
======================= */

interface ServicesSectionProps {
  onBook: (serviceId: string) => void;
  theme?: "red-black-corporate" | "default";
}

/* =======================
   Component
======================= */

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBook, theme = "default" }) => {
  // Theme-based classes
  const bgSection = theme === "red-black-corporate" ? "bg-white" : "bg-neutral-50";
  const textHeading = theme === "red-black-corporate" ? "text-red-900" : "text-neutral-900";
  const textBody = theme === "red-black-corporate" ? "text-gray-800" : "text-neutral-600";
  const badgeBg = theme === "red-black-corporate" ? "bg-red-100" : "bg-primary-100";
  const badgeText = theme === "red-black-corporate" ? "text-red-700" : "text-primary-700";
  const priceText = theme === "red-black-corporate" ? "text-red-700" : "text-primary-600";

  return (
    <section className={`${bgSection} py-32`}>
      <div className="container mx-auto max-w-7xl px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <h2 className={`mb-6 text-4xl font-bold md:text-5xl ${textHeading}`}>
            Our Services
          </h2>
          <p className={`mx-auto max-w-2xl text-xl leading-relaxed ${textBody}`}>
            Yoga, Zumba, dance and fitness training designed for beginners to advanced.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12"
        >
          {(services as Service[]).map((service) => (
            <motion.div 
              key={service.id} 
              variants={itemVariants}
              whileHover="hover"
              className="group relative"
            >
              <Card hoverEffect className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:border-transparent">
                <div className="relative mb-8 overflow-hidden rounded-3xl">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-64 w-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="absolute right-6 top-6">
                    <span className={`rounded-2xl px-4 py-2 text-xs font-bold shadow-lg ${badgeBg} ${badgeText}`}>
                      {service.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className={`mb-4 text-3xl font-bold ${textHeading}`}>
                  {service.name}
                </h3>

                <p className={`mb-6 text-lg leading-relaxed ${textBody}`}>
                  {service.description}
                </p>

                <div className="mb-6 flex items-center justify-between">
                  <span className={`text-3xl font-bold ${priceText}`}>
                    ₹{service.price}
                  </span>
                  <span className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-gray-700">
                    {service.duration}
                  </span>
                </div>

                <Button
                  variant={theme === "red-black-corporate" ? "accent" : "primary"}
                  size="lg"
                  fullWidth
                  onClick={() => onBook(service.id)}
                >
                  Book {service.name}
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
