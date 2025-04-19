import React, { useState, useEffect } from "react";
import supabase from "../utils/supabase";
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

  const demoCars = [
    {
      id: "demo1",
      make: "Mercedes-Benz",
      model: "S-Class",
      price: "89999",
      location: "New York",
      image_url:
        "https://images.unsplash.com/photo-1622200294772-e411743c0e07?auto=format&fit=crop&w=1024&q=80",
    },
    {
      id: "demo2",
      make: "BMW",
      model: "7 Series",
      price: "92999",
      location: "Los Angeles",
      image_url:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1024&q=80",
    },
    {
      id: "demo3",
      make: "Audi",
      model: "A8",
      price: "86999",
      location: "Chicago",
      image_url:
        "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=1024&q=80",
    },
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        let query = supabase.from("cars").select("*");

        if (searchTerm) {
          query = query.or(`brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
        }

        if (filters.minPrice) {
          query = query.gte("price", filters.minPrice);
        }

        if (filters.maxPrice) {
          query = query.lte("price", filters.maxPrice);
        }

        if (filters.location) {
          query = query.or(`country.ilike.%${filters.location}%,city.ilike.%${filters.location}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        setCars(data || []);
      } catch (error) {
        console.error("Error fetching cars:", error.message);
        setCars([]); // fallback to demoCars on error
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchTerm, filters]);

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
            className="p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="number"
            placeholder={t("cars.minPrice")}
            className="p-2 border rounded"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder={t("cars.maxPrice")}
            className="p-2 border rounded"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
          <input
            type="text"
            placeholder={t("cars.location")}
            className="p-2 border rounded"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {cars.length === 0 && (
            <div className="text-center text-sm text-gray-500 mb-4 italic">
              {t("cars.showingDemoCars")}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(cars.length > 0 ? cars : demoCars).map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Cars;
