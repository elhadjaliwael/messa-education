import React from 'react'

function ChatHeader({ username }) {
  return (
    <header className="bg-blue-500 text-white p-4 shadow-md">
      <h1 className="text-xl font-bold">Chat App</h1>
      <p className="text-sm">Logged in as: {username}</p>
    </header>
  )
}

export default ChatHeader