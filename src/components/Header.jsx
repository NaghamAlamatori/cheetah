// frontend\src\components\Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-orange-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Cheetah
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:underline">
            {t("home")}
          </Link>
          <Link to="/cars" className="hover:underline">
            {t("cars")}
          </Link>
          <Link to="/chat" className="hover:underline">
            {t("chat")}
          </Link>
          <Link to="/complaints" className="hover:underline">
            {t("complaints")}
          </Link>
          <Link to="/reviews" className="hover:underline">
            {t("reviews")}
          </Link>
          <LanguageSwitcher />
          <Link to="/profile" className="hover:underline">
            {t("profile")}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;