import React, { useState } from 'react';
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
import { Search, Plus, Edit, Trash2, FileText, Eye, Download, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router';

function AdminCoursesPage() {
  // Mock chapters data
  const navigate = useNavigate()
  const [chapters, setChapters] = useState([
    { id: 1, title: 'Numbers and Operations', subject: 'Mathematics', grade: '5th Grade', order: 1, lessons: 5, status: 'Published', lastUpdated: '2023-05-15' },
    { id: 2, title: 'Fractions', subject: 'Mathematics', grade: '5th Grade', order: 2, lessons: 4, status: 'Published', lastUpdated: '2023-05-20' },
    { id: 3, title: 'Geometry Basics', subject: 'Mathematics', grade: '5th Grade', order: 3, lessons: 6, status: 'Draft', lastUpdated: '2023-06-01' },
    { id: 4, title: 'Measurements', subject: 'Mathematics', grade: '5th Grade', order: 4, lessons: 3, status: 'Published', lastUpdated: '2023-06-10' },
    { id: 5, title: 'Mechanics', subject: 'Physics', grade: '10th Grade', order: 1, lessons: 7, status: 'Published', lastUpdated: '2023-04-22' },
    { id: 6, title: 'Electricity', subject: 'Physics', grade: '10th Grade', order: 2, lessons: 5, status: 'Published', lastUpdated: '2023-05-05' },
    { id: 7, title: 'Optics', subject: 'Physics', grade: '10th Grade', order: 3, lessons: 4, status: 'Draft', lastUpdated: '2023-06-15' },
    { id: 8, title: 'Organic Chemistry', subject: 'Chemistry', grade: '11th Grade', order: 1, lessons: 6, status: 'Published', lastUpdated: '2023-03-10' },
    { id: 9, title: 'Periodic Table', subject: 'Chemistry', grade: '11th Grade', order: 2, lessons: 3, status: 'Published', lastUpdated: '2023-04-05' },
    { id: 10, title: 'Cell Biology', subject: 'Biology', grade: '12th Grade', order: 1, lessons: 5, status: 'Published', lastUpdated: '2023-05-12' },
    { id: 11, title: 'Grammar', subject: 'French', grade: '6th Grade', order: 1, lessons: 8, status: 'Published', lastUpdated: '2023-04-18' },
    { id: 12, title: 'Vocabulary', subject: 'English', grade: '8th Grade', order: 1, lessons: 6, status: 'Draft', lastUpdated: '2023-06-20' },
  ]);

  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Get unique grades
  const grades = ['All', ...new Set(chapters.map(chapter => chapter.grade))];
  
  // Get unique subjects
  const subjects = ['All', ...new Set(chapters.map(chapter => chapter.subject))];

  // Filter chapters based on selected grade, subject, search term, and status
  const filteredChapters = chapters.filter(chapter => {
    const matchesGrade = selectedGrade === 'All' || chapter.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'All' || chapter.subject === selectedSubject;
    const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || chapter.status === statusFilter;
    return matchesGrade && matchesSubject && matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Curriculum Management</h1>
        <Button onClick={() => navigate('/admin/courses/add')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Chapter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Chapters</CardTitle>
          <CardDescription>View and manage chapters by grade and subject</CardDescription>
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
                  placeholder="Search chapters..."
                  className="w-[250px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Chapter Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-center">Order</TableHead>
                      <TableHead className="text-center">Lessons</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChapters.length > 0 ? (
                      filteredChapters.map((chapter) => (
                        <TableRow key={chapter.id}>
                          <TableCell className="font-medium">{chapter.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              {chapter.title}
                            </div>
                          </TableCell>
                          <TableCell>{chapter.subject}</TableCell>
                          <TableCell>{chapter.grade}</TableCell>
                          <TableCell className="text-center">{chapter.order}</TableCell>
                          <TableCell className="text-center">{chapter.lessons}</TableCell>
                          <TableCell>
                            <Badge variant={chapter.status === 'Published' ? 'default' : 'secondary'}>
                              {chapter.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{chapter.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon" title="View">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {chapter.status === 'Draft' ? (
                                <Button variant="ghost" size="icon" title="Publish">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="icon" title="Download">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          {selectedGrade !== 'All' || selectedSubject !== 'All' ? 
                            'No chapters found for the selected criteria.' : 
                            'Please select a grade and subject to view chapters.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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