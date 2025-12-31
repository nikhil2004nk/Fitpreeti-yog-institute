import { useRef } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import testimonials from '../../data/testimonials.json';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
}

export const TestimonialsSection: React.FC = () => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    adaptiveHeight: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings: { 
          slidesToShow: 1, 
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-neutral-50 relative overflow-hidden">
      {/* subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlY2ViZWYiIGZpbGwtb3BhY2l0eT0iMC41Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bS0yLjY2NyAwYzAgLjczNi0uNTk3IDEuMzMzLTEuMzMzIDEuMzMzLS43MzcgMC0xLjMzMy0uNTk3LTEuMzMzLTEuMzMzIDAtLjczNi41OTYtMS4zMzMgMS4zMzMtMS4zMzMuNzM2IDAgMS4zMzMuNTk3IDEuMzMzIDEuMzMzeiIvPjwvZz48L2c+PC9zdmc+')]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl relative">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-black to-red-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6 px-4">
            Real People, Real Results
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto px-4">
            Stories from students who found calm, energy and confidence with FitPreeti.
          </p>
        </div>

        {/* Slider */}
        <div className="relative px-2 sm:px-4 md:px-6 lg:px-10 pt-4 pb-12 sm:pb-16 md:pb-20">
          <Slider ref={sliderRef} {...settings} className="testimonial-slider">
            {(testimonials as Testimonial[]).map((testimonial, index) => (
              <div key={testimonial.id} className="px-2 sm:px-3 py-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full p-4 sm:p-6 md:p-8 bg-white border border-neutral-100 hover:border-red-100 hover:shadow-xl transition-all duration-300">
                    {/* Rating */}
                    <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                              i < testimonial.rating ? 'text-yellow-400' : 'text-neutral-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="text-sm sm:text-base md:text-lg text-neutral-700 italic mb-5 sm:mb-6 md:mb-8 leading-relaxed">
                      "{testimonial.quote}"
                    </p>

                    {/* Person */}
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                      />
                      <div className="ml-3 sm:ml-4 text-left min-w-0">
                        <h4 className="text-base sm:text-lg font-bold text-neutral-900 truncate">
                          {testimonial.name}
                        </h4>
                        <p className="text-red-600 text-xs sm:text-sm truncate">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            ))}
          </Slider>

          {/* Custom arrows */}
          <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 sm:space-x-4 z-10">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-red-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-red-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
