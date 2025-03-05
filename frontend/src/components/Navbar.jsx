import React from 'react'
import ThemeIcon from './ThemeIcon'
import Hamburger from './Hamburger'
import { Link } from 'react-router'
function Navbar() {
    return (
        <div className='mt-5 flex justify-between items-center sticky'>
            <div className='flex justify-around items-center'>
                <h1 className='font-primary text-lg font-bold text-copy mr-4'><span className='text-primary'>Messa</span> Education</h1>
                <div className='hidden md:block'>
                    <ul className='flex justify-between items-center'>
                        <li className='pr-2 pl-2 font-primary text-copy  font-light' ><a href="/home" className='hover:text-primary-dark'>Home</a></li>
                        <li className='pr-2 pl-2 font-primary text-copy  font-light' ><a href="/home" className='hover:text-primary-dark'>About</a></li>
                        <li className='pr-2 pl-2 font-primary text-copy  font-light' ><a href="/home" className='hover:text-primary-dark'>Pricing</a></li>
                        <li className='pr-2 pl-2 font-primary text-copy  font-light' ><a href="/home" className='hover:text-primary-dark'>Contact</a></li>
                    </ul>
                </div>
            </div>
            <div className='flex items-center justify-between '>
                <ThemeIcon></ThemeIcon>
                <button className='mr-4 font-primary text-copy font-medium cursor-pointer hidden md:block'><Link to="/signup">Sign up</Link></button>
                <button className='bg-primary text-sm text-primary-content cursor-pointer w-[100px] h-[40px] rounded-4xl font-primary'><Link to="/login">Get Started</Link></button>
                <Hamburger></Hamburger>
            </div>
        </div>
  )
}

export default Navbar