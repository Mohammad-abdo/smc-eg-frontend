import { useState } from 'react';
import { AlertCircle, Building2, CheckCircle2, FileText, Headphones, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import heroSlideTwo from '@/assets/manganese/two.jpg';

const Complaints = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticket: '',
    category: '',
    message: '',
  });

  const content =
    language === 'ar'
      ? {
          badge: 'مركز الشكاوى',
          title: 'منصة شكاوى العملاء',
          description:
            'نؤمن بأن الاستماع إلى عملائنا جزء من نجاحنا التشغيلي. شاركنا أي ملاحظة أو مشكلة وسيتواصل معك فريق خدمة العملاء خلال يوم عمل واحد.',
          stats: [
            { label: 'متوسط وقت الاستجابة', value: '< 24 ساعة' },
            { label: 'مستوى الرضا بعد الإغلاق', value: '92%' },
            { label: 'فِرق الدعم', value: '3 فرق متخصصة' },
          ],
          form: {
            title: 'إرسال الشكوى',
            subtitle: 'املأ النموذج التالي وسنقوم بتعيين مندوب متابعة للطلب.',
            name: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            phone: 'رقم الهاتف',
            ticket: 'رقم الطلب أو العقد (اختياري)',
            category: 'نوع الشكوى',
            message: 'تفاصيل الشكوى',
            submit: 'إرسال الشكوى',
            categories: [
              { id: 'quality', label: 'جودة المنتج' },
              { id: 'delivery', label: 'التسليم والخدمات اللوجستية' },
              { id: 'billing', label: 'الفواتير والمدفوعات' },
              { id: 'other', label: 'أخرى' },
            ],
          },
          toastTitle: 'تم استلام الشكوى',
          toastDescription: 'سنتواصل معك خلال 24 ساعة عمل لمتابعة التفاصيل.',
          stepsTitle: 'ماذا يحدث بعد الإرسال؟',
          steps: [
            {
              icon: FileText,
              title: 'فتح بطاقة شكوى',
              description: 'يتم إنشاء بطاقة رقمية وربطها ببياناتك ومرفقاتك.',
            },
            {
              icon: Headphones,
              title: 'تواصل مباشر',
              description: 'يتواصل معك أحد ممثلي خدمة العملاء لتأكيد التفاصيل وتحديد الأولويات.',
            },
            {
              icon: CheckCircle2,
              title: 'حل ومراجعة',
              description: 'يتم إغلاق الطلب بعد الحل ومشاركة تقرير ملخص بالنتائج.',
            },
          ],
          hotline: {
            title: 'خط ساخن للطوارئ',
            numbers: ['+20 122 000 4567', '+20 100 555 9834'],
            note: 'متاح من الأحد إلى الخميس، 8 صباحًا - 10 مساءً.',
          },
        }
      : {
          badge: 'Complaints desk',
          title: 'Customer Complaints Center',
          description:
            'Listening is part of our manufacturing excellence. Share your concern and a service specialist will reach out within one business day.',
          stats: [
            { label: 'Average response time', value: '< 24 hrs' },
            { label: 'Post-resolution satisfaction', value: '92%' },
            { label: 'Support squads', value: '3 dedicated teams' },
          ],
          form: {
            title: 'Submit a complaint',
            subtitle: 'Complete the form and we will assign a case manager.',
            name: 'Full name',
            email: 'Work email',
            phone: 'Phone number',
            ticket: 'Order / Contract ID (optional)',
            category: 'Complaint type',
            message: 'Describe the issue',
            submit: 'Send complaint',
            categories: [
              { id: 'quality', label: 'Product quality' },
              { id: 'delivery', label: 'Delivery & logistics' },
              { id: 'billing', label: 'Billing & payment' },
              { id: 'other', label: 'Other' },
            ],
          },
          toastTitle: 'Complaint received',
          toastDescription: 'Our team will reach out within 24 working hours with next steps.',
          stepsTitle: 'How the process works',
          steps: [
            {
              icon: FileText,
              title: 'Ticket creation',
              description: 'We log every detail and attach your documents to a digital case.',
            },
            {
              icon: Headphones,
              title: 'Direct follow-up',
              description: 'A representative contacts you to clarify priority and expectations.',
            },
            {
              icon: CheckCircle2,
              title: 'Resolution & recap',
              description: 'We close the ticket after solving it and share a summary report.',
            },
          ],
          hotline: {
            title: 'Emergency hotline',
            numbers: ['+20 122 000 4567', '+20 100 555 9834'],
            note: 'Available Sunday–Thursday, 8:00 AM – 10:00 PM.',
          },
        };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: content.toastTitle, description: content.toastDescription });
    setFormData({ name: '', email: '', phone: '', ticket: '', category: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-muted/50">
        <div className="absolute inset-0">
          <img src={heroSlideTwo} alt="Complaint support" className="h-full w-full object-cover opacity-20" />
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent',
              isRTL && 'bg-gradient-to-l'
            )}
          />
        </div>
        <div className="relative container mx-auto flex flex-col gap-10 px-4 py-28 lg:flex-row lg:items-center">
          <div className={cn('space-y-6 md:max-w-3xl', isRTL && 'text-right ml-auto')}>
            <p className="text-xs uppercase tracking-[0.4em] text-primary">{content.badge}</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">{content.title}</h1>
            <p className="text-lg text-muted-foreground">{content.description}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {content.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/70 bg-white/80 p-4 text-center shadow-sm"
                >
                  <p className="text-2xl font-semibold text-primary">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="w-full max-w-md rounded-[32px] border border-border/60 bg-white/90 shadow-2xl">
            <CardContent className="space-y-6 p-8">
              <div className={cn('space-y-1', isRTL && 'text-right')}>
                <p className="text-sm font-semibold tracking-[0.3em] uppercase text-primary">SLA</p>
                <p className="text-muted-foreground text-sm">
                  {language === 'ar'
                    ? 'نلتزم برد أولي خلال ساعات العمل وأولوية قصوى للحالات الطارئة.'
                    : 'We commit to first responses within working hours and fast-track urgent cases.'}
                </p>
              </div>
              <div className={cn('flex items-start gap-3 text-sm text-muted-foreground', isRTL && 'flex-row-reverse')}>
                <AlertCircle className="mt-1 h-5 w-5 text-primary" />
                <span>
                  {language === 'ar'
                    ? 'يمكنك إرفاق ملفات أو صور بعد إرسال الطلب عبر البريد الإلكتروني الذي يصلك.'
                    : 'You can attach photos or files after submission via the confirmation email.'}
                </span>
              </div>
              <div className={cn('flex items-center gap-3 text-sm text-muted-foreground', isRTL && 'flex-row-reverse')}>
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{language === 'ar' ? 'فريق علاقات العملاء' : 'Customer relations team'}</p>
                  <p>{language === 'ar' ? 'أبو زنيمة • القاهرة' : 'Abu-Zinima • Cairo'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-[32px] border border-border shadow-2xl">
          <CardContent className="p-10">
            <div className={cn('mb-8 space-y-2', isRTL && 'text-right')}>
              <p className="text-sm uppercase tracking-[0.4em] text-primary">{content.form.title}</p>
              <p className="text-muted-foreground">{content.form.subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className={cn('space-y-5', isRTL && 'text-right')}>
              <div className={cn('grid gap-4 sm:grid-cols-2', isRTL && 'text-right')}>
                <Input
                  name="name"
                  placeholder={content.form.name}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={cn(isRTL && 'text-right')}
                />
                <Input
                  type="email"
                  name="email"
                  placeholder={content.form.email}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={cn(isRTL && 'text-right')}
                />
              </div>
              <div className={cn('grid gap-4 sm:grid-cols-2', isRTL && 'text-right')}>
                <Input
                  name="phone"
                  placeholder={content.form.phone}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={cn(isRTL && 'text-right')}
                />
                <Input
                  name="ticket"
                  placeholder={content.form.ticket}
                  value={formData.ticket}
                  onChange={handleInputChange}
                  className={cn(isRTL && 'text-right')}
                />
              </div>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className={cn(isRTL && 'text-right')}>
                  <SelectValue placeholder={content.form.category} />
                </SelectTrigger>
                <SelectContent align={isRTL ? 'end' : 'start'}>
                  {content.form.categories.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                name="message"
                placeholder={content.form.message}
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                required
                className={cn(isRTL && 'text-right')}
              />
              <Button type="submit" size="lg" className="w-full bg-[#204393] text-white hover:bg-[#1b356f]">
                <Send className={cn('mr-2 h-4 w-4', isRTL && 'ml-2 rotate-180')} />
                {content.form.submit}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[32px] border border-border shadow-xl">
            <CardContent className="space-y-4 p-8">
              <h3 className="text-lg font-semibold">{content.stepsTitle}</h3>
              <div className="space-y-4">
                {content.steps.map((step, idx) => (
                  <div
                    key={step.title}
                    className={cn('flex items-start gap-4 rounded-2xl border border-border/70 p-4', isRTL && 'flex-row-reverse text-right')}
                  >
                    <step.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border border-border shadow-xl">
            <CardContent className="space-y-3 p-8">
              <div className="flex items-center gap-3">
                <Headphones className="h-5 w-5 text-primary" />
                <p className="text-sm uppercase tracking-[0.4em] text-primary">{content.hotline.title}</p>
              </div>
              <div className="space-y-2">
                {content.hotline.numbers.map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="block text-lg font-semibold text-foreground">
                    {phone}
                  </a>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{content.hotline.note}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Complaints;

