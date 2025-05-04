import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft,ArrowRight, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from 'sonner';

function QuizPage() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // In a real app, fetch the quiz data from your API
    const fetchQuiz = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock quiz data
          const mockQuiz = {
            id: parseInt(quizId),
            title: "Quiz de mi-parcours",
            courseId: parseInt(courseId),
            description: "Ce quiz évalue votre compréhension des concepts de base de la géométrie.",
            timeLimit: 20 * 60, // 20 minutes in seconds
            passingScore: 70,
            questions: [
              {
                id: 1,
                question: "Quelle est la formule pour calculer l'aire d'un triangle?",
                options: [
                  { id: "a", text: "A = b × h" },
                  { id: "b", text: "A = (b × h) / 2" },
                  { id: "c", text: "A = π × r²" },
                  { id: "d", text: "A = b × h × l" }
                ],
                correctAnswer: "b"
              },
              {
                id: 2,
                question: "Dans un triangle rectangle, si les deux côtés de l'angle droit mesurent 5 cm et 12 cm, quelle est la longueur de l'hypoténuse?",
                options: [
                  { id: "a", text: "13 cm" },
                  { id: "b", text: "17 cm" },
                  { id: "c", text: "60 cm" },
                  { id: "d", text: "8.5 cm" }
                ],
                correctAnswer: "a"
              },
              {
                id: 3,
                question: "Quel est le théorème qui établit que dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés?",
                options: [
                  { id: "a", text: "Théorème de Thalès" },
                  { id: "b", text: "Théorème de Pythagore" },
                  { id: "c", text: "Théorème d'Euclide" },
                  { id: "d", text: "Théorème de Fermat" }
                ],
                correctAnswer: "b"
              },
              {
                id: 4,
                question: "Combien d'angles droits y a-t-il dans un triangle rectangle?",
                options: [
                  { id: "a", text: "Aucun" },
                  { id: "b", text: "Un" },
                  { id: "c", text: "Deux" },
                  { id: "d", text: "Trois" }
                ],
                correctAnswer: "b"
              },
              {
                id: 5,
                question: "Quelle est la somme des angles intérieurs d'un quadrilatère?",
                options: [
                  { id: "a", text: "180°" },
                  { id: "b", text: "270°" },
                  { id: "c", text: "360°" },
                  { id: "d", text: "540°" }
                ],
                correctAnswer: "c"
              }
            ]
          };
          
          setQuiz(mockQuiz);
          setTimeLeft(mockQuiz.timeLimit);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };

    fetchQuiz();

    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [courseId, quizId]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
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

  const submitQuiz = () => {
    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Show appropriate toast based on score
    if (finalScore >= quiz.passingScore) {
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

  // Quiz intro screen
  if (!quizStarted && !quizCompleted) {
    return (
      <div className="container mx-auto p-6">
        <Link to={`/student/courses/${courseId}`} className="text-primary hover:underline flex items-center mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au cours
        </Link>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{quiz.description}</p>
            
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
        <Link to={`/student/courses/${courseId}`} className="text-primary hover:underline flex items-center mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au cours
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
                            answers[question.id] 
                              ? question.options.find(o => o.id === answers[question.id])?.text || 'Non répondu'
                              : 'Non répondu'
                          }
                        </p>
                        {!isCorrect && (
                          <p className="text-sm mt-1">
                            <span className="font-medium">Réponse correcte:</span> {
                              question.options.find(o => o.id === question.correctAnswer)?.text
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
              onClick={() => navigate(`/student/courses/${courseId}`)}
              className="w-full"
            >
              Retourner au cours
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
                className="flex items-center space-x-2 p-3 rounded-lg border border-input"
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