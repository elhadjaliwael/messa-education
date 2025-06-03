import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router';
import { axiosPrivate } from '@/api/axios';
import ChaptersTable from './components/ChaptersTable';
import { classes,allSubjects } from '@/data/tunisian-education';
import useAuth from '@/hooks/useAuth';
function AdminCoursesPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Define available grades and subjects

  const grades = ['All', ...Object.keys(classes)]
  const subjects = ['All', ...allSubjects];
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
          addedByName: chapter.addedByName,
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
        
        // Simple fallback that works with any array response
        const formattedCourses = Array.isArray(response.data) ? response.data.map((chapter, index) => ({
          id: chapter._id,
          title: chapter.title || chapter.subject,
          addedByName: chapter.addedByName,
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
        <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
        <Button onClick={() => navigate(`${auth.user.role === "teacher" ? "/teacher" : "/admin"}/courses/add`)}>
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
              <ChaptersTable 
                filteredCourses={filteredCourses} 
                loading={loading} 
                error={error} 
                handlePageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
                selectedGrade={selectedGrade}
                selectedSubject={selectedSubject}
                statusFilter={statusFilter}
                onRowClick={(course) => navigate(`/admin/courses/${course.id}/view`)}
              />
            </TabsContent>
            <TabsContent value="published" className="m-0">
              <ChaptersTable 
                filteredCourses={filteredCourses} 
                loading={loading} 
                error={error} 
                handlePageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
                selectedGrade={selectedGrade}
                selectedSubject={selectedSubject}
                statusFilter={statusFilter}
                onRowClick={(course) => navigate(`/admin/courses/${course.id}/view`)}
              />
            </TabsContent>
            <TabsContent value="draft" className="m-0">
              <ChaptersTable 
                filteredCourses={filteredCourses} 
                loading={loading} 
                error={error} 
                handlePageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
                selectedGrade={selectedGrade}
                selectedSubject={selectedSubject}
                statusFilter={statusFilter}
                onRowClick={(course) => navigate(`/admin/courses/${course.id}/view`)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminCoursesPage;