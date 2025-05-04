import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { toast } from 'sonner';

function ExercisePage() {
  const { courseId, exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // In a real app, fetch the exercise data from your API
    const fetchExercise = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock exercise data
          const mockExercise = {
            id: parseInt(exerciseId),
            title: "Construction de triangles",
            courseId: parseInt(courseId),
            description: "Exercices sur les propriétés des triangles et leurs constructions",
            questions: [
              {
                id: 1,
                question: "Quelle est la somme des angles intérieurs d'un triangle?",
                options: [
                  { id: "a", text: "90 degrés" },
                  { id: "b", text: "180 degrés" },
                  { id: "c", text: "270 degrés" },
                  { id: "d", text: "360 degrés" }
                ],
                correctAnswer: "b",
                explanation: "La somme des angles intérieurs d'un triangle est toujours égale à 180 degrés."
              },
              {
                id: 2,
                question: "Dans un triangle rectangle, l'hypoténuse est:",
                options: [
                  { id: "a", text: "Le côté le plus court" },
                  { id: "b", text: "Le côté opposé à l'angle droit" },
                  { id: "c", text: "Le côté adjacent à l'angle droit" },
                  { id: "d", text: "La hauteur du triangle" }
                ],
                correctAnswer: "b",
                explanation: "L'hypoténuse est le côté opposé à l'angle droit dans un triangle rectangle. C'est aussi le côté le plus long."
              },
              {
                id: 3,
                question: "Un triangle équilatéral a:",
                options: [
                  { id: "a", text: "Trois côtés de longueurs différentes" },
                  { id: "b", text: "Deux côtés de même longueur" },
                  { id: "c", text: "Trois côtés de même longueur" },
                  { id: "d", text: "Un angle droit" }
                ],
                correctAnswer: "c",
                explanation: "Un triangle équilatéral a trois côtés de même longueur et trois angles égaux de 60 degrés chacun."
              },
              {
                id: 4,
                question: "Selon le théorème de Pythagore, dans un triangle rectangle avec des côtés a, b et une hypoténuse c:",
                options: [
                  { id: "a", text: "a² + b² = c²" },
                  { id: "b", text: "a + b = c" },
                  { id: "c", text: "a² - b² = c²" },
                  { id: "d", text: "a × b = c" }
                ],
                correctAnswer: "a",
                explanation: "Le théorème de Pythagore établit que dans un triangle rectangle, le carré de la longueur de l'hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés."
              }
            ],
            lessonId: 2,
            nextContent: {
              type: "quiz",
              id: 1,
              title: "Quiz de mi-parcours"
            }
          };
          
          setExercise(mockExercise);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching exercise:", error);
        setLoading(false);
      }
    };

    fetchExercise();
  }, [courseId, exerciseId]);

  useEffect(() => {
    // Update progress based on answered questions
    if (exercise) {
      const answeredCount = Object.keys(answers).length;
      const newProgress = Math.round((answeredCount / exercise.questions.length) * 100);
      setProgress(newProgress);
    }
  }, [answers, exercise]);

  const handleAnswer = (questionId, answerId) => {
    if (showFeedback) return; // Prevent changing answer during feedback

    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };

  const checkAnswer = () => {
    const currentQuestionData = exercise.questions[currentQuestion];
    if (!answers[currentQuestionData.id]) {
      toast.warning("Veuillez sélectionner une réponse avant de continuer.");
      return;
    }
    
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    
    if (currentQuestion < exercise.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Exercise completed
      toast.success("Exercice terminé!");
      
      // Navigate to the next content if available
      if (exercise.nextContent) {
        if (exercise.nextContent.type === "quiz") {
          navigate(`/student/courses/${courseId}/quiz/${exercise.nextContent.id}`);
        } else {
          navigate(`/student/courses/${courseId}/lesson/${exercise.nextContent.id}`);
        }
      } else {
        navigate(`/student/courses/${courseId}`);
      }
    }
  };

  const handlePrevious = () => {
    setShowFeedback(false);
    
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      // Go back to the lesson
      navigate(`/student/courses/${courseId}/lesson/${exercise.lessonId}`);
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

  const currentQuestionData = exercise.questions[currentQuestion];
  const isCorrect = answers[currentQuestionData.id] === currentQuestionData.correctAnswer;

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb and navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to={`/student/courses/${courseId}`} className="text-primary hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au cours
        </Link>
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} sur {exercise.questions.length}
          </span>
        </div>
      </div>

      {/* Exercise title and progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{exercise.title}</h1>
        <p className="text-muted-foreground mb-4">{exercise.description}</p>
        <div className="flex items-center mb-2">
          <Progress value={progress} className="h-2 flex-1 mr-4" />
          <span className="text-sm font-medium">{progress}%</span>
        </div>
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
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  showFeedback && option.id === currentQuestionData.correctAnswer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : showFeedback && option.id === answers[currentQuestionData.id] && !isCorrect
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-input'
                }`}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={`option-${option.id}`} 
                  disabled={showFeedback}
                />
                <Label 
                  htmlFor={`option-${option.id}`}
                  className="flex-1 cursor-pointer"
                >
                  {option.text}
                </Label>
                {showFeedback && option.id === currentQuestionData.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {showFeedback && option.id === answers[currentQuestionData.id] && !isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        {showFeedback && (
          <CardFooter className="flex flex-col items-start border-t p-4">
            <div className={`p-3 rounded-lg w-full ${
              isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              <div className="flex items-start mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">
                    {isCorrect ? 'Bonne réponse!' : 'Réponse incorrecte'}
                  </p>
                  <p className="text-sm mt-1">{currentQuestionData.explanation}</p>
                </div>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentQuestion === 0 ? 'Retour à la leçon' : 'Question précédente'}
        </Button>
        
        {!showFeedback ? (
          <Button 
            onClick={checkAnswer}
            className="flex items-center"
          >
            Vérifier
            <HelpCircle className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="flex items-center"
          >
            {currentQuestion === exercise.questions.length - 1 ? 'Terminer' : 'Question suivante'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ExercisePage;