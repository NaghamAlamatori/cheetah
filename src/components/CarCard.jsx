import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; 

function CarCard({ car }) {
  const { t, i18n } = useTranslation();
  const defaultImage = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";
  
  const [imgSrc, setImgSrc] = useState(null);
  
  useEffect(() => {
    console.log('CarCard received car:', car?.brand, car?.model);
    console.log('Car imageUrl:', car?.imageUrl);
    console.log('Car image field:', car?.image);
    
    if (car?.imageUrl) {
      setImgSrc(car.imageUrl);
    } else if (car?.image) {
      setImgSrc(car.image);
    } else {
      setImgSrc(defaultImage);
    }
  }, [car]);
  
  // Form location from city and country if available
  const location = [car?.city, car?.country].filter(Boolean).join(', ');
  
  const handleImageError = (e) => {
    console.log('Image error for car:', car?.brand, car?.model);
    console.log('Failed URL:', e.target.src);
    if (e.target.src !== defaultImage) {
      console.log('Falling back to default image');
      setImgSrc(defaultImage);
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={`${car?.brand || ''} ${car?.model || ''}`}
          className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
          onError={handleImageError}
          loading="lazy"
        />
        {car?.sold && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg font-semibold">
            {t('carDetails.sold')}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {car?.brand} {car?.model}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-orange-600 font-semibold">
            {car?.price} {t('carDetails.currency')}
          </p>
          {car?.year && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {car.year}
            </span>
          )}
        </div>
        <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{location || t('carDetails.locationUnknown')}</span>
        </div>
        {car?.color && (
          <div className="flex items-center mt-1 text-gray-600 dark:text-gray-400">
            <span className="text-sm">{t('carDetails.color')}: {car.color}</span>
          </div>
        )}

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
