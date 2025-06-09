import React, { useState, useEffect } from 'react';
import { axiosPrivate } from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Users, GraduationCap, School, BookOpen, 
  Activity, ArrowUpRight 
} from 'lucide-react';
import { MyPieChart } from '@/components/MyPieChart';
import { MyBarChart } from '@/components/MyBarChart';
import { NotificationBell } from '@/components/NotificationBell';


const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalStudents: 0,
      totalTeachers: 0,
      totalParents: 0,
      activeTeachers: 0,
      studentPercentage: 0,
      teacherPercentage: 0
    },
    classDistribution: [],
    subjectDistribution: [],
    registrationTrends: [],
    recentRegistrations: [],
    teacherStudentRatio: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/auth/admin/analytics');
        setAnalytics(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [axiosPrivate]);

  console.log(analytics.registrationTrends)
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <NotificationBell/>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                {analytics.registrationTrends.length > 0 ? 
                  `+${analytics.registrationTrends[analytics.registrationTrends.length - 1].total} this month` : 
                  'No recent data'}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                {analytics.overview.studentPercentage}% of total users
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-500 font-medium flex items-center">
                <Activity className="mr-1 h-4 w-4" />
                {analytics.overview.activeTeachers} active
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher-Student Ratio</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.totalTeachers > 0 
                ? (analytics.overview.totalStudents / analytics.overview.totalTeachers).toFixed(1) + ':1'
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all classes
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
          <MyPieChart data={analytics.classDistribution}></MyPieChart>
          
          {/* Registration Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Trends</CardTitle>
              <CardDescription>New users over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <MyBarChart data={analytics.registrationTrends}></MyBarChart>
            </CardContent>
          </Card>
      </div>
      
      {/* Recent Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>Latest users who joined the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Level</th>
                  <th className="text-left p-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentRegistrations.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary font-medium">{user.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span>{user.username}</span>
                    </td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 capitalize">{user.role}</td>
                    <td className="p-2">{user.level || 'N/A'}</td>
                    <td className="p-2">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;