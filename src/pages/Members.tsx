import { Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useMembers } from '@/hooks/useApi';

const Members = () => {
  const { t, isRTL, language } = useLanguage();
  const { data: members = [], isLoading } = useMembers();

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className={cn("text-center mb-16", isRTL && "text-right")}>
          <h1 className="text-5xl font-bold mb-6">
            {language === 'ar' ? 'أعضاء مجلس الإدارة' : 'Board Members'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'ar'
              ? 'نفتخر بقيادة متميزة من الخبراء والمحترفين الذين يقودون شركة سيناء للمنجنيز نحو التميز والنجاح'
              : 'We are proud of our distinguished leadership of experts and professionals who lead Sinai Manganese Company towards excellence and success'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className={cn('text-center', isRTL && 'text-right')}>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </p>
            </div>
          </div>
        ) : members.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className={cn('text-center', isRTL && 'text-right')}>
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {language === 'ar' ? 'لا يوجد أعضاء متاحين حالياً' : 'No members available at the moment'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {members.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {language === 'ar' ? member.nameAr : member.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className={cn("text-center", isRTL && "text-right")}>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-primary" />
                    <p className="text-lg font-semibold text-primary">
                      {language === 'ar' ? member.titleAr : member.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className={cn("mt-16 text-center", isRTL && "text-right")}>
          <p className="text-muted-foreground">
            {language === 'ar'
              ? 'نلتزم بالشفافية والحوكمة الرشيدة في جميع عملياتنا'
              : 'We are committed to transparency and good governance in all our operations'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Members;

