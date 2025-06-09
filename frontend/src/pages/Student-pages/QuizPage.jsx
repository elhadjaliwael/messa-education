import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, AlertTriangle, BookOpen } from "lucide-react";
import { toast } from 'sonner';
import { axiosPrivate } from '@/api/axios';
import useCourseStore from '@/store/courseStore';

function QuizPage() {
  const { chapterId, subject, quizId, lessonId } = useParams();
  const navigate = useNavigate();
  const { assignments } = useCourseStore();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);

  // Check if this quiz is part of an assignment
  const assignmentInfo = assignments?.find(assignment => 
    assignment.quizz && assignment.quizz.id === quizId
  );
  
  const isAssignmentQuiz = !!assignmentInfo;
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
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(`/courses/student/lessons/${lessonId}/quizzes/${quizId}`);
        const quizData = response.data.quizz;
        // Process questions to add unique IDs if they don't exist
        const processedQuestions = quizData.questions.map((question, index) => {
          // Add id to question if it doesn't exist
          const questionId = question._id || `q-${index}`;
          
          // Process options to add unique IDs and find correct answer
          const options = question.options.map((option, optIndex) => ({
            id: option._id || `opt-${questionId}-${optIndex}`,
            text: option.text,
            isCorrect: option.isCorrect
          }));
          
          // Find the correct answer ID
          const correctAnswer = options.find(opt => opt.isCorrect)?.id;
          
          return {
            id: questionId,
            question: question.text,
            type: question.type,
            options,
            correctAnswer,
            points: question.points || 1
          };
        });
        
        setQuiz({
          ...quizData,
          questions: processedQuestions,
          timeLimit: quizData.timeLimit * 60 || 600 // Convert minutes to seconds
        });
        
        setTimeLeft(quizData.timeLimit * 60 || 600);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Erreur lors du chargement du quiz");
        setLoading(false);
      }
    };

    fetchQuiz();
    fetchAssignments();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [lessonId, quizId]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      setStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, quizCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };

  const startQuiz = () => {
    setQuizStarted(true);
    toast.info("Le quiz a commencé! Bonne chance!");
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    // Calculate score
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    
    quiz.questions.forEach(question => {
      totalPoints += question.points;
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
        earnedPoints += question.points;
      }
    });

    const finalScore = Math.round((earnedPoints / totalPoints) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Calculate time spent
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    const isPassed = finalScore >= quiz.passingScore;

    // Save quiz result to the API
    try {
      await axiosPrivate.post(`/courses/analytics/track`, {
        quizId,
        score: finalScore,
        lessonId,
        chapterId,
        subject,
        timeSpent,
        activityType: isPassed ? 'quiz_complete' : 'quiz_attempt',
        answers: Object.keys(answers).map(questionId => ({
          questionId,
          answerId: answers[questionId],
          isCorrect: quiz.questions.find(q => q.id === questionId)?.correctAnswer === answers[questionId]
        }))
      });

      // Track assignment status if this quiz is part of an assignment
      if (isAssignmentQuiz && assignmentInfo && isPassed) {
        try {
          // Update assignment status to completed since quiz is the only activity
          await axiosPrivate.post(`/courses/student/assignments/${assignmentInfo._id || assignmentInfo.id}`, {
            status: 'completed'
          });
        } catch (error) {
          console.error('Error updating assignment status:', error);
        }
      }
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }

    // Show appropriate toast based on score
    if (isPassed) {
      toast.success(`Félicitations! Vous avez obtenu ${finalScore}%`);
    } else {
      toast.error(`Vous avez obtenu ${finalScore}%. Le score minimum requis est de ${quiz.passingScore}%`);
    }
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quiz.questions.length) {
      const unansweredCount = quiz.questions.length - answeredCount;
      toast.warning(`Vous n'avez pas répondu à ${unansweredCount} question(s). Voulez-vous vraiment soumettre?`, {
        action: {
          label: "Soumettre quand même",
          onClick: () => submitQuiz()
        },
      });
    } else {
      submitQuiz();
    }
  };

  if (loading || !quiz) {
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

  // Quiz intro screen
  if (!quizStarted && !quizCompleted) {
    return (
      <div className="container mx-auto p-6">
        <Link to={`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}?tab=quizzes`} className="text-primary hover:underline flex items-center mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la leçon
        </Link>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              {isAssignmentQuiz && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Devoir
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl flex items-center gap-2">
              {quiz.title}
              {isAssignmentQuiz && (
                <Badge variant="outline" className="text-blue-600 border-blue-300">
                  Assigné
                </Badge>
              )}
            </CardTitle>
            {isAssignmentQuiz && assignmentInfo && (
              <p className="text-sm text-muted-foreground mt-2">
                Date limite: {new Date(assignmentInfo.dueDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{quiz.description || "Ce quiz vous permettra d'évaluer votre compréhension du sujet."}</p>
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Durée: {formatTime(quiz.timeLimit)}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Questions: {quiz.questions.length}</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Score minimum: {quiz.passingScore}%</span>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
              <p className="text-amber-800 dark:text-amber-300 text-sm">
                Une fois que vous commencez le quiz, le chronomètre démarre. Vous ne pouvez pas mettre en pause ou redémarrer le quiz. Assurez-vous d'avoir suffisamment de temps pour le terminer.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={startQuiz} 
              className="w-full"
            >
              Commencer le quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quiz results screen
  if (quizCompleted) {
    const isPassed = score >= quiz.passingScore;
    
    return (
      <div className="container mx-auto p-6">
        <Link to={`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}?tab=quizzes`} className="text-primary hover:underline flex items-center mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la leçon
        </Link>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Résultats du quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6">
              <div className={`text-5xl font-bold mb-2 ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
                {score}%
              </div>
              <p className="text-muted-foreground">
                {isPassed ? 'Félicitations! Vous avez réussi le quiz.' : 'Vous n\'avez pas atteint le score minimum requis.'}
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Détails des réponses</h3>
              
              {quiz.questions.map((question, index) => {
                const isCorrect = answers[question.id] === question.correctAnswer;
                const selectedOption = question.options.find(o => o.id === answers[question.id]);
                const correctOption = question.options.find(o => o.id === question.correctAnswer);
                
                return (
                  <div 
                    key={question.id} 
                    className={`p-4 rounded-lg border ${
                      isCorrect 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        {isCorrect 
                          ? <CheckCircle className="h-5 w-5 text-green-500" /> 
                          : <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">Question {index + 1}: {question.question}</p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Votre réponse:</span> {
                            selectedOption
                              ? selectedOption.text
                              : 'Non répondu'
                          }
                        </p>
                        {!isCorrect && (
                          <p className="text-sm mt-1">
                            <span className="font-medium">Réponse correcte:</span> {
                              correctOption?.text || "Aucune réponse correcte trouvée"
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={() => navigate(`/student/courses/${subject}/chapters/${chapterId}/lessons/${lessonId}?tab=quizzes`)}
              className="w-full"
            >
              Retourner à la leçon
            </Button>
            {!isPassed && (
              <Button 
                variant="outline"
                onClick={() => {
                  setQuizStarted(false);
                  setQuizCompleted(false);
                  setAnswers({});
                  setCurrentQuestion(0);
                  setTimeLeft(quiz.timeLimit);
                }}
                className="w-full"
              >
                Réessayer le quiz
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Active quiz screen
  const currentQuestionData = quiz.questions[currentQuestion];
  const progress = Math.round(((currentQuestion + 1) / quiz.questions.length) * 100);
  
  return (
    <div className="container mx-auto p-6">
      {/* Quiz header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <div className={`flex items-center ${timeLeft < 60 ? 'text-red-500 animate-pulse' : timeLeft < 300 ? 'text-amber-500' : 'text-muted-foreground'}`}>
          <Clock className="h-5 w-5 mr-2" />
          <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentQuestion + 1} sur {quiz.questions.length}</span>
          <span>{progress}% complété</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Question card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestionData.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={answers[currentQuestionData.id] || ""}
            onValueChange={(value) => handleAnswer(currentQuestionData.id, value)}
            className="space-y-3"
          >
            {currentQuestionData.options.map((option) => (
              <div 
                key={option.id} 
                className="flex items-center space-x-2 p-3 rounded-lg border border-input hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={`option-${option.id}`} 
                />
                <Label 
                  htmlFor={`option-${option.id}`}
                  className="flex-1 cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      {/* Question navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium ${
              index === currentQuestion
                ? 'bg-primary text-primary-foreground'
                : answers[quiz.questions[index].id]
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Question précédente
        </Button>
        
        {currentQuestion === quiz.questions.length - 1 ? (
          <Button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
          >
            Terminer le quiz
          </Button>
        ) : (
          <Button 
            onClick={nextQuestion}
            className="flex items-center"
          >
            Question suivante
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuizPage;