import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatMessage {
  id: number;
  message: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

const LiveChatWidget = () => {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showNameForm, setShowNameForm] = useState(true);

  useEffect(() => {
    // Load saved user info
    const savedName = localStorage.getItem('chatUserName');
    const savedEmail = localStorage.getItem('chatUserEmail');
    if (savedName && savedEmail) {
      setName(savedName);
      setEmail(savedEmail);
      setShowNameForm(false);
      
      // Load messages for this specific user
      const allUserChats = JSON.parse(localStorage.getItem('allUserChats') || '{}');
      const userMessages = allUserChats[savedEmail] || [];
      setMessages(userMessages);
    }
  }, []);

  // Listen for new admin messages
  useEffect(() => {
    const checkForNewMessages = () => {
      const savedEmail = localStorage.getItem('chatUserEmail');
      if (savedEmail) {
        const allUserChats = JSON.parse(localStorage.getItem('allUserChats') || '{}');
        const userMessages = allUserChats[savedEmail] || [];
        if (userMessages.length !== messages.length) {
          setMessages(userMessages);
        }
      }
    };

    const interval = setInterval(checkForNewMessages, 1000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const handleSubmitInfo = () => {
    if (!name.trim() || !email.trim()) {
      toast.error(t('pleaseFillAllFields') || 'Please fill all fields');
      return;
    }
    localStorage.setItem('chatUserName', name);
    localStorage.setItem('chatUserEmail', email);
    setShowNameForm(false);
    toast.success(t('infoSaved') || 'Info saved');
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      message: message.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    // Save to chat API (will be handled by backend)
    saveChatMessage(newMessage);

    setMessage('');

    // Simulate admin response after 2 seconds
    setTimeout(() => {
      const adminResponse: ChatMessage = {
        id: Date.now() + 1,
        message: t('adminResponseMessage') || 'Thank you for your message. We will get back to you soon.',
        sender: 'admin',
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...updatedMessages, adminResponse];
      setMessages(finalMessages);
      localStorage.setItem('chatMessages', JSON.stringify(finalMessages));
    }, 2000);
  };

  const saveChatMessage = async (msg: ChatMessage) => {
    try {
      // Save to localStorage for now (will be replaced with API call)
      const chatData = {
        name,
        email,
        message: msg.message,
        timestamp: msg.timestamp,
      };
      
      // Save to admin chats
      const existingChats = JSON.parse(localStorage.getItem('adminChats') || '[]');
      existingChats.push({
        id: Date.now(),
        ...chatData,
        status: 'pending',
      });
      localStorage.setItem('adminChats', JSON.stringify(existingChats));

      // Save to user's chat history
      const allUserChats = JSON.parse(localStorage.getItem('allUserChats') || '{}');
      if (!allUserChats[email]) {
        allUserChats[email] = [];
      }
      allUserChats[email].push({
        id: msg.id,
        message: msg.message,
        sender: 'user',
        timestamp: msg.timestamp,
      });
      localStorage.setItem('allUserChats', JSON.stringify(allUserChats));
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div
        className={cn(
          'fixed bottom-6 z-50',
          isRTL ? 'left-6' : 'right-6'
        )}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-[#204393] hover:bg-[#1b356f] text-white shadow-2xl flex items-center justify-center p-0 transition-all hover:scale-110"
          size="lg"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 z-50 transition-all duration-300',
        isRTL ? 'left-6' : 'right-6',
        isMinimized ? 'w-80' : 'w-96'
      )}
    >
      <Card className="backdrop-blur-xl bg-white/95 border border-border shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-[#204393] text-white p-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">{t('liveChat') || 'Live Chat'}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Name/Email Form */}
              {showNameForm ? (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t('name') || 'Name'}
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('enterYourName') || 'Enter your name'}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t('email') || 'Email'}
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('enterYourEmail') || 'Enter your email'}
                      className="bg-background"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitInfo}
                    className="w-full bg-[#204393] hover:bg-[#1b356f] text-white"
                  >
                    {t('startChat') || 'Start Chat'}
                  </Button>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="h-80 overflow-y-auto p-4 space-y-3 bg-background/50">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p>{t('noMessagesYet') || 'No messages yet. Start the conversation!'}</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            'flex',
                            msg.sender === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[80%] rounded-lg p-3',
                              msg.sender === 'user'
                                ? 'bg-[#204393] text-white'
                                : 'bg-muted text-foreground'
                            )}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-border bg-background">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('typeYourMessage') || 'Type your message...'}
                        className="flex-1 bg-background"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-[#204393] hover:bg-[#1b356f] text-white"
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChatWidget;

