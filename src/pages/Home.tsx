import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/sections/HeroSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { CTASection } from '../components/sections/CTASection';
import { Footer } from '../components/layout/Footer';

export const Home: React.FC = () => {
  const handleBookNow = () => {
    window.location.href = '/booking';
  };

  return (
    <>
      <Navbar />
      <HeroSection onBookNow={handleBookNow} />
      <ServicesSection onBook={(serviceId) => (window.location.href = `/booking?service=${serviceId}`)} />
      <TestimonialsSection />
      <CTASection onBook={handleBookNow} />
      <Footer />
    </>
  );
};
