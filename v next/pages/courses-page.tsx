"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, FileText, BarChart3 } from "lucide-react"

export function CoursesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedLevel, setSelectedLevel] = useState("")

  const levels = [
    {
      id: "primaire",
      name: "Primaire",
      description: "Préparatoire à 6ème",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-600 dark:text-amber-400"
        >
          <path d="M8 10a2 2 0 0 0 4 0H8Z"></path>
          <path d="M10 2v4"></path>
          <path d="M3 18a7 7 0 0 1 14 0"></path>
          <path d="M18 18h3"></path>
          <path d="M3 18h3"></path>
        </svg>
      ),
      color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20",
    },
    {
      id: "college",
      name: "Collège",
      description: "7ème à 9ème",
      icon: <BookOpen className="text-blue-600 dark:text-blue-400" />,
      color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20",
    },
    {
      id: "lycee",
      name: "Lycée",
      description: "1ère, 2ème, Bac",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600 dark:text-green-400"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
        </svg>
      ),
      color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20",
    },
  ]

  const resources = [
    {
      id: "videos",
      title: "Leçons en vidéo",
      description: "Cours filmés et explications détaillées",
      icon: <Video className="text-blue-600 dark:text-blue-400" />,
      color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20",
    },
    {
      id: "exercises",
      title: "Exercices interactifs",
      description: "Pratique et apprentissage actif",
      icon: <FileText className="text-green-600 dark:text-green-400" />,
      color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20",
    },
    {
      id: "quizzes",
      title: "Quiz d'évaluation",
      description: "Testez vos connaissances",
      icon: <BarChart3 className="text-amber-600 dark:text-amber-400" />,
      color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20",
    },
  ]

  const freeCourses = [
    {
      id: 1,
      title: "Introduction à l'algèbre",
      subject: "Mathématiques",
      level: "5ème",
      image: "/placeholder.svg?height=200&width=400",
      color: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      id: 2,
      title: "Grammaire de base",
      subject: "Français",
      level: "5ème",
      image: "/placeholder.svg?height=200&width=400",
      color: "bg-green-100 dark:bg-green-900/20",
    },
    {
      id: 3,
      title: "Le corps humain",
      subject: "Sciences",
      level: "4ème",
      image: "/placeholder.svg?height=200&width=400",
      color: "bg-amber-100 dark:bg-amber-900/20",
    },
    {
      id: 4,
      title: "La Révolution française",
      subject: "Histoire",
      level: "3ème",
      image: "/placeholder.svg?height=200&width=400",
      color: "bg-red-100 dark:bg-red-900/20",
    },
  ]

  const handleLevelClick = (levelId) => {
    navigate(`/cours/${levelId}`)
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Cours</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Accédez à tous les cours et ressources pédagogiques</p>
      </div>

      {/* Choisissez votre niveau */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Choisissez votre niveau</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((level) => (
            <div key={level.id} className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
              <div className="p-6 flex flex-col items-center">
                <div className={`mb-4 p-3 rounded-full ${level.color.split(" ").slice(2).join(" ")}`}>{level.icon}</div>
                <h3 className={`text-lg font-semibold ${level.color.split(" ").slice(0, 2).join(" ")}`}>
                  {level.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">{level.description}</p>
              </div>
              <Button
                className="w-full rounded-t-none bg-slate-800 hover:bg-slate-700 text-white"
                onClick={() => handleLevelClick(level.id)}
              >
                Accéder
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Nos ressources pédagogiques */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Nos ressources pédagogiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="border rounded-lg p-6 bg-white dark:bg-slate-950">
              <div className="flex flex-col items-center text-center">
                <div className={`mb-4 p-3 rounded-full ${resource.color.split(" ").slice(2).join(" ")}`}>
                  {resource.icon}
                </div>
                <h3 className={`text-lg font-semibold ${resource.color.split(" ").slice(0, 2).join(" ")}`}>
                  {resource.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{resource.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cours gratuits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Cours gratuits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {freeCourses.map((course) => (
            <div key={course.id} className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
              <div className={`aspect-video flex items-center justify-center ${course.color}`}>
                <span className="text-lg font-medium">{course.subject}</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-slate-900 dark:text-slate-50">{course.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Niveau: {course.level}</p>
                <Button className="w-full mt-4">Commencer</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
