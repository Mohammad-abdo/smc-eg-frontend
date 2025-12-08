import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Save, X, Download, FileText, Calendar, CheckCircle2, XCircle, Clock, Upload } from 'lucide-react';
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
import { useTenders, useCreateTender, useUpdateTender, useDeleteTender, useTenderSubmissions, useUpdateSubmissionStatus } from '@/hooks/useApi';
import { toast } from 'sonner';
import type { Tender, TenderSubmission } from '@/services/api';

const TendersManagement = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'draft'>('all');
  const [editingTender, setEditingTender] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isSubmissionsDialogOpen, setIsSubmissionsDialogOpen] = useState(false);
  const documentFileInputRef = useRef<HTMLInputElement>(null);

  const { data: tenders = [], isLoading } = useTenders();
  const createTender = useCreateTender();
  const updateTender = useUpdateTender();
  const deleteTender = useDeleteTender();
  const updateSubmissionStatus = useUpdateSubmissionStatus();

  const { data: submissions = [] } = useTenderSubmissions(selectedTender?.id || 0);

  const handleEdit = (tender: Tender) => {
    setEditingTender({ ...tender });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingTender) return;

    // Validate required fields
    if (!editingTender.title || !editingTender.titleAr || !editingTender.deadline) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingTender.id) {
        await updateTender.mutateAsync({ id: editingTender.id, updates: editingTender });
        toast.success(language === 'ar' ? 'تم تحديث المناقصة بنجاح' : 'Tender updated successfully');
      } else {
        await createTender.mutateAsync(editingTender);
        toast.success(language === 'ar' ? 'تم إنشاء المناقصة بنجاح' : 'Tender created successfully');
      }
      setIsDialogOpen(false);
      setEditingTender(null);
    } catch (error: any) {
      console.error('Error saving tender:', error);
      toast.error(language === 'ar' ? `فشل في حفظ المناقصة: ${error?.message || 'Unknown error'}` : `Failed to save tender: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه المناقصة؟' : 'Are you sure you want to delete this tender?')) {
      try {
        await deleteTender.mutateAsync(id);
        toast.success(language === 'ar' ? 'تم حذف المناقصة بنجاح' : 'Tender deleted successfully');
      } catch (error) {
        toast.error(language === 'ar' ? 'فشل في حذف المناقصة' : 'Failed to delete tender');
      }
    }
  };

  const handleAdd = () => {
    setEditingTender({
      title: '',
      titleAr: '',
      category: 'Equipment',
      categoryAr: 'معدات',
      deadline: '',
      description: '',
      descriptionAr: '',
      status: 'active' as const,
      documentFile: undefined,
      documentFileName: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDocumentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(language === 'ar' ? 'حجم الملف يجب أن يكون أقل من 10 ميجابايت' : 'File size must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingTender({
          ...editingTender,
          documentFile: reader.result as string,
          documentFileName: file.name,
        });
        toast.success(language === 'ar' ? 'تم رفع الملف بنجاح' : 'File uploaded successfully');
      };
      reader.onerror = () => {
        toast.error(language === 'ar' ? 'خطأ في قراءة الملف' : 'Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewSubmissions = (tender: Tender) => {
    setSelectedTender(tender);
    setIsSubmissionsDialogOpen(true);
  };

  const handleDownloadFile = (file: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = fileName;
    link.click();
  };

  const handleUpdateSubmissionStatus = async (tenderId: number, submissionId: number, status: TenderSubmission['status']) => {
    try {
      await updateSubmissionStatus.mutateAsync({ tenderId, submissionId, status });
      toast.success(language === 'ar' ? 'تم تحديث حالة التقديم بنجاح' : 'Submission status updated successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في تحديث حالة التقديم' : 'Failed to update submission status');
    }
  };

  const filteredTenders = tenders.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.titleAr.includes(searchTerm) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; labelAr: string; className: string }> = {
      active: { label: 'Active', labelAr: 'نشط', className: 'bg-green-500/80 text-white' },
      closed: { label: 'Closed', labelAr: 'مغلق', className: 'bg-gray-500/80 text-white' },
      draft: { label: 'Draft', labelAr: 'مسودة', className: 'bg-yellow-500/80 text-white' },
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return (
      <Badge className={statusInfo.className}>
        {language === 'ar' ? statusInfo.labelAr : statusInfo.label}
      </Badge>
    );
  };

  const getSubmissionStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; labelAr: string; className: string; icon: any }> = {
      pending: { label: 'Pending', labelAr: 'قيد المراجعة', className: 'bg-yellow-500/80 text-white', icon: Clock },
      reviewed: { label: 'Reviewed', labelAr: 'تمت المراجعة', className: 'bg-blue-500/80 text-white', icon: Eye },
      accepted: { label: 'Accepted', labelAr: 'مقبول', className: 'bg-green-500/80 text-white', icon: CheckCircle2 },
      rejected: { label: 'Rejected', labelAr: 'مرفوض', className: 'bg-red-500/80 text-white', icon: XCircle },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    const Icon = statusInfo.icon;
    return (
      <Badge className={cn('flex items-center gap-1', statusInfo.className)}>
        <Icon className="h-3 w-3" />
        {language === 'ar' ? statusInfo.labelAr : statusInfo.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-white/70">{language === 'ar' ? 'جاري تحميل المناقصات...' : 'Loading tenders...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{language === 'ar' ? 'إدارة المناقصات' : 'Tenders Management'}</h2>
          <p className="text-white/70 mt-1">{language === 'ar' ? 'إدارة جميع المناقصات والتقديمات' : 'Manage all tenders and submissions'}</p>
        </div>
        <Button onClick={handleAdd} disabled={createTender.isPending} className="bg-[#204393] hover:bg-[#1b356f] text-white">
          <Plus className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'إضافة مناقصة' : 'Add Tender'}
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardContent className="p-4">
          <div className={cn('flex gap-4', isRTL && 'flex-row-reverse')}>
            <div className="flex-1 relative">
              <Search className={cn('absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60', isRTL ? 'right-3' : 'left-3')} />
              <Input
                placeholder={language === 'ar' ? 'ابحث عن مناقصة...' : 'Search tenders...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn('bg-white/10 border-white/20 text-white placeholder:text-white/50', isRTL && 'pr-10', !isRTL && 'pl-10')}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2744] border-white/20">
                <SelectItem value="all" className="text-white">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="active" className="text-white">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="closed" className="text-white">{language === 'ar' ? 'مغلق' : 'Closed'}</SelectItem>
                <SelectItem value="draft" className="text-white">{language === 'ar' ? 'مسودة' : 'Draft'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenders List */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{language === 'ar' ? 'المناقصات' : 'Tenders'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTenders.map((tender) => (
              <div
                key={tender.id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
              >
                <div className={cn('flex items-start justify-between gap-4', isRTL && 'flex-row-reverse')}>
                  <div className="flex-1">
                    <div className={cn('flex items-center gap-3 mb-2', isRTL && 'flex-row-reverse')}>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'ar' ? tender.titleAr : tender.title}
                      </h3>
                      {getStatusBadge(tender.status)}
                    </div>
                    <p className="text-sm text-white/70 mb-2">
                      {language === 'ar' ? tender.descriptionAr : tender.description}
                    </p>
                    <div className={cn('flex items-center gap-4 text-xs text-white/60', isRTL && 'flex-row-reverse')}>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {tender.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {language === 'ar' ? 'الموعد النهائي: ' : 'Deadline: '}
                        {new Date(tender.deadline).toLocaleDateString()}
                      </span>
                      <span>
                        {language === 'ar' ? 'التقديمات: ' : 'Submissions: '}
                        {tender.submissions?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewSubmissions(tender)}
                      className="text-white hover:bg-white/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(tender)}
                      className="text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tender.id)}
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredTenders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/70">{language === 'ar' ? 'لا توجد مناقصات' : 'No tenders found'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Tender Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-[#1a2744] border-white/20 text-white z-[150]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTender?.id ? (language === 'ar' ? 'تعديل المناقصة' : 'Edit Tender') : (language === 'ar' ? 'إضافة مناقصة' : 'Add Tender')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
                <Input
                  value={editingTender?.title || ''}
                  onChange={(e) => setEditingTender({ ...editingTender, title: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
                <Input
                  value={editingTender?.titleAr || ''}
                  onChange={(e) => setEditingTender({ ...editingTender, titleAr: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">{language === 'ar' ? 'الفئة (إنجليزي)' : 'Category (English)'}</Label>
                <Input
                  value={editingTender?.category || ''}
                  onChange={(e) => setEditingTender({ ...editingTender, category: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">{language === 'ar' ? 'الفئة (عربي)' : 'Category (Arabic)'}</Label>
                <Input
                  value={editingTender?.categoryAr || ''}
                  onChange={(e) => setEditingTender({ ...editingTender, categoryAr: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">{language === 'ar' ? 'الموعد النهائي' : 'Deadline'}</Label>
              <Input
                type="date"
                value={editingTender?.deadline || ''}
                onChange={(e) => setEditingTender({ ...editingTender, deadline: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
              <Textarea
                value={editingTender?.description || ''}
                onChange={(e) => setEditingTender({ ...editingTender, description: e.target.value })}
                rows={4}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
              <Textarea
                value={editingTender?.descriptionAr || ''}
                onChange={(e) => setEditingTender({ ...editingTender, descriptionAr: e.target.value })}
                rows={4}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">{language === 'ar' ? 'الحالة' : 'Status'}</Label>
              <Select
                value={editingTender?.status || 'active'}
                onValueChange={(value: any) => setEditingTender({ ...editingTender, status: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2744] border-white/20">
                  <SelectItem value="active" className="text-white">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                  <SelectItem value="closed" className="text-white">{language === 'ar' ? 'مغلق' : 'Closed'}</SelectItem>
                  <SelectItem value="draft" className="text-white">{language === 'ar' ? 'مسودة' : 'Draft'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">{language === 'ar' ? 'وثيقة المناقصة (PDF أو أي ملف)' : 'Tender Document (PDF or any file)'}</Label>
              <Input
                ref={documentFileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error(language === 'ar' ? 'حجم الملف يجب أن يكون أقل من 10MB' : 'File size must be less than 10MB');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditingTender({
                        ...editingTender,
                        documentFile: reader.result as string,
                        documentFileName: file.name,
                      });
                      toast.success(language === 'ar' ? 'تم رفع الملف بنجاح' : 'File uploaded successfully');
                    };
                    reader.onerror = () => {
                      toast.error(language === 'ar' ? 'خطأ في قراءة الملف' : 'Error reading file');
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <div className="flex items-center gap-4">
                {editingTender?.documentFile ? (
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10">
                    <FileText className="h-4 w-4 text-white/70" />
                    <span className="text-sm text-white/80">{editingTender.documentFileName}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTender({ ...editingTender, documentFile: undefined, documentFileName: undefined })}
                      className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-white/60">{language === 'ar' ? 'لم يتم رفع ملف' : 'No file uploaded'}</div>
                )}
                <Button
                  type="button"
                  onClick={() => documentFileInputRef.current?.click()}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {editingTender?.documentFile ? (language === 'ar' ? 'تغيير الملف' : 'Change File') : (language === 'ar' ? 'رفع ملف' : 'Upload File')}
                </Button>
              </div>
              <p className="text-xs text-white/60">
                {language === 'ar' ? 'يمكن رفع ملفات PDF, DOC, DOCX, XLS, XLSX (حد أقصى 10MB)' : 'You can upload PDF, DOC, DOCX, XLS, XLSX files (max 10MB)'}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={createTender.isPending || updateTender.isPending}
                className="bg-[#204393] hover:bg-[#1b356f] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submissions Dialog */}
      <Dialog open={isSubmissionsDialogOpen} onOpenChange={setIsSubmissionsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-[#1a2744] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {language === 'ar' ? 'التقديمات' : 'Submissions'} - {selectedTender && (language === 'ar' ? selectedTender.titleAr : selectedTender.title)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <p className="text-white/70 text-center py-8">{language === 'ar' ? 'لا توجد تقديمات' : 'No submissions yet'}</p>
            ) : (
              submissions.map((submission) => (
                <Card key={submission.id} className="backdrop-blur-xl bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className={cn('space-y-3', isRTL && 'text-right')}>
                      <div className={cn('flex items-start justify-between', isRTL && 'flex-row-reverse')}>
                        <div>
                          <h4 className="font-semibold text-white">{submission.companyName}</h4>
                          <p className="text-sm text-white/70">{submission.contactName}</p>
                          <p className="text-sm text-white/70">{submission.email}</p>
                          <p className="text-sm text-white/70">{submission.phone}</p>
                        </div>
                        <div className={cn('flex flex-col items-end gap-2', isRTL && 'items-start')}>
                          {getSubmissionStatusBadge(submission.status)}
                          <Select
                            value={submission.status}
                            onValueChange={(value: any) => handleUpdateSubmissionStatus(submission.tenderId, submission.id, value)}
                          >
                            <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a2744] border-white/20">
                              <SelectItem value="pending" className="text-white">{language === 'ar' ? 'قيد المراجعة' : 'Pending'}</SelectItem>
                              <SelectItem value="reviewed" className="text-white">{language === 'ar' ? 'تمت المراجعة' : 'Reviewed'}</SelectItem>
                              <SelectItem value="accepted" className="text-white">{language === 'ar' ? 'مقبول' : 'Accepted'}</SelectItem>
                              <SelectItem value="rejected" className="text-white">{language === 'ar' ? 'مرفوض' : 'Rejected'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="text-xs text-white/60">
                        {language === 'ar' ? 'تاريخ التقديم: ' : 'Submitted: '}
                        {new Date(submission.submittedAt).toLocaleString()}
                      </div>
                      {submission.files && submission.files.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-white">{language === 'ar' ? 'الملفات المرفقة:' : 'Attached Files:'}</p>
                          <div className="flex flex-wrap gap-2">
                            {submission.files.map((file, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadFile(file, `file-${index + 1}.pdf`)}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {language === 'ar' ? `ملف ${index + 1}` : `File ${index + 1}`}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TendersManagement;

