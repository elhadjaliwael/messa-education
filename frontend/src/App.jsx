import Home from './components/Home'
import useTheme from './hooks/useTheme'
import themeContext from './contexts/theme-context'
import Login from './components/Login'
import StudentDashboard from './pages/StudentDashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoutes'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'
import SignUp from './components/Signup'
import { Navigate } from 'react-router-dom'
import AuthCallback from './components/AuthCallback';
import useAuth from './hooks/useAuth'
// Import student pages
import DashboardPage from './pages/Student-pages/DashboardPage'
import CoursesPage from './pages/Student-pages/CoursesPage'
import MessagesPage from './pages/Student-pages/MessagesPage'
import SettingsPage from './pages/Student-pages/SettingsPage'
import CourseContent from './pages/Student-pages/CourseContent'
import LessonPage from './pages/Student-pages/LessonPage'
import ExercisePage from './pages/Student-pages/ExercisePage'
import QuizPage from './pages/Student-pages/QuizPage'
import { Toaster } from 'sonner'
//Admin pages
import AdminDashboardPage from './pages/Admin-pages/AdminDashboardPage'
import AdminCoursesPage from './pages/Admin-pages/AdminCoursesPage'
import AdminUsersPage from './pages/Admin-pages/AdminUsersPage'
import AdminSettingsPage from './pages/Admin-pages/AdminSettingsPage'
import AddCourse from './pages/Admin-pages/AddCourse'

function App() {
  const {theme,setTheme} = useTheme();
  const {isLoading} = useAuth();
  if(isLoading){
    return <div>Loading...</div>
  }
  return (
    <>
      <themeContext.Provider value={{theme,setTheme}}>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Student routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student" element={<StudentDashboard />}>
                <Route index element={<DashboardPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="settings" element={<SettingsPage />} />
                
                {/* Nested course routes */}
                <Route path="courses/:courseId" element={<CourseContent />} />
                <Route path="courses/:courseId/chapters/:chapterId/lessons/:lessonId" element={<LessonPage />} />
                <Route path="courses/:courseId/chapters/:chapterId/exercises/:exerciseId" element={<ExercisePage />} />
                <Route path="courses/:courseId/chapters/:chapterID/quizzes/:quizId" element={<QuizPage />} />
              </Route>
            </Route>

            {/* Protected Teacher routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
            </Route>

            {/* Protected Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} >
                <Route index element={<AdminDashboardPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />

                <Route path="courses/add" element={<AddCourse />} />
              </Route>
            </Route>

            {/* Redirect root to appropriate dashboard or login */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </BrowserRouter>
        <Toaster></Toaster>
      </themeContext.Provider>
    </>
  )
}

export default App
