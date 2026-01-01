import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { attendanceService } from '../../services/attendance';
import { userService } from '../../services/users';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, CheckCircle, XCircle, Search, Edit, Trash2, 
  Clock, UserCheck, Shield, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import type { Attendance, User, CreateAttendanceData } from '../../types';

export const AttendanceManagement: React.FC = () => {
  useAuth(); // For authentication check
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<Attendance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'trainer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  // Form states
  const [showRangeForm, setShowRangeForm] = useState(false);
  const [formData, setFormData] = useState<CreateAttendanceData & { user_ids?: string[]; date_range?: { start: string; end: string }; selected_dates?: string[] }>({
    user_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateSelectionMode, setDateSelectionMode] = useState<'single' | 'range' | 'multiple'>('single');

  // Calendar view states
  const [showCalendar, setShowCalendar] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateAttendance, setDateAttendance] = useState<{
    present: Attendance[];
    absent: Attendance[];
    notMarked: User[];
  }>({ present: [], absent: [], notMarked: [] });
  const [loadingDateAttendance, setLoadingDateAttendance] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [dateModalSearchTerm, setDateModalSearchTerm] = useState<string>('');
  const [bulkFormSearchTerm, setBulkFormSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchAttendance();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchDateAttendance(selectedDate);
    }
  }, [selectedDate, users]);

  // Apply filters when attendance data changes
  useEffect(() => {
    filterAttendance();
  }, [attendance]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      // Fetch all attendance data - filtering will be done client-side
      const data = await attendanceService.getAllAttendance();
      setAttendance(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data.filter(u => u.role === 'customer' || u.role === 'trainer'));
    } catch (err: any) {
      console.error('Failed to load users:', err);
    }
  };

  const filterAttendance = () => {
    let filtered = [...attendance];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.user_name?.toLowerCase().includes(term) ||
        a.date.includes(term) ||
        a.notes?.toLowerCase().includes(term)
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(a => a.user_role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Filter by user
    if (selectedUserId) {
      filtered = filtered.filter(a => a.user_id === selectedUserId);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(a => a.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(a => a.date <= endDate);
    }

    setFilteredAttendance(filtered);
  };


  const handleRangeMark = async () => {
    if (!formData.user_ids || formData.user_ids.length === 0) {
      alert('Please select at least one user');
      return;
    }

    let dates: string[] = [];

    if (dateSelectionMode === 'range' && formData.date_range) {
      // Generate dates in range
      const start = new Date(formData.date_range.start);
      const end = new Date(formData.date_range.end);
      
      if (start > end) {
        alert('Start date must be before or equal to end date');
        return;
      }

      const currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (dateSelectionMode === 'multiple' && formData.selected_dates && formData.selected_dates.length > 0) {
      dates = formData.selected_dates;
    } else if (dateSelectionMode === 'single' && formData.date) {
      dates = [formData.date];
    } else {
      alert('Please select at least one date');
      return;
    }

    if (dates.length === 0) {
      alert('Please select at least one date');
      return;
    }

    if (!window.confirm(`Mark ${formData.user_ids.length} user(s) as ${formData.status} for ${dates.length} date(s)?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      let successCount = 0;
      let failCount = 0;

      // Mark attendance for each date
      for (const date of dates) {
        try {
          await attendanceService.markBulkAttendance({
            user_ids: formData.user_ids,
            date: date,
            status: formData.status,
            notes: formData.notes || `Bulk marked for date range by admin`
          });
          successCount++;
        } catch (err) {
          failCount++;
          console.error(`Failed to mark attendance for ${date}:`, err);
        }
      }

      if (failCount === 0) {
        alert(`Successfully marked ${formData.user_ids.length} user(s) as ${formData.status} for ${dates.length} date(s)`);
      } else {
        alert(`Marked attendance for ${successCount} date(s). Failed for ${failCount} date(s).`);
      }

      resetForm();
      await fetchAttendance();
    } catch (err: any) {
      alert(err?.message || 'Failed to mark attendance for date range');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDateSelection = (date: string) => {
    const currentDates = formData.selected_dates || [];
    if (currentDates.includes(date)) {
      setFormData({
        ...formData,
        selected_dates: currentDates.filter(d => d !== date)
      });
    } else {
      setFormData({
        ...formData,
        selected_dates: [...currentDates, date]
      });
    }
  };

  const generateDateRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;

    try {
      await attendanceService.deleteAttendance(id);
      alert('Attendance record deleted successfully');
      await fetchAttendance();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete attendance');
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      notes: ''
    });
    setShowRangeForm(false);
    setBulkFormSearchTerm('');
    setDateSelectionMode('single');
  };

  const openEditForm = (record: Attendance) => {
    setFormData({
      user_id: record.user_id,
      date: record.date,
      status: record.status,
      notes: record.notes || '',
      user_ids: [record.user_id]
    });
    setDateSelectionMode('single');
    setShowRangeForm(true);
  };

  const fetchDateAttendance = async (date: string) => {
    setLoadingDateAttendance(true);
    setSelectedUsers(new Set()); // Reset selections
    setDateModalSearchTerm(''); // Reset search
    try {
      const attendanceData = await attendanceService.getAllAttendance({
        start_date: date,
        end_date: date
      });

      const present = attendanceData.filter(a => a.status === 'present');
      const absent = attendanceData.filter(a => a.status === 'absent');
      
      // Find users who haven't marked attendance
      const markedUserIds = new Set(attendanceData.map(a => a.user_id));
      const notMarked = users.filter(u => !markedUserIds.has(u.id || u.sub || ''));

      setDateAttendance({ present, absent, notMarked });
      setShowDateModal(true);
    } catch (err: any) {
      alert(err?.message || 'Failed to load attendance for date');
    } finally {
      setLoadingDateAttendance(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const selectAllUsers = (userList: User[]) => {
    const allSelected = userList.every(u => selectedUsers.has(u.id || u.sub || ''));
    if (allSelected) {
      // Deselect all
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        userList.forEach(u => {
          const id = u.id || u.sub || '';
          if (id) newSet.delete(id);
        });
        return newSet;
      });
    } else {
      // Select all
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        userList.forEach(u => {
          const id = u.id || u.sub || '';
          if (id) newSet.add(id);
        });
        return newSet;
      });
    }
  };

  const handleBulkMarkFromModal = async (status: 'present' | 'absent') => {
    if (selectedUsers.size === 0) {
      alert('Please select at least one user');
      return;
    }

    if (!window.confirm(`Mark ${selectedUsers.size} user(s) as ${status}?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      await attendanceService.markBulkAttendance({
        user_ids: Array.from(selectedUsers),
        date: selectedDate,
        status,
        notes: `Bulk marked as ${status} by admin`
      });
      alert(`Successfully marked ${selectedUsers.size} user(s) as ${status}`);
      setSelectedUsers(new Set());
      await fetchDateAttendance(selectedDate);
      await fetchAttendance(); // Refresh main attendance list
    } catch (err: any) {
      alert(err?.message || 'Failed to mark attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIndividualMark = async (userId: string, status: 'present' | 'absent') => {
    try {
      setIsSubmitting(true);
      await attendanceService.markAttendanceForUser({
        user_id: userId,
        date: selectedDate,
        status,
        notes: `Marked as ${status} by admin`
      });
      await fetchDateAttendance(selectedDate);
      await fetchAttendance();
    } catch (err: any) {
      alert(err?.message || 'Failed to mark attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getAttendanceForDate = (date: Date): { present: number; absent: number; total: number } => {
    const dateStr = date.toISOString().split('T')[0];
    const dayAttendance = attendance.filter(a => a.date === dateStr);
    const present = dayAttendance.filter(a => a.status === 'present').length;
    const absent = dayAttendance.filter(a => a.status === 'absent').length;
    return { present, absent, total: dayAttendance.length };
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-20"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const attendanceData = getAttendanceForDate(date);
      const isToday = date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
      const hasAttendance = attendanceData.total > 0;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`h-20 border border-gray-200 p-2 text-left hover:bg-gray-50 transition-colors rounded-lg ${
            isToday ? 'ring-2 ring-red-500' : ''
          } ${hasAttendance ? 'bg-blue-50' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-semibold ${isToday ? 'text-red-600' : 'text-gray-900'}`}>
              {day}
            </span>
            {hasAttendance && (
              <div className="flex gap-1">
                {attendanceData.present > 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                    {attendanceData.present}P
                  </span>
                )}
                {attendanceData.absent > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 px-1 rounded">
                    {attendanceData.absent}A
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {attendanceData.total > 0 ? `${attendanceData.total}/${users.length}` : 'No marks'}
          </div>
        </button>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Has Attendance</span>
          </div>
        </div>
      </div>
    );
  };

  // Calculate stats
  // For customers and trainers, count actual users from users list
  const customerCount = users.filter(u => u.role === 'customer').length;
  const trainerCount = users.filter(u => u.role === 'trainer').length;

  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    customers: customerCount,
    trainers: trainerCount
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Attendance Management</h1>
              <p className="text-gray-600">Manage attendance records for all users</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowRangeForm(true);
                }}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Mark Attendance</span>
              </button>
            </div>
          </div>

          {/* Toggle Calendar/Table View */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              {showCalendar ? 'Show Table View' : 'Show Calendar View'}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.present}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.absent}</p>
                </div>
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{stats.customers}</p>
                </div>
                <UserCheck className="h-10 w-10 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trainers</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.trainers}</p>
                </div>
                <Shield className="h-10 w-10 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, date..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value as 'all' | 'customer' | 'trainer');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers</option>
                  <option value="trainer">Trainers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as 'all' | 'present' | 'absent');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user.id || user.sub} value={user.id || user.sub}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={filterAttendance}
                  className="flex-1 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                    setStartDate('');
                    setEndDate('');
                    setSelectedUserId('');
                    // Apply filters after reset
                    setTimeout(() => filterAttendance(), 0);
                  }}
                  className="flex-1 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          {showCalendar && (
            <div className="mb-8">
              {renderCalendar()}
            </div>
          )}

          {/* Attendance Table */}
          {!showCalendar && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Attendance Records</h2>
            </div>
            {loading ? (
              <div className="p-12 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading attendance records...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredAttendance.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No attendance records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Notes</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Marked By</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(record.date)}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.user_name || 'N/A'}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.user_role === 'customer'
                              ? 'bg-purple-100 text-purple-800'
                              : record.user_role === 'trainer'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {record.user_role ? record.user_role.charAt(0).toUpperCase() + record.user_role.slice(1) : 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status === 'present' ? (
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            )}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <div className="text-sm text-gray-600 max-w-xs truncate">{record.notes || '-'}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-600">{record.marked_by_name || 'Self'}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditForm(record)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          )}

        </div>
      </div>

      {/* Date Attendance Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Attendance for {formatDate(selectedDate)}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {dateAttendance.present.length} Present, {dateAttendance.absent.length} Absent, {dateAttendance.notMarked.length} Not Marked
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDateModal(false);
                  setSelectedDate('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {loadingDateAttendance ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading attendance...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={dateModalSearchTerm}
                        onChange={(e) => setDateModalSearchTerm(e.target.value)}
                        placeholder="Search by name or phone..."
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      {dateModalSearchTerm && (
                        <button
                          onClick={() => setDateModalSearchTerm('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Get all users with their attendance status */}
                  {(() => {
                    // Create a map of user_id to attendance record
                    const attendanceMap = new Map<string, Attendance>();
                    dateAttendance.present.forEach(r => attendanceMap.set(r.user_id, r));
                    dateAttendance.absent.forEach(r => attendanceMap.set(r.user_id, r));

                    // Filter users by search term
                    const filterUsers = (userList: User[]) => {
                      if (!dateModalSearchTerm) return userList;
                      const term = dateModalSearchTerm.toLowerCase();
                      return userList.filter(u => 
                        u.name.toLowerCase().includes(term) ||
                        u.phone?.toLowerCase().includes(term) ||
                        u.email?.toLowerCase().includes(term)
                      );
                    };

                    // Separate customers and trainers
                    const allCustomers = users.filter(u => u.role === 'customer');
                    const allTrainers = users.filter(u => u.role === 'trainer');
                    const customers = filterUsers(allCustomers);
                    const trainers = filterUsers(allTrainers);

                    const renderUserList = (userList: User[], allUserList: User[], role: 'customer' | 'trainer') => {
                      const allSelected = userList.length > 0 && userList.every(u => selectedUsers.has(u.id || u.sub || ''));
                      const hasSearch = dateModalSearchTerm.length > 0;
                      
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              {role === 'customer' ? <UserCheck className="h-5 w-5 text-purple-600" /> : <Shield className="h-5 w-5 text-orange-600" />}
                              {role === 'customer' ? 'Customers' : 'Trainers'} 
                              <span className="text-sm font-normal text-gray-600">
                                ({userList.length}{hasSearch ? ` of ${allUserList.length}` : ''})
                              </span>
                            </h3>
                            {userList.length > 0 && (
                              <button
                                onClick={() => selectAllUsers(userList)}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                              >
                                {allSelected ? 'Deselect All' : 'Select All'}
                              </button>
                            )}
                          </div>
                          <div className={`rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto ${role === 'customer' ? 'bg-purple-50' : 'bg-orange-50'}`}>
                            {userList.length === 0 ? (
                              <p className="text-gray-500 text-center py-4">
                                {hasSearch ? `No ${role}s match your search` : `No ${role}s found`}
                              </p>
                            ) : (
                              userList.map((user) => {
                                const userId = user.id || user.sub || '';
                                const attendance = attendanceMap.get(userId);
                                const isSelected = selectedUsers.has(userId);
                                const status = attendance?.status;
                                
                                return (
                                  <div 
                                    key={userId} 
                                    className={`flex items-center gap-3 bg-white p-3 rounded-lg border-2 ${
                                      isSelected ? 'border-red-500 bg-red-50' : 'border-transparent'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleUserSelection(userId)}
                                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                                    />
                                    <div className="flex-1 flex items-center gap-3">
                                      {status === 'present' ? (
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                      ) : status === 'absent' ? (
                                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                      ) : (
                                        <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                      )}
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">
                                          {user.phone && `${user.phone}`}
                                          {attendance?.marked_by_name && ` • Marked by ${attendance.marked_by_name}`}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {status && (
                                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            status === 'present' 
                                              ? 'bg-green-100 text-green-700' 
                                              : 'bg-red-100 text-red-700'
                                          }`}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                          </span>
                                        )}
                                        {!status && (
                                          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                                            Not Marked
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {!status && (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleIndividualMark(userId, 'present')}
                                          disabled={isSubmitting}
                                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                          Present
                                        </button>
                                        <button
                                          onClick={() => handleIndividualMark(userId, 'absent')}
                                          disabled={isSubmitting}
                                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                          Absent
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    };

                    return (
                      <>
                        {renderUserList(customers, allCustomers, 'customer')}
                        {renderUserList(trainers, allTrainers, 'trainer')}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{selectedUsers.size}</span> user(s) selected
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedUsers(new Set())}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleBulkMarkFromModal('absent')}
                  disabled={isSubmitting || selectedUsers.size === 0}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Marking...' : `Mark ${selectedUsers.size} as Absent`}
                </button>
                <button
                  onClick={() => handleBulkMarkFromModal('present')}
                  disabled={isSubmitting || selectedUsers.size === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Marking...' : `Mark ${selectedUsers.size} as Present`}
                </button>
                <button
                  onClick={() => {
                    setShowDateModal(false);
                    setSelectedDate('');
                    setSelectedUsers(new Set());
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Date Range Mark Modal */}
      {showRangeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-hidden flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mark Attendance by Date Range</h2>
            <div className="space-y-4 flex-1 overflow-y-auto">
              {/* Date Selection Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Selection Mode</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="single"
                      checked={dateSelectionMode === 'single'}
                      onChange={(e) => setDateSelectionMode(e.target.value as 'single' | 'range' | 'multiple')}
                      className="mr-2"
                    />
                    <span className="text-sm">Single Date</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="range"
                      checked={dateSelectionMode === 'range'}
                      onChange={(e) => setDateSelectionMode(e.target.value as 'single' | 'range' | 'multiple')}
                      className="mr-2"
                    />
                    <span className="text-sm">Date Range</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="multiple"
                      checked={dateSelectionMode === 'multiple'}
                      onChange={(e) => setDateSelectionMode(e.target.value as 'single' | 'range' | 'multiple')}
                      className="mr-2"
                    />
                    <span className="text-sm">Multiple Dates</span>
                  </label>
                </div>
              </div>

              {/* Single Date */}
              {dateSelectionMode === 'single' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Date Range */}
              {dateSelectionMode === 'range' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.date_range?.start || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        date_range: {
                          start: e.target.value,
                          end: formData.date_range?.end || e.target.value
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.date_range?.end || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        date_range: {
                          start: formData.date_range?.start || e.target.value,
                          end: e.target.value
                        }
                      })}
                      min={formData.date_range?.start}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Multiple Dates */}
              {dateSelectionMode === 'multiple' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Multiple Dates</label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-7 gap-2">
                      {(() => {
                        const today = new Date();
                        const dates: string[] = [];
                        // Show next 60 days
                        for (let i = 0; i < 60; i++) {
                          const date = new Date(today);
                          date.setDate(today.getDate() + i);
                          dates.push(date.toISOString().split('T')[0]);
                        }
                        return dates.map(date => {
                          const isSelected = formData.selected_dates?.includes(date) || false;
                          const dateObj = new Date(date);
                          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                          const dayNum = dateObj.getDate();
                          const isToday = date === today.toISOString().split('T')[0];

                          return (
                            <button
                              key={date}
                              type="button"
                              onClick={() => toggleDateSelection(date)}
                              className={`p-2 text-center rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'bg-red-600 text-white border-red-600'
                                  : isToday
                                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                                  : 'bg-white border-gray-200 hover:border-red-300 hover:bg-red-50'
                              }`}
                            >
                              <div className="text-xs font-semibold">{dayName}</div>
                              <div className="text-sm font-bold">{dayNum}</div>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                  {formData.selected_dates && formData.selected_dates.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.selected_dates.length} date(s) selected
                    </p>
                  )}
                </div>
              )}

              {/* Preview dates */}
              {(dateSelectionMode === 'range' && formData.date_range?.start && formData.date_range?.end) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Preview:</strong> {generateDateRange(formData.date_range.start, formData.date_range.end).length} date(s) will be marked
                    <br />
                    From: {new Date(formData.date_range.start).toLocaleDateString()} to {new Date(formData.date_range.end).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Search Users */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={bulkFormSearchTerm}
                    onChange={(e) => setBulkFormSearchTerm(e.target.value)}
                    placeholder="Search by name or phone..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {bulkFormSearchTerm && (
                    <button
                      onClick={() => setBulkFormSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Select Users</label>
                  {(() => {
                    const filteredUsers = users.filter(user => {
                      if (!bulkFormSearchTerm) return true;
                      const term = bulkFormSearchTerm.toLowerCase();
                      return (
                        user.name.toLowerCase().includes(term) ||
                        user.phone?.toLowerCase().includes(term) ||
                        user.email?.toLowerCase().includes(term)
                      );
                    });
                    const allSelected = filteredUsers.length > 0 && filteredUsers.every(u => 
                      formData.user_ids?.includes(u.id || u.sub || '')
                    );
                    return filteredUsers.length > 0 ? (
                      <button
                        onClick={() => {
                          const filteredUserIds = filteredUsers.map(u => u.id || u.sub || '').filter(id => id !== '');
                          const currentIds = formData.user_ids || [];
                          if (allSelected) {
                            setFormData({ 
                              ...formData, 
                              user_ids: currentIds.filter(id => !filteredUserIds.includes(id))
                            });
                          } else {
                            const newIds = [...new Set([...currentIds, ...filteredUserIds])];
                            setFormData({ ...formData, user_ids: newIds });
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    ) : null;
                  })()}
                </div>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {users
                    .filter(user => {
                      if (!bulkFormSearchTerm) return true;
                      const term = bulkFormSearchTerm.toLowerCase();
                      return (
                        user.name.toLowerCase().includes(term) ||
                        user.phone?.toLowerCase().includes(term) ||
                        user.email?.toLowerCase().includes(term)
                      );
                    })
                    .map(user => (
                      <label key={user.id || user.sub} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={formData.user_ids?.includes(user.id || user.sub || '') || false}
                          onChange={(e) => {
                            const currentIds = formData.user_ids || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, user_ids: [...currentIds, user.id || user.sub || ''] });
                            } else {
                              setFormData({ ...formData, user_ids: currentIds.filter(id => id !== (user.id || user.sub)) });
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{user.name} ({user.role})</span>
                      </label>
                    ))}
                  {bulkFormSearchTerm && users.filter(user => {
                    const term = bulkFormSearchTerm.toLowerCase();
                    return (
                      user.name.toLowerCase().includes(term) ||
                      user.phone?.toLowerCase().includes(term) ||
                      user.email?.toLowerCase().includes(term)
                    );
                  }).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No users found matching your search</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'present' | 'absent' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Add any notes..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRangeMark}
                disabled={isSubmitting || !formData.user_ids || formData.user_ids.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Marking...' : `Mark ${formData.user_ids?.length || 0} User(s)`}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

