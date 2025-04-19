// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaHome, FaCar, FaAddressBook, FaComments, FaExclamationTriangle, FaUser } from "react-icons/fa";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-600">
            Cheetah
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">

            <Link to="/" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <FaHome className="mr-2" /> {t('home')}
            </Link>
            <Link to="/cars" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <FaCar className="mr-2" /> {t('cars.title')}
            </Link>
            <Link to="/about" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <FaAddressBook className="mr-2" /> {t('about.title')}
            </Link>
            <Link to="/complaints" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <AiOutlineIssuesClose className="mr-2" /> {t('complaints.title')}
            </Link>
            <Link to="/login" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <CiLogin className="mr-2" /> {t('login')}
            </Link>
            <button
              onClick={toggleLanguage}
              className="bg-orange-500 text-white px-3 py-1 rounded"
            >
              {i18n.language === "en" ? "AR" : "EN"}
            </button>
            <img
              src="/logo.png"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-orange-500"
            />
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg
                className="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col mt-2 space-y-2">
            <Link to="/" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <FaHome className="mr-2" /> {t('home')}
            </Link>
            <Link to="/cars" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <FaCar className="mr-2" /> {t('cars.title')}
            </Link>
            <button
              onClick={toggleLanguage}
              className="bg-orange-500 text-white px-3 py-1 rounded"
            >
              {i18n.language === "en" ? "AR" : "EN"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;