import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import Profile from './pages/Profile';
import AdminAssignments from './pages/AdminAssignments';
import StudentDashboard from './pages/StudentDashboard';
import StudentQuizzes from './pages/StudentQuizzes';
import CourseQuiz from './pages/CourseQuiz';
import Assignments from './pages/Assignments';
import Prerequisites from './pages/Prerequisites';
import AdminDashboard from './pages/AdminDashboard';
import AdminQuizzes from './pages/AdminQuizzes';
import EducatorDocuments from './pages/EducatorDocuments';
import StudentDocuments from './pages/StudentDocuments';
import CreateMeeting from './pages/CreateMeeting';
import LiveClasses from './pages/LiveClasses';
import AdminMeetings from './pages/AdminMeetings';
import JitsiMeeting from './pages/JitsiMeeting';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path="/auth/callback" 
            element={<AuthCallback />} 
          />
          <Route 
            path="/notes" 
            element={user ? <Notes /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notes/:id" 
            element={user ? <NoteDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create-note" 
            element={user?.role === 'admin' ? <CreateNote /> : <Navigate to="/" />} 
          />
          <Route 
            path="/notes/:id/edit" 
            element={user ? <EditNote /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/dashboard" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/quizzes" 
            element={user?.role === 'admin' ? <AdminQuizzes /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/assignments" 
            element={user?.role === 'admin' ? <AdminAssignments /> : <Navigate to="/" />} 
          />
          <Route 
            path="/student/dashboard" 
            element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/student/quizzes" 
            element={(user?.role === 'student' || user?.role === 'admin' || user?.role === 'educator') ? <StudentQuizzes /> : <Navigate to="/" />} 
          />
          <Route 
            path="/quizzes/:courseId/take" 
            element={user?.role === 'student' ? <CourseQuiz /> : <Navigate to="/" />} 
          />
          <Route 
            path="/assignments" 
            element={user ? <Assignments /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/prerequisites" 
            element={<Prerequisites />} 
          />
          <Route 
            path="/admin/documents" 
            element={user?.role === 'admin' ? <EducatorDocuments /> : <Navigate to="/" />} 
          />
          <Route 
            path="/educator/documents" 
            element={user?.role === 'educator' ? <EducatorDocuments /> : <Navigate to="/" />} 
          />
          <Route 
            path="/student/documents" 
            element={user?.role === 'student' ? <StudentDocuments /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/meetings/create" 
            element={user?.role === 'admin' ? <CreateMeeting /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/meetings" 
            element={user?.role === 'admin' ? <AdminMeetings /> : <Navigate to="/" />} 
          />
          <Route 
            path="/student/live-classes" 
            element={user ? <LiveClasses /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/meeting/:roomId" 
            element={user ? <JitsiMeeting /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
