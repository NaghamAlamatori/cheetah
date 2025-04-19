import React from "react";
import { useTranslation } from "react-i18next";

function AdBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-orange-600 text-white p-4 my-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{t('adBanner.title')}</h2>
      <p className="text-sm">
        {t('adBanner.description')}
      </p>
    </div>
  );
}

export default AdBanner;