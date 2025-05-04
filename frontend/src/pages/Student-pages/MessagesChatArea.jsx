import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Smile, ImageIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Menu } from "lucide-react"

function MessagesChatArea({ selectedContact, message, setMessage, onOpenSidebar, isMobile}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'contact',
      text: selectedContact.lastMessage,
      time: '10:30'
    },
    {
      id: 2,
      sender: 'user',
      text: "Merci pour votre message. J'avance bien sur les exercices d'équations.",
      time: '10:32'
    },
    {
      id: 3,
      sender: 'contact',
      text: "Excellent ! N'hésitez pas à me contacter si vous avez des questions.",
      time: '10:34'
    }
  ]);
  
  const messagesEndRef = useRef(null);
  
  // Update messages when contact changes
  useEffect(() => {
    // Reset messages or fetch new ones when contact changes
    setMessages([
      {
        id: 1,
        sender: 'contact',
        text: selectedContact.lastMessage,
        time: '10:30'
      },
      {
        id: 2,
        sender: 'user',
        text: "Merci pour votre message. J'avance bien sur les exercices d'équations.",
        time: '10:32'
      },
      {
        id: 3,
        sender: 'contact',
        text: "Excellent ! N'hésitez pas à me contacter si vous avez des questions.",
        time: '10:34'
      }
    ]);
  }, [selectedContact]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Get current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Add new message
    setMessages([...messages, {
      id: Date.now(),
      sender: 'user',
      text: message,
      time: timeString
    }]);
    
    // Clear input
    setMessage('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Add these imports at the top
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    
    // Add these handler functions before the return statement
    const handleFileAttachment = () => {
      fileInputRef.current?.click();
    };
    
    const handleImageAttachment = () => {
      imageInputRef.current?.click();
    };
    
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Here you would typically upload the file to your server
        // For now, we'll just add a message about the attachment
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        setMessages([...messages, {
          id: Date.now(),
          sender: 'user',
          text: `Fichier joint: ${file.name}`,
          time: timeString,
          attachment: {
            type: 'file',
            name: file.name,
            size: file.size
          }
        }]);
        
        // Reset the input
        e.target.value = '';
      }
    };
    
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const now = new Date();
          const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          
          setMessages([...messages, {
            id: Date.now(),
            sender: 'user',
            text: `Image envoyée`,
            time: timeString,
            attachment: {
              type: 'image',
              url: event.target.result,
              name: file.name
            }
          }]);
        };
        reader.readAsDataURL(file);
        
        // Reset the input
        e.target.value = '';
      }
    };
    
    const handleEmojiClick = (emoji) => {
      setMessage(prev => prev + emoji);
      setShowEmojiPicker(false);
    };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 border-b p-4 rounded-tr-2xl dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-3">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onOpenSidebar}
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Avatar>
            <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                {selectedContact.initials}
            </AvatarFallback>
            </Avatar>
            <div>
            <p className="font-medium text-slate-900 dark:text-slate-50">{selectedContact.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{selectedContact.subject}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedContact.online ? "En ligne" : "Hors ligne"}
            </p>
            </div>
        </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="space-y-4 h-[500px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end ${msg.sender === 'user' ? 'justify-end gap-2' : 'gap-2'}`}>
                {msg.sender === 'contact' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                      {selectedContact.initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg ${msg.sender === 'user' 
                  ? 'rounded-br-none bg-blue-600 text-white' 
                  : 'rounded-bl-none bg-white dark:bg-slate-700'} p-3 shadow-sm max-w-[70%]`}>
                  <p className={msg.sender === 'user' ? '' : 'text-slate-900 dark:text-slate-50'}>
                    {msg.text}
                  </p>
                  <p className={`mt-1 text-right text-xs ${msg.sender === 'user' 
                    ? 'text-blue-100' 
                    : 'text-slate-500 dark:text-slate-400'}`}>
                    {msg.time}
                  </p>
                </div>
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="You" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                      AL
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            <div className="flex justify-center">
              <div className="rounded-full bg-slate-200 dark:bg-slate-700 px-3 py-1 text-xs text-slate-500 dark:text-slate-400">
                Aujourd'hui
              </div>
            </div>
            <div ref={messagesEndRef}></div>
        </div>
        </ScrollArea>

        <div className="border-t p-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="flex gap-2 relative">
            <div className="flex gap-2">
            <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={handleFileAttachment}
                    >
                      <Paperclip className="h-5 w-5 text-slate-500" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Joindre un fichier</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />

            <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={handleImageAttachment}
                    >
                      <ImageIcon className="h-5 w-5 text-slate-500" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Envoyer une image</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <input 
              type="file" 
              accept="image/*" 
              ref={imageInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
            />

            <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                      <Smile className="h-5 w-5 text-slate-500" />
                      {showEmojiPicker && (
                        <div className="p-2 bg-white dark:bg-slate-800 absolute bottom-12 left-0 rounded-md shadow-md z-10">
                            <div className="grid grid-cols-4 gap-2">
                            {['😊', '😂', '❤️', '👍', '🎉', '🙏', '💯', '🔥', 
                                '😍', '😎', '🤔', '😢', '😭', '😡', '🥳', '😴'].map(emoji => (
                                <div
                                key={emoji}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEmojiClick(emoji);
                                }}
                                className="text-xl hover:bg-slate-100 dark:hover:bg-slate-700 p-1 rounded"
                                >
                                {emoji}
                                </div>
                            ))}
                            </div>
                        </div>
                      )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Insérer un emoji</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            </div>
            <Input
              placeholder="Écrivez votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-white dark:bg-slate-800"
            />
            <Button 
              className="rounded-full" 
              size="icon" 
              disabled={!message.trim()}
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
        </div>
        
        </div>
    </div>
  )
}

export default MessagesChatArea