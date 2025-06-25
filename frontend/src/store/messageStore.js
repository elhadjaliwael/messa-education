import { create } from 'zustand';
import { io } from 'socket.io-client';
import { axiosPrivate } from '@/api/axios';
import { uploadToCloudinary, uploadToCloudinaryWithProgress } from '@/config/cloudinary';

const useMessageStore = create((set, get) => ({
  // State
  socket: null,
  isConnected: false,
  contacts: [],
  selectedContact: null,
  messages: {},
  
  // Actions
  initializeSocket: (auth) => {
    const { socket } = get();

    // If socket exists and is connected, reuse it
    if (socket && socket.connected) {
      return socket;
    }

    // If socket exists but is not connected, clean up
    if (socket && !socket.connected) {
      socket.removeAllListeners();
      socket.disconnect();
    }

    const newSocket = io("http://localhost:3003/", {
      path: "/api/chat/chat-socket",
      withCredentials: true,
      transports: ['websocket'],
      auth: {
        userId: auth.user.id,
        role: auth.user.role
      },
      extraHeaders: {
        authorization: `Bearer ${auth.accessToken}`
      },
      autoConnect: false
    });
    console.log("wa chat");

    newSocket.on('connect', () => {
      set({ isConnected: true });
    });

    newSocket.on('disconnect', () => {
      set({ isConnected: false });
    });

    newSocket.on('connect_error', (err) => {
      console.log('Connect error:', err.message);
    });

    // Handle receiving messages
    newSocket.on('new_message', (message) => {
      const { messages } = get();
      const contactId = message.senderId === auth.user.id
        ? message.recipientId
        : message.senderId;
      const updatedMessages = {
        ...messages,
        [contactId]: [...(messages[contactId] || []), message]
      };
      set({ messages: updatedMessages });

      const { contacts, selectedContact } = get();
      if (!selectedContact || selectedContact.id !== contactId) {
        const updatedContacts = contacts.map(contact => {
          if (contact.id === contactId) {
            return { ...contact, unread: true, lastMessage: message.content };
          }
          return contact;
        });
        set({ contacts: updatedContacts });
      }
    });

    // Handle group messages
    newSocket.on('new_group_message', (message) => {
      const { messages } = get();
      const groupId = message.groupId;
      const updatedMessages = {
        ...messages,
        [groupId]: [...(messages[groupId] || []), message]
      };
      set({ messages: updatedMessages });

      const { contacts, selectedContact } = get();
      if (!selectedContact || selectedContact.id !== groupId) {
        const updatedContacts = contacts.map(contact => {
          if (contact.id === groupId) {
            return { ...contact, unread: true, lastMessage: message.content };
          }
          return contact;
        });
        set({ contacts: updatedContacts });
      }
    });

    // Handle group updates (for notifications and unread indicators)
    newSocket.on('group_update', (update) => {
      const { groupId, lastMessage } = update;
      const { contacts, selectedContact } = get();
      if (!selectedContact || selectedContact.id !== groupId) {
        const updatedContacts = contacts.map(contact => {
          if (contact.id === groupId) {
            return {
              ...contact,
              unread: true,
              lastMessage: lastMessage.content,
              lastMessageTime: lastMessage.timestamp
            };
          }
          return contact;
        });
        set({ contacts: updatedContacts });
      }
    });

    set({ socket: newSocket });

    return newSocket;
  },
  
  // Disconnect socket
  disconnectMessageSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null, isConnected: false });
  },
  
  // Set contacts
  setContacts: (contacts) => set({ contacts }),
  
  // Set selected contact
  setSelectedContact: (contact) => {
    // Mark contact as read when selected
    if (contact) {
      const { contacts, fetchMessagesForContact } = get();
      const updatedContacts = contacts.map(c => {
        if (c.id === contact.id) {
          return { ...c, unread: false };
        }
        return c;
      });
      set({ contacts: updatedContacts });
      
      // Fetch messages for this contact from backend
      fetchMessagesForContact(contact.id);
    }
    set({ selectedContact: contact });
  },
  
  // Send message
  sendMessage: (content, type = 'text') => {
    const { socket, selectedContact, messages } = get();
    
    if (!socket || !selectedContact) {
      console.error('Cannot send message: No socket or selected contact');
      return;
    }
    
    // Get user ID from socket auth
    const senderId = socket.auth.userId;
    
    const messageData = {
      content,
      type,
      timestamp: new Date().toISOString(),
      senderId: senderId,
      senderRole: socket.auth.role,
    };
    
    
    // Handle group messages differently
    if (selectedContact.isGroup) {
      messageData.groupId = selectedContact.id;
      messageData.isGroupMessage = true;
      messageData.recipientId = selectedContact.id;
      socket.emit('send_group_message', messageData);
    } else {
      messageData.recipientId = selectedContact.id;
      socket.emit('send_message', messageData);
    }
    
    // Optimistically add message to local state
    const contactId = selectedContact.id;
    const newMessage = {
      ...messageData,
      id: Date.now().toString(), // Temporary ID until server assigns one
      sent: true,
      delivered: false,
      read: false,
    };
    
    // Create a new messages object with the updated messages array
    const updatedMessages = {
      ...messages,
      [contactId]: [...(messages[contactId] || []), newMessage]
    };
    
    // Update messages state
    set({ messages: updatedMessages });
    
    // Update the contact's lastMessage
    const { contacts } = get();
    const updatedContacts = contacts.map(contact => {
      if (contact.id === contactId) {
        return { ...contact, lastMessage: content };
      }
      return contact;
    });
    set({ contacts: updatedContacts });
    
    return newMessage;
  },
  
  // Get messages for selected contact
  getMessagesForSelectedContact: () => {
    const { selectedContact, messages } = get();

    if (!selectedContact) return [];
    return messages[selectedContact.id] || [];
  },
  
  // Fetch messages from backend for a contact
  fetchMessagesForContact: async (contactId) => {
    if (!contactId) return [];
    
    try {      
      const response = await axiosPrivate.get(`/chat/messages/groupes/${contactId}`);
      const data = response.data;
      // Update messages in store
      const { messages } = get();
      set({
        messages: {
          ...messages,
          [contactId]: data || []
        }
      });
      
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },
  
  // Upload attachment and send message with attachment
  // Updated uploadAttachment function for direct Cloudinary upload
  uploadAttachment: async (file, type = 'file', onProgress = null, content = '') => {
    const { socket, selectedContact, sendMessage } = get();
    
    if (!socket || !selectedContact) {
      console.error('Cannot upload attachment: No socket or selected contact');
      return null;
    }
    
    try {
      // Upload directly to Cloudinary
      const uploadOptions = {
        folder: 'messages_attachments',
        publicId: `attachment_${Date.now()}_${selectedContact.id}`
      };
      
      let uploadResult;
      if (onProgress) {
        uploadResult = await uploadToCloudinaryWithProgress(file, uploadOptions, onProgress);
      } else {
        uploadResult = await uploadToCloudinary(file, uploadOptions);
      }
      
      // Create attachment object
      const attachment = {
        url: uploadResult.fileUrl,
        name: uploadResult.fileName,
        type: type === 'image' ? 'image' : 'file',
        size: uploadResult.fileSize,
        cloudinaryId: uploadResult.cloudinaryId,
        ...(uploadResult.width && { width: uploadResult.width }),
        ...(uploadResult.height && { height: uploadResult.height })
      };
      
      // Send message with attachment and text content
      const message = sendMessage(content || '', type, attachment);
      
      return { message, attachment };
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return null;
    }
  },

  // Enhanced sendMessage to handle attachments
  sendMessage: (content, type = 'text', attachment = null) => {
    const { socket, selectedContact, messages } = get();
    
    if (!socket || !selectedContact) {
      console.error('Cannot send message: No socket or selected contact');
      return;
    }
    
    // Get user ID from socket auth
    const senderId = socket.auth.userId;
    
    const messageData = {
      content,
      type,
      timestamp: new Date().toISOString(),
      senderId: senderId,
      senderRole: socket.auth.role,
      ...(attachment && { attachment })
    };
    
    // Handle group messages differently
    if (selectedContact.isGroup) {
      messageData.groupId = selectedContact.id;
      messageData.isGroupMessage = true;
      messageData.recipientId = selectedContact.id;
      socket.emit('send_group_message', messageData);
    } else {
      messageData.recipientId = selectedContact.id;
      socket.emit('send_message', messageData);
    }
    
    // Optimistically add message to local state
    const contactId = selectedContact.id;
    const newMessage = {
      ...messageData,
      id: Date.now().toString(),
      sent: true,
      delivered: false,
      read: false,
    };
    
    // Create a new messages object with the updated messages array
    const updatedMessages = {
      ...messages,
      [contactId]: [...(messages[contactId] || []), newMessage]
    };
    
    // Update messages state
    set({ messages: updatedMessages });
    
    // Update the contact's lastMessage
    const { contacts } = get();
    const updatedContacts = contacts.map(contact => {
      if (contact.id === contactId) {
        return { 
          ...contact, 
          lastMessage: attachment ? `📎 ${attachment.name}` : content 
        };
      }
      return contact;
    });
    set({ contacts: updatedContacts });
    
    return newMessage;
  },
  
  // Mark messages as read
  markMessagesAsRead: (contactId) => {
    const { contacts } = get();
    const updatedContacts = contacts.map(contact => {
      if (contact.id === contactId) {
        return { ...contact, unread: false };
      }
      return contact;
    });
    set({ contacts: updatedContacts });
    
    // You could also emit a socket event to inform the server
    const { socket } = get();
    if (socket) {
      socket.emit('markAsRead', { contactId });
    }
  }
}));

export default useMessageStore;