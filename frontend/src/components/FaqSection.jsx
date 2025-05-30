import React from 'react'
import Faq from './Faq'
function FaqSection() {
  const faqs = [
    {
      question: 'What is this?',
      answer: 'This is a question'
    },
    {
      question: 'What is this?',
      answer: 'This is a question'
    },
    {
      question: 'What is this?',
      answer: 'This is a question'
    }
  ]
  return (
    <div className='mt-10'>
      <div className='flex flex-col items-center justify-center'>
        <div className='text-primary font-primary bg-primary/20 mb-4 text-sm sm:text-base font-bold rounded-full px-4 py-2 w-fit'>
          <p>FAQs</p>
        </div>
        <h2 className='text-foreground font-primary text-xl sm:text-2xl md:text-3xl font-bold text-center'>Frequently Asked <span className='text-primary'>Questions</span></h2>
        <p className='text-muted-foreground text-base sm:text-base text-center mt-1 sm:mt-2 px-4 sm:px-0'>
          If you have any questions, please feel free to contact us.
        </p>
      </div>
      <div>
        {faqs.map((faq) => (
          <Faq key={faq.question} question={faq.question} answer={faq.answer}></Faq>
        ))}
      </div>
    </div>
  )
}

export default FaqSection