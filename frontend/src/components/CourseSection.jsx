import React from 'react'
import CourseCard from './CourseCard'
function CourseSection() {
    const courses = [
        {
            id:1,
            level : "Bac Math",
            subject : "Mathematique",
            rating : 4.9,
            reviews : 2000,
            students : 1000,
            lessons : 10,
            exercices : 20
        },
        {
            id:2,
            level : "Bac Math",
            subject : "Physique",
            rating : 4.9,
            reviews : 1569,
            students : 2032,
            lessons : 14,
            exercices : 25
        },
        {   
            id : 3,
            level : "Bac Info",
            subject : "Informatique",
            rating : 4.8,
            reviews : 155,
            students : 2005,
            lessons : 12,
            exercices : 30
        },
        
    ]

    
  return (
    <div className='py-17 px-10 mt-10 rounded-2xl bg-card'>
        <div className='text-primary font-primary bg-primary/20 mb-4 text-base font-bold rounded-full px-4 py-2 w-fit'>
            Featured Courses
        </div>
        <div>
            <h1 className='text-3xl font-bold font-primary text-foreground'>Expand Your <span className='text-primary'>Knowledge</span></h1>
            <p className='text-muted-foreground text-sm mt-2'>Browse our most popular courses and start your learning journey today with expert-led instruction.</p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
        {courses.map(c => (
            <CourseCard key={c.id} level={c.level} subject={c.subject} rating={c.rating} reviews={c.reviews} students={c.students} lessons={c.lessons} exercices={c.exercices}></CourseCard>
        ))}
        </div>
    </div>
  )
}

export default CourseSection