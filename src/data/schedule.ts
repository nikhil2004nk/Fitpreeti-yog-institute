export interface ClassSchedule {
  time: string;
  name: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  type: 'Yoga' | 'Dance' | 'Fitness' | 'Meditation';
}

export interface WeeklySchedule {
  [key: string]: ClassSchedule[];
}

export const weeklySchedule: WeeklySchedule = {
  Mon: [
    { time: '6:00 AM - 7:00 AM', name: 'Morning Yoga Flow', instructor: 'Priya', level: 'Beginner', type: 'Yoga' },
    { time: '7:00 PM - 8:00 PM', name: 'Power Yoga', instructor: 'Ananya', level: 'Intermediate', type: 'Yoga' },
    { time: '8:00 PM - 9:00 PM', name: 'Bollywood Dance', instructor: 'Riya', level: 'All Levels', type: 'Dance' }
  ],
  Tue: [
    { time: '7:00 AM - 8:00 AM', name: 'Hatha Yoga', instructor: 'Meera', level: 'All Levels', type: 'Yoga' },
    { time: '6:30 PM - 7:30 PM', name: 'Zumba Fitness', instructor: 'Karan', level: 'All Levels', type: 'Fitness' }
  ],
  Wed: [
    { time: '6:00 AM - 7:00 AM', name: 'Vinyasa Flow', instructor: 'Ananya', level: 'Intermediate', type: 'Yoga' },
    { time: '7:30 PM - 8:30 PM', name: 'Surya Namaskar', instructor: 'Priya', level: 'All Levels', type: 'Yoga' }
  ],
  Thu: [
    { time: '7:00 AM - 8:00 AM', name: 'Pilates', instructor: 'Neha', level: 'Beginner', type: 'Fitness' },
    { time: '7:00 PM - 8:00 PM', name: 'Yin Yoga', instructor: 'Meera', level: 'All Levels', type: 'Yoga' }
  ],
  Fri: [
    { time: '6:00 AM - 7:00 AM', name: 'Sunrise Yoga', instructor: 'Ananya', level: 'All Levels', type: 'Yoga' },
    { time: '6:30 PM - 7:30 PM', name: 'Bollywood Dance', instructor: 'Riya', level: 'All Levels', type: 'Dance' }
  ],
  Sat: [
    { time: '7:00 AM - 8:00 AM', name: 'Weekend Warrior', instructor: 'Karan', level: 'Intermediate', type: 'Fitness' },
    { time: '9:00 AM - 10:00 AM', name: 'Family Yoga', instructor: 'Priya', level: 'All Levels', type: 'Yoga' }
  ],
  Sun: [
    { time: '7:00 AM - 8:00 AM', name: 'Meditation & Relaxation', instructor: 'Meera', level: 'All Levels', type: 'Meditation' },
    { time: '6:00 PM - 7:00 PM', name: 'Restorative Yoga', instructor: 'Ananya', level: 'Beginner', type: 'Yoga' }
  ]
};

export const instructors = {
  Priya: { specialty: 'Hatha & Vinyasa', experience: '8 years' },
  Ananya: { specialty: 'Power Yoga', experience: '6 years' },
  Riya: { specialty: 'Bollywood Dance', experience: '5 years' },
  Meera: { specialty: 'Yin & Restorative', experience: '7 years' },
  Karan: { specialty: 'Fitness Training', experience: '4 years' },
  Neha: { specialty: 'Pilates', experience: '5 years' }
};
