import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaCar, FaPlus } from 'react-icons/fa';
import { supabase } from '../utils/supabase';

const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userCars, setUserCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
      fetchUserCars();
    }
  }, [user]);

  const fetchUserCars = async () => {
    if (!user) return;
    
    try {
      setCarsLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setUserCars(data || []);
    } catch (error) {
      console.error('Error fetching user cars:', error);
    } finally {
      setCarsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pleaseLogin')}</h2>
          <Link
            to="/login"
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            {t('login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">{t('profile')}</h1>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={user.user_metadata?.profile_picture || "/default-profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-orange-500"
              onError={(e) => {
                e.target.src = "/default-profile.png";
              }}
            />
          </div>

          <div className="space-y-2">
            <p className="text-lg">
              <strong>{t("name")}:</strong> {user.user_metadata?.name || t("notProvided")}
            </p>
            <p className="text-lg">
              <strong>{t("email")}:</strong> {user.email}
            </p>
            <p className="text-lg">
              <strong>{t("mobile_no")}:</strong> {user.user_metadata?.mobile_no || t("notProvided")}
            </p>
            <p className="text-lg">
              <strong>{t("city")}:</strong> {user.user_metadata?.city || t("notProvided")}
            </p>
            <p className="text-lg">
              <strong>{t("country")}:</strong> {user.user_metadata?.country || t("notProvided")}
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/edit-profile"
              className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 flex items-center"
            >
              <FaEdit className="mr-2" />
              {t("editProfile")}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      {/* User's Cars Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('myCars')}</h2>
          <Link
            to="/add-car"
            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 flex items-center"
          >
            <FaPlus className="mr-2" />
            {t('addNewCar')}
          </Link>
        </div>

        {carsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : userCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCars.map((car) => (
              <div key={car.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  {car.car_images && car.car_images.length > 0 ? (
                    <img
                      src={Array.isArray(car.car_images) ? car.car_images[0] : car.car_images.split(',')[0].trim()}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <FaCar className="text-gray-400 text-5xl" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{car.brand} {car.model}</h3>
                  <p className="text-orange-500 font-bold">${car.price}</p>
                  <p className="text-gray-500 text-sm">{car.year} • {car.city}, {car.country}</p>
                  
                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/cars/${car.id}`}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      {t('viewDetails')}
                    </Link>
                    <Link
                      to={`/edit-car/${car.id}`}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {t('edit')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <FaCar className="mx-auto text-gray-300 text-5xl mb-3" />
            <p className="text-gray-500 mb-4">{t('noCarListings')}</p>
            <Link
              to="/add-car"
              className="bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600 inline-flex items-center"
            >
              <FaPlus className="mr-2" />
              {t('addYourFirstCar')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;