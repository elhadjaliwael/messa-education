import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, FileText, Eye, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router';
import { axiosPrivate } from '@/api/axios';

function AdminCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log(courses)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Define available grades and subjects
  const grades = ['All', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade'];
  const subjects = ['All', 'Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science'];
  const itemsPerPageOptions = [5, 10, 20, 50];

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Updated API endpoint to match the new routes structure
      const response = await axiosPrivate.get(`/courses?page=${currentPage}&limit=${itemsPerPage}`);
      
      // Check if the response has pagination structure
      if (response.data.chapters && response.data.pagination) {
        // Transform the API response to match our table structure
        const formattedCourses = response.data.chapters.map((chapter, index) => ({
          id: chapter._id,
          title: chapter.title,
          subject: chapter.subject,
          grade: chapter.classLevel,
          order: ((currentPage - 1) * itemsPerPage) + index + 1,
          lessons: chapter.lessonsCount || 0,
          exercices: chapter.exercisesCount || 0,
          quizzes: chapter.quizzesCount || 0,
          totalTime: chapter.totalTime || 0,
          status: chapter.isPublished ? 'Published' : 'Draft',
          lastUpdated: new Date(chapter.updatedAt).toLocaleDateString(),
        }));
        
        setCourses(formattedCourses);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        // If the API doesn't return the expected structure, handle it gracefully
        console.warn('API response format has changed, using fallback parsing');
        
        // Simple fallback that works with any array response
        const formattedCourses = Array.isArray(response.data) ? response.data.map((chapter, index) => ({
          id: chapter._id,
          title: chapter.title || chapter.subject,
          subject: chapter.subject,
          grade: chapter.classLevel,
          order: index + 1,
          lessons: chapter.lessonsCount || 0,
          exercices: chapter.exercisesCount || 0,
          quizzes: chapter.quizzesCount || 0,
          totalTime: chapter.totalTime || 0,
          status: chapter.isPublished ? 'Published' : 'Draft',
          lastUpdated: new Date(chapter.updatedAt).toLocaleDateString(),
        })) : [];
        setCourses(formattedCourses);
        setTotalItems(formattedCourses.length);
        setTotalPages(Math.ceil(formattedCourses.length / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setError('Failed to load chapters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search term, status, grade, and subject
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
    const matchesGrade = selectedGrade === 'All' || course.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    
    return matchesSearch && matchesStatus && matchesGrade && matchesSubject;
  });

  

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Curriculum Management</h1>
        <Button onClick={() => navigate('/admin/courses/add')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Management</CardTitle>
          <CardDescription>View and manage courses by grade and subject</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setStatusFilter('All')}>All</TabsTrigger>
                <TabsTrigger value="published" onClick={() => setStatusFilter('Published')}>Published</TabsTrigger>
                <TabsTrigger value="draft" onClick={() => setStatusFilter('Draft')}>Drafts</TabsTrigger>
              </TabsList>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="w-[250px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                      </p>
                      <Select 
                        value={itemsPerPage.toString()} 
                        onValueChange={handleItemsPerPageChange}
                      >
                        <SelectTrigger className="w-[80px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {itemsPerPageOptions.map(option => (
                            <SelectItem key={option} value={option.toString()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">per page</p>
                    </div>
                    
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="all" className="m-0">
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
                          >
                            <TableCell className="font-medium">{course.order}</TableCell>
                            <TableCell className="font-medium">{course.subject}</TableCell>
                            <TableCell>{course.grade}</TableCell>
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
                            {searchTerm || selectedGrade !== 'All' || selectedSubject !== 'All' ? 
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
            </TabsContent>
            <TabsContent value="published" className="m-0">
              {/* Same table structure as above, filtered for published content */}
            </TabsContent>
            <TabsContent value="draft" className="m-0">
              {/* Same table structure as above, filtered for draft content */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminCoursesPage;