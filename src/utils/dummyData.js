// Dummy data for the car marketplace application
// This file contains mock data for development and testing purposes

export const dummyCars = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    mileage: 15000,
    condition: 'Excellent',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    color: 'Silver',
    country: 'USA',
    city: 'New York',
    description: 'Well maintained Toyota Camry with low mileage. Perfect family car.',
    car_images: [
      'https://images.unsplash.com/photo-1552519507-da3effff991c?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3effff991c?w=500&h=500&fit=crop'
    ],
    user_id: 'user-1',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 22000,
    mileage: 25000,
    condition: 'Good',
    fuel_type: 'Petrol',
    transmission: 'Manual',
    color: 'Black',
    country: 'USA',
    city: 'Los Angeles',
    description: 'Reliable Honda Civic, great fuel efficiency and performance.',
    car_images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=500&fit=crop'
    ],
    user_id: 'user-2',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '3',
    brand: 'BMW',
    model: '3 Series',
    year: 2020,
    price: 35000,
    mileage: 45000,
    condition: 'Excellent',
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    color: 'Blue',
    country: 'UK',
    city: 'London',
    description: 'Premium BMW 3 Series with all luxury features and excellent condition.',
    car_images: [
      'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=500&h=500&fit=crop'
    ],
    user_id: 'user-3',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '4',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    price: 45000,
    mileage: 8000,
    condition: 'Excellent',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    color: 'White',
    country: 'Germany',
    city: 'Berlin',
    description: 'Brand new Mercedes-Benz C-Class with all modern features.',
    car_images: [
      'https://images.unsplash.com/photo-1606611013016-969c19d4c624?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1606611013016-969c19d4c624?w=500&h=500&fit=crop'
    ],
    user_id: 'user-4',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '5',
    brand: 'Ford',
    model: 'Mustang',
    year: 2019,
    price: 28000,
    mileage: 55000,
    condition: 'Good',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    color: 'Red',
    country: 'USA',
    city: 'Chicago',
    description: 'Classic Ford Mustang with powerful engine and stylish design.',
    car_images: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&h=500&fit=crop'
    ],
    user_id: 'user-5',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '6',
    brand: 'Audi',
    model: 'A4',
    year: 2022,
    price: 38000,
    mileage: 20000,
    condition: 'Excellent',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    color: 'Gray',
    country: 'Germany',
    city: 'Munich',
    description: 'Sleek Audi A4 with advanced technology and comfortable interior.',
    car_images: [
      'https://images.unsplash.com/photo-1606611013016-969c19d4c624?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1606611013016-969c19d4c624?w=500&h=500&fit=crop'
    ],
    user_id: 'user-1',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active'
  }
];

export const dummyUsers = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+1-555-0101',
    country: 'USA',
    city: 'New York',
    role: 'seller',
    bio: 'Trusted car seller with 10+ years of experience',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 4.8,
    total_reviews: 42,
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '+1-555-0102',
    country: 'USA',
    city: 'Los Angeles',
    role: 'seller',
    bio: 'Professional car dealer specializing in luxury vehicles',
    profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    rating: 4.9,
    total_reviews: 58,
    created_at: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'user-3',
    email: 'max.muller@example.com',
    first_name: 'Max',
    last_name: 'Müller',
    phone: '+49-123-456789',
    country: 'Germany',
    city: 'Berlin',
    role: 'seller',
    bio: 'European luxury car specialist',
    profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    rating: 4.7,
    total_reviews: 35,
    created_at: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'user-4',
    email: 'anna.weber@example.com',
    first_name: 'Anna',
    last_name: 'Weber',
    phone: '+49-987-654321',
    country: 'Germany',
    city: 'Frankfurt',
    role: 'seller',
    bio: 'Premium automotive dealer',
    profile_image: 'https://images.unsplash.com/photo-1507539332640-34be94ba631d?w=400&h=400&fit=crop',
    rating: 4.9,
    total_reviews: 67,
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'user-5',
    email: 'robert.wilson@example.com',
    first_name: 'Robert',
    last_name: 'Wilson',
    phone: '+1-555-0105',
    country: 'USA',
    city: 'Chicago',
    role: 'seller',
    bio: 'Classic and muscle car enthusiast',
    profile_image: 'https://images.unsplash.com/photo-1502147169556-d3d2d38feffa?w=400&h=400&fit=crop',
    rating: 4.6,
    total_reviews: 28,
    created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const dummyReviews = [
  {
    id: '1',
    car_id: '1',
    user_id: 'user-buyer-1',
    rating: 5,
    comment: 'Excellent car! Very clean and well-maintained. John was very helpful and honest.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    car_id: '1',
    user_id: 'user-buyer-2',
    rating: 4,
    comment: 'Good car, runs perfectly. Happy with the purchase.',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    car_id: '2',
    user_id: 'user-buyer-3',
    rating: 5,
    comment: 'Amazing Honda! Perfect fuel efficiency and very responsive.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    car_id: '3',
    user_id: 'user-buyer-4',
    rating: 5,
    comment: 'Premium BMW in perfect condition. Highly recommend this seller!',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    car_id: '4',
    user_id: 'user-buyer-5',
    rating: 5,
    comment: 'Brand new Mercedes with all features. Worth every penny!',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const dummyAds = [
  {
    id: '1',
    title: '50% Off on All Cars This Weekend!',
    description: 'Limited time offer - get up to 50% discount on selected vehicles',
    image: 'https://images.unsplash.com/photo-1552519507-da3effff991c?w=500&h=300&fit=crop',
    link: '/cars',
    status: 'active',
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Free Car Inspection & Certification',
    description: 'Get your vehicle inspected and certified by our experts for free',
    image: 'https://images.unsplash.com/photo-1488605807706-6311addd3f25?w=500&h=300&fit=crop',
    link: '/cars',
    status: 'active',
    start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Luxury Cars Up to 40% Off',
    description: 'Premium BMW, Mercedes, and Audi models at incredible prices',
    image: 'https://images.unsplash.com/photo-1606611013016-969c19d4c624?w=500&h=300&fit=crop',
    link: '/cars',
    status: 'active',
    start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const dummyComplaints = [
  {
    id: '1',
    user_id: 'user-buyer-1',
    seller_id: 'user-1',
    car_id: '1',
    title: 'Mileage issue',
    description: 'The car mileage was different from what was mentioned',
    status: 'resolved',
    priority: 'medium',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user-buyer-2',
    seller_id: 'user-2',
    car_id: '2',
    title: 'Late delivery',
    description: 'The car was delivered 3 days later than agreed',
    status: 'resolved',
    priority: 'low',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'user-buyer-3',
    seller_id: 'user-3',
    car_id: '3',
    title: 'Warranty issue',
    description: 'Warranty terms were not clear from the beginning',
    status: 'pending',
    priority: 'high',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const dummyMessages = [
  {
    id: '1',
    sender_id: 'user-buyer-1',
    receiver_id: 'user-1',
    car_id: '1',
    message: 'Hi, is this car still available?',
    read: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    sender_id: 'user-1',
    receiver_id: 'user-buyer-1',
    car_id: '1',
    message: 'Yes, it is available. Would you like to schedule a viewing?',
    read: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    sender_id: 'user-buyer-2',
    receiver_id: 'user-2',
    car_id: '2',
    message: 'Can you tell me more about the service history?',
    read: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    sender_id: 'user-2',
    receiver_id: 'user-buyer-2',
    car_id: '2',
    message: 'This car has been serviced every 10,000 km at authorized dealers.',
    read: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const dummyAdminStats = {
  totalCars: 6,
  totalUsers: 5,
  totalReviews: 5,
  totalComplaints: 3,
  totalAds: 3,
  activeListings: 6,
  totalRevenue: 198000,
  averageRating: 4.78
};

// Function to populate localStorage with dummy data for development
export const initializeDummyData = () => {
  // Store dummy data in localStorage for easy access during development
  localStorage.setItem('dummy_cars', JSON.stringify(dummyCars));
  localStorage.setItem('dummy_users', JSON.stringify(dummyUsers));
  localStorage.setItem('dummy_reviews', JSON.stringify(dummyReviews));
  localStorage.setItem('dummy_ads', JSON.stringify(dummyAds));
  localStorage.setItem('dummy_complaints', JSON.stringify(dummyComplaints));
  localStorage.setItem('dummy_messages', JSON.stringify(dummyMessages));
  localStorage.setItem('dummy_admin_stats', JSON.stringify(dummyAdminStats));
  
  console.log('✅ Dummy data initialized in localStorage');
};

// Function to get dummy data from various sources
export const getDummyData = (type) => {
  const dataMap = {
    cars: dummyCars,
    users: dummyUsers,
    reviews: dummyReviews,
    ads: dummyAds,
    complaints: dummyComplaints,
    messages: dummyMessages,
    adminStats: dummyAdminStats
  };

  return dataMap[type] || null;
};
