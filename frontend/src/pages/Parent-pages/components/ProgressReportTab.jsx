import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { PieChart } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { BarChartComponent } from "./BarChart";
import {LineChartComponent} from "./LineChart";
import { BarChart2, CheckCircle2, ClipboardList, Timer, HelpCircle } from "lucide-react"

function ProgressReportTab({
  courseProgress,
  activityByDayOfWeek,
  subjectDistribution,
  progressTrend,
  performanceMetrics
}) {
  console.log(performanceMetrics)
  // Prepare data for shadcn LineChart (Progress Trend)
  const lineChartData = (progressTrend || []).map(item => ({
    name: item.date,
    progress:
      (item.lessonsCompleted || 0) +
      (item.exercisesCompleted || 0) +
      (item.quizzesCompleted || 0)
  }));


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart size={18} />
          Progress Report
        </CardTitle>
        <CardDescription>
          Detailed analysis of your child's learning progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">

          {/* Visualizations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekly Activity Bar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activityByDayOfWeek.length > 0 ? (
                  <BarChartComponent
                    chartData = {activityByDayOfWeek}
                  />
                ) : (
                  <div className="text-muted-foreground text-xs">No activity data.</div>
                )}
              </CardContent>
            </Card>

            {/* Progress Trend Line Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Progress Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {lineChartData.length > 0 ? 
                  <LineChartComponent chartData={lineChartData} />
                  : <div className="text-muted-foreground text-xs">No progress data.</div>
                }
              </CardContent>
            </Card>
          </div>

          {/* Subject Performance and Course Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics ? (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 shadow-sm">
                        <CheckCircle2 className="text-green-600" size={24} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Average Quiz Score</span>
                            <span className="text-lg font-bold text-green-700">{performanceMetrics.averageQuizScore}%</span>
                          </div>
                          <Progress value={performanceMetrics.averageQuizScore} className="h-2 mt-1" />
                        </div>
                        <HelpCircle className="ml-2 text-muted-foreground" size={16} title="Average score across all quizzes" />
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 shadow-sm">
                        <ClipboardList className="text-blue-600" size={24} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Exercise Completion Rate</span>
                            <span className="text-lg font-bold text-blue-700">{performanceMetrics.exerciseCompletionRate}%</span>
                          </div>
                          <Progress value={performanceMetrics.exerciseCompletionRate} className="h-2 mt-1" />
                        </div>
                        <HelpCircle className="ml-2 text-muted-foreground" size={16} title="Percentage of exercises completed" />
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 shadow-sm">
                        <BarChart2 className="text-purple-600" size={24} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total Quiz Attempts</span>
                            <span className="text-lg font-bold text-purple-700">{performanceMetrics.totalQuizAttempts}</span>
                          </div>
                        </div>
                        <HelpCircle className="ml-2 text-muted-foreground" size={16} title="Number of quiz attempts" />
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 shadow-sm">
                        <Timer className="text-orange-600" size={24} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total Exercise Attempts</span>
                            <span className="text-lg font-bold text-orange-700">{performanceMetrics.totalExerciseAttempts}</span>
                          </div>
                        </div>
                        <HelpCircle className="ml-2 text-muted-foreground" size={16} title="Number of exercise attempts" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No performance metrics data.</div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {courseProgress && courseProgress.length > 0 ? (
                    <div
                      className="grid grid-cols-1 gap-3"
                      style={{
                        maxHeight: "340px",
                        overflowY: "auto",
                        paddingRight: "4px"
                      }}
                    >
                      {courseProgress.map((course, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 shadow-sm border-b last:border-b-0"
                        >
                          <BarChart2 className="text-sky-600" size={22} />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium truncate" title={course.subject}>
                                {course.subject.charAt(0).toUpperCase() + course.subject.slice(1)}
                              </span>
                              <span className="text-lg font-bold text-sky-700">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No course progress data.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgressReportTab