import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { CandidateOnboarding } from "./onboarding/CandidateOnboarding";
import { RecruiterOnboarding } from "./onboarding/RecruiterOnboarding";
import { InstitutionOnboarding } from "./onboarding/InstitutionOnboarding";

export function OnboardingManager() {
  const { profile, user } = useAuth();

  if (!user || !profile) return <Navigate to="/auth" replace />;
  if (profile.onboardingComplete) return <Navigate to="/dashboard" replace />;

  switch (profile.role) {
    case "candidate":
      return <CandidateOnboarding />;
    case "recruiter":
      return <RecruiterOnboarding />;
    case "institution":
      return <InstitutionOnboarding />;
    default:
      return <Navigate to="/auth" replace />;
  }
}
