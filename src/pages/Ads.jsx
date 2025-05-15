import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { FaPlus } from 'react-icons/fa';

const Ads = () => {
  const { t } = useTranslation();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      console.log('Fetching ads...');
      
      // Don't use created_at since it's not in the table schema
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .order('id', { ascending: false });

      if (adsError) {
        console.error('Error in first ads query:', adsError);
        // Try a simpler query without ordering
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('ads')
          .select('*')
          .eq('status', 'active');

        if (fallbackError) {
          console.error('Error in fallback ads query:', fallbackError);
          throw fallbackError;
        }
        
        console.log('Ads fetched (fallback):', fallbackData?.length || 0);
        setAds(fallbackData || []);
      } else {
        console.log('Ads fetched:', adsData?.length || 0);
        setAds(adsData || []);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching ads:', error);
      setError(t('ads.submitError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t('ads.title')}</h1>
        <Link 
          to="/submit-ad"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          <FaPlus className="inline-block mr-2" />
          {t('ads.submit')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4" />
          <div className="h-32 bg-gray-200 rounded mb-4" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-600">{t('ads.noAds')}</p>
            </div>
          )}
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2">{ad.title}</h2>
              <p className="text-gray-600 mb-2">{ad.detail}</p>
              {ad.image && (
                <img 
                  src={ad.image && (ad.image.startsWith('http://') || ad.image.startsWith('https://')) 
                    ? ad.image 
                    : 'https://via.placeholder.com/400x300'}
                  alt={ad.title}
                  className="w-full h-48 object-cover rounded mt-2"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300';
                  }}
                />
              )}
              {ad.link && (
                <a 
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-orange-500 hover:text-orange-600"
                >
                  {t('ads.link')}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ads;
