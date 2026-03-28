import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

function formatApiErrorDetail(detail) {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).filter(Boolean).join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
}

export default function AdminLogin() {
  const { user, login, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch (error) {
      const errorMessage = formatApiErrorDetail(error.response?.data?.detail) || error.message;
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white font-['Outfit'] mb-2">ATERA</h1>
          <p className="text-[#A1A1AA]">{t('admin_dashboard')}</p>
        </div>
        
        <div className="surface-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">{t('admin_email')}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="dark-input w-full px-4 py-3 rounded-lg"
                placeholder="admin@atera.com.tr"
                data-testid="login-email-input"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">{t('admin_password')}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="dark-input w-full px-4 py-3 rounded-lg"
                placeholder="••••••••"
                data-testid="login-password-input"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#007AFF] hover:bg-[#3395FF] text-white py-3 rounded-lg font-medium"
              data-testid="login-submit-btn"
            >
              {submitting ? '...' : t('admin_login')}
            </Button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <a href="/" className="text-[#007AFF] hover:text-[#3395FF] text-sm">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
