import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, TrendingUp, PieChart, BarChart3, Activity, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, ComposedChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';

interface FinancialData {
  id: number;
  year: string;
  revenue: number;
  profit: number;
}

interface ProductionData {
  id: number;
  month: string;
  production: number;
  target: number;
}

interface ExportData {
  id: number;
  name: string;
  value: number;
  color: string;
}

const FinancialManagement = () => {
  const { t, isRTL, language } = useLanguage();
  
  // Default data
  const defaultRevenueData: FinancialData[] = [
    { id: 1, year: '2020', revenue: 45, profit: 8 },
    { id: 2, year: '2021', revenue: 52, profit: 12 },
    { id: 3, year: '2022', revenue: 61, profit: 15 },
    { id: 4, year: '2023', revenue: 68, profit: 18 },
    { id: 5, year: '2024', revenue: 78, profit: 22 },
  ];

  const defaultProductionData: ProductionData[] = [
    { id: 1, month: t('jan') || 'Jan', production: 2800, target: 3000 },
    { id: 2, month: t('feb') || 'Feb', production: 2950, target: 3000 },
    { id: 3, month: t('mar') || 'Mar', production: 3100, target: 3000 },
    { id: 4, month: t('apr') || 'Apr', production: 3020, target: 3000 },
    { id: 5, month: t('may') || 'May', production: 3150, target: 3000 },
    { id: 6, month: t('jun') || 'Jun', production: 3200, target: 3000 },
  ];

  const defaultExportData: ExportData[] = [
    { id: 1, name: t('exportEurope') || 'Europe', value: 35, color: '#204393' },
    { id: 2, name: t('exportAsia') || 'Asia', value: 28, color: '#3b82f6' },
    { id: 3, name: t('exportMiddleEast') || 'Middle East', value: 22, color: '#60a5fa' },
    { id: 4, name: t('exportAfrica') || 'Africa', value: 15, color: '#93c5fd' },
  ];

  // Load from localStorage or use defaults
  const loadFinancialData = () => {
    if (typeof window === 'undefined') return { revenue: defaultRevenueData, production: defaultProductionData, export: defaultExportData };
    
    try {
      const savedRevenue = localStorage.getItem('financialRevenueData');
      const savedProduction = localStorage.getItem('financialProductionData');
      const savedExport = localStorage.getItem('financialExportData');
      
      return {
        revenue: savedRevenue ? JSON.parse(savedRevenue) : defaultRevenueData,
        production: savedProduction ? JSON.parse(savedProduction) : defaultProductionData,
        export: savedExport ? JSON.parse(savedExport) : defaultExportData,
      };
    } catch (error) {
      console.error('Error loading financial data:', error);
      return { revenue: defaultRevenueData, production: defaultProductionData, export: defaultExportData };
    }
  };

  const [revenueData, setRevenueData] = useState<FinancialData[]>(defaultRevenueData);
  const [productionData, setProductionData] = useState<ProductionData[]>(defaultProductionData);
  const [exportData, setExportData] = useState<ExportData[]>(defaultExportData);

  // Load data on mount
  useEffect(() => {
    const loaded = loadFinancialData();
    setRevenueData(loaded.revenue);
    setProductionData(loaded.production);
    setExportData(loaded.export);
  }, []);

  const [editingRevenue, setEditingRevenue] = useState<FinancialData | null>(null);
  const [editingProduction, setEditingProduction] = useState<ProductionData | null>(null);
  const [editingExport, setEditingExport] = useState<ExportData | null>(null);
  const [isRevenueDialogOpen, setIsRevenueDialogOpen] = useState(false);
  const [isProductionDialogOpen, setIsProductionDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleAddRevenue = () => {
    setEditingRevenue({ id: Date.now(), year: '', revenue: 0, profit: 0 });
    setIsRevenueDialogOpen(true);
  };

  const handleEditRevenue = (item: FinancialData) => {
    setEditingRevenue(item);
    setIsRevenueDialogOpen(true);
  };

  const handleSaveRevenue = () => {
    if (editingRevenue) {
      let updatedData: FinancialData[];
      if (editingRevenue.id && revenueData.find(r => r.id === editingRevenue.id)) {
        updatedData = revenueData.map(r => r.id === editingRevenue.id ? editingRevenue : r);
      } else {
        updatedData = [...revenueData, editingRevenue];
      }
      setRevenueData(updatedData);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('financialRevenueData', JSON.stringify(updatedData));
        window.dispatchEvent(new Event('storage'));
      }
      setIsRevenueDialogOpen(false);
      setEditingRevenue(null);
      toast.success(language === 'ar' ? 'تم حفظ بيانات الإيرادات بنجاح' : 'Revenue data saved');
    }
  };

  const handleDeleteRevenue = (id: number) => {
    const updatedData = revenueData.filter(r => r.id !== id);
    setRevenueData(updatedData);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('financialRevenueData', JSON.stringify(updatedData));
      window.dispatchEvent(new Event('storage'));
    }
    toast.success(language === 'ar' ? 'تم حذف بيانات الإيرادات بنجاح' : 'Revenue data deleted');
  };

  const handleAddProduction = () => {
    setEditingProduction({ id: Date.now(), month: '', production: 0, target: 0 });
    setIsProductionDialogOpen(true);
  };

  const handleEditProduction = (item: ProductionData) => {
    setEditingProduction(item);
    setIsProductionDialogOpen(true);
  };

  const handleSaveProduction = () => {
    if (editingProduction) {
      let updatedData: ProductionData[];
      if (editingProduction.id && productionData.find(p => p.id === editingProduction.id)) {
        updatedData = productionData.map(p => p.id === editingProduction.id ? editingProduction : p);
      } else {
        updatedData = [...productionData, editingProduction];
      }
      setProductionData(updatedData);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('financialProductionData', JSON.stringify(updatedData));
        window.dispatchEvent(new Event('storage'));
      }
      setIsProductionDialogOpen(false);
      setEditingProduction(null);
      toast.success(language === 'ar' ? 'تم حفظ بيانات الإنتاج بنجاح' : 'Production data saved');
    }
  };

  const handleDeleteProduction = (id: number) => {
    const updatedData = productionData.filter(p => p.id !== id);
    setProductionData(updatedData);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('financialProductionData', JSON.stringify(updatedData));
      window.dispatchEvent(new Event('storage'));
    }
    toast.success(language === 'ar' ? 'تم حذف بيانات الإنتاج بنجاح' : 'Production data deleted');
  };

  const handleAddExport = () => {
    setEditingExport({ id: Date.now(), name: '', value: 0, color: '#204393' });
    setIsExportDialogOpen(true);
  };

  const handleEditExport = (item: ExportData) => {
    setEditingExport(item);
    setIsExportDialogOpen(true);
  };

  const handleSaveExport = () => {
    if (editingExport) {
      let updatedData: ExportData[];
      if (editingExport.id && exportData.find(e => e.id === editingExport.id)) {
        updatedData = exportData.map(e => e.id === editingExport.id ? editingExport : e);
      } else {
        updatedData = [...exportData, editingExport];
      }
      setExportData(updatedData);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('financialExportData', JSON.stringify(updatedData));
        window.dispatchEvent(new Event('storage'));
      }
      setIsExportDialogOpen(false);
      setEditingExport(null);
      toast.success(language === 'ar' ? 'تم حفظ بيانات التصدير بنجاح' : 'Export data saved');
    }
  };

  const handleDeleteExport = (id: number) => {
    const updatedData = exportData.filter(e => e.id !== id);
    setExportData(updatedData);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('financialExportData', JSON.stringify(updatedData));
      window.dispatchEvent(new Event('storage'));
    }
    toast.success(language === 'ar' ? 'تم حذف بيانات التصدير بنجاح' : 'Export data deleted');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">{t('financial') || 'Financial Management'}</h2>
        <p className="text-white/70 mt-1">Manage financial data and charts</p>
      </div>

      {/* Revenue Growth Chart */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">{t('revenueGrowth') || 'Revenue Growth'}</CardTitle>
            <p className="text-sm text-white/60 mt-1">Manage revenue and profit data</p>
          </div>
          <Button onClick={handleAddRevenue} className="bg-[#204393] hover:bg-[#1b356f] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
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
          </div>
          <div className="space-y-2">
            {revenueData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium w-16">{item.year}</span>
                  <span className="text-blue-400">Revenue: {item.revenue}M</span>
                  <span className="text-green-400">Profit: {item.profit}M</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditRevenue(item)} className="text-white hover:bg-white/10">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteRevenue(item.id)} className="text-red-400 hover:bg-red-500/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Production Performance Chart */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">{t('productionPerformance') || 'Production Performance'}</CardTitle>
            <p className="text-sm text-white/60 mt-1">Manage monthly production data</p>
          </div>
          <Button onClick={handleAddProduction} className="bg-[#204393] hover:bg-[#1b356f] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
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
          </div>
          <div className="space-y-2">
            {productionData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium w-20">{item.month}</span>
                  <span className="text-blue-400">Production: {item.production}</span>
                  <span className="text-orange-400">Target: {item.target}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditProduction(item)} className="text-white hover:bg-white/10">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteProduction(item.id)} className="text-red-400 hover:bg-red-500/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Distribution Chart */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">{t('exportDistribution') || 'Export Distribution'}</CardTitle>
            <p className="text-sm text-white/60 mt-1">Manage export distribution data</p>
          </div>
          <Button onClick={handleAddExport} className="bg-[#204393] hover:bg-[#1b356f] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
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
          </div>
          <div className="space-y-2">
            {exportData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-blue-400">Value: {item.value}%</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditExport(item)} className="text-white hover:bg-white/10">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteExport(item.id)} className="text-red-400 hover:bg-red-500/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Dialog */}
      <Dialog open={isRevenueDialogOpen} onOpenChange={setIsRevenueDialogOpen}>
        <DialogContent className="backdrop-blur-xl bg-[#1a2744] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{editingRevenue?.id && revenueData.find(r => r.id === editingRevenue.id) ? 'Edit Revenue Data' : 'Add Revenue Data'}</DialogTitle>
          </DialogHeader>
          {editingRevenue && (
            <div className="space-y-4">
              <div>
                <Label className="text-white">Year</Label>
                <Input
                  value={editingRevenue.year}
                  onChange={(e) => setEditingRevenue({ ...editingRevenue, year: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Revenue (M)</Label>
                <Input
                  type="number"
                  value={editingRevenue.revenue}
                  onChange={(e) => setEditingRevenue({ ...editingRevenue, revenue: parseFloat(e.target.value) || 0 })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Profit (M)</Label>
                <Input
                  type="number"
                  value={editingRevenue.profit}
                  onChange={(e) => setEditingRevenue({ ...editingRevenue, profit: parseFloat(e.target.value) || 0 })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button onClick={handleSaveRevenue} className="w-full bg-[#204393] hover:bg-[#1b356f] text-white">
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Production Dialog */}
      <Dialog open={isProductionDialogOpen} onOpenChange={setIsProductionDialogOpen}>
        <DialogContent className="backdrop-blur-xl bg-[#1a2744] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{editingProduction?.id && productionData.find(p => p.id === editingProduction.id) ? 'Edit Production Data' : 'Add Production Data'}</DialogTitle>
          </DialogHeader>
          {editingProduction && (
            <div className="space-y-4">
              <div>
                <Label className="text-white">Month</Label>
                <Input
                  value={editingProduction.month}
                  onChange={(e) => setEditingProduction({ ...editingProduction, month: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Production</Label>
                <Input
                  type="number"
                  value={editingProduction.production}
                  onChange={(e) => setEditingProduction({ ...editingProduction, production: parseFloat(e.target.value) || 0 })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Target</Label>
                <Input
                  type="number"
                  value={editingProduction.target}
                  onChange={(e) => setEditingProduction({ ...editingProduction, target: parseFloat(e.target.value) || 0 })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button onClick={handleSaveProduction} className="w-full bg-[#204393] hover:bg-[#1b356f] text-white">
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="backdrop-blur-xl bg-[#1a2744] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{editingExport?.id && exportData.find(e => e.id === editingExport.id) ? 'Edit Export Data' : 'Add Export Data'}</DialogTitle>
          </DialogHeader>
          {editingExport && (
            <div className="space-y-4">
              <div>
                <Label className="text-white">Region Name</Label>
                <Input
                  value={editingExport.name}
                  onChange={(e) => setEditingExport({ ...editingExport, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Value (%)</Label>
                <Input
                  type="number"
                  value={editingExport.value}
                  onChange={(e) => setEditingExport({ ...editingExport, value: parseFloat(e.target.value) || 0 })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Color (Hex)</Label>
                <Input
                  value={editingExport.color}
                  onChange={(e) => setEditingExport({ ...editingExport, color: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="#204393"
                />
              </div>
              <Button onClick={handleSaveExport} className="w-full bg-[#204393] hover:bg-[#1b356f] text-white">
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialManagement;

