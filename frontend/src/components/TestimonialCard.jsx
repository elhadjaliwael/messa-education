import React from 'react'
import Avatar from '../assets/gamer.png'
import I from './I'
import quote from '../assets/quote.png'
import star from '../assets/star.png'
function TestimonialCard({name, rating, testimonial}) {
  return (
    <div className='w-full h-auto bg-foreground rounded-2xl my-2'>
        <div className='p-4 sm:p-6'>
          <I src={quote} className='w-8 sm:w-10 h-8 sm:h-10'></I>
        </div>
        <div className='px-4 sm:px-6 min-h-[100px]'>
          <p className='text-sm sm:text-base text-gray-500 line-clamp-4'>{testimonial}</p>
        </div>
        <div className='border-t-2 border-border w-[90%] mx-auto my-4 sm:m-6'></div>
        <div className='flex items-center p-4 sm:p-6'>
          <img src={Avatar} className='w-12 sm:w-16 rounded-full object-cover' alt="" />
          <div className='ml-4 sm:ml-7'>
            <h1 className='text-lg sm:text-xl font-bold text-copy'>{name}</h1>
            <div className='flex mt-2 sm:mt-4'>
              {[...Array(rating)].map((_, i) => (
                <img key={i} src={star} className='w-4 sm:w-5 h-4 sm:h-5 mr-1' alt="" />
              ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default TestimonialCard