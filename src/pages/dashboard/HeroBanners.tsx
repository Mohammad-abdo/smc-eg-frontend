import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from '@/hooks/useApi';
import { toast } from 'sonner';

const HeroBanners = () => {
  const { t, isRTL } = useLanguage();
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: banners = [], isLoading } = useBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const handleEdit = (banner: any) => {
    setEditingBanner({ ...banner });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingBanner) {
      try {
        if (editingBanner.id) {
          await updateBanner.mutateAsync({ id: editingBanner.id, updates: editingBanner });
          toast.success('Banner updated successfully');
        } else {
          await createBanner.mutateAsync(editingBanner);
          toast.success('Banner created successfully');
        }
        setIsDialogOpen(false);
        setEditingBanner(null);
      } catch (error) {
        console.error('Error saving banner:', error);
        const errorMessage = error?.message || 'Unknown error';
        toast.error(`Failed to save banner: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner.mutateAsync(id);
        toast.success('Banner deleted successfully');
      } catch (error) {
        toast.error('Failed to delete banner');
      }
    }
  };

  const handleAdd = () => {
    setEditingBanner({
      image: '',
      title: '',
      titleAr: '',
      subtitle: '',
      subtitleAr: '',
      description: '',
      descriptionAr: '',
      order: banners.length + 1,
      active: true,
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{t('heroBanners') || 'Hero Banners'}</h2>
          <p className="text-white/70 mt-1">{t('manageHeroBanners') || 'Manage hero section banners'}</p>
        </div>
        <Button onClick={handleAdd} disabled={createBanner.isPending} className="bg-[#204393] hover:bg-[#1b356f] text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t('addBanner') || 'Add Banner'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <div className="relative h-48">
              <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
              <div className="absolute top-2 right-2">
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Order: {banner.order}
                </span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{banner.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{banner.subtitle}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className={cn('text-xs', banner.active ? 'text-green-600' : 'text-gray-500')}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </span>
                  <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(banner.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-[#1a2744] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{editingBanner?.id ? t('editBanner') || 'Edit Banner' : t('addBanner') || 'Add Banner'}</DialogTitle>
          </DialogHeader>
          {editingBanner && (
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-white">{t('image') || 'Image'}</Label>
                <div className="flex items-center gap-4">
                  {editingBanner.image ? (
                    <div className="relative">
                      <img
                        src={editingBanner.image}
                        alt="Banner"
                        className="w-32 h-32 object-cover rounded-lg border border-white/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingBanner({ ...editingBanner, image: '' })}
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
                            setEditingBanner({
                              ...editingBanner,
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
                      {editingBanner.image ? t('changeImage') || 'Change Image' : t('uploadImage') || 'Upload Image'}
                    </Button>
                    <p className="text-xs text-white/60 mt-2">
                      {t('imageUploadHint') || 'Recommended: 1920x1080px, Max 2MB'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('title') || 'Title'} (EN)</Label>
                  <Input
                    value={editingBanner.title}
                    onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('title') || 'Title'} (AR)</Label>
                  <Input
                    value={editingBanner.titleAr}
                    onChange={(e) => setEditingBanner({ ...editingBanner, titleAr: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('subtitle') || 'Subtitle'} (EN)</Label>
                  <Input
                    value={editingBanner.subtitle}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('subtitle') || 'Subtitle'} (AR)</Label>
                  <Input
                    value={editingBanner.subtitleAr}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitleAr: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('description') || 'Description'} (EN)</Label>
                  <Textarea
                    value={editingBanner.description}
                    onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('description') || 'Description'} (AR)</Label>
                  <Textarea
                    value={editingBanner.descriptionAr}
                    onChange={(e) => setEditingBanner({ ...editingBanner, descriptionAr: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('order') || 'Order'}</Label>
                  <Input
                    type="number"
                    value={editingBanner.order}
                    onChange={(e) => setEditingBanner({ ...editingBanner, order: parseInt(e.target.value) })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('status') || 'Status'}</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingBanner.active}
                      onChange={(e) => setEditingBanner({ ...editingBanner, active: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="text-white">{t('active') || 'Active'}</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/20 text-white hover:bg-white/10">
                  <X className="h-4 w-4 mr-2" />
                  {t('cancel') || 'Cancel'}
                </Button>
                <Button onClick={handleSave} disabled={createBanner.isPending || updateBanner.isPending} className="bg-[#204393] hover:bg-[#1b356f] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {createBanner.isPending || updateBanner.isPending ? 'Saving...' : (t('save') || 'Save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroBanners;

