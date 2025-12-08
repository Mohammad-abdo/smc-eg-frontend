import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, Search, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Client } from '@/services/api';

const ClientsManagement = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingClient, setEditingClient] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: clients = [], isLoading, refetch } = useClients(true); // Get all clients including inactive
  const queryClient = useQueryClient();
  
  // Log clients for debugging
  useEffect(() => {
    console.log('Clients data updated:', clients);
  }, [clients]);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const handleEdit = (client: Client) => {
    setEditingClient({ ...client });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingClient) return;

    if (!editingClient.name || !editingClient.nameAr) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingClient.id) {
        const result = await updateClient.mutateAsync({ id: editingClient.id, updates: editingClient });
        console.log('Client updated result:', result);
        toast.success(language === 'ar' ? 'تم تحديث العميل بنجاح' : 'Client updated successfully');
      } else {
        const result = await createClient.mutateAsync(editingClient);
        console.log('Client created result:', result);
        if (!result || !result.id) {
          toast.error(language === 'ar' ? 'فشل في إضافة العميل - لم يتم إرجاع بيانات' : 'Failed to add client - no data returned');
          return;
        }
        toast.success(language === 'ar' ? 'تم إضافة العميل بنجاح' : 'Client added successfully');
      }
      setIsDialogOpen(false);
      setEditingClient(null);
      // Force immediate refetch by invalidating and refetching
      queryClient.invalidateQueries({ queryKey: ['clients'], exact: false });
      await queryClient.refetchQueries({ queryKey: ['clients'], exact: false });
      // Also call the local refetch
      await refetch();
      console.log('Refetched clients after save');
    } catch (error: any) {
      console.error('Error saving client:', error);
      toast.error(language === 'ar' ? `فشل في حفظ العميل: ${error?.message || 'Unknown error'}` : `Failed to save client: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العميل؟' : 'Are you sure you want to delete this client?')) {
      try {
        await deleteClient.mutateAsync(id);
        toast.success(language === 'ar' ? 'تم حذف العميل بنجاح' : 'Client deleted successfully');
      } catch (error) {
        toast.error(language === 'ar' ? 'فشل في حذف العميل' : 'Failed to delete client');
      }
    }
  };

  const handleAdd = () => {
    setEditingClient({
      name: '',
      nameAr: '',
      logo: '',
      website: '',
      order: 0,
      status: 'active' as const,
    });
    setIsDialogOpen(true);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nameAr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <Building2 className="w-8 h-8" />
            {language === 'ar' ? 'إدارة العملاء' : 'Clients Management'}
          </h1>
          <p className="text-white/70 mt-2">
            {language === 'ar' ? 'إدارة شعارات العملاء' : 'Manage client logos'}
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-[#204393] hover:bg-[#1b356f] text-white">
          <Plus className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'إضافة عميل' : 'Add Client'}
        </Button>
      </div>

      {/* Filters */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardContent className="pt-6">
          <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
            <div className="flex-1 relative">
              <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-white/60", isRTL ? "right-3" : "left-3")} />
              <Input
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("bg-white/10 border-white/20 text-white", isRTL ? "pr-10" : "pl-10")}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2744] border-white/20">
                <SelectItem value="all" className="text-white">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="active" className="text-white">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="inactive" className="text-white">{language === 'ar' ? 'غير نشط' : 'Inactive'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      {isLoading ? (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardContent className="py-10 text-center">
            <p className="text-white/70">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </CardContent>
        </Card>
      ) : filteredClients.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardContent className="py-10 text-center">
            <Building2 className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">{language === 'ar' ? 'لا يوجد عملاء' : 'No clients found'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 text-white">
                      {language === 'ar' ? client.nameAr : client.name}
                    </CardTitle>
                    {client.logo && (
                      <div className="mt-3 h-20 w-full bg-white/10 rounded-lg flex items-center justify-center p-2">
                        <img
                          src={client.logo}
                          alt={language === 'ar' ? client.nameAr : client.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(client)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>{language === 'ar' ? `الترتيب: ${client.order}` : `Order: ${client.order}`}</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    client.status === 'active' ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  )}>
                    {client.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-[#1a2744] border-white/20 text-white z-[150]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingClient?.id 
                ? (language === 'ar' ? 'تعديل العميل' : 'Edit Client')
                : (language === 'ar' ? 'إضافة عميل جديد' : 'Add New Client')
              }
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'} *</Label>
                <Input
                  value={editingClient?.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  placeholder={language === 'ar' ? 'الاسم بالإنجليزية' : 'Name in English'}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">{language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'} *</Label>
                <Input
                  value={editingClient?.nameAr || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, nameAr: e.target.value })}
                  placeholder={language === 'ar' ? 'الاسم بالعربية' : 'Name in Arabic'}
                  dir="rtl"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">{language === 'ar' ? 'الموقع الإلكتروني (اختياري)' : 'Website (Optional)'}</Label>
              <Input
                value={editingClient?.website || ''}
                onChange={(e) => setEditingClient({ ...editingClient, website: e.target.value })}
                placeholder="https://example.com"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label className="text-white">{language === 'ar' ? 'الشعار' : 'Logo'}</Label>
              <div className="flex items-center gap-4">
                {editingClient?.logo ? (
                  <div className="relative">
                    <img
                      src={editingClient.logo}
                      alt="Client Logo"
                      className="w-32 h-32 object-contain rounded-lg border border-white/20 bg-white/5 p-2"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingClient({ ...editingClient, logo: '' })}
                      className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-500 text-white h-6 w-6 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center bg-white/5">
                    <ImageIcon className="h-8 w-8 text-white/50" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          toast.error('Image size must be less than 2MB');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditingClient({
                            ...editingClient,
                            logo: reader.result as string,
                          });
                          toast.success('Logo uploaded successfully');
                        };
                        reader.onerror = () => {
                          toast.error('Error reading image file');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#204393] hover:bg-[#1b356f] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    {editingClient?.logo ? (language === 'ar' ? 'تغيير الشعار' : 'Change Logo') : (language === 'ar' ? 'رفع الشعار' : 'Upload Logo')}
                  </Button>
                  <p className="text-xs text-white/60 mt-2">
                    {language === 'ar' ? 'موصى به: 300x200px، الحد الأقصى 2MB' : 'Recommended: 300x200px, Max 2MB'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">{language === 'ar' ? 'الترتيب' : 'Order'}</Label>
                <Input
                  type="number"
                  value={editingClient?.order || 0}
                  onChange={(e) => setEditingClient({ ...editingClient, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">{language === 'ar' ? 'الحالة' : 'Status'}</Label>
                <Select
                  value={editingClient?.status || 'active'}
                  onValueChange={(value: 'active' | 'inactive') => setEditingClient({ ...editingClient, status: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-white/20">
                    <SelectItem value="active" className="text-white">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                    <SelectItem value="inactive" className="text-white">{language === 'ar' ? 'غير نشط' : 'Inactive'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/20 text-white hover:bg-white/10">
                <X className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleSave} className="bg-[#204393] hover:bg-[#1b356f] text-white">
                <Save className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsManagement;

