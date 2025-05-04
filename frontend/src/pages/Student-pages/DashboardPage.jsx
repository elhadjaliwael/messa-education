import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, BookOpen, Clock, Award, ChevronRight, Bell } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAuth from "@/hooks/useAuth"
import { AttendanceTracker } from "@/components/AttendanceTracker"
import { axiosPrivate } from "@/api/axios"

export default function DashboardPage() {
  const [selectedParent, setSelectedParent] = useState("")
  const [completedExercises, setCompletedExercises] = useState([])
  // Initialize analytics with default empty structure
  const [analytics, setAnalytics] = useState({
    stats: {
      totalCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalTimeSpent: 0,
      certificatesEarned: 0
    },
    courseProgress: [],
    recentActivities: [],
    certificates: [],
    activities: [],
  });
  const { auth } = useAuth();
  console.log(analytics)
  
  // Fix useEffect with proper error handling and dependency
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosPrivate.get('/courses/analytics/dashboard');
        console.log("API Response:", response.data);
        if (response.data) {
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    
    fetchAnalytics();
  }, [axiosPrivate]);
  const toggleExercise = (exerciseId) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }

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
  // Calculate overall progress
  const totalExercises = subjects.reduce((acc, subject) => acc + subject.exercises.length, 0)
  const overallProgress = Math.round((completedExercises.length / totalExercises) * 100) || 0

  return (
    <div className="w-full max-w-full">
      {/* Welcome section with avatar */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Bienvenue, {auth.user.username}!</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Voici un aperçu de votre progression d'apprentissage</p>
        </div>
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={auth.user.avatar} alt="Alex" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Cours en cours</h3>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-500">{analytics.stats.totalCourses}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Cours terminés</h3>
              <ChevronRight className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-500">{analytics.stats.completedCourses}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Heures d'étude</h3>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-500">{(((analytics.stats.totalTimeSpent)/60)/60).toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Certificats</h3>
              <Award className="h-5 w-5 text-purple-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-500">{analytics.stats.certificatesEarned}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-5 gap-4">
        <Card className="md:col-span-2 h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Échéances à venir</CardTitle>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deadlines.map((deadline) => (
                <Dialog key={deadline.id}>
                  <DialogTrigger asChild>
                    <div className="flex cursor-pointer items-center justify-between border-b pb-4 last:border-0 last:pb-0 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 p-2 rounded-md">
                      <div className="flex gap-3">
                        <CalendarDays className="h-10 w-10 text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full" />
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-slate-50">{deadline.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{deadline.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                          {deadline.dueDate.toLocaleDateString()}
                        </p>
                        <p className={`text-xs ${
                          Math.ceil((deadline.dueDate.getTime() - Date.now()) / 86400000) <= 2
                            ? "text-red-500 font-medium"
                            : "text-slate-600 dark:text-slate-400"
                        }`}>
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
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline">Rappel</Button>
                        <Button>Marquer comme terminé</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-1 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progression et Assiduité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress section */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold">Progression globale</h3>
                <span className="text-xl font-bold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2 bg-blue-200" indicatorClassName="bg-white" />
              <div className="mt-3 text-xs opacity-90">
                {completedExercises.length} exercices complétés sur {totalExercises}
              </div>
            </div>
            
            {/* Attendance Tracker Component */}
            <AttendanceTracker activities={analytics.activities} />
          </CardContent>
        </Card>
      </div>


      {/* Main content section with subjects table and progress/attendance */}
      <div className="mt-4">
        {/* Subjects Table - Scrollable Horizontal */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Progression par matière</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[600px]">
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
                              <Progress 
                                value={subject.progress} 
                                className="h-2 w-full max-w-[100px]"
                                indicatorClassName={
                                  subject.progress >= 80
                                    ? "bg-green-500"
                                    : subject.progress >= 50
                                      ? "bg-blue-500"
                                      : subject.progress >= 30
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }
                              />
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{subject.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {subject.exercises.map((exercise) => (
                                <div
                                  key={exercise.id}
                                  className={`flex items-center gap-2 p-1.5 rounded-md transition-colors ${
                                    completedExercises.includes(exercise.id)
                                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                                      : "bg-slate-50 dark:bg-slate-800 border border-transparent"
                                  }`}
                                >
                                  <Checkbox 
                                    id={exercise.id} 
                                    checked={completedExercises.includes(exercise.id)}
                                    onCheckedChange={() => toggleExercise(exercise.id)}
                                  />
                                  <Label 
                                    htmlFor={exercise.id} 
                                    className={`text-sm cursor-pointer ${
                                      completedExercises.includes(exercise.id) ? "line-through opacity-70" : ""
                                    }`}
                                  >
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
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
  )
}