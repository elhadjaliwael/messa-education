import React from 'react';
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizzesForm from "./QuizzesForm.jsx";
import ExercisesForm from "./ExercisesForm.jsx";
import useCourseStore from '@/store/courseStore.js';

const LessonEditDialog = ({ 
  open, 
  onOpenChange, 
  lesson, 
  onSave, 
  contentTypeOptions = ['Video', 'Text', 'Exercise', 'Quiz'],
  atab = "basic"  // Add default value
}) => {

  const { updateCurrentLesson, currentLesson } = useCourseStore();
  const [activeTab, setActiveTab] = useState(atab || "basic");
  useEffect(() => {
    if (atab) {
      setActiveTab(atab);
    }
  }, [atab]);
  
  // Initialize the store with lesson data when dialog opens
  useEffect(() => {
    if (lesson && open) {
      const lessonData = {
        ...lesson,
        exercises: lesson.exercises || [],
        quizzes: lesson.quizzes || []
      };
      updateCurrentLesson(lessonData);
    }
  }, [lesson, open, updateCurrentLesson]);

  const handleInputChange = (field, value) => {
    const updatedLesson = {
      ...currentLesson,
      [field]: value
    };
    updateCurrentLesson(updatedLesson);
  };

  const handleSave = () => {
    // Create a clean copy of the lesson without __v field
    const lessonToSave = { ...currentLesson };
    
    // Remove the __v field if it exists to avoid version conflicts
    if (lessonToSave.__v !== undefined) {
      delete lessonToSave.__v;
    }
    
    // Clean up IDs from quizzes using the same pattern as AddCourse.jsx
    if (lessonToSave.quizzes && lessonToSave.quizzes.length > 0) {
      console.log("waaaa quizz")
      lessonToSave.quizzes = lessonToSave.quizzes.map(({ _id, id, ...quiz }) => ({
        ...quiz,
        questions: (quiz.questions || []).map(({ _id, id, ...question }) => ({
          ...question,
          options: (question.options || []).map(({ _id, id, ...option }) => option)
        }))
      }));
    }
    
    onSave(lessonToSave);
  };

  // Update current lesson from child components
  const updateCurrentLessonLocal = (updates) => {
    const updatedLesson = {
      ...currentLesson,
      ...updates
    };
    updateCurrentLesson(updatedLesson);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson Content</DialogTitle>
          <DialogDescription>
            Manage all aspects of your lesson including exercises and quizzes.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            {currentLesson && (
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lessonTitle" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="lessonTitle"
                    value={currentLesson.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lessonDescription" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="lessonDescription"
                    value={currentLesson.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contentType" className="text-right">
                    Content Type
                  </Label>
                  <Select
                    value={currentLesson.contentType || ''}
                    onValueChange={(value) => handleInputChange('contentType', value)}
                  >
                    <SelectTrigger id="contentType" className="col-span-3">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypeOptions.map(option => (
                        <SelectItem key={option} value={option.toLowerCase()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Content Display Area */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="lessonContent" className="text-right pt-2">
                    Content
                  </Label>
                  <div className="col-span-3">
                    {currentLesson.contentType === 'video' && (
                      <div className="space-y-2">
                        <Input
                          placeholder="Video URL"
                          value={currentLesson.videoUrl || ''}
                          onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                        />
                        
                        {/* File Upload Section - Show when no URL is provided */}
                        {!currentLesson.videoUrl && (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 text-center">or</div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const videoUrl = URL.createObjectURL(file);
                                    handleInputChange('videoFile', file);
                                    handleInputChange('videoPreviewUrl', videoUrl);
                                  }
                                }}
                                className="hidden"
                                id="video-upload"
                              />
                              <label 
                                htmlFor="video-upload" 
                                className="cursor-pointer flex flex-col items-center space-y-2"
                              >
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                  </svg>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-700">Upload a video file</p>
                                  <p className="text-xs text-gray-500">MP4, WebM, or OGV up to 100MB</p>
                                </div>
                              </label>
                            </div>
                          </div>
                        )}
                        
                        {/* Video Preview */}
                        {(currentLesson.videoUrl || currentLesson.videoPreviewUrl) && (
                          <div className="mt-2 p-2 border rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Video Preview:</span>
                              {currentLesson.videoPreviewUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    handleInputChange('videoFile', null);
                                    handleInputChange('videoPreviewUrl', null);
                                    if (currentLesson.videoPreviewUrl) {
                                      URL.revokeObjectURL(currentLesson.videoPreviewUrl);
                                    }
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                            <video 
                              src={currentLesson.videoUrl || currentLesson.videoPreviewUrl} 
                              controls 
                              className="w-full max-h-48"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {currentLesson.contentType === 'text' && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Enter lesson text content..."
                          value={currentLesson.textContent || ''}
                          onChange={(e) => handleInputChange('textContent', e.target.value)}
                          className="min-h-32"
                        />
                        {currentLesson.textContent && (
                          <div className="mt-2 p-3 border rounded bg-gray-50">
                            <h4 className="text-sm font-medium mb-2">Preview:</h4>
                            <div className="text-sm whitespace-pre-wrap">
                              {currentLesson.textContent}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {(currentLesson.contentType === 'exercise' || currentLesson.contentType === 'quiz') && (
                      <div className="p-3 border rounded bg-blue-50">
                        <p className="text-sm text-blue-700">
                          {currentLesson.contentType === 'exercise' 
                            ? 'Exercise content is managed in the "Exercises" tab above.' 
                            : 'Quiz content is managed in the "Quizzes" tab above.'}
                        </p>
                      </div>
                    )}
                    
                    {!currentLesson.contentType && (
                      <div className="p-3 border rounded bg-gray-50">
                        <p className="text-sm text-gray-500">
                          Select a content type above to add lesson content.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lessonTime" className="text-right">
                    Time (min)
                  </Label>
                  <Input
                    id="lessonTime"
                    type="number"
                    value={currentLesson.estimatedTime || 0}
                    onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value) || 0)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lessonOrder" className="text-right">
                    Order
                  </Label>
                  <Input
                    id="lessonOrder"
                    type="number"
                    value={currentLesson.order || 1}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="exercises">
            <ExercisesForm/>
          </TabsContent>

          <TabsContent value="quizzes">
            <QuizzesForm 
              currentLesson={currentLesson} 
              updateCurrentLesson={updateCurrentLessonLocal} 
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonEditDialog;