import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CandidateMyProfile } from "./profile/CandidateMyProfile";
import { RecruiterMyProfile } from "./profile/RecruiterMyProfile";
import { InstitutionMyProfile } from "./profile/InstitutionMyProfile";
import { Layout } from "../components/Layout";

export function MyProfile() {
  const { profile } = useAuth();
  
  if (!profile) return <div className="flex h-screen items-center justify-center animate-pulse"><div className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <>
      {profile.role === "candidate" && <CandidateMyProfile />}
      {profile.role === "recruiter" && <RecruiterMyProfile />}
      {profile.role === "institution" && <InstitutionMyProfile />}
    </>
  );
}
