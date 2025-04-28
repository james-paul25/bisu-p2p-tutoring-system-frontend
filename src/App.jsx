import React from 'react'
import './App.css'
import UserLogin from './components/login-register/UserLogin.jsx'
import UserRegister from './components/login-register/UserRegister.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import StudentDashboard from './components/students/StudentDashboard.jsx'
import TutorDashboard from './components/tutor/TutorDashboard.jsx'
import StudentLayout from './components/students/StudentLayout.jsx';
import StudentsApplyTutor from './components/students/StudentsApplyTutor.jsx'
import StudentProfile from './components/students/StudentProfile.jsx';
import StudentTutor from './components/students/StudentTutor.jsx'
import StudentSession from './components/students/StudentSession.jsx';
import StudentMessages from './components/students/StudentMessages.jsx';
import StudentSessionList from './components/students/StudentSessionList.jsx';
import TutorLayout from './components/tutor/TutorLayout.jsx';
import Leaderboard from './components/tutor/Leaderboard.jsx';
import StudentList from './components/tutor/StudentList.jsx';
import TutorProfile from './components/tutor/TutorProfile.jsx';
import TutorSession from './components/tutor/TutorSession.jsx';
import Home from './components/login-register/Home.jsx';
import AdminLogin from './components/login-register/AdminLogin.jsx';
import AdminRegister from './components/login-register/AdminRegister.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import AdminSession from './components/admin/AdminSession.jsx';
import AdminTutorRequest from './components/admin/AdminTutorRequest.jsx';
import AdminUsers from './components/admin/AdminUsers.jsx';
import AdminSubject from './components/admin/AdminSubject.jsx';
import TutorMessages from './components/tutor/TutorMessages.jsx';
import TutorSessionsList from './components/tutor/TutorSessionList.jsx';


function App() {
  
  return (
    <Router>

      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>

          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          
          

          
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="student-dashboard" replace />} />
            <Route path="student-dashboard" element={<StudentDashboard />} />
            <Route path="apply-tutor" element={<StudentsApplyTutor />} />
            <Route path="student-profile" element={<StudentProfile />} />
            <Route path="student-tutor" element={<StudentTutor />} />
            <Route path="student-session" element={<StudentSession />} />
            <Route path="student-messages" element={<StudentSessionList/>}></Route>
            <Route path="student-messages/:sessionId" element={<StudentMessages />} />
          </Route>


          <Route path="/tutor" element={<TutorLayout />}>
            <Route index element={<Navigate to="tutor-dashboard" replace />} />
            <Route path="tutor-dashboard" element={<TutorDashboard />} />
            <Route path="tutor-leaderboard" element={<Leaderboard />} />
            <Route path="tutor-student-list" element={<StudentList />} />
            <Route path="tutor-profile" element={<TutorProfile />} />
            <Route path="tutor-session" element={<TutorSession />} />
            <Route path="tutor-messages" element={<TutorSessionsList />} />
            <Route path="tutor-messages/:sessionId" element={<TutorMessages />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="admin-dashboard" replace />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="admin-session" element={<AdminSession />} />
            <Route path="admin-tutor-request" element={<AdminTutorRequest />} />
            <Route path="admin-users" element={<AdminUsers />} />
            <Route path="admin-subject" element={<AdminSubject />} />
          </Route>


          <Route path="*" element={<Navigate to="/home" />} />
          
        </Routes>

    </Router>
  )
}

export default App