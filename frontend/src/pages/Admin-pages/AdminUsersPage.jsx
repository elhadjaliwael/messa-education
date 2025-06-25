import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TeachersTable from './TeachersTable';
import toast, { Toaster } from 'react-hot-toast';
import { axiosPrivate } from '@/api/axios';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { classes,allSubjects } from '@/data/tunisian-education';
function AdminUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    username: '',
    email: '',
    phone: '',
    subject: '',
    classes: [],
    bio: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Add validation function
  const validateForm = () => {
    const newErrors = {};
    
    // Validate username
    if (!newTeacher.username || newTeacher.username.trim().length < 3) {
      newErrors.username = "Name must be at least 3 characters";
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newTeacher.email || !emailRegex.test(newTeacher.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Validate phone
    const phoneRegex = /^\d{8,15}$/;
    if (!newTeacher.phone || !phoneRegex.test(newTeacher.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (8-15 digits)";
    }
    
    // Validate subject
    if (!newTeacher.subject) {
      newErrors.subject = "Please select a subject";
    }
    
    // Validate classes (optional validation)
    if (newTeacher.classes.length === 0) {
      newErrors.classes = "Please assign at least one class";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axiosPrivate.post("/auth/users/add-teacher", newTeacher);
      toast.success(response.data.message);
      
      // Dispatch event to refresh teachers table
      window.dispatchEvent(new Event('refreshTeachers'));
      
      // Close the modal after submission
      setIsModalOpen(false);
      // Reset the form
      setNewTeacher({
        username: '',
        email: '',
        phone: '',
        subject: '',
        classes: [],
        bio: '',
        status: 'Active'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add teacher");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add available classes for selection
  const availableClasses = Object.keys(classes);
  // Replace the handleClassToggle function with this
  const handleClassSelect = (className) => {
    setNewTeacher(prev => {
      const currentClasses = [...prev.classes];
      if (currentClasses.includes(className)) {
        return {
          ...prev,
          classes: currentClasses.filter(c => c !== className)
        };
      } else {
        return {
          ...prev,
          classes: [...currentClasses, className]
        };
      }
    });
  };

  const handleRemoveClass = (className, e) => {
    e.preventDefault();
    e.stopPropagation();
    setNewTeacher(prev => ({
      ...prev,
      classes: prev.classes.filter(c => c !== className)
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Management</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new teacher to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Full Name
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="username"
                      name="username"
                      value={newTeacher.username}
                      onChange={handleInputChange}
                      className={errors.username ? "border-red-500" : ""}
      
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500">{errors.username}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newTeacher.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
          
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="phone"
                      name="phone"
                      value={newTeacher.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "border-red-500" : ""}
        
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Subject
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Select 
                      name="subject" 
                      value={newTeacher.subject}
                      onValueChange={(value) => {
                        setNewTeacher(prev => ({ ...prev, subject: value }));
                        if (errors.subject) {
                          setErrors(prev => ({ ...prev, subject: null }));
                        }
                      }}
                    >
                      <SelectTrigger className={`col-span-3 ${errors.subject ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {allSubjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-sm text-red-500">{errors.subject}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select 
                    name="status" 
                    value={newTeacher.status}
                    onValueChange={(value) => setNewTeacher(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="bio" className="text-right pt-2">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={newTeacher.bio}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Brief description about the teacher"
                    rows={3}
                  />
                </div>
                
                {/* Add this new field for classes after the subject field */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="classes" className="text-right pt-2">
                    Classes
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={`w-full justify-between ${errors.classes ? "border-red-500" : ""}`}
                        >
                          {newTeacher.classes.length > 0 
                            ? `${newTeacher.classes.length} classes selected` 
                            : "Select classes"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search classes..." />
                          <CommandEmpty>No class found.</CommandEmpty>
                          <CommandGroup>
                            {availableClasses.map((cls) => (
                              <CommandItem
                                key={cls}
                                value={cls}
                                onSelect={() => {
                                  handleClassSelect(cls);
                                  if (errors.classes) {
                                    setErrors(prev => ({ ...prev, classes: null }));
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newTeacher.classes.includes(cls) 
                                      ? "opacity-100" 
                                      : "opacity-0"
                                  )}
                                />
                                {cls}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {/* Display selected classes as badges */}
                    {newTeacher.classes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {newTeacher.classes.map((cls) => (
                          <Badge key={cls} variant="secondary" className="px-2 py-1">
                            {cls}
                            <button
                              className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                              onClick={(e) => handleRemoveClass(cls, e)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Teacher"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <TeachersTable />
    </div>
  )}
  
  export default AdminUsersPage