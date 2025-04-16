"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CourseBreadcrumb } from "../../../components/course-breadcrumb"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Trophy, ArrowRight, ArrowLeft } from "lucide-react"

export default function QuizPage() {
  const { level, grade, type, subject, slug } = useParams()
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes en secondes
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    questions: [],
    totalQuestions: 0,
    timeLimit: 300, // 5 minutes en secondes
  })

  // Simuler le chargement des données du quiz
  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    const fetchQuizData = () => {
      // Données simulées
      const data = {
        title: slug
          ? slug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Quiz",
        description: "Ce quiz vous permet d'évaluer vos connaissances.",
        totalQuestions: 5,
        timeLimit: 300, // 5 minutes en secondes
        questions: [
          {
            id: 1,
            question: "Quels sont les nombres pairs parmi les suivants ?",
            options: ["2", "3", "4", "5", "6"],
            correctAnswers: ["2", "4", "6"],
            multipleAnswers: true,
          },
          {
            id: 2,
            question: "Quelle est la capitale de la France ?",
            options: ["Londres", "Berlin", "Paris", "Madrid"],
            correctAnswers: ["Paris"],
            multipleAnswers: false,
          },
          {
            id: 3,
            question: "Quels sont les planètes du système solaire ?",
            options: ["Terre", "Lune", "Mars", "Soleil", "Jupiter"],
            correctAnswers: ["Terre", "Mars", "Jupiter"],
            multipleAnswers: true,
          },
          {
            id: 4,
            question: "Combien font 8 × 7 ?",
            options: ["54", "56", "58", "60"],
            correctAnswers: ["56"],
            multipleAnswers: false,
          },
          {
            id: 5,
            question: "Quels sont les couleurs primaires ?",
            options: ["Rouge", "Vert", "Bleu", "Jaune", "Orange"],
            correctAnswers: ["Rouge", "Bleu", "Jaune"],
            multipleAnswers: true,
          },
        ],
      }
      setQuizData(data)
      setTimeLeft(data.timeLimit)
    }

    fetchQuizData()
  }, [slug])

  // Gérer le compte à rebours
  useEffect(() => {
    if (isSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isSubmitted])

  const handleAnswerToggle = (answer) => {
    if (isSubmitted) return

    const currentQuestionData = quizData.questions[currentQuestion]

    if (currentQuestionData.multipleAnswers) {
      // Pour les questions à choix multiples
      if (selectedAnswers.includes(answer)) {
        setSelectedAnswers(selectedAnswers.filter((a) => a !== answer))
      } else {
        setSelectedAnswers([...selectedAnswers, answer])
      }
    } else {
      // Pour les questions à choix unique
      setSelectedAnswers([answer])
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      // Sauvegarder les réponses pour la question actuelle
      const updatedAnswers = [...selectedAnswers]

      // Passer à la question suivante
      setCurrentQuestion(currentQuestion + 1)

      // Charger les réponses pour la nouvelle question (si disponibles)
      setSelectedAnswers(updatedAnswers)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      // Sauvegarder les réponses pour la question actuelle
      const updatedAnswers = [...selectedAnswers]

      // Revenir à la question précédente
      setCurrentQuestion(currentQuestion - 1)

      // Charger les réponses pour la nouvelle question
      setSelectedAnswers(updatedAnswers)
    }
  }

  const handleSubmitQuiz = () => {
    setIsSubmitted(true)

    // Calculer le score
    let correctCount = 0
    quizData.questions.forEach((question, index) => {
      const userAnswers = selectedAnswers
      const correctAnswers = question.correctAnswers

      // Vérifier si les réponses sont correctes
      if (
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((answer) => correctAnswers.includes(answer))
      ) {
        correctCount++
      }
    })

    setScore(correctCount)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const formatSubject = (subject) => {
    switch (subject) {
      case "mathematiques":
        return "Mathématiques"
      case "francais":
        return "Français"
      case "sciences":
        return "Sciences"
      default:
        return subject.charAt(0).toUpperCase() + subject.slice(1)
    }
  }

  const currentQuestionData = quizData.questions[currentQuestion]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <CourseBreadcrumb level={level} subLevel={`${grade} - ${formatSubject(subject)}`} />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{quizData.title}</h1>
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
            <Clock className="h-4 w-4 text-slate-600" />
            <span className={`font-medium ${timeLeft < 60 ? "text-red-500" : ""}`}>{formatTime(timeLeft)}</span>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400">{quizData.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestion + 1} sur {quizData.questions.length}
          </span>
          {isSubmitted && (
            <span className="text-sm font-medium">
              Score: {score}/{quizData.questions.length}
            </span>
          )}
        </div>
        <Progress value={(currentQuestion / quizData.questions.length) * 100} className="h-2" />
      </div>

      {currentQuestionData && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">{currentQuestionData.question}</h2>
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => {
                  const isSelected = selectedAnswers.includes(option)
                  const isCorrect = isSubmitted && currentQuestionData.correctAnswers.includes(option)
                  const isWrong = isSubmitted && isSelected && !isCorrect

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer ${
                        isSubmitted && isCorrect
                          ? "border-green-500 bg-green-50"
                          : isWrong
                            ? "border-red-500 bg-red-50"
                            : isSelected
                              ? "border-blue-500"
                              : ""
                      }`}
                      onClick={() => handleAnswerToggle(option)}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isSubmitted}
                        onCheckedChange={() => handleAnswerToggle(option)}
                        id={`option-${index}`}
                      />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0 || isSubmitted}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Question précédente
              </Button>

              {currentQuestion < quizData.questions.length - 1 ? (
                <Button onClick={handleNextQuestion} disabled={isSubmitted}>
                  Question suivante <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                !isSubmitted && <Button onClick={handleSubmitQuiz}>Terminer le quiz</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {isSubmitted && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Quiz terminé!</h2>
              <p className="text-lg mb-4">
                Votre score:{" "}
                <span className="font-bold">
                  {score}/{quizData.questions.length}
                </span>
              </p>
              <Progress value={(score / quizData.questions.length) * 100} className="h-2 w-full max-w-md mb-6" />
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate(`/cours/${level}/${grade}`)}>
                  Retour au programme
                </Button>
                <Button
                  onClick={() => {
                    // Recharger le quiz
                    window.location.reload()
                  }}
                >
                  Refaire le quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isSubmitted && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/cours/${level}/${grade}`)}>
            Quitter le quiz
          </Button>
          <Button onClick={handleSubmitQuiz}>Terminer le quiz</Button>
        </div>
      )}
    </div>
  )
}
