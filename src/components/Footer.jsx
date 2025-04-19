import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

function Footer() {
  const { t } = useTranslation()
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-orange-500">Cheetah</h2>
            <p className="text-gray-400">{t('footer.tagline')}</p>
          </div>
          <div className="flex space-x-6 items-center">
            <a href="#" className="hover:text-orange-500 flex items-center gap-1">
              <FaFacebook /> {t('socialMedia.facebook')}
            </a>
            <a href="#" className="hover:text-orange-500 flex items-center gap-1">
              <FaInstagram /> {t('socialMedia.instagram')}
            </a>
            <a href="#" className="hover:text-orange-500 flex items-center gap-1">
              <FaWhatsapp /> {t('socialMedia.whatsapp')}
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400">
          © {new Date().getFullYear()} Cheetah. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}

export default Footer