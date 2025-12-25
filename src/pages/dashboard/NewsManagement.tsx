import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn, getImageUrl } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from '@/hooks/useApi';
import { toast } from 'sonner';

const NewsManagement = () => {
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNews, setEditingNews] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: news = [], isLoading } = useNews();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const handleEdit = (item: any) => {
    setEditingNews({ ...item });
    setImageFile(null); // Reset image file when editing
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingNews) {
      try {
        if (editingNews.id) {
          await updateNews.mutateAsync({ 
            id: editingNews.id, 
            updates: editingNews,
            imageFile: imageFile || undefined
          });
          toast.success('News updated successfully');
        } else {
          await createNews.mutateAsync({
            news: editingNews,
            imageFile: imageFile || undefined
          });
          toast.success('News created successfully');
        }
        setIsDialogOpen(false);
        setEditingNews(null);
        setImageFile(null);
      } catch (error: any) {
        console.error('Error saving news:', error);
        const errorMessage = error?.response?.data?.error || error?.message || 'Unknown error';
        toast.error(`Failed to save news: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this news?')) {
      try {
        await deleteNews.mutateAsync(id);
        toast.success('News deleted successfully');
      } catch (error) {
        toast.error('Failed to delete news');
      }
    }
  };

  const handleAdd = () => {
    setEditingNews({
      title: '',
      titleAr: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Company News',
      views: 0,
      status: 'draft' as const,
      content: '',
      contentAr: '',
      image: '',
    });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const filteredNews = news.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.titleAr.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{t('news') || 'News'}</h2>
          <p className="text-muted-foreground mt-1">{t('manageNews') || 'Manage all news articles'}</p>
        </div>
        <Button onClick={handleAdd} disabled={createNews.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addNews') || 'Add News'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search') || 'Search news...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('newsList') || 'News List'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('title') || 'Title'}</th>
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('category') || 'Category'}</th>
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('date') || 'Date'}</th>
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('views') || 'Views'}</th>
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('status') || 'Status'}</th>
                  <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.titleAr}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{item.category}</Badge>
                    </td>
                    <td className="py-3 px-4">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{item.views.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={item.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-[#1a2744] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{editingNews?.id ? t('editNews') || 'Edit News' : t('addNews') || 'Add News'}</DialogTitle>
          </DialogHeader>
          {editingNews && (
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-white">{t('image') || 'Image'}</Label>
                <div className="flex items-center gap-4">
                  {(editingNews.image || imageFile) ? (
                    <div className="relative">
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(editingNews.image)}
                        alt="News"
                        className="w-32 h-32 object-cover rounded-lg border border-white/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingNews({ ...editingNews, image: '' });
                          setImageFile(null);
                        }}
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
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error('Image size must be less than 10MB');
                            return;
                          }
                          // Store the file for upload
                          setImageFile(file);
                          // Also create a preview URL for display
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingNews({
                              ...editingNews,
                              image: reader.result as string, // Preview only
                            });
                            toast.success('Image selected successfully');
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
                      {editingNews.image ? t('changeImage') || 'Change Image' : t('uploadImage') || 'Upload Image'}
                    </Button>
                    <p className="text-xs text-white/60 mt-2">
                      {t('imageUploadHint') || 'Recommended: 800x600px, Max 2MB'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">{t('title') || 'Title'} (EN)</Label>
                  <Input
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('title') || 'Title'} (AR)</Label>
                  <Input
                    value={editingNews.titleAr}
                    onChange={(e) => setEditingNews({ ...editingNews, titleAr: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-white">{t('category') || 'Category'}</Label>
                  <Select
                    value={editingNews.category}
                    onValueChange={(value) => setEditingNews({ ...editingNews, category: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-white/20">
                      <SelectItem value="Company News" className="text-white">Company News</SelectItem>
                      <SelectItem value="Awards" className="text-white">Awards</SelectItem>
                      <SelectItem value="Sustainability" className="text-white">Sustainability</SelectItem>
                      <SelectItem value="Partnership" className="text-white">Partnership</SelectItem>
                      <SelectItem value="Infrastructure" className="text-white">Infrastructure</SelectItem>
                      <SelectItem value="Training" className="text-white">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('date') || 'Date'}</Label>
                  <Input
                    type="date"
                    value={editingNews.date}
                    onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('status') || 'Status'}</Label>
                  <Select
                    value={editingNews.status}
                    onValueChange={(value) => setEditingNews({ ...editingNews, status: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-white/20">
                      <SelectItem value="published" className="text-white">Published</SelectItem>
                      <SelectItem value="draft" className="text-white">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('content') || 'Content'} (EN)</Label>
                <Textarea
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  rows={6}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('content') || 'Content'} (AR)</Label>
                <Textarea
                  value={editingNews.contentAr}
                  onChange={(e) => setEditingNews({ ...editingNews, contentAr: e.target.value })}
                  rows={6}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/20 text-white hover:bg-white/10">
                  <X className="h-4 w-4 mr-2" />
                  {t('cancel') || 'Cancel'}
                </Button>
                <Button onClick={handleSave} disabled={createNews.isPending || updateNews.isPending} className="bg-[#204393] hover:bg-[#1b356f] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {createNews.isPending || updateNews.isPending ? 'Saving...' : (t('save') || 'Save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsManagement;

