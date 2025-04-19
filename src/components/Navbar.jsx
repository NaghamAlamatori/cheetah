import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaHome, FaCar, FaAddressBook, FaPlusCircle, FaUser } from "react-icons/fa";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";
import supabase from "../utils/supabase";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Check current user session
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png" // Replace with your logo path
              alt="Cheetah Logo"
              className="h-12 w-12 rounded-full object-cover mr-2"
            />
            <span className="text-2xl font-bold text-orange-600 hidden sm:inline">Cheetah</span>
          </Link>


          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <FaHome className="mr-2" /> {t('home')}
            </Link>
            <Link to="/cars" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <FaCar className="mr-2" /> {t('cars.title')}
            </Link>
            
            {user && (
              <Link to="/cars/add" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
                <FaPlusCircle className="mr-2" /> {t('addCar.title')}
              </Link>
            )}
            
            <Link to="/about" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <FaAddressBook className="mr-2" /> {t('about.title')}
            </Link>
            <Link to="/complaints" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
              <AiOutlineIssuesClose className="mr-2" /> {t('complaints.title')}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-200 hover:text-orange-500"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
                <CiLogin className="mr-2" /> {t('login')}
              </Link>
            )}
            
            <button
              onClick={toggleLanguage}
              className="bg-orange-500 text-white px-3 py-1 rounded"
            >
              {i18n.language === "en" ? "AR" : "EN"}
            </button>
            
            {user && (
              <img
                src={user.user_metadata?.avatar_url || "/default-profile.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-orange-500"
              />
            )}
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
          <div className="md:hidden flex flex-col mt-2 space-y-2 pb-4">
            <Link to="/" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500 p-2">
              <FaHome className="mr-2" /> {t('home')}
            </Link>
            <Link to="/cars" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500 p-2">
              <FaCar className="mr-2" /> {t('cars.title')}
            </Link>
            
            {user && (
              <>
                <Link to="/cars/add" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500 p-2">
                  <FaPlusCircle className="mr-2" /> {t('addCar')}
                </Link>
                <Link to="/profile" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500 p-2">
                  <FaUser className="mr-2" /> {t('profile')}
                </Link>
              </>
            )}
            
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500 p-2 text-left"
              >
                {t('logout')}
              </button>
            ) : (
              <Link to="/login" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500 p-2">
                <CiLogin className="mr-2" /> {t('login')}
              </Link>
            )}
            
            <button
              onClick={toggleLanguage}
              className="bg-orange-500 text-white px-3 py-1 rounded w-fit"
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