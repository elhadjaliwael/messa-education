import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import CourseSection from './CourseSection'
import TestimonialSection from './TestimonialSection'
import FaqSection from './FaqSection'
import Footer from './Footer'
import PricingSection from './PricingSection'
function Home() {
  return (
    <>
        <div className='px-8 md:px-10 lg:px-12'>
            <Navbar></Navbar>
            <Hero></Hero>
            <CourseSection></CourseSection>
            <TestimonialSection></TestimonialSection>
            <PricingSection></PricingSection>
            <FaqSection></FaqSection>
        </div>
        <Footer></Footer>
    </>
  )
}

export default Home