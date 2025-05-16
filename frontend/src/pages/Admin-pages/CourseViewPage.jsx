import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosPrivate } from '@/api/axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, FileText, CheckSquare, Edit, Trash2, Save, X } from 'lucide-react';
import {classes} from '@/data/tunisian-education.js'
import LessonEditDialog from './components/LessonEditDialog';

function CourseViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  console.log(course)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  // Add state for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // Add state for edited course data
  const [editedCourse, setEditedCourse] = useState(null);
  // Add state for lesson dialog
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  
  // Define available options
  const difficultyOptions = ['beginner', 'intermediate', 'advanced'];
  const classLevelOptions = Object.keys(classes); // Assuming classes is an object with class levels as key

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/courses/${id}`);
        
        if (response.data) {
          // Store the course data
          const courseData = response.data.chapter;
          
          // Log the data to see its structure
          console.log("API response:", courseData);
          
          setCourse(courseData);
          // Initialize edited course with the same data
          setEditedCourse({
            ...courseData,
            // Ensure these fields exist with default values if they don't
            subject: courseData.subject || '',
            classLevel: courseData.classLevel || '',
            difficulty: courseData.difficulty || 'beginner'
          });
          setSubjectOptions(classes[courseData.classLevel] || []);
        } else {
          setError('Chapter data structure is invalid');
        }
      } catch (err) {
        console.error('Error fetching chapter details:', err);
        setError('Failed to load chapter details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handlePublishToggle = async () => {
    try {
      await axiosPrivate.patch(`/courses/${course._id}/toggle-publish/`);
      setCourse((prevCourse) => ({ ...prevCourse, isPublished: !prevCourse.isPublished }));
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  // Add function to handle input changes
  const handleInputChange = (field, value) => {
    if(field === 'classLevel') {// Update the subject options based on the selected class level
      const newSubjectOptions = classes[value] || [];
      setSubjectOptions(newSubjectOptions);
    }
    setEditedCourse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add function to save changes
  const handleSaveChanges = async () => {
    try {
      const response = await axiosPrivate.put(`/courses/${id}`, {
        subject: editedCourse.subject,
        classLevel: editedCourse.classLevel,
        difficulty: editedCourse.difficulty,
      });
      
      if (response.data) {
        setCourse(response.data.chapter);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating course:', err);
    }
  };

  // Add function to cancel editing
  const handleCancelEdit = () => {
    setEditedCourse(course);
    setIsEditing(false);
  };

  // Add function to handle lesson save
  const handleSaveLesson = async (updatedLesson) => {
    try {
      console.log(updatedLesson)
      const response = await axiosPrivate.put(`/courses/${id}/lessons/${updatedLesson._id}`, updatedLesson);
      
      if (response.data) {
        // Update the lesson in the course state
        setCourse(prevCourse => ({
          ...prevCourse,
          lessons: prevCourse.lessons.map(lesson => 
            lesson._id === updatedLesson._id ? updatedLesson : lesson
          )
        }));
        setIsLessonDialogOpen(false);
      }
    } catch (err) {
      console.error('Error updating lesson:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/courses')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{course.subject}</h1>
        <Badge variant={course.isPublished ? "default" : "secondary"}>
          {course.isPublished ? 'Published' : 'Draft'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>Detailed information about this course</CardDescription>
            </div>
            {isEditing ? (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSaveChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Info
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  // Editable fields
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select 
                        value={editedCourse.subject || ''} 
                        onValueChange={(value) => handleInputChange('subject', value)}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectOptions.map(option => (
                            <SelectItem key={option.name} value={option.name}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classLevel">Grade Level</Label>
                      <Select 
                        value={editedCourse.classLevel || ''} 
                        onValueChange={(value) => handleInputChange('classLevel', value)}
                      >
                        <SelectTrigger id="classLevel">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {classLevelOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select 
                        value={editedCourse.difficulty || 'beginner'} 
                        onValueChange={(value) => handleInputChange('difficulty', value)}
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                      <p className="text-lg font-medium">{new Date(course.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </>
                ) : (
                  // Read-only fields
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                      <p className="text-lg font-medium">{course.subject}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Grade Level</h3>
                      <p className="text-lg font-medium">{course.classLevel}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Difficulty</h3>
                      <p className="text-lg font-medium capitalize">{course.difficulty}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                      <p className="text-lg font-medium">{new Date(course.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors">
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Lessons</p>
                  <p className="text-xl font-semibold">{course.lessonsCount || 0}</p>
                </div>
                
                <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors">
                  <div className="bg-amber-100 p-3 rounded-full mb-3">
                    <CheckSquare className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Exercises & Quizzes</p>
                  <p className="text-xl font-semibold">{course.exercisesCount || 0}</p>
                </div>
                
                <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors">
                  <div className="bg-green-100 p-3 rounded-full mb-3">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Time</p>
                  <div className="flex items-baseline">
                    <p className="text-xl font-semibold">{course.totalTime || 0}</p>
                    <span className="text-sm ml-1 text-muted-foreground">min</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  handlePublishToggle()
      
                }}
              >
                {course.isPublished ? 'Unpublish Course' : 'Publish Course'}
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  // Handle delete
                  // You can reuse your handleDelete function here
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Course
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Content */}
      <Card>
        <CardHeader>
          <CardTitle>Chapter Content</CardTitle>
          <CardDescription>Lessons in this chapter</CardDescription>
        </CardHeader>
        <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {course.lessons?.map((lesson, lessonIndex) => (
                  <AccordionItem key={lesson._id} value={`lesson-${lessonIndex}`}>
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{lesson.order || lessonIndex + 1}.</span>
                        {lesson.title}
                        <Badge variant="outline" className="ml-2">
                          {lesson.contentType || 'Lesson'}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-6 space-y-2">
                        <div className="p-3 border rounded-md hover:bg-muted/50">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {lesson.estimatedTime || 0} min
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Open the lesson edit dialog
                                  setCurrentLesson(lesson);
                                  setIsLessonDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span className="sr-only">Edit Lesson</span>
                              </Button>
                            </div>
                          </div>
                          
                          {/* Lesson content actions */}
                          <div className="mt-3 pt-2 border-t flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentLesson(lesson);
                                setIsLessonDialogOpen(true);
                               
                              }}
                            >
                              <span className="mr-1">+</span> Exercise
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentLesson(lesson);
                                setIsLessonDialogOpen(true);
                              }}
                            >
                              <span className="mr-1">+</span> Quiz
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentLesson(lesson);
                                setIsLessonDialogOpen(true);
                              }}
                            >
                              <span className="mr-1">+</span> Resource
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
        </CardContent>
      </Card>
      
      {/* Lesson Edit Dialog */}
      <LessonEditDialog 
        open={isLessonDialogOpen}
        onOpenChange={setIsLessonDialogOpen}
        lesson={currentLesson}
        onSave={handleSaveLesson}
        contentTypeOptions={['Video', 'Text']}
      />
    </div>
  );
}

export default CourseViewPage;