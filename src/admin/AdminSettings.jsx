import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { toast } from 'react-hot-toast';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    site_name: 'Cheetah',
    site_logo: '',
    facebook: '',
    instagram: '',
    whatsapp: ''
  });
  const [settingsId, setSettingsId] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const defaultSettings = {
    site_name: '',
    site_logo: '',
    facebook: '',
    instagram: '',
    whatsapp: ''
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch settings from database
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1);

      if (error) {
        toast.error('Error fetching settings. Please try again.');
        return;
      }

      if (!data || data.length === 0) {
        setFormData(defaultSettings);
        return;
      }

      const settings = data[0];
      const completeSettings = {
        site_name: settings.site_name || '',
        site_logo: settings.site_logo || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        whatsapp: settings.whatsapp || ''
      };

      setFormData(completeSettings);
      setSettingsId(settings.id);

    } catch (error) {
      toast.error('Error fetching settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      let result;
      
      if (settingsId) {
        result = await supabase
          .from('settings')
          .update(formData)
          .eq('id', settingsId)
          .select();
      } else {
        result = await supabase
          .from('settings')
          .insert([formData])
          .select();
      }
      
      const { data, error } = result;
      
      if (error) {
        throw error;
      }
      
      toast.success('Settings updated successfully!');
      
      if (data && data.length > 0) {
        setSettingsId(data[0].id);
      }
    } catch (error) {
      toast.error('Error updating settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-orange-600">Site Settings</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4 border-b pb-4">
          <label className="block text-sm font-medium text-gray-700">
            Site Name
          </label>
          <input
            type="text"
            name="site_name"
            value={formData.site_name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter site name"
          />
        </div>

        <div className="space-y-4 border-b pb-4">
          <label className="block text-sm font-medium text-gray-700">
            Site Logo URL
          </label>
          <input
            type="text"
            name="site_logo"
            value={formData.site_logo || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter logo URL"
          />
        </div>

        <div className="space-y-4 border-b pb-4">
          <label className="block text-sm font-medium text-gray-700">
            Facebook Link
          </label>
          <div className="flex items-center space-x-2">
            <FaFacebook className="text-blue-600" />
            <input
              type="text"
              name="facebook"
              value={formData.facebook || ''}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
        </div>

        <div className="space-y-4 border-b pb-4">
          <label className="block text-sm font-medium text-gray-700">
            Instagram Link
          </label>
          <div className="flex items-center space-x-2">
            <FaInstagram className="text-pink-600" />
            <input
              type="text"
              name="instagram"
              value={formData.instagram || ''}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://instagram.com/yourpage"
            />
          </div>
        </div>

        <div className="space-y-4 border-b pb-4">
          <label className="block text-sm font-medium text-gray-700">
            WhatsApp Number
          </label>
          <div className="flex items-center space-x-2">
            <FaWhatsapp className="text-green-600" />
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp || ''}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter WhatsApp number"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
