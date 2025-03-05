import React, { useState } from 'react'
import up from '../assets/up.png'
import down from '../assets/down.png'
import I from './I'
function Faq({question, answer}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='bg-foreground rounded-2xl p-3 sm:p-4 md:p-6 w-full mt-4 sm:mt-7 flex justify-between'>
      <div className='flex flex-col w-full'>
        <p className='text-copy font-primary text-base sm:text-lg font-bold'>{question}</p>
        {isOpen && (
          <>
            <div className='border-t border-border w-full my-2 sm:my-3'></div>
            <p className='text-copy-lighter text-sm sm:text-base'>{answer}</p>
          </>
        )}
      </div>
      <div className='ml-2 sm:ml-4 flex-shrink-0'>
        <button onClick={() => setIsOpen(!isOpen)}>
          <I src={isOpen ? up : down} className='w-5 h-5 sm:w-6 sm:h-6' alt='arrow'></I>
        </button>
      </div>
    </div>
  )
}

export default Faq