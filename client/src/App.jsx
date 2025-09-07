import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CourseList from './components/Courses/CourseList';
import CourseDetail from './components/Courses/CourseDetail';
import CreateCourse from './components/Courses/CreateCourse';
import EditCourse from './components/Courses/EditCourse';
import AssignmentList from './components/Assignments/AssignmentList';
import CreateAssignment from './components/Assignments/CreateAssignment';
import AssignmentSubmissions from './components/Assignments/AssignmentSubmissions';
import DiscussionList from './components/Discussions/DiscussionList';
import QuizList from './components/Quizzes/QuizList';
import CreateQuiz from './components/Quizzes/CreateQuiz';
import TakeQuiz from './components/Quizzes/TakeQuiz';
import QuizResults from './components/Quizzes/QuizResults';
import NotificationCenter from './components/Notifications/NotificationCenter';
import StudentList from './components/Students/StudentList';
import Analytics from './components/Analytics/Analytics.jsx';
import GradesList from './components/Grades/GradesList';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Unauthorized from './components/Auth/Unauthorized'; // new import
import AIIntegration from './components/AI/AIIntegration';
import AIQuizGenerator from './components/AI/AIQuizGenerator';
import AITutor from './components/AI/AITutor';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes (Role: any authenticated user) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CourseList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />

            {/* Instructor-only Routes */}
            <Route
              path="/courses/:id/edit"
              element={
                <ProtectedRoute>
                  <EditCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-course"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments/create"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <CreateAssignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/create"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />

            {/* Other Protected Routes */}
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <AssignmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments/:id/submissions"
              element={
                <ProtectedRoute>
                  <AssignmentSubmissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discussions"
              element={
                <ProtectedRoute>
                  <DiscussionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes"
              element={
                <ProtectedRoute>
                  <QuizList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/:id/take"
              element={
                <ProtectedRoute>
                  <TakeQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/:id/results"
              element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <StudentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grades"
              element={
                <ProtectedRoute>
                  <GradesList />
                </ProtectedRoute>
              }
            />

            {/* AI Features */}
            <Route
              path="/ai"
              element={
                <ProtectedRoute>
                  <AIIntegration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai/quiz-generator"
              element={
                <ProtectedRoute>
                  <AIQuizGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai/tutor"
              element={
                <ProtectedRoute>
                  <AITutor />
                </ProtectedRoute>
              }
            />

            {/* Redirects */}
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
