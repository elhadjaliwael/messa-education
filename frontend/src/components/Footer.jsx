import React from 'react'
import facebook from '../assets/facebook.png'
import instagram from '../assets/instagram.png'
import linkedin from '../assets/linkedin.png'
function Footer() {
  return (
    <div className='bg-primary mt-45 py-8 sm:py-10 px-4 sm:px-8 md:px-10 lg:px-12 flex justify-evenly '>
      <div className='flex flex-col justify-between'>
        <div>
          <h1 className='text-primary-foreground font-primary font-bold' style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>Messa Academy</h1>
          <div className='flex gap-3 sm:gap-4 mt-2'>
            <a href=""><img src={facebook}  className="w-4 sm:w-5 h-4 sm:h-5 hover:scale-110 transition-all duration-300" alt="facebook" /></a>
            <a href=""><img src={instagram} className="w-4 sm:w-5 h-4 sm:h-5 hover:scale-110 transition-all duration-300" alt="instagram" /></a>
            <a href=""><img src={linkedin}  className="w-4 sm:w-5 h-4 sm:h-5 hover:scale-110 transition-all duration-300" alt="linkedin" /></a>
          </div>
        </div>
        <div className='mt-6 sm:mt-10'>
            <p className='text-primary-foreground font-primary' style={{ fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)' }}>
              Copyright © 2025 Messa Academy. All rights reserved.
            </p>
        </div>
      </div>
      <div>
        <h1 className='text-primary-foreground font-primary font-bold' style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>Quick Links</h1>
        <ul className='flex flex-col gap-1 sm:gap-2 text-primary-foreground font-primary mt-3 sm:mt-5' style={{ fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)' }}>
          <li>Home</li>
          <li>About</li>
          <li>Courses</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <h1 className='text-primary-foreground font-primary font-bold' style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>Contact Us</h1>
        <ul className='flex flex-col gap-1 sm:gap-2 text-primary-foreground font-primary mt-3 sm:mt-5' style={{ fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)' }}>
          <li>Email: info@messaacademy.com</li>
          <li>Phone: +123 456 7890</li>
          <li>Address: 123 Main St, Anytown, USA</li>
        </ul>
      </div>
        <div>
          <h1 className='text-primary-foreground font-primary font-bold' style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>Legal Information</h1>
          <ul className='flex flex-col gap-1 sm:gap-2 text-primary-foreground font-primary mt-3 sm:mt-5' style={{ fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)' }}>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
    </div>
  )
}

export default Footer