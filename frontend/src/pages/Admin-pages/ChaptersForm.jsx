import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import useCourseStore from '@/store/courseStore';
import toast from 'react-hot-toast';

function ChaptersForm({ prevStep, nextStep }) {
  // Get state and actions from the store
  const courseData = useCourseStore(state => state.courseData);
  const currentChapter = useCourseStore(state => state.currentChapter);
  const updateCurrentChapter = useCourseStore(state => state.updateCurrentChapter);
  const addChapter = useCourseStore(state => state.addChapter);
  const removeChapter = useCourseStore(state => state.removeChapter);
  
  // Handle chapter changes
  const handleChapterChange = (e) => {
    const { name, value } = e.target;
    updateCurrentChapter({
      [name]: value
    });
  };
  
  // Add chapter validation wrapper
  const handleAddChapter = () => {
    if (!currentChapter.title) {
      toast.error("Chapter title is required");
      return;
    }
    
    addChapter();
    toast.success("Chapter added successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Chapters</CardTitle>
        <CardDescription>Add chapters to organize your course content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Add New Chapter</h3>
          <div className="space-y-2">
            <Label htmlFor="chapterTitle">Chapter Title</Label>
            <Input 
              id="chapterTitle" 
              name="title" 
              value={currentChapter.title} 
              onChange={handleChapterChange} 
              placeholder="e.g. Introduction to Algebra"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chapterDescription">Description</Label>
            <Textarea 
              id="chapterDescription" 
              name="description" 
              value={currentChapter.description} 
              onChange={handleChapterChange} 
              placeholder="Brief description of this chapter"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chapterOrder">Order</Label>
            <Input 
              id="chapterOrder" 
              name="order" 
              type="number" 
              min="1"
              value={currentChapter.order} 
              onChange={handleChapterChange} 
            />
          </div>
          
          <Button type="button" onClick={handleAddChapter} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Chapter
          </Button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Chapters ({courseData.chapters.length})</h3>
          
          {courseData.chapters.length === 0 ? (
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">No chapters added yet. Add your first chapter above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courseData.chapters.map((chapter) => (
                <div key={chapter.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{chapter.order}. {chapter.title}</h4>
                      <p className="text-sm text-muted-foreground">{chapter.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeChapter(chapter.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={nextStep}>
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ChaptersForm;