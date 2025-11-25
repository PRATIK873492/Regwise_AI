import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { ComplianceExplorer } from './pages/ComplianceExplorer';
import { OnboardingFlow } from './pages/OnboardingFlow';
import { Alerts } from './pages/Alerts';
import { Dashboard } from './pages/Dashboard';
import { ROUTES } from './utils/constants';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route
                path={ROUTES.HOME}
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.EXPLORER}
                element={
                  <ProtectedRoute>
                    <ComplianceExplorer />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ONBOARDING}
                element={
                  <ProtectedRoute>
                    <OnboardingFlow />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ALERTS}
                element={
                  <ProtectedRoute>
                    <Alerts />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
            <Toaster />
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}
