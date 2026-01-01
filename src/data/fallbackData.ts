import type { Service } from '../services/services';
import type { Trainer } from '../services/trainers';
import { getAssetUrl } from '../utils/url';

// Fallback Services Data
const rawFallbackServices = [
  {
    id: 'fallback-1',
    service_name: 'Hatha Yoga Flow',
    description: 'Traditional yoga practice focusing on breath control, posture alignment, and mindful movement for all levels.',
    price: 299,
    type: 'Yoga',
    duration_minutes: 60,
    category: 'Yoga',
    image_url: '/images/yoga-hero.jpg',
    is_active: true,
  },
  {
    id: 'fallback-2',
    service_name: 'Zumba Fitness Party',
    description: 'High-energy Latin dance workout that combines cardio with fun choreography. Perfect for stress relief!',
    price: 349,
    type: 'Fitness',
    duration_minutes: 45,
    category: 'Zumba',
    image_url: '/images/zumba-hero.jpg',
    is_active: true,
  },
  {
    id: 'fallback-3',
    service_name: 'Bollywood Dance Fusion',
    description: 'Energetic Bollywood and contemporary dance mix. Learn iconic moves from popular Hindi films.',
    price: 399,
    type: 'Dance',
    duration_minutes: 60,
    category: 'Dance',
    image_url: '/images/dance-hero.jpg',
    is_active: true,
  },
  {
    id: 'fallback-4',
    service_name: 'Strength & HIIT',
    description: 'High-intensity interval training with bodyweight and resistance exercises for full-body transformation.',
    price: 449,
    type: 'Fitness',
    duration_minutes: 50,
    category: 'Fitness',
    image_url: '/images/fitness-hero.jpg',
    is_active: true,
  },
  {
    id: 'fallback-5',
    service_name: 'Vinyasa Flow Yoga',
    description: 'Dynamic, flowing yoga practice that connects breath with movement for a challenging and invigorating experience.',
    price: 349,
    type: 'Yoga',
    duration_minutes: 60,
    category: 'Yoga',
    image_url: '/images/yoga-hero.jpg',
    is_active: true,
  },
  {
    id: 'fallback-6',
    service_name: 'Pilates Core',
    description: 'Low-impact exercise focusing on core strength, flexibility, and overall body awareness.',
    price: 399,
    type: 'Fitness',
    duration_minutes: 45,
    category: 'Fitness',
    image_url: '/images/fitness-hero.jpg',
    is_active: true,
  },
];

// Process image URLs to include base path
export const fallbackServices: Service[] = rawFallbackServices.map(service => ({
  ...service,
  image_url: getAssetUrl(service.image_url),
}));

// Fallback Trainers Data
export const fallbackTrainers: Trainer[] = [
  {
    id: 'fallback-trainer-1',
    name: 'Priya Sharma',
    title: 'Senior Yoga Instructor',
    bio: 'Certified yoga instructor with 8+ years of experience in Hatha, Vinyasa, and restorative yoga. Passionate about helping students find balance and inner peace.',
    specializations: ['Hatha Yoga', 'Vinyasa Flow', 'Restorative Yoga'],
    profileImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    certifications: ['200-Hour Yoga Teacher Training', 'Yin Yoga Certification', 'Prenatal Yoga Specialist'],
    experienceYears: 8,
    rating: 4.9,
    totalReviews: 150,
    isActive: true,
    socialMedia: {
      instagram: 'https://instagram.com/priyayoga',
      youtube: 'https://youtube.com/@priyayoga',
    },
  },
  {
    id: 'fallback-trainer-2',
    name: 'Karan Singh',
    title: 'Fitness & Zumba Instructor',
    bio: 'Energetic fitness trainer specializing in Zumba, HIIT, and strength training. Known for making workouts fun and motivating.',
    specializations: ['Zumba', 'HIIT', 'Strength Training'],
    profileImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    certifications: ['Zumba Basic 1 & 2', 'ACE Certified Personal Trainer', 'HIIT Specialist'],
    experienceYears: 5,
    rating: 4.8,
    totalReviews: 120,
    isActive: true,
    socialMedia: {
      instagram: 'https://instagram.com/karansinghfit',
    },
  },
  {
    id: 'fallback-trainer-3',
    name: 'Riya Patel',
    title: 'Dance & Bollywood Instructor',
    bio: 'Professional dancer and choreographer with expertise in Bollywood, contemporary, and classical dance forms.',
    specializations: ['Bollywood Dance', 'Contemporary Dance', 'Classical Dance'],
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    certifications: ['Bollywood Dance Certification', 'Contemporary Dance Diploma', 'Dance Fitness Instructor'],
    experienceYears: 6,
    rating: 4.9,
    totalReviews: 100,
    isActive: true,
    socialMedia: {
      instagram: 'https://instagram.com/riyapateldance',
      youtube: 'https://youtube.com/@riyapateldance',
    },
  },
  {
    id: 'fallback-trainer-4',
    name: 'Ananya Mehta',
    title: 'Power Yoga & Meditation Instructor',
    bio: 'Advanced yoga practitioner specializing in power yoga, meditation, and mindfulness practices for mental and physical strength.',
    specializations: ['Power Yoga', 'Meditation', 'Mindfulness'],
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    certifications: ['300-Hour Advanced Yoga Training', 'Meditation Teacher Certification', 'Yoga Therapy Certification'],
    experienceYears: 7,
    rating: 5.0,
    totalReviews: 180,
    isActive: true,
    socialMedia: {
      instagram: 'https://instagram.com/ananyamehtayoga',
    },
  },
];

