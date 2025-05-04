import React from 'react'
import MessageList from './MessageList'

function ChatInterface({ username, activeConversation, messages, newMessage, setNewMessage, handleSendMessage }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Find the selected user's information
  const selectedUserInfo = activeConversation ? { id: activeConversation } : null;

  return (
    <div className="flex flex-col h-full flex-1 bg-white">
      {selectedUserInfo ? (
        <>
          <header className="bg-blue-500 text-white p-4 shadow-md">
            <h1 className="text-xl font-bold">{selectedUserInfo.name || 'Chat'}</h1>
            <p className="text-sm">Chatting with user ID: {selectedUserInfo.id}</p>
          </header>
          
          <div className="flex-1 overflow-y-auto bg-gray-100">
            <MessageList messages={messages} username={username} />
          </div>
          
          <footer className="p-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 border-2 border-gray-300 p-2 rounded-l-xl focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-xl hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </form>
          </footer>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <div className="text-blue-500 mb-4">
              <svg className="w-16 h-16 mx-auto" viewBox="0 0 36 36" fill="currentColor">
                <path d="M18 0C8.059 0 0 7.314 0 16.5c0 5.252 2.682 9.903 6.9 12.895v6.329l6.293-3.494c1.488.413 3.115.77 4.807.77 9.941 0 18-7.314 18-16.5S27.941 0 18 0zm1.996 22.015l-4.705-5.011-9.196 5.011 10.121-10.816 4.705 5.011 9.196-5.011-10.121 10.816z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Select a conversation</h2>
            <p className="text-gray-600">
              Choose a user from the sidebar to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatInterface