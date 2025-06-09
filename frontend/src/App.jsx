import { useEffect } from 'react'
import Home from './components/Home'
import useTheme from './hooks/useTheme'
import themeContext from './contexts/theme-context'
import Login from './components/Login'
import StudentDashboard from './pages/StudentDashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoutes'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'
import SignUp from './components/SignUp.jsx'
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
import CourseViewPage from './pages/Admin-pages/CourseViewPage'
import LessonEditPage from './pages/Admin-pages/LessonEditPage'
//teacher pages
import TeacherDashboardPage from '../src/pages/Teacher-page/TeacherDashboardPage'

//parent pages
import ParentDashboard from './pages/Parent-pages/ParentDashboard'
import ParentPage from './pages/ParentPage'
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OTPVerification from './components/OTPVerification';
import CompleteRegistration from './pages/CompleteRegistration';

function App() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <themeContext.Provider value={{theme,setTheme}}>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<OTPVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password/:userId/:token" element={<ResetPassword />} />
            <Route path="/complete-registration" element={<CompleteRegistration />} />
            {/* Protected Student routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student" element={<StudentDashboard />}>
                <Route index element={<DashboardPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="settings" element={<SettingsPage />} /> 
                {/* Nested course routes */}
                <Route path="courses/:subject" element={<CourseContent />} />
                <Route path="courses/:subject/chapters/:chapterId/lessons/:lessonId" element={<LessonPage />} />
                <Route path="courses/:subject/chapters/:chapterId/lessons/:lessonId/exercises/:exerciseId" element={<ExercisePage />} />
                <Route path="courses/:subject/chapters/:chapterID/lessons/:lessonId/quizzes/:quizId" element={<QuizPage />} />
              </Route>
            </Route>

            {/* Protected Teacher routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route path="/teacher" element={<TeacherDashboard />} >
                <Route index element={<TeacherDashboardPage/>} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="settings" element={<SettingsPage />} />

                <Route path="courses/add" element={<AddCourse />} />
                <Route path="courses/:id/view" element={<CourseViewPage />} />
              </Route>
            </Route>

            {/* Protected Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} >
                <Route index element={<AdminDashboardPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />

                {/* Nested admin course routes */}
                <Route path="courses/add" element={<AddCourse />} />
                <Route path="courses/:id/view" element={<CourseViewPage />} />
                <Route path="courses/:id/chapters/:chapterId/lessons/:lessonId/edit" element={<LessonEditPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
              <Route path="/parent" element={<ParentPage />} >
                <Route index element={<ParentDashboard />} />
                <Route path="settings" element={<SettingsPage />} />
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

export default App;
