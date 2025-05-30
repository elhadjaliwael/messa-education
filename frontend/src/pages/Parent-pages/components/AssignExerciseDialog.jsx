import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { classes } from "@/data/tunisian-education"
import React, { useState } from "react"
import { axiosPrivate } from "@/api/axios"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import useAuth from "@/hooks/useAuth"
import { toast } from "sonner"

function AssignExerciseDialog({
  children,
}) {
  const [assignmentForm, setAssignmentForm] = useState({
    childId: "",
    childLevel: "",
    subjectId: "",
    chapterId: "",
    exerciseId: "",
    dueDate: "",
    notes: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [selectedTab, setSelectedTab] = useState("exercises");
  const [open, setOpen] = useState(false);
  const {auth} = useAuth()
  // Handle form field changes
  const handleAssignmentChange = (field, value) => {
    setAssignmentForm(prev => ({
      ...prev,
      [field]: value,
      // Reset dependent fields if parent changes
      ...(field === "childId" ? { subjectId: "", chapterId: "", exerciseId: "" } : {}),
      ...(field === "subjectId" ? { chapterId: "", exerciseId: "" } : {}),
      ...(field === "chapterId" ? { exerciseId: "" } : {}),
    }));
  };
  // Handle form submission
  const handleAssignExercise = async () => {
    // Example: send assignment data to backend
    try {
      const assignmentData = {
        userId: assignmentForm.childId,
        parentId : auth.user.id,
        subject: (() => {
          const subject = subjects.find(subject => subject.name === assignmentForm.subjectId);
          return subject ? { id: subject.id || subject._id , name: subject.name } : null;
        })(),
        chapter: (() => {
          const chapter = chapters.find(chapter => chapter._id === assignmentForm.chapterId);
          return chapter ? { id: chapter._id, title: chapter.title } : null;
        })(),
        lesson: (() => {
          const lesson = lessons.find(lesson => lesson._id === selectedLessonId);
          return lesson ? { id: lesson._id, title: lesson.title } : null;
        })(),
        exercise: (() => {
          const exercise = exercises.find(exercise => exercise._id === assignmentForm.exerciseId);
          return exercise ? { id: exercise._id, title: exercise.title } : null;
        })(),
        quizz: (() => {
          const quizz = quizzes.find(quizz => quizz._id === assignmentForm.quizzId);
          return quizz ? { id: quizz._id, title: quizz.title } : null;
        })(),
        dueDate: assignmentForm.dueDate,
        notes: assignmentForm.notes
      }
       await axiosPrivate.post("/courses/student/assignments", assignmentData);
       toast.success("Exercise assigned successfully");
       setAssignmentForm({
        childId: "",
        childLevel: "",
        subjectId: "",
        chapterId: "",
        exerciseId: "",
        quizzId: "",
        dueDate: "",
        notes: "",
      });
      setOpen(false); // <-- Close the dialog on success
      // Handle success
    } catch (err) {
      toast.error("Failed to assign exercise");
      // Handle error
    }
  };
  // When child changes, set subjects
  const handleChildSelect = (childLevel) => {
    setSubjects(classes[childLevel] || []);
    setChapters([]);
    setLessons([]);
    setExercises([]);
  };

  // When subject changes, fetch chapters
  const handleSubjectSelect = async (subjectName) => {
    // Example: fetch chapters for this subject from backend
    try {
      const res = await axiosPrivate.get(`/courses/chapters/${subjectName}/${assignmentForm.childLevel}`);
      setChapters(res.data.chapters || []);
      setExercises([]);
    } catch (err) {
      setChapters([]);
      setExercises([]);
    }
  };

  // When chapter changes, fetch exercises
  const handleChapterSelect = async (chapterId) => {
    try {
      const res = await axiosPrivate.get(`/courses/student/${chapterId}/lessons`);
      setLessons(res.data.lessons || []);
      setSelectedLessonId(""); // reset lesson selection
      setExercises([]); // reset exercises
    } catch (err) {
      setLessons([]);
      setSelectedLessonId("");
      setExercises([]);
    }
  };

  // When lesson changes, set exercises and quizzes for that lesson
  const handleLessonSelect = (lessonId) => {
    setSelectedLessonId(lessonId);
    const lesson = lessons.find(l => l._id === lessonId);
    setExercises(lesson?.exercises || []);
    setQuizzes(lesson?.quizzes || []);
    handleAssignmentChange("exerciseId", ""); // reset exercise selection
    handleAssignmentChange("quizzId", ""); // reset quiz selection
  };

  const [quizzes, setQuizzes] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return assignmentForm.childId && assignmentForm.subjectId && assignmentForm.chapterId && selectedLessonId;
      case 2:
        return selectedTab === "exercises" ? assignmentForm.exerciseId : assignmentForm.quizzId;
      case 3:
        return assignmentForm.dueDate;
      default:
        return false;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Assign Exercise
        </Button>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: 600, padding: 0 }}>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Assign New Exercise or Quiz</DialogTitle>
          <DialogDescription>
            Select a child and assign an exercise or quiz. Set a due date for completion.
          </DialogDescription>
          
          {/* Step indicator */}
          <div className="flex justify-between mt-4 mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step 
                      ? "bg-primary text-primary-foreground" 
                      : currentStep > step 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? <Check size={16} /> : step}
                </div>
                <span className="text-xs mt-1">
                  {step === 1 ? "Select" : step === 2 ? "Choose" : "Schedule"}
                </span>
              </div>
            ))}
          </div>
        </DialogHeader>
        
        <div style={{ maxHeight: "60vh", overflowY: "auto" }} className="px-6 py-4">
          {/* Step 1: Select Child, Subject, Chapter, Lesson */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Select Content</h3>
              
              <Card>
                <CardContent className="pt-4">
                  {/* Select Child */}
                  <div className="grid gap-2 mb-4">
                    <Label htmlFor="child">Child</Label>
                    <Select
                      value={assignmentForm.childId || ""}
                      onValueChange={value => {
                        handleAssignmentChange("childId", value);
                        const selectedChild = children.find(child => child.id.toString() === value);
                        if (selectedChild) {
                          handleChildSelect(selectedChild.level);
                          handleAssignmentChange('childLevel', selectedChild.level)
                        }
                      }}
                    >
                      <SelectTrigger id="child">
                        <SelectValue placeholder="Select child" />
                      </SelectTrigger>
                      <SelectContent>
                        {children.map(child => (
                          <SelectItem key={child.id} value={child.id.toString()}>
                            {child.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Select Subject */}
                  <div className="grid gap-2 mb-4">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={assignmentForm.subjectId || ""}
                      onValueChange={async value => {
                        handleAssignmentChange("subjectId", value);
                        await handleSubjectSelect(value);
                      }}
                      disabled={!assignmentForm.childId}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {(subjects || []).map(subject => (
                          <SelectItem key={subject.name} value={subject.name}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Select Chapter */}
                  <div className="grid gap-2 mb-4">
                    <Label htmlFor="chapter">Chapter</Label>
                    {chapters.length > 0 ? 
                    <Select
                      value={assignmentForm.chapterId || ""}
                      onValueChange={async value => {
                        handleAssignmentChange("chapterId", value);
                        await handleChapterSelect(value);
                      }}
                      disabled={!assignmentForm.subjectId}
                    >
                      <SelectTrigger id="chapter">
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {(chapters || []).map(chapter => (
                          <SelectItem key={chapter._id} value={chapter._id.toString()}>
                            {chapter.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> 
                      : <div className="flex flex-col items-center justify-center p-4 rounded-md bg-muted/50 border border-muted text-muted-foreground">
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="mb-2 text-muted-foreground">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                      </svg>
                      <span>No Chapters available for this subject.</span>
                    </div> }
                  </div>
                  
                  {/* Select Lesson */}
                  <div className="grid gap-2">
                    <Label htmlFor="lesson">Lesson</Label>
                    {lessons.length > 0 ? 
                      <Select
                        value={selectedLessonId}
                        onValueChange={value => {
                          handleLessonSelect(value);
                        }}
                        disabled={!assignmentForm.chapterId}
                      >
                        <SelectTrigger id="lesson">
                          <SelectValue placeholder="Select lesson" />
                        </SelectTrigger>
                        <SelectContent>
                          {(lessons || []).map(lesson => (
                            <SelectItem key={lesson._id} value={lesson._id}>
                              {lesson.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> 
                    : (
                      <div className="flex flex-col items-center justify-center p-4 rounded-md bg-muted/50 border border-muted text-muted-foreground">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="mb-2 text-muted-foreground">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="12" cy="16" r="1" fill="currentColor"/>
                        </svg>
                        <span>No lessons available for this subject.</span>
                      </div>
                    )} 
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Step 2: Select Exercise or Quiz */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Choose Activity</h3>
              
              <Card>
                <CardContent className="pt-4">
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="exercises">Exercises</TabsTrigger>
                      <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="exercises">
                      <div className="grid gap-2">
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {exercises.length > 0 ? (
                            exercises.map(exercise => (
                              <div
                                key={exercise._id}
                                className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                                  assignmentForm.exerciseId === exercise._id.toString()
                                    ? "bg-primary/10 border-primary"
                                    : "hover:bg-muted"
                                }`}
                                onClick={() => handleAssignmentChange("exerciseId", exercise._id.toString())}
                              >
                                <span className="font-medium">{exercise.title}</span>
                                <span className="text-xs text-muted-foreground ml-auto">{exercise.type}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground text-center py-8">
                              No exercises available for this lesson.
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="quizzes">
                      <div className="grid gap-2">
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {quizzes.length > 0 ? (
                            quizzes.map(quizz => (
                              <div
                                key={quizz._id}
                                className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                                  assignmentForm.quizzId === quizz._id.toString()
                                    ? "bg-primary/10 border-primary"
                                    : "hover:bg-muted"
                                }`}
                                onClick={() => handleAssignmentChange("quizzId", quizz._id.toString())}
                              >
                                <span className="font-medium">{quizz.title}</span>
                                <span className="text-xs text-muted-foreground ml-auto">Quiz</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground text-center py-8">
                              No quizzes available for this lesson.
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Step 3: Set Due Date and Notes */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Schedule Assignment</h3>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={assignmentForm.dueDate}
                        onChange={e => handleAssignmentChange("dueDate", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Add notes for your child..."
                        value={assignmentForm.notes}
                        onChange={e => handleAssignmentChange("notes", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex w-full justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={goToPreviousStep} className="gap-2">
                <ArrowLeft size={16} />
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < totalSteps ? (
              <Button 
                onClick={goToNextStep} 
                disabled={!isStepComplete()}
                className="gap-2"
              >
                Next
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handleAssignExercise()
                }}
                disabled={!isStepComplete()}
              >
                Assign {selectedTab === "exercises" ? "Exercise" : "Quiz"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignExerciseDialog