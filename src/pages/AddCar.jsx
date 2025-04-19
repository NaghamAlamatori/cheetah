import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import  supabase  from "../utils/supabase"; 
import { useAuth } from "../context/AuthContext"; 

function AddCar() {
  const { user } = useAuth(); //auth context to check if the user is logged in
  const navigate = useNavigate();

  // State for the car details and images
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
  const [images, setImages] = useState([null, null, null]); // To store 3 images
  const [loading, setLoading] = useState(false);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index] = file;
        return updatedImages;
      });
    }
  };

  // Function to upload images to Supabase Storage
  const uploadImages = async () => {
    const uploadedUrls = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i]) {
        const { data, error } = await supabase.storage
          .from("car-images") // Replace with your Supabase storage bucket name
          .upload(`car_${user.id}_${Date.now()}_${i}`, images[i]);

        if (error) {
          console.error("Error uploading image:", error);
          return null;
        }

        uploadedUrls.push(data.Key);
      }
    }
    return uploadedUrls;
  };

  // Handle the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a car.");
      return;
    }

    setLoading(true);
    
    const imageUrls = await uploadImages();
    if (!imageUrls) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("cars")
      .insert([
        {
          user_id: user.id,
          brand: carDetails.brand,
          model: carDetails.model,
          year: carDetails.year,
          price: carDetails.price,
          description: carDetails.description,
          color: carDetails.color,
          country: carDetails.country,
          city: carDetails.city,
          car_images: imageUrls, // Store the image URLs
          sold: false, // Default value, change if needed
        },
      ]);

    if (error) {
      console.error("Error adding car:", error);
    } else {
      alert("Car added successfully!");
      navigate("/"); // Redirect to homepage or any other page
    }

    setLoading(false);
  };

  if (!user) {
    return <p>Please log in to add a car.</p>;
  }

  return (
    <div className="add-car-container">
      <h2>Add Your Car</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={carDetails.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Model</label>
          <input
            type="text"
            name="model"
            value={carDetails.model}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={carDetails.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={carDetails.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={carDetails.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={carDetails.color}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={carDetails.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={carDetails.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Upload Images (Max 3)</label>
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              type="file"
              onChange={(e) => handleImageChange(e, index)}
              accept="image/*"
              required
            />
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Car"}
        </button>
      </form>
    </div>
  );
}

export default AddCar;
