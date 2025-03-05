import React from 'react'
import LoginForm from './LoginForm'
function Login() {
  return (
    <div className='w-full h-screen bg-background overflow-hidden'>
        <div className='w-full h-screen bg-background px-8 md:px-10 lg:px-12 drop-shadow-2xl'>
            <div className='w-full h-full flex items-center justify-center'>
                <div className='w-[400px] h-[500px] bg-foreground rounded-2xl'>
                    <h1 className='text-xl text-center text-primary font-primary mt-6 font-bold'>Login</h1>
                    <LoginForm></LoginForm>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Login