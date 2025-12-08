import { useState, useEffect } from 'react';
import { MessageCircle, Eye, CheckCircle2, XCircle, Search, Reply } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'replied' | 'resolved';
  reply?: string;
}

const ChatManagement = () => {
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedChat, setSelectedChat] = useState<ChatMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [chats, setChats] = useState<ChatMessage[]>([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = () => {
    const savedChats = localStorage.getItem('adminChats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  };

  const handleStatusChange = (id: number, newStatus: ChatMessage['status']) => {
    const updatedChats = chats.map(chat =>
      chat.id === id ? { ...chat, status: newStatus } : chat
    );
    setChats(updatedChats);
    localStorage.setItem('adminChats', JSON.stringify(updatedChats));
    toast.success('Status updated');
  };

  const handleReply = (chat: ChatMessage) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    const updatedChats = chats.map(c =>
      c.id === chat.id
        ? { ...c, reply: replyText, status: 'replied' as const }
        : c
    );
    setChats(updatedChats);
    localStorage.setItem('adminChats', JSON.stringify(updatedChats));
    
    // Update user's chat messages - find user by email
    const allUserChats = JSON.parse(localStorage.getItem('allUserChats') || '{}');
    if (!allUserChats[chat.email]) {
      allUserChats[chat.email] = [];
    }
    
    // Add admin reply to user's chat
    allUserChats[chat.email].push({
      id: Date.now(),
      message: replyText,
      sender: 'admin',
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('allUserChats', JSON.stringify(allUserChats));

    // Also update current user's chat if they're viewing it
    const currentUserEmail = localStorage.getItem('chatUserEmail');
    if (currentUserEmail === chat.email) {
      const userChats = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      userChats.push({
        id: Date.now(),
        message: replyText,
        sender: 'admin',
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('chatMessages', JSON.stringify(userChats));
    }

    setReplyText('');
    setSelectedChat(null);
    toast.success('Reply sent to customer');
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || chat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = chats.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">{t('chatMessages') || 'Chat Messages'}</h2>
        <p className="text-white/70 mt-1">Manage customer chat messages</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Messages</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/20 backdrop-blur">
              <MessageCircle className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{chats.length}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Pending</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/20 backdrop-blur">
              <XCircle className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Replied</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/20 backdrop-blur">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {chats.filter(c => c.status === 'replied' || c.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder={t('search') || 'Search messages...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2744] border-white/20">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="pending" className="text-white">Pending</SelectItem>
                <SelectItem value="replied" className="text-white">Replied</SelectItem>
                <SelectItem value="resolved" className="text-white">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Chats List */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{t('messagesList') || 'Messages List'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredChats.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60">No messages found</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-start justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium text-white">{chat.name}</p>
                      <Badge
                        className={
                          chat.status === 'resolved'
                            ? 'bg-green-500/80 text-white'
                            : chat.status === 'replied'
                            ? 'bg-blue-500/80 text-white'
                            : 'bg-orange-500/80 text-white'
                        }
                      >
                        {chat.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-white/70 mb-3">
                      <p className="text-white/80">{chat.email}</p>
                      <p className="text-white">{chat.message}</p>
                      <p className="text-white/60">
                        {new Date(chat.timestamp).toLocaleString()}
                      </p>
                      {chat.reply && (
                        <div className="mt-2 p-2 bg-blue-500/20 rounded border border-blue-500/30">
                          <p className="text-blue-300 font-medium mb-1">Reply:</p>
                          <p className="text-white/90">{chat.reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                    <Select
                      value={chat.status}
                      onValueChange={(value) => handleStatusChange(chat.id, value as ChatMessage['status'])}
                    >
                      <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2744] border-white/20">
                        <SelectItem value="pending" className="text-white">Pending</SelectItem>
                        <SelectItem value="replied" className="text-white">Replied</SelectItem>
                        <SelectItem value="resolved" className="text-white">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedChat(chat)}
                      className="text-white hover:bg-white/10"
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedChat(chat)}
                      className="text-white hover:bg-white/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      {selectedChat && (
        <Dialog open={!!selectedChat} onOpenChange={() => setSelectedChat(null)}>
          <DialogContent className="backdrop-blur-xl bg-[#1a2744] border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Reply to {selectedChat.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/60 mb-1">From</p>
                <p className="text-white">{selectedChat.email}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Message</p>
                <p className="text-white bg-white/5 p-3 rounded">{selectedChat.message}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-2">Your Reply</p>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedChat(null);
                    setReplyText('');
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReply(selectedChat)}
                  disabled={!replyText.trim()}
                  className="bg-[#204393] hover:bg-[#1b356f] text-white"
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ChatManagement;

