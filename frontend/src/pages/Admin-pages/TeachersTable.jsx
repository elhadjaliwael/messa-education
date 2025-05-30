import React, { useEffect, useState } from 'react'
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
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Badge } from "@/components/ui/badge";
  import { 
    Search, 
    Edit, 
    Trash2, 
    Mail, 
    Phone, 
    GraduationCap, 
    Filter, 
    MoreHorizontal,
    BookOpen
  } from 'lucide-react';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { axiosPrivate } from '@/api/axios';
import { toast } from 'sonner';
import EditProfileDialog from './EditProfileDialog';
import ProfileDialog from './ProfileDialog';

function TeachersTable() {
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  
    // Safely get unique subjects
    const getUniqueSubjects = () => {
      const uniqueSubjects = ['All'];
      if (teachers && teachers.length > 0) {
        teachers.forEach(teacher => {
          if (teacher.subject && !uniqueSubjects.includes(teacher.subject)) {
            uniqueSubjects.push(teacher.subject);
          }
        });
      }
      return uniqueSubjects;
    };
    
    const subjects = getUniqueSubjects();
  
    // Safely filter teachers
    const filteredTeachers = teachers && teachers.length > 0 
      ? teachers.filter(teacher => {
          if (!teacher) return false;
          
          const matchesSearch = 
            (teacher.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesSubject = subjectFilter === 'All' || teacher.subject === subjectFilter;
          const matchesStatus = statusFilter === 'All' || teacher.status === statusFilter;
          
          return matchesSearch && matchesSubject && matchesStatus;
        })
      : [];
      
    useEffect(() => {
      const fetchTeachers = async () => {
        try {
          const response = await axiosPrivate.get("/auth/teachers");
          console.log(response)
          console.log('Teachers data:', response.data);
          
          // Transform the data if needed
          const formattedTeachers = response.data.map(teacher => ({
            id: teacher.id,
            username: teacher.username,
            name: teacher.username, // For compatibility with existing code
            password :teacher.password, // Store password in state for temporary use
            email: teacher.email,
            phone: teacher.phone || 'N/A',
            subject: teacher.subject || 'Not assigned',
            classes: teacher.classes || [],
            status: teacher.status || 'Active',
            joinDate: teacher.createdAt || new Date(),
            avatar: teacher.avatar || 'https://github.com/shadcn.png'
          }));
          console.log("formatted teacher : ",formattedTeachers)
          setTeachers(formattedTeachers);
        }
        catch (err) {
          console.error('Error fetching teachers:', err);
        }
      };
      
      fetchTeachers();
      
      // Set up refresh listener
      const handleRefresh = () => fetchTeachers();
      window.addEventListener('refreshTeachers', handleRefresh);
      
      return () => {
        window.removeEventListener('refreshTeachers', handleRefresh);
      };
    }, [axiosPrivate]);
  const handleViewProfile = (teacher) => {
    setSelectedTeacher(teacher);
    setIsProfileDialogOpen(true);
  };
  const handleDeleteTeacher = async (teacherId) => {
    try {
      await axiosPrivate.delete(`/auth/teachers/${teacherId}`);
      toast.success('Teacher deleted successfully!');
      // Refresh the teachers list
      const response = await axiosPrivate.get("/auth/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };
  
  // Add these state variables
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  
  // Add this function to handle opening the edit modal
  const handleEditTeacher = (teacher) => {
    setEditingTeacher({
      ...teacher,
      // Create a copy to avoid modifying the original
      classes: [...teacher.classes]
    });
    setIsEditModalOpen(true);
  };
  
  // Add this function to handle form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.put(`/auth/teachers/${editingTeacher.id}`, editingTeacher);
      toast.success('Teacher updated successfully!');
      setIsEditModalOpen(false);
      
      // Refresh the teachers list
      window.dispatchEvent(new Event('refreshTeachers'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update teacher');
    }
  };
  
  // Add this function to handle input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTeacher(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add this function to handle status change
  const handleStatusChange = (status) => {
    setEditingTeacher(prev => ({
      ...prev,
      status
    }));
  };
  
  return (
    <Card>
    <CardHeader>
      <CardTitle>All Teachers</CardTitle>
      <CardDescription>Manage your teaching staff and their assignments</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search teachers..."
              className="w-[250px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead className="text-center">Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher,index) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{index}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">{teacher.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{teacher.email}</span>
                      </div>
                      <div className="flex items-center text-sm mt-1">
                        <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                        <span>{teacher.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      {teacher.subject}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map((cls, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{teacher.students}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        teacher.status === 'Active' ? 'default' :
                        teacher.status === 'On Leave' ? 'warning' : 'secondary'
                      }
                      className={
                        teacher.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        teacher.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(teacher.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewProfile(teacher)}>
                          <GraduationCap className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTeacher(teacher)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteTeacher(teacher.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Teacher
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No teachers found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
    <ProfileDialog isProfileDialogOpen={isProfileDialogOpen} setIsProfileDialogOpen={setIsProfileDialogOpen} selectedTeacher={selectedTeacher}></ProfileDialog>
    <EditProfileDialog 
      isEditModalOpen={isEditModalOpen} 
      setIsEditModalOpen={setIsEditModalOpen}
      editingTeacher={editingTeacher}
      handleEditInputChange={handleEditInputChange}
      handleStatusChange={handleStatusChange}
      handleEditSubmit={handleEditSubmit}
    />
  </Card>
  )
}

export default TeachersTable