import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUsers, FaCar, FaComment, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, title, value, link, bgColor }) => (
  <Link to={link} className={`block p-6 rounded-lg shadow-md ${bgColor} text-white hover:shadow-lg transition-shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-3xl">
        {icon}
      </div>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const { t } = useTranslation();
  
  // Mock data - replace with actual data from your API
  const stats = [
    {
      title: t('admin.totalUsers'),
      value: '1,234',
      icon: <FaUsers />,
      link: '/admin/users',
      bgColor: 'bg-blue-500'
    },
    {
      title: t('admin.totalCars'),
      value: '567',
      icon: <FaCar />,
      link: '/admin/cars',
      bgColor: 'bg-green-500'
    },
    {
      title: t('admin.totalReviews'),
      value: '890',
      icon: <FaComment />,
      link: '/admin/reviews',
      bgColor: 'bg-yellow-500'
    },
    {
      title: t('admin.pendingComplaints'),
      value: '12',
      icon: <FaExclamationTriangle />,
      link: '/admin/complaints',
      bgColor: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('admin.dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            link={stat.link}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {t('admin.quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users/new"
            className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
          >
            {t('admin.addNewUser')}
          </Link>
          <Link
            to="/admin/cars/verify"
            className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
          >
            {t('admin.verifyCars')}
          </Link>
          <Link
            to="/admin/reviews/moderation"
            className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
          >
            {t('admin.moderateReviews')}
          </Link>
          <Link
            to="/admin/settings"
            className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
          >
            {t('admin.siteSettings')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;