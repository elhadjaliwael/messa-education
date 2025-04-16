"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CourseBreadcrumb } from "../../../components/course-breadcrumb"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
// Ajouter l'import pour FileText
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, HelpCircle, FileText } from "lucide-react"

export default function ExercisePage() {
  const { level, grade, type, subject, slug } = useParams()
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [exerciseData, setExerciseData] = useState({
    title: "",
    description: "",
    questions: [],
    totalQuestions: 0,
  })

  // Simuler le chargement des données de l'exercice
  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    const fetchExerciseData = () => {
      // Données simulées
      const data = {
        title: slug
          ? slug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Exercice",
        description: "Cet exercice vous permet de pratiquer et de renforcer vos connaissances.",
        totalQuestions: 5,
        questions: [
          {
            id: 1,
            question: "Combien font 5 + 3 ?",
            options: ["6", "7", "8", "9"],
            correctAnswer: "8",
            explanation: "5 + 3 = 8",
            pdf: "exercice1.pdf",
          },
          {
            id: 2,
            question: "Combien font 10 - 4 ?",
            options: ["4", "5", "6", "7"],
            correctAnswer: "6",
            explanation: "10 - 4 = 6",
            pdf: "exercice2.pdf",
          },
          {
            id: 3,
            question: "Combien font 3 × 4 ?",
            options: ["7", "9", "12", "15"],
            correctAnswer: "12",
            explanation: "3 × 4 = 12",
            pdf: "exercice3.pdf",
          },
          {
            id: 4,
            question: "Combien font 20 ÷ 5 ?",
            options: ["3", "4", "5", "6"],
            correctAnswer: "4",
            explanation: "20 ÷ 5 = 4",
          },
          {
            id: 5,
            question: "Combien font 7 + 8 ?",
            options: ["13", "14", "15", "16"],
            correctAnswer: "15",
            explanation: "7 + 8 = 15",
          },
        ],
      }
      setExerciseData(data)
    }

    fetchExerciseData()
  }, [slug])

  const handleAnswerSelect = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer)
    }
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    setIsAnswered(true)
    if (selectedAnswer === exerciseData.questions[currentQuestion]?.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < exerciseData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setIsAnswered(false)
    } else {
      // Exercice terminé
      alert(`Exercice terminé! Votre score: ${score}/${exerciseData.questions.length}`)
      navigate(`/cours/${level}/${grade}`)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer("")
      setIsAnswered(false)
    }
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

  const currentQuestionData = exerciseData.questions[currentQuestion]
  // Chercher la section où currentQuestionData est défini et ajouter après:
  const pdfUrl = currentQuestionData?.pdf || null

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <CourseBreadcrumb level={level} subLevel={`${grade} - ${formatSubject(subject)}`} />
        <h1 className="text-2xl font-bold mb-2">{exerciseData.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{exerciseData.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestion + 1} sur {exerciseData.questions.length}
          </span>
          <span className="text-sm font-medium">
            Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)}
          </span>
        </div>
        <Progress value={(currentQuestion / exerciseData.questions.length) * 100} className="h-2" />
      </div>

      {currentQuestionData && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">{currentQuestionData.question}</h2>
              <RadioGroup value={selectedAnswer} className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer ${
                      isAnswered && option === currentQuestionData.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : isAnswered && option === selectedAnswer && option !== currentQuestionData.correctAnswer
                          ? "border-red-500 bg-red-50"
                          : selectedAnswer === option
                            ? "border-blue-500"
                            : ""
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswered} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                    {isAnswered && option === currentQuestionData.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {isAnswered && option === selectedAnswer && option !== currentQuestionData.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>

            {isAnswered && (
              <div className="p-4 bg-slate-50 rounded-md mb-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Explication</h3>
                    <p className="text-slate-600">{currentQuestionData.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Question précédente
              </Button>

              {!isAnswered ? (
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
                  Vérifier
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestion < exerciseData.questions.length - 1 ? (
                    <>
                      Question suivante <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    "Terminer l'exercice"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        {pdfUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(`/pdfs/${pdfUrl}`, "_blank")}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Télécharger PDF
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate(`/cours/${level}/${grade}`)}>
          Retour au programme
        </Button>
        <Button onClick={() => navigate(`/cours/${level}/${grade}/videos/${subject}/video-related-to-${slug}`)}>
          Voir la vidéo associée
        </Button>
      </div>
    </div>
  )
}
