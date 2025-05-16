import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

function ExercisesForm({ 
  currentLesson, 
  updateCurrentLesson 
}) {
  const addExercise = () => {
    const newExercise = {
      id: Date.now().toString(),
      title: '',
      description: '',
      type: 'coding',
      points: 10,
      content: '',
      solution: ''
    };
    
    updateCurrentLesson({
      exercises: [...(currentLesson.exercises || []), newExercise]
    });
  };
  
  const updateExercise = (id, data) => {
    const updatedExercises = (currentLesson.exercises || []).map(exercise => 
      exercise.id === id ? { ...exercise, ...data } : exercise
    );
    
    updateCurrentLesson({ exercises: updatedExercises });
  };
  
  const removeExercise = (id) => {
    const updatedExercises = (currentLesson.exercises || []).filter(
      exercise => exercise.id !== id
    );
    
    updateCurrentLesson({ exercises: updatedExercises });
    toast.success("Exercise removed");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Exercises</h4>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addExercise}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
      </div>
      
      {(!currentLesson.exercises || currentLesson.exercises.length === 0) ? (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">No exercises added yet. Add an exercise to help students practice.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentLesson.exercises.map((exercise, index) => (
            <div key={exercise.id} className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Exercise {index + 1}</h5>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeExercise(exercise.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`exercise-title-${exercise.id}`}>Title</Label>
                  <Input 
                    id={`exercise-title-${exercise.id}`}
                    value={exercise.title} 
                    onChange={(e) => updateExercise(exercise.id, { title: e.target.value })} 
                    placeholder="e.g. Array Manipulation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`exercise-type-${exercise.id}`}>Type</Label>
                  <Select 
                    value={exercise.type}
                    onValueChange={(value) => updateExercise(exercise.id, { type: value })}
                  >
                    <SelectTrigger id={`exercise-type-${exercise.id}`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="written">Written</SelectItem>
                      <SelectItem value="project">Mini Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`exercise-description-${exercise.id}`}>Description</Label>
                <Textarea 
                  id={`exercise-description-${exercise.id}`}
                  value={exercise.description} 
                  onChange={(e) => updateExercise(exercise.id, { description: e.target.value })} 
                  placeholder="Describe what the student needs to do"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`exercise-content-${exercise.id}`}>Exercise Content</Label>
                <Textarea 
                  id={`exercise-content-${exercise.id}`}
                  value={exercise.content} 
                  onChange={(e) => updateExercise(exercise.id, { content: e.target.value })} 
                  placeholder="The main content of your exercise (problem statement, starter code, etc.)"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`exercise-solution-${exercise.id}`}>Solution (for instructors)</Label>
                <Textarea 
                  id={`exercise-solution-${exercise.id}`}
                  value={exercise.solution} 
                  onChange={(e) => updateExercise(exercise.id, { solution: e.target.value })} 
                  placeholder="Provide a solution or answer key (only visible to instructors)"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`exercise-points-${exercise.id}`}>Points</Label>
                <Input 
                  id={`exercise-points-${exercise.id}`}
                  type="number" 
                  min="0" 
                  value={exercise.points} 
                  onChange={(e) => updateExercise(exercise.id, { points: parseInt(e.target.value) || 0 })} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExercisesForm;