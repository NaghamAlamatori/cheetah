import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useTranslation } from 'react-i18next';

const ReviewForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    user_name: '',
    content: '',
    rate: 5
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([formData]);

      if (error) throw error;

      setMessage(t('review.submitSuccess'));
      setFormData({ user_name: '', content: '', rate: 5 });
    } catch (error) {
      console.error('Failed to submit review:', error.message);
      setMessage(t('review.submitError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{t('review.name')}</label>
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{t('review.rating')}</label>
        <select
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          {[5, 4, 3, 2, 1].map(num => (
            <option key={num} value={num}>{num} ⭐</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{t('review.content')}</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? t('common.submitting') : t('review.submit')}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default ReviewForm;
