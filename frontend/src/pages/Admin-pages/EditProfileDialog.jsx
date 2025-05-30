import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Trash2} from 'lucide-react';
  
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { classes } from '@/data/tunisian-education';

function EditProfileDialog({isEditModalOpen,setIsEditModalOpen,editingTeacher,setEditingTeacher,handleEditSubmit,handleEditInputChange,handleStatusChange}) {
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>Edit Teacher</DialogTitle>
        <DialogDescription>
          Update teacher information and assignments.
        </DialogDescription>
      </DialogHeader>
      
      {editingTeacher && (
        <form onSubmit={handleEditSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right">
                Name
              </Label>
              <Input
                id="edit-username"
                name="username"
                value={editingTeacher.username}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={editingTeacher.email}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone
              </Label>
              <Input
                id="edit-phone"
                name="phone"
                value={editingTeacher.phone}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-subject" className="text-right">
                Subject
              </Label>
              <Select 
                name="subject" 
                value={editingTeacher.subject}
                onValueChange={(value) => setEditingTeacher(prev => ({ ...prev, subject: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select 
                name="status" 
                value={editingTeacher.status}
                onValueChange={handleStatusChange}
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
            
            {/* Classes field - Updated to use imported classes data */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-classes" className="text-right pt-2">
                Classes
              </Label>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {editingTeacher.classes.map((cls, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {cls}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                        onClick={() => {
                          const updatedClasses = editingTeacher.classes.filter((_, i) => i !== index);
                          // Create a synthetic event object with name and value properties
                          const event = {
                            target: {
                              name: 'classes',
                              value: updatedClasses
                            }
                          };
                          handleEditInputChange(event);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select 
                  onValueChange={(value) => {
                    if (!editingTeacher.classes.includes(value)) {
                      const updatedClasses = [...editingTeacher.classes, value];
                      const event = {
                        target: {
                          name: 'classes',
                          value: updatedClasses
                        }
                      };
                      handleEditInputChange(event);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add class" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(classes).map((classLevel) => (
                      <SelectItem key={classLevel} value={classLevel}>
                        {classLevel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </DialogContent>
  </Dialog>
  )
}

export default EditProfileDialog