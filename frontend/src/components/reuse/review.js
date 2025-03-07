import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewComponent = ({ playgroundId, userToken }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch existing reviews & calculate average rating
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/playgroundReview/${playgroundId}/reviews/`, {
        headers: { Authorization: `Token ${userToken}` },
      })
      .then((response) => {
        setReviews(response.data);

        // Calculate the average rating
        if (response.data.length > 0) {
          const totalRating = response.data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating((totalRating / response.data.length).toFixed(1)); // Round to 1 decimal place
        } else {
          setAverageRating(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [playgroundId, userToken]); // ✅ Include userToken in dependencies to remove the ESLint warning

  // Handle review submission
  const submitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/playgroundReview/${playgroundId}/reviews/`,
        newReview,
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedReviews = [...reviews, response.data];
      setReviews(updatedReviews);

      // Recalculate the average rating after submitting a new review
      const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating((totalRating / updatedReviews.length).toFixed(1));

      setNewReview({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <div className="col-md-8 mx-auto">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            {/* 🔹 Display Overall Average Rating */}
            <h4 className="card-title border-bottom pb-2">
              Overall Rating:{" "}
              <span className="text-warning fw-bold">{averageRating} ⭐</span>
            </h4>

            {/* Show existing reviews */}
            <div className="mb-3">
              {reviews.length > 0 ? (
                reviews.map((review) => {
                  const userInitial = review.user ? review.user.charAt(0).toUpperCase() : "U";

                  return (
                    <div key={review.id} className="d-flex mb-3 p-3 border rounded bg-light">
                      {/* User Initial Avatar */}
                      <div
                        className="me-3 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                        style={{
                          width: "45px",
                          height: "45px",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {userInitial}
                      </div>

                      {/* Comment Content */}
                      <div className="w-100">
                        <p className="fw-bold mb-1">{review.user}</p>
                        <p className="text-warning mb-1">{"⭐".repeat(review.rating)}</p>
                        <p className="text-muted mb-1">{review.comment}</p>
                        <small className="text-secondary">
                          {new Date(review.created_at).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted">No reviews yet. Be the first to write one!</p>
              )}
            </div>

            {/* Submit new review */}
            <form onSubmit={submitReview} className="mt-3">
              <div className="mb-2">
                <label className="form-label">Rating:</label>
                <select
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })
                  }
                  className="form-select"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} ⭐
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label">Comment:</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="form-control"
                  rows="3"
                  placeholder="Write your review..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent;
