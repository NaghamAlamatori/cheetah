import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { FaArrowLeft, FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

function SellerInfo() {
  const { t } = useTranslation();
  const { carId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First get the car details to get the user_id
        const { data: carData, error: carError } = await supabase
          .from('cars')
          .select('*')
          .eq('id', carId)
          .limit(1);

        if (carError) throw carError;
        if (!carData || carData.length === 0) {
          throw new Error('Car not found');
        }
        
        console.log('Found car:', carData[0]);  // Debug log
        setCar(carData[0]);

        // Then get the user details
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            *,
            auth_user:id(
              email
            )
          `)
          .eq('id', carData[0].user_id)
          .limit(1);

        console.log('User query result:', { userData, userError });  // Debug log
        
        if (userError) throw userError;
        if (!userData || userData.length === 0) {
          throw new Error(`Seller not found for user_id: ${carData[0].user_id}`);
        }
        setSeller(userData[0]);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || t('errors.fetchSellerInfo') || 'Failed to load seller information');
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('sellerInfo.title')}
            </h1>
            
            {car && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {t('sellerInfo.carDetails')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {car.brand} {car.model} ({car.year})
                </p>
                <p className="text-orange-500 font-medium">${car.price}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full text-orange-500 dark:text-orange-300 mr-4">
                  <FaUser size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('sellerInfo.sellerName')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {seller?.name || t('sellerInfo.notSpecified')}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-500 dark:text-blue-300 mr-4">
                  <FaPhone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('carDetails.phoneNumber')}
                  </p>
                  <a 
                    href={`tel:${seller?.mobile_no}`}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {seller?.mobile_no || t('sellerInfo.notSpecified')}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-500 dark:text-green-300 mr-4">
                  <FaEnvelope size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('sellerInfo.email')}
                  </p>
                  <a 
                    href={`mailto:${seller?.email}`}
                    className="font-medium text-green-600 dark:text-green-400 hover:underline"
                  >
                    {seller?.email || t('sellerInfo.notSpecified')}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-500 dark:text-purple-300 mr-4">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('sellerInfo.location')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {seller?.city || t('sellerInfo.notSpecified')}
                    {seller?.country ? `, ${seller.country}` : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                {t('carDetails.safetyTips.title')}
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc pl-5">
                {t('carDetails.safetyTips.tips', { returnObjects: true }).map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerInfo;
