import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading car details: {error}</p>;
  if (!car) return <p>No car data found</p>;

  return (
    <div>
      <h1>{car.make} {car.model}</h1>
      <img src={car.image_url} alt={car.model} />
      <p>{car.description}</p>
      <p>Price: {car.price}</p>
      <p>Location: {car.location}</p>
    </div>
  );
}

export default CarDetails;