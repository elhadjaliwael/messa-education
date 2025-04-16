"use client"
import { CourseBreadcrumb } from "../../components/course-breadcrumb"
import { LearningTools } from "../../components/learning-tools"
import { BookOpen, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CollegePage() {
  const navigate = useNavigate()

  const grades = [
    {
      id: "7eme",
      name: "7ème année",
      subjects: 6,
      courses: 24,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      id: "8eme",
      name: "8ème année",
      subjects: 8,
      courses: 28,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
    {
      id: "9eme",
      name: "9ème année",
      subjects: 10,
      courses: 32,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
  ]

  const subjects = [
    "Mathématiques",
    "Français",
    "Anglais",
    "Histoire-Géographie",
    "Sciences physiques",
    "Sciences de la vie et de la Terre",
    "Technologie",
    "Éducation physique",
    "Arts plastiques",
    "Éducation musicale",
  ]

  return (
    <>
      <div className="mb-8">
        <CourseBreadcrumb level="college" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Cours du Collège</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Sélectionnez votre niveau pour accéder aux cours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/cours/college/${grade.id}`)}
          >
            <div className="flex items-center p-6">
              <div className={`p-3 rounded-full mr-4 ${grade.color.split(" ").slice(0, 2).join(" ")}`}>
                {grade.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{grade.name}</h3>
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>{grade.subjects} matières</span>
                  <span>{grade.courses} cours</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Matières disponibles */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6">Matières disponibles</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-white dark:bg-slate-950 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-sm font-medium">{subject}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outils d'apprentissage */}
      <LearningTools />
    </>
  )
}
