import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { supabase } from '../utils/supabase';

function Footer() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    facebook: "#",
    instagram: "#",
    whatsapp: "#"
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('facebook, instagram, whatsapp')
          .limit(1);
        
        if (error) {
          console.error('Error fetching settings:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setSettings({
            facebook: data[0].facebook || "#",
            instagram: data[0].instagram || "#",
            whatsapp: data[0].whatsapp || "#"
          });
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    
    fetchSettings();
  }, []);
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-orange-500">Cheetah</h2>
            <p className="text-gray-400">{t('footer.tagline')}</p>
          </div>
          <div className="flex space-x-6 items-center">
            <a 
              href={settings.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-orange-500 flex items-center gap-1"
            >
              <FaFacebook /> {t('socialMedia.facebook')}
            </a>
            <a 
              href={settings.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-orange-500 flex items-center gap-1"
            >
              <FaInstagram /> {t('socialMedia.instagram')}
            </a>
            <a 
              href={settings.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-orange-500 flex items-center gap-1"
            >
              <FaWhatsapp /> {t('socialMedia.whatsapp')}
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400">
         {new Date().getFullYear()} Cheetah. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}

export default Footer