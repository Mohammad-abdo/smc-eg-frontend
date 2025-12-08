import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Save, X, Upload, Image as ImageIcon, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useProductCategories } from '@/hooks/useApi';
import { toast } from 'sonner';

const ProductsManagement = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useProductCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleEdit = (product: any) => {
    // Ensure specifications_table is properly parsed
    let specsTable = product.specifications_table;
    if (specsTable && typeof specsTable === 'string') {
      try {
        specsTable = JSON.parse(specsTable);
      } catch (e) {
        specsTable = null;
      }
    }
    // Convert old format (single table) to new format (array of tables)
    if (specsTable && !Array.isArray(specsTable.tables) && specsTable.columns) {
      specsTable = { tables: [{ ...specsTable }] };
    } else if (specsTable && !specsTable.tables) {
      specsTable = { tables: [] };
    } else if (!specsTable) {
      specsTable = { tables: [] };
    }
    // Parse gallery if it's a string
    let gallery = product.gallery || [];
    if (gallery && typeof gallery === 'string') {
      try {
        gallery = JSON.parse(gallery);
      } catch (e) {
        gallery = [];
      }
    }
    if (!Array.isArray(gallery)) {
      gallery = [];
    }
    setEditingProduct({ ...product, specifications_table: specsTable, gallery });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingProduct) {
      try {
        if (editingProduct.id) {
          await updateProduct.mutateAsync({ id: editingProduct.id, updates: editingProduct });
          toast.success('Product updated successfully');
        } else {
          await createProduct.mutateAsync(editingProduct);
          toast.success('Product created successfully');
        }
        setIsDialogOpen(false);
        setEditingProduct(null);
      } catch (error: any) {
        console.error('Error saving product:', {
          error,
          message: error?.message,
          stack: error?.stack,
          product: editingProduct,
          errorType: error?.constructor?.name,
          errorString: String(error),
        });
        
        // Extract error message with better handling
        let errorMessage = 'Unknown error occurred';
        if (error?.message) {
          errorMessage = error.message;
          // Remove "API Error: " prefix if present
          errorMessage = errorMessage.replace(/^API Error:\s*/i, '');
          // Remove "Network error: " prefix if present
          errorMessage = errorMessage.replace(/^Network error:\s*/i, '');
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.toString && typeof error.toString === 'function') {
          errorMessage = error.toString();
        }
        
        // Show detailed error in console for debugging
        console.error('Product save error details:', {
          errorMessage,
          fullError: error,
          productData: editingProduct,
        });
        
        toast.error(`Failed to save product: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAdd = () => {
    setEditingProduct({
      name: '',
      nameAr: '',
      category_id: categories.length > 0 ? categories[0].id : undefined,
      category: 'Industrial' as const,
      status: 'active' as const,
      views: 0,
      description: '',
      descriptionAr: '',
      gallery: [],
      specifications_table: null,
    });
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nameAr.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{t('products') || 'Products'}</h2>
          <p className="text-white/70 mt-1">{t('manageProducts') || 'Manage all products'}</p>
        </div>
        <Button onClick={handleAdd} disabled={createProduct.isPending} className="bg-[#204393] hover:bg-[#1b356f] text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t('addProduct') || 'Add Product'}
        </Button>
      </div>

      {/* Search */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder={t('search') || 'Search products...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{t('productsList') || 'Products List'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className={cn('text-left py-3 px-4 text-white/90', isRTL && 'text-right')}>{t('name') || 'Name'}</th>
                  <th className={cn('text-left py-3 px-4 text-white/90', isRTL && 'text-right')}>{t('category') || 'Category'}</th>
                  <th className={cn('text-left py-3 px-4 text-white/90', isRTL && 'text-right')}>{t('views') || 'Views'}</th>
                  <th className={cn('text-left py-3 px-4 text-white/90', isRTL && 'text-right')}>{t('status') || 'Status'}</th>
                  <th className={cn('text-left py-3 px-4 text-white/90', isRTL && 'text-right')}>{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-all">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-white/60">{product.nameAr}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {product.category_name ? (
                          <Badge variant="outline" className="border-white/20 text-white/80 w-fit">
                            {language === 'ar' ? product.category_nameAr : product.category_name}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-white/20 text-white/80 w-fit">{product.category}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/80">{product.views.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={product.status === 'active' ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="text-white hover:bg-white/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-[#1a2744] border-white/20 text-white z-[150]">
          <DialogHeader>
            <DialogTitle className="text-white">{editingProduct?.id ? t('editProduct') || 'Edit Product' : t('addProduct') || 'Add Product'}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('name') || 'Name'} (EN)</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('name') || 'Name'} (AR)</Label>
                  <Input
                    value={editingProduct.nameAr}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('category') || 'Category'}</Label>
                  <Select
                    value={editingProduct.category_id?.toString() || ''}
                    onValueChange={(value) => {
                      const selectedCategory = categories.find(c => c.id.toString() === value);
                      setEditingProduct({ 
                        ...editingProduct, 
                        category_id: selectedCategory ? selectedCategory.id : undefined,
                        category: selectedCategory?.slug === 'industrial' ? 'Industrial' : 'Mining'
                      });
                    }}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder={language === 'ar' ? 'اختر القسم' : 'Select Category'} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-white/20">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()} className="text-white">
                          {language === 'ar' ? cat.nameAr : cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('status') || 'Status'}</Label>
                  <Select
                    value={editingProduct.status}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, status: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-white/20">
                      <SelectItem value="active" className="text-white">Active</SelectItem>
                      <SelectItem value="inactive" className="text-white">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('description') || 'Description'} (EN)</Label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('description') || 'Description'} (AR)</Label>
                <Textarea
                  value={editingProduct.descriptionAr}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionAr: e.target.value })}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-white">{t('productImage') || 'Product Image'}</Label>
                <div className="flex items-center gap-4">
                  {editingProduct.image ? (
                    <div className="relative">
                      <img
                        src={editingProduct.image}
                        alt="Product"
                        className="w-32 h-32 object-cover rounded-lg border border-white/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
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
                            setEditingProduct({
                              ...editingProduct,
                              image: reader.result as string,
                            });
                            toast.success('Image uploaded successfully');
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
                      {editingProduct.image ? t('changeImage') || 'Change Image' : t('uploadImage') || 'Upload Image'}
                    </Button>
                    <p className="text-xs text-white/60 mt-2">
                      {t('imageUploadHint') || 'Recommended: 800x600px, Max 2MB'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Upload */}
              <div className="space-y-2">
                <Label className="text-white">
                  {language === 'ar' ? 'معرض الصور' : 'Image Gallery'}
                </Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        
                        const newImages: string[] = [];
                        let loadedCount = 0;
                        
                        files.forEach((file) => {
                          if (file.size > 2 * 1024 * 1024) {
                            toast.error(`${file.name}: Image size must be less than 2MB`);
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            newImages.push(reader.result as string);
                            loadedCount++;
                            if (loadedCount === files.length) {
                              setEditingProduct({
                                ...editingProduct,
                                gallery: [...(editingProduct.gallery || []), ...newImages],
                              });
                              toast.success(`${newImages.length} image(s) added to gallery`);
                            }
                          };
                          reader.onerror = () => {
                            toast.error(`Error reading ${file.name}`);
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('gallery-upload') as HTMLInputElement;
                        input?.click();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#204393] hover:bg-[#1b356f] text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      {language === 'ar' ? 'إضافة صور للمعرض' : 'Add Images to Gallery'}
                    </Button>
                  </div>
                  
                  {/* Gallery Preview */}
                  {(editingProduct.gallery && editingProduct.gallery.length > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {editingProduct.gallery.map((img: string, index: number) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-white/20"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newGallery = editingProduct.gallery.filter((_: string, idx: number) => idx !== index);
                              setEditingProduct({
                                ...editingProduct,
                                gallery: newGallery,
                              });
                            }}
                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(!editingProduct.gallery || editingProduct.gallery.length === 0) && (
                    <div className="border-2 border-dashed border-white/30 rounded-lg p-8 bg-white/5 text-center">
                      <ImageIcon className="h-12 w-12 text-white/50 mx-auto mb-4" />
                      <p className="text-white/60 text-sm">
                        {language === 'ar' 
                          ? 'لا توجد صور في المعرض. ابدأ بإضافة صور'
                          : 'No images in gallery. Start by adding images'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications Tables */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">
                    {language === 'ar' ? 'جداول المواصفات' : 'Specifications Tables'}
                  </Label>
                  <Button
                    type="button"
                    onClick={() => {
                      const currentTables = editingProduct.specifications_table?.tables || [];
                      setEditingProduct({
                        ...editingProduct,
                        specifications_table: {
                          tables: [
                            ...currentTables,
                            {
                              title: '',
                              columns: [
                                language === 'ar' ? 'المكونات' : 'Constituents',
                                language === 'ar' ? 'القيمة' : 'Value'
                              ],
                              rows: [['', '']],
                            },
                          ],
                        },
                      });
                    }}
                    className="bg-[#204393] hover:bg-[#1b356f] text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إضافة جدول' : 'Add Table'}
                  </Button>
                </div>

                {(editingProduct.specifications_table?.tables || []).length === 0 ? (
                  <div className="border border-white/20 rounded-lg p-6 bg-white/5 text-center">
                    <p className="text-white/60 mb-4">
                      {language === 'ar' 
                        ? 'لا توجد جداول. ابدأ بإضافة جدول جديد'
                        : 'No tables. Start by adding a new table'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(editingProduct.specifications_table?.tables || []).map((table: any, tableIndex: number) => (
                      <div key={tableIndex} className="border border-white/20 rounded-lg p-4 bg-white/5">
                        <div className="flex items-center justify-between mb-4">
                          <Input
                            value={table.title || ''}
                            onChange={(e) => {
                              const newTables = [...(editingProduct.specifications_table?.tables || [])];
                              newTables[tableIndex].title = e.target.value;
                              setEditingProduct({
                                ...editingProduct,
                                specifications_table: {
                                  tables: newTables,
                                },
                              });
                            }}
                            placeholder={language === 'ar' ? 'عنوان الجدول (اختياري)' : 'Table Title (Optional)'}
                            className="bg-white/10 border-white/20 text-white flex-1 max-w-md"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newTables = (editingProduct.specifications_table?.tables || []).filter((_: any, idx: number) => idx !== tableIndex);
                              setEditingProduct({
                                ...editingProduct,
                                specifications_table: {
                                  tables: newTables,
                                },
                              });
                            }}
                            className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {table.columns && table.columns.length > 0 ? (
                          <div className="space-y-3">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-white/20">
                                    {table.columns.map((col: string, idx: number) => (
                                      <th key={idx} className="text-left py-2 px-3 text-white/90 font-semibold">
                                        <Input
                                          value={col}
                                          onChange={(e) => {
                                            const newTables = [...(editingProduct.specifications_table?.tables || [])];
                                            newTables[tableIndex].columns[idx] = e.target.value;
                                            setEditingProduct({
                                              ...editingProduct,
                                              specifications_table: {
                                                tables: newTables,
                                              },
                                            });
                                          }}
                                          className="bg-white/10 border-white/20 text-white h-8"
                                          placeholder={language === 'ar' ? 'اسم العمود' : 'Column name'}
                                        />
                                      </th>
                                    ))}
                                    <th className="text-left py-2 px-3 text-white/60 w-12"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {table.rows.map((row: string[], rowIdx: number) => (
                                    <tr key={rowIdx} className="border-b border-white/10">
                                      {row.map((cell: string, cellIdx: number) => (
                                        <td key={cellIdx} className="py-2 px-3">
                                          <Input
                                            value={cell}
                                            onChange={(e) => {
                                              const newTables = [...(editingProduct.specifications_table?.tables || [])];
                                              newTables[tableIndex].rows[rowIdx][cellIdx] = e.target.value;
                                              setEditingProduct({
                                                ...editingProduct,
                                                specifications_table: {
                                                  tables: newTables,
                                                },
                                              });
                                            }}
                                            className="bg-white/10 border-white/20 text-white h-8"
                                            placeholder={language === 'ar' ? 'القيمة' : 'Value'}
                                          />
                                        </td>
                                      ))}
                                      <td className="py-2 px-3">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            const newTables = [...(editingProduct.specifications_table?.tables || [])];
                                            newTables[tableIndex].rows = newTables[tableIndex].rows.filter((_: any, idx: number) => idx !== rowIdx);
                                            setEditingProduct({
                                              ...editingProduct,
                                              specifications_table: {
                                                tables: newTables,
                                              },
                                            });
                                          }}
                                          className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                onClick={() => {
                                  const newTables = [...(editingProduct.specifications_table?.tables || [])];
                                  newTables[tableIndex].rows.push(['', '']);
                                  setEditingProduct({
                                    ...editingProduct,
                                    specifications_table: {
                                      tables: newTables,
                                    },
                                  });
                                }}
                                className="bg-[#204393] hover:bg-[#1b356f] text-white"
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                {language === 'ar' ? 'إضافة صف' : 'Add Row'}
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('cancel') || 'Cancel'}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="bg-[#204393] hover:bg-[#1b356f] text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createProduct.isPending || updateProduct.isPending ? 'Saving...' : (t('save') || 'Save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManagement;

