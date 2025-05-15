import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { toast } from 'react-hot-toast';

const AdminComplaints = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setComplaints(data || []);
    } catch (err) {
      setError(err.message);
      toast.error('Error fetching complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('complaints')
        .update({ 
          status,
          is_public: status === 'accepted' ? true : false
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(status === 'accepted' ? t('success.accepted') : t('success.rejected'));
      fetchComplaints();
    } catch (err) {
      toast.error(t('errors.updateStatus'));
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold mb-8 text-orange-600">{t('manage_complaints')}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {complaints.map(comp => (
          <div key={comp.id} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{comp.name}</h3>
                <p className="text-gray-600 text-sm">{comp.contact}</p>
                <p className="text-gray-500 text-xs mt-1">Status: {comp.status}</p>
                <p className="text-gray-600 text-sm mt-2">{comp.content}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateComplaintStatus(comp.id, 'accepted')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={comp.status === 'accepted'}
                >
                  {t('accept')}
                </button>
                <button
                  onClick={() => updateComplaintStatus(comp.id, 'rejected')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={comp.status === 'rejected'}
                >
                  {t('reject')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminComplaints;