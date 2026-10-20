import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ResumeDetail } from "./pages/ResumeDetail";
import { UploadResume } from "./pages/UploadResume";
import { LandingPage } from "./pages/LandingPage";
import { RecruiterDashboard } from "./pages/RecruiterDashboard";
import { JobRadar } from "./pages/JobRadar";
import { Applications } from "./pages/Applications";
import { MockInterview } from "./pages/MockInterview";
import { RecruiterCampaigns } from "./pages/RecruiterCampaigns";
import { SystemArchitecture } from "./pages/SystemArchitecture";
import { AuthPage } from "./pages/Auth";
import { OnboardingManager } from "./pages/OnboardingManager";
import { InstitutionDashboard } from "./pages/InstitutionDashboard";
import { Academy } from "./pages/Academy";
import { AiCareerAgent } from "./pages/AiCareerAgent";
import { BillingDashboard } from "./pages/BillingDashboard";
import { CandidateProfile } from "./pages/CandidateProfile";
import { MyProfile } from "./pages/MyProfile";

import { PublicProfile } from "./pages/public/PublicProfile";

function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "candidate" | "recruiter" | "institution";
}) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/" replace />;
  }

  if (
    !profile.onboardingComplete &&
    location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  if (role && profile.role !== role) {
    // If the wrong role, just go to their respective dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function RoleBasedDashboard() {
  const { profile, loading } = useAuth();

  if (loading) return null;

  if (profile?.role === "recruiter") {
    return <RecruiterDashboard />;
  }
  if (profile?.role === "institution") {
    return <InstitutionDashboard />;
  }
  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/p/:id" element={<PublicProfile />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingManager />
              </ProtectedRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<RoleBasedDashboard />} />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              } 
            />

            {/* Candidate specific routes */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute role="candidate">
                  <UploadResume />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume/:id"
              element={
                <ProtectedRoute role="candidate">
                  <ResumeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/radar"
              element={
                <ProtectedRoute role="candidate">
                  <JobRadar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute role="candidate">
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-interview"
              element={
                <ProtectedRoute role="candidate">
                  <MockInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/academy"
              element={
                <ProtectedRoute role="candidate">
                  <Academy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <ProtectedRoute role="candidate">
                  <AiCareerAgent />
                </ProtectedRoute>
              }
            />

            {/* Recruiter specific routes */}
            <Route
              path="/recruiter/candidate/:id"
              element={
                <ProtectedRoute role="recruiter">
                  <CandidateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterCampaigns />
                </ProtectedRoute>
              }
            />

            {/* Shared */}
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <BillingDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/architecture" element={<SystemArchitecture />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
