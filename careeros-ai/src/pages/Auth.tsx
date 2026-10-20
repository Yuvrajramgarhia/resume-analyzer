import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  BrainCircuit,
  Users,
  Building,
  Mail,
  Lock,
  User,
  ChevronRight,
  Check,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../lib/firebase";

export function AuthPage() {
  const {
    signIn,
    signInWithEmail,
    registerWithEmail,
    sendOtp,
    verifyOtp,
    user,
    profile,
  } = useAuth();

  // Tab state
  const [activeRole, setActiveRole] = useState<
    "candidate" | "recruiter" | "institution"
  >("candidate");

  // View state: 'options' | 'login' | 'register' | 'otp'
  const [view, setView] = useState<"options" | "login" | "register" | "otp">(
    "options",
  );

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user && profile) {
    return (
      <Navigate
        to={profile.onboardingComplete ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn(activeRole);
    } catch (e: any) {
      setError(e.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter an email or username");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password, activeRole);
    } catch (e: any) {
      setError(e.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (username && (username.length < 3 || username.includes(" ") || username.includes("@"))) {
      setError("Username must be at least 3 characters and cannot contain spaces or @");
      return;
    }

    setLoading(true);
    try {
      if (password !== confirmPassword)
        throw new Error("Passwords do not match");
      if (password.length < 6)
        throw new Error("Password must be at least 6 characters");
      if (!name) throw new Error("Please enter your name");
      await registerWithEmail(email, password, name, activeRole, username);
    } catch (e: any) {
      setError(e.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const setUpRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved
          },
        },
      );
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(phoneNumber) && !emailRegex.test(phoneNumber)) {
      setError(
        "Please enter a valid phone number (e.g. +919876543210) or email address",
      );
      return;
    }

    setLoading(true);
    try {
      setUpRecaptcha();
      const result = await sendOtp(
        phoneNumber,
        (window as any).recaptchaVerifier,
        activeRole,
      );
      setConfirmationResult(result);
    } catch (e: any) {
      if (e.message?.includes("auth/operation-not-allowed")) {
        setError(
          "Phone authentication is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method.",
        );
      } else {
        setError(e.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setError("");
    setLoading(true);
    try {
      await verifyOtp(confirmationResult, otpCode);
    } catch (e: any) {
      setError(e.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 5) score += 25;
    if (pass.length > 9) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(password);

  const RoleIcon = {
    candidate: BrainCircuit,
    recruiter: Users,
    institution: Building,
  }[activeRole];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden bg-mesh animate-mesh">
      <div id="recaptcha-container"></div>
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent -z-10" />

      <div className="w-full max-w-lg z-10 animate-float relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[1rem] bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase mb-4 border border-primary/20 shadow-md">
            <RoleIcon className="h-4 w-4" />
            <span>CareerOS AI</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Select your portal to continue
          </p>
        </div>

        <div className="relative z-10 w-full rounded-[2rem]">
          <Card className="glass-card border-border/50 shadow-md relative overflow-hidden rounded-[2rem]">
              <div className="flex border-b border-border/50 relative">
                <div
                  className="flex-1 text-center py-5 font-bold text-sm cursor-pointer transition-colors relative hover:bg-muted/50"
                  onClick={() => {
                    setActiveRole("candidate");
                    setView("options");
                    setError("");
                  }}
                  style={{
                    color:
                      activeRole === "candidate"
                        ? "var(--color-primary)"
                        : "var(--color-muted-foreground)",
                  }}
                >
                  Candidate
                </div>
                <div
                  className="flex-1 text-center py-5 font-bold text-sm cursor-pointer transition-colors relative hover:bg-muted/50"
                  onClick={() => {
                    setActiveRole("recruiter");
                    setView("options");
                    setError("");
                  }}
                  style={{
                    color:
                      activeRole === "recruiter"
                        ? "var(--color-secondary)"
                        : "var(--color-muted-foreground)",
                  }}
                >
                  Recruiter
                </div>
                <div
                  className="flex-1 text-center py-5 font-bold text-sm cursor-pointer transition-colors relative hover:bg-muted/50"
                  onClick={() => {
                    setActiveRole("institution");
                    setView("options");
                    setError("");
                  }}
                  style={{
                    color:
                      activeRole === "institution"
                        ? "var(--color-accent)"
                        : "var(--color-muted-foreground)",
                  }}
                >
                  Institution
                </div>

                {/* Active Tab Indicator */}
                <div
                  className="absolute bottom-0 h-1 transition-all duration-300 rounded-t-full shadow-md"
                  style={{
                    width: "33.33%",
                    left:
                      activeRole === "candidate"
                        ? "0%"
                        : activeRole === "recruiter"
                          ? "33.33%"
                          : "66.66%",
                    backgroundColor:
                      activeRole === "candidate"
                        ? "var(--color-primary)"
                        : activeRole === "recruiter"
                          ? "var(--color-secondary)"
                          : "var(--color-accent)",
                    color:
                      activeRole === "candidate"
                        ? "var(--color-primary)"
                        : activeRole === "recruiter"
                          ? "var(--color-secondary)"
                          : "var(--color-accent)",
                  }}
                />
              </div>

              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold shadow-md"
                    >
                      {error}
                    </motion.div>
                  )}

                  {view === "options" && (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex flex-col gap-4"
                    >
                      <Button
                        variant="outline"
                        className="h-14 rounded-xl border-border/50 hover:border-border hover:bg-muted/50 font-medium transition-all"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                      >
                        <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Continue with Google
                      </Button>
                      <Button
                        variant="outline"
                        className="h-14 rounded-xl border-border/50 hover:border-border hover:bg-muted/50 font-medium transition-all"
                        disabled={loading}
                      >
                        <svg
                          className="h-5 w-5 mr-3"
                          viewBox="0 0 24 24"
                          fill="#0A66C2"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        Continue with LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        className="h-14 rounded-xl border-border/50 hover:border-border hover:bg-muted/50 font-medium transition-all"
                        onClick={() => {
                          setView("otp");
                          setConfirmationResult(null);
                        }}
                        disabled={loading}
                      >
                        Login with OTP
                      </Button>
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border/50"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                          <span className="bg-background px-4 text-muted-foreground">
                            Or continue
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-14 rounded-xl font-bold bg-muted/50 hover:bg-muted text-foreground border border-border/50 transition-all"
                        onClick={() => setView("login")}
                        disabled={loading}
                      >
                        Login with Email
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-sm font-medium mt-4 hover:text-primary transition-colors"
                        onClick={() => setView("register")}
                        disabled={loading}
                      >
                        Don't have an account? Register
                      </Button>
                    </motion.div>
                  )}

                  {view === "login" && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <form onSubmit={handleEmailLogin} className="space-y-5">
                        <div className="relative group">
                          <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <input
                            type="text"
                            required
                            placeholder="Email or Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex h-14 w-full rounded-xl border border-border/50 bg-muted/50 pl-12 pr-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all placeholder:text-muted-foreground"
                          />
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex h-14 w-full rounded-xl border border-border/50 bg-muted/50 pl-12 pr-12 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all placeholder:text-muted-foreground"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                          >
                            {showPassword ? "HIDE" : "SHOW"}
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-2 pb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="remember"
                              className="h-4 w-4 rounded bg-muted/50 border-border/50 text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor="remember"
                              className="text-sm text-muted-foreground font-medium"
                            >
                              Remember me
                            </label>
                          </div>
                          <span className="text-sm font-bold text-primary cursor-pointer hover:underline">
                            Forgot password?
                          </span>
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-14 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-md transition-all animate-glow"
                          disabled={loading}
                        >
                          {loading ? "Authenticating..." : "Sign In"}{" "}
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full text-sm font-medium mt-4 hover:text-primary transition-colors"
                          onClick={() => setView("options")}
                          disabled={loading}
                        >
                          Back to Options
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {view === "register" && (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <form
                        onSubmit={handleEmailRegister}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative group">
                            <User className="absolute left-4 top-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                              type="text"
                              required
                              placeholder="Full Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="flex h-12 w-full rounded-xl border border-border/50 bg-muted/50 pl-11 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all"
                            />
                          </div>
                          <div className="relative group">
                            <User className="absolute left-4 top-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                              type="text"
                              placeholder="Username (optional)"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="flex h-12 w-full rounded-xl border border-border/50 bg-muted/50 pl-11 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative group">
                            <Mail className="absolute left-4 top-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                              type="email"
                              required
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="flex h-12 w-full rounded-xl border border-border/50 bg-muted/50 pl-11 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all"
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                              <span className="text-muted-foreground text-sm font-bold">
                                +91
                              </span>
                            </div>
                            <input
                              type="tel"
                              placeholder="Mobile"
                              className="flex h-12 w-full rounded-xl border border-border/50 bg-muted/50 pl-12 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all"
                            />
                          </div>
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Password (6+ chars)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex h-14 w-full rounded-xl border border-border/50 bg-muted/50 pl-12 pr-12 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                          >
                            {showPassword ? "HIDE" : "SHOW"}
                          </button>
                        </div>
                        {password && (
                          <div className="flex gap-2 h-2 w-full mt-2">
                            <div
                              className={`h-full flex-1 rounded-full transition-colors ${strength > 0 ? (strength <= 25 ? "bg-destructive" : strength <= 50 ? "bg-yellow-500" : strength <= 75 ? "bg-primary" : "bg-primary") : "bg-muted"}`}
                            />
                            <div
                              className={`h-full flex-1 rounded-full transition-colors ${strength > 25 ? (strength <= 50 ? "bg-yellow-500" : strength <= 75 ? "bg-primary" : "bg-primary") : "bg-muted"}`}
                            />
                            <div
                              className={`h-full flex-1 rounded-full transition-colors ${strength > 50 ? (strength <= 75 ? "bg-primary" : "bg-primary") : "bg-muted"}`}
                            />
                            <div
                              className={`h-full flex-1 rounded-full transition-colors ${strength > 75 ? "bg-primary shadow-md" : "bg-muted"}`}
                            />
                          </div>
                        )}
                        <div className="relative group">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="flex h-14 w-full rounded-xl border border-border/50 bg-muted/50 pl-12 pr-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all"
                          />
                        </div>
                        <div className="flex items-start gap-3 pt-2 pb-2">
                          <input
                            type="checkbox"
                            required
                            id="terms"
                            className="mt-1 rounded bg-muted/50 border-border/50 text-primary focus:ring-primary"
                          />
                          <label
                            htmlFor="terms"
                            className="text-xs text-muted-foreground leading-relaxed"
                          >
                            I accept the Terms of Service, Privacy Policy, and
                            AI Data Usage Agreement.
                          </label>
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-14 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-md transition-all animate-glow"
                          disabled={loading}
                        >
                          {loading
                            ? "Creating Identity..."
                            : "Create AI Profile"}{" "}
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full text-sm font-medium mt-4 hover:text-primary transition-colors"
                          onClick={() => setView("options")}
                          disabled={loading}
                        >
                          Back to Options
                        </Button>
                      </form>
                    </motion.div>
                  )}
                  {view === "otp" && (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {!confirmationResult ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                          <div className="relative group">
                            <Phone className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                              type="text"
                              required
                              placeholder="Phone Number or Email"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="flex h-14 w-full rounded-xl border border-border/50 bg-muted/50 pl-12 pr-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full h-14 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-md transition-all animate-glow"
                            disabled={loading}
                          >
                            {loading ? "Transmitting..." : "Send Secure Code"}{" "}
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-sm font-medium mt-4 hover:text-primary transition-colors"
                            onClick={() => setView("options")}
                            disabled={loading}
                          >
                            Back to Options
                          </Button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                          <div className="relative group">
                            <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                              type="text"
                              required
                              placeholder="Enter 6-digit Code"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              className="flex h-14 w-full rounded-xl border border-border/50 bg-muted/50 pl-12 pr-4 py-3 text-2xl font-mono tracking-[0.5em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-foreground transition-all text-center"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full h-14 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-md transition-all animate-glow"
                            disabled={loading}
                          >
                            {loading ? "Verifying..." : "Verify & Enter"}{" "}
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-sm font-medium mt-4 hover:text-primary transition-colors"
                            onClick={() => setConfirmationResult(null)}
                            disabled={loading}
                          >
                            Use a different method
                          </Button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
        </div>

        <div className="text-center mt-10 text-xs font-medium text-muted-foreground/80 w-full">
          By continuing, you agree to CareerOS AI's Terms & Conditions. Secured
          by enterprise-grade cryptographic validation.
        </div>
      </div>
    </div>
  );
}
