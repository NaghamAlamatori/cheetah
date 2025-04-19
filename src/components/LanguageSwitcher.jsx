import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  return (
    <button onClick={toggleLanguage}>
      {i18n.language === "en" ? "🇦🇪 Arabic" : "🇺🇸 English"}
    </button>
  );
};

export default LanguageSwitcher;
