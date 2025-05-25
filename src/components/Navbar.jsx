import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaHome, FaCar, FaAddressBook, FaPlusCircle, FaUser, FaUsers, FaBars } from "react-icons/fa";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../utils/supabase";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const { user, isAdmin, loading, userRole } = useAuth();
  
  // Debug logs (commented out for production)
  // console.log('--- NAVBAR DEBUG ---');
  // console.log('User object:', user);
  // console.log('isAdmin:', isAdmin);
  // console.log('userRole:', userRole);
  // console.log('User ID:', user?.id);
  // console.log('User metadata:', user?.user_metadata);
  // console.log('App metadata:', user?.app_metadata);
  // console.log('-------------------');
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  // Close admin menu when clicking outside
  const adminMenuRef = React.useRef(null);
  
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setIsAdminMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="animate-pulse h-12 w-12 rounded-full bg-gray-300" />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {isAdmin && (
                <div className="relative mr-3" ref={adminMenuRef}>
                  <button 
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    aria-label="Admin Menu"
                    aria-expanded={isAdminMenuOpen}
                  >
                    <FaBars className="h-6 w-6" />
                  </button>
                  {isAdminMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <Link 
                        to="/admin/users" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        {t("admin.users")}
                      </Link>
                      <Link 
                        to="/admin/ads" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        {t("admin.ads")}
                      </Link>
                      <Link 
                        to="/admin/complaints" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        {t("admin.complaints")}
                      </Link>
                      <Link 
                        to="/admin/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        {t("admin.settings")}
                      </Link>
                    </div>
                  )}
                </div>
              )}
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Cheetah Logo" className="h-12 w-12 rounded-full object-cover mr-2" />
                <span className="text-2xl font-bold text-orange-600 hidden sm:inline">Cheetah</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/" icon={<FaHome />} text={t("home")} />
              <NavLink to="/cars" icon={<FaCar />} text={t("cars.title")} />
              <NavLink to="/ads" icon={<FaPlusCircle />} text={t("ads.title")} />
              <NavLink to="/about" icon={<FaAddressBook />} text={t("about.title")} />
              {user && <NavLink to="/cars/add" icon={<FaPlusCircle />} text={t("addCar.title")} />}
              <NavLink to="/complaints" icon={<AiOutlineIssuesClose />} text={t("complaints.title")} />

              {!user ? (
                <NavLink 
                  to="/login" 
                  icon={<CiLogin className="h-5 w-5" />} 
                  text={t("login")} 
                />
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="h-10 w-10 rounded-full cursor-pointer"
                      onClick={() => navigate("/profile")}
                    />
                  </div>
                </div>
              )}

              <LanguageToggle currentLang={i18n.language} onClick={toggleLanguage} />
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-1 focus:outline-none">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden flex flex-col space-y-2 pb-4">
              <MobileNavLink to="/" icon={<FaHome />} text={t("home")} onClick={() => setIsOpen(false)} />
              <MobileNavLink to="/cars" icon={<FaCar />} text={t("cars.title")} onClick={() => setIsOpen(false)} />
              <MobileNavLink to="/ads" icon={<FaPlusCircle />} text={t("ads.title")} onClick={() => setIsOpen(false)} />
              <MobileNavLink to="/about" icon={<FaAddressBook />} text={t("about.title")} onClick={() => setIsOpen(false)} />
              {user && <MobileNavLink to="/cars/add" icon={<FaPlusCircle />} text={t("addCar.title")} onClick={() => setIsOpen(false)} />}
              <MobileNavLink to="/complaints" icon={<AiOutlineIssuesClose />} text={t("complaints.title")} onClick={() => setIsOpen(false)} />

              {user ? (
                <>
                  {isAdmin && <MobileNavLink to="/admin" icon={<FaUsers />} text={t("admin.panel")} onClick={() => setIsOpen(false)} />}
                  <Link to="/profile" state={{ logout: handleLogout }} className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
                {<FaUser />}
                <span className="ml-2">{t("profile")}</span>
              </Link>
                
                </>
              ) : (
                <MobileNavLink to="/login" icon={<CiLogin />} text={t("login")} onClick={() => setIsOpen(false)} />
              )}

              <button onClick={() => { toggleLanguage(); setIsOpen(false); }}
                      className="bg-orange-500 text-white px-3 py-1 rounded w-fit mx-2 hover:bg-orange-600">
                {i18n.language === "en" ? "AR" : "EN"}
              </button>
            </div>
          )}
        </div>
      </nav>


    </>
  );
}
  
const NavLink = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500">
    <span className="mr-2">{icon}</span> {text}
  </Link>
);

const MobileNavLink = ({ to, icon, text, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500 px-4 py-2">
    <span className="mr-2">{icon}</span> {text}
  </Link>
);

const LanguageToggle = ({ currentLang, onClick }) => (
  <button onClick={onClick} className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">
    {currentLang === "en" ? "AR" : "EN"}
  </button>
);

export default Navbar;
