export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  CONTACT: '/contact',
  BOOKING: '/booking',
  CORPORATE: '/corporate-wellness',
  ONLINE: '/online-classes',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  // Admin Management Routes
  ADMIN_USERS: '/admin/users',
  ADMIN_TRAINERS: '/admin/trainers',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_CLASS_SCHEDULES: '/admin/class-schedules',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_CMS: '/admin/cms',
  ADMIN_ATTENDANCE: '/admin/attendance',
  // Customer Management Routes
  CUSTOMER_BOOKINGS: '/customer/bookings',
  CUSTOMER_PROFILE: '/customer/profile',
  CUSTOMER_ATTENDANCE: '/customer/attendance',
  // Trainer Management Routes
  TRAINER_ATTENDANCE: '/trainer/attendance'
} as const;
