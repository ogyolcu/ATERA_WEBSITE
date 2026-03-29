import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { LogOut, Plus, Pencil, Trash2, Image, Mail, Eye, EyeOff, Palette } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [banners, setBanners] = useState([]);
  const [brands, setBrands] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState({
    background_color: '#0A0A0A',
    surface_color: '#141414',
    primary_color: '#007AFF',
    text_color: '#FFFFFF',
    text_secondary_color: '#A1A1AA',
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
  const [savingSettings, setSavingSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('colors');

  const fontOptions = [
    { value: 'Outfit', label: 'Outfit' },
    { value: 'Manrope', label: 'Manrope' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Raleway', label: 'Raleway' },
    { value: 'Nunito', label: 'Nunito' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  ];

  const sizeOptions = [
    { value: 'small', label: 'Küçük' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Büyük' },
    { value: 'xlarge', label: 'Çok Büyük' },
  ];
  
  const [bannerDialog, setBannerDialog] = useState(false);
  const [brandDialog, setBrandDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  
  const [bannerForm, setBannerForm] = useState({
    url: '', alt: '', title_tr: '', title_en: '', subtitle_tr: '', subtitle_en: '', link: '', order: 0, active: true
  });
  const [brandForm, setBrandForm] = useState({ name: '', url: '', link: '', order: 0, active: true });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [bannersRes, brandsRes, messagesRes, settingsRes] = await Promise.all([
        axios.get(`${API}/admin/banners`, { withCredentials: true }),
        axios.get(`${API}/admin/brands`, { withCredentials: true }),
        axios.get(`${API}/admin/messages`, { withCredentials: true }),
        axios.get(`${API}/admin/settings`, { withCredentials: true })
      ]);
      setBanners(bannersRes.data);
      setBrands(brandsRes.data);
      setMessages(messagesRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        navigate('/admin');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  // Banner CRUD
  const openBannerDialog = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm(banner);
    } else {
      setEditingBanner(null);
      setBannerForm({ url: '', alt: '', title_tr: '', title_en: '', subtitle_tr: '', subtitle_en: '', link: '', order: 0, active: true });
    }
    setBannerDialog(true);
  };

  const saveBanner = async () => {
    try {
      if (editingBanner) {
        await axios.put(`${API}/admin/banners/${editingBanner.id}`, bannerForm, { withCredentials: true });
        toast.success('Banner updated');
      } else {
        await axios.post(`${API}/admin/banners`, bannerForm, { withCredentials: true });
        toast.success('Banner created');
      }
      setBannerDialog(false);
      fetchData();
    } catch (error) {
      toast.error('Error saving banner');
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm(t('admin_confirm_delete'))) return;
    try {
      await axios.delete(`${API}/admin/banners/${id}`, { withCredentials: true });
      toast.success('Banner deleted');
      fetchData();
    } catch (error) {
      toast.error('Error deleting banner');
    }
  };

  // Brand CRUD
  const openBrandDialog = (brand = null) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandForm(brand);
    } else {
      setEditingBrand(null);
      setBrandForm({ name: '', url: '', link: '', order: 0, active: true });
    }
    setBrandDialog(true);
  };

  const saveBrand = async () => {
    try {
      if (editingBrand) {
        await axios.put(`${API}/admin/brands/${editingBrand.id}`, brandForm, { withCredentials: true });
        toast.success('Brand updated');
      } else {
        await axios.post(`${API}/admin/brands`, brandForm, { withCredentials: true });
        toast.success('Brand created');
      }
      setBrandDialog(false);
      fetchData();
    } catch (error) {
      toast.error('Error saving brand');
    }
  };

  const deleteBrand = async (id) => {
    if (!window.confirm(t('admin_confirm_delete'))) return;
    try {
      await axios.delete(`${API}/admin/brands/${id}`, { withCredentials: true });
      toast.success('Brand deleted');
      fetchData();
    } catch (error) {
      toast.error('Error deleting brand');
    }
  };

  // Messages
  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/admin/messages/${id}/read`, {}, { withCredentials: true });
      fetchData();
    } catch (error) {
      toast.error('Error updating message');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm(t('admin_confirm_delete'))) return;
    try {
      await axios.delete(`${API}/admin/messages/${id}`, { withCredentials: true });
      toast.success('Message deleted');
      fetchData();
    } catch (error) {
      toast.error('Error deleting message');
    }
  };

  // Settings
  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await axios.put(`${API}/admin/settings`, settings, { withCredentials: true });
      toast.success('Settings saved! Refresh landing page to see changes.');
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="admin-dashboard">
      {/* Header */}
      <header className="header-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-white font-['Outfit']">ATERA</span>
              <span className="text-[#A1A1AA] text-sm">Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#A1A1AA] text-sm hidden sm:block">{user.email}</span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-[#A1A1AA] hover:text-white"
                data-testid="logout-btn"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="banners" className="w-full">
          <TabsList className="bg-[#141414] border border-white/10 mb-8" data-testid="admin-tabs">
            <TabsTrigger value="banners" className="data-[state=active]:bg-[#007AFF]" data-testid="tab-banners">
              <Image size={16} className="mr-2" /> {t('admin_banners')}
            </TabsTrigger>
            <TabsTrigger value="brands" className="data-[state=active]:bg-[#007AFF]" data-testid="tab-brands">
              {t('admin_brands')}
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-[#007AFF]" data-testid="tab-messages">
              <Mail size={16} className="mr-2" /> {t('admin_messages')}
              {messages.filter(m => !m.read).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#007AFF]" data-testid="tab-settings">
              <Palette size={16} className="mr-2" /> Renkler
            </TabsTrigger>
          </TabsList>

          {/* Banners Tab */}
          <TabsContent value="banners" data-testid="banners-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">{t('admin_banners')}</h2>
              <Button onClick={() => openBannerDialog()} className="bg-[#007AFF] hover:bg-[#3395FF]" data-testid="add-banner-btn">
                <Plus size={18} className="mr-2" /> {t('admin_add')}
              </Button>
            </div>
            
            <div className="surface-card rounded-2xl overflow-hidden">
              <table className="admin-table" data-testid="banners-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title (TR)</th>
                    <th>Title (EN)</th>
                    <th>Order</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner.id} data-testid={`banner-row-${banner.id}`}>
                      <td>
                        <img src={banner.url} alt={banner.alt} className="w-20 h-12 object-cover rounded" />
                      </td>
                      <td className="text-white">{banner.title_tr}</td>
                      <td className="text-white">{banner.title_en}</td>
                      <td className="text-white">{banner.order}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs ${banner.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {banner.active ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openBannerDialog(banner)} data-testid={`edit-banner-${banner.id}`}>
                            <Pencil size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => deleteBanner(banner.id)} data-testid={`delete-banner-${banner.id}`}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Brands Tab */}
          <TabsContent value="brands" data-testid="brands-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">{t('admin_brands')}</h2>
              <Button onClick={() => openBrandDialog()} className="bg-[#007AFF] hover:bg-[#3395FF]" data-testid="add-brand-btn">
                <Plus size={18} className="mr-2" /> {t('admin_add')}
              </Button>
            </div>
            
            <div className="surface-card rounded-2xl overflow-hidden">
              <table className="admin-table" data-testid="brands-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Order</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.id} data-testid={`brand-row-${brand.id}`}>
                      <td>
                        <img src={brand.url} alt={brand.name} className="w-16 h-10 object-contain bg-white/5 rounded p-1" />
                      </td>
                      <td className="text-white">{brand.name}</td>
                      <td className="text-white">{brand.order}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs ${brand.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {brand.active ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openBrandDialog(brand)} data-testid={`edit-brand-${brand.id}`}>
                            <Pencil size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => deleteBrand(brand.id)} data-testid={`delete-brand-${brand.id}`}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" data-testid="messages-content">
            <h2 className="text-2xl font-semibold text-white mb-6">{t('admin_messages')}</h2>
            
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="surface-card rounded-2xl p-8 text-center text-[#A1A1AA]">
                  No messages yet
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`surface-card rounded-2xl p-6 ${!message.read ? 'border-l-4 border-l-[#007AFF]' : ''}`} data-testid={`message-${message.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-medium">{message.name}</span>
                          <span className="text-[#A1A1AA] text-sm">{message.email}</span>
                          {message.phone && <span className="text-[#A1A1AA] text-sm">{message.phone}</span>}
                        </div>
                        <p className="text-[#A1A1AA]">{message.message}</p>
                        <p className="text-[#52525b] text-sm mt-2">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(message.id)}
                          className={message.read ? 'text-[#A1A1AA]' : 'text-[#007AFF]'}
                          data-testid={`mark-read-${message.id}`}
                        >
                          {message.read ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => deleteMessage(message.id)}
                          data-testid={`delete-message-${message.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" data-testid="settings-content">
            <h2 className="text-2xl font-semibold text-white mb-6">Site Ayarları</h2>
            
            {/* Settings Sub-tabs */}
            <div className="flex gap-2 mb-6">
              <Button 
                variant={activeSettingsTab === 'colors' ? 'default' : 'ghost'}
                onClick={() => setActiveSettingsTab('colors')}
                className={activeSettingsTab === 'colors' ? 'bg-[#007AFF]' : ''}
              >
                Renkler
              </Button>
              <Button 
                variant={activeSettingsTab === 'fonts' ? 'default' : 'ghost'}
                onClick={() => setActiveSettingsTab('fonts')}
                className={activeSettingsTab === 'fonts' ? 'bg-[#007AFF]' : ''}
              >
                Fontlar
              </Button>
              <Button 
                variant={activeSettingsTab === 'menu' ? 'default' : 'ghost'}
                onClick={() => setActiveSettingsTab('menu')}
                className={activeSettingsTab === 'menu' ? 'bg-[#007AFF]' : ''}
              >
                Menü
              </Button>
              <Button 
                variant={activeSettingsTab === 'products' ? 'default' : 'ghost'}
                onClick={() => setActiveSettingsTab('products')}
                className={activeSettingsTab === 'products' ? 'bg-[#007AFF]' : ''}
              >
                Ürünler
              </Button>
              <Button 
                variant={activeSettingsTab === 'brands' ? 'default' : 'ghost'}
                onClick={() => setActiveSettingsTab('brands')}
                className={activeSettingsTab === 'brands' ? 'bg-[#007AFF]' : ''}
              >
                Markalar Bölümü
              </Button>
            </div>
            
            <div className="surface-card rounded-2xl p-8 max-w-3xl">
              <div className="space-y-6">
                
                {/* Colors */}
                {activeSettingsTab === 'colors' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-2">Arka Plan Rengi</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={settings.background_color} onChange={(e) => setSettings({ ...settings, background_color: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                        <Input value={settings.background_color} onChange={(e) => setSettings({ ...settings, background_color: e.target.value })} className="dark-input flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-2">Kart Rengi</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={settings.surface_color} onChange={(e) => setSettings({ ...settings, surface_color: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                        <Input value={settings.surface_color} onChange={(e) => setSettings({ ...settings, surface_color: e.target.value })} className="dark-input flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-2">Ana Renk</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={settings.primary_color} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                        <Input value={settings.primary_color} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="dark-input flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-2">Yazı Rengi</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={settings.text_color} onChange={(e) => setSettings({ ...settings, text_color: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                        <Input value={settings.text_color} onChange={(e) => setSettings({ ...settings, text_color: e.target.value })} className="dark-input flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-2">İkincil Yazı Rengi</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={settings.text_secondary_color} onChange={(e) => setSettings({ ...settings, text_secondary_color: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                        <Input value={settings.text_secondary_color} onChange={(e) => setSettings({ ...settings, text_secondary_color: e.target.value })} className="dark-input flex-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Fonts */}
                {activeSettingsTab === 'fonts' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-2">Başlık Fontu</label>
                      <Select value={settings.heading_font} onValueChange={(value) => setSettings({ ...settings, heading_font: value })}>
                        <SelectTrigger className="dark-input"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#141414] border-white/10">
                          {fontOptions.map((font) => (<SelectItem key={font.value} value={font.value} className="text-white hover:bg-white/10">{font.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-2">Başlık Boyutu</label>
                      <Select value={settings.heading_size} onValueChange={(value) => setSettings({ ...settings, heading_size: value })}>
                        <SelectTrigger className="dark-input"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#141414] border-white/10">
                          {sizeOptions.map((size) => (<SelectItem key={size.value} value={size.value} className="text-white hover:bg-white/10">{size.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-2">Metin Fontu</label>
                      <Select value={settings.body_font} onValueChange={(value) => setSettings({ ...settings, body_font: value })}>
                        <SelectTrigger className="dark-input"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#141414] border-white/10">
                          {fontOptions.map((font) => (<SelectItem key={font.value} value={font.value} className="text-white hover:bg-white/10">{font.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#A1A1AA] mb-2">Metin Boyutu</label>
                      <Select value={settings.body_size} onValueChange={(value) => setSettings({ ...settings, body_size: value })}>
                        <SelectTrigger className="dark-input"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#141414] border-white/10">
                          {sizeOptions.map((size) => (<SelectItem key={size.value} value={size.value} className="text-white hover:bg-white/10">{size.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Menu */}
                {activeSettingsTab === 'menu' && (
                  <div className="space-y-6">
                    <h3 className="text-white font-medium">Menü Metinleri</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">Ürünler (TR)</label>
                        <Input value={settings.menu_products_tr} onChange={(e) => setSettings({ ...settings, menu_products_tr: e.target.value })} className="dark-input" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">Products (EN)</label>
                        <Input value={settings.menu_products_en} onChange={(e) => setSettings({ ...settings, menu_products_en: e.target.value })} className="dark-input" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">Markalar (TR)</label>
                        <Input value={settings.menu_brands_tr} onChange={(e) => setSettings({ ...settings, menu_brands_tr: e.target.value })} className="dark-input" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">Brands (EN)</label>
                        <Input value={settings.menu_brands_en} onChange={(e) => setSettings({ ...settings, menu_brands_en: e.target.value })} className="dark-input" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">İletişim (TR)</label>
                        <Input value={settings.menu_contact_tr} onChange={(e) => setSettings({ ...settings, menu_contact_tr: e.target.value })} className="dark-input" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">Contact (EN)</label>
                        <Input value={settings.menu_contact_en} onChange={(e) => setSettings({ ...settings, menu_contact_en: e.target.value })} className="dark-input" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Products */}
                {activeSettingsTab === 'products' && (
                  <div className="space-y-8">
                    <div className="p-4 border border-white/10 rounded-xl">
                      <h4 className="text-white font-medium mb-4">Ürün 1</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-[#A1A1AA] mb-2">Başlık</label>
                          <Input value={settings.product1_title} onChange={(e) => setSettings({ ...settings, product1_title: e.target.value })} className="dark-input" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Açıklama (TR)</label>
                            <Input value={settings.product1_desc_tr} onChange={(e) => setSettings({ ...settings, product1_desc_tr: e.target.value })} className="dark-input" />
                          </div>
                          <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Açıklama (EN)</label>
                            <Input value={settings.product1_desc_en} onChange={(e) => setSettings({ ...settings, product1_desc_en: e.target.value })} className="dark-input" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-white/10 rounded-xl">
                      <h4 className="text-white font-medium mb-4">Ürün 2</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-[#A1A1AA] mb-2">Başlık</label>
                          <Input value={settings.product2_title} onChange={(e) => setSettings({ ...settings, product2_title: e.target.value })} className="dark-input" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Açıklama (TR)</label>
                            <Input value={settings.product2_desc_tr} onChange={(e) => setSettings({ ...settings, product2_desc_tr: e.target.value })} className="dark-input" />
                          </div>
                          <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Açıklama (EN)</label>
                            <Input value={settings.product2_desc_en} onChange={(e) => setSettings({ ...settings, product2_desc_en: e.target.value })} className="dark-input" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-white/10 rounded-xl">
                      <h4 className="text-white font-medium mb-4">Ürün 3</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-[#A1A1AA] mb-2">Başlık</label>
                          <Input value={settings.product3_title} onChange={(e) => setSettings({ ...settings, product3_title: e.target.value })} className="dark-input" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Açıklama (TR)</label>
                            <Input value={settings.product3_desc_tr} onChange={(e) => setSettings({ ...settings, product3_desc_tr: e.target.value })} className="dark-input" />
                          </div>
                          <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Açıklama (EN)</label>
                            <Input value={settings.product3_desc_en} onChange={(e) => setSettings({ ...settings, product3_desc_en: e.target.value })} className="dark-input" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Brands Section */}
                {activeSettingsTab === 'brands' && (
                  <div className="space-y-6">
                    <h3 className="text-white font-medium">Markalar Bölümü Metinleri</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">Başlık (TR)</label>
                        <Input value={settings.brands_title_tr} onChange={(e) => setSettings({ ...settings, brands_title_tr: e.target.value })} className="dark-input" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">Title (EN)</label>
                        <Input value={settings.brands_title_en} onChange={(e) => setSettings({ ...settings, brands_title_en: e.target.value })} className="dark-input" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">Alt Başlık (TR)</label>
                        <Input value={settings.brands_subtitle_tr} onChange={(e) => setSettings({ ...settings, brands_subtitle_tr: e.target.value })} className="dark-input" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A1A1AA] mb-2">Subtitle (EN)</label>
                        <Input value={settings.brands_subtitle_en} onChange={(e) => setSettings({ ...settings, brands_subtitle_en: e.target.value })} className="dark-input" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Save Button */}
                <div className="pt-6 border-t border-white/10">
                  <Button onClick={saveSettings} disabled={savingSettings} className="bg-[#007AFF] hover:bg-[#3395FF]">
                    {savingSettings ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Banner Dialog */}
      <Dialog open={bannerDialog} onOpenChange={setBannerDialog}>
        <DialogContent className="bg-[#141414] border-white/10 text-white max-w-2xl" data-testid="banner-dialog">
          <DialogHeader>
            <DialogTitle>{editingBanner ? t('admin_edit') : t('admin_add')} Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Image URL</label>
              <Input
                value={bannerForm.url}
                onChange={(e) => setBannerForm({ ...bannerForm, url: e.target.value })}
                className="dark-input"
                placeholder="https://..."
                data-testid="banner-url-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Title (TR)</label>
                <Input
                  value={bannerForm.title_tr}
                  onChange={(e) => setBannerForm({ ...bannerForm, title_tr: e.target.value })}
                  className="dark-input"
                  data-testid="banner-title-tr-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Title (EN)</label>
                <Input
                  value={bannerForm.title_en}
                  onChange={(e) => setBannerForm({ ...bannerForm, title_en: e.target.value })}
                  className="dark-input"
                  data-testid="banner-title-en-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Subtitle (TR)</label>
                <Textarea
                  value={bannerForm.subtitle_tr}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle_tr: e.target.value })}
                  className="dark-input"
                  rows={2}
                  data-testid="banner-subtitle-tr-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Subtitle (EN)</label>
                <Textarea
                  value={bannerForm.subtitle_en}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle_en: e.target.value })}
                  className="dark-input"
                  rows={2}
                  data-testid="banner-subtitle-en-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Alt Text</label>
                <Input
                  value={bannerForm.alt}
                  onChange={(e) => setBannerForm({ ...bannerForm, alt: e.target.value })}
                  className="dark-input"
                  data-testid="banner-alt-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Order</label>
                <Input
                  type="number"
                  value={bannerForm.order}
                  onChange={(e) => setBannerForm({ ...bannerForm, order: parseInt(e.target.value) || 0 })}
                  className="dark-input"
                  data-testid="banner-order-input"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={bannerForm.active}
                onCheckedChange={(checked) => setBannerForm({ ...bannerForm, active: checked })}
                data-testid="banner-active-switch"
              />
              <label className="text-sm text-white">Active</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBannerDialog(false)} data-testid="banner-cancel-btn">
              {t('admin_cancel')}
            </Button>
            <Button onClick={saveBanner} className="bg-[#007AFF] hover:bg-[#3395FF]" data-testid="banner-save-btn">
              {t('admin_save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Brand Dialog */}
      <Dialog open={brandDialog} onOpenChange={setBrandDialog}>
        <DialogContent className="bg-[#141414] border-white/10 text-white" data-testid="brand-dialog">
          <DialogHeader>
            <DialogTitle>{editingBrand ? t('admin_edit') : t('admin_add')} Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Brand Name</label>
              <Input
                value={brandForm.name}
                onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                className="dark-input"
                data-testid="brand-name-input"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Logo URL</label>
              <Input
                value={brandForm.url}
                onChange={(e) => setBrandForm({ ...brandForm, url: e.target.value })}
                className="dark-input"
                placeholder="https://..."
                data-testid="brand-url-input"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Link (Optional)</label>
              <Input
                value={brandForm.link}
                onChange={(e) => setBrandForm({ ...brandForm, link: e.target.value })}
                className="dark-input"
                placeholder="https://..."
                data-testid="brand-link-input"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Order</label>
              <Input
                type="number"
                value={brandForm.order}
                onChange={(e) => setBrandForm({ ...brandForm, order: parseInt(e.target.value) || 0 })}
                className="dark-input"
                data-testid="brand-order-input"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={brandForm.active}
                onCheckedChange={(checked) => setBrandForm({ ...brandForm, active: checked })}
                data-testid="brand-active-switch"
              />
              <label className="text-sm text-white">Active</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBrandDialog(false)} data-testid="brand-cancel-btn">
              {t('admin_cancel')}
            </Button>
            <Button onClick={saveBrand} className="bg-[#007AFF] hover:bg-[#3395FF]" data-testid="brand-save-btn">
              {t('admin_save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
