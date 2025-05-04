import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from "lucide-react";

function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // In a real app, fetch the lesson data from your API
    const fetchLesson = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock lesson data
          const mockLesson = {
            id: parseInt(lessonId),
            title: "Les angles et les triangles",
            courseId: parseInt(courseId),
            duration: "20 min",
            sections: [
              {
                id: 1,
                title: "Introduction aux angles",
                content: `
                  <h2>Qu'est-ce qu'un angle?</h2>
                  <p>Un angle est formé par deux demi-droites ayant la même origine. Cette origine est appelée le sommet de l'angle.</p>
                  <p>Les angles sont mesurés en degrés (°) ou en radians. Un angle complet mesure 360° ou 2π radians.</p>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Angle_radian.svg/300px-Angle_radian.svg.png" alt="Angle diagram" class="my-4 mx-auto" />
                  <h3>Types d'angles</h3>
                  <ul>
                    <li><strong>Angle aigu</strong>: mesure moins de 90°</li>
                    <li><strong>Angle droit</strong>: mesure exactement 90°</li>
                    <li><strong>Angle obtus</strong>: mesure plus de 90° mais moins de 180°</li>
                    <li><strong>Angle plat</strong>: mesure exactement 180°</li>
                  </ul>
                `
              },
              {
                id: 2,
                title: "Les triangles",
                content: `
                  <h2>Propriétés des triangles</h2>
                  <p>Un triangle est un polygone à trois côtés. La somme des angles intérieurs d'un triangle est toujours égale à 180°.</p>
                  <h3>Types de triangles</h3>
                  <ul>
                    <li><strong>Triangle équilatéral</strong>: trois côtés égaux et trois angles égaux (60° chacun)</li>
                    <li><strong>Triangle isocèle</strong>: deux côtés égaux et deux angles égaux</li>
                    <li><strong>Triangle scalène</strong>: aucun côté égal et aucun angle égal</li>
                    <li><strong>Triangle rectangle</strong>: possède un angle droit (90°)</li>
                  </ul>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Triangle.Equilateral.svg/300px-Triangle.Equilateral.svg.png" alt="Triangle types" class="my-4 mx-auto" />
                `
              },
              {
                id: 3,
                title: "Théorème de Pythagore",
                content: `
                  <h2>Le théorème de Pythagore</h2>
                  <p>Dans un triangle rectangle, le carré de la longueur de l'hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.</p>
                  <div class="bg-muted p-4 rounded-md my-4 text-center">
                    <p class="text-lg font-bold">a² + b² = c²</p>
                    <p class="text-sm">où c est l'hypoténuse et a et b sont les deux autres côtés</p>
                  </div>
                  <p>Ce théorème est fondamental en géométrie et a de nombreuses applications pratiques.</p>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Pythagorean.svg/300px-Pythagorean.svg.png" alt="Pythagoras theorem" class="my-4 mx-auto" />
                  <h3>Exemple</h3>
                  <p>Si a = 3 et b = 4, alors c² = 3² + 4² = 9 + 16 = 25, donc c = 5.</p>
                `
              }
            ],
            nextLesson: {
              id: 3,
              title: "Les cercles et les polygones"
            },
            prevLesson: {
              id: 1,
              title: "Les points et les lignes"
            },
            hasExercise: true,
            exerciseId: 2
          };
          
          setLesson(mockLesson);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching lesson:", error);
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  useEffect(() => {
    // Update progress based on current section
    if (lesson) {
      const newProgress = Math.round(((currentSection + 1) / lesson.sections.length) * 100);
      setProgress(newProgress);
    }
  }, [currentSection, lesson]);

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If this is the first section, go back to previous lesson if it exists
      if (lesson.prevLesson) {
        navigate(`/student/courses/${courseId}/lesson/${lesson.prevLesson.id}`);
      } else {
        navigate(`/student/courses/${courseId}`);
      }
    }
  };

  const handleNext = () => {
    if (currentSection < lesson.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If this is the last section, mark as complete and offer to go to exercise
      // In a real app, you would make an API call to mark the lesson as complete
      if (lesson.hasExercise) {
        navigate(`/student/courses/${courseId}/exercise/${lesson.exerciseId}`);
      } else if (lesson.nextLesson) {
        navigate(`/student/courses/${courseId}/lesson/${lesson.nextLesson.id}`);
      } else {
        navigate(`/student/courses/${courseId}`);
      }
    }
  };

  const markAsComplete = () => {
    // In a real app, make an API call to mark the lesson as complete
    console.log("Marking lesson as complete");
    // Then navigate to the next lesson or back to course
    if (lesson.nextLesson) {
      navigate(`/student/courses/${courseId}/lesson/${lesson.nextLesson.id}`);
    } else {
      navigate(`/student/courses/${courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="h-64 bg-muted rounded w-full mb-8"></div>
          <div className="flex justify-between">
            <div className="h-10 bg-muted rounded w-24"></div>
            <div className="h-10 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionContent = lesson.sections[currentSection];

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb and navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to={`/student/courses/${courseId}`} className="text-primary hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au cours
        </Link>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
        </div>
      </div>

      {/* Lesson title and progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <div className="flex items-center mb-2">
          <Progress value={progress} className="h-2 flex-1 mr-4" />
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Section {currentSection + 1} sur {lesson.sections.length}</span>
          <span>{currentSectionContent.title}</span>
        </div>
      </div>

      {/* Section navigation */}
      <div className="flex mb-6 overflow-x-auto pb-2">
        {lesson.sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setCurrentSection(index)}
            className={`px-4 py-2 mr-2 rounded-full text-sm whitespace-nowrap ${
              index === currentSection
                ? 'bg-primary text-primary-foreground'
                : index < currentSection
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {index < currentSection && <CheckCircle className="h-3 w-3 inline mr-1" />}
            {section.title}
          </button>
        ))}
      </div>

      {/* Lesson content */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentSectionContent.content }}
          />
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentSection === 0 && lesson.prevLesson 
            ? `Leçon précédente` 
            : `Section précédente`}
        </Button>
        
        <Button 
          onClick={handleNext}
          className="flex items-center"
        >
          {currentSection === lesson.sections.length - 1 && lesson.hasExercise
            ? `Passer aux exercices`
            : currentSection === lesson.sections.length - 1
            ? `Terminer la leçon`
            : `Section suivante`}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default LessonPage;