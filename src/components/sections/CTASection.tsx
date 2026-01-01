import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { useContentSection } from "../../hooks/useCMS";

export const CTASection: React.FC<{ onBook: () => void }> = ({ onBook }) => {
  const { section: ctaSection } = useContentSection('cta_home');

  // Fallback to hardcoded content if CMS data is unavailable
  // This ensures the site works even if the CMS API is down or not configured
  const title = ctaSection?.content?.title || 'Begin Your Journey Towards a Healthier & Balanced Life';
  const subtitle = ctaSection?.content?.subtitle || 'At FitPreeti Yog Institute, we blend traditional yoga with modern fitness techniques to help you build strength, flexibility, and inner peace — guided by certified instructors.';
  const ctaPrimary = ctaSection?.content?.cta_primary || { text: 'Book a Free Trial Class', link: '/booking', action: 'navigate' };
  const ctaSecondary = ctaSection?.content?.cta_secondary || { text: 'Talk to Us on WhatsApp', link: 'https://wa.me/917039142314', action: 'external' };
  const socialProof = ctaSection?.content?.social_proof || { text: 'Trusted by 500+ Happy Students', show_avatars: true };
  const bgColor = ctaSection?.content?.background_color || '#dc2626';

  const handleCTAClick = (cta: any) => {
    if (cta?.action === 'external' && cta?.link) {
      window.open(cta.link, '_blank', 'noopener,noreferrer');
    } else if (cta?.link) {
      if (window.location.hostname.includes('github.io')) {
        window.location.href = `/Fitpreeti-yog-institute/#${cta.link}`;
      } else {
        window.location.hash = cta.link;
      }
    } else {
      onBook();
    }
  };

  return (
    <section 
      className="relative overflow-hidden py-24 text-white"
      style={{ backgroundColor: bgColor }}
    >
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
            {title.split('\n').map((line: string, i: number) => (
              <span key={i} className={i > 0 ? 'block text-white/95' : ''}>{line}</span>
            ))}
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/90">
            {subtitle}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {ctaPrimary && (
              <Button
                size="lg"
                onClick={() => handleCTAClick(ctaPrimary)}
                className="group relative overflow-hidden bg-white px-8 text-red-700 hover:bg-red-50"
              >
                <span className="relative z-10 font-semibold">
                  {ctaPrimary.text}
                </span>
                <span className="absolute inset-0 translate-x-full bg-red-100/40 transition-transform duration-500 group-hover:translate-x-0" />
              </Button>
            )}

            {ctaSecondary && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleCTAClick(ctaSecondary)}
                className="border-white/70 text-white hover:bg-white/10"
              >
                {ctaSecondary.text}
              </Button>
            )}
          </div>

          {/* Social proof */}
          {socialProof?.text && (
            <div className="mt-10 flex flex-col items-center justify-center gap-2 text-white/90 sm:flex-row">
              {socialProof.show_avatars && (
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
              )}
              <span className="text-sm sm:text-base">
                {socialProof.text}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
