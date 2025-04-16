"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CourseBreadcrumb } from "../../../components/course-breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Clock, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DeuxiemeAnneePage() {
  const [selectedTab, setSelectedTab] = useState("videos")
  const navigate = useNavigate()

  // Données pour l'onglet Vidéos
  const videosData = {
    mathematiques: {
      title: "Mathématiques",
      count: "5 vidéos",
      videos: [
        { id: "v1", title: "Les nombres jusqu'à 100", duration: "14:30", slug: "nombres-jusqua-100" },
        { id: "v2", title: "Addition à deux chiffres", duration: "16:45", slug: "addition-deux-chiffres" },
        { id: "v3", title: "Soustraction à deux chiffres", duration: "15:20", slug: "soustraction-deux-chiffres" },
        { id: "v4", title: "Introduction à la multiplication", duration: "18:10", slug: "introduction-multiplication" },
        {
          id: "v5",
          title: "Les formes géométriques avancées",
          duration: "12:35",
          slug: "formes-geometriques-avancees",
        },
      ],
    },
    francais: {
      title: "Français",
      count: "4 vidéos",
      videos: [
        { id: "v1", title: "La phrase simple", duration: "13:20", slug: "phrase-simple" },
        { id: "v2", title: "Les noms communs et propres", duration: "11:45", slug: "noms-communs-propres" },
        { id: "v3", title: "Les verbes d'action", duration: "14:50", slug: "verbes-action" },
        { id: "v4", title: "La ponctuation", duration: "10:30", slug: "ponctuation" },
      ],
    },
  }

  // Données pour l'onglet Exercices
  const exercisesData = {
    mathematiques: {
      title: "Mathématiques",
      count: "6 exercices",
      exercises: [
        {
          id: "e1",
          title: "Compter jusqu'à 100",
          questions: "20 questions",
          progress: 75,
          slug: "compter-jusqua-100",
        },
        {
          id: "e2",
          title: "Additions avec retenue",
          questions: "15 questions",
          progress: 50,
          slug: "additions-avec-retenue",
        },
        {
          id: "e3",
          title: "Soustractions avec emprunt",
          questions: "15 questions",
          progress: 25,
          slug: "soustractions-avec-emprunt",
        },
        {
          id: "e4",
          title: "Tables de multiplication",
          questions: "20 questions",
          progress: 0,
          slug: "tables-multiplication",
        },
      ],
    },
    francais: {
      title: "Français",
      count: "5 exercices",
      exercises: [
        {
          id: "e1",
          title: "Construire des phrases",
          questions: "12 questions",
          progress: 80,
          slug: "construire-phrases",
        },
        {
          id: "e2",
          title: "Identifier les noms",
          questions: "15 questions",
          progress: 60,
          slug: "identifier-noms",
        },
        {
          id: "e3",
          title: "Conjuguer au présent",
          questions: "18 questions",
          progress: 40,
          slug: "conjuguer-present",
        },
        {
          id: "e4",
          title: "Utiliser la ponctuation",
          questions: "10 questions",
          progress: 20,
          slug: "utiliser-ponctuation",
        },
      ],
    },
  }

  // Données pour l'onglet Quiz
  const quizData = {
    mathematiques: {
      title: "Mathématiques",
      count: "4 quiz",
      quizzes: [
        {
          id: "q1",
          title: "Quiz - Nombres jusqu'à 100",
          duration: "15 minutes",
          status: "completed",
          score: 85,
          slug: "quiz-nombres-100",
        },
        {
          id: "q2",
          title: "Quiz - Additions et soustractions",
          duration: "20 minutes",
          status: "completed",
          score: 70,
          slug: "quiz-additions-soustractions",
        },
        {
          id: "q3",
          title: "Quiz - Multiplication",
          duration: "15 minutes",
          status: "new",
          slug: "quiz-multiplication",
        },
        {
          id: "q4",
          title: "Quiz - Géométrie",
          duration: "12 minutes",
          status: "new",
          slug: "quiz-geometrie",
        },
      ],
    },
    francais: {
      title: "Français",
      count: "3 quiz",
      quizzes: [
        {
          id: "q1",
          title: "Quiz - Structure de phrases",
          duration: "15 minutes",
          status: "completed",
          score: 90,
          slug: "quiz-structure-phrases",
        },
        {
          id: "q2",
          title: "Quiz - Noms et verbes",
          duration: "18 minutes",
          status: "completed",
          score: 75,
          slug: "quiz-noms-verbes",
        },
        {
          id: "q3",
          title: "Quiz - Ponctuation",
          duration: "10 minutes",
          status: "new",
          slug: "quiz-ponctuation",
        },
      ],
    },
  }

  // Fonction pour naviguer vers la page de contenu
  const navigateToContent = (type, subject, slug) => {
    navigate(`/cours/primaire/2eme/${type}/${subject}/${slug}`)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <CourseBreadcrumb level="primaire" subLevel="2ème année" />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">2ème année - Programme</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Progression globale: 58%</span>
            <Progress value={58} className="w-32 h-2" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="videos" value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="mb-8 border-b w-full justify-start rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger
            value="videos"
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              "flex items-center gap-2",
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 8L16 12L10 16V8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Vidéos
          </TabsTrigger>
          <TabsTrigger
            value="exercises"
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              "flex items-center gap-2",
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Exercices
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              "flex items-center gap-2",
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Quiz
          </TabsTrigger>
        </TabsList>

        {/* Contenu des onglets similaire à la première année, mais avec les données de la deuxième année */}
        {/* Contenu de l'onglet Vidéos */}
        <TabsContent value="videos" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mathématiques */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-medium">Mathématiques</h2>
                <span className="text-xs text-slate-500 ml-auto">{videosData.mathematiques.count}</span>
              </div>
              <ul className="space-y-4">
                {videosData.mathematiques.videos.map((video) => (
                  <li
                    key={video.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded-md"
                    onClick={() => navigateToContent("videos", "mathematiques", video.slug)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <span>{video.title}</span>
                    </div>
                    <span className="text-xs text-slate-500">{video.duration}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Français */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-medium">Français</h2>
                <span className="text-xs text-slate-500 ml-auto">{videosData.francais.count}</span>
              </div>
              <ul className="space-y-4">
                {videosData.francais.videos.map((video) => (
                  <li
                    key={video.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded-md"
                    onClick={() => navigateToContent("videos", "francais", video.slug)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <span>{video.title}</span>
                    </div>
                    <span className="text-xs text-slate-500">{video.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Contenu de l'onglet Exercices */}
        <TabsContent value="exercises" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mathématiques */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-medium">Mathématiques</h2>
                <span className="text-xs text-slate-500 ml-auto">{exercisesData.mathematiques.count}</span>
              </div>
              <ul className="space-y-6">
                {exercisesData.mathematiques.exercises.map((exercise) => (
                  <li key={exercise.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 2V8H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 13H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 17H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9H9H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{exercise.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{exercise.questions}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Progression:</span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${exercise.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-3"
                        onClick={() => navigateToContent("exercises", "mathematiques", exercise.slug)}
                      >
                        {exercise.progress > 0 ? "Continuer" : "Commencer"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Français */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-medium">Français</h2>
                <span className="text-xs text-slate-500 ml-auto">{exercisesData.francais.count}</span>
              </div>
              <ul className="space-y-6">
                {exercisesData.francais.exercises.map((exercise) => (
                  <li key={exercise.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 2V8H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 13H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 17H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 9H9H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{exercise.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{exercise.questions}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Progression:</span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${exercise.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-3"
                        onClick={() => navigateToContent("exercises", "francais", exercise.slug)}
                      >
                        {exercise.progress > 0 ? "Continuer" : "Commencer"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Contenu de l'onglet Quiz */}
        <TabsContent value="quiz" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mathématiques */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-medium">Mathématiques</h2>
                <span className="text-xs text-slate-500 ml-auto">{quizData.mathematiques.count}</span>
              </div>
              <ul className="space-y-6">
                {quizData.mathematiques.quizzes.map((quiz) => (
                  <li key={quiz.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>{quiz.title}</span>
                      {quiz.status === "new" && (
                        <span className="ml-auto text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full">
                          Nouveau
                        </span>
                      )}
                      {quiz.status === "completed" && quiz.score === 100 && (
                        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          100%
                        </span>
                      )}
                      {quiz.status === "completed" && quiz.score !== 100 && (
                        <span className="ml-auto text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          {quiz.score}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{quiz.duration}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={quiz.status === "completed" ? "outline" : "default"}
                        className="text-xs h-7 px-3"
                        onClick={() => navigateToContent("quiz", "mathematiques", quiz.slug)}
                      >
                        {quiz.status === "completed" ? "Refaire" : "Commencer"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Français */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-medium">Français</h2>
                <span className="text-xs text-slate-500 ml-auto">{quizData.francais.count}</span>
              </div>
              <ul className="space-y-6">
                {quizData.francais.quizzes.map((quiz) => (
                  <li key={quiz.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>{quiz.title}</span>
                      {quiz.status === "new" && (
                        <span className="ml-auto text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full">
                          Nouveau
                        </span>
                      )}
                      {quiz.status === "completed" && quiz.score === 100 && (
                        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          100%
                        </span>
                      )}
                      {quiz.status === "completed" && quiz.score !== 100 && (
                        <span className="ml-auto text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          {quiz.score}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{quiz.duration}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={quiz.status === "completed" ? "outline" : "default"}
                        className="text-xs h-7 px-3"
                        onClick={() => navigateToContent("quiz", "francais", quiz.slug)}
                      >
                        {quiz.status === "completed" ? "Refaire" : "Commencer"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
