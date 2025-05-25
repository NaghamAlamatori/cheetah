import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { FaArrowLeft, FaPhone, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

function SellerInfo() {
  const { t } = useTranslation();
  const { carId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState({});
  const [car, setCar] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // First get the car details
    const { data: carData, error: carError } = await supabase
      .from('cars')
      .select('*')
      .eq('id', carId)
      .maybeSingle(); 

    if (carError) throw carError;
    if (!carData) throw new Error('Car not found');

    setCar(carData);

    // Then fetch the user data from users table
    if (carData.user_id) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, mobile_no, city, country')
        .eq('id', carData.user_id)
        .maybeSingle(); 

      if (userError) {
        console.error('User fetch error details:', {
          message: userError.message,
          details: userError.details,
          hint: userError.hint,
          code: userError.code
        });
        throw userError;
      }

      setSeller(userData || {});
    }
  } catch (err) {
    console.error('Full error object:', err);
    setError(err.message || t('errors.fetchSellerInfo'));
  } finally {
    setLoading(false);
  }
};

    if (carId) {
      fetchData();
    }
  }, [carId, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('errors.error')}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          {t('sellerInfo.back')}
        </button>

        <div className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {t('sellerInfo.title')}
            </h1>

            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="text-orange-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('sellerInfo.name')}</p>
                  <p className="text-gray-800 dark:text-white">{seller?.name || t('sellerInfo.notSpecified')}</p>
                </div>
              </div>

              {seller?.mobile_no && (
                <div className="flex items-center">
                  <FaPhone className="text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('sellerInfo.phone')}</p>
                    <p className="text-gray-800 dark:text-white">{seller.mobile_no}</p>
                  </div>
                </div>
              )}

              {(seller?.city || seller?.country) && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('sellerInfo.location')}</p>
                    <p className="text-gray-800 dark:text-white">
                      {[seller?.city, seller?.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t('sellerInfo.carDetails')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('car.brand')}</p>
                  <p className="text-gray-800 dark:text-white">{car?.brand || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('car.model')}</p>
                  <p className="text-gray-800 dark:text-white">{car?.model || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('car.year')}</p>
                  <p className="text-gray-800 dark:text-white">{car?.year || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('car.price')}</p>
                  <p className="text-gray-800 dark:text-white">${car?.price?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerInfo;