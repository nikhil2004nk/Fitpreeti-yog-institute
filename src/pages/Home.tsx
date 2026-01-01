import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/sections/HeroSection';
import { AnnouncementsSection } from '../components/sections/AnnouncementsSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { CTASection } from '../components/sections/CTASection';
import { Footer } from '../components/layout/Footer';

export const Home: React.FC = () => {

  const handleBookNow = () => {
    window.location.hash = '/booking';
  };

  const handleServiceBook = (serviceId: string) => {
    window.location.hash = `/booking?service=${serviceId}`;
  };

  return (
    <>
      <Navbar />
      <HeroSection onBookNow={handleBookNow} />
      <AnnouncementsSection />
      <ServicesSection onBook={handleServiceBook} />
      <TestimonialsSection />
      <CTASection onBook={handleBookNow} />
      <Footer />
    </>
  );
};
