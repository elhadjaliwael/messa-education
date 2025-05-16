import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import the extracted tab components
import LessonsTab from './components/LessonsTab';

function ContentForm({ prevStep, nextStep }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
        <CardDescription>Add lessons, exercises, and quizzes to your chapters</CardDescription>
      </CardHeader>
      <CardContent>
       <LessonsTab></LessonsTab>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={nextStep}>
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ContentForm;