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
import { ArrowLeft, Clock, FileText, CheckSquare, Edit, Trash2, Save, X,BookOpen,PlusCircle } from 'lucide-react';
import {classes} from '@/data/tunisian-education.js'
import LessonEditDialog from './components/LessonEditDialog';
import  useAuth  from '@/hooks/useAuth';
function CourseViewPage() {
  const {auth} = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [atab, setAtab] = useState('basic');
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

  const handleDeleteChapter = async () => {
    try {
      await axiosPrivate.delete(`/courses/${id}`);
      navigate('/admin/courses');
    } catch (err) {
      console.error('Error deleting chapter:', err);
    }
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
          onClick={() => navigate(`/${auth.user.role}/courses`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{course.subject}</h1>
        <Badge variant={course.isPublished ? "default" : "secondary"}>
          {course.isPublished ? 'Published' : 'Draft'}
        </Badge>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${auth.user.role === 'admin' ? 'md:grid-cols-3' : ''}`}>
        {/* Course Overview Card */}
        <Card className={auth.user.role === 'admin' ? 'md:col-span-2' : ''}>
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
        {
          auth.user.role === 'admin' &&
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
                    handleDeleteChapter()
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Course
                </Button>
              </div>
            </CardContent>
          </Card>

        }
      </div>

      {/* Course Content */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Chapter Content
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                Manage lessons, exercises, and resources
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
              {course.lessons?.length || 0} Lessons
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {course.lessons?.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {course.lessons?.map((lesson, lessonIndex) => (
                <AccordionItem 
                  key={lesson._id} 
                  value={`lesson-${lessonIndex}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                          {lesson.order || lessonIndex + 1}
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                            >
                              {lesson.contentType || 'Lesson'}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.estimatedTime || 0} min
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      {/* Lesson Description */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {lesson.description || 'No description available'}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-4 h-8 px-3 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentLesson(lesson);
                              setIsLessonDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>

                      {/* Lesson Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center">
                          <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                            {lesson.exercises?.length || 0}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Exercises</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 text-center">
                          <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                            {lesson.quizzes?.length || 0}
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Quizzes</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 text-center">
                          <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                            {lesson.resources?.length || 0}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-medium">Resources</div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-4 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentLesson(lesson);
                              setIsLessonDialogOpen(true);
                              setAtab("exercises")
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                            Add Exercise
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-4 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentLesson(lesson);
                              setIsLessonDialogOpen(true);
                              setAtab("quizzes")
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                            Add Quiz
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentLesson(lesson);
                              setIsLessonDialogOpen(true);
                              setAtab("resources")
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                            Add Resource
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
              <p className="text-gray-500 mb-4">Start building your course by adding lessons</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add First Lesson
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Lesson Edit Dialog */}
      <LessonEditDialog 
        open={isLessonDialogOpen}
        onOpenChange={setIsLessonDialogOpen}
        lesson={currentLesson}
        onSave={handleSaveLesson}
        contentTypeOptions={['Video', 'Text']}
        atab={atab}
      />
    </div>
  );
}

export default CourseViewPage;