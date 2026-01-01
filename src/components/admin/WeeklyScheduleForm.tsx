import { useState } from 'react';
import { Plus, Trash2, Clock3, User } from 'lucide-react';

interface ClassData {
  time: string;
  name: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  type: 'Yoga' | 'Dance' | 'Fitness' | 'Meditation';
}

interface DaySchedule {
  day: string;
  classes: ClassData[];
}

interface WeeklyScheduleFormProps {
  value: DaySchedule[];
  onChange: (value: DaySchedule[]) => void;
}

const DAYS = [
  { value: 'Mon', label: 'Monday' },
  { value: 'Tue', label: 'Tuesday' },
  { value: 'Wed', label: 'Wednesday' },
  { value: 'Thu', label: 'Thursday' },
  { value: 'Fri', label: 'Friday' },
  { value: 'Sat', label: 'Saturday' },
  { value: 'Sun', label: 'Sunday' }
];

const LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'All Levels', label: 'All Levels' }
];

const TYPES = [
  { value: 'Yoga', label: 'Yoga' },
  { value: 'Dance', label: 'Dance' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Meditation', label: 'Meditation' }
];

// Time picker utilities
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ['00', '15', '30', '45'];
const AMPM = ['AM', 'PM'];

// Parse time string like "7:00 PM - 8:00 PM" to { startHour, startMin, startAMPM, endHour, endMin, endAMPM }
const parseTimeString = (timeStr: string) => {
  if (!timeStr) {
    return { startHour: 7, startMin: '00', startAMPM: 'PM', endHour: 8, endMin: '00', endAMPM: 'PM' };
  }
  
  const parts = timeStr.split(' - ');
  if (parts.length !== 2) {
    return { startHour: 7, startMin: '00', startAMPM: 'PM', endHour: 8, endMin: '00', endAMPM: 'PM' };
  }
  
  const parseSingleTime = (time: string) => {
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      return {
        hour: parseInt(match[1]),
        min: match[2],
        ampm: match[3].toUpperCase()
      };
    }
    return { hour: 7, min: '00', ampm: 'PM' };
  };
  
  const start = parseSingleTime(parts[0]);
  const end = parseSingleTime(parts[1]);
  
  return {
    startHour: start.hour,
    startMin: start.min,
    startAMPM: start.ampm,
    endHour: end.hour,
    endMin: end.min,
    endAMPM: end.ampm
  };
};

// Format time components to string like "7:00 PM - 8:00 PM"
const formatTimeString = (startHour: number, startMin: string, startAMPM: string, endHour: number, endMin: string, endAMPM: string) => {
  return `${startHour}:${startMin} ${startAMPM} - ${endHour}:${endMin} ${endAMPM}`;
};

export const WeeklyScheduleForm: React.FC<WeeklyScheduleFormProps> = ({ value, onChange }) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    // Initialize with all days, preserving existing data
    const initialized: DaySchedule[] = DAYS.map(day => {
      const existing = value?.find(d => d.day === day.value);
      if (existing) {
        // Ensure types are correct
        return {
          day: day.value,
          classes: existing.classes.map(cls => ({
            time: cls.time || '',
            name: cls.name || '',
            instructor: cls.instructor || '',
            level: (cls.level as ClassData['level']) || 'All Levels',
            type: (cls.type as ClassData['type']) || 'Yoga'
          }))
        };
      }
      return { day: day.value, classes: [] };
    });
    return initialized;
  });

  const updateSchedule = (newSchedule: DaySchedule[]) => {
    setSchedule(newSchedule);
    onChange(newSchedule);
  };

  const addClass = (dayValue: string) => {
    const newSchedule = schedule.map(day => {
      if (day.day === dayValue) {
        return {
          ...day,
          classes: [
            ...day.classes,
            {
              time: '',
              name: '',
              instructor: '',
              level: 'All Levels' as ClassData['level'],
              type: 'Yoga' as ClassData['type']
            }
          ]
        };
      }
      return day;
    });
    updateSchedule(newSchedule);
  };

  const removeClass = (dayValue: string, classIndex: number) => {
    const newSchedule = schedule.map(day => {
      if (day.day === dayValue) {
        return {
          ...day,
          classes: day.classes.filter((_, idx) => idx !== classIndex)
        };
      }
      return day;
    });
    updateSchedule(newSchedule);
  };

  const updateClass = (dayValue: string, classIndex: number, field: keyof ClassData, newValue: string) => {
    const newSchedule = schedule.map(day => {
      if (day.day === dayValue) {
        return {
          ...day,
          classes: day.classes.map((cls, idx) => {
            if (idx === classIndex) {
              const updated = { ...cls };
              if (field === 'level') {
                updated.level = newValue as ClassData['level'];
              } else if (field === 'type') {
                updated.type = newValue as ClassData['type'];
              } else {
                updated[field] = newValue;
              }
              return updated;
            }
            return cls;
          })
        };
      }
      return day;
    });
    updateSchedule(newSchedule);
  };

  return (
    <div className="space-y-6">
      {DAYS.map((dayOption) => {
        const daySchedule = schedule.find(d => d.day === dayOption.value) || { day: dayOption.value, classes: [] };
        const classes = daySchedule.classes || [];

        return (
          <div key={dayOption.value} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{dayOption.label}</h3>
              <button
                type="button"
                onClick={() => addClass(dayOption.value)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Class</span>
              </button>
            </div>

            {classes.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-4 text-center">
                No classes scheduled for {dayOption.label}. Click "Add Class" to add one.
              </p>
            ) : (
              <div className="space-y-4">
                {classes.map((cls, classIndex) => (
                  <div key={classIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">Class #{classIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeClass(dayOption.value, classIndex)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Remove class"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Time Range Picker */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock3 className="h-3 w-3 inline mr-1" />
                          Time <span className="text-red-600">*</span>
                        </label>
                        {(() => {
                          const timeParts = parseTimeString(cls.time);
                          return (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              {/* Start Time */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Start Time</label>
                                <div className="flex gap-2 items-center">
                                  <select
                                    value={timeParts.startHour}
                                    onChange={(e) => {
                                      const newTime = formatTimeString(
                                        parseInt(e.target.value),
                                        timeParts.startMin,
                                        timeParts.startAMPM,
                                        timeParts.endHour,
                                        timeParts.endMin,
                                        timeParts.endAMPM
                                      );
                                      updateClass(dayOption.value, classIndex, 'time', newTime);
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                                  >
                                    {HOURS.map(h => (
                                      <option key={h} value={h}>{h}</option>
                                    ))}
                                  </select>
                                  <span className="text-gray-500">:</span>
                                  <select
                                    value={timeParts.startMin}
                                    onChange={(e) => {
                                      const newTime = formatTimeString(
                                        timeParts.startHour,
                                        e.target.value,
                                        timeParts.startAMPM,
                                        timeParts.endHour,
                                        timeParts.endMin,
                                        timeParts.endAMPM
                                      );
                                      updateClass(dayOption.value, classIndex, 'time', newTime);
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                                  >
                                    {MINUTES.map(m => (
                                      <option key={m} value={m}>{m}</option>
                                    ))}
                                  </select>
                                  <select
                                    value={timeParts.startAMPM}
                                    onChange={(e) => {
                                      const newTime = formatTimeString(
                                        timeParts.startHour,
                                        timeParts.startMin,
                                        e.target.value,
                                        timeParts.endHour,
                                        timeParts.endMin,
                                        timeParts.endAMPM
                                      );
                                      updateClass(dayOption.value, classIndex, 'time', newTime);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                                  >
                                    {AMPM.map(ap => (
                                      <option key={ap} value={ap}>{ap}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* End Time */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">End Time</label>
                                <div className="flex gap-2 items-center">
                                  <select
                                    value={timeParts.endHour}
                                    onChange={(e) => {
                                      const newTime = formatTimeString(
                                        timeParts.startHour,
                                        timeParts.startMin,
                                        timeParts.startAMPM,
                                        parseInt(e.target.value),
                                        timeParts.endMin,
                                        timeParts.endAMPM
                                      );
                                      updateClass(dayOption.value, classIndex, 'time', newTime);
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                                  >
                                    {HOURS.map(h => (
                                      <option key={h} value={h}>{h}</option>
                                    ))}
                                  </select>
                                  <span className="text-gray-500">:</span>
                                  <select
                                    value={timeParts.endMin}
                                    onChange={(e) => {
                                      const newTime = formatTimeString(
                                        timeParts.startHour,
                                        timeParts.startMin,
                                        timeParts.startAMPM,
                                        timeParts.endHour,
                                        e.target.value,
                                        timeParts.endAMPM
                                      );
                                      updateClass(dayOption.value, classIndex, 'time', newTime);
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                                  >
                                    {MINUTES.map(m => (
                                      <option key={m} value={m}>{m}</option>
                                    ))}
                                  </select>
                                  <select
                                    value={timeParts.endAMPM}
                                    onChange={(e) => {
                                      const newTime = formatTimeString(
                                        timeParts.startHour,
                                        timeParts.startMin,
                                        timeParts.startAMPM,
                                        timeParts.endHour,
                                        timeParts.endMin,
                                        e.target.value
                                      );
                                      updateClass(dayOption.value, classIndex, 'time', newTime);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                                  >
                                    {AMPM.map(ap => (
                                      <option key={ap} value={ap}>{ap}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              
                              {/* Display formatted time */}
                              <div className="col-span-2 mt-2 pt-2 border-t border-gray-300">
                                <p className="text-xs text-gray-500">
                                  Selected: <span className="font-semibold text-gray-700">{cls.time || 'Not set'}</span>
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Class Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Class Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={cls.name}
                          onChange={(e) => updateClass(dayOption.value, classIndex, 'name', e.target.value)}
                          placeholder="e.g., Power Yoga"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                      </div>

                      {/* Instructor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="h-3 w-3 inline mr-1" />
                          Instructor <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={cls.instructor}
                          onChange={(e) => updateClass(dayOption.value, classIndex, 'instructor', e.target.value)}
                          placeholder="e.g., Ananya"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                      </div>

                      {/* Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Class Type <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={cls.type}
                          onChange={(e) => updateClass(dayOption.value, classIndex, 'type', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        >
                          {TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Level */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Level <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={cls.level}
                          onChange={(e) => updateClass(dayOption.value, classIndex, 'level', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        >
                          {LEVELS.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Preview */}
                    {cls.time && cls.name && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Preview:</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-900">{cls.time}</span>
                          <span className="font-semibold text-gray-900">{cls.name}</span>
                          {cls.instructor && (
                            <>
                              <span className="text-gray-500">With {cls.instructor}</span>
                              <span className="text-gray-400">•</span>
                            </>
                          )}
                          <span className="text-gray-600">{cls.type}</span>
                          <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">{cls.level}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

