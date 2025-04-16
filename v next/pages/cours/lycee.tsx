"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseBreadcrumb } from "../../components/course-breadcrumb"
import { LearningTools } from "../../components/learning-tools"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { BookOpen, ChevronRight } from "lucide-react"

export default function LyceePage() {
  const navigate = useNavigate()
  const [selectedGrade, setSelectedGrade] = useState("1ere")

  const grades = [
    { id: "1ere", name: "1ère année" },
    { id: "2eme", name: "2ème année" },
    { id: "3eme", name: "3ème année" },
    { id: "4eme", name: "4ème année" },
  ]

  // Sections filtrées par année
  const sectionsByGrade = {
    "1ere": [], // Pas de sections pour la 1ère année, on affiche directement le contenu
    "2eme": [
      {
        id: "economie",
        name: "Section Économie",
        courses: 25,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      },
      {
        id: "sciences",
        name: "Section Sciences",
        courses: 30,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      },
      {
        id: "informatique",
        name: "Section Informatique",
        courses: 28,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      },
      {
        id: "lettres",
        name: "Section Lettres",
        courses: 20,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
      },
    ],
    "3eme": [
      {
        id: "economie",
        name: "Section Économie",
        courses: 28,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      },
      {
        id: "sciences",
        name: "Section Sciences",
        courses: 32,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      },
      {
        id: "informatique",
        name: "Section Informatique",
        courses: 30,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      },
      {
        id: "lettres",
        name: "Section Lettres",
        courses: 22,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
      },
    ],
    "4eme": [
      {
        id: "economie",
        name: "Section Économie",
        courses: 30,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      },
      {
        id: "sciences",
        name: "Section Sciences",
        courses: 35,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      },
      {
        id: "informatique",
        name: "Section Informatique",
        courses: 32,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      },
      {
        id: "lettres",
        name: "Section Lettres",
        courses: 25,
        icon: <BookOpen className="h-5 w-5" />,
        color: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
      },
    ],
  }

  // Gérer la navigation en fonction de l'année sélectionnée
  const handleGradeSelection = (gradeId) => {
    setSelectedGrade(gradeId)

    // Pour la 1ère année, naviguer directement vers la page de contenu
    if (gradeId === "1ere") {
      navigate(`/cours/lycee/1ere`)
    }
  }

  return (
    <>
      <div className="mb-8">
        <CourseBreadcrumb level="lycee" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Sélectionnez votre niveau</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Choisissez votre niveau et votre section pour accéder aux cours
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950 mb-6 shadow-sm">
        <Tabs defaultValue="1ere" value={selectedGrade} onValueChange={handleGradeSelection}>
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
              {grades.map((grade) => (
                <TabsTrigger
                  key={grade.id}
                  value={grade.id}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    selectedGrade === grade.id ? "border-green-600 font-medium" : "",
                  )}
                >
                  {grade.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {grades.map((grade) => (
            <TabsContent key={grade.id} value={grade.id} className="p-6">
              {grade.id === "1ere" ? (
                <div className="text-center p-8">
                  <h3 className="text-xl font-medium mb-4">Accéder directement au contenu de la 1ère année</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Cliquez sur le bouton ci-dessous pour accéder aux vidéos, exercices et quiz de la 1ère année.
                  </p>
                  <Button onClick={() => navigate(`/cours/lycee/1ere`)} className="bg-blue-600 hover:bg-blue-700">
                    Accéder au contenu
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {sectionsByGrade[grade.id].map((section) => (
                    <div
                      key={section.id}
                      className="border rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/cours/lycee/${grade.id}/${section.id}`)}
                    >
                      <div className="flex items-center p-4">
                        <div className={`p-3 rounded-full mr-4 ${section.color.split(" ").slice(0, 2).join(" ")}`}>
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{section.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {section.courses} cours disponibles
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Outils d'apprentissage */}
      <LearningTools />
    </>
  )
}
