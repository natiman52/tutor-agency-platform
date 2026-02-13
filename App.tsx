
import React, { useState, createContext, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import TutorDashboardPage from './pages/tutor/TutorDashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TutorProfilePage from './pages/parent/TutorProfilePage';
import RequestConfirmationPage from './pages/parent/RequestConfirmationPage';
import TutorRegistrationPage from './pages/tutor/TutorRegistrationPage';
import ParentProfilePage from './pages/parent/ParentProfilePage';
import RequestStatusPage from './pages/parent/RequestStatusPage';
import EditTutorProfilePage from './pages/tutor/EditProfilePage';
import PaymentSettingsPage from './pages/tutor/PaymentSettingsPage';
import MySessionsPage from './pages/tutor/MySessionsPage';
import SessionPage from './pages/session/SessionPage';
import { User, Role } from './types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const authContextValue = useMemo(() => ({
    user,
    login: (loggedInUser: User) => setUser(loggedInUser),
    logout: () => setUser(null),
  }), [user]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans text-neutral-800">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Parent Routes */}
            <Route path="/parent/dashboard" element={user?.role === Role.Parent ? <ParentDashboardPage /> : <Navigate to="/login" />} />
            <Route path="/parent/profile" element={user?.role === Role.Parent ? <ParentProfilePage /> : <Navigate to="/login" />} />
            <Route path="/parent/request-status" element={user?.role === Role.Parent ? <RequestStatusPage /> : <Navigate to="/login" />} />
            <Route path="/tutor/:id" element={user?.role === Role.Parent ? <TutorProfilePage /> : <Navigate to="/login" />} />
            <Route path="/request-confirmation/:tutorId" element={user?.role === Role.Parent ? <RequestConfirmationPage /> : <Navigate to="/login" />} />

            {/* Tutor Routes */}
            <Route path="/tutor/dashboard" element={user?.role === Role.Tutor ? <TutorDashboardPage /> : <Navigate to="/login" />} />
            <Route path="/tutor/register" element={<TutorRegistrationPage />} />
            <Route path="/tutor/profile/edit" element={user?.role === Role.Tutor ? <EditTutorProfilePage /> : <Navigate to="/login" />} />
            <Route path="/tutor/payment-settings" element={user?.role === Role.Tutor ? <PaymentSettingsPage /> : <Navigate to="/login" />} />
            <Route path="/tutor/sessions" element={user?.role === Role.Tutor ? <MySessionsPage /> : <Navigate to="/login" />} />


            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={user?.role === Role.Admin ? <AdminDashboardPage /> : <Navigate to="/login" />} />

            {/* Shared Routes */}
            <Route path="/session/:sessionId" element={user ? <SessionPage /> : <Navigate to="/login" />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
