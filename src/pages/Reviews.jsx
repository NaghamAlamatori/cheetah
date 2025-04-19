import React, { useState, useEffect } from "react";
import supabase from "../utils/api"; // ✅ Correct import

const Reviews = ({ carId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("car_id", carId);

      if (error) {
        console.error("Error fetching reviews:", error.message);
        return;
      }

      setReviews(data || []);
    };

    fetchReviews();
  }, [carId]);

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id}>
            <p>Rating: {review.rating} ⭐</p>
            <p>{review.comment}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default Reviews;
