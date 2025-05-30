import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { axiosPrivate } from "@/api/axios"
import { useState, useEffect } from "react"
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
          Assigned Courses
        </CardTitle>
        <CardDescription>
          Manage courses and progress for your child
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments && assignments.length > 0 ? assignments.map((assignment, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 flex flex-col gap-2 bg-muted/50 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <span title={assignment.subject?.id ? `ID: ${assignment.subject.id}` : undefined}>
                      {assignment.subject?.name || <span className="italic text-muted-foreground">No subject</span>}
                    </span>
                    <Badge variant="secondary" className="ml-2">Subject</Badge>
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                    {assignment.chapter?.title && (
                      <span title={assignment.chapter?.id ? `ID: ${assignment.chapter.id}` : undefined}>
                        <span className="font-medium">Chapter:</span> {assignment.chapter.title}
                      </span>
                    )}
                    {assignment.lesson?.title && (
                      <span title={assignment.lesson?.id ? `ID: ${assignment.lesson.id}` : undefined}>
                        <span className="font-medium">Lesson:</span> {assignment.lesson.title}
                      </span>
                    )}
                    {assignment.exercise?.title && (
                      <span title={assignment.exercise?.id ? `ID: ${assignment.exercise.id}` : undefined}>
                        <span className="font-medium">Exercise:</span> {assignment.exercise.title}
                      </span>
                    )}
                    {assignment.quizz?.title && (
                      <span title={assignment.quizz?.id ? `ID: ${assignment.quizz.id}` : undefined}>
                        <span className="font-medium">Quiz:</span> {assignment.quizz.title}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    <Badge variant="outline">
                      Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}
                    </Badge>
                    {assignment.notes && (
                      <span className="text-xs px-2 py-1 bg-muted rounded" title={assignment.notes}>
                        {assignment.notes.length > 30
                          ? assignment.notes.slice(0, 30) + "..."
                          : assignment.notes}
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  variant={assignment.progress === 100 ? "success" : "outline"}
                  className="text-base px-4 py-2"
                >
                  {assignment.progress === 100 ? "Completed" : "In Progress"}
                </Badge>
              </div>
            </div>
          )) : (
            <div className="text-center text-muted-foreground">No assignments found.</div>
          )}
        </div>
        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded bg-muted text-primary disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              className="px-3 py-1 rounded bg-muted text-primary disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AssignmentsTab