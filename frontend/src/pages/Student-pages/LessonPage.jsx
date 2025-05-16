import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate,useLocation} from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft,CheckCircle, Clock, FileText, Download, BookOpen, Award, Play, ExternalLink } from "lucide-react";
import { axiosPrivate } from '@/api/axios';
import ReactPlayer from 'react-player';
import ExerciseList from '@/pages/Student-pages/components/ExerciseList';
import QuizzList from '@/pages/Student-pages/components/QuizzList';

function LessonPage() {
  const { subject, chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("content");
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [readingProgress, setReadingProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const contentRef = useRef(null);
  // Add time tracking
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const timeIntervalRef = useRef(null);


  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axiosPrivate.get(`/courses/student/lessons/${lessonId}`);
        setLesson(response.data.lesson);
        setCompleted(response.data.lesson.completed || false);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setLoading(false);
      }
    };
    const fetchProgress = async () => {
      try {
        const progressResponse = await axiosPrivate.get(`/courses/analytics/progress/${subject}`);
        if (progressResponse.data && progressResponse.data.progress) {
          setProgress(progressResponse.data);
          setCompleted(progressResponse.data.completedLessons.includes(lessonId))
        }
      } catch (progressErr) {
        console.error('Error fetching progress:', progressErr);
      }
    };
    fetchLesson();
    fetchProgress();
  }, [lessonId]);

  // Handle resource access tracking
  const handleResourceClick = async (resourceId) => {
    try {
      await axiosPrivate.post('/analytics/track', {
        activityType: 'resource_access',
        subject: subject,
        resourceId: resourceId,
        metadata: {
          lessonId: lessonId,
          chapterId: chapterId,
          resourceTitle: lesson.resources.find(r => r._id === resourceId)?.title || 'Unknown'
        }
      });
    } catch (err) {
      console.error('Error recording resource access:', err);
    }
  };

  const handleNext = async () => {
    if (!completed) {
      try {
        // First, track the lesson completion activity
        await axiosPrivate.post('courses/analytics/track', {
          activityType: 'lesson_complete',
          subject: subject,
          chapterId: chapterId,
          lessonId: lessonId,
          timeSpent: timeSpent,
          metadata: {
            contentType: lesson?.contentType || 'text',
            readingProgress: readingProgress
          }
        });
        setCompleted(true);
        
        // Fetch updated progress
        try {
          const progressResponse = await axiosPrivate.get(`courses/analytics/progress/${subject}`);
          if (progressResponse.data && progressResponse.data.progress) {
            setProgress(progressResponse.data);
          }
        } catch (progressErr) {
          console.error('Error fetching updated progress:', progressErr);
        }
      } catch (err) {
        console.error('Error marking lesson as complete:', err);
      }
    }
  };

  const handleExerciseClick = (exerciseId) => {
    navigate(`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}/exercises/${exerciseId}`);
  };

  const handleQuizClick = (quizId) => {
    navigate(`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}/quizzes/${quizId}`);
  };

  // Check for tab parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['content', 'exercises', 'quizzes', 'resources'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="h-64 bg-muted rounded w-full mb-8"></div>
          <div className="flex justify-between">
            <div className="h-10 bg-muted rounded w-24"></div>
            <div className="h-10 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb and navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to={`/student/courses/${subject}`} className="text-primary hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au chapitre
        </Link>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{lesson.estimatedTime} min</span>
          {completed && (
            <Badge variant="success" className="ml-2 bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" /> Terminé
            </Badge>
          )}
        </div>
      </div>

      {/* Lesson title and progress */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
            <Progress value={completed ? 100 : progress.progress} className="h-2 flex-1 mr-4" />
            <span className="text-sm font-medium">{completed ? 100 : progress.progress}%</span>
          </div>
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-muted-foreground mb-4">{lesson.description}</p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="content" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Contenu
          </TabsTrigger>
          {lesson.exercises && lesson.exercises.length > 0 && (
            <TabsTrigger value="exercises" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Exercices ({lesson.exercises.length})
            </TabsTrigger>
          )}
          {lesson.quizzes && lesson.quizzes.length > 0 && (
            <TabsTrigger value="quizzes" className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Quiz ({lesson.quizzes.length})
            </TabsTrigger>
          )}
          {lesson.resources && lesson.resources.length > 0 && (
            <TabsTrigger value="resources" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Ressources ({lesson.resources.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content">
          <Card className="mb-4">
            <CardContent className="p-6" ref={contentRef}>
              {lesson.contentType === 'video' ? (
                <div className="w-full">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    {!lesson.cloudinaryUrl ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : (
                      <ReactPlayer
                        url={lesson.cloudinaryUrl}
                        className="absolute inset-0"
                        width="100%"
                        height="100%"
                        controls
                        playing
                        light={false}
                        pip
                        config={{
                          file: {
                            attributes: {
                              controlsList: 'nodownload',
                              onContextMenu: e => e.preventDefault()
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              )}
            </CardContent>
          </Card>
          <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/student/courses/${subject}`)}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au chapitre
        </Button>
        
        <Button 
          onClick={handleNext}
          className="flex items-center"
          variant={completed ? "outline" : "default"}
        >
          {completed ? "Déjà terminé" : "Marquer comme terminé"}
          {!completed && <CheckCircle className="h-4 w-4 ml-2" />}
        </Button>
      </div>
        </TabsContent>

        {/* Exercises Tab */}
        {lesson.exercises && lesson.exercises.length > 0 && (
          <TabsContent value="exercises">
            <ExerciseList 
              exercises={lesson.exercises} 
              onSelectExercise={handleExerciseClick}
              completedExercises={progress.completedExercises || []}
              lessonId={lessonId}
            />
          </TabsContent>
        )}

        {/* Quizzes Tab */}
        {lesson.quizzes && lesson.quizzes.length > 0 && (
          <TabsContent value="quizzes">
            <QuizzList
              quizzes={lesson.quizzes}
              onSelectQuiz={handleQuizClick}
              completedQuizzes={progress.completedQuizzes || []}
              lessonId={lessonId}
            />
          </TabsContent>
        )}

        {/* Resources Tab */}
        {lesson.resources && lesson.resources.length > 0 && (
          <TabsContent value="resources">
            <div className="grid gap-4 md:grid-cols-2">
              {lesson.resources.map((resource, index) => (
                <Card key={index} className="flex items-center p-4 hover:shadow-md transition-shadow">
                  <div className="mr-4">
                    {resource.type === 'pdf' && <FileText className="h-8 w-8 text-red-500" />}
                    {resource.type === 'video' && <Play className="h-8 w-8 text-blue-500" />}
                    {resource.type === 'link' && <ExternalLink className="h-8 w-8 text-green-500" />}
                    {resource.type === 'image' && <FileText className="h-8 w-8 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.type}</p>
                  </div>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2"
                  >
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </a>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default LessonPage;