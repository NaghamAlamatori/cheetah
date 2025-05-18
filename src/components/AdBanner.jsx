import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

function AdBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        console.log('Fetching ads for date:', today);
        
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('status', 'publish');

        console.log('Fetched ads:', data);
        console.log('Error if any:', error);

        if (error) throw error;

        // Filter ads based on date client-side to ensure proper comparison
        const activeAds = data?.filter(ad => {
          const startDate = ad.start_date;
          const endDate = ad.end_date;
          return startDate <= today && endDate >= today;
        }) || [];

        console.log('Active ads:', activeAds);
        setAds(activeAds);
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []); // Remove the interval for now to debug

  const handleAdClick = (ad) => {
    if (ad.link) {
      window.open(ad.link, '_blank', 'noopener,noreferrer');
    } else {
      navigate('/ads');
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 my-4 rounded-lg shadow-lg animate-pulse">
        <div className="h-24"></div>
      </div>
    );
  }

  if (!ads.length) {
    console.log('No active ads found');
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className="relative overflow-hidden">
      <div 
        onClick={() => handleAdClick(currentAd)}
        className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 my-4 rounded-lg shadow-lg transform transition-transform hover:scale-102 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{currentAd.title}</h2>
            <p className="text-white/90 mb-4">
              {currentAd.detail}
            </p>
            <button
              className="inline-block bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-100 transition-colors"
            >
              {currentAd.link ? t('ads.learnMore') : t('ads.viewAll')}
            </button>
          </div>
          {currentAd.image && (
            <div className="hidden md:block w-1/3 ml-6">
              <img
                src={currentAd.image}
                alt={currentAd.title}
                className="rounded-lg object-cover w-full h-32"
              />
            </div>
          )}
        </div>
        {ads.length > 1 && (
          <div className="absolute bottom-2 right-2 flex space-x-1">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentAdIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdBanner;