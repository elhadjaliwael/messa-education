import { useState, useEffect } from 'react'
import { Card} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast , {Toaster} from 'react-hot-toast'
import {Search, Users } from "lucide-react"
import AssignExerciseDialog from './components/AssignExerciseDialog'
import ChildrenSidebar from './components/ChildrenSidebar'
import OverviewCards from './components/OverviewCards'
import ActivitiesTab from './components/ActivitiesTab'
import AssignmentsTab from './components/AssignmentsTab'
import ProgressReportTab from './components/ProgressReportTab'
import NotificationsSection from './components/NotificationsSection'
import { axiosPrivate } from '@/api/axios'
import { NotificationBell } from '@/components/NotificationBell'

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

  // State for assignment form
  const [assignmentForm, setAssignmentForm] = useState({
    child : {},
    exerciseId: "",
    dueDate: "",
    notes: ""
  })
  const handleChildRemove = async (childId) => {
    try {
      await axiosPrivate.delete(`/auth/children/${childId}`)
      setChildren(children.filter(child => child.id !== childId))
      setSelectedChild(null)
      setChildProgress(null)
    } catch (err) {
      console.error(err)
    }
  }
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
  const handleChildAdd = async (childId) => {
    try {
      const res = await axiosPrivate.post('/auth/children', { childId })
      setChildren(() => [...children, res.data.childData])
    } catch (err) {
      console.error(err)
      toast.error(err.response.data.message)
    }
  }
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your children's learning progress and assign exercises</p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell></NotificationBell>
          <AssignExerciseDialog
              children={children}
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
          handleChildRemove={handleChildRemove}
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
      <Toaster position="top-center" />
    </div>
  )
}

export default ParentDashboard