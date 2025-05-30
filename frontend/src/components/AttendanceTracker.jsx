import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AttendanceTracker({activities}) {
  const [attendanceData, setAttendanceData] = useState([])
  // Get current month name
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'short' })
  
  useEffect(() => {
    if (!activities || activities.length === 0) {
      generateEmptyCalendar();
      return;
    }
    
    // Process activities data
    processAttendanceData(activities);
  }, [activities]);
  
  // Process API data into calendar format
  const processAttendanceData = (activities) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create a map of date -> activity count
    const activityMap = {};
    
    // Group activities by date
    activities.forEach(activity => {
      const activityDate = new Date(activity.createdAt);
      // Only count activities from current month
      if (activityDate.getMonth() !== currentMonth || activityDate.getFullYear() !== currentYear) {
        return;
      }
      
      const dateString = `${activityDate.getFullYear()}-${String(activityDate.getMonth() + 1).padStart(2, '0')}-${String(activityDate.getDate()).padStart(2, '0')}`;
      if (!activityMap[dateString]) {
        activityMap[dateString] = 0;
      }
      activityMap[dateString]++;
    });
    
    // Create calendar data
    const result = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      
      // Use the same date string format as in the activity processing
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const activityCount = activityMap[dateString] || 0;
      
      // Calculate activity level based on count
      let level = 0;
      if (activityCount > 0) {
        level = activityCount <= 2 ? 1 : 
               activityCount <= 5 ? 2 : 
               activityCount <= 8 ? 3 : 4;
      }
      
      result.push({
        date,
        level,
        activities: activityCount
      });
    }
    console.log(result)
    setAttendanceData(result);
  };
  
  // Fallback to generate empty calendar
  const generateEmptyCalendar = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      
      data.push({
        date,
        level: 0,
        activities: 0
      });
    }
    
    setAttendanceData(data);
  };

  return (
    <Card className="mb-4 w-[250px] h-[250px]">
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-2 text-xs">
          <span className="font-medium">Activity - {currentMonth}</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div 
                  key={level}
                  className={`w-2 h-2 rounded-sm ${
                    level === 0 ? 'bg-slate-100 dark:bg-slate-800' :
                    level === 1 ? 'bg-green-100 dark:bg-green-900/30' :
                    level === 2 ? 'bg-green-200 dark:bg-green-800/40' :
                    level === 3 ? 'bg-green-300 dark:bg-green-700/50' :
                    'bg-green-500 dark:bg-green-600'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
            <div key={day} className="text-[10px] text-center text-slate-500">{day}</div>
          ))}
        </div>
        
        <TooltipProvider>
          <div className="grid grid-cols-7 gap-0.5">
            {/* Add empty cells for days before the first day of month */}
            {attendanceData.length > 0 && 
              Array.from({ length: attendanceData[0]?.date.getDay() === 0 ? 6 : attendanceData[0]?.date.getDay() - 1 || 0 }).map((_, i) => (
                <div key={`empty-${i}`} className="w-full aspect-square"></div>
              ))
            }
            
            {/* Show all days in the calendar */}
            {attendanceData.map((day, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div 
                    className={`w-full aspect-square rounded-sm ${
                      day.level === 0 ? 'bg-slate-100 dark:bg-slate-800' :
                      day.level === 1 ? 'bg-green-100 dark:bg-green-900/30' :
                      day.level === 2 ? 'bg-green-200 dark:bg-green-800/40' :
                      day.level === 3 ? 'bg-green-300 dark:bg-green-700/50' :
                      'bg-green-500 dark:bg-green-600'
                    }`}
                  ></div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p>{day.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                    <p>{day.activities} activité{day.activities !== 1 ? 's' : ''}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}