import React from 'react'
import { Link } from 'react-router'
import GoogleIcon from '../assets/google.png'
function SignUpForm() {
    function formAction(formData) {
        const data = Object.fromEntries(formData)
        //TODO: send data to backend using fetch
        console.log(data)
    }
  return (
    <div>
        <form action={formAction}>
            <div className='flex flex-col gap-2 m-5'>
                <input className='border-2 border-border rounded-xl p-2 placeholder:text-copy-lighter placeholder:font-light caret-copy text-copy' placeholder='Name' name="name" />
            </div>
            <div className='flex flex-col gap-2 m-5'>
                <input className='border-2 border-border rounded-xl p-2 placeholder:text-copy-lighter placeholder:font-light caret-copy text-copy' placeholder='Email' name="email" />
            </div>
            <div className='flex flex-col gap-2 m-5'>
                <input className='border-2 border-border rounded-xl p-2 placeholder:text-copy-lighter placeholder:font-light caret-copy text-copy' placeholder='Password' type="password" name="password" />
            </div>
            <button type="submit" className='cursor-pointer bg-primary m-5 text-primary-content font-primary font-medium w-[90%] h-[40px] rounded-xl'>Sign Up</button>
        </form>
        <div className='flex justify-center items-center'>
            <p className='font-primary text-copy font-light'>Already have an account? <Link to="/login"><span className='text-primary cursor-pointer'>Login</span></Link></p>
        </div>
        <div className='flex justify-center items-center mt-2'>
                <div className='w-[40%] h-[1px] bg-border'></div>
                <p className='font-primary text-copy font-light mx-2'>Or</p>
                <div className='w-[40%] h-[1px] bg-border'></div>
        </div>
        <button className='border-2 cursor-pointer border-border m-5 flex justify-center items-center text-copy font-primary font-medium w-[90%] h-[40px] rounded-xl'>
            <div className='flex justify-center items-center'>
                <img src={GoogleIcon} alt="Google Icon" className='w-6 h-6' />
                <p className='font-primary text-copy font-medium mx-2'>Login with Google</p>
            </div>
        </button>
    </div>
  )
}

export default SignUpForm