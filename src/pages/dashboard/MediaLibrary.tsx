import { useState, useRef } from 'react';
import { Upload, Search, Trash2, Download, Image as ImageIcon, File, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn, getImageUrl } from '@/lib/utils';
import { useMedia, useUploadMedia, useDeleteMedia } from '@/hooks/useApi';
import { toast } from 'sonner';

const MediaLibrary = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: mediaItems = [], isLoading } = useMedia();
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const filteredMedia = mediaItems.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadMedia.mutateAsync(file);
        toast.success(language === 'ar' ? 'تم رفع الملف بنجاح' : 'Media uploaded successfully');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast.error(language === 'ar' ? 'فشل رفع الملف' : 'Failed to upload media');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الملف؟' : 'Are you sure you want to delete this file?')) {
      try {
        await deleteMedia.mutateAsync(id);
        toast.success(language === 'ar' ? 'تم حذف الملف بنجاح' : 'File deleted successfully');
      } catch (error) {
        toast.error(language === 'ar' ? 'فشل حذف الملف' : 'Failed to delete file');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{t('mediaLibrary') || 'Media Library'}</h2>
          <p className="text-muted-foreground mt-1">{t('manageMedia') || 'Manage all media files'}</p>
        </div>
        <div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            onChange={handleUpload} 
            accept="image/*,video/*,.pdf,.doc,.docx" 
            multiple
          />
          <Button 
            onClick={handleUploadClick}
            disabled={uploadMedia.isPending}
            className="bg-[#204393] hover:bg-[#1b356f] text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadMedia.isPending 
              ? (language === 'ar' ? 'جاري الرفع...' : 'Uploading...') 
              : (t('uploadMedia') || 'Upload Media')}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search') || 'Search media...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 rounded-full bg-muted p-6">
            <ImageIcon className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="mb-3 text-3xl font-bold">
            {language === 'ar' ? 'لا توجد ملفات وسائط' : 'No Media Files'}
          </h2>
          <p className="max-w-md text-muted-foreground mb-4">
            {language === 'ar'
              ? 'يبدو أنه لا توجد ملفات وسائط متاحة. ابدأ برفع ملفاتك الأولى.'
              : 'It seems there are no media files available. Start by uploading your first files.'}
          </p>
          <Button 
            onClick={handleUploadClick}
            className="bg-[#204393] hover:bg-[#1b356f] text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            {t('uploadMedia') || 'Upload Media'}
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={getImageUrl(item.url)}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="ghost" size="sm" className="text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white" onClick={() => setSelectedMedia(item)}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.size}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>Preview</th>
                    <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('name') || 'Name'}</th>
                    <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>Size</th>
                    <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>Uploaded</th>
                    <th className={cn('text-left py-3 px-4', isRTL && 'text-right')}>{t('actions') || 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <img src={getImageUrl(item.url)} alt={item.name} className="h-12 w-12 object-cover rounded" />
                      </td>
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4">{item.size}</td>
                      <td className="py-3 px-4">{new Date(item.uploaded).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
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
      )}

      {/* Media Preview Dialog */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={getImageUrl(selectedMedia.url)}
              alt={selectedMedia.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
              <p className="font-medium">{selectedMedia.name}</p>
              <p className="text-sm text-white/70">{selectedMedia.size} • {new Date(selectedMedia.uploaded).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;

