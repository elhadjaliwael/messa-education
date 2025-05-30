import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
function ProfileDialog({isProfileDialogOpen, setIsProfileDialogOpen, selectedTeacher}) {
  return (
    <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Teacher Profile</DialogTitle>
                              <DialogDescription>
                                Detailed information about the teacher.
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedTeacher && (
                              <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                                    <AvatarFallback>{selectedTeacher.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-medium">{selectedTeacher.name}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedTeacher.subject || 'No subject assigned'}</p>
                                  </div>
                                </div>
                                
                                <div className="grid gap-2">
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <span className="font-medium">Email:</span>
                                    <span className="col-span-2">{selectedTeacher.email}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <span className="font-medium">Phone:</span>
                                    <span className="col-span-2">{selectedTeacher.phone}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <span className="font-medium">Status:</span>
                                    <Badge 
                                      variant={
                                        selectedTeacher.status === 'Active' ? 'default' : 
                                        selectedTeacher.status === 'On Leave' ? 'warning' : 'secondary'
                                      }
                                      className={
                                        selectedTeacher.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                                        selectedTeacher.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                                        'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                      }
                                    >
                                      {selectedTeacher.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <span className="font-medium">Join Date:</span>
                                    <span className="col-span-2">{new Date(selectedTeacher.joinDate).toLocaleDateString()}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 items-start gap-4">
                                    <span className="font-medium">Classes:</span>
                                    <div className="col-span-2 flex flex-wrap gap-1">
                                      {selectedTeacher.classes && selectedTeacher.classes.length > 0 ? (
                                        selectedTeacher.classes.map((cls, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {cls}
                                          </Badge>
                                        ))
                                      ) : (
                                        <span className="text-muted-foreground">No classes assigned</span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <span className="font-medium">Account ID:</span>
                                    <span className="col-span-2 text-xs text-muted-foreground">{selectedTeacher.id}</span>
                                  </div>
                                  
                                  {/* This section will show the password if available */}
                                  {selectedTeacher.password && (
                                    <div className="grid grid-cols-3 items-center gap-4 rounded">
                                      <span className="font-medium">Password:</span>
                                      <span className="col-span-2 font-mono">{selectedTeacher.password}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
  )
}

export default ProfileDialog