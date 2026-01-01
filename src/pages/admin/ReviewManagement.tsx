import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { reviewService, type Review, type CreateReviewData, type UpdateReviewData } from '../../services/reviews';
import { Star, Search, CheckCircle, Clock, User, Filter, Plus, Edit, Trash2, X } from 'lucide-react';

export const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState<CreateReviewData & { is_approved?: boolean }>({
    booking_id: '',
    rating: 5,
    comment: '',
    reviewer_type: '',
    is_approved: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [searchTerm, filter, reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAllReviews(false); // Get all reviews including unapproved
      setReviews(data);
      setFilteredReviews(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    // Filter by approval status
    if (filter === 'approved') {
      filtered = filtered.filter(r => r.is_approved);
    } else if (filter === 'pending') {
      filtered = filtered.filter(r => !r.is_approved);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.user_name.toLowerCase().includes(term) ||
        r.comment.toLowerCase().includes(term)
      );
    }

    setFilteredReviews(filtered);
  };

  const handleApprove = async (id: string) => {
    try {
      await reviewService.updateReview(id, { is_approved: true });
      setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: true } : r));
      alert('Review approved successfully. Trainer ratings have been automatically updated.');
      // Refresh reviews to ensure UI is in sync
      await fetchReviews();
    } catch (err: any) {
      alert(err?.message || 'Failed to approve review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review? This will recalculate trainer ratings if the review was previously approved.')) return;

    try {
      await reviewService.deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
      alert('Review deleted successfully. Trainer ratings have been automatically updated if applicable.');
      await fetchReviews();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete review');
    }
  };

  const resetForm = () => {
    setFormData({
      booking_id: '',
      rating: 5,
      comment: '',
      reviewer_type: '',
      is_approved: false
    });
    setFormErrors({});
    setEditingReview(null);
  };

  const openEditForm = (review: Review) => {
    setEditingReview(review);
    setFormData({
      booking_id: review.booking_id || '',
      rating: review.rating,
      comment: review.comment,
      reviewer_type: review.reviewer_type || '',
      is_approved: review.is_approved
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors: Record<string, string> = {};
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
    if (!formData.comment || formData.comment.trim().length === 0) {
      errors.comment = 'Comment is required';
    }
    if (formData.comment && formData.comment.length > 1000) {
      errors.comment = 'Comment must be less than 1000 characters';
    }
    if (formData.reviewer_type && formData.reviewer_type.length > 100) {
      errors.reviewer_type = 'Reviewer type must be less than 100 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData: CreateReviewData | UpdateReviewData = {
        rating: formData.rating,
        comment: formData.comment.trim(),
        reviewer_type: formData.reviewer_type?.trim() || undefined,
        booking_id: formData.booking_id?.trim() || undefined,
      };

      if (editingReview && editingReview.id) {
        // Update review - include is_approved for admin
        await reviewService.updateReview(editingReview.id, {
          ...submitData,
          is_approved: formData.is_approved
        } as UpdateReviewData);
        alert('Review updated successfully. Trainer ratings have been automatically updated if applicable.');
      } else {
        // Create new review
        await reviewService.createReview(submitData as CreateReviewData);
        alert('Review created successfully. It will need to be approved before affecting trainer ratings.');
      }

      await fetchReviews();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      alert(err?.message || 'Failed to save review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Review Management</h1>
              <p className="text-gray-600">Manage and moderate customer reviews</p>
              <div className="mt-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> When you approve a review, the associated trainer's rating and review count are automatically recalculated. Only approved reviews affect trainer ratings.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Review</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{reviews.length}</p>
                </div>
                <Star className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {reviews.filter(r => r.is_approved).length}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {reviews.filter(r => !r.is_approved).length}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-yellow-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg. Rating</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {reviews.length > 0
                      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                      : '0.0'}
                  </p>
                </div>
                <Star className="h-12 w-12 text-purple-600 opacity-20" />
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
                  placeholder="Search reviews by user name or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent appearance-none"
                >
                  <option value="all">All Reviews</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchReviews}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews found</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        {review.user_profile_image ? (
                          <img
                            src={review.user_profile_image}
                            alt={review.user_name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-red-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.user_name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-500">{review.rating}/5</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{review.comment}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(review.created_at)}</span>
                        {review.reviewer_type && (
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            {review.reviewer_type}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          review.is_approved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {review.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4 flex-wrap gap-2">
                      {!review.is_approved && (
                        <button
                          onClick={() => handleApprove(review.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                      )}
                      <button
                        onClick={() => openEditForm(review)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingReview ? 'Edit Review' : 'Add New Review'}
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
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating <span className="text-red-600">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= formData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {formData.rating}/5
                    </span>
                  </div>
                  {formErrors.rating && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.rating}</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => {
                      setFormData({ ...formData, comment: e.target.value });
                      if (formErrors.comment) {
                        setFormErrors({ ...formErrors, comment: '' });
                      }
                    }}
                    rows={4}
                    required
                    maxLength={1000}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Write your review comment..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.comment.length}/1000 characters
                  </p>
                  {formErrors.comment && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.comment}</p>
                  )}
                </div>

                {/* Reviewer Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reviewer Type
                  </label>
                  <input
                    type="text"
                    value={formData.reviewer_type || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, reviewer_type: e.target.value });
                      if (formErrors.reviewer_type) {
                        setFormErrors({ ...formErrors, reviewer_type: '' });
                      }
                    }}
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="e.g., Yoga Regular, Beginner, etc."
                  />
                  {formErrors.reviewer_type && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.reviewer_type}</p>
                  )}
                </div>

                {/* Booking ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.booking_id || ''}
                    onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Enter booking UUID (optional)"
                  />
                </div>

                {/* Approval Status (Admin only, show when editing) */}
                {editingReview && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_approved"
                      checked={formData.is_approved}
                      onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_approved" className="ml-2 text-sm text-gray-700">
                      Approved (affects trainer ratings)
                    </label>
                  </div>
                )}

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
                      {isSubmitting ? 'Saving...' : editingReview ? 'Update Review' : 'Create Review'}
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

