import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { axiosPrivate } from '@/api/axios';
import BasicInfo from './BasicInfo';
import ChaptersForm from './ChaptersForm';
import ContentForm from './ContentForm';
import ReviewForm from './ReviewForm';

function AddCourse() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Course state
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    slug: '',
    classLevel: '',
    isPublished: false,
    chapters: []
  });
  
  // Current chapter being edited
  const [currentChapter, setCurrentChapter] = useState({
    title: '',
    description: '',
    order: 1,
    lessons: [],
    exercises: [],
    quizzes: []
  });
  
  // Current lesson being edited
  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    description: '',
    order: 1,
    estimatedTime: 30,
    content: '',
    resources: []
  });
  
  // Current resource being edited
  const [currentResource, setCurrentResource] = useState({
    title: '',
    url: '',
    type: 'pdf'
  });
  
  // Handle basic course info changes
  const handleCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData({
      ...courseData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle chapter changes
  const handleChapterChange = (e) => {
    const { name, value } = e.target;
    setCurrentChapter({
      ...currentChapter,
      [name]: value
    });
  };
  
  // Handle lesson changes
  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setCurrentLesson({
      ...currentLesson,
      [name]: value
    });
  };
  
  // Handle resource changes
  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setCurrentResource({
      ...currentResource,
      [name]: value
    });
  };
  
  // Add chapter to course
  const addChapter = () => {
    if (!currentChapter.title) {
      toast.error("Chapter title is required");
      return;
    }
    
    setCourseData({
      ...courseData,
      chapters: [...courseData.chapters, { ...currentChapter, id: Date.now() }]
    });
    
    // Reset current chapter
    setCurrentChapter({
      title: '',
      description: '',
      order: courseData.chapters.length + 1,
      lessons: [],
      exercises: [],
      quizzes: []
    });
    
    toast.success("Chapter added successfully");
  };
  
  // Add lesson to current chapter
  const addLesson = (chapterId) => {
    if (!currentLesson.title) {
      toast.error("Lesson title is required");
      return;
    }
    
    const updatedChapters = courseData.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          lessons: [...chapter.lessons, { ...currentLesson, id: Date.now() }]
        };
      }
      return chapter;
    });
    
    setCourseData({
      ...courseData,
      chapters: updatedChapters
    });
    
    // Reset current lesson
    setCurrentLesson({
      title: '',
      description: '',
      order: 1,
      estimatedTime: 30,
      content: '',
      resources: []
    });
    
    toast.success("Lesson added successfully");
  };
  
  // Add resource to current lesson
  const addResource = () => {
    if (!currentResource.title || !currentResource.url) {
      toast.error("Resource title and URL are required");
      return;
    }
    
    setCurrentLesson({
      ...currentLesson,
      resources: [...currentLesson.resources, { ...currentResource, id: Date.now() }]
    });
    
    // Reset current resource
    setCurrentResource({
      title: '',
      url: '',
      type: 'pdf'
    });
  };
  
  // Remove chapter
  const removeChapter = (chapterId) => {
    setCourseData({
      ...courseData,
      chapters: courseData.chapters.filter(chapter => chapter.id !== chapterId)
    });
    
    toast.success("Chapter removed successfully");
  };
  
  // Remove lesson
  const removeLesson = (chapterId, lessonId) => {
    const updatedChapters = courseData.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          lessons: chapter.lessons.filter(lesson => lesson.id !== lessonId)
        };
      }
      return chapter;
    });
    
    setCourseData({
      ...courseData,
      chapters: updatedChapters
    });
    
    toast.success("Lesson removed successfully");
  };
  
  // Remove resource
  const removeResource = (resourceId) => {
    setCurrentLesson({
      ...currentLesson,
      resources: currentLesson.resources.filter(resource => resource.id !== resourceId)
    });
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStep === 1 && (!courseData.name || !courseData.classLevel)) {
      toast.error("Course name and class level are required");
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
      const response = await axiosPrivate.post('/api/subjects', courseData);
      toast.success("Course created successfully");
      
      // Reset form or redirect
      setCourseData({
        name: '',
        description: '',
        slug: '',
        classLevel: '',
        isPublished: false,
        chapters: []
      });
      setCurrentStep(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate slug from name
  const generateSlug = () => {
    const slug = courseData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setCourseData({
      ...courseData,
      slug
    });
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
      {currentStep === 1 && (
        <BasicInfo 
          courseData={courseData} 
          setCourseData={setCourseData} 
          nextStep={nextStep} 
          handleCourseChange={handleCourseChange} 
          generateSlug={generateSlug}
        />
      )}
      
      {/* Step 2: Chapters */}
      {currentStep === 2 && (
        <ChaptersForm 
          courseData={courseData}
          currentChapter={currentChapter}
          handleChapterChange={handleChapterChange}
          addChapter={addChapter}
          removeChapter={removeChapter}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      )}
      
      {/* Step 3: Content (Lessons, Exercises, Quizzes) */}
      {currentStep === 3 && (
        <ContentForm 
          courseData={courseData}
          currentLesson={currentLesson}
          currentResource={currentResource}
          handleLessonChange={handleLessonChange}
          handleResourceChange={handleResourceChange}
          addLesson={addLesson}
          addResource={addResource}
          removeResource={removeResource}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      )}
      
      {/* Step 4: Review */}
      {currentStep === 4 && (
        <ReviewForm 
          courseData={courseData}
          prevStep={prevStep}
          submitCourse={submitCourse}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default AddCourse;