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


function CourseContent() {
  const { courseId, subjectId } = useParams();
  const [progress, setProgress] = useState(0);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState("chapter-1"); // Default open first chapter
  const [completedItems, setCompletedItems] = useState({ lessons: 0, exercises: 0, quizzes: 0 });
  const navigate = useNavigate();

  function handleLessonClick(chapterId, lessonId) {
    navigate(`/student/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
  }
  
  function handleExerciseClick(chapterId, exerciseId) {
    navigate(`/student/courses/${courseId}/chapters/${chapterId}/exercises/${exerciseId}`);
  }
  
  function handleQuizClick(chapterId, quizId) {
    navigate(`/student/courses/${courseId}/chapters/${chapterId}/quizzes/${quizId}`);
  }

  // Calculate completion statistics
  useEffect(() => {
    if (currentCourse) {
      let totalLessons = 0;
      let completedLessons = 0;
      let totalExercises = 0;
      let completedExercises = 0;
      let totalQuizzes = 0;
      let completedQuizzes = 0;

      currentCourse.chapters.forEach(chapter => {
        totalLessons += chapter.lessons.length;
        completedLessons += chapter.lessons.filter(l => l.completed).length;
        
        totalExercises += chapter.exercises.length;
        completedExercises += chapter.exercises.filter(e => e.completed).length;
        
        totalQuizzes += chapter.quizzes.length;
        completedQuizzes += chapter.quizzes.filter(q => q.completed).length;
      });

      setCompletedItems({
        lessons: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        exercises: totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0,
        quizzes: totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0
      });
    }
  }, [currentCourse]);

  // Mock course data with chapters structure
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCourse = {
        id: courseId,
        subjectId: subjectId,
        title: "Mathématiques",
        description: "Cours complet de mathématiques avec chapitres structurés",
        progress: 35,
        difficulty: "Intermédiaire",
        estimatedTime: "12 heures",
        lastUpdated: "15 mars 2023",
        instructor: "Prof. Ahmed Ben Ali",
        chapters: [
          {
            id: 1,
            title: "Géométrie Euclidienne",
            progress: 75,
            description: "Fondements de la géométrie euclidienne et applications",
            lessons: [
              { id: 101, title: "Les points et les lignes", completed: true, duration: "15 min", type: "video" },
              { id: 102, title: "Les angles et les triangles", completed: true, duration: "20 min", type: "interactive" },
              { id: 103, title: "Les cercles et les polygones", completed: false, duration: "25 min", type: "lecture" },
            ],
            exercises: [
              { id: 201, title: "Calcul d'angles", completed: true, questions: 10, difficulty: "Facile" },
              { id: 202, title: "Construction de triangles", completed: false, questions: 8, difficulty: "Moyen" },
            ],
            quizzes: [
              { id: 301, title: "Quiz de géométrie", completed: false, questions: 15, time: "20 min", passingScore: 70 },
            ]
          },
          // Other chapters remain the same
        ]
      };
      
      setCurrentCourse(mockCourse);
      setProgress(mockCourse.progress);
      setLoading(false);
    }, 1000);
  }, [courseId, subjectId]);

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
            <h1 className="text-3xl font-bold mb-2">{currentCourse.title}</h1>
            <p className="text-muted-foreground mb-4">{currentCourse.description}</p>
            
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
                <span>Difficulté: {currentCourse.difficulty}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Durée estimée: {currentCourse.estimatedTime}</span>
              </div>
              <div className="flex items-center">
                <BookMarked className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Instructeur: {currentCourse.instructor}</span>
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
            <div className="text-xl font-bold">{completedItems.lessons}%</div>
            <div className="text-xs text-muted-foreground">Leçons complétées</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="flex justify-center mb-1">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-bold">{completedItems.exercises}%</div>
            <div className="text-xs text-muted-foreground">Exercices complétés</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="flex justify-center mb-1">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-bold">{completedItems.quizzes}%</div>
            <div className="text-xs text-muted-foreground">Quiz complétés</div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Chapters Accordion */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Chapitres du cours</h2>
        <Accordion type="single" collapsible className="w-full" value={expandedChapter} onValueChange={setExpandedChapter}>
          {currentCourse.chapters.map((chapter) => (
            <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`} className="border rounded-lg mb-4 overflow-hidden">
              <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 rounded-t-lg">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center">
                    <span className="font-medium">{chapter.title}</span>
                    {chapter.progress === 100 && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Complété
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Progress value={chapter.progress} className="h-2 w-24 mr-2" />
                    <span className="text-xs text-muted-foreground">{chapter.progress}%</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 bg-card/50">
                {chapter.description && (
                  <p className="text-sm text-muted-foreground mb-4">{chapter.description}</p>
                )}
                
                <Tabs defaultValue="lessons" className="mt-2">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="lessons" className="text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Leçons ({chapter.lessons.length})
                    </TabsTrigger>
                    <TabsTrigger value="exercises" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Exercices ({chapter.exercises.length})
                    </TabsTrigger>
                    <TabsTrigger value="quizzes" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Quiz ({chapter.quizzes.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="lessons" className="space-y-2">
                    {chapter.lessons.map((lesson) => (
                      <Card key={lesson.id} className={`${lesson.completed ? 'border-primary/20 bg-primary/5' : ''} hover:shadow-sm transition-shadow`}>
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
                                      {lesson.type === "video" && "Vidéo"}
                                      {lesson.type === "interactive" && "Interactif"}
                                      {lesson.type === "lecture" && "Lecture"}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Type de leçon: {lesson.type}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            {lesson.completed && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <CardDescription className="text-xs flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> Durée: {lesson.duration}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-3 pt-0">
                          <Button 
                            size="sm" 
                            className="w-full text-xs" 
                            onClick={() => handleLessonClick(chapter.id, lesson.id)} 
                            variant={lesson.completed ? "outline" : "default"}
                          >
                            {lesson.completed ? 'Revoir' : 'Commencer'}
                            <Play className="h-3 w-3 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="exercises" className="space-y-2">
                    {chapter.exercises.map((exercise) => (
                      <Card key={exercise.id} className={`${exercise.completed ? 'border-primary/20 bg-primary/5' : ''} hover:shadow-sm transition-shadow`}>
                        <CardHeader className="p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CardTitle className="text-sm">
                                {exercise.title}
                              </CardTitle>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className={`ml-2 text-xs ${
                                      exercise.difficulty === "Facile" ? "bg-green-50 text-green-700 border-green-200" :
                                      exercise.difficulty === "Moyen" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                      "bg-red-50 text-red-700 border-red-200"
                                    }`}>
                                      {exercise.difficulty}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Niveau de difficulté: {exercise.difficulty}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            {exercise.completed && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <CardDescription className="text-xs flex items-center">
                            <FileText className="h-3 w-3 mr-1" /> {exercise.questions} questions
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-3 pt-0">
                          <Button 
                            size="sm" 
                            className="w-full text-xs" 
                            onClick={() => handleExerciseClick(chapter.id, exercise.id)} 
                            variant={exercise.completed ? "outline" : "default"}
                          >
                            {exercise.completed ? 'Refaire' : 'Commencer'}
                            <Play className="h-3 w-3 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="quizzes" className="space-y-2">
                    {chapter.quizzes.map((quiz) => (
                      <Card key={quiz.id} className={`${quiz.completed ? 'border-primary/20 bg-primary/5' : ''} hover:shadow-sm transition-shadow`}>
                        <CardHeader className="p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CardTitle className="text-sm">
                                {quiz.title}
                              </CardTitle>
                              <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {quiz.questions} questions
                              </Badge>
                            </div>
                            {quiz.completed && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <CardDescription className="text-xs flex flex-wrap gap-2">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> Durée: {quiz.time}
                            </span>
                            <span className="flex items-center">
                              <Award className="h-3 w-3 mr-1" /> Score minimum: {quiz.passingScore}%
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-3 pt-0">
                          <Button 
                            size="sm" 
                            className="w-full text-xs" 
                            onClick={() => handleQuizClick(chapter.id, quiz.id)} 
                            variant={quiz.completed ? "outline" : "default"}
                          >
                            {quiz.completed ? 'Revoir' : 'Commencer'}
                            <Play className="h-3 w-3 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default CourseContent