import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { dummyReviews } from '../utils/dummyData';

const AdminReviews = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase.from('reviews').select();
      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      // Use dummy data as fallback
      console.log('Using dummy reviews data as fallback');
      setReviews(dummyReviews);
    }
  };

  const deleteReview = async (id) => {
    await supabase.from('reviews').delete().eq('id', id);
    fetchReviews();
  };

  return (
    <div>
      <h1>{t('manage_reviews')}</h1>
      {reviews.map(review => (
        <div key={review.id}>
          <span>{review.content}</span>
          <button onClick={() => deleteReview(review.id)}>{t('delete')}</button>
        </div>
      ))}
    </div>
  );
};

export default AdminReviews;