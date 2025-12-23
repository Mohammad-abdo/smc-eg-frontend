import { useState, useRef } from 'react';
import { FileText, Calendar, AlertCircle, Upload, X, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { cn } from '@/lib/utils';
import { useTenders, useSubmitTender } from '@/hooks/useApi';
import { toast } from 'sonner';

const Tenders = () => {
  const { t, isRTL, language } = useLanguage();
  const [selectedTender, setSelectedTender] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitTender = useSubmitTender();

  const { data: tenders = [], isLoading } = useTenders();

  const activeTenders = tenders.filter(t => t.status === 'active');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles([...files, ...selectedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTender) return;

    if (files.length === 0) {
      toast.error(language === 'ar' ? 'يرجى إرفاق ملف واحد على الأقل' : 'Please attach at least one file');
      return;
    }

    try {
      // Convert files to Base64
      const filePromises = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Files = await Promise.all(filePromises);

      await submitTender.mutateAsync({
        tenderId: selectedTender.id,
        submission: {
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          files: base64Files,
        },
      });

      toast.success(language === 'ar' ? 'تم إرسال التقديم بنجاح' : 'Submission sent successfully');
      setIsDialogOpen(false);
      setFormData({ companyName: '', contactName: '', email: '', phone: '' });
      setFiles([]);
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في إرسال التقديم' : 'Failed to submit');
    }
  };

  const handleOpenDialog = (tender: any) => {
    setSelectedTender(tender);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className={cn("text-center mb-16", isRTL && "text-right")}>
          <h1 className="text-5xl font-bold mb-6">{t('tenders')}</h1>
          <p className="text-xl text-muted-foreground">
            {language === 'ar' ? 'المناقصات الحالية وفرص المشتريات' : 'Current tenders and procurement opportunities'}
          </p>
        </div>

        <div className="mb-12 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className={cn(
            "flex items-start gap-4",
            isRTL && "flex-row-reverse"
          )}>
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div className={cn(isRTL && "text-right")}>
              <h3 className="font-semibold text-lg mb-2">{language === 'ar' ? 'إرشادات المناقصة' : 'Tender Guidelines'}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ar'
                  ? 'يجب على جميع الأطراف المهتمة تقديم الوثائق الكاملة قبل الموعد النهائي المحدد. لن يتم قبول التقديمات المتأخرة. للحصول على وثائق المناقصة التفصيلية ومتطلبات التقديم، يرجى الاتصال بقسم المشتريات لدينا.'
                  : 'All interested parties must submit complete documentation before the specified deadline. Late submissions will not be accepted. For detailed tender documents and submission requirements, please contact our procurement department.'}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{language === 'ar' ? 'جاري تحميل المناقصات...' : 'Loading tenders...'}</p>
          </div>
        ) : (
          <div className="space-y-6 mb-16">
            {activeTenders.map((tender) => (
              <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={cn(
                    "flex items-start justify-between gap-4",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div>
                      <CardTitle className="text-2xl mb-2">{language === 'ar' ? tender.titleAr : tender.title}</CardTitle>
                      <div className={cn(
                        "flex items-center gap-4 text-sm text-muted-foreground",
                        isRTL && "flex-row-reverse"
                      )}>
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 w-4" />
                          T-{tender.id}
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                          {language === 'ar' ? tender.categoryAr : tender.category}
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 text-sm font-medium",
                      isRTL && "flex-row-reverse"
                    )}>
                      <Calendar className="w-4 h-4" />
                      <span>{language === 'ar' ? 'الموعد النهائي: ' : 'Deadline: '}{new Date(tender.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{language === 'ar' ? tender.descriptionAr : tender.description}</p>
                  <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                    {tender.documentFile && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = tender.documentFile!;
                          link.download = tender.documentFileName || `tender-${tender.id}.pdf`;
                          link.click();
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'تحميل وثيقة المناقصة' : 'Download Tender Document'}
                      </Button>
                    )}
                    <Button onClick={() => handleOpenDialog(tender)}>
                      {language === 'ar' ? 'تقديم عرض' : 'Submit Proposal'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {activeTenders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد مناقصات نشطة حالياً' : 'No active tenders at the moment'}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-muted rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{language === 'ar' ? 'تحتاج المزيد من المعلومات؟' : 'Need More Information?'}</h2>
          <p className="text-lg text-muted-foreground mb-6">
            {language === 'ar'
              ? 'للاستفسارات حول المناقصات أو التوضيحات أو إرشادات التقديم، يرجى الاتصال بفريق المشتريات لدينا'
              : 'For tender inquiries, clarifications, or submission guidelines, please contact our procurement team'}
          </p>
          <Button asChild size="lg">
            <Link to={getLocalizedLink('/contact', language)}>{t('contactUs')}</Link>
          </Button>
        </div>
      </div>

      {/* Submission Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? 'تقديم عرض للمناقصة' : 'Submit Tender Proposal'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'اسم الشركة' : 'Company Name'}</Label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'اسم جهة الاتصال' : 'Contact Name'}</Label>
              <Input
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الملفات المرفقة' : 'Attached Files'}</Label>
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'اختر الملفات' : 'Choose Files'}
              </Button>
              {files.length > 0 && (
                <div className="space-y-2 mt-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={submitTender.isPending}>
                {language === 'ar' ? 'إرسال' : 'Submit'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tenders;
