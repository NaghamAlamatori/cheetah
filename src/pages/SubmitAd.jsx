import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { toast } from 'react-hot-toast';

const SubmitAd = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    image: null,
    link: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check only required fields from schema
      if (!formData.title || !formData.detail || !formData.start_date || !formData.end_date) {
        throw new Error(t('errors.requiredFields'));
      }

      // Validate dates
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const today = new Date();
      
      // Normalize dates to compare only the date part in local timezone
      const normalizeDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        // Create date at noon in local timezone to avoid DST issues
        return new Date(year, month, day, 12, 0, 0);
      };

      const normalizedStartDate = normalizeDate(startDate);
      const normalizedEndDate = normalizeDate(endDate);
      const normalizedToday = normalizeDate(today);

      console.log('Date Validation:', {
        startDate: normalizedStartDate.toLocaleString(),
        endDate: normalizedEndDate.toLocaleString(),
        today: normalizedToday.toLocaleString(),
        rawStartDate: formData.start_date,
        rawEndDate: formData.end_date,
        isStartBeforeToday: normalizedStartDate < normalizedToday,
        isEndAfterStart: normalizedEndDate > normalizedStartDate
      });

      if (normalizedStartDate < normalizedToday) {
        throw new Error(t('errors.pastStartDate'));
      }

      if (normalizedEndDate <= normalizedStartDate) {
        throw new Error(t('errors.invalidEndDate'));
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error(t('errors.notAuthenticated'));

      let imageUrl = null;
      if (formData.image) {
        const fileName = `${Date.now()}-${formData.image.name}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from('ads')
          .upload(fileName, formData.image);

        if (fileError) {
          throw fileError;
        }

        const { data: urlData } = supabase.storage
          .from('ads')
          .getPublicUrl(fileName);
        
        imageUrl = urlData?.publicUrl;
      }

      const { data: insertData, error: insertError } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          title: formData.title,
          detail: formData.detail,
          image: imageUrl,
          link: formData.link || null,
          start_date: new Date(formData.start_date).toISOString().split('T')[0],
          end_date: new Date(formData.end_date).toISOString().split('T')[0],
          status: 'active'
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('Insert Error:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        throw new Error(insertError.message || t('ads.submitError'));
      }

      if (!insertData) {
        console.error('No data returned from insert');
        throw new Error(t('ads.submitError'));
      }

      toast.success(t('ads.submitSuccess'));
      navigate('/ads');
    } catch (error) {
      console.error('Error submitting ad:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        details: error.details
      });
      const errorMessage = error.message || t('ads.submitError');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('ads.submitTitle')}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t('ads.adTitle')}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t('ads.detail')}
          </label>
          <textarea
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t('ads.image')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t('ads.link')}
          </label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('ads.startDate')}
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('ads.endDate')}
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
          }`}
        >
          {loading ? t('loading') : t('ads.submit')}
        </button>
      </form>
    </div>
  );
};

export default SubmitAd;
