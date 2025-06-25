import React, { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Smile, ImageIcon, X, FileText, Menu } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useMessageStore from "@/store/messageStore"
import useAuth from "@/hooks/useAuth"

function MessagesChatArea({ selectedContact, onOpenSidebar, isMobile }) {
  const [messageText, setMessageText] = useState("")
  const { user } = useAuth()
  const { sendMessage, getMessagesForSelectedContact,uploadAttachment } = useMessageStore()
  const messages = getMessagesForSelectedContact()
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [pendingAttachment, setPendingAttachment] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleSendMessage = async () => {
    if (!messageText.trim() && !pendingAttachment) return
    
    setIsUploading(true)
    
    try {
      if (pendingAttachment) {
        // Upload attachment with text content
        const result = await uploadAttachment(
          pendingAttachment.file, 
          pendingAttachment.type,
          (progress) => {
            // Optional: You can add upload progress handling here
            console.log('Upload progress:', progress)
          },
          messageText.trim() // Pass the text content as the 4th parameter
        )
        
        if (result) {
          // The uploadAttachment function already calls sendMessage internally
          console.log('File uploaded and message sent successfully')
        } else {
          throw new Error('Failed to upload attachment')
        }
        
        setPendingAttachment(null)
      } else {
        await sendMessage(messageText.trim())
      }
      setMessageText('')
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Échec de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const handleFileAttachment = () => {
    fileInputRef.current?.click()
  }
  
  const handleImageAttachment = () => {
    imageInputRef.current?.click()
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale: 10MB')
        e.target.value = ''
        return
      }
      
      setPendingAttachment({
        file,
        type: 'file',
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      })
      
      e.target.value = ''
    }
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse. Taille maximale: 5MB')
        e.target.value = ''
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setPendingAttachment({
          file,
          type: 'image',
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
      
      e.target.value = ''
    }
  }
  
  const removePendingAttachment = () => {
    setPendingAttachment(null)
  }
  
  const handleEmojiClick = (emoji) => {
    setMessageText(prev => prev + emoji)
    setShowEmojiPicker(false)
  }
  
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!selectedContact) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
            Sélectionnez une conversation
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Choisissez une conversation dans la liste pour commencer à discuter
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="flex items-center space-x-3">
          {isMobile && onOpenSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSidebar}
              className="mr-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedContact.avatar} />
            <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
              {selectedContact.username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-50">
              {selectedContact.username}
            </h3>
            {selectedContact.isGroup && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {selectedContact.subject}
              </p>
            )}
          </div>
        </div>
        
        {selectedContact.online && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-500 dark:text-slate-400">En ligne</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  Aucun message dans cette conversation
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.senderId === user?.id;
                // Find sender info from teachers or students list in the selected contact
                let senderInfo = null;
                
                if (selectedContact.isGroup && !isUser) {
                  console.log(selectedContact)
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
                    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      {!isUser && selectedContact.isGroup && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 ml-1">
                          {senderInfo?.username || msg.senderName || (msg.senderRole === 'teacher' ? 'Enseignant' : 'Étudiant')}
                        </span>
                      )}
                      
                      {/* Display image attachment outside the bubble with border */}
                      {msg.attachment && msg.attachment.type === 'image' && (
                        <div className="mb-2 p-4">
                          <img 
                            src={msg.attachment.url} 
                            alt={msg.attachment.name} 
                            className="max-w-xs rounded-lg border-2 border-slate-300 dark:border-slate-600" 
                          />
                        </div>
                      )}
                      
                      {/* Text content in message bubble */}
                      {msg.content && (
                        <div className={`rounded-lg ${isUser
                          ? 'rounded-br-none bg-blue-600 text-white'
                          : 'rounded-bl-none bg-white dark:bg-slate-700'} p-3 shadow-sm`}>
                          <p className={isUser ? '' : 'text-slate-900 dark:text-slate-50 '}>
                            {msg.content}
                          </p>
                          <p className={`mt-1 text-right text-xs ${isUser
                            ? 'text-blue-100'
                            : 'text-slate-500 dark:text-slate-400'}`}>
                            {formatMessageTime(msg.timestamp)}
                          </p>
                        </div>
                      )}
                      
                      {/* Non-image attachments in separate bubble */}
                      {msg.attachment && msg.attachment.type !== 'image' && (
                        <div className={`rounded-lg ${isUser
                          ? 'rounded-br-none bg-blue-600 text-white'
                          : 'rounded-bl-none bg-white dark:bg-slate-700'} p-3 shadow-sm ${msg.content ? 'mt-2' : ''}`}>
                          <div className="flex items-center gap-3 p-3 rounded-md bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors cursor-pointer group max-w-xs"
                               onClick={() => window.open(msg.attachment.url, '_blank')}>
                            <div className="flex-shrink-0">
                              {msg.attachment.name?.endsWith('.pdf') ? (
                                <div className="h-8 w-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                              ) : msg.attachment.name?.match(/\.(doc|docx)$/i) ? (
                                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                              ) : msg.attachment.name?.match(/\.(zip|rar|7z)$/i) ? (
                                <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                                  <Paperclip className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                </div>
                              ) : (
                                <div className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                {msg.attachment.name}
                              </p>
                              {msg.attachment.size && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {(msg.attachment.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10l0 6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                          <p className={`mt-1 text-right text-xs ${isUser
                            ? 'text-blue-100'
                            : 'text-slate-500 dark:text-slate-400'}`}>
                            {formatMessageTime(msg.timestamp)}
                          </p>
                        </div>
                      )}
                      
                      {/* If only attachment without text, show timestamp */}
                      {msg.attachment && msg.attachment.type === 'image' && !msg.content && (
                        <p className={`mt-1 text-right text-xs ${isUser
                          ? 'text-blue-100'
                          : 'text-slate-500 dark:text-slate-400'}`}>
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      )}
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
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Attachment Preview */}
      {pendingAttachment && (
        <div className="flex-shrink-0 p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-sm">
            <div className="flex items-center space-x-3">
              {pendingAttachment.type === 'image' ? (
                <div className="relative">
                  <img 
                    src={pendingAttachment.preview} 
                    alt={pendingAttachment.name}
                    className="h-16 w-16 object-cover rounded-lg border-2 border-slate-200 dark:border-slate-600"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-16 w-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center border-2 border-slate-200 dark:border-slate-600">
                  <FileText className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                </div>
              )}
              
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                  {pendingAttachment.name}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {pendingAttachment.size}
                  </p>
                  {isUploading && (
                    <div className="flex items-center space-x-1">
                      <div className="h-1 w-16 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-xs text-blue-500">Envoi...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={removePendingAttachment}
              disabled={isUploading}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-slate-950 border-t dark:border-slate-800">
        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFileAttachment}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Joindre un fichier</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleImageAttachment}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Joindre une image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajouter un emoji</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex-1">
            <Input
              placeholder="Écrivez votre message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="resize-none"
              disabled={isUploading}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && !pendingAttachment) || isUploading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
            <div className="grid grid-cols-8 gap-2">
              {['😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯', '😎', '🤗', '😴', '🙄'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
        className="hidden"
      />
      
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}

export default MessagesChatArea