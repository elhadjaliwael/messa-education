import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosPrivate } from '@/api/axios';
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, Save, Clock, FileText, Video, Image } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function LessonEditPage() {
  const { id, chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
    estimatedTime: 30,
    content: "",
    contentType: "text",
    cloudinaryUrl: null,
    cloudinaryPublicId: null,
  });

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        setLoading(true);
        // Updated API endpoint to use the configured base URL in axiosPrivate
        const response = await axiosPrivate.get(`/courses/${id}/chapters/${chapterId}/lessons/${lessonId}`);
        
        // Check if the response contains the lesson data
        if (!response.data || !response.data.lesson) {
          throw new Error('Invalid response format');
        }
        
        const lessonData = response.data.lesson;
        
        const initialData = {
          title: lessonData.title || "",
          description: lessonData.description || "",
          order: lessonData.order || 1,
          estimatedTime: lessonData.estimatedTime || 30,
          content: lessonData.content || "",
          contentType: lessonData.contentType || "text",
          cloudinaryUrl: lessonData.cloudinaryUrl || null,
          cloudinaryPublicId: lessonData.cloudinaryPublicId || null,
        };
        
        // Set form values and original data for comparison
        setFormData(initialData);
        setOriginalData(initialData);
      } catch (err) {
        console.error('Error fetching lesson details:', err);
        setError('Failed to load lesson details. Please try again later.');
        toast.error("Failed to load lesson details");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [id, chapterId, lessonId]);

  // Check for changes when form data updates
  useEffect(() => {
    if (originalData) {
      const changed = Object.keys(formData).some(key => formData[key] !== originalData[key]);
      setHasChanges(changed);
    }
  }, [formData, originalData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title) {
      errors.title = "Title is required";
    } else if (formData.title.length < 2) {
      errors.title = "Title must be at least 2 characters";
    }
    
    if (!formData.order || formData.order < 1) {
      errors.order = "Order must be a positive number";
    }
    
    if (!formData.estimatedTime || formData.estimatedTime < 1) {
      errors.estimatedTime = "Estimated time must be at least 1 minute";
    }
    
    if (formData.contentType === "text" && !formData.content) {
      errors.content = "Content is required for text lessons";
    }
    
    if ((formData.contentType === "video" || formData.contentType === "image") && 
        !formData.cloudinaryUrl) {
      errors.cloudinaryUrl = `${formData.contentType.charAt(0).toUpperCase() + formData.contentType.slice(1)} URL is required`;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    try {
      setSubmitting(true);
      await axiosPrivate.put(`http://localhost:8000/api/courses/${id}/chapters/${chapterId}/lessons/${lessonId}`, formData);
      toast.success("Lesson updated successfully");
      navigate(`/admin/courses/${id}/view`);
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Failed to update lesson");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setFormErrors({});
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary upload preset

    try {
      setSubmitting(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your-cloud-name/${formData.contentType === 'video' ? 'video' : 'image'}/upload`, // Replace with your cloud name
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setFormData(prev => ({
          ...prev,
          cloudinaryUrl: data.secure_url,
          cloudinaryPublicId: data.public_id
        }));
        toast.success("File uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/admin/courses/${id}/view`)}
        >
          Return to Course
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/admin/courses/${id}/view`)}
            className="h-9 w-9 p-0 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Course</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Lesson</h1>
        </div>
        {hasChanges && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Unsaved changes</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          </div>
        )}
      </div>

      <Card className="border-0 shadow-md overflow-hidden">
        <CardHeader >
          <CardTitle>Lesson Information</CardTitle>
          <CardDescription>Update the information for this lesson</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="content">Lesson Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="basic" className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">Title</Label>
                <Input 
                  id="title"
                  name="title"
                  placeholder="e.g. Introduction to Algebra" 
                  value={formData.title}
                  onChange={handleInputChange}
                  className={formErrors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {formErrors.title && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {formErrors.title}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Enter a description for the lesson" 
                  className="min-h-[100px]" 
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">
                  A brief description of what this lesson covers
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-base">Order</Label>
                  <Input 
                    id="order"
                    name="order"
                    type="number" 
                    min="1"
                    value={formData.order}
                    onChange={handleNumberChange}
                    className={formErrors.order ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  <p className="text-sm text-muted-foreground">
                    The position of this lesson in the chapter
                  </p>
                  {formErrors.order && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.order}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime" className="text-base">Estimated Time (minutes)</Label>
                  <Input 
                    id="estimatedTime"
                    name="estimatedTime"
                    type="number" 
                    min="1"
                    value={formData.estimatedTime}
                    onChange={handleNumberChange}
                    className={formErrors.estimatedTime ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  <p className="text-sm text-muted-foreground">
                    How long this lesson takes to complete
                  </p>
                  {formErrors.estimatedTime && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.estimatedTime}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contentType" className="text-base">Content Type</Label>
                <Select 
                  value={formData.contentType}
                  onValueChange={(value) => handleSelectChange("contentType", value)}
                >
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        Text
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                        Video
                      </div>
                    </SelectItem>
                    <SelectItem value="image">
                      <div className="flex items-center">
                        <Image className="h-4 w-4 mr-2 text-muted-foreground" />
                        Image
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  The type of content for this lesson
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="p-6 space-y-6">
              {formData.contentType === "text" ? (
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-base">Lesson Content</Label>
                  <Textarea 
                    id="content"
                    name="content"
                    placeholder="Enter the lesson content here..." 
                    className="min-h-[300px]" 
                    value={formData.content}
                    onChange={handleInputChange}
                  />
                  {formErrors.content && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.content}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Content is managed in the Media tab for {formData.contentType} lessons
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("media")}
                    >
                      Go to Media Tab
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="media" className="p-6 space-y-6">
              {formData.contentType !== "text" ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base">
                      {formData.contentType === "video" ? "Video" : "Image"} Upload
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input 
                          type="file" 
                          accept={formData.contentType === "video" ? "video/*" : "image/*"}
                          onChange={handleFileUpload}
                          disabled={submitting}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Upload a {formData.contentType === "video" ? "video" : "image"} file
                        </p>
                        {formErrors.cloudinaryUrl && (
                          <p className="text-sm text-red-500 flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.cloudinaryUrl}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cloudinaryUrl" className="text-base">
                          {formData.contentType === "video" ? "Video" : "Image"} URL
                        </Label>
                        <Input 
                          id="cloudinaryUrl"
                          name="cloudinaryUrl"
                          placeholder={`Enter ${formData.contentType} URL`}
                          value={formData.cloudinaryUrl || ""}
                          onChange={handleInputChange}
                          className={formErrors.cloudinaryUrl ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        <p className="text-sm text-muted-foreground">
                          Or enter a URL directly
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {formData.cloudinaryUrl && (
                    <div className="border rounded-md p-4">
                      <h3 className="text-base font-medium mb-2">Preview</h3>
                      {formData.contentType === "video" ? (
                        <video 
                          src={formData.cloudinaryUrl} 
                          controls 
                          className="w-full max-h-[300px] rounded-md"
                        />
                      ) : (
                        <img 
                          src={formData.cloudinaryUrl} 
                          alt="Lesson content" 
                          className="max-w-full max-h-[300px] rounded-md mx-auto"
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Media upload is only available for video and image lessons
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("basic")}
                    >
                      Change Content Type
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-between border-t p-6 bg-muted/5">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => navigate(`/admin/courses/${id}/view`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || !hasChanges}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default LessonEditPage;