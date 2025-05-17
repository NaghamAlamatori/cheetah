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
      console.log('🔍 Fetching all active ads...');

      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase fetch error:', error);
        setError(t('ads.fetchError'));
        setAds([]);
      } else {
        console.log('✅ Active ads:', data);
        setAds(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('❗ Unexpected error:', err);
      setError(t('ads.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">{t('ads.title')}</h1>

      {/* Submit Ad Button */}
      <div className="mb-8 text-right">
        <Link
          to="/submit-ad"
          className="inline-flex items-center bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          <FaPlus className="mr-2" />
          {t('ads.submit')}
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4" />
          <div className="h-32 bg-gray-200 rounded mb-4" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.length === 0 ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-600">{t('ads.noAds')}</p>
            </div>
          ) : (
            ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                {ad.image && (
                  <img
                    src={
                      ad.image.startsWith('http://') || ad.image.startsWith('https://')
                        ? ad.image
                        : 'https://via.placeholder.com/400x300'
                    }
                    alt={ad.title}
                    className="w-full h-48 object-cover rounded mb-4"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300';
                    }}
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{ad.title}</h2>
                <p className="text-gray-600 mb-4">{ad.detail}</p>
                <div className="text-sm text-gray-500">
                  {ad.start_date && (
                    <p>
                      {t('ads.validFrom')}: {new Date(ad.start_date).toLocaleDateString()}
                    </p>
                  )}
                  {ad.end_date && (
                    <p>
                      {t('ads.validUntil')}: {new Date(ad.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {ad.link && (
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-orange-500 hover:text-orange-600"
                  >
                    {t('ads.learnMore')} →
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Ads;
