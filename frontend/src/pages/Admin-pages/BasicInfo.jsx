import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import { classes } from '@/data/tunisian-education';
import useCourseStore from '@/store/courseStore';
import useAuth from '@/hooks/useAuth';
function BasicInfo({ nextStep }) {
  // Get state and actions from the store
  const auth = useAuth();
  const courseData = useCourseStore(state => state.courseData);
  const updateCourseData = useCourseStore(state => state.updateCourseData);
  // Handle input changes
  const handleCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(type, checked)
    updateCourseData({
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Information</CardTitle>
        <CardDescription>Enter the basic details about your course</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form content */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="classLevel">Class Level</Label>
            <Select 
              value={courseData.classLevel}
              onValueChange={(value) => updateCourseData({ classLevel: value, subject: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class level" />
              </SelectTrigger>
              <SelectContent>
                {
                  Object.keys(classes).map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select 
              value={courseData.subject}
              onValueChange={(value) => updateCourseData({ subject: value })}
              disabled={!courseData.classLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder={courseData.classLevel ? "Select subject" : "First select a class level"} />
              </SelectTrigger>
              <SelectContent>
                {
                  courseData.classLevel && 
                    classes[courseData.classLevel].map((subject) => (
                      <SelectItem key={subject.name} value={subject.name}>{subject.name}</SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select 
                value={courseData.difficulty}
                onValueChange={(value) => updateCourseData({ difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {auth.user.role === "admin" && 
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={courseData.isPublished}
                onChange={handleCourseChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isPublished">Publish this course immediately</Label>
            </div>
          }
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={nextStep}>
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BasicInfo;