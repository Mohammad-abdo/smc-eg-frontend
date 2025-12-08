import { useState } from 'react';
import { Eye, Search, Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useContacts } from '@/hooks/useApi';

const ContactsManagement = () => {
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const { data: contacts = [], isLoading } = useContacts();

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">{t('contacts') || 'Contacts'}</h2>
        <p className="text-muted-foreground mt-1">{t('manageContacts') || 'Manage contact messages'}</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search') || 'Search contacts...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('contactsList') || 'Contacts List'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium">{contact.name}</p>
                    <Badge className={contact.status === 'new' ? 'bg-blue-500' : 'bg-gray-500'}>
                      {contact.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </div>
                    <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </div>
                    <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                      <Calendar className="h-4 w-4" />
                      {new Date(contact.date).toLocaleDateString()}
                    </div>
                    <p className="mt-2">{contact.message}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedContact(contact)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedContact.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p>{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p>{selectedContact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Message</p>
                <p>{selectedContact.message}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p>{new Date(selectedContact.date).toLocaleDateString()}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContactsManagement;

