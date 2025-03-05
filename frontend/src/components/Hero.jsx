import React from 'react'
import img from '../assets/main.svg'
import courseIcon from '../assets/course-icon.png'
import expertIcon from '../assets/expert.png'
import studentIcon from '../assets/student.png'
import I from './I'
import { Link } from 'react-router'
function Hero() {

  return (
    <main className='mt-10 overflow-hidden'>
        <div className='flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto'>
            <div className='flex flex-col max-w-xl w-full'>
                <div className='text-primary font-primary bg-primary/20 mb-4 text-base font-bold rounded-full px-4 py-2 w-fit'>
                    The Future of Online Education
                </div>
                <span className='font-primary text-5xl sm:text-6xl font-bold text-primary-dark md:text-5xl lg:text-8xl'>Learn Anytime, Anywhere.</span>
                <span className='mt-3 md:mt-4 font-primary font-medium text-lg sm:text-xl text-copy-lighter'>Access thousands of courses in various classes.</span>
                <p className='mt-3 md:mt-4 font-primary font-light text-base md:text-sm sm:text-lg lg:text-base text-copy'>Enjoy now online support lessons in all subjects and at different levels (primary, basic and secondary), starting from the fourth year of primary school to the baccalaureate</p>
                <Link to="/login"><button className='bg-primary text-base mt-4 text-primary-content cursor-pointer w-[180px] h-[48px] rounded-4xl font-primary hover:bg-primary/90 transition-colors'>Start Learning</button></Link>
            </div>
            <div className='relative mt-6 md:mt-0 w-full md:w-1/2'>
                <img 
                    className=' w-full mx-auto md:mx-0' 
                    src={img} 
                    alt="Learning illustration" 
                ></img>
                <div className='animate-float w-[150px] h-17 rounded-xl p-2 absolute bg-foreground border-2 border-border  drop-shadow-lg top-[120px] left-4'>
                    <p className='font-primary text-[14px] text-copy font-bold'>All Levels</p>
                    <p className='font-primary text-[10px] text-copy-lighter'>From Elementary to Baccalaureat</p>
                </div>
                <div className='animate-float w-[150px] h-12 rounded-xl p-2 absolute bg-foreground border-2 border-border  drop-shadow-lg bottom-[60px] right-4'>
                    <h1 className='font-primary text-[14px] text-copy'><span className='font-bold '>95%</span> Success Rate</h1>
                    <p className='font-primary text-[10px] text-copy-lighter'>Student satisfaction</p>
                </div>
            </div>
        </div>
        <div className='flex mt-7 flex-col md:flex-row items-center justify-center flex-wrap'>
            <div className='bg-foreground m-4 w-[250px] sm:w-[300px] md:w-[250px] flex flex-col justify-center items-center rounded-2xl p-4'>
                <I src={courseIcon}  className={"w-[60px]"}></I>
                <p className='font-primary text-primary font-bold text-2xl mt-1'>100+</p>
                <p className='font-primary text-copy mt-1'>Total Course</p>
            </div>
            <div className='bg-foreground m-4 w-[250px] sm:w-[300px] md:w-[250px] flex flex-col justify-center items-center rounded-2xl p-4'>
                <I src={expertIcon} className={"w-[60px]"} ></I>
                <p className='font-primary text-primary font-bold text-2xl mt-1'>50+</p>
                <p className='font-primary text-copy mt-1'>Expert Mentors</p>
            </div>
            <div className='bg-foreground m-4 w-[250px] sm:w-[300px] md:w-[250px] flex flex-col justify-center items-center rounded-2xl p-4'>
                <I src={studentIcon} className={"w-[60px]"}></I>
                <p className='font-primary text-primary font-bold text-2xl mt-1'>7000+</p>
                <p className='font-primary text-copy mt-1'>Students</p>
            </div>
        </div>
    </main>
  )
}

export default Hero