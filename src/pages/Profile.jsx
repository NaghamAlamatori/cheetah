// frontend\src\pages\Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{t("profile")}</h1>
      {user ? (
        <div className="space-y-4">
          <p>
            <strong>{t("email")}:</strong> {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            {t("logout")}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">{t("pleaseLogin")}</p>
          <Link
            to="/login"
            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          >
            {t("login")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;