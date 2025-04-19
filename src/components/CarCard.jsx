import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; 
function CarCard({ car }) {
  const { t, i18n } = useTranslation();
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={car?.image_url || "https://via.placeholder.com/400x300"}
          alt={car?.model || t('carDetails.car')}
          className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {car?.make} {car?.model}
        </h3>
        <p className="text-orange-600 font-semibold mt-1">
          {car?.price} {t('carDetails.currency')}
        </p>
        <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{car?.location}</span>
        </div>

        {/* Wrap the button in a Link to navigate to the car details page */}
        <Link to={`/cars/${car.id}`}>
          <button className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-colors duration-300">
            {t('carDetails.viewDetails')}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CarCard;
