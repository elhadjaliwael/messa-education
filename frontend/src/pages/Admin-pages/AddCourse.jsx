import React, { useState } from 'react';
import {toast} from 'sonner';
import { axiosPrivate } from '@/api/axios';
import BasicInfo from './BasicInfo';
import ChaptersForm from './ChaptersForm';
import ContentForm from './ContentForm';
import ReviewForm from './ReviewForm';
import useCourseStore from '@/store/courseStore';

function AddCourse() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get only what we need from the store for this component
  const courseData = useCourseStore(state => state.courseData);
  const resetCourseData = useCourseStore(state => state.resetCourseData);
  
  // Navigate to next step with validation
  const nextStep = () => {
    if (currentStep === 1 && (!courseData.subject || !courseData.classLevel)) {
      toast.error("Subject and class level are required");
      return;
    }
    
    if (currentStep === 2 && courseData.chapters.length === 0) {
      toast.error("Add at least one chapter before proceeding");
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Submit the course
  const submitCourse = async () => {
    setIsSubmitting(true);
    
    try {
      // Create each chapter directly (no need to create course first)
      for (const chapter of courseData.chapters) {
        // Create chapter with all course data included
        const chapterResponse = await axiosPrivate.post('/courses', {
          title: chapter.title,
          description: chapter.description,
          order: chapter.order,
          subject: courseData.subject,
          isPublished: courseData.isPublished,
          classLevel: courseData.classLevel,
          difficulty: courseData.difficulty
        });
        
        const chapterId = chapterResponse.data.chapterId;
        
        // Create lessons for each chapter
        for (const lesson of chapter.lessons) {
          await axiosPrivate.post(`/courses/${chapterId}/lessons`, {
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
            estimatedTime: lesson.estimatedTime,
            content: lesson.content,
            contentType: lesson.contentType,
            cloudinaryUrl: lesson.cloudinaryUrl,
            isNew : true,
            cloudinaryPublicId: lesson.cloudinaryPublicId,
            exercises: lesson.exercises || [],
            quizzes: lesson.quizzes || [],
            resources: lesson.resources || []
          });
        }
      }
      
      toast.success("Chapters created successfully");
      // Reset form and go back to step 1
      resetCourseData();
      setCurrentStep(1);
    } catch (error) {
      console.error("Error creating chapters:", error);
      toast.error(error.response?.data?.message || "Failed to create chapters");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Course</h1>
        <p className="text-muted-foreground">Create a new course with chapters, lessons, and resources</p>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-primary bg-primary text-white' : 'border-muted'}`}>
              1
            </div>
            <span className="mt-2">Basic Info</span>
          </div>
          <div className={`flex-1 border-t-2 self-center ${currentStep >= 2 ? 'border-primary' : 'border-muted'}`}></div>
          <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-primary bg-primary text-white' : 'border-muted'}`}>
              2
            </div>
            <span className="mt-2">Chapters</span>
          </div>
          <div className={`flex-1 border-t-2 self-center ${currentStep >= 3 ? 'border-primary' : 'border-muted'}`}></div>
          <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-primary bg-primary text-white' : 'border-muted'}`}>
              3
            </div>
            <span className="mt-2">Content</span>
          </div>
          <div className={`flex-1 border-t-2 self-center ${currentStep >= 4 ? 'border-primary' : 'border-muted'}`}></div>
          <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 4 ? 'border-primary bg-primary text-white' : 'border-muted'}`}>
              4
            </div>
            <span className="mt-2">Review</span>
          </div>
        </div>
      </div>
      
      {/* Step 1: Basic Course Information */}
      {currentStep === 1 && <BasicInfo nextStep={nextStep} />}
      
      {/* Step 2: Chapters */}
      {currentStep === 2 && <ChaptersForm prevStep={prevStep} nextStep={nextStep} />}
      
      {/* Step 3: Content (Lessons, Exercises, Quizzes) */}
      {currentStep === 3 && <ContentForm prevStep={prevStep} nextStep={nextStep} />}
      
      {/* Step 4: Review */}
      {currentStep === 4 && <ReviewForm prevStep={prevStep} submitCourse={submitCourse} isSubmitting={isSubmitting} />}
    </div>
  );
}

export default AddCourse;