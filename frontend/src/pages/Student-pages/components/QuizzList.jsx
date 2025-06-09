import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, ArrowRight, CheckCircle, RotateCw, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { axiosPrivate } from '@/api/axios';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useCourseStore  from '@/store/courseStore';

function QuizzList({ quizzes, onSelectQuiz, completedQuizzes = [], lessonId }) {
  const [quizActivities, setQuizActivities] = useState({});
  const [loading, setLoading] = useState(false);
  const { assignments } = useCourseStore();

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/10 rounded-lg border border-dashed border-muted">
        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <h3 className="font-medium text-lg mb-2">Aucun quiz disponible</h3>
        <p className="text-muted-foreground max-w-md mx-auto">Cette leçon ne contient pas de quiz pour le moment. Revenez plus tard pour tester vos connaissances.</p>
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
    const fetchQuizActivities = async () => {
      setLoading(true);
      try {
        if (!lessonId) return;
        
        const response = await axiosPrivate.get(`courses/analytics/quizzes/${lessonId}`);
        
        // Process the response data to organize by quizId
        const activitiesData = {};
        if (response.data && Array.isArray(response.data)) {
          response.data.forEach(activity => {
            if (activity.quizId) {
              if (!activitiesData[activity.quizId]) {
                activitiesData[activity.quizId] = [];
              }
              activitiesData[activity.quizId].push(activity);
            }
          });
          
          // Sort activities by date (newest first)
          Object.keys(activitiesData).forEach(quizId => {
            activitiesData[quizId].sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
          });
        }
        
        setQuizActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching quiz activities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizActivities();
    fetchAssignments();
  }, [quizzes, lessonId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Quiz d'évaluation</h2>
        <Badge variant="outline" className="px-2 py-1">
          {completedQuizzes.length}/{quizzes.length} complétés
        </Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => {
          const activities = quizActivities[quiz._id] || [];
          const attempts = activities.length;
          const lastAttempt = attempts > 0 ? activities[0] : null;
          const bestScore = activities.length > 0 
            ? Math.max(...activities.map(a => a.score || 0))
            : 0;
          const hasSuccessfulAttempt = activities.some(a => 
            (a.score || 0) >= (quiz.passingScore || 70)
          );
          
          // Check if this quiz is part of an assignment
          const assignmentInfo = assignments?.find(assignment => 
            assignment.quizz && assignment.quizz.id === quiz._id
          );
          const isAssignmentQuiz = !!assignmentInfo;
          
          return (
            <Card 
              key={quiz._id} 
              className={`hover:shadow-md transition-all duration-200 ${
                hasSuccessfulAttempt 
                  ? 'border-green-200 bg-green-50/30 dark:bg-green-900/10' 
                  : isAssignmentQuiz 
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
                {isAssignmentQuiz && (
                  <div className="absolute -top-2 -left-2 bg-blue-100 text-blue-700 rounded-full p-1 shadow-sm border border-blue-200">
                    <BookOpen className="h-4 w-4" />
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
          
                    <CardTitle className="text-base flex items-center gap-2">
                      {quiz.title}
                        <div className="flex items-center gap-2 mb-1">
                        {isAssignmentQuiz && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                            Devoir
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                    {isAssignmentQuiz && assignmentInfo && (
                      <div className="text-xs text-blue-600 mb-1">
                        Échéance: {new Date(assignmentInfo.dueDate).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                    {quiz.questions?.length || 0} questions
                  </Badge>
                </div>
                <CardDescription className="text-sm line-clamp-2 mt-1">
                  {quiz.description || "Quiz pour évaluer votre compréhension"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 
                    {quiz.timeLimit || 10} min
                  </span>
                  <span className="flex items-center">
                    <Award className="h-3 w-3 mr-1 text-amber-400" /> 
                    Score min: {quiz.passingScore || 70}%
                  </span>
                  {isAssignmentQuiz && (
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
                          <p>Meilleur score: {bestScore}%</p>
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
                    <span className="text-xs font-medium text-green-600">Réussi ({bestScore}%)</span>
                  </div>
                ) : attempts > 0 ? (
                  <div className="mt-3 flex items-center">
                    <Progress value={(bestScore / (quiz.passingScore || 70)) * 100} className="h-1.5 flex-1 mr-3" />
                    <span className="text-xs font-medium text-amber-600">Score: {bestScore}%</span>
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
                  onClick={() => onSelectQuiz(quiz._id)}
                  size="sm"
                  variant={hasSuccessfulAttempt ? "outline" : "default"}
                >
                  {hasSuccessfulAttempt ? "Revoir le quiz" : attempts > 0 ? "Réessayer le quiz" : "Commencer le quiz"}
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

export default QuizzList;