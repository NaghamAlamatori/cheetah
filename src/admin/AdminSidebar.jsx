import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdPeopleAlt, MdDirectionsCar, MdRateReview, MdSettings, MdReport } from "react-icons/md";

function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const linkClasses = (path) =>
    `flex items-center p-2 rounded hover:bg-orange-200 dark:hover:bg-gray-700 ${
      location.pathname === path ? "bg-orange-100 dark:bg-gray-800" : ""
    }`;

  return (
    <div className={`hidden md:flex flex-col bg-gray-100 dark:bg-gray-900 border-r border-orange-300 p-4 sticky top-0 min-h-screen transition-all duration-300 ease-in-out ${isOpen ? "w-56" : "w-20"}`}>
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
          <MdSettings className="mr-2" /> {isOpen && "Ads"}
        </Link>
        <Link to="/admin/settings" className={linkClasses("/admin/settings")}>
          <MdSettings className="mr-2" /> {isOpen && "Settings"}
        </Link>
      </nav>
    </div>
  );
}

export default AdminSidebar;
