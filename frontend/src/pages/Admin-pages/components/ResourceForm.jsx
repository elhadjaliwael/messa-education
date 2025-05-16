import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

function ResourceForm({ 
  currentLesson, 
  currentResource, 
  updateCurrentResource, 
  handleResourceChange, 
  handleAddResource, 
  removeResource 
}) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Resources</h4>
      
      <div className="grid grid-cols-1 gap-4 border p-4 rounded-md">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="resourceTitle">Title</Label>
            <Input 
              id="resourceTitle" 
              name="title" 
              value={currentResource.title} 
              onChange={handleResourceChange} 
              placeholder="e.g. Worksheet"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resourceUrl">URL</Label>
            <Input 
              id="resourceUrl" 
              name="url" 
              value={currentResource.url} 
              onChange={handleResourceChange} 
              placeholder="https://example.com/resource"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resourceType">Type</Label>
            <Select 
              value={currentResource.type}
              onValueChange={(value) => updateCurrentResource({ type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="link">External Link</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button type="button" onClick={handleAddResource} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>
      
      {currentLesson.resources && currentLesson.resources.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Added Resources</h5>
          <div className="space-y-2">
            {currentLesson.resources.map(resource => (
              <div key={resource.id} className="flex justify-between items-center p-2 border rounded-md">
                <div>
                  <span className="font-medium">{resource.title}</span>
                  <span className="text-sm text-muted-foreground ml-2">({resource.type})</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeResource(resource.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceForm;