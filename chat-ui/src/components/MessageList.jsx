import React, { useRef, useEffect } from 'react'
import MessageItem from './MessageItem'

function MessageList({ messages, username }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-2">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageItem 
              key={message.id || index}
              message={message}
              isOwnMessage={message.isMe || message.senderUsername === username || message.senderId === username}
            />
          ))
        ) : (
          <p className="bg-white p-3 rounded-lg shadow-sm self-start max-w-md">
            No messages yet. Start the conversation!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageList