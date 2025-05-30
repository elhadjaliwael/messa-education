import React, { useState, useEffect } from 'react'

function Hamburger() {
    const [open,setOpen] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [hasRendered, setHasRendered] = useState(false)

    useEffect(() => {
        setHasRendered(true)
    }, [])

    useEffect(() => {
        if (!open && hasRendered) {
            setIsAnimating(true)
            const timer = setTimeout(() => {
                setIsAnimating(false)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [open])

    function handleMenu(){
        setOpen(!open)
    }
  return (
    <div className='ml-3 md:hidden ' >
        <button onClick={handleMenu} className='cursor-pointer'>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="var(--color-copy)" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-menu"
            >
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
        </button>
        {
            (open || isAnimating) && (
            
                    <ul className={` transform ${hasRendered ? (open ? 'menu-enter' : 'menu-exit') : ''} flex flex-col justify-evenly items-left absolute inset-x-4 bg-primary-light w-[calc(100%-2rem)] rounded-xl mt-4 shadow-lg border border-gray-100/20 backdrop-blur-sm`}>
                        <li className='pr-4 pl-4 py-3 m-2 rounded-2xl font-primary text-primary-content hover:bg-primary-dark transition-colors duration-200 font-light' >
                            <a href="/home" className='block'>Home</a>
                        </li>
                        <li className='pr-4 pl-4 py-3 m-2 rounded-2xl font-primary text-primary-content hover:bg-primary-dark transition-colors duration-200 font-light' >
                            <a href="/home" className='block'>About</a>
                        </li>
                        <li className='pr-4 pl-4 py-3 m-2 rounded-2xl font-primary text-primary-content hover:bg-primary-dark transition-colors duration-200 font-light' >
                            <a href="/home" className=' block'>Pricing</a>
                        </li>
                        <li className='pr-4 pl-4 py-3 m-2 rounded-2xl font-primary text-primary-content hover:bg-primary-dark transition-colors duration-200 font-light border-b last:border-b-0' >
                            <a href="/home" className=' block'>Contact</a>
                        </li>
                    </ul>
            )
        }
    </div>
  )
}

export default Hamburger