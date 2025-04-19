import React from 'react';

function CustomerReviews({ language = 'en' }) { // Default to English if no language prop
  const reviews = {
    en: [
      {
        id: 1,
        name: "John Doe",
        review: "Great platform for finding my dream car! The process was smooth and transparent.",
        rating: 5
      },
      {
        id: 2,
        name: "Sarah Smith",
        review: "Excellent service and wide selection of vehicles. Highly recommended!",
        rating: 4
      },
      {
        id: 3,
        name: "Mike Johnson",
        review: "Found exactly what I was looking for at a great price. Very satisfied!",
        rating: 5
      }
    ],
    ar: [
      {
        id: 1,
        name: "محمد أحمد",
        review: "منصة رائعة للعثور على سيارتي المفضلة! كانت العملية سلسة وشفافة.",
        rating: 5
      },
      {
        id: 2,
        name: "سارة خالد",
        review: "خدمة ممتازة ومجموعة واسعة من المركبات. موصى به بشدة!",
        rating: 4
      },
      {
        id: 3,
        name: "علي حسن",
        review: "وجدت بالضبط ما كنت أبحث عنه بسعر رائع. راضٍ جدًا!",
        rating: 5
      }
    ]
  };

  const currentReviews = reviews[language] || reviews.en; // Fallback to English
  const title = language === 'ar' ? "آراء العملاء" : "Customer Reviews";

  return (
    <section className="py-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">{review.name[0]}</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">{review.name}</h3>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">{review.review}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CustomerReviews;