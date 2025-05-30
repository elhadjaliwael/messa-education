
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle, TrendingUp, Clock } from "lucide-react"

function OverviewCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
            <BookOpen size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats?.totalCourses ?? 'N/A'}</p>
          <p className="text-xs text-muted-foreground mt-1">{stats?.inProgressCourses ?? 0} in progress</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Completed Courses</p>
            <CheckCircle size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats?.completedCourses ?? 'N/A'}</p>
          <p className="text-xs text-muted-foreground mt-1">{stats?.certificatesEarned ?? 0} certificates</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
            <TrendingUp size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats?.averageProgress !== undefined ? `${stats.averageProgress}%` : 'N/A'}</p>
          <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
            <Clock size={16} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats?.totalTimeSpent ?? 'N/A'}</p>
          <p className="text-xs text-muted-foreground mt-1">Current Streak: {stats?.learningStreak ?? 0} days</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default OverviewCards