import React, { useState } from 'react'

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <footer className="p-4 bg-white border-t">
      <form onSubmit={handleSubmit} className="flex">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..." 
          className="flex-1 border-2 border-gray-300 p-2 rounded-l-xl focus:outline-none focus:border-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-xl hover:bg-blue-600 transition-colors"
          onClick={handleSubmit}
        >
          Send
        </button>
      </form>
    </footer>
  )
}

export default MessageInput