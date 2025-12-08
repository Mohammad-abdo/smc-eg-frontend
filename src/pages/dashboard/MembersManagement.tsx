import { useState } from 'react';
import { Plus, Edit, Trash2, Users, Search, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from '@/hooks/useApi';
import { toast } from 'sonner';
import type { Member } from '@/services/api';

const MembersManagement = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: members = [], isLoading } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const handleEdit = (member: Member) => {
    setEditingMember({ ...member });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingMember) return;

    // Validate required fields
    if (!editingMember.name || !editingMember.nameAr || !editingMember.title || !editingMember.titleAr) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingMember.id) {
        await updateMember.mutateAsync({ id: editingMember.id, updates: editingMember });
        toast.success(language === 'ar' ? 'تم تحديث العضو بنجاح' : 'Member updated successfully');
      } else {
        await createMember.mutateAsync(editingMember);
        toast.success(language === 'ar' ? 'تم إضافة العضو بنجاح' : 'Member added successfully');
      }
      setIsDialogOpen(false);
      setEditingMember(null);
    } catch (error: any) {
      console.error('Error saving member:', error);
      toast.error(language === 'ar' ? `فشل في حفظ العضو: ${error?.message || 'Unknown error'}` : `Failed to save member: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العضو؟' : 'Are you sure you want to delete this member?')) {
      try {
        await deleteMember.mutateAsync(id);
        toast.success(language === 'ar' ? 'تم حذف العضو بنجاح' : 'Member deleted successfully');
      } catch (error) {
        toast.error(language === 'ar' ? 'فشل في حذف العضو' : 'Failed to delete member');
      }
    }
  };

  const handleAdd = () => {
    setEditingMember({
      name: '',
      nameAr: '',
      title: '',
      titleAr: '',
      order: 0,
      status: 'active' as const,
    });
    setIsDialogOpen(true);
  };

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.titleAr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            {language === 'ar' ? 'إدارة الأعضاء' : 'Members Management'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'ar' ? 'إدارة أعضاء مجلس الإدارة' : 'Manage board members'}
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-[#204393] hover:bg-[#1b356f]">
          <Plus className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'إضافة عضو' : 'Add Member'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
            <div className="flex-1 relative">
              <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
              <Input
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(isRTL ? "pr-10" : "pl-10")}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </CardContent>
        </Card>
      ) : filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{language === 'ar' ? 'لا يوجد أعضاء' : 'No members found'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {language === 'ar' ? member.nameAr : member.name}
                    </CardTitle>
                    <p className="text-sm text-primary font-semibold">
                      {language === 'ar' ? member.titleAr : member.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{language === 'ar' ? `الترتيب: ${member.order}` : `Order: ${member.order}`}</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    member.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  )}>
                    {member.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[150]">
          <DialogHeader>
            <DialogTitle>
              {editingMember?.id 
                ? (language === 'ar' ? 'تعديل العضو' : 'Edit Member')
                : (language === 'ar' ? 'إضافة عضو جديد' : 'Add New Member')
              }
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'} *</Label>
                <Input
                  value={editingMember?.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder={language === 'ar' ? 'الاسم بالإنجليزية' : 'Name in English'}
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'} *</Label>
                <Input
                  value={editingMember?.nameAr || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, nameAr: e.target.value })}
                  placeholder={language === 'ar' ? 'الاسم بالعربية' : 'Name in Arabic'}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'المنصب (إنجليزي)' : 'Title (English)'} *</Label>
                <Input
                  value={editingMember?.title || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                  placeholder={language === 'ar' ? 'المنصب بالإنجليزية' : 'Title in English'}
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'المنصب (عربي)' : 'Title (Arabic)'} *</Label>
                <Input
                  value={editingMember?.titleAr || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, titleAr: e.target.value })}
                  placeholder={language === 'ar' ? 'المنصب بالعربية' : 'Title in Arabic'}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'الترتيب' : 'Order'}</Label>
                <Input
                  type="number"
                  value={editingMember?.order || 0}
                  onChange={(e) => setEditingMember({ ...editingMember, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'الحالة' : 'Status'}</Label>
                <Select
                  value={editingMember?.status || 'active'}
                  onValueChange={(value: 'active' | 'inactive') => setEditingMember({ ...editingMember, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                    <SelectItem value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleSave} className="bg-[#204393] hover:bg-[#1b356f]">
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

export default MembersManagement;

