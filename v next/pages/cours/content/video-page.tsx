"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CourseBreadcrumb } from "../../../components/course-breadcrumb"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react"

export default function VideoPage() {
  const { level, grade, type, subject, slug } = useParams()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    duration: "",
    nextVideo: null,
    prevVideo: null,
  })

  // Simuler le chargement des données de la vidéo
  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    const fetchVideoData = () => {
      // Données simulées
      const data = {
        title: slug
          ? slug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Vidéo",
        description: "Cette vidéo explique les concepts fondamentaux de cette matière de manière claire et concise.",
        duration: "15:30",
        nextVideo: {
          slug: "video-suivante",
          title: "Vidéo suivante",
        },
        prevVideo: {
          slug: "video-precedente",
          title: "Vidéo précédente",
        },
      }
      setVideoData(data)
    }

    fetchVideoData()

    // Simuler la progression de la vidéo
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return isPlaying ? prev + 0.5 : prev
      })
    }, 100)

    return () => clearInterval(interval)
  }, [slug, isPlaying])

  const handleNavigate = (direction) => {
    if (direction === "next" && videoData.nextVideo) {
      navigate(`/cours/${level}/${grade}/${type}/${subject}/${videoData.nextVideo.slug}`)
    } else if (direction === "prev" && videoData.prevVideo) {
      navigate(`/cours/${level}/${grade}/${type}/${subject}/${videoData.prevVideo.slug}`)
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

  const formatLevel = (level) => {
    switch (level) {
      case "primaire":
        return "Primaire"
      case "college":
        return "Collège"
      case "lycee":
        return "Lycée"
      default:
        return level.charAt(0).toUpperCase() + level.slice(1)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <CourseBreadcrumb level={level} subLevel={`${grade} - ${formatSubject(subject)}`} />
        <h1 className="text-2xl font-bold mb-2">{videoData.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{videoData.description}</p>
      </div>

      <div className="mb-8 rounded-lg overflow-hidden border bg-black aspect-video relative">
        {/* Placeholder pour la vidéo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-lg">Vidéo: {videoData.title}</div>
        </div>

        {/* Contrôles de la vidéo */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-white text-sm">
              {Math.floor((progress / 100) * Number.parseInt(videoData.duration))}:00 / {videoData.duration}
            </div>
            <div className="text-white text-sm">
              {formatSubject(subject)} - {videoData.title}
            </div>
          </div>
          <Progress value={progress} className="h-1 mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => handleNavigate("prev")}
                disabled={!videoData.prevVideo}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Précédent
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => handleNavigate("next")}
                disabled={!videoData.nextVideo}
              >
                Suivant <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">À propos de cette vidéo</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Cette vidéo fait partie du programme de {formatLevel(level)} {grade} en {formatSubject(subject)}. Elle vous
            permettra de comprendre les concepts fondamentaux nécessaires pour progresser dans cette matière.
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            Après avoir regardé cette vidéo, nous vous recommandons de faire les exercices associés pour renforcer votre
            compréhension et tester vos connaissances.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Vidéos recommandées</h2>
          <div className="space-y-4">
            <div className="border rounded-md p-3 hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Introduction aux fractions</h3>
              <p className="text-sm text-slate-500">12:45 • {formatSubject(subject)}</p>
            </div>
            <div className="border rounded-md p-3 hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Multiplication et division</h3>
              <p className="text-sm text-slate-500">14:20 • {formatSubject(subject)}</p>
            </div>
            <div className="border rounded-md p-3 hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Problèmes mathématiques</h3>
              <p className="text-sm text-slate-500">18:10 • {formatSubject(subject)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate(`/cours/${level}/${grade}`)}>
          Retour au programme
        </Button>
        <Button onClick={() => navigate(`/cours/${level}/${grade}/exercises/${subject}/exercise-related-to-${slug}`)}>
          Faire les exercices
        </Button>
      </div>
    </div>
  )
}
