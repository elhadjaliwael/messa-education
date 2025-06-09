import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function LessonsList({ 
  selectedChapterId, 
  courseData, 
  getChapterLessons, 
  handleEditLesson, 
  handleRemoveLesson 
}) {
  console.log(getChapterLessons())
  return (
    <>
      {selectedChapterId && (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">
            Lessons for {courseData.chapters.find(c => c._id === selectedChapterId)?.title || 'Selected Chapter'}
          </h3>
          
          {getChapterLessons().length === 0 ? (
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">No lessons added yet for this chapter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getChapterLessons().map((lesson) => (
                <div key={lesson._id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{lesson.order}. {lesson.title}</h4>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <span className="mr-4">⏱️ {lesson.estimatedTime} min</span>
                        <span className="mr-4">📚 {lesson.resources?.length || 0} resources</span>
                        <span className="mr-4">📝 {lesson.exercises?.length || 0} exercises</span>
                        <span>📋 {lesson.quizzes?.length || 0} quizzes</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => {
                        handleEditLesson(selectedChapterId,lesson);
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        handleRemoveLesson(selectedChapterId, lesson._id); 
                      }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default LessonsList;