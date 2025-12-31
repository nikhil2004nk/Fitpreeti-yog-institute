import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { serviceService, type Service, type CreateServiceData, type UpdateServiceData } from '../../services/services';
import { trainerService, type Trainer } from '../../services/trainers';
import { Package, Plus, Edit, Trash2, Search, DollarSign, Clock, CheckCircle, XCircle, X } from 'lucide-react';

export const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<CreateServiceData & { is_active: boolean }>({
    service_name: '',
    description: '',
    price: 0,
    type: '',
    duration_minutes: 60,
    trainer_id: '',
    category: '',
    image_url: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchTrainers();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, statusFilter, services]);

  const fetchTrainers = async () => {
    try {
      const data = await trainerService.getAllTrainers();
      setTrainers(data);
    } catch (err: any) {
      console.error('Failed to load trainers:', err);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAllServices();
      setServices(data);
      setFilteredServices(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by status
    if (statusFilter === 'active') {
      filtered = filtered.filter(s => s.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(s => !s.is_active);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.service_name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        (s.category && s.category.toLowerCase().includes(term)) ||
        s.type.toLowerCase().includes(term)
      );
    }

    setFilteredServices(filtered);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await serviceService.updateService(id, { is_active: !currentStatus });
      setServices(services.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
    } catch (err: any) {
      alert(err?.message || 'Failed to update service status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await serviceService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
      alert('Service deleted successfully');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete service');
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: '',
      description: '',
      price: 0,
      type: '',
      duration_minutes: 60,
      trainer_id: '',
      category: '',
      image_url: '',
      is_active: true
    });
    setEditingService(null);
  };

  const openEditForm = (service: Service) => {
    setEditingService(service);
    setFormData({
      service_name: service.service_name,
      description: service.description,
      price: service.price,
      type: service.type,
      duration_minutes: service.duration_minutes,
      trainer_id: service.trainer_id || '',
      category: service.category || '',
      image_url: service.image_url || '',
      is_active: service.is_active
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service_name.trim() || !formData.description.trim()) {
      alert('Service name and description are required');
      return;
    }
    if (formData.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    if (formData.duration_minutes <= 0) {
      alert('Duration must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      const baseData = {
        service_name: formData.service_name,
        description: formData.description,
        price: formData.price,
        type: formData.type,
        duration_minutes: formData.duration_minutes,
        trainer_id: formData.trainer_id || undefined,
        category: formData.category || undefined,
        image_url: formData.image_url || undefined,
        is_active: formData.is_active
      };

      if (editingService && editingService.id) {
        await serviceService.updateService(editingService.id, baseData as UpdateServiceData);
        alert('Service updated successfully');
      } else {
        await serviceService.createService(baseData as CreateServiceData);
        alert('Service created successfully');
      }

      await fetchServices();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      alert(err?.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Service Management</h1>
              <p className="text-gray-600">Manage services and pricing</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Service</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Services</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{services.length}</p>
                </div>
                <Package className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Services</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {services.filter(s => s.is_active).length}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Inactive Services</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {services.filter(s => !s.is_active).length}
                  </p>
                </div>
                <XCircle className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg. Price</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {services.length > 0
                      ? formatPrice(Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length))
                      : '₹0'}
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-yellow-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchServices}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No services found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt={service.service_name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.service_name}</h3>
                        {service.category && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-2">
                            {service.category}
                          </span>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        service.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-gray-900">{formatPrice(service.price)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration_minutes} min</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Type: <span className="font-medium">{service.type}</span>
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <button
                        onClick={() => handleToggleStatus(service.id, service.is_active)}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                          service.is_active
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {service.is_active ? (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openEditForm(service)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
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

          {/* Service Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingService ? 'Edit Service' : 'Add New Service'}
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
                    {/* Service Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.service_name}
                        onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="e.g., Hatha Yoga Class"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="Service description"
                      />
                    </div>

                    {/* Price and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹) <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (minutes) <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.duration_minutes}
                          onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          placeholder="60"
                        />
                      </div>
                    </div>

                    {/* Type and Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          placeholder="e.g., class, workshop, session"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        >
                          <option value="">Select category</option>
                          <option value="yoga">Yoga</option>
                          <option value="fitness">Fitness</option>
                          <option value="dance">Dance</option>
                          <option value="zumba">Zumba</option>
                          <option value="meditation">Meditation</option>
                          <option value="pilates">Pilates</option>
                        </select>
                      </div>
                    </div>

                    {/* Trainer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trainer</label>
                      <select
                        value={formData.trainer_id}
                        onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      >
                        <option value="">No trainer assigned</option>
                        {trainers.map((trainer) => (
                          <option key={trainer.id} value={trainer.id}>
                            {trainer.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        Active Service
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
                      {isSubmitting ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
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

