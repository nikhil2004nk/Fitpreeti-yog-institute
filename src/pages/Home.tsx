import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/sections/HeroSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { CTASection } from '../components/sections/CTASection';
import { Footer } from '../components/layout/Footer';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking');
  };

  const handleServiceBook = (serviceId: string) => {
    navigate(`/booking?service=${serviceId}`);
  };

  return (
    <>
      <Navbar />
      <HeroSection onBookNow={handleBookNow} />
      <ServicesSection onBook={handleServiceBook} />
      <TestimonialsSection />
      <CTASection onBook={handleBookNow} />
      <Footer />
    </>
  );
};
