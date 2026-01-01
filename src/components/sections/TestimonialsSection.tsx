import { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { reviewService, type Review } from '../../services/reviews';
import { getAssetUrl } from '../../utils/url';
import testimonialsFallback from '../../data/testimonials.json';

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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Fetch approved reviews from API
        const reviews = await reviewService.getApprovedReviews();
        
        if (reviews && reviews.length > 0) {
          // Map Review to Testimonial format
          const mappedTestimonials: Testimonial[] = reviews.map((review: Review) => ({
            id: review.id,
            name: review.user_name,
            role: review.reviewer_type || 'Student',
            image: review.user_profile_image 
              ? getAssetUrl(review.user_profile_image)
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
            quote: review.comment,
            rating: review.rating,
          }));
          
          // Limit to 10 reviews for homepage display
          setTestimonials(mappedTestimonials.slice(0, 10));
        } else {
          // Fallback to static testimonials if no reviews
          setTestimonials(testimonialsFallback as Testimonial[]);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        // Fallback to static testimonials on error
        setTestimonials(testimonialsFallback as Testimonial[]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const settings = {
    dots: true,
    infinite: testimonials.length > 1,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: testimonials.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    adaptiveHeight: false,
    arrows: false,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    touchThreshold: 5,
    draggable: true,
    fade: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: { 
          slidesToShow: 3, 
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: { 
          slidesToShow: 2, 
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: { 
          slidesToShow: 1, 
          slidesToScroll: 1,
          dots: true,
          centerMode: true,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 640,
        settings: { 
          slidesToShow: 1, 
          slidesToScroll: 1,
          dots: true,
          centerMode: true,
          centerPadding: '30px',
        },
      },
      {
        breakpoint: 480,
        settings: { 
          slidesToShow: 1, 
          slidesToScroll: 1,
          dots: true,
          centerMode: false,
          centerPadding: '0px',
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
        <div className="relative px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 pt-4 pb-16 sm:pb-20 md:pb-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-3 border-red-600 border-t-transparent"></div>
              <p className="mt-4 text-sm sm:text-base text-neutral-600">Loading reviews...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-base sm:text-lg text-neutral-600">No reviews available at the moment.</p>
            </div>
          ) : (
            <>
              <Slider ref={sliderRef} {...settings} className="testimonial-slider">
                {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="px-2 sm:px-3 md:px-4 focus:outline-none">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card className="h-full p-5 sm:p-6 md:p-7 lg:p-8 bg-white border border-neutral-200 hover:border-red-200 hover:shadow-2xl transition-all duration-300 rounded-xl flex flex-col">
                      {/* Rating */}
                      <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                        <div className="flex gap-0.5 sm:gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-colors ${
                                i < testimonial.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-neutral-200 fill-current'
                              }`}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-neutral-500 font-medium">
                          {testimonial.rating}/5
                        </span>
                      </div>

                      {/* Quote */}
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-700 italic mb-6 sm:mb-7 md:mb-8 leading-relaxed flex-grow line-clamp-4 sm:line-clamp-none">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>

                      {/* Person */}
                      <div className="flex items-center pt-4 border-t border-neutral-100">
                        <div className="relative flex-shrink-0">
                          <img
                            src={testimonial.image}
                            alt={`${testimonial.name} - ${testimonial.role}`}
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-lg ring-2 ring-neutral-100"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.dataset.fallbackSet) {
                                target.dataset.fallbackSet = 'true';
                                target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face';
                              }
                            }}
                          />
                        </div>
                        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 truncate">
                            {testimonial.name}
                          </h4>
                          <p className="text-red-600 text-xs sm:text-sm md:text-base font-medium truncate mt-0.5">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              ))}
              </Slider>
            </>
          )}

          {/* Custom arrows - only show when testimonials are loaded and more than 1 slide */}
          {!loading && testimonials.length > 1 && (
            <>
              {/* Desktop arrows */}
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between px-2 lg:px-4 pointer-events-none z-20">
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white hover:bg-red-50 text-red-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto group"
                  aria-label="Previous testimonial"
                >
                  <FiChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 group-hover:translate-x-[-2px] transition-transform" />
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white hover:bg-red-50 text-red-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto group"
                  aria-label="Next testimonial"
                >
                  <FiChevronRight className="w-6 h-6 lg:w-7 lg:h-7 group-hover:translate-x-[2px] transition-transform" />
                </button>
              </div>
              
              {/* Mobile/Tablet bottom arrows */}
              <div className="md:hidden absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="w-11 h-11 rounded-full bg-white hover:bg-red-50 text-red-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                  aria-label="Previous testimonial"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className="w-11 h-11 rounded-full bg-white hover:bg-red-50 text-red-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                  aria-label="Next testimonial"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
