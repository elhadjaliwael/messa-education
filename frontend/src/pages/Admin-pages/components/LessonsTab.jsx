import React from 'react';
import LessonForm from './LessonForm';
import ResourceForm from './ResourceForm';
import LessonsList from './LessonsList';
import { useLessonManagement } from '@/hooks/useLessonManagement';
import { useResourceManagement } from '@/hooks/useResourceManagement';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import useCourseStore from '@/store/courseStore';

function LessonsTab() {
  const { courseData, currentLesson, updateCurrentLesson } = useCourseStore();
  
  const lessonManagement = useLessonManagement();
  const resourceManagement = useResourceManagement();
  const { uploadToCloudinary } = useCloudinaryUpload();

  const handleCloudinaryUpload = async (file) => {
    const result = await uploadToCloudinary(file, (progress) => {
      updateCurrentLesson({ uploadProgress: progress });
    });

    if (result) {
      updateCurrentLesson({
        cloudinaryUrl: result.url,
        cloudinaryPublicId: result.publicId,
        uploadComplete: true,
        previewUrl: result.url
      });
    }
  };

  return (
    <div className="space-y-6">
      <LessonForm 
        courseData={courseData}
        currentLesson={currentLesson}
        updateCurrentLesson={updateCurrentLesson}
        lessonManagement={lessonManagement}
        handleCloudinaryUpload={handleCloudinaryUpload}
      />
      
      <ResourceForm 
        currentLesson={currentLesson}
        currentResource={resourceManagement.currentResource}
        updateCurrentResource={resourceManagement.updateCurrentResource}
        handleResourceChange={resourceManagement.handleResourceChange}
        handleAddResource={resourceManagement.handleAddResource}
        removeResource={resourceManagement.removeResource}
      />
      
      <LessonsList 
        selectedChapterId={lessonManagement.selectedChapterId}
        courseData={courseData}
        getChapterLessons={lessonManagement.getChapterLessons}
        handleEditLesson={lessonManagement.handleEditLesson}
        handleRemoveLesson={lessonManagement.handleRemoveLesson}
      />
    </div>
  );
}

export default LessonsTab;