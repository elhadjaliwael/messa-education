import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useState } from 'react';
import useCourseStore from '@/store/courseStore';
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = "dc6hczfu5";
const CLOUDINARY_UPLOAD_PRESET = "messa_education";

function ExercisesForm() {
  const { 
    currentLesson, 
    addExercise, 
    removeExercise, 
    updateExercise 
  } = useCourseStore();
  
  const [uploadingContent, setUploadingContent] = useState({});
  const [uploadingSolution, setUploadingSolution] = useState({});

  // Dedicated Cloudinary upload function for exercises
  const handleExerciseImageUpload = async (file, exerciseId, type) => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const uploadStateKey = type === 'content' ? 'uploadingContent' : 'uploadingSolution';
    const setUploadState = type === 'content' ? setUploadingContent : setUploadingSolution;
    
    // Set uploading state
    setUploadState(prev => ({ ...prev, [exerciseId]: true }));
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'exercises'); // Organize uploads in exercises folder
      
      // Make the upload request
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      // Update exercise with the uploaded image
      const updateData = {
        [type]: {
          text: '',
          imageUrl: response.data.secure_url,
          [`${type}Type`]: 'image'
        }
      };
      
      updateExercise(exerciseId, updateData);
      
      toast.success(`${type === 'content' ? 'Content' : 'Solution'} image uploaded successfully!`);
      
      return response.data;
      
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      
      // Handle specific error cases
      if (error.code === 'ECONNABORTED') {
        toast.error('Upload timeout. Please try again.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid file format or upload preset.');
      } else if (error.response?.status === 401) {
        toast.error('Upload authentication failed.');
      } else {
        toast.error(`Failed to upload image: ${error.response?.data?.error?.message || error.message}`);
      }
      
      throw error;
      
    } finally {
      // Reset uploading state
      setUploadState(prev => ({ ...prev, [exerciseId]: false }));
    }
  };

  const handleAddExercise = () => {
    addExercise();
    toast.success("Exercise added");
  };
  
  const handleRemoveExercise = (id) => {
    removeExercise(id);
    toast.success("Exercise removed");
  };

  const handleContentImageUpload = async (exerciseId, file) => {
    return await handleExerciseImageUpload(file, exerciseId, 'content');
  };

  const handleSolutionImageUpload = async (exerciseId, file) => {
    return await handleExerciseImageUpload(file, exerciseId, 'solution');
  };

  const removeContentImage = (exerciseId) => {
    updateExercise(exerciseId, {
      content: {
        text: '',
        imageUrl: '',
        contentType: 'text'
      }
    });
    toast.success('Content image removed');
  };

  const removeSolutionImage = (exerciseId) => {
    updateExercise(exerciseId, {
      solution: {
        text: '',
        imageUrl: '',
        solutionType: 'text'
      }
    });
    toast.success('Solution image removed');
  };

  // Helper function to ensure backward compatibility
  const getExerciseContent = (exercise) => {
    if (typeof exercise.content === 'string') {
      return {
        text: exercise.content,
        imageUrl: '',
        contentType: 'text'
      };
    }
    return exercise.content || { text: '', imageUrl: '', contentType: 'text' };
  };

  const getExerciseSolution = (exercise) => {
    if (typeof exercise.solution === 'string') {
      return {
        text: exercise.solution,
        imageUrl: '',
        solutionType: 'text'
      };
    }
    return exercise.solution || { text: '', imageUrl: '', solutionType: 'text' };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Exercises</h4>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleAddExercise}
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
          {currentLesson.exercises.map((exercise, index) => {
            const content = getExerciseContent(exercise);
            const solution = getExerciseSolution(exercise);
            console.log(exercise)
            return (
              <div key={exercise._id} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Exercise {index + 1}</h5>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveExercise(exercise._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`exercise-title-${exercise._id}`}>Title</Label>
                    <Input 
                      id={`exercise-title-${exercise._id}`}
                      value={exercise.title} 
                      onChange={(e) => updateExercise(exercise._id, { title: e.target.value })} 
                      placeholder="e.g. Array Manipulation"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`exercise-type-${exercise._id}`}>Type</Label>
                    <Select 
                      value={exercise.type}
                      onValueChange={(value) => updateExercise(exercise._id, { type: value })}
                    >
                      <SelectTrigger id={`exercise-type-${exercise._id}`}>
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
                  <Label htmlFor={`exercise-description-${exercise._id}`}>Description</Label>
                  <Textarea 
                    id={`exercise-description-${exercise._id}`}
                    value={exercise.description} 
                    onChange={(e) => updateExercise(exercise._id, { description: e.target.value })} 
                    placeholder="Describe what the student needs to do"
                    rows={2}
                  />
                </div>
                
                {/* Exercise Content Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Exercise Content</Label>
                    <Select 
                      value={content.contentType}
                      onValueChange={(value) => {
                        updateExercise(exercise._id, {
                          content: {
                            text: value === 'text' ? content.text : '',
                            imageUrl: value === 'image' ? content.imageUrl : '',
                            contentType: value
                          }
                        });
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(content.contentType === 'text' || content.contentType === 'both') && (
                    <Textarea 
                      value={content.text} 
                      onChange={(e) => updateExercise(exercise._id, {
                        content: { ...content, text: e.target.value }
                      })} 
                      placeholder="The main content of your exercise (problem statement, starter code, etc.)"
                      rows={4}
                    />
                  )}
                  
                  {(content.contentType === 'image' || content.contentType === 'both') && (
                    <div className="space-y-2">
                      {content.imageUrl ? (
                        <div className="relative">
                          <img 
                            src={content.imageUrl} 
                            alt="Exercise content" 
                            className="max-w-full h-auto rounded-md border"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeContentImage(exercise._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-md p-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleContentImageUpload(exercise._id, e.target.files[0])}
                            className="hidden"
                            id={`content-upload-${exercise._id}`}
                            disabled={uploadingContent[exercise._id]}
                          />
                          <label 
                            htmlFor={`content-upload-${exercise._id}`}
                            className={`flex flex-col items-center justify-center cursor-pointer ${
                              uploadingContent[exercise._id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">
                              {uploadingContent[exercise._id] ? 'Uploading...' : 'Click to upload content image'}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              Max 10MB • JPG, PNG, GIF
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Exercise Solution Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Solution (for instructors)</Label>
                    <Select 
                      value={solution.solutionType}
                      onValueChange={(value) => {
                        updateExercise(exercise._id, {
                          solution: {
                            text: value === 'text' ? solution.text : '',
                            imageUrl: value === 'image' ? solution.imageUrl : '',
                            solutionType: value
                          }
                        });
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(solution.solutionType === 'text' || solution.solutionType === 'both') && (
                    <Textarea 
                      value={solution.text} 
                      onChange={(e) => updateExercise(exercise._id, {
                        solution: { ...solution, text: e.target.value }
                      })} 
                      placeholder="Provide a solution or answer key (only visible to instructors)"
                      rows={4}
                    />
                  )}
                  
                  {(solution.solutionType === 'image' || solution.solutionType === 'both') && (
                    <div className="space-y-2">
                      {solution.imageUrl ? (
                        <div className="relative">
                          <img 
                            src={solution.imageUrl} 
                            alt="Exercise solution" 
                            className="max-w-full h-auto rounded-md border"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeSolutionImage(exercise._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-md p-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSolutionImageUpload(exercise._id, e.target.files[0])}
                            className="hidden"
                            id={`solution-upload-${exercise._id}`}
                            disabled={uploadingSolution[exercise._id]}
                          />
                          <label 
                            htmlFor={`solution-upload-${exercise._id}`}
                            className={`flex flex-col items-center justify-center cursor-pointer ${
                              uploadingSolution[exercise._id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">
                              {uploadingSolution[exercise._id] ? 'Uploading...' : 'Click to upload solution image'}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              Max 10MB • JPG, PNG, GIF
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`exercise-points-${exercise._id}`}>Points</Label>
                  <Input 
                    id={`exercise-points-${exercise._id}`}
                    type="number" 
                    min="0" 
                    value={exercise.points} 
                    onChange={(e) => updateExercise(exercise._id, { points: parseInt(e.target.value) || 0 })} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExercisesForm;