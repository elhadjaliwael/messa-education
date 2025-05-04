import React from 'react'
import SignUpForm from './SignUpForm'
function SignUp() {
  return (
    <div>
        <div className='w-full h-screen bg-background overflow-hidden'>
            <div className='w-full h-full flex items-center justify-center'>
                <div className='w-[400px] bg-card rounded-2xl'>
                    <h1 className='text-xl text-center text-primary font-primary mt-6 font-bold'>Sign Up</h1>
                    <SignUpForm></SignUpForm>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignUp