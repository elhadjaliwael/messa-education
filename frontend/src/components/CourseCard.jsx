import React from 'react'
import Star from '../assets/star.png'
import LessonIcon from '../assets/lesson.png'
import ExerciceIcon from '../assets/assignment.png'
import I from './I'
import { Link } from 'react-router'
function CourseCard({level,subject,rating,reviews,students,lessons,exercices}) {
  return (
    <div className='w-full border-2 border-border h-auto bg-foreground rounded-2xl my-2 hover:scale-102 hover:drop-shadow-lg transition-all duration-300 ease-in-out'>
        <div className='relative'>
            <img src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" className='rounded-tl-2xl w-full rounded-tr-2xl h-[180px] object-cover' alt="image" />
            <span className='absolute bottom-2 left-4 bg-primary w-[80px] h-[30px] font-primary text-[12px] rounded-[13px] flex justify-center items-center text-primary-content'>{level}</span>
        </div>
        <div className='p-[20px]'>
            <div className='flex justify-between items-center'>
                <div className='flex'>
                    <img src={Star} className='w-4 h-4 mr-2' alt="start icon" />
                    <span className='font-bold font-primary text-[14px] text-copy'>{rating +"  "}<span className='text-[14px] font-light font-primary text-copy-lighter'>({reviews} reviews)</span></span>
                </div>
                <span className='font-primary text-[14px] text-copy-lighter'>{students} Student</span>
            </div>
            <div>
                <h1 className='font-bold font-primary text-copy text-2xl mt-4'>{subject}</h1>
            </div>
            <div className='mt-6 flex'>
                <div className='flex items-center mr-4'>
                    <I src={LessonIcon} className='w-7 mr-2' alt="lesson icon" />
                    <span className='font-primary text-[14px] text-copy-light'>{lessons} Lessons</span>
                </div>
                <div className='flex items-center mr-4'>
                    <I src={ExerciceIcon} className='w-7 mr-2' alt="lesson icon" />
                    <span className='font-primary text-[14px] text-copy-light'>{exercices} Exercices</span>
                </div>
            </div>
            <div className='mt-8'>
                <Link to="/login"><button className='mt-4 w-[140px] h-[40px] text-primary-content cursor-pointer text-base bg-primary rounded-2xl font-primary'>Get Started</button></Link>
            </div>
        </div>
    </div>
  )
}
 
export default CourseCard