import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from 'sonner';
import { Tabs, TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';
import  ExercisesForm from "./ExercisesForm";
import  QuizzesForm  from "./QuizzesForm";

function LessonForm({ 
  courseData, 
  currentLesson, 
  updateCurrentLesson, 
  lessonManagement,
  handleCloudinaryUpload 
}) {
  const {
    selectedChapterId,
    setSelectedChapterId,
    isEditing,
    handleAddLesson,
    handleUpdateLesson,
    resetForm
  } = lessonManagement;
  console.log(courseData.chapters[0]._id)
    const [activeTab, setActiveTab] = useState("content");
  // Handle lesson changes
  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    updateCurrentLesson({
      [name]: value
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">{isEditing ? 'Edit Lesson' : 'Add New Lesson'}</h3>
      
      <div className="space-y-2">
        <Label htmlFor="chapterSelect">Select Chapter</Label>
        <Select 
          value={selectedChapterId} 
          onValueChange={(value) => {
            setSelectedChapterId(value);
          }}
          disabled={isEditing}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a chapter" />
          </SelectTrigger>
          <SelectContent>
            {courseData.chapters.map(chapter => (
              <SelectItem key={chapter._id} value={chapter._id.toString()}>
                {chapter.order}. {chapter.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lessonTitle">Lesson Title</Label>
        <Input 
          id="lessonTitle" 
          name="title" 
          value={currentLesson.title} 
          onChange={handleLessonChange} 
          placeholder="e.g. Introduction to Variables"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lessonDescription">Description</Label>
        <Textarea 
          id="lessonDescription" 
          name="description" 
          value={currentLesson.description} 
          onChange={handleLessonChange} 
          placeholder="Brief description of this lesson"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lessonOrder">Order</Label>
          <Input 
            id="lessonOrder" 
            name="order" 
            type="number" 
            min="1"
            value={currentLesson.order} 
            onChange={handleLessonChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
          <Input 
            id="estimatedTime" 
            name="estimatedTime" 
            type="number" 
            min="1"
            value={currentLesson.estimatedTime} 
            onChange={handleLessonChange} 
          />
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="lessonContent">Lesson Content</Label>
            <div className="space-y-4">
              <Select 
                value={currentLesson.contentType || 'text'}
                onValueChange={(value) => updateCurrentLesson({ contentType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
             
      <div className="space-y-2">
        {(!currentLesson.contentType || currentLesson.contentType === 'text') && (
          <div className="space-y-2">
            <Textarea 
              id="lessonContent" 
              name="content" 
              value={currentLesson.content} 
              onChange={handleLessonChange} 
              placeholder="The main content of your lesson"
              rows={6}
            />
          </div>
        )}
        {currentLesson.contentType === 'video' && (
          <div className="space-y-2">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                {currentLesson.cloudinaryUrl ? (
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Video uploaded to Cloudinary</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateCurrentLesson({ 
                          cloudinaryUrl: null, 
                          cloudinaryPublicId: null,
                          content: '',
                          previewUrl: null
                        })}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="aspect-video w-full bg-black rounded-md overflow-hidden">
                      {currentLesson.cloudinaryUrl && (
                        <video 
                          src={currentLesson.cloudinaryUrl} 
                          controls 
                          className="w-full h-full"
                        />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          navigator.clipboard.writeText(currentLesson.cloudinaryUrl);
                          toast.success("URL copied to clipboard");
                        }}
                      >
                        Copy URL
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          window.open(currentLesson.cloudinaryUrl, '_blank');
                        }}
                      >
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                ) : currentLesson.previewUrl ? (
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Video Preview</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateCurrentLesson({ 
                          previewUrl: null,
                          selectedFile: null
                        })}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="aspect-video w-full bg-black rounded-md overflow-hidden">
                      <video 
                        src={currentLesson.previewUrl} 
                        controls 
                        className="w-full h-full"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center w-full">
                      <Button 
                        onClick={() => {
                          if (currentLesson.selectedFile) {
                            handleCloudinaryUpload(currentLesson.selectedFile);
                          } else {
                            toast.error("No file selected");
                          }
                        }}
                      >
                        Upload Video
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-2">
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                      <path d="M12 12v9"></path>
                      <path d="m16 16-4-4-4 4"></path>
                    </svg>
                    <p className="text-sm text-muted-foreground mb-2">Upload video</p>
                    <Input 
                      id="cloudinaryUpload" 
                      type="file" 
                      accept="video/*"
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const previewUrl = URL.createObjectURL(file);
                          updateCurrentLesson({
                            previewUrl,
                            selectedFile: file
                          });
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('cloudinaryUpload').click()}
                    >
                      Select Video
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Preview your video before uploading</p>
                  </>
                )}
              </div>
              
              {currentLesson.uploadProgress > 0 && currentLesson.uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Uploading to Cloudinary...</span>
                    <span>{currentLesson.uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${currentLesson.uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
          </div>
        </TabsContent>
        <TabsContent value="exercises" className="space-y-4 mt-4">
          <ExercisesForm 
            currentLesson={currentLesson}
            updateCurrentLesson={updateCurrentLesson}
            handleCloudinaryUpload={handleCloudinaryUpload}
          />
        </TabsContent>
        
        <TabsContent value="quizzes" className="space-y-4 mt-4">
          <QuizzesForm 
            currentLesson={currentLesson}
            updateCurrentLesson={updateCurrentLesson}
          />
        </TabsContent>
        </Tabs>
      
     
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          onClick={isEditing ? handleUpdateLesson : handleAddLesson} 
          className={isEditing ? "w-1/2" : "w-full"}
        >
          {isEditing ? (
            <Save className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isEditing ? 'Save Changes' : 'Add Lesson'}
        </Button>
        
        {isEditing && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm} 
            className="w-1/2"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

export default LessonForm;