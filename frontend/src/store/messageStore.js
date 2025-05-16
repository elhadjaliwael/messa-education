import { create } from 'zustand';
import { io } from 'socket.io-client';
import { axiosPrivate } from '@/api/axios';

const useMessageStore = create((set, get) => ({
  // State
  socket: null,
  isConnected: false,
  contacts: [],
  selectedContact: null,
  messages: {},
  
  // Actions
  initializeSocket: (auth) => {
    const socket = io("http://localhost:8000/", {
        path: "/api/chat/socket.io",
        withCredentials: true,
        auth: {
            userId: auth.user.id,
            role: auth.user.role
        },
        extraHeaders : {
            authorization: `Bearer ${auth.accessToken}`
        }
    });
    
    socket.on('connect', () => {
      set({ isConnected: true });
    });
    
    socket.on('disconnect', () => {
      set({ isConnected: false });
    });
    
    // Handle receiving messages
    socket.on('new_message', (message) => {
      const { messages } = get();
      
      // Determine the correct contact ID based on whether user is sender or recipient
      const contactId = message.senderId === auth.user.id 
        ? message.recipientId 
        : message.senderId;
      
      // Create a new messages object with the updated messages array
      const updatedMessages = {
        ...messages,
        [contactId]: [...(messages[contactId] || []), message]
      };
      // Update messages state
      set({ messages: updatedMessages });
      
      // Update unread status for the contact
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
    socket.on('new_group_message', (message) => {
      const { messages } = get();
      const groupId = message.groupId;
      
      // Create a new messages object with the updated messages array
      const updatedMessages = {
        ...messages,
        [groupId]: [...(messages[groupId] || []), message]
      };
    
      
      // Update messages state
      set({ messages: updatedMessages });
      
      // Update unread status for the group
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
    socket.on('group_update', (update) => {
      const { groupId, lastMessage } = update;
      
      // Update unread status and last message for the group
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
    set({ socket });
    
    return socket;
  },
  
  // Disconnect socket
  disconnectSocket: () => {
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
  uploadAttachment: async (file, type = 'file') => {
    const { socket, selectedContact, sendMessage } = get();
    
    if (!socket || !selectedContact) {
      console.error('Cannot upload attachment: No socket or selected contact');
      return null;
    }
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('recipientId', selectedContact.id);
      formData.append('isGroup', selectedContact.isGroup ? 'true' : 'false');
      
      // Upload the file to the server
      const response = await axiosPrivate.post('/chat/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Get the file URL from the response
      const { fileUrl, fileName } = response.data;
      
      // Create attachment object
      const attachment = {
        url: fileUrl,
        name: fileName || file.name,
        type: type === 'image' ? 'image' : 'file',
        size: file.size
      };
      
      // Send message with attachment
      const content = type === 'image' ? 'Image' : 'Fichier';
      const message = sendMessage(content, 'text');
      
      // Update the message with attachment info
      const { messages } = get();
      const contactId = selectedContact.id;
      const updatedMessages = {
        ...messages,
        [contactId]: messages[contactId].map(msg => 
          msg.id === message.id ? { ...msg, attachment } : msg
        )
      };
      
      set({ messages: updatedMessages });
      
      return { message, attachment };
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return null;
    }
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