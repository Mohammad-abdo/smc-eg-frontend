import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Newspaper, Mail, MessageSquare, TrendingUp, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useStatistics, useComplaints } from '@/hooks/useApi';

const DashboardHome = () => {
  const { t, isRTL } = useLanguage();
  const { data: stats, isLoading } = useStatistics();
  const { data: complaints = [] } = useComplaints();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">{t('overview') || 'Overview'}</h2>
        <p className="text-white/70 mt-1">{t('dashboardSubtitle') || 'Manage your website content and data'}</p>
      </div>

      {/* Stats Cards with Glass Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">{t('totalProducts') || 'Total Products'}</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/20 backdrop-blur">
              <Package className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-white/60 mt-1">Active products</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">{t('totalNews') || 'Total News'}</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/20 backdrop-blur">
              <Newspaper className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{stats?.totalNews || 0}</div>
            <p className="text-xs text-white/60 mt-1">Published articles</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">{t('totalContacts') || 'Total Contacts'}</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/20 backdrop-blur">
              <Mail className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{stats?.totalContacts || 0}</div>
            <p className="text-xs text-white/60 mt-1">New messages</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">{t('totalComplaints') || 'Total Complaints'}</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/20 backdrop-blur">
              <MessageSquare className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{stats?.totalComplaints || 0}</div>
            <p className="text-xs text-white/60 mt-1">Pending: {complaints?.filter(c => c.status === 'pending').length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">{t('recentActivity') || 'Recent Activity'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div>
                  <p className="font-medium text-white">New contact received</p>
                  <p className="text-sm text-white/60">2 hours ago</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div>
                  <p className="font-medium text-white">Product updated</p>
                  <p className="text-sm text-white/60">5 hours ago</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div>
                  <p className="font-medium text-white">New news article published</p>
                  <p className="text-sm text-white/60">1 day ago</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">{t('quickStats') || 'Quick Stats'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-white/80">Total Revenue</span>
                <span className="font-bold text-green-400">{stats?.totalRevenue || '0'} EGP</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-white/80">Monthly Growth</span>
                <span className="font-bold text-blue-400">{stats?.monthlyGrowth || '+0%'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-white/80">Total Views</span>
                <span className="font-bold text-purple-400">{(stats?.totalViews || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;

