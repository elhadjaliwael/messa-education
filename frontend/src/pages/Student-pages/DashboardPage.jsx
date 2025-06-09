import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, BookOpen, Clock, Award, ChevronRight, Bell, BarChart3, Flame } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAuth from "@/hooks/useAuth"
import { AttendanceTracker } from "@/components/AttendanceTracker"
import { axiosPrivate } from "@/api/axios"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from "react-router"
import { NotificationBell } from "@/components/NotificationBell"
import useCourseStore from "@/store/courseStore"

export default function DashboardPage() {
  const navigate = useNavigate()
  // Initialize analytics with default empty structure
  const {assignments,updateAssignments} = useCourseStore()
  console.log(assignments)
  const [analytics, setAnalytics] = useState({
    stats: {
      totalCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalTimeSpent: 0,
      certificatesEarned: 0,
      learningStreak: 0,
      longestStreak: 0
    },
    courseProgress: [],
    recentActivities: [],
    certificates: [],
    activities: [],
    activityByDayOfWeek: [],
    subjectDistribution: [],
    performanceMetrics: {
      averageQuizScore: 0,
      exerciseCompletionRate: 0,
      totalQuizAttempts: 0,
      totalExerciseAttempts: 0
    },
    progressTrend: []
  });
  const { auth } = useAuth();
  console.log(analytics.courseProgress)
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosPrivate.get('/courses/analytics/student/dashboard');
        if (response.data) {
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    const fetchAssignments = async () => {
      try {
        const response = await axiosPrivate.get('/courses/student/assignments');

        updateAssignments(response.data.assignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignments(); // Fetch assignments on component mount
    fetchAnalytics();
  }, [axiosPrivate]);

  const getAssignmentLink = (assignment) => {
    if (assignment.exercise === null) {
      return `/student/courses/${assignment.subject.name.toLowerCase()}/chapters/${assignment.chapter.id}/lessons/${assignment.lesson.id}/quizzes/${assignment.quizz.id}`; 
    } 
    if (assignment.quizz === null) {
      return `/student/courses/${assignment.subject.name.toLowerCase()}/chapters/${assignment.chapter.id}/lessons/${assignment.lesson.id}/exercises/${assignment.exercise.id}`;
    }
  }

  return (
    <div className="w-full max-w-full">
      {/* Welcome section with avatar */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Bienvenue, {auth.user.username}!</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Voici un aperçu de votre progression d'apprentissage</p>
        </div>
        <div className="flex justify-center items-center gap-7">
          <NotificationBell></NotificationBell>
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={auth.user.avatar} alt={auth.user.username} />
            <AvatarFallback>{auth.user.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main dashboard layout - split into two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left section - Stats cards and main content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Cours en cours</h3>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">{analytics.stats.inProgressCourses}</p>
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">cours actifs</span>
                </div>
                <div className="mt-3 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(analytics.stats.inProgressCourses / (analytics.stats.totalCourses || 1)) * 100}%` }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Cours terminés</h3>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <ChevronRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-500">{analytics.stats.completedCourses}</p>
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">cours complétés</span>
                </div>
                <div className="mt-3 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${(analytics.stats.completedCourses / (analytics.stats.totalCourses || 1)) * 100}%` }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Temps d'étude</h3>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{(analytics.stats.totalTimeSpent/3600).toFixed(1)}</p>
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">heures</span>
                </div>
                <div className="mt-3 flex items-center text-xs text-slate-500">
                  <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-1.5"></span>
                  {analytics.stats.totalTimeSpent > 0 ? 
                    `Moyenne: ${((analytics.stats.totalTimeSpent/3600) / (analytics.stats.completedCourses + analytics.stats.inProgressCourses || 1)).toFixed(1)}h par cours` : 
                    "Pas encore de données"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Course Progress Section */}
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Progression des cours
                </CardTitle>
                <Badge variant="outline" className="px-2 py-1">
                  {analytics.courseProgress.length} cours
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              {analytics.courseProgress.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {analytics.courseProgress.map((course, index) => (
                    <div 
                      key={index} 
                      className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-all"
                    >
                      {/* Course title with icon */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className={`p-2 rounded-lg ${
                          course.progress >= 80 ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                          course.progress >= 50 ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                          "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <h3 className="font-medium text-slate-900 dark:text-slate-50 flex-1 truncate">
                          {course.subject.charAt(0).toUpperCase() + course.subject.slice(1)}
                        </h3>
                        <Badge className={`${
                          course.progress >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          course.progress >= 50 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {course.progress}%
                        </Badge>
                      </div>
                      
                      {/* Progress bar with cleaner design */}
                      <div className="relative h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            course.progress >= 80 ? "bg-green-500" :
                            course.progress >= 50 ? "bg-blue-500" :
                            "bg-amber-500"
                          }`} 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      
                      {/* Footer with last activity and button */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1 inline" />
                          {course.lastAccessed ? 
                            formatDistanceToNow(new Date(course.lastAccessed), { addSuffix: true, locale: fr }) : 
                            'Jamais accédé'}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" 
                          onClick={() => navigate(`/student/courses/${course.subject.toLowerCase()}`)}
                        >
                          Continuer
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  <div className="bg-white dark:bg-slate-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">Vous n'avez pas encore commencé de cours</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Explorez notre catalogue et commencez votre apprentissage</p>
                  <Button 
                    className="mt-2" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/student/courses")}
                  >
                    Explorer les cours
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Activities Section */}
          <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Assignments
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <ScrollArea className="h-full w-full">
                {assignments && assignments.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] pr-2">
                    {assignments.map((assignment, index) => (
                      <div
                        key={
                          assignment._id ||
                          [
                            assignment.type,
                            assignment.subject?.name,
                            assignment.chapter?.id,
                            assignment.lesson?.id,
                            assignment.quiz?.id,
                            assignment.exercise?.id,
                            index // fallback, but should be last resort
                          ].filter(Boolean).join('-')
                        }
                        className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          {/* Simple status dot indicator */}
                          <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
                            assignment.status === "completed" 
                              ? "bg-emerald-500" 
                              : new Date(assignment.dueDate) < new Date() 
                                ? "bg-rose-500" 
                                : "bg-blue-500"
                          }`} />
                          
                          <div className="flex-1 min-w-0">
                            {/* Header with subject and badge */}
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                {assignment.subject?.name || "Devoir sans matière"}
                              </h4>
                              <div className="flex gap-2 items-center">
                                {assignment.exercise === null && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    Quiz
                                  </Badge>
                                )}
                                {assignment.quizz === null && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    Exercice
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs font-normal px-1.5 py-0">
                                  {(() => {
                                    switch (assignment.status) {
                                      case 'completed':
                                        return "Terminé";
                                      case 'late':
                                        return new Date(assignment.dueDate) < new Date() ? "En retard" : "En cours";
                                      case 'in_progress':
                                        return "En cours";
                                      case 'pending':
                                        return "En attente";
                                      default:
                                        return "En cours";
                                    }
                                  })()}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Chapter and lesson info in a single line */}
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                              {assignment.chapter?.title && `${assignment.chapter.title}`}
                              {assignment.chapter?.title && assignment.lesson?.title && " • "}
                              {assignment.lesson?.title && `${assignment.lesson.title}`}
                            </div>
                      
                            
                            {/* Due date and progress in a single line */}
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
  
                              <span>
                                {assignment.dueDate 
                                  ? new Date(assignment.dueDate).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'}) 
                                  : "Pas de date limite"}
                              </span>
                            </div>
                            
                            {/* Notes as a simple text if available */}
                            {assignment.notes && (
                              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                {assignment.notes}
                              </div>
                            )}
                            
                            {/* Button to navigate to assignment */}
                            <div className="mt-3 flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs h-7 px-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                onClick={() => navigate(getAssignmentLink(assignment))}
                              >
                                Accéder au devoir
                                <ChevronRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p className="font-medium">Aucun devoir</p>
                    <p className="text-xs mt-1">Vous n'avez pas de devoirs assignés</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Right section - Progress and attendance */}
        <div className="lg:col-span-4">
          <Card className="top-4 flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4 text-indigo-500" />
                Progression et Assiduité
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto py-3">
              <div className="grid grid-cols-1 gap-4 h-full">
                {/* Learning streak */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white/20 rounded-full p-1.5">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Série d'apprentissage</h3>
                      <p className="text-xs opacity-90">Continuez à apprendre chaque jour!</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <span className="text-2xl font-bold">{analytics.stats.learningStreak}</span>
                      <span className="text-xs ml-1">jours</span>
                    </div>
                    <div className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      Record: {analytics.stats.longestStreak} jours
                    </div>
                  </div>
                </div>
                
                {/* Progress section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <div className="bg-white/20 rounded-full p-1.5">
                        <Award className="h-3.5 w-3.5" />
                      </div>
                      Progression globale
                    </h3>
                    <span className="text-lg font-bold bg-white/20 px-2 py-0.5 rounded-full">{analytics.stats.averageProgress || 0}%</span>
                  </div>
                  <Progress value={analytics.stats.averageProgress || 0} className="h-2 bg-blue-200/30" indicatorClassName="bg-white" />
                  <div className="mt-2 text-xs flex justify-between items-center">
                    <span>{analytics.stats.completedCourses} cours terminés sur {analytics.stats.totalCourses}</span>
                    <Button variant="ghost" size="sm" className="text-white h-6 px-2 text-xs hover:bg-white/20">
                      Détails
                    </Button>
                  </div>
                </div>
                
                {/* Performance metrics */}
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border dark:border-slate-700">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    Performance
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Score moyen aux quiz</span>
                        <span className="font-medium">{analytics.performanceMetrics?.averageQuizScore || 0}%</span>
                      </div>
                      <Progress value={analytics.performanceMetrics?.averageQuizScore || 0} className="h-1.5" 
                        indicatorClassName="bg-purple-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Taux de complétion des exercices</span>
                        <span className="font-medium">{analytics.performanceMetrics?.exerciseCompletionRate || 0}%</span>
                      </div>
                      <Progress value={analytics.performanceMetrics?.exerciseCompletionRate || 0} className="h-1.5"
                        indicatorClassName="bg-green-500" />
                    </div>
                    
                    {/* Quiz and Exercise attempts */}
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                        <div className="flex items-center gap-1.5">
                          <BarChart3 className="h-3 w-3 text-purple-500" />
                          <span className="text-xs font-medium">Quiz</span>
                        </div>
                        <p className="text-base font-bold mt-0.5">{analytics.performanceMetrics?.totalQuizAttempts || 0}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">tentatives</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="h-3 w-3 text-green-500" />
                          <span className="text-xs font-medium">Exercices</span>
                        </div>
                        <p className="text-base font-bold mt-0.5">{analytics.performanceMetrics?.totalExerciseAttempts || 0}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">tentatives</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Attendance tracker with title */}
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border dark:border-slate-700">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    Votre Activité 
                  </h3>
                  <div className="flex justify-center items-center">
                    <AttendanceTracker activities={analytics.activities} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}