import { getAssetUrl } from '../utils/url';

export interface Trainer {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
  experience: string;
  certifications: string[];
  social?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

const trainerData = [
  {
    id: 'preeti',
    name: 'Preeti',
    role: 'Founder & Head Trainer',
    bio: 'With over 15 years of experience in yoga and fitness, Preeti has dedicated her life to helping others achieve their wellness goals through holistic practices.',
    image: '/images/trainers/preeti.jpg',
    specialties: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation', 'Prenatal Yoga'],
    experience: '15+ years',
    certifications: [
      'RYT 500 Yoga Alliance Certified',
      'Prenatal & Postnatal Yoga Specialist',
      'Yoga Therapy Certification',
      'Certified Nutritionist'
    ],
    social: {
      instagram: 'https://instagram.com/fitpreeti',
      facebook: 'https://facebook.com/fitpreeti',
    }
  },
  {
    id: 'rahul',
    name: 'Rahul',
    role: 'Senior Fitness Trainer',
    bio: 'A certified fitness expert with a passion for functional training and strength conditioning, Rahul helps clients build strength and confidence.',
    image: '/images/trainers/rahul.jpg',
    specialties: ['Strength Training', 'Functional Fitness', 'Weight Management', 'HIIT'],
    experience: '8 years',
    certifications: [
      'ACE Certified Personal Trainer',
      'CrossFit Level 1 Trainer',
      'Sports Nutrition Specialist',
      'Kettlebell Instructor'
    ],
    social: {
      instagram: 'https://instagram.com/rahulfitness',
      linkedin: 'https://linkedin.com/in/rahulfitness'
    }
  },
  {
    id: 'priya',
    name: 'Priya',
    role: 'Dance & Zumba Instructor',
    bio: 'With her infectious energy and passion for dance, Priya makes every workout feel like a party while ensuring great results.',
    image: '/images/trainers/priya.jpg',
    specialties: ['Zumba', 'Bollywood Dance', 'Aerobics', 'Cardio Dance'],
    experience: '6 years',
    certifications: [
      'Zumba Basic 1 & 2 Certified',
      'Zumba Toning Certified',
      'Aerobics and Fitness Association of America (AFAA) Certified',
      'Bollywood Dance Instructor Certification'
    ],
    social: {
      instagram: 'https://instagram.com/priyadancefit'
    }
  }
];

// Process the trainers data to include proper image URLs
const trainers: Trainer[] = trainerData.map(trainer => ({
  ...trainer,
  image: getAssetUrl(trainer.image)
}));

export { trainers };
