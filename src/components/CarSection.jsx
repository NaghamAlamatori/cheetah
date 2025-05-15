import React from "react";
import CarCard from "./CarCard";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../utils/supabase";

function CarSection({ title, type, limit, showBrowseMore = false, cars: externalCars = null }) {
  const { t } = useTranslation();
  const [cars, setCars] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCars = async () => {
      // If external cars are passed, use them
      if (externalCars) {
        const processed = externalCars.map(car => {
          let imageUrl = car.car_images;

          if (Array.isArray(car.car_images) && car.car_images.length > 0) {
            imageUrl = car.car_images[0];
          }

          if (imageUrl && imageUrl.startsWith("https://")) {
            return { ...car, imageUrl };
          }

          if (imageUrl) {
            const { data: urlData } = supabase
              .storage
              .from("car-images")
              .getPublicUrl(imageUrl);
            return { ...car, imageUrl: urlData?.publicUrl };
          }

          return car;
        });

        setCars(processed || []);
        setLoading(false);
        return;
      }

      // Otherwise, fetch cars from Supabase
      try {
        let query = supabase
          .from("cars")
          .select("*")
          .order("created_at", { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) throw error;

        const processedCars = data.map(car => {
          let imageUrl = car.car_images;

          if (Array.isArray(car.car_images) && car.car_images.length > 0) {
            imageUrl = car.car_images[0];
          }

          if (imageUrl && imageUrl.startsWith("https://")) {
            return { ...car, imageUrl };
          }

          if (imageUrl) {
            const { data: urlData } = supabase
              .storage
              .from("car-images")
              .getPublicUrl(imageUrl);
            return { ...car, imageUrl: urlData?.publicUrl };
          }

          return car;
        });

        setCars(processedCars || []);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [type, limit, externalCars]);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
          <div className="text-center">{t("loading")}...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        {showBrowseMore && cars.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/cars"
              className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              {t("browseMoreCars")}
            </Link>
          </div>
        )}
        {cars.length === 0 && (
          <div className="text-center text-gray-500">
            {t("noCarsFound")}
          </div>
        )}
      </div>
    </section>
  );
}

export default CarSection;
