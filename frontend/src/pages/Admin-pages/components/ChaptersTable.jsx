import React from 'react'
import { useNavigate } from 'react-router';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import {Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
function ChaptersTable({
  filteredCourses,
  loading,
  error,
  handlePageChange,
  currentPage,
  totalPages,
  searchTerm,
  selectedGrade,
  selectedSubject,
  statusFilter,
  onRowClick
}) {
    const navigate = useNavigate();
  return (
    <div className="rounded-md border">
                {loading ? (
                  <div className="h-24 flex items-center justify-center">
                    <p>Loading courses...</p>
                  </div>
                ) : error ? (
                  <div className="h-24 flex items-center justify-center text-red-500">
                    <p>{error}</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead className="text-center">Added By</TableHead>
                        <TableHead className="text-center">Lessons</TableHead>
                        <TableHead className="text-center">Exercises</TableHead>
                        <TableHead className="text-center">Quizzes</TableHead>
                        <TableHead className="text-center">Total Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((course, index) => (
                          <TableRow 
                            key={course.id}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => onRowClick ? onRowClick(course) : navigate(`/admin/courses/${course.id}/view`)}
                          >
                            <TableCell className="font-medium">{course.order}</TableCell>
                            <TableCell className="font-medium">{course.subject}</TableCell>
                            <TableCell>{course.grade}</TableCell>
                            <TableCell className="text-center">{course.addedByName ? course.addedByName : "N/A"}</TableCell>
                            <TableCell className="text-center">{course.lessons || 0}</TableCell>
                            <TableCell className="text-center">{course.exercices || 0}</TableCell>
                            <TableCell className="text-center">{course.quizzes || 0}</TableCell>
                            <TableCell className="text-center">
                              {course.totalTime ? `${course.totalTime} min` : '0 min'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
                                {course.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{course.lastUpdated}</TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 px-2 rounded-md hover:bg-primary/10"
                                  title="View"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/courses/${course.id}/view`);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} className="h-24 text-center">
                            {searchTerm || statusFilter !== 'All' || selectedGrade !== 'All' || selectedSubject !== 'All' ? 
                              'No courses found for the selected criteria.' : 
                              'No courses available. Click "Add New Course" to create one.'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
                
                {/* Pagination Controls */}
                {!loading && filteredCourses.length > 0 && (
                  <div className="flex items-center justify-between px-4 py-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Show pages around current page
                          let pageToShow;
                          if (totalPages <= 5) {
                            pageToShow = i + 1;
                          } else if (currentPage <= 3) {
                            pageToShow = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageToShow = totalPages - 4 + i;
                          } else {
                            pageToShow = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageToShow}
                              variant={currentPage === pageToShow ? "default" : "outline"}
                              size="icon"
                              className="w-8 h-8 mx-1"
                              onClick={() => handlePageChange(pageToShow)}
                            >
                              {pageToShow}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
  )
}

export default ChaptersTable