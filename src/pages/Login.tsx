import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import smcLogo from '@/assets/manganese/logo.png';

const Login = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get API base URL - always use smc-eg.com backend
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smc-eg.com/api';

      // Call login API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.success && data.user) {
        // Save to localStorage
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminEmail', data.user.email);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        toast.success(t('loginSuccess') || 'Login successful!');
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || t('loginError') || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#204393] via-[#1b356f] to-[#0f2566] p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src={smcLogo} alt="SMC Logo" className="h-16 w-auto" />
          </div>
          <div>
            <CardTitle className="text-2xl">{t('adminLogin') || 'Admin Login'}</CardTitle>
            <CardDescription className="mt-2">
              {t('loginDescription') || 'Sign in to access the dashboard'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email') || 'Email'}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder') || 'admin@smc.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn('pl-10', isRTL && 'pr-10 pl-0')}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password') || 'Password'}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('passwordPlaceholder') || 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn('pl-10', isRTL && 'pr-10 pl-0')}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              <LogIn className="h-4 w-4 mr-2" />
              {loading ? (t('loggingIn') || 'Logging in...') : (t('login') || 'Login')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

