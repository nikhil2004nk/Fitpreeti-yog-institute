import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Booking } from './pages/Booking';
import { OnlineClasses } from './pages/OnlineClasses';
import { CorporateWellness } from './pages/CorporateWellness';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
// Admin Management Pages
import { UserManagement } from './pages/admin/UserManagement';
import { TrainerManagement } from './pages/admin/TrainerManagement';
import { ServiceManagement } from './pages/admin/ServiceManagement';
import { ReviewManagement } from './pages/admin/ReviewManagement';
import { ClassScheduleManagement } from './pages/admin/ClassScheduleManagement';
import { BookingManagement } from './pages/admin/BookingManagement';
import { CMSManagement } from './pages/admin/CMSManagement';
import { AttendanceManagement } from './pages/admin/AttendanceManagement';
// Customer Management Pages
import { MyBookings } from './pages/customer/MyBookings';
import { MyProfile } from './pages/customer/MyProfile';
import { CustomerAttendance } from './pages/customer/CustomerAttendance';
// Trainer Management Pages
import { TrainerAttendance } from './pages/trainer/TrainerAttendance';
import { TrainerProfile } from './pages/trainer/TrainerProfile';
import { TrainerSchedule } from './pages/trainer/TrainerSchedule';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/online-classes" element={<OnlineClasses />} />
      <Route path="/corporate-wellness" element={<CorporateWellness />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      {/* Admin Management Routes */}
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/trainers" 
        element={
          <ProtectedRoute requiredRole="admin">
            <TrainerManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/services" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ServiceManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/reviews" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ReviewManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/class-schedules" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ClassScheduleManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/bookings" 
        element={
          <ProtectedRoute requiredRole="admin">
            <BookingManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/cms" 
        element={
          <ProtectedRoute requiredRole="admin">
            <CMSManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/attendance" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AttendanceManagement />
          </ProtectedRoute>
        } 
      />
      {/* Customer Management Routes */}
      <Route 
        path="/customer/bookings" 
        element={
          <ProtectedRoute requiredRole="customer">
            <MyBookings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/profile" 
        element={
          <ProtectedRoute requiredRole="customer">
            <MyProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/attendance" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerAttendance />
          </ProtectedRoute>
        } 
      />
      {/* Trainer Management Routes */}
      <Route 
        path="/trainer/attendance" 
        element={
          <ProtectedRoute requiredRole="trainer">
            <TrainerAttendance />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trainer/schedule" 
        element={
          <ProtectedRoute requiredRole="trainer">
            <TrainerSchedule />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trainer/profile" 
        element={
          <ProtectedRoute requiredRole="trainer">
            <TrainerProfile />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;
