import React, { useState } from "react";
import axios from "axios";

const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const submitRating = async (value) => {
    setRating(value);
    try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            alert("You need to be logged in to submit a rating.");
            return;
        }

        await axios.post("http://127.0.0.1:8000/api/submit-rating/", 
            { rating: value },  // Body should contain only the rating
            {
                headers: { Authorization: `Token ${token}` }  // Proper placement of headers
            }
        );

        alert("Rating submitted successfully!");
    } catch (error) {
        console.error("Error submitting rating:", error);
        alert("Failed to submit rating. Please try again.");
    }
};


  return (
    <div>
  <h3>Rate Our App</h3>
  <div>
    {[1, 2, 3, 4, 5].map((value) => (
      <span
        key={value}
        style={{
          fontSize: "2rem",
          cursor: "pointer",
          color: value <= (hover || rating) ? "gold" : "gray",
        }}
        onMouseEnter={() => setHover(value)}
        onMouseLeave={() => setHover(0)}
        onClick={() => setRating(value)} // Just sets rating, doesn't submit yet
      >
        ★
      </span>
    ))}
  </div>

  <button
    onClick={() => submitRating(rating)}
    disabled={rating === 0} // Disable button if no rating is selected
    className="btn btn-primary mt-3"
  >
    Submit Rating
  </button>
</div>

  );
};

export default StarRating;
