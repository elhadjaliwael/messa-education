import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Smile, ImageIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Menu } from "lucide-react"
import useMessageStore from "@/store/messageStore"
import useAuth from "@/hooks/useAuth"

function MessagesChatArea({ selectedContact, onOpenSidebar, isMobile }) {
  const [messageText, setMessageText] = useState("");
  const { user } = useAuth();
  const { sendMessage, getMessagesForSelectedContact, uploadAttachment } = useMessageStore();
  const messages = getMessagesForSelectedContact();
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // Prevent duplicate messages by disabling the button temporarily
    const trimmedMessage = messageText.trim();
    setMessageText('');
    
    // Only send the message if it's not empty
    if (trimmedMessage) {
      sendMessage(trimmedMessage);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageAttachment = () => {
    imageInputRef.current?.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadAttachment(file, 'file');
      e.target.value = '';
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadAttachment(file, 'image');
      e.target.value = '';
    }
  };
  
  const handleEmojiClick = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Format timestamp to readable time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            {selectedContact ? (
              <>
                <Avatar>
                  <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                    {selectedContact.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">{selectedContact.username}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedContact.subject}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedContact.online ? "En ligne" : "Hors ligne"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-slate-500">Sélectionnez un contact pour commencer une conversation</p>
            )}
        </div>
      </div>

      {selectedContact ? (
        <>
          <ScrollArea className="flex-1 p-4 bg-slate-100 dark:bg-slate-800/50">
            <div className="space-y-4 h-[500px]">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500 dark:text-slate-400">
                    Aucun message. Commencez la conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.senderId === user?.id;
                  // Find sender info from teachers or students list in the selected contact
                  let senderInfo = null;
                  
                  if (selectedContact.isGroup && !isUser) {
                    // Check in appropriate list based on sender role
                    if (msg.senderRole === 'teacher') {
                      console.log("teachers ! " + selectedContact.teachers )
                      senderInfo = selectedContact.teachers?.find(teacher => teacher._id === msg.senderId);
      
                    } else {
                      senderInfo = selectedContact.students?.find(student => student._id === msg.senderId);
                    }
                  }
                  // Determine avatar styling based on sender role
                  const avatarStyle = msg.senderRole === 'teacher' 
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200";
                  
                  return (
                    
                    <div key={msg.id || msg._id} className={`flex items-end ${isUser ? 'justify-end gap-2' : 'gap-2'}`}>
                      {!isUser && (
                        <div className="flex flex-col items-center">
                          <Avatar className="h-8 w-8">
                            {selectedContact.isGroup ? (
                              // For group messages, show the sender's avatar from teachers/students list
                              <AvatarImage 
                                src={senderInfo?.avatar || msg.senderAvatar || "/placeholder-user.svg"} 
                                alt={senderInfo?.username || msg.senderName || "User"} 
                              />
                            ) : (
                              // For direct messages, show the contact's avatar
                              <AvatarImage 
                                src={selectedContact.avatar || "/placeholder.svg"} 
                                alt={selectedContact.name} 
                              />
                            )}
                            <AvatarFallback className={selectedContact.isGroup ? avatarStyle : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"}>
                              {selectedContact.isGroup ? 
                                (senderInfo?.username?.substring(0, 2) || msg.senderInitials || msg.senderId?.substring(0, 2)) : 
                                selectedContact.initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        {!isUser && selectedContact.isGroup && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 ml-1">
                            {senderInfo?.username || msg.senderName || (msg.senderRole === 'teacher' ? 'Enseignant' : 'Étudiant')}
                          </span>
                        )}
                        <div className={`rounded-lg ${isUser 
                          ? 'rounded-br-none bg-blue-600 text-white' 
                          : 'rounded-bl-none bg-white dark:bg-slate-700'} p-3 shadow-sm`}>
                        <p className={isUser ? '' : 'text-slate-900 dark:text-slate-50'}>
                          {msg.content}
                        </p>
                        
                        {msg.attachment && (
                          <div className="mt-2">
                            {msg.attachment.type === 'image' ? (
                              <img 
                                src={msg.attachment.url} 
                                alt={msg.attachment.name} 
                                className="max-w-full rounded-md"
                              />
                            ) : (
                              <div className="flex items-center gap-2 p-2 rounded-md bg-slate-100 dark:bg-slate-600">
                                <Paperclip className="h-4 w-4" />
                                <span className="text-sm truncate">{msg.attachment.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <p className={`mt-1 text-right text-xs ${isUser 
                          ? 'text-blue-100' 
                          : 'text-slate-500 dark:text-slate-400'}`}>
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      </div>
                      </div>
                      {isUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt="You" />
                          <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                            {user?.initials || 'ME'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })
              )}

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
                                  className="text-xl hover:bg-slate-100 dark:hover:bg-slate-700 p-1 rounded cursor-pointer"
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
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-white dark:bg-slate-800"
              />
              <Button 
                className="rounded-full" 
                size="icon" 
                disabled={!messageText.trim()}
                onClick={handleSendMessage}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center">
              <Send className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Vos messages</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Sélectionnez un contact dans la liste pour commencer une conversation.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesChatArea