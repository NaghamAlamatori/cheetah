import React, { useState, useEffect } from 'react'
import ImageCarousel from '../components/ImageCarousel'
import AdBanner from '../components/AdBanner'
import SearchBar from '../components/SearchBar'
import CarSection from '../components/CarSection'
import CustomerReviews from '../components/CustomerReviews'
import { supabase } from '../utils/supabase'

function Home() {
  const [allCars, setAllCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all cars once when component mounts
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAllCars(data || []);
        setFilteredCars(data || []);
      } catch (error) {
        console.error('Error loading cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Real-time search handler
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredCars(allCars);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = allCars.filter(car => {
      const brand = (car.brand || '').toLowerCase();
      const model = (car.model || '').toLowerCase();
      const year = car.year?.toString() || '';
      
      return brand.includes(term) || 
             model.includes(term) || 
             year.includes(term);
    });

    setFilteredCars(filtered);
  };

  return (
    <div className="space-y-8 text-gray-500">
      <ImageCarousel />
      <AdBanner />
      <div className="container mx-auto px-4">
        <SearchBar onSearch={handleSearch} />
        <CarSection 
          title={`Cars ${filteredCars.length !== allCars.length ? `(${filteredCars.length} results)` : ''}`}
          cars={filteredCars}
          loading={loading}
        />
        <div className="text-white">
          <CustomerReviews />
        </div>
      </div>
    </div>
  )
}

export default Home
