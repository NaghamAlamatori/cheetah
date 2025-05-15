import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

function AddCar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in using the new auth methods
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const [carDetails, setCarDetails] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    description: "",
    color: "",
    country: "",
    city: "",
  });

  const [images, setImages] = useState([null, null, null]);
  const [previews, setPreviews] = useState(["", "", ""]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);

      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPreviews = [...previews];
        updatedPreviews[index] = reader.result;
        setPreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImages = async () => {
    const uploadedUrls = [];

    for (let i = 0; i < images.length; i++) {
      if (images[i]) {
        const filename = `car_${user.id}_${Date.now()}_${i}`;
        const { data, error } = await supabase.storage
          .from("car-images")
          .upload(filename, images[i]);

        if (error) {
          console.error("Error uploading image:", error);
          alert("Image upload failed.");
          return null;
        }

        const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/car-images/${data.path}`;
        uploadedUrls.push(publicUrl);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a car.");
      return;
    }

    setSubmitting(true);

    const imageUrls = await uploadImages();
    if (!imageUrls) {
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("cars").insert([
      {
        user_id: user.id,
        ...carDetails,
        car_images: imageUrls,
        sold: false,
      },
    ]);

    if (error) {
      console.error("Error adding car:", error);
      alert("Failed to add car. Please try again.");
    } else {
      alert("Car added successfully!");
      navigate("/cars");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-lg font-semibold">
        Please log in to add a car.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        🚗 Add Your Car
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {["brand", "model", "year", "price", "description", "color", "country", "city"].map(
          (field) => (
            <div key={field}>
              <label className="block mb-1 font-medium capitalize text-gray-700 dark:text-gray-200">
                {field}
              </label>
              {field === "description" ? (
                <textarea
                  name={field}
                  value={carDetails[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ) : (
                <input
                  type={field === "year" || field === "price" ? "number" : "text"}
                  name={field}
                  value={carDetails[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              )}
            </div>
          )
        )}

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
            Upload up to 3 images
          </label>
          <div className="flex gap-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {previews[index] && (
                  <img
                    src={previews[index]}
                    alt={`Preview ${index + 1}`}
                    className="mt-2 w-24 h-24 object-cover rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          {submitting ? "Submitting..." : "Add Car"}
        </button>
      </form>
    </div>
  );
}

export default AddCar;
