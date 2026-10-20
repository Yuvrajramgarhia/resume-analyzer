import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, googleProvider } from "../lib/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "candidate" | "recruiter" | "institution";
  onboardingComplete: boolean;
  createdAt: number;
  isVerified?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (asRole?: "candidate" | "recruiter" | "institution") => Promise<void>;
  signInWithEmail: (email: string, pass: string, role: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    pass: string,
    name: string,
    role: string,
    username: string,
  ) => Promise<void>;
  sendOtp: (
    phoneNumber: string,
    appVerifier: any,
    role: string,
  ) => Promise<any>;
  verifyOtp: (confirmationResult: any, otp: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateRole: (
    role: "candidate" | "recruiter" | "institution",
  ) => Promise<void>;
  completeOnboarding: (data: any) => Promise<void>;
  toggleVerificationAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // To keep track of intent when signing in
  const [pendingRole, setPendingRole] = useState<
    "candidate" | "recruiter" | "institution"
  >("candidate");

  useEffect(() => {
    // TEMPORARY AUTH BYPASS
    const mockUser = {
      uid: "mock-user-123",
      email: "mock@example.com",
      displayName: "Mock User",
    } as User;
    
    const mockProfile: UserProfile = {
      uid: "mock-user-123",
      email: "mock@example.com",
      name: "Mock User",
      role: "candidate",
      onboardingComplete: true,
      createdAt: Date.now(),
      isVerified: true,
    };
    
    setUser(mockUser);
    setProfile(mockProfile);
    setLoading(false);
    
    return () => {};
  }, [pendingRole]);

  const signIn = async (asRole?: "candidate" | "recruiter" | "institution") => {
    try {
      if (asRole) {
        setPendingRole(asRole);
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signInWithEmail = async (emailOrUsername: string, pass: string, role: string) => {
    setPendingRole(role as any);
    let loginEmail = emailOrUsername;
    
    // If not an email, assume username and look up email
    if (!emailOrUsername.includes("@")) {
      const usernameDoc = await getDoc(doc(db, "usernames", emailOrUsername));
      if (!usernameDoc.exists()) {
        throw new Error("Username not found");
      }
      loginEmail = usernameDoc.data().email;
    }
    
    await signInWithEmailAndPassword(auth, loginEmail, pass);
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    role: string,
    username: string,
  ) => {
    setPendingRole(role as any);
    
    // Validate uniqueness
    if (username) {
      const usernameDoc = await getDoc(doc(db, "usernames", username));
      if (usernameDoc.exists()) {
        throw new Error("Username is already taken");
      }
    }
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass,
    );

    // Send email verification link
    try {
      await sendEmailVerification(userCredential.user, {
        url: window.location.origin + "/dashboard",
      });
    } catch (e) {
      console.error("Error sending verification email", e);
    }

    if (username) {
      // Map username to email
      await setDoc(doc(db, "usernames", username), {
        email: email
      });
    }

    // Explicitly create profile document immediately after registration, before onAuthStateChanged handles it
    const newProfile: UserProfile = {
      uid: userCredential.user.uid,
      email: email,
      name: name,
      role: role as any,
      username: username || undefined,
      onboardingComplete: false,
      createdAt: Date.now(),
    };
    await setDoc(doc(db, "users", userCredential.user.uid), newProfile);
    setProfile(newProfile);
  };

  const sendOtp = async (
    phoneNumber: string,
    appVerifier: any,
    role: string,
  ) => {
    setPendingRole(role as any);
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier,
      );
      return confirmationResult;
    } catch (e) {
      console.error("Error sending OTP", e);
      throw e;
    }
  };

  const verifyOtp = async (confirmationResult: any, otp: string) => {
    try {
      await confirmationResult.confirm(otp);
    } catch (e) {
      console.error("Error verifying OTP", e);
      throw e;
    }
  };

  const completeOnboarding = async (data: any) => {
    if (!user || !profile) return;
    try {
      const updatedProfile = {
        ...profile,
        ...data,
        onboardingComplete: true,
      } as UserProfile;
      await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    }
  };

  const logOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateRole = async (
    role: "candidate" | "recruiter" | "institution",
  ) => {
    if (!user || !profile) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { ...profile, role },
        { merge: true },
      );
      setProfile({ ...profile, role });
    } catch (e) {
      console.error("Error updating role: ", e);
    }
  };

  const toggleVerificationAdmin = async () => {
    if (!user || !profile) return;
    try {
      const newStatus = !profile.isVerified;
      await setDoc(
        doc(db, "users", user.uid),
        { isVerified: newStatus },
        { merge: true },
      );
      setProfile({ ...profile, isVerified: newStatus });
    } catch (e) {
      console.error("Error toggling verification: ", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signInWithEmail,
        registerWithEmail,
        sendOtp,
        verifyOtp,
        logOut,
        updateRole,
        completeOnboarding,
        toggleVerificationAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
