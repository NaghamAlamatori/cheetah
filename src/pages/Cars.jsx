import React, { useState, useEffect } from "react";
import { supabase } from '../utils/supabase';
import CarCard from "../components/CarCard";
import { useTranslation } from "react-i18next";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    location: ""
  });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        // Start with the base query
        let query = supabase.from("cars").select("*");

        // Apply search filter - search in brand, model, and description
        if (searchTerm.trim()) {
          query = query.or(
            `brand.ilike.%${searchTerm.trim()}%,` +
            `model.ilike.%${searchTerm.trim()}%,` +
            `description.ilike.%${searchTerm.trim()}%`
          );
        }

        // Apply price filters - convert to numbers and validate
        const minPrice = Number(filters.minPrice);
        const maxPrice = Number(filters.maxPrice);

        if (!isNaN(minPrice) && minPrice > 0) {
          query = query.gte('price', minPrice);
        }

        if (!isNaN(maxPrice) && maxPrice > 0) {
          query = query.lte('price', maxPrice);
        }

        // Apply location filter
        if (filters.location.trim()) {
          const locationTerm = filters.location.trim();
          query = query.or(
            `country.ilike.%${locationTerm}%,` +
            `city.ilike.%${locationTerm}%`
          );
        }

        // Order by newest first
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        // Process cars to get image URLs
        const processedCars = data.map(car => {
          let imageUrl = car.car_images;
          if (Array.isArray(car.car_images) && car.car_images.length > 0) {
            imageUrl = car.car_images[0];
          }

          if (imageUrl && imageUrl.startsWith('https://')) {
            return {
              ...car,
              imageUrl: imageUrl
            };
          }
          
          if (imageUrl) {
            const { data: urlData } = supabase
              .storage
              .from('car-images')
              .getPublicUrl(imageUrl);
            
            return { 
              ...car, 
              imageUrl: urlData?.publicUrl 
            };
          }
          
          return car;
        });

        setCars(processedCars || []);
      } catch (error) {
        console.error("Error fetching cars:", error.message);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent too many requests while typing
    const timeoutId = setTimeout(fetchCars, 300);
    return () => clearTimeout(timeoutId);

  }, [searchTerm, filters]);

  const handleFilterChange = (e, field) => {
    const value = e.target.value;
    
    // Validate price inputs to only allow numbers
    if ((field === 'minPrice' || field === 'maxPrice') && value !== "") {
      if (!/^\d*$/.test(value)) return;
    }
    
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div
      className={`container mx-auto px-4 py-8 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <h1 className="text-3xl font-bold mb-6">{t("cars.title")}</h1>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder={t("cars.searchPlaceholder")}
            className="p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("cars.minPrice")}
            className="p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange(e, 'minPrice')}
          />
          <input
            type="text"
            placeholder={t("cars.maxPrice")}
            className="p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange(e, 'maxPrice')}
          />
          <input
            type="text"
            placeholder={t("cars.location")}
            className="p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={filters.location}
            onChange={(e) => handleFilterChange(e, 'location')}
          />
        </div>
      </div>

      {/* Cars Grid */}
      {loading ? (
        <div className="text-center py-8">{t("loading")}...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.length > 0 ? (
            cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              {t("cars.noCarsFound")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cars;
