import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { trainerService, type Trainer, type CreateTrainerData, type UpdateTrainerData } from '../../services/trainers';
import { UserCheck, Plus, Edit, Trash2, Search, Star, Calendar, X } from 'lucide-react';

export const TrainerManagement: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [formData, setFormData] = useState<CreateTrainerData & { isActive: boolean; title?: string; availability?: Record<string, Array<{ start: string; end: string }>> }>({
    name: '',
    title: '',
    bio: '',
    specializations: [],
    profileImage: '',
    certifications: [],
    experienceYears: undefined,
    isActive: true,
    socialMedia: { instagram: '', youtube: '' },
    availability: {}
  });
  const [specializationInput, setSpecializationInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  useEffect(() => {
    filterTrainers();
  }, [searchTerm, trainers]);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const data = await trainerService.getAllTrainers();
      setTrainers(data);
      setFilteredTrainers(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  const filterTrainers = () => {
    if (!searchTerm) {
      setFilteredTrainers(trainers);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = trainers.filter(t =>
      t.name.toLowerCase().includes(term) ||
      (t.bio && t.bio.toLowerCase().includes(term)) ||
      (t.specializations && t.specializations.some(s => s.toLowerCase().includes(term)))
    );
    setFilteredTrainers(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;

    try {
      await trainerService.deleteTrainer(id);
      setTrainers(trainers.filter(t => t.id !== id));
      alert('Trainer deleted successfully');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete trainer');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      bio: '',
      specializations: [],
      profileImage: '',
      certifications: [],
      experienceYears: undefined,
      isActive: true,
      socialMedia: { instagram: '', youtube: '' },
      availability: {}
    });
    setSpecializationInput('');
    setCertificationInput('');
    setEditingTrainer(null);
  };

  const openEditForm = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    // Convert availability format if needed (API may return different format)
    const availability: Record<string, Array<{ start: string; end: string }>> = {};
    if (trainer.availability) {
      Object.keys(trainer.availability).forEach(day => {
        const dayAvailability = trainer.availability![day];
        if (Array.isArray(dayAvailability)) {
          availability[day] = dayAvailability.map((slot: any) => {
            if (typeof slot === 'string') {
              // Handle "09:00-17:00" format
              const [start, end] = slot.split('-');
              return { start, end };
            }
            return slot;
          });
        }
      });
    }

    setFormData({
      name: trainer.name,
      title: trainer.title || '',
      bio: trainer.bio || '',
      specializations: trainer.specializations || [],
      profileImage: trainer.profileImage || '',
      certifications: trainer.certifications || [],
      experienceYears: trainer.experienceYears,
      isActive: trainer.isActive,
      socialMedia: trainer.socialMedia || { instagram: '', youtube: '' },
      availability: availability
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const baseData = {
        name: formData.name,
        title: formData.title || undefined,
        bio: formData.bio || undefined,
        specializations: (formData.specializations && formData.specializations.length > 0) ? formData.specializations : undefined,
        profileImage: formData.profileImage || undefined,
        certifications: (formData.certifications && formData.certifications.length > 0) ? formData.certifications : undefined,
        experienceYears: formData.experienceYears,
        isActive: formData.isActive,
        socialMedia: (formData.socialMedia?.instagram || formData.socialMedia?.youtube)
          ? {
              instagram: formData.socialMedia.instagram || undefined,
              youtube: formData.socialMedia.youtube || undefined
            }
          : undefined,
        availability: formData.availability && Object.keys(formData.availability).length > 0
          ? formData.availability
          : undefined
      };

      if (editingTrainer && editingTrainer.id) {
        await trainerService.updateTrainer(editingTrainer.id, baseData as UpdateTrainerData);
        alert('Trainer updated successfully');
      } else {
        await trainerService.createTrainer(baseData as CreateTrainerData);
        alert('Trainer created successfully');
      }

      await fetchTrainers();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      alert(err?.message || 'Failed to save trainer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSpecialization = () => {
    if (specializationInput.trim() && !formData.specializations?.includes(specializationInput.trim())) {
      setFormData({
        ...formData,
        specializations: [...(formData.specializations || []), specializationInput.trim()]
      });
      setSpecializationInput('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specializations: formData.specializations?.filter(s => s !== spec) || []
    });
  };

  const addCertification = () => {
    if (certificationInput.trim() && !formData.certifications?.includes(certificationInput.trim())) {
      setFormData({
        ...formData,
        certifications: [...(formData.certifications || []), certificationInput.trim()]
      });
      setCertificationInput('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications?.filter(c => c !== cert) || []
    });
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  const addAvailabilitySlot = (day: string) => {
    const currentDaySlots = formData.availability?.[day] || [];
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: [...currentDaySlots, { start: '09:00', end: '17:00' }]
      }
    });
  };

  const removeAvailabilitySlot = (day: string, index: number) => {
    const currentDaySlots = formData.availability?.[day] || [];
    const updatedSlots = currentDaySlots.filter((_, i) => i !== index);
    const newAvailability = { ...formData.availability };
    if (updatedSlots.length === 0) {
      delete newAvailability[day];
    } else {
      newAvailability[day] = updatedSlots;
    }
    setFormData({
      ...formData,
      availability: newAvailability
    });
  };

  const updateAvailabilitySlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    const currentDaySlots = formData.availability?.[day] || [];
    const updatedSlots = currentDaySlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: updatedSlots
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Trainer Management</h1>
              <p className="text-gray-600">Manage trainers and their profiles</p>
              <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg max-w-2xl">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Trainer ratings and review counts are automatically calculated from approved reviews. New trainers start with rating 0 and 0 reviews.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingTrainer(null);
                setShowForm(true);
              }}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Trainer</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Trainers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{trainers.length}</p>
                </div>
                <UserCheck className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Trainers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {trainers.filter(t => t.isActive).length}
                  </p>
                </div>
                <UserCheck className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {trainers.length > 0
                      ? (trainers.reduce((sum, t) => sum + (t.rating || 0), 0) / trainers.length).toFixed(1)
                      : '0.0'}
                  </p>
                </div>
                <Star className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trainers by name, bio, or specializations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Trainers Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading trainers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchTrainers}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : filteredTrainers.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No trainers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrainers.map((trainer) => (
                <div key={trainer.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {trainer.profileImage && (
                    <img
                      src={trainer.profileImage}
                      alt={trainer.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{trainer.name}</h3>
                        {trainer.title && (
                          <p className="text-sm text-gray-500 mt-1">{trainer.title}</p>
                        )}
                        {trainer.rating && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {trainer.rating.toFixed(1)} ({trainer.totalReviews || 0} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        trainer.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {trainer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {trainer.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{trainer.bio}</p>
                    )}

                    {trainer.specializations && trainer.specializations.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {trainer.specializations.slice(0, 3).map((spec, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                            >
                              {spec}
                            </span>
                          ))}
                          {trainer.specializations.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{trainer.specializations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {trainer.experienceYears && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{trainer.experienceYears} years experience</span>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-4 border-t">
                      <button
                        onClick={() => openEditForm(trainer)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => trainer.id && handleDelete(trainer.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trainer Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="Trainer name"
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="e.g., Founder & Head Trainer"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="Trainer biography"
                      />
                    </div>

                    {/* Profile Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                      <input
                        type="url"
                        value={formData.profileImage}
                        onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Experience Years */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.experienceYears || ''}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    {/* Specializations */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={specializationInput}
                          onChange={(e) => setSpecializationInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          placeholder="Add specialization"
                        />
                        <button
                          type="button"
                          onClick={addSpecialization}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.specializations?.map((spec, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {spec}
                            <button
                              type="button"
                              onClick={() => removeSpecialization(spec)}
                              className="ml-2 hover:text-purple-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={certificationInput}
                          onChange={(e) => setCertificationInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          placeholder="Add certification"
                        />
                        <button
                          type="button"
                          onClick={addCertification}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.certifications?.map((cert, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {cert}
                            <button
                              type="button"
                              onClick={() => removeCertification(cert)}
                              className="ml-2 hover:text-blue-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                        <input
                          type="text"
                          value={formData.socialMedia?.instagram || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                        <input
                          type="text"
                          value={formData.socialMedia?.youtube || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: { ...formData.socialMedia, youtube: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          placeholder="Channel name or URL"
                        />
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Availability Schedule</label>
                      <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                        {daysOfWeek.map((day) => {
                          const daySlots = formData.availability?.[day] || [];
                          return (
                            <div key={day} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700 capitalize">
                                  {day}
                                </label>
                                <button
                                  type="button"
                                  onClick={() => addAvailabilitySlot(day)}
                                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                  + Add Slot
                                </button>
                              </div>
                              {daySlots.length === 0 ? (
                                <p className="text-xs text-gray-500 italic">No availability set</p>
                              ) : (
                                <div className="space-y-2">
                                  {daySlots.map((slot, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <input
                                        type="time"
                                        value={slot.start}
                                        onChange={(e) => updateAvailabilitySlot(day, index, 'start', e.target.value)}
                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                      />
                                      <span className="text-gray-500">to</span>
                                      <input
                                        type="time"
                                        value={slot.end}
                                        onChange={(e) => updateAvailabilitySlot(day, index, 'end', e.target.value)}
                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeAvailabilitySlot(day, index)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        Active Trainer
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : editingTrainer ? 'Update Trainer' : 'Create Trainer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

