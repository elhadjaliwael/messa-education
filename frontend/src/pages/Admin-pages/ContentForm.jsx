import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

function ContentForm({
  courseData,
  currentLesson,
  currentResource,
  handleLessonChange,
  handleResourceChange,
  addLesson,
  addResource,
  removeResource,
  prevStep,
  nextStep
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
        <CardDescription>Add lessons, exercises, and quizzes to your chapters</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lessons">
          <TabsList className="mb-4">
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lessons" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 border p-4 rounded-md">
              <h3 className="text-lg font-medium">Add New Lesson</h3>
              
              <div className="space-y-2">
                <Label htmlFor="chapterSelect">Select Chapter</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseData.chapters.map(chapter => (
                      <SelectItem key={chapter.id} value={chapter.id.toString()}>
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
              
              <div className="space-y-2">
                <Label htmlFor="lessonContent">Lesson Content</Label>
                <Textarea 
                  id="lessonContent" 
                  name="content" 
                  value={currentLesson.content} 
                  onChange={handleLessonChange} 
                  placeholder="The main content of your lesson"
                  rows={6}
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Resources</h4>
                
                <div className="grid grid-cols-1 gap-4 border p-4 rounded-md">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resourceTitle">Title</Label>
                      <Input 
                        id="resourceTitle" 
                        name="title" 
                        value={currentResource.title} 
                        onChange={handleResourceChange} 
                        placeholder="e.g. Worksheet"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resourceUrl">URL</Label>
                      <Input 
                        id="resourceUrl" 
                        name="url" 
                        value={currentResource.url} 
                        onChange={handleResourceChange} 
                        placeholder="https://example.com/resource"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resourceType">Type</Label>
                      <Select 
                        value={currentResource.type}
                        onValueChange={(value) => setCurrentResource({...currentResource, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="link">External Link</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button type="button" onClick={addResource} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </div>
                
                {currentLesson.resources.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Added Resources</h5>
                    <div className="space-y-2">
                      {currentLesson.resources.map(resource => (
                        <div key={resource.id} className="flex justify-between items-center p-2 border rounded-md">
                          <div>
                            <span className="font-medium">{resource.title}</span>
                            <span className="text-sm text-muted-foreground ml-2">({resource.type})</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeResource(resource.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button type="button" onClick={() => addLesson(1)} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Lesson
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="exercises" className="space-y-6">
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">Exercise creation will be implemented in the next phase.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="quizzes" className="space-y-6">
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">Quiz creation will be implemented in the next phase.</p>
            </div>
          </TabsContent>
        </Tabs>
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

export default ContentForm;