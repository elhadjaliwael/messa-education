import { useState, useEffect } from 'react'
import { Card} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {Search, Users } from "lucide-react"
import AssignExerciseDialog from './components/AssignExerciseDialog'
import ChildrenSidebar from './components/ChildrenSidebar'
import OverviewCards from './components/OverviewCards'
import ActivitiesTab from './components/ActivitiesTab'
import AssignmentsTab from './components/AssignmentsTab'
import ProgressReportTab from './components/ProgressReportTab'
import NotificationsSection from './components/NotificationsSection'
import { axiosPrivate } from '@/api/axios'
import { classes } from '@/data/tunisian-education'

function ParentDashboard() {
  // State for children data
    const [children, setChildren] = useState([])
    const [childProgress, setChildProgress] = useState(null)
    const [selectedChild, setSelectedChild] = useState(null)
    useEffect(() => {
        const fetchChildren = async () => {
            try {
              const res = await axiosPrivate.get('/auth/children')
              setChildren(res.data)
            } catch (err) {
              console.error(err)
            }
        } 
        fetchChildren()
    },[])
  // State for available exercises
  const [availableExercises, setAvailableExercises] = useState([
    { id: 1, title: "Multiplication Tables", subject: "Mathematics", difficulty: "Medium", duration: "20 min" },
    { id: 2, title: "Reading Comprehension", subject: "English", difficulty: "Easy", duration: "15 min" },
    { id: 3, title: "Basic Science Quiz", subject: "Science", difficulty: "Easy", duration: "10 min" },
    { id: 4, title: "Grammar Practice", subject: "English", difficulty: "Medium", duration: "25 min" },
    { id: 5, title: "Problem Solving", subject: "Mathematics", difficulty: "Hard", duration: "30 min" },
    { id: 6, title: "Vocabulary Builder", subject: "English", difficulty: "Medium", duration: "15 min" },
    { id: 7, title: "Geography Quiz", subject: "Social Studies", difficulty: "Medium", duration: "20 min" },
    { id: 8, title: "Fractions Practice", subject: "Mathematics", difficulty: "Hard", duration: "25 min" }
  ])

  // State for assignment form
  const [assignmentForm, setAssignmentForm] = useState({
    child : {},
    exerciseId: "",
    dueDate: "",
    notes: ""
  })
  // Handle child selection
  const handleChildSelect = async (childId) => {
    setSelectedChild(childId)
    setAssignmentForm(prev => ({ ...prev, childId }))
    try {
      const res = await axiosPrivate.get(`/courses/analytics/children/${childId}/progress`)
      setChildProgress(res.data)
    } catch (err) {
      console.error(err)
      setChildProgress(null)
    }
  }

  // Handle assignment form changes
  const handleAssignmentChange = async (field, value) => {

    setAssignmentForm(prev => ({ ...prev, [field]: value }))
  }

  const handleChildAdd = async (childId) => {
    try {

      const res = await axiosPrivate.post('/auth/children', { childId })
      setChildren(() => [...children, res.data])
    } catch (err) {
      console.error(err)
    }
  }
  // Handle exercise assignment
  const handleAssignExercise = () => {
    // Validation
    if (!assignmentForm.childId || !assignmentForm.exerciseId || !assignmentForm.dueDate) {
      toast.error("Please fill all required fields")
      return
    }

    // In a real app, you would send this to your API
    console.log("Assigning exercise:", assignmentForm)
    
    // Show success message
    toast.success("Exercise assigned successfully", {
      description: "The child will be notified about the new assignment."
    })
    
    // Reset form
    setAssignmentForm({
      childId: assignmentForm.childId,
      exerciseId: "",
      dueDate: "",
      notes: ""
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your children's learning progress and assign exercises</p>
        </div>
        <div className="flex items-center gap-3">
          <AssignExerciseDialog
              children={children}
              availableExercises={availableExercises}
              assignmentForm={assignmentForm}
              handleAssignmentChange={handleAssignmentChange}
              handleAssignExercise={handleAssignExercise}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Children List */}
        <ChildrenSidebar
          children={children}
          handleChildAdd={handleChildAdd}
          selectedChild={selectedChild}
          handleChildSelect={handleChildSelect}
        />

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedChild && childProgress ? (
            <>
              <OverviewCards stats={childProgress.stats} />
              <Tabs defaultValue="activities" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="activities">Recent Activities</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  <TabsTrigger value="progress">Progress Report</TabsTrigger>
                </TabsList>
                <TabsContent value="activities">
                  <ActivitiesTab activities={childProgress.recentActivities} />
                </TabsContent>
                <TabsContent value="assignments">
                  <AssignmentsTab selectedChild = {selectedChild} />
                </TabsContent>
                <TabsContent value="progress">
                  <ProgressReportTab
                    stats={childProgress.stats}
                    courseProgress={childProgress.courseProgress}
                    activityByDayOfWeek={childProgress.activityByDayOfWeek}
                    subjectDistribution={childProgress.subjectDistribution}
                    performanceMetrics={childProgress.performanceMetrics}
                    progressTrend={childProgress.progressTrend}
                  />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="flex items-center justify-center p-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Child Selected</h3>
                <p className="text-muted-foreground mt-2">
                  Please select a child from the sidebar to view their progress.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <NotificationsSection />
    </div>
  )
}

export default ParentDashboard