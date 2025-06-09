import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, CheckCircle, Play, Award, ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Clock, HelpCircle, BookMarked, BarChart2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { axiosPrivate } from '@/api/axios'
import useAuth from '@/hooks/useAuth'


function CourseContent() {
  const { subject } = useParams();
  const {auth} = useAuth()
  const [progress, setProgress] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [progressData, setProgressData] = useState({ lessons: 0, exercises: 0, quizzes: 0,completedChapters : [],chapterProgress : []});

  // Add loadedChapters state
  const [loadedChapters, setLoadedChapters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const recordPage = async () => {
      try {
        await axiosPrivate.post('courses/analytics/track', {
          activityType: 'course_view',
          subject: subject,
        });
      } catch (err) {
        console.error('Error recording page view:', err);
      }
    };
    recordPage();
  },[])
  
  useEffect(() => {
    const getProgress = async () => {
      try {
        const response = await axiosPrivate.get(`courses/analytics/progress/${subject}`);
        if (response.data && typeof response.data.progress === 'number') {
          setProgress(response.data.progress);
          
          // If we have completed items data, calculate percentages based on chapters data
          if (response.data.completedLessons && chapters.length > 0) {
            // Count total items from chapters
            let totalLessons = 0;
            let totalExercises = 0;
            let totalQuizzes = 0;
            
            chapters.forEach(chapter => {
              totalLessons += chapter.lessonsCount || 0;
              totalExercises += chapter.exercisesCount || 0;
              totalQuizzes += chapter.quizzesCount || 0;
            });
            
            // Get completed counts
            const completedLessonsCount = response.data.completedLessons.length;
            const completedExercisesCount = response.data.completedExercises?.length || 0;
            const completedQuizzesCount = response.data.completedQuizzes?.length || 0;
            
            // Calculate percentages
            const lessonsPercentage = totalLessons > 0 
              ? Math.round((completedLessonsCount / totalLessons) * 100) 
              : 0;
              
            const exercisesPercentage = totalExercises > 0 
              ? Math.round((completedExercisesCount / totalExercises) * 100) 
              : 0;
              
            const quizzesPercentage = totalQuizzes > 0 
              ? Math.round((completedQuizzesCount / totalQuizzes) * 100) 
              : 0;
            
            setProgressData({
              completedChapters : response.data.completedChapters,
              lessons: lessonsPercentage,
              exercises: exercisesPercentage,
              quizzes: quizzesPercentage,
              chapterProgress: response.data.chapterProgress,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
      }
    };
    
    // Only fetch progress if we have a subject and chapters are loaded
    if (subject && chapters.length > 0) {
      getProgress();
    }
  }, [subject, chapters]);

  function handleLessonClick(chapterId, lessonId) {
    navigate(`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}`);
  }
  


  // Add fetchChapterLessons function
  const fetchChapterLessons = async (chapterId) => {
    // Skip if already loaded
    if (loadedChapters[chapterId]) return;
    
    try {
      const response = await axiosPrivate.get(`/courses/student/${chapterId}/lessons`);
      console.log("Fetched chapter data:", response.data);
      
      // Check for different possible response structures
      if (response.data) {
        let lessonsData = [];
        
        // Try to extract lessons from different possible response structures
        if (response.data.chapter && response.data.chapter.lessons) {
          lessonsData = response.data.chapter.lessons;
        } else if (response.data.lessons) {
          lessonsData = response.data.lessons;
        } else if (Array.isArray(response.data)) {
          lessonsData = response.data;
        }
        
        // Update the chapters array with the new data
        setChapters(prevChapters => 
          prevChapters.map(chapter => 
            chapter._id === chapterId 
              ? { ...chapter, lessons: lessonsData }
              : chapter
          )
        );
      }
      
      // Mark this chapter as loaded regardless of the response structure
      // This prevents infinite loading state
      setLoadedChapters(prev => ({ ...prev, [chapterId]: true }));
      
    } catch (err) {
      console.error("Error fetching chapter lessons:", err);
      // Even on error, mark as loaded to prevent infinite loading state
      setLoadedChapters(prev => ({ ...prev, [chapterId]: true }));
    }
  };

  // Add handleChapterExpand function
  const handleChapterExpand = (value) => {
    setExpandedChapter(value);
    
    // If a chapter is being expanded (not collapsed), fetch its lessons
    if (value) {
      const chapterId = value.replace('chapter-', '');
      fetchChapterLessons(chapterId);
    }
  };

  // Fetch chapters data - fix the API endpoint
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/courses/chapters/${subject}/${auth.user.level}`);
        
        if (response.data && response.data.chapters) {
          const chaptersData = response.data.chapters;
          setChapters(chaptersData);
          
          // Set the first chapter as expanded by default
          if (chaptersData.length > 0) {
            setExpandedChapter(`chapter-${chaptersData[0]._id}`);
            fetchChapterLessons(chaptersData[0]._id);
          }
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    
    fetchChapters();
  }, [subject, auth.user.level]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-full mb-8"></div>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Link to="/student/courses" className="text-primary hover:underline flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux cours
        </Link>
        <div className="text-center p-12">
          <h2 className="text-2xl font-semibold mb-2">Aucun chapitre disponible</h2>
          <p className="text-muted-foreground">Il n'y a pas encore de contenu pour ce sujet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Course Header */}
      <div className="mb-8">
        <Link to="/student/courses" className="text-primary hover:underline flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux cours
        </Link>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{subject.charAt(0).toUpperCase()+subject.slice(1)}</h1>
            <p className="text-muted-foreground mb-4">Cours de {subject} pour {auth.user.level.replace(/_/g, ' ')}</p>
            
            <div className="flex items-center mb-4">
              <Progress value={progress} className="h-2 w-48 mr-4" />
              <span className="text-sm font-medium">{progress}% complété</span>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4 shadow-sm w-full md:w-auto md:min-w-[250px]">
            <h3 className="font-medium mb-2">Informations du cours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Difficulté: {chapters[0]?.difficulty || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Durée estimée: {chapters.reduce((total, chapter) => total + (chapter.totalTime || 0), 0)} minutes</span>
              </div>
              <div className="flex items-center">
                <BookMarked className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Niveau: {auth.user.level}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="flex justify-center mb-1">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-bold">{progressData.lessons}%</div>
            <div className="text-xs text-muted-foreground">Leçons complétées</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="flex justify-center mb-1">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-bold">{progressData.exercises}%</div>
            <div className="text-xs text-muted-foreground">Exercices complétés</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="flex justify-center mb-1">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-bold">{progressData.quizzes}%</div>
            <div className="text-xs text-muted-foreground">Quiz complétés</div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Chapters Accordion */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Chapitres du cours</h2>
        <Accordion 
          type="single" 
          collapsible 
          className="w-full" 
          value={expandedChapter} 
          onValueChange={handleChapterExpand}
        >
          {chapters.map((chapter) => (
            <AccordionItem key={chapter._id} value={`chapter-${chapter._id}`} className="border rounded-lg mb-4 overflow-hidden">
              <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 rounded-t-lg">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center">
                    <span className="font-medium">{chapter.title}</span>
                    {progressData.completedChapters.includes(chapter._id) && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Complété
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Progress 
                      value={
                        progressData?.chapterProgress?.find(cp => cp.chapterId === chapter._id)?.progress || 0
                      } 
                      className="h-2 w-24 mr-2" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {progressData?.chapterProgress?.find(cp => cp.chapterId === chapter._id)?.progress || 0}%
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 bg-card/50">
                {!loadedChapters[chapter._id] ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <>
                    {chapter.description && (
                      <p className="text-sm text-muted-foreground mb-4">{chapter.description}</p>
                    )}
                
                    {/* Lessons section */}
                    <div className="mt-2">
                      <div className="flex items-center mb-4">
                        <BookOpen className="h-4 w-4 mr-2 text-primary" />
                        <h3 className="font-medium text-sm">Leçons ({chapter.lessonsCount || 0})</h3>
                      </div>
                      
                      <div className="space-y-2">
                        {chapter.lessons && chapter.lessons.length > 0 ? (
                          chapter.lessons.map((lesson) => (
                            <Card key={lesson._id} className={`${lesson.completed ? 'border-primary/20 bg-primary/5' : ''} hover:shadow-sm transition-shadow`}>
                              <CardHeader className="p-3">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <CardTitle className="text-sm">
                                      {lesson.title}
                                    </CardTitle>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge variant="outline" className="ml-2 text-xs">
                                            {lesson.contentType === "video" && "Vidéo"}
                                            {lesson.contentType === "text" && "Lecture"}
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Type de leçon: {lesson.contentType}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  {lesson.completed && (
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <CardDescription className="text-xs flex items-center">
                                  <Clock className="h-3 w-3 mr-1" /> Durée: {lesson.estimatedTime} min
                                </CardDescription>
                                {/* Statistics for exercises and quizzes */}
                                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                                  {(lesson.exercises && lesson.exercises.length > 0) && (
                                    <span className="flex items-center">
                                      <FileText className="h-3 w-3 mr-1" /> 
                                      {lesson.exercises.length} exercice{lesson.exercises.length > 1 ? 's' : ''}
                                    </span>
                                  )}
                                  {(lesson.quizzes && lesson.quizzes.length > 0) && (
                                    <span className="flex items-center">
                                      <Award className="h-3 w-3 mr-1" /> 
                                      {lesson.quizzes.length} quiz{lesson.quizzes.length > 1 ? 'zes' : ''}
                                    </span>
                                  )}
                                </div>
                              </CardHeader>
                              <CardFooter className="p-3 pt-0">
                                <Button 
                                  size="sm" 
                                  className="w-full text-xs" 
                                  onClick={() => handleLessonClick(chapter._id, lesson._id)} 
                                  variant={lesson.completed ? "outline" : "default"}
                                >
                                  {lesson.completed ? 'Revoir' : 'Commencer'}
                                  <Play className="h-3 w-3 ml-1" />
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center p-4 text-muted-foreground text-sm">
                            Aucune leçon disponible pour ce chapitre.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
            ))}
          </Accordion>
      </div>
    </div>
  )
}

export default CourseContent