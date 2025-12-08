import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, FolderTree } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProductCategories, useCreateProductCategory, useUpdateProductCategory, useDeleteProductCategory } from '@/hooks/useApi';
import { toast } from 'sonner';
import type { ProductCategory } from '@/services/api';

const CategoriesManagement = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: categories = [], isLoading } = useProductCategories();
  const createCategory = useCreateProductCategory();
  const updateCategory = useUpdateProductCategory();
  const deleteCategory = useDeleteProductCategory();

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory({ ...category });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingCategory) return;

    if (!editingCategory.name || !editingCategory.nameAr || !editingCategory.slug) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingCategory.id) {
        await updateCategory.mutateAsync({ id: editingCategory.id, updates: editingCategory });
        toast.success(language === 'ar' ? 'تم تحديث القسم بنجاح' : 'Category updated successfully');
      } else {
        await createCategory.mutateAsync(editingCategory);
        toast.success(language === 'ar' ? 'تم إضافة القسم بنجاح' : 'Category added successfully');
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      console.error('Error saving category:', {
        error,
        message: error?.message,
        stack: error?.stack,
        category: editingCategory,
        errorType: error?.constructor?.name,
        errorString: String(error),
      });
      
      // Extract error message with better handling
      let errorMessage = 'Unknown error occurred';
      if (error?.message) {
        errorMessage = error.message;
        // Remove "API Error: " prefix if present
        errorMessage = errorMessage.replace(/^API Error:\s*/i, '');
        // Remove "Network error: " prefix if present (we want the full message)
        errorMessage = errorMessage.replace(/^Network error:\s*/i, '');
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.toString && typeof error.toString === 'function') {
        errorMessage = error.toString();
      }
      
      // Show detailed error in console for debugging
      console.error('Category save error details:', {
        errorMessage,
        fullError: error,
        categoryData: editingCategory,
      });
      
      toast.error(language === 'ar' ? `فشل في حفظ القسم: ${errorMessage}` : `Failed to save category: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا القسم؟' : 'Are you sure you want to delete this category?')) {
      try {
        await deleteCategory.mutateAsync(id);
        toast.success(language === 'ar' ? 'تم حذف القسم بنجاح' : 'Category deleted successfully');
      } catch (error) {
        toast.error(language === 'ar' ? 'فشل في حذف القسم' : 'Failed to delete category');
      }
    }
  };

  const handleAdd = () => {
    setEditingCategory({
      name: '',
      nameAr: '',
      slug: '',
      order: 0,
      status: 'active' as const,
      parent_id: null, // No subcategories allowed
    });
    setIsDialogOpen(true);
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Filter categories - only show main categories (no subcategories)
  const filteredCategories = categories.filter(category => {
    // Only show categories without parent_id (main categories only)
    if (category.parent_id) return false;
    
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <FolderTree className="w-8 h-8" />
            {language === 'ar' ? 'إدارة أقسام المنتجات' : 'Product Categories Management'}
          </h1>
          <p className="text-white/70 mt-2">
            {language === 'ar' ? 'إدارة أقسام المنتجات وإضافتها وتعديلها' : 'Manage product categories'}
          </p>
        </div>
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          <Button onClick={() => handleAdd()} className="bg-[#204393] hover:bg-[#1b356f] text-white">
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إضافة قسم' : 'Add Category'}
          </Button>
        </div>
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

      {/* Categories List */}
      {isLoading ? (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardContent className="py-10 text-center">
            <p className="text-white/70">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </CardContent>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardContent className="py-10 text-center">
            <FolderTree className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">{language === 'ar' ? 'لا يوجد أقسام' : 'No categories found'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 text-white">
                      {language === 'ar' ? category.nameAr : category.name}
                    </CardTitle>
                    <p className="text-sm text-white/60 font-mono">{category.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>{language === 'ar' ? `الترتيب: ${category.order}` : `Order: ${category.order}`}</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    category.status === 'active' ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  )}>
                    {category.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
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
              {editingCategory?.id 
                ? (language === 'ar' ? 'تعديل القسم' : 'Edit Category')
                : (language === 'ar' ? 'إضافة قسم جديد' : 'Add New Category')
              }
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'} *</Label>
                <Input
                  value={editingCategory?.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditingCategory({ 
                      ...editingCategory, 
                      name,
                      slug: editingCategory?.id ? editingCategory.slug : generateSlug(name)
                    });
                  }}
                  placeholder={language === 'ar' ? 'الاسم بالإنجليزية' : 'Name in English'}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">{language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'} *</Label>
                <Input
                  value={editingCategory?.nameAr || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameAr: e.target.value })}
                  placeholder={language === 'ar' ? 'الاسم بالعربية' : 'Name in Arabic'}
                  dir="rtl"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">{language === 'ar' ? 'الرابط (Slug)' : 'Slug'} *</Label>
              <Input
                value={editingCategory?.slug || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                placeholder="category-slug"
                className="bg-white/10 border-white/20 text-white font-mono"
              />
              <p className="text-xs text-white/60 mt-1">
                {language === 'ar' ? 'يستخدم في الروابط (مثال: industrial-products)' : 'Used in URLs (e.g., industrial-products)'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">{language === 'ar' ? 'الترتيب' : 'Order'}</Label>
                <Input
                  type="number"
                  value={editingCategory?.order || 0}
                  onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">{language === 'ar' ? 'الحالة' : 'Status'}</Label>
                <Select
                  value={editingCategory?.status || 'active'}
                  onValueChange={(value: 'active' | 'inactive') => setEditingCategory({ ...editingCategory, status: value })}
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

export default CategoriesManagement;

