import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, CheckCircle, Code, FileText, PenTool, Award, Eye, BookOpen } from "lucide-react";
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { axiosPrivate } from '@/api/axios';
import useCourseStore from '@/store/courseStore';

function ExercisePage() {
  const { lessonId, exerciseId,chapterId,subject } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const {assignments} = useCourseStore()
  const startTimeRef = useRef(Date.now());
  
  // Check if current exercise is part of an assignment
  const currentAssignment = assignments.find(a => a.exercise?.id === exerciseId);
  const isAssignmentExercise = Boolean(currentAssignment);
  
  // Handle mark as done
  const handleMarkDone = async () => {
    try {
      // Calculate time spent in seconds
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      // Track exercise completion in analytics
      await axiosPrivate.post(`/courses/analytics/track`, {
        activityType:'exercise_complete',
        subject: subject,
        chapterId: chapterId,
        lessonId: lessonId,
        exerciseId: exerciseId,
        score: 100,
        timeSpent: timeSpent,
        metadata: {
          exerciseType: exercise.type,
          points: exercise.points,
          isCorrect: true
        }
      });
      
      // Update assignment status if this exercise is part of an assignment
      const currentAssignment = assignments.find(a => a.exercise?.id === exerciseId);
      if (currentAssignment) {
        await axiosPrivate.post(`/courses/student/assignments/${currentAssignment._id}`, {
          status: 'completed'
        });
      }
      
      // Update local state to reflect completion
      setExercise(prev => ({ ...prev, completed: true }));
      setSubmitted(true);
      toast.success("Exercice marqué comme terminé!");
      
    } catch (err) {
      console.error("Error marking exercise as done:", err);
      toast.error("Erreur lors de la validation de l'exercice");
    }
  };

  // Fetch exercise data
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if(assignments.length > 0) {
          return;
        }
        const response = await axiosPrivate.get(`/courses/student/assignments`);
        const assignmentsData = response.data.assignments;
        useCourseStore.setState({ assignments: assignmentsData });
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    const fetchExercise = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(`/courses/student/lessons/${lessonId}/exercises/${exerciseId}`);
        if (response.data) {
          // Check if exercise is completed from analytics
          const completedResponse = await axiosPrivate.get(`courses/analytics/exercises/${lessonId}?activityType=exercise_complete`);
          const completedExerciseIds = completedResponse.data && Array.isArray(completedResponse.data) 
            ? completedResponse.data.map(activity => activity.exerciseId) 
            : [];
          
          const isCompleted = completedExerciseIds.includes(exerciseId);
          
          setExercise({
            ...response.data.exercise,
            completed: isCompleted
          });
          
          // Set submitted state if already completed
          setSubmitted(isCompleted);
          
          // Check if this exercise is part of assignments and track accordingly
          const assignmentExerciseIds = assignments.map(a => a.exercise?.id).filter(Boolean);
          const currentAssignment = assignments.find(a => a.exercise?.id === exerciseId);
          
          if (assignmentExerciseIds.includes(exerciseId) && currentAssignment) {
            // Only track attempt and update status if not already completed
            if (!isCompleted && currentAssignment.status !== 'completed') {
              await axiosPrivate.post(`/courses/analytics/track`, {
                activityType: 'exercise_attempt',
                subject: subject,
                chapterId: chapterId,
                lessonId: lessonId,
                exerciseId: exerciseId,
                score: 0,
                timeSpent: 0,
                metadata: {
                  exerciseType: response.data.exercise.type,
                  points: response.data.exercise.points,
                }
              });
              
              await axiosPrivate.post(`/courses/student/assignments/${currentAssignment._id}`, {
                status: 'in_progress'
              });
            }
          }
        }
      } catch (err) {
        console.error("Error fetching exercise:", err);
        toast.error("Impossible de charger l'exercice");
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercise();
    fetchAssignments();
  }, [lessonId, exerciseId]);

  const getExerciseTypeIcon = (type) => {
    switch (type) {
      case 'coding':
        return <Code className="h-4 w-4" />;
      case 'written':
        return <PenTool className="h-4 w-4" />;
      case 'project':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getExerciseTypeLabel = (type) => {
    switch (type) {
      case 'coding':
        return 'Code';
      case 'written':
        return 'Rédaction';
      case 'project':
        return 'Projet';
      default:
        return 'Exercice';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-6 bg-muted rounded w-20"></div>
          </div>
          <div>
            <div className="h-10 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-2 bg-muted rounded w-full mb-2"></div>
          </div>
          <div className="h-64 bg-muted rounded w-full"></div>
          <div className="h-40 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Exercice non disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Cet exercice n'est pas disponible ou a été supprimé.</p>
          </CardContent>
          <CardFooter>
            <Button >
              Retour aux exercices
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Exercise header with back button and badges */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}?tab=exercises`)}
          className="flex items-center p-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux exercices
        </Button>
        <div className="flex items-center gap-2">
          {/* Assignment indicator */}
          {isAssignmentExercise && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-200">
              <BookOpen className="h-3 w-3" />
              Devoir
            </Badge>
          )}
          {/* Exercise type badge */}
          <Badge variant="outline" className="flex items-center gap-1">
            {getExerciseTypeIcon(exercise.type)}
            {getExerciseTypeLabel(exercise.type)}
          </Badge>
        </div>
      </div>

      {/* Exercise title, description and progress */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{exercise.title}</h1>
          {isAssignmentExercise && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              Assigné
            </Badge>
          )}
        </div>
        {exercise.description && (
          <p className="text-muted-foreground mb-4">{exercise.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1 text-amber-400" />
            Points: {exercise.points || 10}
          </div>
          {isAssignmentExercise && currentAssignment && (
            <div className="flex items-center text-blue-600">
              <BookOpen className="h-4 w-4 mr-1" />
              Échéance: {new Date(currentAssignment.dueDate).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>
      </div>

      {/* Exercise content/instructions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          {exercise.type === 'coding' && (
            <CardDescription>
              Écrivez votre code pour résoudre le problème ci-dessous.
            </CardDescription>
          )}
          {exercise.type === 'written' && (
            <CardDescription>
              Rédigez votre réponse en suivant les instructions ci-dessous.
            </CardDescription>
          )}
          {exercise.type === 'project' && (
            <CardDescription>
              Suivez les étapes du projet et soumettez votre solution.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center">
            {exercise.content.imageUrl ? 
              <img src={exercise.content.imageUrl} alt="" /> :
              <div dangerouslySetInnerHTML={{ __html: exercise.content.text }} />
            } 
          </div>
        </CardContent>
      </Card>

      {/* Solution card - only show if showSolution is true */}
      {showSolution && exercise.solution && (
        <Card className="mb-8 border-green-200 bg-background">
          <CardHeader>
            <CardTitle className="text-green-800">Solution</CardTitle>
            <CardDescription className="text-green-600">
              Voici la solution de cet exercice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-green-900 flex justify-center items-center">
              {exercise.solution.imageUrl ? 
                <img src={exercise.solution.imageUrl} alt="Solution" className="max-w-full h-auto" /> :
                <div dangerouslySetInnerHTML={{ __html: exercise.solution.text }} />
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}?tab=exercises`)}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux exercices
        </Button>
        
        <div className="flex gap-2">
          {/* Show Solution button */}
          {exercise.solution && (
            <Button 
              variant="outline"
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showSolution ? 'Masquer la solution' : 'Voir la solution'}
            </Button>
          )}
         
          {exercise.completed ? (
              <Button 
                variant="outline"
                disabled
                className="flex items-center text-green-600 border-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Déjà Terminé
              </Button>
            ) : (
              <Button 
                onClick={handleMarkDone}
                className="flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marquer comme terminé
              </Button>
            )}
            
          {(submitted || exercise.completed) && (
            <Button 
              onClick={() => navigate(`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}?tab=exercises`)}
              className="flex items-center"
            >
              Continuer
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )} 
        </div>
      </div>
    </div>
  );
}

export default ExercisePage;