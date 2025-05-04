import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, CheckCircle } from "lucide-react";

function ReviewForm({ courseData, prevStep, submitCourse, isSubmitting }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Course</CardTitle>
        <CardDescription>Review your course details before submitting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-lg font-medium">Course Information</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Course Name</p>
              <p className="font-medium">{courseData.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Class Level</p>
              <p className="font-medium">{courseData.classLevel.replace(/_/g, ' ')}</p>
            </div>
            
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{courseData.description || 'No description provided'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">URL Slug</p>
              <p className="font-mono text-sm">{courseData.slug}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p>{courseData.isPublished ? 'Published' : 'Draft'}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-lg font-medium">Chapters ({courseData.chapters.length})</h3>
          </div>
          
          {courseData.chapters.length === 0 ? (
            <p className="text-muted-foreground">No chapters added</p>
          ) : (
            <div className="space-y-4">
              {courseData.chapters.map((chapter) => (
                <div key={chapter.id} className="border rounded-md p-4">
                  <h4 className="font-medium">{chapter.order}. {chapter.title}</h4>
                  <p className="text-sm text-muted-foreground">{chapter.description || 'No description'}</p>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium">Content:</p>
                    <p className="text-sm text-muted-foreground">
                      {chapter.lessons.length} lessons, 
                      {chapter.exercises.length} exercises, 
                      {chapter.quizzes.length} quizzes
                    </p>
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
        <Button onClick={submitCourse} disabled={isSubmitting}>
          {isSubmitting ? (
            <>Submitting...</>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Create Course
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ReviewForm;