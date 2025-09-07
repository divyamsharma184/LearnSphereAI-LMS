import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';

const CourseRating = ({ courseId, onRatingUpdate }) => {
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    // Check if user has already rated this course
    const ratings = JSON.parse(localStorage.getItem('courseRatings') || '{}');
    const userRating = ratings[`${user?.id}-${courseId}`];
    
    if (userRating) {
      setHasRated(true);
      setExistingRating(userRating);
      setRating(userRating.rating);
      setReview(userRating.review);
    }
  }, [courseId, user?.id]);

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    const ratingData = {
      userId: user?.id,
      userName: user?.name,
      courseId,
      rating,
      review,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const ratings = JSON.parse(localStorage.getItem('courseRatings') || '{}');
    ratings[`${user?.id}-${courseId}`] = ratingData;
    localStorage.setItem('courseRatings', JSON.stringify(ratings));

    setHasRated(true);
    setExistingRating(ratingData);
    
    if (onRatingUpdate) {
      onRatingUpdate();
    }

    toast.success(hasRated ? 'Rating updated successfully!' : 'Rating submitted successfully!');
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          onClick={() => !hasRated && setRating(starValue)}
          onMouseEnter={() => !hasRated && setHoveredRating(starValue)}
          onMouseLeave={() => !hasRated && setHoveredRating(0)}
          disabled={hasRated}
          className={`text-2xl transition-colors duration-200 ${
            hasRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${
            starValue <= (hoveredRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        >
          <Star className={`h-6 w-6 ${
            starValue <= (hoveredRating || rating) ? 'fill-current' : ''
          }`} />
        </button>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-secondary-900">
          {hasRated ? 'Your Rating' : 'Rate This Course'}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary-600">Rating:</span>
          <div className="flex space-x-1">
            {renderStars()}
          </div>
          {rating > 0 && (
            <span className="text-sm text-secondary-600 ml-2">
              {rating} out of 5 stars
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            disabled={hasRated}
            className="input-field h-24 resize-none"
            placeholder="Share your thoughts about this course..."
          />
        </div>

        {!hasRated && (
          <button
            onClick={handleRatingSubmit}
            className="btn-primary"
          >
            Submit Rating
          </button>
        )}

        {hasRated && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <ThumbsUp className="h-4 w-4" />
            <span>Thank you for your feedback!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRating;
