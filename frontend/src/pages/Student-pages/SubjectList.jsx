import React from 'react';
import { 
  Book, 
  Languages, 
  Calculator, 
  TestTubeDiagonalIcon as Flask,
  Moon, 
  Landmark, 
  Leaf, 
  Globe, 
  Computer, 
  Settings, 
  Atom, 
  Brain, 
  Activity, 
  TrendingUp, 
  Briefcase, 
  BookOpen, 
  Code, 
  Database, 
  Server, 
  Share2, 
  Wrench as Tool,
} from 'lucide-react';
import { classes } from '@/data/tunisian-education';
import { useNavigate } from 'react-router';

// Map icon names to actual Lucide icon components
const iconMap = {
  Book: Book,
  Languages: Languages,
  Calculator: Calculator,
  Flask: Flask,
  Moon: Moon,
  Landmark: Landmark,
  Leaf: Leaf,
  Globe: Globe,
  Computer: Computer,
  Settings: Settings,
  Atom: Atom,
  Brain: Brain,
  Activity: Activity,
  TrendingUp: TrendingUp,
  Briefcase: Briefcase,
  BookOpen: BookOpen,
  Code: Code,
  Database: Database,
  Server: Server,
  Share2: Share2,
  Tool: Tool
};

function SubjectsList({ classLevel }) {
  // Get subjects for the selected class level
  const subjects = classes[classLevel] || [];
  const navigate = useNavigate();

  const handleSubjectClick = (subject) => {
    navigate(`/student/courses/${subject.toLowerCase()}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {subjects.map((subject, index) => {
        // Get the icon component from the map
        const IconComponent = iconMap[subject.icon];
        return (
          <div 
            key={subject.name} 
            className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            onClick={() => handleSubjectClick(subject.name)}
          >
            <div className="bg-primary/10 p-3 rounded-full mb-2">
              {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
            </div>
            <span className="text-center font-medium">{subject.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default SubjectsList;