import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export const CTASection: React.FC<{ onBook: () => void }> = ({ onBook }) => {
  return (
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
              onClick={onBook}
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
              href="https://wa.me/91XXXXXXXXXX?text=Hello%20FitPreeti%20Yog%20Institute,%20I%20would%20like%20to%20know%20more%20about%20your%20classes."
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
                  🙂
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
  );
};
