import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Code, PenTool, Clock, ArrowRight, CheckCircle, Star, RotateCw, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { axiosPrivate } from '@/api/axios';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useCourseStore from '@/store/courseStore';

function ExerciseList({ exercises, onSelectExercise, completedExercises = [],lessonId }) {
  const [exerciseActivities, setExerciseActivities] = useState({});
  const [loading, setLoading] = useState(false);
  const {assignments} = useCourseStore();
  
  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/10 rounded-lg border border-dashed border-muted">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <h3 className="font-medium text-lg mb-2">Aucun exercice disponible</h3>
        <p className="text-muted-foreground max-w-md mx-auto">Cette leçon ne contient pas d'exercices pour le moment. Revenez plus tard pour pratiquer vos connaissances.</p>
      </div>
    );
  }

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
    const fetchExerciseActivities = async () => {
      setLoading(true);
      try {
        
        if (!lessonId) return;
        
        const response = await axiosPrivate.get(`courses/analytics/exercises/${lessonId}`);
        
        // Process the response data to organize by exerciseId
        const activitiesData = {};
        if (response.data && Array.isArray(response.data)) {
          response.data.forEach(activity => {
            if (activity.exerciseId) {
              if (!activitiesData[activity.exerciseId]) {
                activitiesData[activity.exerciseId] = [];
              }
              activitiesData[activity.exerciseId].push(activity);
            }
          });
          
          // Sort activities by date (newest first)
          Object.keys(activitiesData).forEach(exerciseId => {
            activitiesData[exerciseId].sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
          });
        }
        
        setExerciseActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching exercise activities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExerciseActivities();
    fetchAssignments();
  }, [exercises]);

  const getExerciseTypeIcon = (type) => {
    switch (type) {
      case 'coding':
        return <Code className="h-4 w-4" />;
      case 'written':
        return <PenTool className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'medium':
        return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'hard':
        return 'text-red-500 bg-red-50 border-red-200';
      default:
        return 'text-blue-500 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Exercices pratiques</h2>
        <Badge variant="outline" className="px-2 py-1">
          {completedExercises.length}/{exercises.length} complétés
        </Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {exercises.map((exercise) => {
          const activities = exerciseActivities[exercise._id] || [];
          const attempts = activities.length;
          const lastAttempt = attempts > 0 ? activities[0] : null;
          const hasSuccessfulAttempt = activities.some(a => a.activityType === 'exercise_complete');
          
          // Check if this exercise is part of an assignment
          const currentAssignment = assignments.find(a => a.exercise?.id === exercise._id);
          const isAssignmentExercise = Boolean(currentAssignment);
          
          return (
            <Card 
              key={exercise._id} 
              className={`hover:shadow-md transition-all duration-200 ${
                hasSuccessfulAttempt 
                  ? 'border-green-200 bg-green-50/30 dark:bg-green-900/10' 
                  : isAssignmentExercise 
                    ? 'ring-1 ring-blue-200' 
                    : ''
              }`}
            >
              <CardHeader className="pb-2 relative">
                {hasSuccessfulAttempt && (
                  <div className="absolute -top-2 -right-2 bg-green-100 text-green-700 rounded-full p-1 shadow-sm border border-green-200">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
                {isAssignmentExercise && (
                  <div className="absolute -top-2 -left-2 bg-blue-100 text-blue-700 rounded-full p-1 shadow-sm border border-blue-200">
                    <BookOpen className="h-4 w-4" />
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{exercise.title}</CardTitle>
                      {isAssignmentExercise && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                          Devoir
                        </Badge>
                      )}
                    </div>
                    {isAssignmentExercise && currentAssignment && (
                      <div className="text-xs text-blue-600 mb-1">
                        Échéance: {new Date(currentAssignment.dueDate).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {exercise.difficulty && (
                      <Badge variant="outline" className={`${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                      </Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getExerciseTypeIcon(exercise.type)}
                      {exercise.type?.charAt(0).toUpperCase() + exercise.type?.slice(1) || "Exercice"}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm line-clamp-2 mt-1">
                  {exercise.description || "Exercice pratique pour renforcer vos connaissances"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 
                    {exercise.estimatedTime || 15} min
                  </span>
                  <span className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-amber-400" /> 
                    {exercise.points || 10} points
                  </span>
                  {isAssignmentExercise && (
                    <span className="flex items-center text-blue-600">
                      <BookOpen className="h-3 w-3 mr-1" /> 
                      Assigné
                    </span>
                  )}
                  {attempts > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center">
                            <RotateCw className="h-3 w-3 mr-1" /> 
                            {attempts} tentative{attempts > 1 ? 's' : ''}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Dernière tentative: {new Date(lastAttempt?.createdAt).toLocaleDateString()}</p>
                          {lastAttempt?.timeSpent && (
                            <p>Temps passé: {Math.floor(lastAttempt.timeSpent / 60)} min {lastAttempt.timeSpent % 60} sec</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                {hasSuccessfulAttempt ? (
                  <div className="mt-3 flex items-center">
                    <Progress value={100} className="h-1.5 flex-1 mr-3" />
                    <span className="text-xs font-medium text-green-600">Complété</span>
                  </div>
                ) : attempts > 0 ? (
                  <div className="mt-3 flex items-center">
                    <Progress value={50} className="h-1.5 flex-1 mr-3" />
                    <span className="text-xs font-medium text-amber-600">En cours</span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center">
                    <Progress value={0} className="h-1.5 flex-1 mr-3" />
                    <span className="text-xs font-medium">Non commencé</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => onSelectExercise(exercise._id)}
                  size="sm"
                  variant={hasSuccessfulAttempt ? "outline" : "default"}
                >
                  {hasSuccessfulAttempt ? "Revoir l'exercice" : attempts > 0 ? "Continuer l'exercice" : "Commencer l'exercice"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default ExerciseList;