import React from 'react';
import useCourseStore from '@/store/courseStore';
import {toast} from 'sonner';
import { useState } from 'react';
import axios from 'axios';
import LessonForm from './LessonForm';
import ResourceForm from './ResourceForm';
import LessonsList from './LessonsList';

const CLOUDINARY_CLOUD_NAME="dc6hczfu5"
const CLOUDINARY_UPLOAD_PRESET="messa_education"
function LessonsTab() {
  // Get state and actions from the store
  const courseData = useCourseStore(state => state.courseData);
  const currentLesson = useCourseStore(state => state.currentLesson);
  const updateCurrentLesson = useCourseStore(state => state.updateCurrentLesson);
  const currentResource = useCourseStore(state => state.currentResource);
  const updateCurrentResource = useCourseStore(state => state.updateCurrentResource);
  const addLesson = useCourseStore(state => state.addLesson);
  const addResource = useCourseStore(state => state.addResource);
  const removeResource = useCourseStore(state => state.removeResource);
  const removeLesson = useCourseStore(state => state.removeLesson);
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  
  // Handle video upload to Cloudinary
  const handleCloudinaryUpload = async (file) => {
    if (!file) return;
    
    try {
      // Initialize progress tracking
      updateCurrentLesson({ 
        uploadProgress: 0, 
        uploadComplete: false 
      });
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      // Make the upload request with axios
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentComplete = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            updateCurrentLesson({ uploadProgress: percentComplete });
          }
        }
      );
      
      // Update lesson with Cloudinary data
      updateCurrentLesson({
        cloudinaryUrl: response.data.secure_url,
        cloudinaryPublicId: response.data.public_id,
        content: response.data.secure_url,
        uploadProgress: 100,
        uploadComplete: true
      });
      
      toast.success('Video uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload video: ' + (error.response?.data?.message || error.message));
      console.error('Cloudinary upload error:', error);
    }
  };
  // Handle resource changes
  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    updateCurrentResource({
      [name]: value
    });
  };
  
  const handleEditLesson = (lesson) => {
    // Find which chapter contains this lesson
    const chapterInfo = courseData.chapters.find(chapter => chapter.lessons.some(l => l.id === lesson.id));
    
    if (!chapterInfo) {
      toast.error("Could not find the chapter for this lesson");
      return;
    }
    
    // Set the selected chapter ID
    setSelectedChapterId(chapterInfo.id);
    setIsEditing(true);
    setEditingLessonId(lesson.id);
    
    // Update the current lesson with all the lesson data
    updateCurrentLesson({
      ...lesson,
      contentType: lesson.contentType || (lesson.cloudinaryUrl ? 'videoUpload' : 'text'),
      cloudinaryUrl: lesson.cloudinaryUrl || null,
      cloudinaryPublicId: lesson.cloudinaryPublicId || null,
      uploadProgress: 0,
      uploadComplete: lesson.cloudinaryUrl ? true : false,
      // Reset preview fields since we're editing an existing lesson
      previewUrl: lesson.cloudinaryUrl || null,
      selectedFile: null
    });
    
    // Scroll to the lesson form
    document.querySelector('.grid.grid-cols-1.gap-4.border.p-4.rounded-md')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    toast.info(`Editing lesson: ${lesson.title}`);
  };
  
  const handleRemoveLesson = (chapterId, lessonId) => {
    removeLesson(chapterId, lessonId);
    toast.success("Removed successfully");
  };
  
  // Add a function to handle updating an existing lesson
  const handleUpdateLesson = () => {
    if (!selectedChapterId) {
      toast.error("Please select a chapter");
      return;
    }
    
    if (!currentLesson.title) {
      toast.error("Lesson title is required");
      return;
    }
    
    // Find the chapter that contains this lesson
    const chapterIndex = courseData.chapters.findIndex(chapter => chapter.id === selectedChapterId);
    if (chapterIndex === -1) {
      toast.error("Chapter not found");
      return;
    }
    
    // Find the lesson index within the chapter
    const lessonIndex = courseData.chapters[chapterIndex].lessons.findIndex(
      lesson => lesson.id === editingLessonId
    );
    
    if (lessonIndex === -1) {
      toast.error("Lesson not found");
      return;
    }
    
    // Create updated chapters array with the modified lesson
    const updatedChapters = [...courseData.chapters];
    updatedChapters[chapterIndex].lessons[lessonIndex] = {
      ...currentLesson,
      id: editingLessonId // Ensure we keep the same ID
    };
    
    // Update the course data with the modified chapters
    useCourseStore.getState().updateCourseData({
      ...courseData,
      chapters: updatedChapters
    });
    
    // Reset the form and editing state
    resetForm();
    toast.success("Lesson updated successfully");
  };
  
  // Function to reset the form
  const resetForm = () => {
    updateCurrentLesson({
      title: '',
      description: '',
      order: 1,
      estimatedTime: 30,
      content: '',
      resources: [],
      exercises: [], // Initialize exercises array
      quizzes: [],   // Initialize quizzes array
      contentType: 'text',
      cloudinaryUrl: null,
      cloudinaryPublicId: null,
      uploadProgress: 0,
      uploadComplete: false,
      previewUrl: null,
      selectedFile: null
    });
    setIsEditing(false);
    setEditingLessonId(null);
  };

  // Add lesson validation wrapper
  const handleAddLesson = () => {
    if (!selectedChapterId) {
      toast.error("Please select a chapter");
      return;
    }
    
    if (!currentLesson.title) {
      toast.error("Lesson title is required");
      return;
    }
    
    addLesson(selectedChapterId);
    toast.success("Lesson added successfully");
  };

  // Get lessons for the selected chapter
  const getChapterLessons = () => {
    if (!selectedChapterId) return [];
    
    const selectedChapter = courseData.chapters.find(chapter => chapter.id === selectedChapterId);
    return selectedChapter ? selectedChapter.lessons || [] : [];
  };

  // Add resource validation wrapper
  const handleAddResource = () => {
    if (!currentResource.title || !currentResource.url) {
      toast.error("Resource title and URL are required");
      return;
    }
    
    addResource();
    toast.success("Resource added successfully");
  };

  return (
    <div className="space-y-6">
      <LessonForm 
        courseData={courseData}
        currentLesson={currentLesson}
        updateCurrentLesson={updateCurrentLesson}
        selectedChapterId={selectedChapterId}
        setSelectedChapterId={setSelectedChapterId}
        isEditing={isEditing}
        handleAddLesson={handleAddLesson}
        handleUpdateLesson={handleUpdateLesson}
        resetForm={resetForm}
        handleCloudinaryUpload={handleCloudinaryUpload}
      />
      
      <ResourceForm 
        currentLesson={currentLesson}
        currentResource={currentResource}
        updateCurrentResource={updateCurrentResource}
        handleResourceChange={handleResourceChange}
        handleAddResource={handleAddResource}
        removeResource={removeResource}
      />
      
      <LessonsList 
        selectedChapterId={selectedChapterId}
        courseData={courseData}
        getChapterLessons={getChapterLessons}
        handleEditLesson={handleEditLesson}
        handleRemoveLesson={handleRemoveLesson}
      />
    </div>
  );
}

export default LessonsTab;
