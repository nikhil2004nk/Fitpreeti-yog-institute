import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { attendanceService } from '../../services/attendance';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, CheckCircle, XCircle, CalendarCheck, TrendingUp, Clock, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { Attendance } from '../../types';

export const TrainerAttendance: React.FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [marking, setMarking] = useState(false);
  const [stats, setStats] = useState({
    total_days: 0,
    present_days: 0,
    absent_days: 0,
    attendance_percentage: 0
  });
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [showCalendar, setShowCalendar] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchAttendance();
    fetchStats();
  }, []);

  useEffect(() => {
    filterAttendance();
  }, [attendance]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      // Fetch all attendance data - filtering will be done client-side
      const data = await attendanceService.getOwnAttendance();
      setAttendance(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await attendanceService.getAttendanceStats(
        undefined,
        startDate || undefined,
        endDate || undefined
      );
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    }
  };

  const filterAttendance = () => {
    let filtered = [...attendance];

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(a => a.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(a => a.date <= endDate);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    setFilteredAttendance(filtered);
  };

  const handleApplyFilters = () => {
    filterAttendance();
    fetchStats();
  };

  const handleMarkAttendance = async (status: 'present' | 'absent') => {
    if (!user?.id) {
      alert('User information not available');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendance.find(a => a.date === today);

    // Validate that we're only marking for today
    const currentDate = new Date().toISOString().split('T')[0];
    if (today !== currentDate) {
      alert('You can only mark attendance for today\'s date');
      return;
    }

    if (todayRecord) {
      if (!window.confirm(`You have already marked ${todayRecord.status} for today. Do you want to update it to ${status}?`)) {
        return;
      }
    }

    try {
      setMarking(true);
      await attendanceService.markOwnAttendance({
        date: today,
        status,
        notes: `Marked as ${status} by trainer on ${new Date().toLocaleString()}`
      });
      await fetchAttendance();
      await fetchStats();
      alert(`Successfully marked as ${status} for today`);
    } catch (err: any) {
      alert(err?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
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

  const getTodayStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.find(a => a.date === today);
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

  const getAttendanceForDate = (date: Date): { status: 'present' | 'absent' | null } => {
    const dateStr = date.toISOString().split('T')[0];
    const record = attendance.find(a => a.date === dateStr);
    return { status: record?.status || null };
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
      const hasAttendance = attendanceData.status !== null;

      days.push(
        <div
          key={day}
          className={`h-20 border border-gray-200 p-2 rounded-lg ${
            isToday ? 'ring-2 ring-red-500' : ''
          } ${
            attendanceData.status === 'present'
              ? 'bg-green-50 border-green-300'
              : attendanceData.status === 'absent'
              ? 'bg-red-50 border-red-300'
              : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-semibold ${isToday ? 'text-red-600' : 'text-gray-900'}`}>
              {day}
            </span>
            {hasAttendance && (
              <div>
                {attendanceData.status === 'present' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {attendanceData.status ? (
              <span className={`font-semibold ${
                attendanceData.status === 'present' ? 'text-green-700' : 'text-red-700'
              }`}>
                {attendanceData.status.charAt(0).toUpperCase() + attendanceData.status.slice(1)}
              </span>
            ) : (
              <span>Not marked</span>
            )}
          </div>
        </div>
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
            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span>Not Marked</span>
          </div>
        </div>
      </div>
    );
  };

  const todayStatus = getTodayStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Attendance</h1>
            <p className="text-gray-600">View and manage your attendance records</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Days</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_days}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Days</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.present_days}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent Days</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.absent_days}</p>
                </div>
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance %</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {stats.attendance_percentage.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-500" />
              </div>
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

          {/* Calendar View */}
          {showCalendar && (
            <div className="mb-8">
              {renderCalendar()}
            </div>
          )}

          {/* Mark Today's Attendance */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CalendarCheck className="h-6 w-6 text-red-600" />
                Mark Today's Attendance ({new Date().toLocaleDateString()})
              </h2>
              <p className="text-sm text-gray-600">
                You can only mark your attendance for today's date. Past or future dates cannot be marked.
              </p>
            </div>
            {todayStatus ? (
              <div className="flex items-center gap-4">
                <div className={`flex-1 p-4 rounded-lg ${
                  todayStatus.status === 'present' 
                    ? 'bg-green-50 border-2 border-green-500' 
                    : 'bg-red-50 border-2 border-red-500'
                }`}>
                  <div className="flex items-center gap-3">
                    {todayStatus.status === 'present' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        You are marked as <span className="capitalize">{todayStatus.status}</span> for today
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Marked at: {todayStatus.created_at ? new Date(todayStatus.created_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkAttendance(todayStatus.status === 'present' ? 'absent' : 'present')}
                  disabled={marking}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    todayStatus.status === 'present'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } disabled:opacity-50`}
                >
                  {marking ? 'Updating...' : `Change to ${todayStatus.status === 'present' ? 'Absent' : 'Present'}`}
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => handleMarkAttendance('present')}
                  disabled={marking}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="h-5 w-5" />
                  Mark Present
                </button>
                <button
                  onClick={() => handleMarkAttendance('absent')}
                  disabled={marking}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <XCircle className="h-5 w-5" />
                  Mark Absent
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'present' | 'absent')}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <div className="flex items-end gap-2 sm:flex-col lg:flex-row">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Apply Filters</span>
                  <span className="sm:hidden">Apply</span>
                </button>
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setStatusFilter('all');
                    // Apply filters after reset
                    setTimeout(() => {
                      filterAttendance();
                      fetchStats();
                    }, 0);
                  }}
                  className="flex-1 px-4 sm:px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Attendance List */}
          {!showCalendar && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Attendance History</h2>
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
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Notes</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Marked At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(record.date)}</div>
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
                        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                          <div className="text-sm text-gray-600 max-w-xs truncate">{record.notes || '-'}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-600">
                            {record.created_at ? new Date(record.created_at).toLocaleString() : '-'}
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
      <Footer />
    </div>
  );
};

