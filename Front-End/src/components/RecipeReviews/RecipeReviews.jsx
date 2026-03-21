import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Star, Loader2, Trash2, MessageSquare, Send, User } from 'lucide-react';
import {USER_API} from '../../config/api'

const API = `${USER_API}/feedback`;

const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
});

// ─── Star rating input ────────────────────────────────────────────────────────
const StarInput = ({ value, onChange, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95">
          <Star className={`${sz} transition-colors ${
            star <= (hovered || value)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-300'
          }`} />
        </button>
      ))}
    </div>
  );
};

// ─── Star display (read-only) ─────────────────────────────────────────────────
const StarDisplay = ({ value, size = 'sm' }) => {
  const sz = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className={`${sz} ${
          star <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
        }`} />
      ))}
    </div>
  );
};

// ─── Rating bar breakdown ─────────────────────────────────────────────────────
const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-500 w-3">{star}</span>
      <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="h-full bg-amber-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }} />
      </div>
      <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const RecipeReviews = ({ recipeId }) => {
  const { user } = useSelector((s) => s.auth);

  const [feedback,     setFeedback]     = useState([]);
  const [avgRating,    setAvgRating]    = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({ 5:0, 4:0, 3:0, 2:0, 1:0 });
  const [loading,      setLoading]      = useState(true);

  // Form state
  const [rating,    setRating]    = useState(0);
  const [comment,   setComment]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check if current user already reviewed
  const userReview = user
    ? feedback.find(f => f.user === user._id || f.user === user.id)
    : null;

  // Load feedback
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/${recipeId}`);
        setFeedback(data.feedback);
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
        setRatingCounts(data.ratingCounts);
      } catch {
        // silent fail — reviews section just shows empty
      } finally {
        setLoading(false);
      }
    };
    if (recipeId) load();
  }, [recipeId]);

  // Pre-fill form if user has existing review
  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment || '');
    }
  }, [userReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a star rating'); return; }
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${API}/${recipeId}`,
        { rating, comment },
        getConfig()
      );
      // Reload reviews
      const { data: fresh } = await axios.get(`${API}/${recipeId}`);
      setFeedback(fresh.feedback);
      setAvgRating(fresh.avgRating);
      setTotalReviews(fresh.totalReviews);
      setRatingCounts(fresh.ratingCounts);
      toast.success(userReview ? 'Review updated!' : 'Review submitted! ⭐');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your review?')) return;
    try {
      await axios.delete(`${API}/${recipeId}`, getConfig());
      const { data: fresh } = await axios.get(`${API}/${recipeId}`);
      setFeedback(fresh.feedback);
      setAvgRating(fresh.avgRating);
      setTotalReviews(fresh.totalReviews);
      setRatingCounts(fresh.ratingCounts);
      setRating(0);
      setComment('');
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-6 space-y-5"
    >
      {/* ── Summary ── */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-white/40 flex items-center gap-3 bg-white/30">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-base">Reviews</h2>
            <p className="text-[11px] text-gray-400">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#3a5d8f]" />
            <span className="text-sm font-medium">Loading reviews…</span>
          </div>
        ) : (
          <div className="p-6">
            {totalReviews > 0 ? (
              <div className="flex flex-col sm:flex-row gap-8">
                {/* Average score */}
                <div className="text-center flex-shrink-0">
                  <p className="text-6xl font-black bg-gradient-to-br from-amber-400 to-orange-500 bg-clip-text text-transparent leading-none mb-2">
                    {avgRating.toFixed(1)}
                  </p>
                  <StarDisplay value={avgRating} size="md" />
                  <p className="text-xs text-gray-400 mt-1 font-medium">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                </div>

                {/* Rating bars */}
                <div className="flex-1 space-y-2 justify-center flex flex-col">
                  {[5, 4, 3, 2, 1].map(star => (
                    <RatingBar key={star} star={star} count={ratingCounts[star] || 0} total={totalReviews} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 font-medium text-sm">No reviews yet</p>
                <p className="text-gray-400 text-xs mt-1">Be the first to review this recipe</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Write a review (logged-in users only) ── */}
      {user && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-white/40 bg-white/30">
            <h3 className="font-bold text-gray-900 text-sm">
              {userReview ? 'Update Your Review' : 'Write a Review'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Star selector */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Your Rating</p>
              <div className="flex items-center gap-3">
                <StarInput value={rating} onChange={setRating} size="lg" />
                {rating > 0 && (
                  <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-bold text-amber-600">
                    {ratingLabels[rating]}
                  </motion.span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Comment <span className="text-gray-300 normal-case font-normal">(optional)</span></p>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share what you thought about this recipe…"
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all resize-none placeholder-gray-400 font-medium"
              />
              <p className="text-[10px] text-gray-300 text-right mt-1">{comment.length}/500</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button type="submit" disabled={submitting || !rating}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/20 text-sm transition-all">
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                  : <><Send className="w-4 h-4" /> {userReview ? 'Update Review' : 'Submit Review'}</>
                }
              </motion.button>
              {userReview && (
                <button type="button" onClick={handleDelete}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold rounded-2xl border border-red-200/60 text-sm transition-all">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ── Guest nudge ── */}
      {!user && totalReviews > 0 && (
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/40 p-4 text-center">
          <p className="text-sm text-gray-500 font-medium">
            <a href="/login" className="text-[#3a5d8f] font-bold hover:underline">Sign in</a> to leave a review
          </p>
        </div>
      )}

      {/* ── Review list ── */}
      {!loading && feedback.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/40 bg-white/30">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">All Reviews</p>
          </div>
          <ul className="divide-y divide-white/30">
            <AnimatePresence>
              {feedback.map((review, i) => {
                const isOwn = review.user === user?._id || review.user === user?.id;
                return (
                  <motion.li key={review._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="px-6 py-4 hover:bg-white/30 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm">
                        {review.userName?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{review.userName}</span>
                            {isOwn && (
                              <span className="text-[10px] bg-[#3a5d8f]/10 text-[#3a5d8f] px-2 py-0.5 rounded-full font-bold">You</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <StarDisplay value={review.rating} size="sm" />
                            <span className="text-[10px] text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </motion.section>
  );
};

export default RecipeReviews;