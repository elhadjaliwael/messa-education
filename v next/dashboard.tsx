"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Header } from "./components/header"
import { Sidebar } from "./components/sidebar"
import { MobileNav } from "./components/mobile-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "./hooks/use-sidebar"
import { DashboardPage } from "./pages/dashboard-page"
import { CoursesPage } from "./pages/courses-page"
import { MessagesPage } from "./pages/messages-page"
import { SettingsPage } from "./pages/settings-page"
import PrimairePage from "./pages/cours/primaire"
import CollegePage from "./pages/cours/college"
import LyceePage from "./pages/cours/lycee"
import PremiereAnneePage from "./pages/cours/primaire/premiere-annee"
import DeuxiemeAnneePage from "./pages/cours/primaire/deuxieme-annee"
import SeptiemeAnneePage from "./pages/cours/college/septieme-annee"
import PremiereAnneeLyceePage from "./pages/cours/lycee/premiere-annee"
import VideoPage from "./pages/cours/content/video-page"
import ExercisePage from "./pages/cours/content/exercise-page"
import QuizPage from "./pages/cours/content/quiz-page"

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SidebarProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4 md:p-6 pt-6">
                <div className="mx-auto max-w-7xl">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />

                    {/* Routes pour les niveaux scolaires */}
                    <Route path="/cours/primaire" element={<PrimairePage />} />
                    <Route path="/cours/college" element={<CollegePage />} />
                    <Route path="/cours/lycee" element={<LyceePage />} />

                    {/* Routes pour les années spécifiques */}
                    <Route path="/cours/primaire/1ere" element={<PremiereAnneePage />} />
                    <Route path="/cours/primaire/2eme" element={<DeuxiemeAnneePage />} />
                    <Route path="/cours/college/7eme" element={<SeptiemeAnneePage />} />
                    <Route path="/cours/lycee/1ere" element={<PremiereAnneeLyceePage />} />

                    {/* Routes pour les contenus spécifiques */}
                    <Route path="/cours/:level/:grade/videos/:subject/:slug" element={<VideoPage />} />
                    <Route path="/cours/:level/:grade/exercises/:subject/:slug" element={<ExercisePage />} />
                    <Route path="/cours/:level/:grade/quiz/:subject/:slug" element={<QuizPage />} />
                  </Routes>
                </div>
              </main>
            </div>
            <MobileNav />
          </div>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  )
}
