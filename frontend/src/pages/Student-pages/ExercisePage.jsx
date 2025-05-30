import React, { useState, useEffect,useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, CheckCircle, Code, FileText, PenTool, Award } from "lucide-react";
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { axiosPrivate } from '@/api/axios';

function ExercisePage() {
  const { lessonId, exerciseId,chapterId,subject } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [userSolution, setUserSolution] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const startTimeRef = useRef(Date.now());
  // Handle form submission
  const handleSubmit = async () => {
    if (!userSolution.trim()) {
      toast.warning("Veuillez entrer votre solution avant de soumettre.");
      return;
    }
    
    try {
      // Calculate time spent in seconds
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      // Determine if the solution is correct (this is a placeholder - you'll need to implement actual validation)
      const isCorrect = userSolution.trim().toLowerCase() === (exercise.solution || '').trim().toLowerCase();
      
      // Track exercise completion in analytics with the appropriate activity type
      await axiosPrivate.post(`/courses/analytics/track`, {
        activityType: isCorrect ? 'exercise_complete' : 'exercise_attempt',
        subject: subject,
        chapterId: chapterId,
        lessonId: lessonId,
        exerciseId: exerciseId,
        score: isCorrect ? 100 : 0, // Score based on correctness
        timeSpent: timeSpent,
        metadata: {
          exerciseType: exercise.type,
          points: exercise.points,
          solutionLength: userSolution.length,
          isCorrect: isCorrect
        }
      });
      
      setSubmitted(true);
      toast.success(isCorrect 
        ? "Solution correcte soumise avec succès!" 
        : "Solution soumise. Consultez la solution modèle pour vous améliorer.");
    } catch (err) {
      console.error("Error submitting solution:", err);
      toast.error("Erreur lors de la soumission de votre solution");
    }
  };

  // Fetch exercise data if not provided as prop
  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(`/courses/student/lessons/${lessonId}/exercises/${exerciseId}`);
        console.log(response.data)
        if (response.data) {
          setExercise(response.data.exercise);
        }
      } catch (err) {
        console.error("Error fetching exercise:", err);
        toast.error("Impossible de charger l'exercice");
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [lessonId, exerciseId]);

  const handleShowSolution = () => {
    setShowSolution(true);
  };

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
      {/* Exercise header with back button and type badge */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}?tab=exercises`)}
          className="flex items-center p-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux exercices
        </Button>
        <Badge variant="outline" className="flex items-center gap-1">
          {getExerciseTypeIcon(exercise.type)}
          {getExerciseTypeLabel(exercise.type)}
        </Badge>
      </div>

      {/* Exercise title, description and progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{exercise.title}</h1>
        {exercise.description && (
          <p className="text-muted-foreground mb-4">{exercise.description}</p>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <Award className="h-4 w-4 mr-1 text-amber-400" />
          Points: {exercise.points || 10}
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
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: exercise.content }} />
          </div>
        </CardContent>
      </Card>

      {/* Solution input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Votre Solution</CardTitle>
          <CardDescription>
            {exercise.type === 'coding' 
              ? "Écrivez votre code ici. Assurez-vous qu'il répond à toutes les exigences."
              : "Rédigez votre réponse ici en suivant les instructions."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={
              exercise.type === 'coding' 
                ? "// Entrez votre code ici" 
                : exercise.type === 'written'
                  ? "Rédigez votre réponse ici..."
                  : "Décrivez votre solution ici..."
            }
            className="min-h-[200px] font-mono"
            value={userSolution}
            onChange={(e) => setUserSolution(e.target.value)}
            disabled={submitted}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          {!submitted ? (
            <Button onClick={handleSubmit} className="w-full">
              Soumettre la solution
            </Button>
          ) : (
            <div className="w-full flex items-center justify-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Solution soumise avec succès!</span>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Model solution (shown only after submission or when requested) */}
      {(submitted || showSolution) && exercise.solution && (
        <Card>
          <CardHeader>
            <CardTitle>Solution modèle</CardTitle>
            <CardDescription>
              Voici une solution de référence pour cet exercice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md font-mono whitespace-pre-wrap">
              {exercise.solution}
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
        
        {!submitted && !showSolution && exercise.solution && (
          <Button 
            variant="outline"
            onClick={handleShowSolution}
            className="flex items-center"
          >
            Voir la solution
          </Button>
        )}
        
        {submitted && (
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
  );
}

export default ExercisePage;