import React from 'react'

function LoginForm({ onLogin }) {
  function formAction(formData) {
    const { username } = Object.fromEntries(formData)
    onLogin(username)
  }

  return (
    <form action={formAction} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Welcome to Chat App</h2>
      <input 
        type='text' 
        className='border-2 border-gray-300 mb-4 p-2 rounded-xl w-full focus:border-blue-500 focus:outline-none' 
        placeholder='Enter your username' 
        name="username" 
      />
      <button 
        type="submit" 
        className='bg-blue-500 text-white py-2 px-4 rounded-xl w-full hover:bg-blue-600 transition-colors'
      >
        Login
      </button>
    </form>
  )
}

export default LoginForm