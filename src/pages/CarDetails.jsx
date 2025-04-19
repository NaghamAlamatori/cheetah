import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../utils/supabase";

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("id", id)
          .maybeSingle(); // safer than .single()

        if (error) throw error;

        setCar(data);
      } catch (err) {
        console.error("Failed to fetch car:", err.message);
        setError("Could not load car details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;
  if (!car) return <p className="text-center py-10">No car data found.</p>;

  const images = Array.isArray(car.car_images)
    ? car.car_images
    : typeof car.car_images === "string"
    ? car.car_images.split(",").map((img) => img.trim())
    : [];

  return (
    <div className="car-details max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">
        {car.brand} {car.model} ({car.year})
      </h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {images.length > 0 ? (
          images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Car Image ${idx + 1}`}
              className="w-64 h-auto rounded"
            />
          ))
        ) : (
          <p className="text-gray-500">No images available</p>
        )}
      </div>

      <div className="space-y-2 text-gray-800">
        <p><strong>Description:</strong> {car.description || "No description provided."}</p>
        <p><strong>Price:</strong> ${car.price}</p>
        <p><strong>Color:</strong> {car.color || "N/A"}</p>
        <p><strong>Location:</strong> {car.city}, {car.country}</p>
      </div>
    </div>
  );
}

export default CarDetails;
