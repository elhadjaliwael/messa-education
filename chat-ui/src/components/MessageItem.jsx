import React from 'react'

function MessageItem({ message, isOwnMessage }) {
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <div 
        className={`p-3 rounded-lg max-w-xs sm:max-w-md break-words ${
          isOwnMessage 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        {message.text}
      </div>
      <div className="text-xs text-gray-500 mt-1 px-1">
        {formatTime(message.timestamp)}
      </div>
    </div>
  )
}

export default MessageItem