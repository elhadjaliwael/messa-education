import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Fix the imports
import { MyBarChart } from '@/components/MyBarChart';
import { 
  Users, BookOpen, Award, 
  TrendingUp, Activity, Calendar, 
  ArrowUpRight, ArrowDownRight, Plus
} from 'lucide-react';
import { MyPieChart } from '@/components/MyPieChart';

function AdminDashboard() {
  // Mock data - replace with actual API calls
  const [stats, setStats] = useState({
    totalStudents: 1245,
    totalCourses: 48,
    totalTeachers: 23,
    completionRate: 78,
    activeUsers: 856,
    newRegistrations: 124,
    revenue: 12580,
    revenueChange: 12.5
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'enrollment', user: 'Ahmed Ben Ali', course: 'Mathématiques 9ème', time: '2 hours ago', avatar: '/avatars/01.png' },
    { id: 2, type: 'completion', user: 'Sarra Mejri', course: 'Physique 3ème Secondaire', time: '5 hours ago', avatar: '/avatars/02.png' },
    { id: 3, type: 'review', user: 'Mohamed Karim', course: 'Français 8ème', time: '1 day ago', avatar: '/avatars/03.png' },
    { id: 4, type: 'enrollment', user: 'Nour Sassi', course: 'Sciences 7ème', time: '1 day ago', avatar: '/avatars/04.png' },
    { id: 5, type: 'question', user: 'Yassine Trabelsi', course: 'Anglais 1ère Secondaire', time: '2 days ago', avatar: '/avatars/05.png' },
  ]);

  const courseData = [
    { name: 'Math', students: 420 },
    { name: 'Physics', students: 380 },
    { name: 'Chemistry', students: 290 },
    { name: 'Biology', students: 240 },
    { name: 'French', students: 310 },
    { name: 'English', students: 280 },
  ];

  const classLevelData = [
    { name: 'Primary', value: 35 },
    { name: 'Middle School', value: 40 },
    { name: 'Secondary', value: 25 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'enrollment': return <Users className="h-4 w-4 text-blue-500" />;
      case 'completion': return <Award className="h-4 w-4 text-green-500" />;
      case 'review': return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'question': return <BookOpen className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };
  useEffect(() => {
    // Fetch stats and recent activities from API
  },[])
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +{stats.newRegistrations} this month
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +5 this month
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +2.5% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium flex items-center">
                <ArrowDownRight className="mr-1 h-4 w-4" />
                -3% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Course Enrollments</CardTitle>
            <CardDescription>
              Number of students enrolled in each subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MyBarChart data={courseData} dataKey="students" nameKey="name" className="h-[350px]" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Class Level Distribution</CardTitle>
            <CardDescription>
              Distribution of students across different class levels
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center gap-5">
            <div className="w-[350px]">
              <MyPieChart 
                data={classLevelData} 
                colors={COLORS}
                title="Student Distribution" 
                description="By education level" 
                centerLabel={true}
              />
            </div>
            <div className="space-y-3 pt-8">
              {classLevelData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-sm" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {item.value}%
                  </span>
                </div>
              ))}
              <div className="pt-2 text-xs text-muted-foreground">
                Total students: {stats.totalStudents}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                Trending up by 3.2% this month
              </span>
            </div>
            <div className="leading-none text-muted-foreground">
              Based on current enrollment statistics
            </div>
          </CardFooter>
        </Card>
        
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest student activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activity.avatar} alt={activity.user} />
                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.user}</p>
                    <div className="flex items-center">
                      {getActivityIcon(activity.type)}
                      <p className="text-sm text-muted-foreground ml-1">
                        {activity.type === 'enrollment' ? 'Enrolled in' : 
                         activity.type === 'completion' ? 'Completed' : 
                         activity.type === 'review' ? 'Reviewed' : 'Asked about'} <span className="font-medium">{activity.course}</span>
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;