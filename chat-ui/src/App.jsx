import React, { useEffect, useState, useRef } from 'react'
import LoginForm from './components/LoginForm'
import ChatInterface from './components/ChatInterface'
import ChatSideBar from './components/ChatSideBar'
import { connectToSocket } from '../lib/socket'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [conversationHistory, setConversationHistory] = useState({})
  
  // Use useRef to maintain a stable reference to the socket
  const socketRef = useRef(null)
  
  // Initialize socket connection
  useEffect(() => {
    if (username && !socketRef.current) {
      socketRef.current = connectToSocket(username)
      socketRef.current.connect()
      
      // Set connected state
      socketRef.current.on('connect', () => {
        console.log('Socket connected with ID:', socketRef.current.id)
        // Emit user login event with both username and socket ID
        socketRef.current.emit('userLogin', { 
          username, 
          socketId: socketRef.current.id 
        })
      })
      
      // Fetch conversation history
      fetchAllConversations()
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [username])
  
  // Listen for online users
  useEffect(() => {
    if (socketRef.current) {
      // Clear previous listeners to avoid duplicates
      socketRef.current.off('getOnlineUsers')
      
      // Register the event listener
      socketRef.current.on('getOnlineUsers', (users) => {
        console.log('Received online users:', users)
        setOnlineUsers(users || [])
      })
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('getOnlineUsers')
      }
    }
  }, [username]) // Re-register when username changes
  
  // Listen for incoming messages
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.off('receiveMessage') // Clear previous listeners
      
      socketRef.current.on('receiveMessage', (message) => {
        console.log('Received message:', message)
        // Add message to current conversation if it's from the selected user
        if (message.senderId === selectedUser) {
          setMessages(prev => [...prev, message])
        }
        
        // Update conversation history
        setConversationHistory(prev => {
          const senderId = message.senderId
          return {
            ...prev,
            [senderId]: [...(prev[senderId] || []), message]
          }
        })
      })
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('receiveMessage')
      }
    }
  }, [selectedUser])
  
  // Load messages when selecting a user
  useEffect(() => {
    if (selectedUser) {
      // First check if we have cached messages
      if (conversationHistory[selectedUser]) {
        setMessages(conversationHistory[selectedUser])
      } else {
        // Fetch messages from database
        fetchMessagesForUser(selectedUser)
      }
    }
  }, [selectedUser])
  
  // Fetch all conversations for the current user
  const fetchAllConversations = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/messages/conversations?username=${username}`)
      const data = await response.json()
      
      if (data.success) {
        // Transform the data into our conversation history format
        const history = {}
        data.conversations.forEach(conv => {
          history[conv.otherUser] = conv.messages
        })
        
        setConversationHistory(history)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }
  
  // Fetch messages for a specific conversation
  const fetchMessagesForUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/messages?sender=${username}&recipient=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.messages)
        
        // Update conversation history
        setConversationHistory(prev => ({
          ...prev,
          [userId]: data.messages
        }))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  function handleSelectUser(userId) {
    setSelectedUser(userId)
  }
  
  function handleLogin(username) {
    setIsConnected(true)
    setUsername(username)
  }

  // Add message sending functionality
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser && socketRef.current) {
      const messageData = {
        senderId: username, // Use username instead of socket.id
        senderUsername: username,
        recipientId: selectedUser,
        text: newMessage,
        timestamp: new Date().toISOString(),
        isMe: true
      }
      
      // Send message through socket
      socketRef.current.emit('sendMessage', messageData)
      
      // Rest of the function remains the same
      setMessages(prev => [...prev, messageData])
      
      setConversationHistory(prev => {
        const recipientId = selectedUser
        return {
          ...prev,
          [recipientId]: [...(prev[recipientId] || []), messageData]
        }
      })
      
      saveMessageToDatabase(messageData)
      setNewMessage('')
    }
  }
  
  // Save message to database
  const saveMessageToDatabase = async (messageData) => {
    try {
      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })
      
      const data = await response.json()
      console.log(data)
      if (!data.success) {
        console.error('Failed to save message to database')
      }
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!isConnected ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="flex w-full max-w-6xl h-[600px] shadow-lg rounded-lg overflow-hidden">
          <ChatSideBar 
            onlineUsers={onlineUsers} 
            activeConversation={selectedUser} 
            setSelectedUser={handleSelectUser}
            conversationHistory={conversationHistory}
            username = {username}
          />
          <ChatInterface 
            username={username} 
            activeConversation={selectedUser}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        </div>
      )}
    </div>
  )
}

export default App
