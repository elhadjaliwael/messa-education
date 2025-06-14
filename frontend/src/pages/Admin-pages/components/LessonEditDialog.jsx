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