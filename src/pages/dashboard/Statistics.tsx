import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, DollarSign, PieChart, Activity, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, ComposedChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useStatistics, useMonthlyData, useProductViews } from '@/hooks/useApi';

const Statistics = () => {
  const { t, isRTL } = useLanguage();
  const { data: stats, isLoading: statsLoading } = useStatistics();
  const { data: monthlyData = [], isLoading: monthlyLoading } = useMonthlyData();
  const { data: productViews = [], isLoading: productViewsLoading } = useProductViews();

  // Financial Data
  const revenueData = [
    { year: '2020', revenue: 45, profit: 8 },
    { year: '2021', revenue: 52, profit: 12 },
    { year: '2022', revenue: 61, profit: 15 },
    { year: '2023', revenue: 68, profit: 18 },
    { year: '2024', revenue: 78, profit: 22 },
  ];

  const productionData = [
    { month: t('jan') || 'Jan', production: 2800, target: 3000 },
    { month: t('feb') || 'Feb', production: 2950, target: 3000 },
    { month: t('mar') || 'Mar', production: 3100, target: 3000 },
    { month: t('apr') || 'Apr', production: 3020, target: 3000 },
    { month: t('may') || 'May', production: 3150, target: 3000 },
    { month: t('jun') || 'Jun', production: 3200, target: 3000 },
  ];

  const exportData = [
    { name: t('exportEurope') || 'Europe', value: 35, color: '#204393' },
    { name: t('exportAsia') || 'Asia', value: 28, color: '#3b82f6' },
    { name: t('exportMiddleEast') || 'Middle East', value: 22, color: '#60a5fa' },
    { name: t('exportAfrica') || 'Africa', value: 15, color: '#93c5fd' },
  ];

  const quarterlyData = [
    { quarter: 'Q1', revenue: 18, expenses: 12, profit: 6 },
    { quarter: 'Q2', revenue: 19, expenses: 11, profit: 8 },
    { quarter: 'Q3', revenue: 20, expenses: 13, profit: 7 },
    { quarter: 'Q4', revenue: 21, expenses: 12, profit: 9 },
  ];

  const financialHighlights = [
    {
      icon: DollarSign,
      title: t('totalRevenue') || 'Total Revenue',
      value: '78M',
      unit: 'EGP',
      change: '+15%',
      trend: 'up',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      icon: TrendingUp,
      title: t('netProfit') || 'Net Profit',
      value: '22M',
      unit: 'EGP',
      change: '+22%',
      trend: 'up',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: PieChart,
      title: t('exportVolume') || 'Export Volume',
      value: '65%',
      unit: '',
      change: '+5%',
      trend: 'up',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      icon: Activity,
      title: t('productionEfficiency') || 'Production Efficiency',
      value: '92%',
      unit: '',
      change: '+3%',
      trend: 'up',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
  ];

  if (statsLoading || monthlyLoading || productViewsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-white/70">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">{t('statistics') || 'Statistics'}</h2>
        <p className="text-white/70 mt-1">{t('viewAnalytics') || 'View website analytics and statistics'}</p>
      </div>

      {/* Financial Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialHighlights.map((highlight, index) => (
          <Card key={index} className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">{highlight.title}</CardTitle>
              <div className={cn('p-2 rounded-lg backdrop-blur', highlight.bgColor)}>
                <highlight.icon className={cn('h-4 w-4', highlight.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn('text-3xl font-bold mb-1', highlight.color)}>
                {highlight.value}
                {highlight.unit && <span className="text-lg text-white/60 ml-1">{highlight.unit}</span>}
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <ArrowUpRight className="h-3 w-3" />
                <p className="text-xs">{highlight.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Website Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Views</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/20 backdrop-blur">
              <Eye className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">12,456</div>
            <p className="text-xs text-white/60 mt-1">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Visitors</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/20 backdrop-blur">
              <Users className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">8,234</div>
            <p className="text-xs text-white/60 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Avg. Session</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/20 backdrop-blur">
              <BarChart3 className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">3:24</div>
            <p className="text-xs text-white/60 mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Bounce Rate</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/20 backdrop-blur">
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">42%</div>
            <p className="text-xs text-white/60 mt-1">-5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Growth Chart */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">{t('revenueGrowth') || 'Revenue Growth'}</CardTitle>
            <p className="text-sm text-white/60">{t('revenueGrowthDescription') || 'Revenue and profit over the years'}</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#204393" strokeWidth={2} name={t('revenue') || 'Revenue'} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name={t('profit') || 'Profit'} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Production Performance */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">{t('productionPerformance') || 'Production Performance'}</CardTitle>
            <p className="text-sm text-white/60">{t('productionPerformanceDescription') || 'Monthly production vs target'}</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Bar dataKey="production" fill="#204393" name={t('production') || 'Production'} />
                <Line type="monotone" dataKey="target" stroke="#ff7300" name={t('target') || 'Target'} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Export Distribution */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">{t('exportDistribution') || 'Export Distribution'}</CardTitle>
            <p className="text-sm text-white/60">{t('exportDistributionDescription') || 'Export distribution by region'}</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={exportData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {exportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quarterly Performance */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">{t('quarterlyPerformance') || 'Quarterly Performance'}</CardTitle>
            <p className="text-sm text-white/60">{t('quarterlyPerformanceDescription') || 'Revenue, expenses, and profit by quarter'}</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="quarter" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#204393" fill="#204393" name={t('revenue') || 'Revenue'} />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" name={t('expenses') || 'Expenses'} />
                <Area type="monotone" dataKey="profit" stackId="3" stroke="#10b981" fill="#10b981" name={t('profit') || 'Profit'} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Views & Visitors */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Monthly Views & Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Bar dataKey="views" fill="#204393" name="Views" />
                <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Views */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Product Views</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productViews} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.6)" />
                <YAxis dataKey="product" type="category" width={120} stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Bar dataKey="views" fill="#204393" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
