"use client"
import { CourseBreadcrumb } from "../../components/course-breadcrumb"
import { LearningTools } from "../../components/learning-tools"
import { BookOpen, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PrimairePage() {
  const navigate = useNavigate()

  const grades = [
    {
      id: "1ere",
      name: "1ère année",
      subjects: 4,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    },
    {
      id: "2eme",
      name: "2ème année",
      subjects: 5,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      id: "3eme",
      name: "3ème année",
      subjects: 4,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
    {
      id: "4eme",
      name: "4ème année",
      subjects: 4,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      id: "5eme",
      name: "5ème année",
      subjects: 4,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    },
    {
      id: "6eme",
      name: "6ème année",
      subjects: 4,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    },
  ]

  const subjects = [
    "Mathématiques",
    "Français",
    "Sciences",
    "Histoire-Géographie",
    "Éducation civique",
    "Arts plastiques",
  ]

  return (
    <>
      <div className="mb-8">
        <CourseBreadcrumb level="primaire" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Cours Primaire</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Sélectionnez une année pour accéder aux cours correspondants
        </p>
      </div>

      {/* Années scolaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/cours/primaire/${grade.id}`)}
          >
            <div className="flex items-center p-6">
              <div className={`p-3 rounded-full mr-4 ${grade.color.split(" ").slice(0, 2).join(" ")}`}>
                {grade.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{grade.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{grade.subjects} matières</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Matières disponibles */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6">Matières disponibles</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
