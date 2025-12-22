import { Phone, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export interface PhoneNumber {
  number: string;
  label?: string;
  type: 'phone' | 'fax';
}

interface PhoneNumbersProps {
  phones: PhoneNumber[];
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showLabels?: boolean;
}

const PhoneNumbers = ({ 
  phones, 
  className = '', 
  iconClassName = 'h-5 w-5',
  textClassName = '',
  showLabels = false
}: PhoneNumbersProps) => {
  const { isRTL } = useLanguage();

  if (!phones || phones.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {phones.map((phone, index) => {
        const Icon = phone.type === 'fax' ? Printer : Phone;
        const cleanNumber = phone.number.replace(/\s+/g, '');
        const href = phone.type === 'fax' ? `fax:${cleanNumber}` : `tel:${cleanNumber}`;

        return (
          <a
            key={index}
            href={href}
            className={cn(
              'flex items-center gap-3 text-white/70 hover:text-white transition-colors',
              isRTL && 'flex-row-reverse',
              textClassName
            )}
          >
            <Icon className={cn('text-primary flex-shrink-0', iconClassName)} />
            <div className={cn('flex flex-col', isRTL && 'items-end')}>
              {showLabels && phone.label && (
                <span className="text-xs text-white/50 mb-0.5">{phone.label}</span>
              )}
              <span className="text-sm font-medium">{phone.number}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default PhoneNumbers;

