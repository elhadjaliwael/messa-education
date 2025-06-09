import { useState } from 'react';
import { toast } from 'sonner';
import useCourseStore from '@/store/courseStore';

export const useLessonManagement = () => {
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  
  const { 
    courseData, 
    currentLesson, 
    updateCurrentLesson,
    addLesson,
    removeLesson
  } = useCourseStore();

  const validateLesson = () => {
    if (!selectedChapterId) {
      toast.error("Please select a chapter");
      return false;
    }
    if (!currentLesson.title) {
      toast.error("Lesson title is required");
      return false;
    }
    return true;
  };

  const handleAddLesson = () => {
    if (!validateLesson()) return;
    addLesson(selectedChapterId);
    toast.success("Lesson added successfully");
  };

  const handleEditLesson = (selectedChapterId,lesson) => {
    console.log("lesson", lesson)
    setIsEditing(true);
    setEditingLessonId(lesson._id);
    setSelectedChapterId(selectedChapterId);
    
    updateCurrentLesson({
      ...lesson,
      uploadProgress: 0,
      uploadComplete: lesson.cloudinaryUrl ? true : false,
      previewUrl: lesson.cloudinaryUrl || null,
      selectedFile: null
    });
    
    toast.info(`Editing lesson: ${lesson.title}`);
  };

  const handleUpdateLesson = () => {
    if (!validateLesson()) return;
    
    const chapterIndex = courseData.chapters.findIndex(
      chapter => chapter._id === selectedChapterId
    );
    
    if (chapterIndex === -1) {
      toast.error("Chapter not found");
      return;
    }

    const lessonIndex = courseData.chapters[chapterIndex].lessons.findIndex(
      lesson => lesson._id === editingLessonId
    );

    if (lessonIndex === -1) {
      toast.error("Lesson not found");
      return;
    }

    const updatedChapters = [...courseData.chapters];
    updatedChapters[chapterIndex].lessons[lessonIndex] = {
      ...currentLesson,
      id: editingLessonId
    };

    useCourseStore.getState().updateCourseData({
      ...courseData,
      chapters: updatedChapters
    });

    resetForm();
    toast.success("Lesson updated successfully");
  };

  const resetForm = () => {
    updateCurrentLesson({
      title: '',
      description: '',
      order: 1,
      estimatedTime: 30,
      content: '',
      resources: [],
      exercises: [],
      quizzes: [],
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

  const handleRemoveLesson = (chapterId, lessonId) => {
    removeLesson(chapterId, lessonId);
    toast.success("Removed successfully");
  };

  const getChapterLessons = () => {
    if (!selectedChapterId) return [];
    const selectedChapter = courseData.chapters.find(
      chapter => chapter._id === selectedChapterId
    );
    return selectedChapter ? selectedChapter.lessons || [] : [];
  };

  return {
    selectedChapterId,
    setSelectedChapterId,
    isEditing,
    editingLessonId,
    handleAddLesson,
    handleEditLesson,
    handleUpdateLesson,
    handleRemoveLesson,
    resetForm,
    getChapterLessons
  };
};