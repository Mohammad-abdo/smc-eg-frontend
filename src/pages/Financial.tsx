import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ComposedChart } from 'recharts';

const Financial = () => {
  const { t, isRTL } = useLanguage();

  // Default data
  const defaultRevenueData = [
    { year: '2020', revenue: 45, profit: 8 },
    { year: '2021', revenue: 52, profit: 12 },
    { year: '2022', revenue: 61, profit: 15 },
    { year: '2023', revenue: 68, profit: 18 },
    { year: '2024', revenue: 78, profit: 22 },
  ];

  const defaultProductionData = [
    { month: t('jan'), production: 2800, target: 3000 },
    { month: t('feb'), production: 2950, target: 3000 },
    { month: t('mar'), production: 3100, target: 3000 },
    { month: t('apr'), production: 3020, target: 3000 },
    { month: t('may'), production: 3150, target: 3000 },
    { month: t('jun'), production: 3200, target: 3000 },
  ];

  const defaultExportData = [
    { name: t('exportEurope'), value: 35, color: '#204393' },
    { name: t('exportAsia'), value: 28, color: '#3b82f6' },
    { name: t('exportMiddleEast'), value: 22, color: '#60a5fa' },
    { name: t('exportAfrica'), value: 15, color: '#93c5fd' },
  ];

  // Load financial data from localStorage
  const [revenueData, setRevenueData] = useState(defaultRevenueData);
  const [productionData, setProductionData] = useState(defaultProductionData);
  const [exportData, setExportData] = useState(defaultExportData);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadFinancialData = () => {
      try {
        // Load revenue data
        const savedRevenue = localStorage.getItem('financialRevenueData');
        if (savedRevenue) {
          const parsed = JSON.parse(savedRevenue);
          // Convert to format without id for charts
          setRevenueData(parsed.map((item: any) => ({ year: item.year, revenue: item.revenue, profit: item.profit })));
        }

        // Load production data
        const savedProduction = localStorage.getItem('financialProductionData');
        if (savedProduction) {
          const parsed = JSON.parse(savedProduction);
          // Convert to format without id for charts
          setProductionData(parsed.map((item: any) => ({ month: item.month, production: item.production, target: item.target })));
        }

        // Load export data
        const savedExport = localStorage.getItem('financialExportData');
        if (savedExport) {
          const parsed = JSON.parse(savedExport);
          // Convert to format without id for charts
          setExportData(parsed.map((item: any) => ({ name: item.name, value: item.value, color: item.color })));
        }
      } catch (error) {
        console.error('Error loading financial data:', error);
      }
    };

    loadFinancialData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadFinancialData();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check periodically for same-tab updates
    const interval = setInterval(loadFinancialData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Investment Breakdown
  const investmentData = [
    { category: t('investmentInfrastructure'), amount: 45 },
    { category: t('investmentTechnology'), amount: 25 },
    { category: t('investmentSustainability'), amount: 20 },
    { category: t('investmentResearch'), amount: 10 },
  ];

  // Quarterly Performance
  const quarterlyData = [
    { quarter: 'Q1', revenue: 18, expenses: 12, profit: 6 },
    { quarter: 'Q2', revenue: 19, expenses: 11, profit: 8 },
    { quarter: 'Q3', revenue: 20, expenses: 13, profit: 7 },
    { quarter: 'Q4', revenue: 21, expenses: 12, profit: 9 },
  ];

  // Efficiency Metrics
  const efficiencyData = [
    { metric: t('efficiencyProduction'), value: 92 },
    { metric: t('efficiencyQuality'), value: 96 },
    { metric: t('efficiencyEnergy'), value: 88 },
    { metric: t('efficiencyLogistics'), value: 90 },
  ];

  const revenueChartConfig = {
    revenue: {
      label: t('revenue'),
      color: '#204393',
    },
    profit: {
      label: t('profit'),
      color: '#10b981',
    },
  };

  const productionChartConfig = {
    production: {
      label: t('production'),
      color: '#204393',
    },
    target: {
      label: t('target'),
      color: '#94a3b8',
    },
  };

  const quarterlyChartConfig = {
    revenue: {
      label: t('revenue'),
      color: '#204393',
    },
    expenses: {
      label: t('expenses'),
      color: '#ef4444',
    },
    profit: {
      label: t('profit'),
      color: '#10b981',
    },
  };

  const highlights = [
    {
      icon: DollarSign,
      title: t('totalRevenue'),
      value: '78M',
      unit: 'EGP',
      change: '+15%',
      trend: 'up',
      description: t('revenueDescription'),
    },
    {
      icon: TrendingUp,
      title: t('netProfit'),
      value: '22M',
      unit: 'EGP',
      change: '+22%',
      trend: 'up',
      description: t('profitDescription'),
    },
    {
      icon: PieChart,
      title: t('exportVolume'),
      value: '65%',
      unit: '',
      change: '+5%',
      trend: 'up',
      description: t('exportDescription'),
    },
    {
      icon: BarChart3,
      title: t('productionEfficiency'),
      value: '92%',
      unit: '',
      change: '+3%',
      trend: 'up',
      description: t('efficiencyDescription'),
    },
    {
      icon: Activity,
      title: t('marketShare'),
      value: '100%',
      unit: '',
      change: 'Stable',
      trend: 'stable',
      description: t('marketShareDescription'),
    },
    {
      icon: ArrowUpRight,
      title: t('growthRate'),
      value: '18%',
      unit: 'YoY',
      change: '+2%',
      trend: 'up',
      description: t('growthDescription'),
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={cn('mb-16 text-center', isRTL && 'text-right')}>
          <h1 className="text-5xl font-bold mb-6">{t('financial')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('financialSubtitle')}
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {highlights.map((highlight, index) => (
            <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className={cn('flex items-center justify-between', isRTL && 'flex-row-reverse')}>
                  <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
                    <div className="rounded-lg bg-primary/10 p-3">
                      <highlight.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{highlight.title}</p>
                      <div className={cn('flex items-baseline gap-2', isRTL && 'flex-row-reverse')}>
                        <span className="text-3xl font-bold">{highlight.value}</span>
                        {highlight.unit && <span className="text-sm text-muted-foreground">{highlight.unit}</span>}
                      </div>
                    </div>
                  </div>
                  <div className={cn('flex flex-col items-end', isRTL && 'items-start')}>
                    {highlight.trend === 'up' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="text-sm font-semibold">{highlight.change}</span>
                      </div>
                    )}
                    {highlight.trend === 'down' && (
                      <div className="flex items-center gap-1 text-red-600">
                        <ArrowDownRight className="h-4 w-4" />
                        <span className="text-sm font-semibold">{highlight.change}</span>
                      </div>
                    )}
                    {highlight.trend === 'stable' && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <span className="text-sm font-semibold">{highlight.change}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Growth Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('revenueGrowth')}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('revenueGrowthDescription')}</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[300px]">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  tickFormatter={(value) => `${value}M`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-revenue)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--color-profit)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-profit)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Production vs Target */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('productionPerformance')}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('productionPerformanceDescription')}</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={productionChartConfig} className="h-[300px]">
              <ComposedChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="production" fill="var(--color-production)" radius={[8, 8, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="var(--color-target)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Export Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('exportDistribution')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('exportDistributionDescription')}</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={exportData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {exportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Quarterly Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('quarterlyPerformance')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('quarterlyPerformanceDescription')}</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={quarterlyChartConfig} className="h-[300px]">
                <AreaChart data={quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="quarter"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                    tickFormatter={(value) => `${value}M`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="1"
                    stroke="var(--color-expenses)"
                    fill="var(--color-expenses)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="1"
                    stroke="var(--color-profit)"
                    fill="var(--color-profit)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Investment Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('investmentBreakdown')}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('investmentBreakdownDescription')}</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <BarChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="#204393" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Efficiency Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('efficiencyMetrics')}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('efficiencyMetricsDescription')}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {efficiencyData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className={cn('flex items-center justify-between', isRTL && 'flex-row-reverse')}>
                    <span className="text-sm font-medium">{item.metric}</span>
                    <span className="text-sm font-semibold text-primary">{item.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Financial;
