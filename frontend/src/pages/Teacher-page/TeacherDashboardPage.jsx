import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, BookOpenIcon, UsersIcon, MessageSquareIcon, BarChart3Icon, ClipboardListIcon, BellIcon, PlusIcon, ArrowRightIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAuth from "@/hooks/useAuth"
import { NotificationBell } from '@/components/NotificationBell'

function TeacherDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample data - in a real app, this would come from your API
  const stats = {
    totalStudents: 87,
    activeClasses: 4,
    upcomingAssignments: 3,
    unreadMessages: 12,
    averageGrade: 78,
    completionRate: 85
  };

  const recentActivities = [
    { id: 1, type: 'assignment', title: 'Mathématiques Avancées - Devoir 3', date: '2023-05-15', status: 'En cours' },
    { id: 2, type: 'message', title: 'Message de la classe de Physique', date: '2023-05-14', status: 'Non lu' },
    { id: 3, type: 'grade', title: 'Notes publiées - Algèbre linéaire', date: '2023-05-12', status: 'Terminé' },
    { id: 4, type: 'class', title: 'Cours de Chimie organique', date: '2023-05-10', status: 'Terminé' }
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Mathématiques', class: 'Terminale S', time: '10:00 - 11:30', day: 'Lundi', room: 'Salle A102' },
    { id: 2, subject: 'Physique', class: 'Première S', time: '13:00 - 14:30', day: 'Mardi', room: 'Labo B201' },
    { id: 3, subject: 'Chimie', class: 'Terminale S', time: '09:00 - 10:30', day: 'Mercredi', room: 'Labo C305' },
    { id: 4, subject: 'Algèbre', class: 'Première S', time: '15:00 - 16:30', day: 'Jeudi', room: 'Salle A104' }
  ];

  const topStudents = [
    { id: 1, name: 'Sophie Martin', avatar: '/avatars/student1.png', grade: 95, class: 'Terminale S' },
    { id: 2, name: 'Thomas Dubois', avatar: '/avatars/student2.png', grade: 92, class: 'Première S' },
    { id: 3, name: 'Emma Bernard', avatar: '/avatars/student3.png', grade: 90, class: 'Terminale S' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.username || 'Enseignant'}! Voici un aperçu de vos activités.
          </p>
        </div>
        <div className="flex gap-2">
          <NotificationBell />
          <Button variant="outline" size="sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendrier
          </Button>
          <Button variant="default" size="sm">
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            Messages
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Répartis dans {stats.activeClasses} classes
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes actives</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClasses}</div>
            <p className="text-xs text-muted-foreground">
              Pour le semestre en cours
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoirs à venir</CardTitle>
            <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAssignments}</div>
            <p className="text-xs text-muted-foreground">
              À évaluer cette semaine
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              Non lus dans votre boîte
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGrade}/100</div>
            <div className="mt-2">
              <Progress value={stats.averageGrade} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
          <TabsTrigger value="assignments">Devoirs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
                <CardDescription>
                  Vos dernières actions et notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        {activity.type === 'assignment' && <ClipboardListIcon className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'message' && <MessageSquareIcon className="h-5 w-5 text-green-500" />}
                        {activity.type === 'grade' && <BarChart3Icon className="h-5 w-5 text-purple-500" />}
                        {activity.type === 'class' && <BookOpenIcon className="h-5 w-5 text-orange-500" />}
                        <div>
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <Badge variant={
                        activity.status === 'En cours' ? 'warning' :
                        activity.status === 'Non lu' ? 'destructive' :
                        'success'
                      }>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" size="sm">
                  Voir toutes les activités
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Meilleurs étudiants</CardTitle>
                <CardDescription>
                  Les étudiants avec les meilleures performances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{student.grade}/100</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${student.grade}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" size="sm">
                  Voir tous les étudiants
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Progression du semestre</CardTitle>
              <CardDescription>
                Suivi de l'avancement du programme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progression globale</span>
                    <span className="text-sm font-medium">{stats.completionRate}%</span>
                  </div>
                  <Progress value={stats.completionRate} className="h-2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Mathématiques</span>
                      <span className="text-sm">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Physique</span>
                      <span className="text-sm">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Chimie</span>
                      <span className="text-sm">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Algèbre</span>
                      <span className="text-sm">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Emploi du temps hebdomadaire</CardTitle>
                <CardDescription>
                  Vos cours pour la semaine en cours
                </CardDescription>
              </div>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Ajouter un cours
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map(classItem => (
                  <div key={classItem.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <BookOpenIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{classItem.subject}</p>
                        <p className="text-xs text-muted-foreground">{classItem.class}</p>
                        <p className="text-xs text-muted-foreground">{classItem.room}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">{classItem.day}</Badge>
                      <p className="text-xs text-muted-foreground">{classItem.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Vue calendrier
              </Button>
              <Button variant="ghost" size="sm">
                Voir tout
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Devoirs à évaluer</CardTitle>
                <CardDescription>
                  Les devoirs en attente d'évaluation
                </CardDescription>
              </div>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Créer un devoir
              </Button>
            </CardHeader>
            <CardContent>
              {stats.upcomingAssignments > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <ClipboardListIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mathématiques - Intégrales</p>
                        <p className="text-xs text-muted-foreground">Terminale S - 24 copies</p>
                        <Badge variant="outline" className="mt-1">Date limite: 20 Mai</Badge>
                      </div>
                    </div>
                    <Button size="sm">Évaluer</Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <ClipboardListIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Physique - Mécanique</p>
                        <p className="text-xs text-muted-foreground">Première S - 18 copies</p>
                        <Badge variant="outline" className="mt-1">Date limite: 22 Mai</Badge>
                      </div>
                    </div>
                    <Button size="sm">Évaluer</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <ClipboardListIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Aucun devoir en attente</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tous les devoirs ont été évalués. Vous pouvez créer un nouveau devoir.
                  </p>
                  <Button className="mt-4">
                    Créer un devoir
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" size="sm">
                Voir tous les devoirs
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TeacherDashboardPage