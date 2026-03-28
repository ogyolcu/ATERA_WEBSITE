import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  tr: {
    // Header
    nav_products: 'Ürünler',
    nav_brands: 'Markalar',
    nav_contact: 'İletişim',
    nav_admin: 'Yönetim',
    
    // Hero
    hero_cta: 'Ürünleri Keşfet',
    hero_contact: 'Bize Ulaşın',
    
    // Brands Section
    brands_title: 'Güvenilir Markalar',
    brands_subtitle: 'Dünya liderlerinden IT ekipmanları',
    
    // Contact Section
    contact_title: 'İletişim',
    contact_subtitle: 'Sorularınız için bize ulaşın',
    contact_name: 'Adınız',
    contact_email: 'E-posta',
    contact_phone: 'Telefon',
    contact_message: 'Mesajınız',
    contact_submit: 'Gönder',
    contact_success: 'Mesajınız gönderildi!',
    contact_error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    
    // Footer
    footer_rights: 'Tüm hakları saklıdır.',
    footer_address: 'Adres',
    footer_phone: 'Telefon',
    footer_email: 'E-posta',
    
    // Admin
    admin_login: 'Giriş Yap',
    admin_email: 'E-posta',
    admin_password: 'Şifre',
    admin_dashboard: 'Yönetim Paneli',
    admin_banners: 'Bannerlar',
    admin_brands: 'Markalar',
    admin_messages: 'Mesajlar',
    admin_logout: 'Çıkış',
    admin_add: 'Ekle',
    admin_edit: 'Düzenle',
    admin_delete: 'Sil',
    admin_save: 'Kaydet',
    admin_cancel: 'İptal',
    admin_confirm_delete: 'Silmek istediğinize emin misiniz?',
  },
  en: {
    // Header
    nav_products: 'Products',
    nav_brands: 'Brands',
    nav_contact: 'Contact',
    nav_admin: 'Admin',
    
    // Hero
    hero_cta: 'Explore Products',
    hero_contact: 'Contact Us',
    
    // Brands Section
    brands_title: 'Trusted Brands',
    brands_subtitle: 'IT equipment from world leaders',
    
    // Contact Section
    contact_title: 'Contact',
    contact_subtitle: 'Get in touch with us',
    contact_name: 'Your Name',
    contact_email: 'Email',
    contact_phone: 'Phone',
    contact_message: 'Your Message',
    contact_submit: 'Send',
    contact_success: 'Your message has been sent!',
    contact_error: 'An error occurred. Please try again.',
    
    // Footer
    footer_rights: 'All rights reserved.',
    footer_address: 'Address',
    footer_phone: 'Phone',
    footer_email: 'Email',
    
    // Admin
    admin_login: 'Login',
    admin_email: 'Email',
    admin_password: 'Password',
    admin_dashboard: 'Admin Dashboard',
    admin_banners: 'Banners',
    admin_brands: 'Brands',
    admin_messages: 'Messages',
    admin_logout: 'Logout',
    admin_add: 'Add',
    admin_edit: 'Edit',
    admin_delete: 'Delete',
    admin_save: 'Save',
    admin_cancel: 'Cancel',
    admin_confirm_delete: 'Are you sure you want to delete?',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('atera_lang') || 'tr';
  });

  useEffect(() => {
    localStorage.setItem('atera_lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
