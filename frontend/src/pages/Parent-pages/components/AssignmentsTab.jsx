import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { axiosPrivate } from "@/api/axios"
import { useState, useEffect } from "react"
import { Calendar, CheckCircle2, Circle, FileText } from "lucide-react"

function AssignmentsTab({selectedChild}) {
  const [assignments, setAssignments] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, limit: 5, total: 0 })
  const [page, setPage] = useState(1)
  const pageSize = 5

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axiosPrivate.get(
          `/courses/student/assignments?childId=${selectedChild}&page=${page}&limit=${pageSize}`
        )
        setAssignments(response.data.assignments)
        setPagination(response.data.pagination)
      } catch (error) {
        console.log(error)
        console.error('Error fetching assignments:', error)
      }
    }

    fetchAssignments()
  }, [selectedChild, page])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Assigned Courses
        </CardTitle>
        <CardDescription>
          Track courses and progress for your child
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignments && assignments.length > 0 ? assignments.map((assignment, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Subject Header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground">
                      {assignment.subject?.name || <span className="italic text-muted-foreground">No subject</span>}
                    </h4>
                    <Badge variant="secondary" className="text-xs">Subject</Badge>
                  </div>
                  
                  {/* Content Details - Compact Layout */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {assignment.chapter?.title && (
                      <span>
                        <span className="font-medium">Chapter:</span> {assignment.chapter.title}
                      </span>
                    )}
                    {assignment.lesson?.title && (
                      <span>
                        <span className="font-medium">Lesson:</span> {assignment.lesson.title}
                      </span>
                    )}
                    {assignment.exercise?.title && (
                      <span>
                        <span className="font-medium">Exercise:</span> {assignment.exercise.title}
                      </span>
                    )}
                    {assignment.quizz?.title && (
                      <span>
                        <span className="font-medium">Quiz:</span> {assignment.quizz.title}
                      </span>
                    )}
                  </div>
                  
                  {/* Due Date and Notes - Compact */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No due date"}
                      </span>
                    </div>
                    {assignment.notes && (
                      <span className="text-xs px-2 py-1 bg-muted/50 rounded text-muted-foreground truncate max-w-xs" title={assignment.notes}>
                        {assignment.notes.length > 25 ? assignment.notes.slice(0, 25) + "..." : assignment.notes}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Status - Compact */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {(() => {
                    switch (assignment.status) {
                      case 'completed':
                        return (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <Badge variant="default" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
                              Completed
                            </Badge>
                          </>
                        );
                      case 'in_progress':
                        return (
                          <>
                            <Circle className="h-4 w-4 text-blue-500" />
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1">
                              In Progress
                            </Badge>
                          </>
                        );
                      case 'late':
                        return (
                          <>
                            <Circle className="h-4 w-4 text-red-500" />
                            <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 text-xs px-2 py-1">
                              Late
                            </Badge>
                          </>
                        );
                      case 'pending':
                      default:
                        return (
                          <>
                            <Circle className="h-4 w-4 text-amber-500" />
                            <Badge variant="outline" className="border-amber-200 text-amber-700 text-xs px-2 py-1">
                              Pending
                            </Badge>
                          </>
                        );
                    }
                  })()
                  }
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No assignments found for this child.</p>
            </div>
          )}
        </div>
        
        {/* Improved Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {assignments.length} of {pagination.total} assignments
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm px-2">
                {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AssignmentsTab