import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { MdDashboard, MdPeopleAlt, MdDirectionsCar, MdRateReview, MdSettings, MdReport, MdMenu, MdAnnouncement } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const linkClasses = (path) =>
    `flex items-center p-2 rounded hover:bg-orange-200 dark:hover:bg-gray-700 ${
      location.pathname.startsWith(path) ? "bg-orange-100 dark:bg-gray-800" : ""
    }`;

  return (
    <div className={`md:flex flex-col bg-gray-100 dark:bg-gray-900 border-r border-orange-300 p-4 transition-all duration-300 ease-in-out ${
      isOpen ? "w-56" : "w-20"
    }`}>
      <button
        onClick={toggleSidebar}
        className="text-orange-600 mb-4 self-end focus:outline-none"
        title={isOpen ? "Collapse" : "Expand"}
      >
        {isOpen ? "←" : "→"}
      </button>

      <nav className="space-y-2">
        <Link to="/admin" className={linkClasses("/admin")}>
          <MdDashboard className="mr-2" /> {isOpen && "Dashboard"}
        </Link>
        <Link to="/admin/users" className={linkClasses("/admin/users")}>
          <MdPeopleAlt className="mr-2" /> {isOpen && "Users"}
        </Link>
        <Link to="/admin/cars" className={linkClasses("/admin/cars")}>
          <MdDirectionsCar className="mr-2" /> {isOpen && "Cars"}
        </Link>
        <Link to="/admin/reviews" className={linkClasses("/admin/reviews")}>
          <MdRateReview className="mr-2" /> {isOpen && "Reviews"}
        </Link>
        <Link to="/admin/complaints" className={linkClasses("/admin/complaints")}>
          <MdReport className="mr-2" /> {isOpen && "Complaints"}
        </Link>
        <Link to="/admin/ads" className={linkClasses("/admin/ads")}>
          <MdAnnouncement className="mr-2" /> {isOpen && "Ads"}
        </Link>
        <Link to="/admin/settings" className={linkClasses("/admin/settings")}>
          <MdSettings className="mr-2" /> {isOpen && "Settings"}
        </Link>
      </nav>
    </div>
  );
}

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('AdminLayout mounted');
    console.log('Current user:', user);
    console.log('Is admin:', isAdmin);
    console.log('Current path:', location.pathname);

    if (!loading && !user) {
      console.log('No user found, redirecting to login');
      navigate('/login', { state: { from: location.pathname } });
    } else if (!loading && user && !isAdmin) {
      console.log('User is not admin, redirecting to home');
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate, location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-md p-2">
        <button
          onClick={toggleMobileSidebar}
          className="text-orange-600 p-2 rounded-md hover:bg-orange-100 dark:hover:bg-gray-700"
        >
          <MdMenu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row pt-16">
        {/* Mobile sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMobileSidebar}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg">
              <AdminSidebar isOpen={true} toggleSidebar={toggleSidebar} />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden md:block fixed top-16 bottom-0">
          <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main content */}
        <div className={`flex-1 p-4 transition-all duration-300 ${isSidebarOpen ? 'md:ml-56' : 'md:ml-20'}`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
