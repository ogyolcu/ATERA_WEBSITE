import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Marquee from 'react-fast-marquee';
import { ChevronLeft, ChevronRight, Monitor, Laptop, Gamepad2, Mail, Phone, MapPin, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Landing() {
  const { language, setLanguage, t } = useLanguage();
  const [banners, setBanners] = useState([]);
  const [brands, setBrands] = useState([]);
  const [settings, setSettings] = useState({
    background_color: '#0A0A0A',
    surface_color: '#141414',
    header_color: '#0A0A0A',
    primary_color: '#007AFF',
    text_color: '#FFFFFF',
    text_secondary_color: '#A1A1AA',
    logo_url: '',
    logo_text: 'ATERA',
    banner_shadow_enabled: true,
    banner_shadow_color: '#000000',
    banner_shadow_blur: 10,
    banner_shadow_x: 2,
    banner_shadow_y: 2,
    banner_shadow_opacity: 50,
    banner_subtitle_bold: false,
    banner_subtitle_shadow_enabled: false,
    banner_subtitle_shadow_color: '#000000',
    banner_subtitle_shadow_blur: 5,
    banner_subtitle_shadow_opacity: 50,
    menu_bold: false,
    menu_shadow_enabled: false,
    menu_shadow_color: '#000000',
    menu_shadow_blur: 5,
    menu_shadow_opacity: 50,
    menu_burger_color: '#FFFFFF',
    brands_subtitle_bold: false,
    brands_subtitle_shadow_enabled: false,
    brands_subtitle_shadow_color: '#000000',
    brands_subtitle_shadow_blur: 5,
    brands_subtitle_shadow_opacity: 50,
    heading_font: 'Outfit',
    body_font: 'Manrope',
    heading_size: 'normal',
    body_size: 'normal',
    brands_title_tr: 'Güvenilir Markalar',
    brands_title_en: 'Trusted Brands',
    brands_subtitle_tr: 'Dünya liderlerinden IT ekipmanları',
    brands_subtitle_en: 'IT equipment from world leaders',
    product1_title: 'Laptops',
    product1_desc_tr: 'Profesyoneller için yüksek performanslı laptoplar',
    product1_desc_en: 'High-performance laptops for professionals',
    product2_title: 'Gaming Desk',
    product2_desc_tr: 'Oyuncular için ergonomik gaming masaları',
    product2_desc_en: 'Ergonomic gaming desks for gamers',
    product3_title: 'Monitor Arms',
    product3_desc_tr: 'Ayarlanabilir monitör kolları ve standlar',
    product3_desc_en: 'Adjustable monitor arms and stands',
    menu_products_tr: 'Ürünler',
    menu_products_en: 'Products',
    menu_brands_tr: 'Markalar',
    menu_brands_en: 'Brands',
    menu_contact_tr: 'İletişim',
    menu_contact_en: 'Contact'
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bannersRes, brandsRes, settingsRes] = await Promise.all([
        axios.get(`${API}/public/banners`),
        axios.get(`${API}/public/brands`),
        axios.get(`${API}/public/settings`)
      ]);
      setBanners(bannersRes.data);
      setBrands(brandsRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, contactForm);
      toast.success(t('contact_success'));
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error(t('contact_error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Font size calculations
  const getHeadingSize = (base) => {
    const sizes = {
      small: { h1: 'text-3xl sm:text-4xl lg:text-5xl', h2: 'text-2xl sm:text-3xl', h3: 'text-lg sm:text-xl' },
      normal: { h1: 'text-4xl sm:text-5xl lg:text-6xl', h2: 'text-3xl sm:text-4xl', h3: 'text-xl sm:text-2xl' },
      large: { h1: 'text-5xl sm:text-6xl lg:text-7xl', h2: 'text-4xl sm:text-5xl', h3: 'text-2xl sm:text-3xl' },
      xlarge: { h1: 'text-6xl sm:text-7xl lg:text-8xl', h2: 'text-5xl sm:text-6xl', h3: 'text-3xl sm:text-4xl' },
    };
    return sizes[settings.heading_size]?.[base] || sizes.normal[base];
  };

  const getBodySize = () => {
    const sizes = {
      small: 'text-sm',
      normal: 'text-base',
      large: 'text-lg',
      xlarge: 'text-xl',
    };
    return sizes[settings.body_size] || 'text-base';
  };

  const getSubtitleSize = () => {
    const sizes = {
      small: 'text-base sm:text-lg',
      normal: 'text-lg sm:text-xl',
      large: 'text-xl sm:text-2xl',
      xlarge: 'text-2xl sm:text-3xl',
    };
    return sizes[settings.body_size] || 'text-lg sm:text-xl';
  };

  const getBannerTextShadow = () => {
    if (!settings.banner_shadow_enabled) return 'none';
    const r = parseInt(settings.banner_shadow_color.slice(1, 3), 16);
    const g = parseInt(settings.banner_shadow_color.slice(3, 5), 16);
    const b = parseInt(settings.banner_shadow_color.slice(5, 7), 16);
    const opacity = settings.banner_shadow_opacity / 100;
    return `${settings.banner_shadow_x}px ${settings.banner_shadow_y}px ${settings.banner_shadow_blur}px rgba(${r},${g},${b},${opacity})`;
  };

  const getBannerSubtitleShadow = () => {
    if (!settings.banner_subtitle_shadow_enabled) return 'none';
    const r = parseInt(settings.banner_subtitle_shadow_color.slice(1, 3), 16);
    const g = parseInt(settings.banner_subtitle_shadow_color.slice(3, 5), 16);
    const b = parseInt(settings.banner_subtitle_shadow_color.slice(5, 7), 16);
    const opacity = settings.banner_subtitle_shadow_opacity / 100;
    return `0px 0px ${settings.banner_subtitle_shadow_blur}px rgba(${r},${g},${b},${opacity})`;
  };

  const getMenuShadow = () => {
    if (!settings.menu_shadow_enabled) return 'none';
    const r = parseInt(settings.menu_shadow_color.slice(1, 3), 16);
    const g = parseInt(settings.menu_shadow_color.slice(3, 5), 16);
    const b = parseInt(settings.menu_shadow_color.slice(5, 7), 16);
    const opacity = settings.menu_shadow_opacity / 100;
    return `0px 0px ${settings.menu_shadow_blur}px rgba(${r},${g},${b},${opacity})`;
  };

  const getBrandsSubtitleShadow = () => {
    if (!settings.brands_subtitle_shadow_enabled) return 'none';
    const r = parseInt(settings.brands_subtitle_shadow_color.slice(1, 3), 16);
    const g = parseInt(settings.brands_subtitle_shadow_color.slice(3, 5), 16);
    const b = parseInt(settings.brands_subtitle_shadow_color.slice(5, 7), 16);
    const opacity = settings.brands_subtitle_shadow_opacity / 100;
    return `0px 0px ${settings.brands_subtitle_shadow_blur}px rgba(${r},${g},${b},${opacity})`;
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: settings.background_color, fontFamily: settings.body_font }}>
      {/* Google Fonts Link */}
      <link 
        href={`https://fonts.googleapis.com/css2?family=${settings.heading_font.replace(' ', '+')}:wght@400;500;600;700;800&family=${settings.body_font.replace(' ', '+')}:wght@400;500;600;700&display=swap`} 
        rel="stylesheet" 
      />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50" data-testid="header" style={{ backgroundColor: settings.header_color, backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" data-testid="logo">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.logo_text} className="object-contain" style={{ height: '95%', maxHeight: '52px' }} />
              ) : (
                <span className="text-2xl font-bold" style={{ color: settings.text_color, fontFamily: settings.heading_font }}>{settings.logo_text}</span>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('products')} className="hover:opacity-100 transition-colors" style={{ color: settings.text_secondary_color, fontFamily: settings.body_font, fontWeight: settings.menu_bold ? 'bold' : 'normal', textShadow: getMenuShadow() }} data-testid="nav-products">
                {language === 'tr' ? settings.menu_products_tr : settings.menu_products_en}
              </button>
              <button onClick={() => scrollToSection('brands')} className="hover:opacity-100 transition-colors" style={{ color: settings.text_secondary_color, fontFamily: settings.body_font, fontWeight: settings.menu_bold ? 'bold' : 'normal', textShadow: getMenuShadow() }} data-testid="nav-brands">
                {language === 'tr' ? settings.menu_brands_tr : settings.menu_brands_en}
              </button>
              <button onClick={() => scrollToSection('contact')} className="hover:opacity-100 transition-colors" style={{ color: settings.text_secondary_color, fontFamily: settings.body_font, fontWeight: settings.menu_bold ? 'bold' : 'normal', textShadow: getMenuShadow() }} data-testid="nav-contact">
                {language === 'tr' ? settings.menu_contact_tr : settings.menu_contact_en}
              </button>
              <Link to="/admin" className="hover:opacity-100 transition-colors" style={{ color: settings.text_secondary_color, fontFamily: settings.body_font, fontWeight: settings.menu_bold ? 'bold' : 'normal', textShadow: getMenuShadow() }} data-testid="nav-admin">
                {t('nav_admin')}
              </Link>
            </nav>

            {/* Language Switcher + Mobile Menu */}
            <div className="flex items-center gap-4">
              <div className="lang-switch" data-testid="language-switcher">
                <button
                  onClick={() => setLanguage('tr')}
                  className={`lang-btn ${language === 'tr' ? 'active' : ''}`}
                  style={{ backgroundColor: language === 'tr' ? settings.primary_color : 'transparent' }}
                  data-testid="lang-tr"
                >
                  TR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                  style={{ backgroundColor: language === 'en' ? settings.primary_color : 'transparent' }}
                  data-testid="lang-en"
                >
                  EN
                </button>
              </div>
              
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ color: settings.menu_burger_color }}
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4" style={{ backgroundColor: settings.background_color }} data-testid="mobile-menu">
            <nav className="flex flex-col gap-4 px-6">
              <button onClick={() => scrollToSection('products')} className="text-left py-2" style={{ color: settings.text_color }}>{language === 'tr' ? settings.menu_products_tr : settings.menu_products_en}</button>
              <button onClick={() => scrollToSection('brands')} className="text-left py-2" style={{ color: settings.text_color }}>{language === 'tr' ? settings.menu_brands_tr : settings.menu_brands_en}</button>
              <button onClick={() => scrollToSection('contact')} className="text-left py-2" style={{ color: settings.text_color }}>{language === 'tr' ? settings.menu_contact_tr : settings.menu_contact_en}</button>
              <Link to="/admin" className="py-2" style={{ color: settings.text_color }}>{t('nav_admin')}</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section" data-testid="hero-section">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="hero-slide"
            style={{ opacity: index === currentSlide ? 1 : 0 }}
            data-testid={`hero-slide-${index}`}
          >
            <img src={banner.url} alt={banner.alt} />
            <div className="hero-overlay" />
          </div>
        ))}
        
        {banners.length > 0 && (
          <div className="hero-content max-w-7xl mx-auto">
            <div className="animate-slideUp">
              <h1 className={`${getHeadingSize('h1')} font-bold tracking-tighter mb-4`} style={{ color: settings.text_color, fontFamily: settings.heading_font, textShadow: getBannerTextShadow() }} data-testid="hero-title">
                {language === 'tr' ? banners[currentSlide]?.title_tr : banners[currentSlide]?.title_en}
              </h1>
              <p className={`${getSubtitleSize()} mb-8 max-w-2xl`} style={{ color: settings.text_secondary_color, fontFamily: settings.body_font, textShadow: getBannerSubtitleShadow(), fontWeight: settings.banner_subtitle_bold ? 'bold' : 'normal' }} data-testid="hero-subtitle">
                {language === 'tr' ? banners[currentSlide]?.subtitle_tr : banners[currentSlide]?.subtitle_en}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => scrollToSection('products')}
                  className="text-white px-8 py-3 rounded-lg font-medium"
                  style={{ backgroundColor: settings.primary_color }}
                  data-testid="hero-cta"
                >
                  {t('hero_cta')}
                </Button>
                <Button 
                  onClick={() => scrollToSection('contact')}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 px-8 py-3 rounded-lg font-medium"
                  style={{ color: settings.text_color }}
                  data-testid="hero-contact"
                >
                  {t('hero_contact')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Carousel Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              data-testid="carousel-prev"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              data-testid="carousel-next"
            >
              <ChevronRight size={24} />
            </button>
            <div className="carousel-indicators" data-testid="carousel-indicators">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  data-testid={`carousel-dot-${index}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 md:py-32 px-6 md:px-12" data-testid="products-section" style={{ backgroundColor: settings.background_color }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl p-8 text-center hover:scale-105 transition-transform border border-white/10" style={{ backgroundColor: settings.surface_color }} data-testid="product-laptops">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${settings.primary_color}33` }}>
                <Laptop style={{ color: settings.primary_color }} size={32} />
              </div>
              <h3 className={`${getHeadingSize('h3')} font-semibold mb-3`} style={{ color: settings.text_color, fontFamily: settings.heading_font }}>{settings.product1_title}</h3>
              <p className={getBodySize()} style={{ color: settings.text_secondary_color, fontFamily: settings.body_font }}>
                {language === 'tr' ? settings.product1_desc_tr : settings.product1_desc_en}
              </p>
            </div>
            <div className="rounded-2xl p-8 text-center hover:scale-105 transition-transform border border-white/10" style={{ backgroundColor: settings.surface_color }} data-testid="product-gaming">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${settings.primary_color}33` }}>
                <Gamepad2 style={{ color: settings.primary_color }} size={32} />
              </div>
              <h3 className={`${getHeadingSize('h3')} font-semibold mb-3`} style={{ color: settings.text_color, fontFamily: settings.heading_font }}>{settings.product2_title}</h3>
              <p className={getBodySize()} style={{ color: settings.text_secondary_color, fontFamily: settings.body_font }}>
                {language === 'tr' ? settings.product2_desc_tr : settings.product2_desc_en}
              </p>
            </div>
            <div className="rounded-2xl p-8 text-center hover:scale-105 transition-transform border border-white/10" style={{ backgroundColor: settings.surface_color }} data-testid="product-monitors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${settings.primary_color}33` }}>
                <Monitor style={{ color: settings.primary_color }} size={32} />
              </div>
              <h3 className={`${getHeadingSize('h3')} font-semibold mb-3`} style={{ color: settings.text_color, fontFamily: settings.heading_font }}>{settings.product3_title}</h3>
              <p className={getBodySize()} style={{ color: settings.text_secondary_color, fontFamily: settings.body_font }}>
                {language === 'tr' ? settings.product3_desc_tr : settings.product3_desc_en}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-20 md:py-32 border-y border-white/5" data-testid="brands-section" style={{ backgroundColor: settings.background_color }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 text-center">
          <h2 className={`${getHeadingSize('h2')} font-semibold tracking-tight mb-4`} style={{ color: settings.text_color, fontFamily: settings.heading_font }} data-testid="brands-title">
            {language === 'tr' ? settings.brands_title_tr : settings.brands_title_en}
          </h2>
          <p className={getBodySize()} style={{ color: settings.text_secondary_color, fontFamily: settings.body_font, textShadow: getBrandsSubtitleShadow(), fontWeight: settings.brands_subtitle_bold ? 'bold' : 'normal' }} data-testid="brands-subtitle">
            {language === 'tr' ? settings.brands_subtitle_tr : settings.brands_subtitle_en}
          </p>
        </div>
        
        {brands.length > 0 && (
          <Marquee gradient={false} speed={40} pauseOnHover data-testid="brands-marquee">
            {brands.concat(brands).map((brand, index) => (
              <div key={`${brand.id}-${index}`} className="mx-12 flex items-center justify-center">
                <div className="flex items-center justify-center bg-white/5 rounded-xl p-5" style={{ width: '216px', height: '108px' }}>
                  <img
                    src={brand.url}
                    alt={brand.name}
                    className="brand-logo max-w-full object-contain"
                    style={{ maxHeight: '65px' }}
                    data-testid={`brand-logo-${brand.name.toLowerCase()}`}
                  />
                </div>
              </div>
            ))}
          </Marquee>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 px-6 md:px-12" data-testid="contact-section" style={{ backgroundColor: settings.background_color }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div>
              <h2 className={`${getHeadingSize('h2')} font-semibold tracking-tight mb-4`} style={{ color: settings.text_color, fontFamily: settings.heading_font }} data-testid="contact-title">
                {t('contact_title')}
              </h2>
              <p className={`${getBodySize()} mb-8`} style={{ color: settings.text_secondary_color, fontFamily: settings.body_font }} data-testid="contact-subtitle">{t('contact_subtitle')}</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${settings.primary_color}33` }}>
                    <MapPin style={{ color: settings.primary_color }} size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1" style={{ color: settings.text_color, fontFamily: settings.heading_font }}>{t('footer_address')}</h4>
                    <p className={getBodySize()} style={{ color: settings.text_secondary_color, fontFamily: settings.body_font }}>İstanbul, Türkiye</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${settings.primary_color}33` }}>
                    <Phone style={{ color: settings.primary_color }} size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1" style={{ color: settings.text_color, fontFamily: settings.heading_font }}>{t('footer_phone')}</h4>
                    <p className={getBodySize()} style={{ color: settings.text_secondary_color, fontFamily: settings.body_font }}>+90 212 XXX XX XX</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl p-8 border border-white/10" style={{ backgroundColor: settings.surface_color }}>
              <form onSubmit={handleContactSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <Input
                    type="text"
                    placeholder={t('contact_name')}
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-white/10"
                    style={{ backgroundColor: settings.background_color, color: settings.text_color, fontFamily: settings.body_font }}
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={t('contact_email')}
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-white/10"
                    style={{ backgroundColor: settings.background_color, color: settings.text_color, fontFamily: settings.body_font }}
                    data-testid="contact-email-input"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder={t('contact_phone')}
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-white/10"
                    style={{ backgroundColor: settings.background_color, color: settings.text_color, fontFamily: settings.body_font }}
                    data-testid="contact-phone-input"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder={t('contact_message')}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg resize-none border border-white/10"
                    style={{ backgroundColor: settings.background_color, color: settings.text_color, fontFamily: settings.body_font }}
                    data-testid="contact-message-input"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: settings.primary_color, color: settings.text_color }}
                  data-testid="contact-submit-btn"
                >
                  {submitting ? '...' : t('contact_submit')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/10" data-testid="footer" style={{ backgroundColor: settings.background_color }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.logo_text} className="h-6 object-contain" />
            ) : (
              <span className="text-xl font-bold" style={{ color: settings.text_color, fontFamily: settings.heading_font }}>{settings.logo_text}</span>
            )}
          </div>
          <p className={`${getBodySize()} text-sm`} style={{ color: settings.text_secondary_color, fontFamily: settings.body_font }}>
            © {new Date().getFullYear()} Atera. {t('footer_rights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
