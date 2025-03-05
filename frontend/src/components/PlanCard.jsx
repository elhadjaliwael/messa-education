import React from 'react'
import checkIcon from '../assets/check.png'
import I from './I'
import { Link } from 'react-router'
function PlanCard({title, price, features, description, important}) {
  return (
    <div className={`bg-foreground rounded-2xl p-4 sm:p-6 flex flex-col items-center w-full max-w-[350px] h-[650px] my-15 ${important ? 'border-2 border-primary scale-105 sm:scale-110 drop-shadow-xl sm:drop-shadow-2xl' : ''}`}>
        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-primary font-primary font-bold text-center' style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>{title}</h1>
            <p className='text-copy font-primary font-medium my-3 sm:my-4' style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}>{price}</p>
            <p className='text-copy-lighter font-primary font-light text-center px-2' style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>{description}</p>
        </div>
        <div className='flex-1 p-2 sm:p-4 w-full flex flex-col items-start gap-2 overflow-y-auto'>
            {features.map((feature, index) => (
                <div key={index} className='flex items-start w-full'>
                    <I src={checkIcon} alt='check' className='w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 mt-1 flex-shrink-0'></I>
                    <p className='text-copy-lighter font-primary font-light flex-1' style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                        {feature}
                    </p>
                </div>
            ))}
        </div>
        <Link to='/login' className='w-full mt-4'>
            <button className='bg-primary cursor-pointer text-primary-content font-primary w-full h-[40px] sm:h-[48px] rounded-xl hover:opacity-90 transition-all duration-300' style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                Get Started
            </button>
        </Link>
    </div>
  )
}

export default PlanCard