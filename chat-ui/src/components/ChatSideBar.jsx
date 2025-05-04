import React, { useState } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

function ChatSideBar({ onlineUsers,username, activeConversation, setSelectedUser, conversationHistory }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  console.log(onlineUsers)
  // Get unique users from both online users and conversation history
  const allUserIds = new Set([
    ...(onlineUsers || []).map(user => user.id),
    ...Object.keys(conversationHistory || {})
  ]);
  
  console.log(allUserIds)
  // Create a combined list of users with online status
  const allUsers = Array.from(allUserIds).map(userId => {
    const onlineUser = (onlineUsers || []).find(user => user.id === userId);
    const hasConversation = conversationHistory && conversationHistory[userId];
    
    // Get the last message for this conversation if it exists
    const lastMessage = hasConversation && conversationHistory[userId].length > 0
      ? conversationHistory[userId][conversationHistory[userId].length - 1]
      : null;
    
    return {
      id: userId,
      name: onlineUser ? onlineUser.username : `User ${userId}`,
      online: !!onlineUser,
      lastMessage: lastMessage ? lastMessage.text : '',
      lastMessageTime: lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''
    };
  });
  
  // Filter users based on search term
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 h-full flex flex-col border-r border-gray-200 bg-white">
      {/* Header section */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>
      
      {/* Search bar */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      {/* Users list */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                activeConversation === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.online ? 'bg-green-100' : 'bg-gray-200'}`}>
                  <FaUserCircle className={`w-10 h-10 ${user.online ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                  {user.lastMessageTime && (
                    <span className="text-xs text-gray-500">{user.lastMessageTime}</span>
                  )}
                </div>
                {user.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No matching users found' : 'No users available'}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSideBar;