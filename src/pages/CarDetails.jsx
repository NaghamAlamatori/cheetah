import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from '../utils/supabase';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaStar, FaChevronLeft } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

function CarDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    user_name: '',
    content: '',
    rate: 5
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const { data: carData, error: carError } = await supabase
          .from("cars")
          .select("*")
          .eq("id", id)
                
        if (carError) throw carError;

        // If we have the car data, fetch the seller info separately
        if (carData?.user_id) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, name, mobile_no, city, country")
            .eq("id", carData.user_id)

          if (!userError && userData) {
            setCar({
              ...carData,
              user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                mobile_no: userData.mobile_no
              }
            });
          } else {
            console.error("Failed to fetch user:", userError?.message);
            setCar(carData);
          }
        } else {
          setCar(carData);
        }
      } catch (err) {
        console.error("Failed to fetch car:", err.message);
        setError("Could not load car details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order('id', { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err.message);
      }
    };

    fetchCarDetails();
    fetchReviews();
  }, [id]);

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([{
          user_name: reviewForm.user_name,
          content: reviewForm.content,
          rate: parseInt(reviewForm.rate, 10)
        }])
        .select()

      if (error) throw error;

      // Add the new review to the reviews list
      setReviews(prev => [data, ...prev]);
      
      // Reset form
      setReviewForm({
        user_name: '',
        content: '',
        rate: 5
      });
      
      alert(t('review.submitSuccess'));
    } catch (err) {
      console.error("Failed to submit review:", err.message);
      alert(t('review.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSeller = () => {
    if (!car) return;
    navigate(`/seller-info/${id}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
  
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;
  if (!car) return <p className="text-center py-10">No car data found.</p>;

  const images = Array.isArray(car.car_images)
    ? car.car_images
    : typeof car.car_images === "string"
    ? [car.car_images]
    : [];

  return (
    <div className="bg-gray-50 dark:bg-dark-light min-h-screen pb-10">
      <div className="max-w-7xl mx-auto p-4">
        {/* Back button */}
        <Link to="/cars" className="inline-flex items-center text-gray-600 dark:text-gray-300 mb-6 hover:text-orange-500 transition-colors">
          <FaChevronLeft className="mr-2" /> 
          Back to Cars
        </Link>

        {/* Main car details */}
        <div className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Left section - Images */}
            <div className="md:w-3/5">
              <div className="relative h-80 md:h-96 bg-gray-200 dark:bg-gray-800">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No image available</p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex overflow-x-auto gap-2 p-2 bg-gray-100 dark:bg-gray-800">
                  {images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`w-20 h-16 object-cover cursor-pointer border-2 ${
                        activeImage === idx ? 'border-orange-500' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImage(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right section - Information */}
            <div className="md:w-2/5 p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {car.brand} {car.model} ({car.year})
              </h1>
              
              <div className="mt-2">
                <p className="text-2xl font-bold text-orange-500">${car.price}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaCalendarAlt className="mr-2" />
                  <span>Year: {car.year}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>Location: {car.city}, {car.country}</span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaUser className="mr-2" />
                  <span>Type: {car.type || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">Description</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{car.description || "No description provided."}</p>
              </div>

              <button 
                onClick={handleContactSeller}
                className="mt-8 w-full bg-orange-500 hover:bg-orange-700 text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>

        {/* Inquiry Section */}
        <div className="mt-10 bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Your Review</h2>
            
            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  value={reviewForm.user_name}
                  onChange={handleReviewInputChange}
                  placeholder="Enter your name"
                  className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                <select
                  name="rate"
                  value={reviewForm.rate}
                  onChange={handleReviewInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} ⭐</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Message</label>
                <textarea
                  id="comment"
                  name="content"
                  value={reviewForm.content}
                  onChange={handleReviewInputChange}
                  rows="4"
                  placeholder="Write your message here"
                  className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-700 text-white py-3 px-6 rounded-md font-medium transition-colors"
              >
                {submitting ? t('common.submitting') : t('review.submit')}
              </button>
            </form>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{t('review.title')}</h2>
          
          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{review.user_name}</h4>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: review.rate }).map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">{t('review.noReviews')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
