import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight } from "lucide-react";

function BasicInfo({ courseData, setCourseData, nextStep, handleCourseChange, generateSlug }) {
  return (
    <Card>
    <CardHeader>
      <CardTitle>Course Information</CardTitle>
      <CardDescription>Enter the basic details about your course</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Course Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={courseData.name} 
            onChange={handleCourseChange} 
            placeholder="e.g. Mathematics for Beginners"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={courseData.description} 
            onChange={handleCourseChange} 
            placeholder="Describe what students will learn in this course"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex gap-2">
              <Input 
                id="slug" 
                name="slug" 
                value={courseData.slug} 
                onChange={handleCourseChange} 
                placeholder="e.g. mathematics-for-beginners"
              />
              <Button type="button" variant="outline" onClick={generateSlug}>
                Generate
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="classLevel">Class Level</Label>
            <Select 
              value={courseData.classLevel}
              onValueChange={(value) => setCourseData({...courseData, classLevel: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1ere_annee">1ère Année</SelectItem>
                <SelectItem value="2eme_annee">2ème Année</SelectItem>
                <SelectItem value="3eme_annee">3ème Année</SelectItem>
                <SelectItem value="4eme_annee">4ème Année</SelectItem>
                <SelectItem value="5eme_annee">5ème Année</SelectItem>
                <SelectItem value="6eme_annee">6ème Année</SelectItem>
                <SelectItem value="7eme_annee">7ème Année</SelectItem>
                <SelectItem value="8eme_annee">8ème Année</SelectItem>
                <SelectItem value="9eme_annee">9ème Année</SelectItem>
                <SelectItem value="1ere_secondaire">1ère Secondaire</SelectItem>
                <SelectItem value="2eme_secondaire_sciences">2ème Secondaire - Sciences</SelectItem>
                <SelectItem value="2eme_secondaire_eco">2ème Secondaire - Économie</SelectItem>
                <SelectItem value="3eme_secondaire_math">3ème Secondaire - Mathématiques</SelectItem>
                <SelectItem value="3eme_secondaire_sciences">3ème Secondaire - Sciences</SelectItem>
                <SelectItem value="3eme_secondaire_info">3ème Secondaire - Informatique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={courseData.isPublished}
            onChange={handleCourseChange}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="isPublished">Publish this course immediately</Label>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-end">
      <Button onClick={nextStep}>
        Next Step
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
  )
}

export default BasicInfo