import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { FaEdit, FaTrash, FaEye, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

const AdminCars = () => {
  const { t } = useTranslation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Modified query to handle potential join issues
      let { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // If cars have user_id, fetch user names in a second step
      if (data && data.length > 0 && data[0].user_id) {
        // Get unique user IDs from the cars
        const userIds = [...new Set(data.map(car => car.user_id))];
        
        // Fetch user names for these IDs
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name')
          .in('id', userIds);
        
        if (!userError && userData) {
          // Create a lookup map for user data
          const userMap = {};
          userData.forEach(user => {
            userMap[user.id] = user;
          });
          
          // Add user data to each car
          data = data.map(car => ({
            ...car,
            users: userMap[car.user_id] || { name: t('unknown_user') }
          }));
        }
      }
      
      setCars(data || []);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCarStatus = async (id, sold) => {
    try {
      setStatusUpdateLoading(id);
      const { error } = await supabase
        .from('cars')
        .update({ sold })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state to reflect the change
      setCars(cars.map(car => 
        car.id === id ? { ...car, sold } : car
      ));
    } catch (err) {
      console.error('Error updating car status:', err);
      setError('Failed to update car status.');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const deleteCar = async (id) => {
    try {
      setShowConfirmDelete(null);
      setLoading(true);
      
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state
      setCars(cars.filter(car => car.id !== id));
    } catch (err) {
      console.error('Error deleting car:', err);
      setError('Failed to delete car.');
    } finally {
      setLoading(false);
    }
  };

  // Function to format price with thousand separators
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('manage_cars')}</h1>
        <Link
          to="AddCar"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          {t('add_new_car')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            className="float-right"
            onClick={() => setError(null)}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {loading && !error ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded overflow-x-auto">
          {cars.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              {t('no_cars_found')}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('car')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('owner')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('details')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={typeof car.car_images === 'string' 
                                ? car.car_images 
                                : Array.isArray(car.car_images) && car.car_images.length 
                                  ? car.car_images[0] 
                                  : "https://via.placeholder.com/40"} 
                            alt="" 
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {car.brand} {car.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {car.year}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{car.users?.name || t('unknown_user')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {[car.city, car.country].filter(Boolean).join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {car.color}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${formatPrice(car.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${car.sold 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'}`}>
                        {car.sold ? t('sold') : t('available')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateCarStatus(car.id, !car.sold)}
                          disabled={statusUpdateLoading === car.id}
                          className={`text-xs ${car.sold 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'} 
                            px-2 py-1 rounded flex items-center justify-center`}
                          title={car.sold ? t('mark_as_available') : t('mark_as_sold')}
                        >
                          {statusUpdateLoading === car.id ? (
                            <span className="inline-block h-4 w-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                          ) : car.sold ? (
                            <><FaCheck className="mr-1" /> {t('available')}</>
                          ) : (
                            <><FaTimes className="mr-1" /> {t('sold')}</>
                          )}
                        </button>
                        
                        <Link
                          to={`/admin/edit-car/${car.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title={t('edit')}
                        >
                          <FaEdit />
                        </Link>
                        
                        <Link
                          to={`/cars/${car.id}`}
                          className="text-green-600 hover:text-green-900"
                          title={t('view')}
                          target="_blank"
                        >
                          <FaEye />
                        </Link>
                        
                        {showConfirmDelete === car.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => deleteCar(car.id)}
                              className="text-white bg-red-600 hover:bg-red-700 p-1 rounded"
                              title={t('confirm_delete')}
                            >
                              <FaCheck size="12" />
                            </button>
                            <button
                              onClick={() => setShowConfirmDelete(null)}
                              className="text-white bg-gray-600 hover:bg-gray-700 p-1 rounded"
                              title={t('cancel')}
                            >
                              <FaTimes size="12" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowConfirmDelete(car.id)}
                            className="text-red-600 hover:text-red-900"
                            title={t('delete')}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCars;