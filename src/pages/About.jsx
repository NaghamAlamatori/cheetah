import React from "react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">{t('about.title')}</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="mb-4">{t('about.content1')}</p>
        <p className="mb-4">{t('about.content2')}</p>
        <p className="mb-4">{t('about.content3')}</p>
        <p>{t('about.content4')}</p>
      </div>
    </div>
  );
};

export default About;
