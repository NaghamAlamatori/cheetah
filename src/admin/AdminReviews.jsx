import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';

const AdminReviews = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select();
    setReviews(data || []);
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