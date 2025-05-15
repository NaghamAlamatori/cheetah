import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaPlus, FaCheck, FaPause, FaTimes } from 'react-icons/fa';

const AdminAds = () => {
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
      setError(null);
      
      const { data, error } = await supabase
        .from('ads')
        .select(`
          id,
          title,
          detail,
          status,
          start_date,
          end_date,
          user_id
        `)
        .order('id', { ascending: false });

      if (error) throw error;
      
      // After getting ads, fetch user names
      if (data) {
        const userIds = [...new Set(data.map(ad => ad.user_id))];
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name')
          .in('id', userIds);

        if (!userError && userData) {
          const userMap = Object.fromEntries(userData.map(u => [u.id, u]));
          const adsWithUsers = data.map(ad => ({
            ...ad,
            users: userMap[ad.user_id] || null
          }));
          setAds(adsWithUsers);
        } else {
          setAds(data);
        }
      }
    } catch (err) {
      setError(err.message);
      toast.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const updateAdStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('ads')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(t('ads.statusUpdated'));
      fetchAds();
    } catch (err) {
      toast.error(t('errors.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id) => {
    if (window.confirm(t('ads.confirmDelete'))) {
      try {
        const { error } = await supabase
          .from('ads')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast.success(t('ads.deleted'));
        fetchAds();
      } catch (err) {
        toast.error(t('errors.deleteFailed'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-orange-600">{t('ads.manage')}</h1>
        <Link
          to="/submit-ad"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          {t('ads.create')}
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('ads.title')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('ads.advertiser')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('ads.dates')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('ads.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ads.map(ad => (
              <tr key={ad.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{ad.title}</div>
                    <div className="text-sm text-gray-500">{ad.detail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {ad.users?.name || t('common.unknown')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{new Date(ad.start_date).toLocaleDateString()}</div>
                  <div>{new Date(ad.end_date).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${ad.status === 'active' ? 'bg-green-100 text-green-800' : 
                      ad.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {ad.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  {ad.status !== 'active' && (
                    <button
                      onClick={() => updateAdStatus(ad.id, 'active')}
                      className="text-green-600 hover:text-green-900"
                      title={t('ads.activate')}
                    >
                      <FaCheck />
                    </button>
                  )}
                  {ad.status !== 'inactive' && (
                    <button
                      onClick={() => updateAdStatus(ad.id, 'inactive')}
                      className="text-gray-600 hover:text-gray-900"
                      title={t('ads.deactivate')}
                    >
                      <FaPause />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="text-red-600 hover:text-red-900"
                    title={t('common.delete')}
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAds;