import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useCourseStore = create((set) => ({
  courseData: {
    // Keep these fields as they'll now be part of each chapter
    subject: '',
    classLevel: '',
    difficulty: '',
    isPublished: false,
    chapters: [],
    slug: ''
  },
  
  currentChapter: {
    title: '',
    description: '',
    order: 1,
    lessons: [],
    // Add course fields to chapter
    subject: '',
    classLevel: '',
    difficulty: 'beginner',
    isPublished: false,
  },
  
  currentLesson: {
    title: '',
    description: '',
    order: 1,
    estimatedTime: 30,
    content: '',
    resources: [],
    exercises: [],
    quizzes: [],
    // Cloudinary fields
    contentType: 'text',
    cloudinaryUrl: null,
    cloudinaryPublicId: null,
    uploadProgress: 0,
    uploadComplete: false,
    previewUrl: null,
    selectedFile: null
  },
  
  currentResource: {
    title: '',
    url: '',
    type: 'pdf'
  },
  
  // Course data actions
  updateCourseData: (data) => set((state) => ({
    courseData: { ...state.courseData, ...data }
  })),
  
  resetCourseData: () => set({
    courseData: {
      subject: '',
      classLevel: '',
      difficulty: '',
      isPublished: false,
      chapters: [],
      slug: ''
    },
    currentChapter: {
      title: '',
      description: '',
      order: 1,
      lessons: [],
    },
    currentLesson: {
      title: '',
      description: '',
      order: 1,
      estimatedTime: 30,
      content: '',
      resources: [],
      contentType: 'text',
      cloudinaryUrl: null,
      cloudinaryPublicId: null,
      uploadProgress: 0,
      uploadComplete: false,
      previewUrl: null,
      selectedFile: null,
      exercises: [],
      quizzes: [],
    },
    currentResource: {
      title: '',
      url: '',
      type: 'pdf'
    }
  }),
  
  // Chapter actions
  updateCurrentChapter: (data) => set((state) => ({
    currentChapter: { ...state.currentChapter, ...data }
  })),
  
  addChapter: () => set((state) => {
    const newChapter = {
      id: uuidv4(),
      ...state.currentChapter
    };
    
    return {
      courseData: {
        ...state.courseData,
        chapters: [...state.courseData.chapters, newChapter]
      },
      currentChapter: {
        title: '',
        description: '',
        order: state.courseData.chapters.length + 1,
        lessons: [],
      }
    };
  }),
  
  removeChapter: (chapterId) => set((state) => ({
    courseData: {
      ...state.courseData,
      chapters: state.courseData.chapters.filter(chapter => chapter.id !== chapterId)
    }
  })),
  
  // Lesson actions
  updateCurrentLesson: (data) => set((state) => ({
    currentLesson: { ...state.currentLesson, ...data }
  })),

  addLesson: (chapterId) => set((state) => {
    const newLesson = {
      id: uuidv4(),
      ...state.currentLesson
    };
    
    const updatedChapters = state.courseData.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          lessons: [...chapter.lessons, newLesson]
        };
      }
      return chapter;
    });
    
    return {
      courseData: {
        ...state.courseData,
        chapters: updatedChapters
      },
      currentLesson: {
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
      }
    };
  }),
  
  removeLesson: (chapterId, lessonId) => set((state) => {
    const updatedChapters = state.courseData.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          lessons: chapter.lessons.filter(lesson => lesson.id !== lessonId)
        };
      }
      return chapter;
    });
    
    return {
      courseData: {
        ...state.courseData,
        chapters: updatedChapters
      }
    };
  }),
  
  // Resource actions
  updateCurrentResource: (data) => set((state) => ({
    currentResource: { ...state.currentResource, ...data }
  })),
  
  addResource: () => set((state) => ({
    currentLesson: {
      ...state.currentLesson,
      resources: [...state.currentLesson.resources, { 
        id: uuidv4(),
        ...state.currentResource 
      }]
    },
    currentResource: {
      title: '',
      url: '',
      type: 'pdf'
    }
  })),
  
  removeResource: (resourceId) => set((state) => ({
    currentLesson: {
      ...state.currentLesson,
      resources: state.currentLesson.resources.filter(resource => resource.id !== resourceId)
    }
  }))
}));

export default useCourseStore;