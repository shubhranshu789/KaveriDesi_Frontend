// Component/ReviewSection.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  _id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface User {
  name: string;
  email: string;
}

function ReviewSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pid = searchParams.get('id');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const user: User = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          userName: user.name || '',
          userEmail: user.email || ''
        }));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(false);
      }
    }
  }, []);

  const fetchReviews = async (page: number) => {
    if (!pid) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${pid}?page=${page}&limit=5`
      );
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [pid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        alert('Please login first');
        router.push('/');
        return;
      }
    }
    
    if (!pid) {
      alert('Product ID not found');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${pid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Review submitted successfully!');
        setFormData(prev => ({
          ...prev,
          rating: 5,
          comment: ''
        }));
        fetchReviews(1);
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    alert('Please login first');
    router.push('/');
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchReviews(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.span
            key={star}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </motion.span>
        ))}
      </div>
    );
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    buttons.push(
      <motion.button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        Previous
      </motion.button>
    );
    
    if (startPage > 1) {
      buttons.push(
        <motion.button
          key={1}
          onClick={() => goToPage(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-4 py-2 rounded-lg bg-white border-2 border-purple-300 text-purple-700 font-semibold hover:bg-purple-50 shadow-md"
        >
          1
        </motion.button>
      );
      if (startPage > 2) {
        buttons.push(<span key="dots1" className="px-2 text-gray-500">...</span>);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <motion.button
          key={i}
          onClick={() => goToPage(i)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
            currentPage === i
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50'
          }`}
        >
          {i}
        </motion.button>
      );
    }
    
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        buttons.push(<span key="dots2" className="px-2 text-gray-500">...</span>);
      }
      buttons.push(
        <motion.button
          key={pagination.totalPages}
          onClick={() => goToPage(pagination.totalPages)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-4 py-2 rounded-lg bg-white border-2 border-purple-300 text-purple-700 font-semibold hover:bg-purple-50 shadow-md"
        >
          {pagination.totalPages}
        </motion.button>
      );
    }
    
    buttons.push(
      <motion.button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        Next
      </motion.button>
    );
    
    return buttons;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Review Submission Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative  rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden"
      >
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
        >
          ✍️ Write a Review
        </motion.h2>
        
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div
              key="login-prompt"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-xl border-2 border-purple-200"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-4"
              >
                🔒
              </motion.div>
              <p className="text-gray-700 text-lg mb-6 font-medium">You need to be logged in to write a review</p>
              <motion.button
                onClick={handleLoginRedirect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                Login to Review
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="review-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-sm font-bold mb-2 text-gray-700">Your Name</label>
                  <input
                    type="text"
                    value={formData.userName}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-white/50 backdrop-blur-sm cursor-not-allowed font-medium"
                  />
                  <p className="text-xs text-purple-600 mt-2 font-medium">✓ Verified from your account</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-sm font-bold mb-2 text-gray-700">Your Email</label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-white/50 backdrop-blur-sm cursor-not-allowed font-medium"
                  />
                  <p className="text-xs text-purple-600 mt-2 font-medium">✓ Verified from your account</p>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-bold mb-3 text-gray-700">Rating</label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <motion.button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                        formData.rating === rating
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-300 text-gray-600 hover:border-yellow-400'
                      }`}
                    >
                      {rating} ★
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-bold mb-2 text-gray-700">Your Review</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                  maxLength={500}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all bg-white/70 backdrop-blur-sm resize-none"
                  placeholder="Share your experience with this product... ✨"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600 font-medium">
                    {formData.comment.length}/500 characters
                  </p>
                  <div className={`h-2 w-32 bg-gray-200 rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(formData.comment.length / 500) * 100}%` }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>
              </motion.div>
              
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-2"
                    />
                    Submitting...
                  </span>
                ) : (
                  '🚀 Submit Review'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reviews Display Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            💬 Customer Reviews
          </h2>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-2 rounded-full font-bold text-lg"
          >
            {pagination.totalReviews} {pagination.totalReviews === 1 ? 'Review' : 'Reviews'}
          </motion.span>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
              />
              <p className="mt-4 text-gray-600 font-medium">Loading reviews...</p>
            </motion.div>
          ) : reviews.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-8xl mb-4"
              >
                📝
              </motion.div>
              <p className="text-2xl font-bold text-gray-700">No reviews yet</p>
              <p className="mt-2 text-gray-600">Be the first to review this product!</p>
            </motion.div>
          ) : (
            <>
              <motion.div className="space-y-6 mb-8">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                    className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-6 border-l-4 border-purple-500 hover:border-pink-500 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <motion.h3
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-bold text-xl text-gray-800 mb-2"
                        >
                          {review.userName}
                        </motion.h3>
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full font-medium">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-700 leading-relaxed text-lg"
                    >
                      {review.comment}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>

              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center items-center gap-3 mt-8 flex-wrap"
                >
                  {renderPaginationButtons()}
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-gray-600 mt-6 font-medium"
              >
                Page {currentPage} of {pagination.totalPages}
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}


export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading checkout...</div>}>
      <ReviewSection />
    </Suspense>
  );
}