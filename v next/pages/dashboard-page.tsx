"use client"

import { useState } from "react"
import { ProgressionChart } from "../components/progress-chart"
import { AttendanceTracker } from "../components/attendance-tracker"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ReviewDialog } from "../components/review-dialog"
import { SubscriptionInfo } from "../components/subscription-info"

export function DashboardPage() {
  const [selectedParent, setSelectedParent] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)

  const subjects = [
    {
      id: 1,
      name: "Mathématiques",
      progress: 75,
      exercises: [
        { id: "math-1", title: "Équations du second degré" },
        { id: "math-2", title: "Fonctions dérivées" },
        { id: "math-3", title: "Probabilités" },
      ],
    },
    {
      id: 2,
      name: "Français",
      progress: 60,
      exercises: [
        { id: "fr-1", title: "Analyse de texte" },
        { id: "fr-2", title: "Dissertation" },
        { id: "fr-3", title: "Conjugaison" },
      ],
    },
    {
      id: 3,
      name: "Histoire-Géographie",
      progress: 45,
      exercises: [
        { id: "hist-1", title: "Révolution française" },
        { id: "hist-2", title: "Seconde Guerre mondiale" },
        { id: "hist-3", title: "Géopolitique" },
      ],
    },
    {
      id: 4,
      name: "Sciences",
      progress: 80,
      exercises: [
        { id: "sci-1", title: "Corps humain" },
        { id: "sci-2", title: "Électricité" },
        { id: "sci-3", title: "Chimie organique" },
      ],
    },
  ]

  const deadlines = [
    {
      id: 1,
      title: "Devoir de mathématiques",
      subject: "Mathématiques",
      dueDate: new Date(Date.now() + 1 * 86400000),
      description: "Exercices sur les équations du second degré",
    },
    {
      id: 2,
      title: "Dissertation",
      subject: "Français",
      dueDate: new Date(Date.now() + 3 * 86400000),
      description: "Analyse d'un texte de Victor Hugo",
    },
    {
      id: 3,
      title: "Exposé",
      subject: "Histoire",
      dueDate: new Date(Date.now() + 7 * 86400000),
      description: "Présentation sur la Révolution française",
    },
  ]

  const handleSubmitReview = () => {
    // Ici, vous pourriez envoyer l'avis à votre backend
    console.log("Avis soumis:", { rating, reviewText })
    setShowReviewForm(false)
    setReviewText("")
    // Vous pourriez ajouter l'avis à la liste des avis existants
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Bienvenue, Alex!</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Voici un aperçu de votre progression d'apprentissage</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Cours en cours</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-500">4</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Cours terminés</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-500">12</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Heures d'étude</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-500">87</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Certificats</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-500">3</p>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="mb-8">
        <SubscriptionInfo
          type="annual"
          startDate={new Date(2023, 8, 1)}
          endDate={new Date(2024, 7, 31)}
          price={199.99}
          status="active"
        />
      </div>

      {/* Attendance Tracker */}
      <div className="mb-8">
        <AttendanceTracker />
      </div>

      {/* Progression Chart */}
      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-50">Progression globale</h2>
        <ProgressionChart />
      </div>

      {/* Subjects Table - Scrollable Horizontal */}
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-50">Progression par matière</h2>
      <div className="mb-8 overflow-x-auto">
        <table className="w-full min-w-[600px] rounded-lg border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <thead>
            <tr className="border-b dark:border-slate-800">
              <th className="p-4 text-left font-medium text-slate-900 dark:text-slate-50">Matière</th>
              <th className="p-4 text-left font-medium text-slate-900 dark:text-slate-50">Progression</th>
              <th className="p-4 text-left font-medium text-slate-900 dark:text-slate-50">Exercices à faire</th>
            </tr>
          </thead>
          <tbody>
            {subjects
              .sort((a, b) => b.progress - a.progress)
              .map((subject) => (
                <tr key={subject.id} className="border-b last:border-0 dark:border-slate-800">
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-50">{subject.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full max-w-[100px] rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className={`h-2 rounded-full ${
                            subject.progress >= 80
                              ? "bg-green-500"
                              : subject.progress >= 50
                                ? "bg-blue-500"
                                : subject.progress >= 30
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{subject.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {subject.exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-md"
                        >
                          <Checkbox id={exercise.id} />
                          <Label htmlFor={exercise.id} className="text-sm cursor-pointer">
                            {exercise.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Deadlines */}
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-50">Échéances à venir</h2>
      <div className="rounded-lg border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="p-4">
          <div className="space-y-4">
            {deadlines.map((deadline) => (
              <Dialog key={deadline.id}>
                <DialogTrigger asChild>
                  <div className="flex cursor-pointer items-center justify-between border-b pb-4 last:border-0 last:pb-0 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 p-2 rounded-md">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-slate-50">{deadline.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{deadline.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        {deadline.dueDate.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {Math.ceil((deadline.dueDate.getTime() - Date.now()) / 86400000)} jour(s) restant(s)
                      </p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{deadline.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <p className="text-sm font-medium">Matière: {deadline.subject}</p>
                      <p className="text-sm">Date limite: {deadline.dueDate.toLocaleDateString()}</p>
                      <p className="mt-2 text-sm">{deadline.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sélectionner un parent superviseur</label>
                      <Select value={selectedParent} onValueChange={setSelectedParent}>
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue placeholder="Choisir un parent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent1">Parent 1</SelectItem>
                          <SelectItem value="parent2">Parent 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>

      {/* Student Reviews */}
      <h2 className="mb-4 mt-8 text-xl font-semibold text-slate-900 dark:text-slate-50">Avis et commentaires</h2>
      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 space-y-4">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="font-medium">Julie D.</span>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-yellow-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Les cours de mathématiques sont très bien expliqués. J'ai beaucoup progressé grâce aux exercices
              interactifs.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>TM</AvatarFallback>
                </Avatar>
                <span className="font-medium">Thomas M.</span>
              </div>
              <div className="flex">
                {[1, 2, 3, 4].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-yellow-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-slate-300 dark:text-slate-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              La plateforme est intuitive et facile à utiliser. J'aimerais plus d'exercices en français.
            </p>
          </div>
        </div>
        <div className="border-t pt-4 dark:border-slate-800">
          <Button variant="outline" className="w-full" onClick={() => setShowReviewForm(true)}>
            Laisser un avis
          </Button>
        </div>

        <ReviewDialog
          open={showReviewForm}
          onOpenChange={setShowReviewForm}
          onSubmit={(rating, text) => {
            console.log("Avis soumis:", { rating, text })
            setShowReviewForm(false)
            // Ici, vous pourriez ajouter l'avis à la liste des avis existants
          }}
        />
      </div>
    </>
  )
}
