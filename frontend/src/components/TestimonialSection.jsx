import React from 'react'
import TestimonialCard from './TestimonialCard'
function TestimonialSection() {
    const testimonials = [
        {
            name: 'John Doe',
            rating: 5,
            testimonial: 'Lorem ipsum dolor sit amet, consectnim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore deserunt mollit anim id est laborum.'
        },
        {
            name: 'Jane Doe',
            rating: 4,
            testimonial: 'Lorem ipsum dolor sit amet, consectnim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore deserunt mollit anim id est laborum.'
        },
        {
            name: 'John Doe',
            rating: 5,
            testimonial: ', consectnim ad minim veniam,  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore deserunt mollit anim id est laborum.'
        },
    ]
  return (
    <div>
        <div className='px-4 sm:px-8 md:px-10 lg:px-12 mt-10 flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center justify-center w-full max-w-[500px] text-center'>
                <div className='text-primary font-primary bg-primary/20 mb-4 text-sm sm:text-base font-bold rounded-full px-4 py-2 w-fit'>
                    Testimonials
                </div>
                <h1 className='text-2xl sm:text-3xl font-bold font-primary text-copy'>What Our <span className='text-primary'>Students Say</span></h1>
                <p className='text-copy-lighter text-base sm:text-sm mt-2 px-2 sm:px-0'>Don't just take our word for it. Hear from some of our successful students who have transformed their lives through our platform.</p>
            </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 '>
            {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
            ))}
        </div>

    </div>
  )
}

export default TestimonialSection