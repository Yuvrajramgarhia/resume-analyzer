import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  BrainCircuit,
  Video,
  Mic,
  Code,
  Play,
  CheckCircle2,
  ChevronRight,
  Settings,
  Loader2,
  Eye,
  AlertTriangle,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEyeTracking } from "../hooks/useEyeTracking";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PremiumModal } from "../components/PremiumModal";
import { useAuth } from "../contexts/AuthContext";

const INTERVIEW_TYPES = [
  {
    id: "hr",
    title: "HR & Behavioral",
    icon: Mic,
    desc: "Culture fit, core values, and behavioral questions.",
  },
  {
    id: "tech",
    title: "Technical Screen",
    icon: BrainCircuit,
    desc: "System design, architecture, and domain knowledge.",
  },
  {
    id: "code",
    title: "Live Coding",
    icon: Code,
    desc: "Algorithms, data structures, and live pair programming.",
  },
  {
    id: "case",
    title: "Case Study",
    icon: Video,
    desc: "Product sense, business strategy, and problem solving.",
  },
];

const ROLES = [
  "Software Engineer",
  "Data Analyst",
  "Product Manager",
  "HR / Recruiter",
  "Marketing",
  "Finance",
  "Custom Role",
];

export function MockInterview() {
  const { profile } = useAuth();
  const [step, setStep] = useState<"setup" | "session" | "report">("setup");
  const [selectedType, setSelectedType] = useState("tech");
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [isInitializing, setIsInitializing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isPremium = profile?.tier === "pro" || profile?.tier === "elite";
  // Mock usage count (in a real app this would come from the backend)
  const [usageCount, setUsageCount] = useState(3);

  const eyeStats = useEyeTracking(step === "session");

  const handleStartAttempt = () => {
    if (!isPremium && usageCount >= 3) {
      setShowPremiumModal(true);
      return;
    }
    setUsageCount(prev => prev + 1);
    startSession();
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (step === "session") {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [step]);

  const startSession = () => {
    setIsInitializing(true);
    setTimeout(() => {
      setIsInitializing(false);
      setStep("session");
    }, 2000); // Simulate AI loading
  };

  const endSession = () => {
    setStep("report");
  };

  return (
    <div className="flex flex-col gap-4 h-full max-w-6xl mx-auto w-full relative">
      <header className="h-16 shrink-0 glass rounded-2xl px-6 flex items-center justify-between shadow-xl z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" /> AI Interview
            Engine
          </h1>
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            Real-time simulation & scoring
          </span>
        </div>
        {step === "session" && (
          <Button variant="destructive" size="sm" onClick={endSession}>
            End Simulation
          </Button>
        )}
      </header>

      <div className="flex-1 rounded-2xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 p-4"
            >
              <div className="glass h-full rounded-2xl p-8 flex flex-col gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <h2 className="text-3xl font-black mb-2">
                    Configure Simulation
                  </h2>
                  <p className="text-muted-foreground">
                    Select your target role and interview format.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">
                    Target Role
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedRole === role
                            ? "bg-primary text-primary-foreground shadow-lg scale-105"
                            : "bg-background hover:bg-muted border border-border"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">
                    Interview Format
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {INTERVIEW_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Card
                          key={type.id}
                          className={`cursor-pointer transition-all hover:border-primary/50 ${selectedType === type.id ? "border-primary ring-1 ring-primary/30 bg-primary/5" : "bg-background/50"}`}
                          onClick={() => setSelectedType(type.id)}
                        >
                          <CardContent className="p-4 flex items-start gap-4">
                            <div
                              className={`p-2 rounded-lg ${selectedType === type.id ? "bg-primary/20 text-primary" : "bg-secondary"}`}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-bold">{type.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {type.desc}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto flex flex-col items-center pt-8 border-t border-border/50">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg rounded-full font-bold shadow-md hover:shadow-md transition-all relative overflow-hidden group"
                    onClick={handleStartAttempt}
                    disabled={isInitializing}
                  >
                    {!isPremium && usageCount >= 3 && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"></div>
                    )}
                    {isInitializing ? (
                      <Loader2 className="h-5 w-5 mr-3 animate-spin z-10 relative" />
                    ) : (
                      <Play className="h-5 w-5 mr-3 z-10 relative" />
                    )}
                    <span className="z-10 relative">
                      {!isPremium && usageCount >= 3
                        ? "Upgrade to Unlock Sessions"
                        : isInitializing
                        ? "Booting AI Engine..."
                        : "Initialize Secure Sandbox"}
                    </span>
                  </Button>
                  
                  {!isPremium && (
                    <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
                      <span className={usageCount >= 3 ? "text-destructive font-bold" : "text-amber-500 font-bold"}>
                        {Math.max(0, 3 - usageCount)} free sessions remaining this month
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === "session" && (
            <motion.div
              key="session"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col md:flex-row gap-4 p-4"
            >
              {/* Main Stage (Camera/Code) */}
              <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden border border-border/50 relative">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="bg-red-500/20 text-red-500 font-bold text-xs px-3 py-1.5 rounded-full border border-red-500/30 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    REC
                  </span>
                  <span className="bg-background/80 backdrop-blur text-foreground font-bold text-xs px-3 py-1.5 rounded-full border border-border">
                    {selectedRole} - {selectedType.toUpperCase()}
                  </span>
                </div>

                {/* Candidate Feed Placeholder */}
                <div className="flex-1 bg-black/80 w-full flex items-center justify-center relative overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0 pointer-events-none"></div>
                  
                  {/* Eye Tracking HUD */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 text-right">
                    <div className="bg-background/80 backdrop-blur px-3 py-2 rounded-xl border border-border flex flex-col items-end shadow-lg">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5">
                        <Eye className="h-3 w-3" /> Eye Contact
                      </span>
                      <span className={`text-xl font-black ${eyeStats.currentFocus > 80 ? 'text-emerald-500' : eyeStats.currentFocus > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {eyeStats.currentFocus}%
                      </span>
                    </div>
                  </div>

                  {/* Live Alerts Overlay */}
                  <AnimatePresence>
                    {eyeStats.alerts.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-24 left-0 right-0 flex justify-center z-20 pointer-events-none"
                      >
                         <div className="flex flex-col gap-2 items-center">
                            {eyeStats.alerts.map((alert, i) => (
                              <div key={i} className="bg-amber-500/20 text-amber-500 border border-amber-500/30 backdrop-blur-md px-4 py-2 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 animate-pulse">
                                <AlertTriangle className="h-4 w-4" />
                                {alert}
                              </div>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 z-10">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-background/20 backdrop-blur hover:bg-background/40 border-0 text-foreground"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-background/20 backdrop-blur hover:bg-background/40 border-0 text-foreground"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-background/20 backdrop-blur hover:bg-background/40 border-0 text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar (AI Agent) */}
              <div className="w-full md:w-[350px] flex flex-col gap-4">
                <div className="h-[250px] glass rounded-2xl overflow-hidden border border-border/50 relative flex flex-col">
                  <div className="flex-1 bg-gradient-to-br from-primary/20 via-background to-secondary flex items-center justify-center relative overflow-hidden">
                    <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
                    {/* Audio Visualizer rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="w-32 h-32 rounded-full border-2 border-primary/20 animate-ping"
                        style={{ animationDuration: "3s" }}
                      ></div>
                      <div
                        className="w-48 h-48 rounded-full border 2 border-primary/10 animate-ping"
                        style={{
                          animationDuration: "2s",
                          animationDelay: "0.5s",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-background/80 backdrop-blur p-3 border-t border-border/50 text-center">
                    <p className="font-bold text-sm">AI Interviewer System</p>
                    <p className="text-xs text-muted-foreground">
                      Listening and adapting...
                    </p>
                  </div>
                </div>

                <div className="flex-1 glass rounded-2xl border border-border/50 p-4 flex flex-col">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
                    Live Analytics
                  </h3>
                  <div className="space-y-4 flex-1">
                    <MetricBar label="Speech Clarity" val={92} />
                    <MetricBar label="Confidence" val={85} />
                    <MetricBar label="Pacing" val={78} />
                    <MetricBar label="Eye Contact" val={eyeStats.score} />
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary font-medium">
                    "Could you elaborate on the architecture of your last
                    project?"
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "report" && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 p-4 flex gap-4 overflow-y-auto"
            >
              <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-20">
                <div className="text-center mb-4">
                  <h2 className="text-3xl font-black mb-2">
                    Performance Scorecard
                  </h2>
                  <p className="text-muted-foreground">
                    Detailed breakdown of your mock simulation.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <ScoreBox
                    label="Overall Readiness"
                    score={84}
                    color="text-emerald-500"
                  />
                  <ScoreBox
                    label="Technical Fit"
                    score={76}
                    color="text-blue-500"
                  />
                  <ScoreBox
                    label="Communication"
                    score={92}
                    color="text-purple-500"
                  />
                  <ScoreBox
                    label="Body Language"
                    score={88}
                    color="text-amber-500"
                  />
                  <ScoreBox
                    label="Eye Contact"
                    score={eyeStats.score}
                    color={eyeStats.score >= 80 ? "text-emerald-500" : "text-amber-500"}
                  />
                </div>

                <Card className="glass h-full border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-primary flex items-center gap-2">
                        <Eye className="h-5 w-5" /> Eye Contact & Gaze Consistency
                      </h3>
                      {eyeStats.score < 80 && (
                        <Button variant="outline" size="sm" className="h-8">Assign 5-min Practice</Button>
                      )}
                    </div>
                    
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={eyeStats.timeline.length > 0 ? eyeStats.timeline : [{time: 0, focus: 100}, {time: 60, focus: 100}]}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="time" stroke="currentColor" opacity={0.5} tick={{ fontSize: 12 }} />
                          <YAxis domain={[0, 100]} stroke="currentColor" opacity={0.5} tick={{ fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px" }} />
                          <Line type="monotone" dataKey="focus" stroke="#10b981" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-xl mt-4 border border-border">
                      <p className="text-sm font-medium">
                        {eyeStats.score >= 80 
                          ? "Strong eye contact. You maintained a steady gaze which conveyed confidence." 
                          : "Slight distraction detected. You frequently looked away, which might read as nervousness or lack of focus."}
                      </p>
                      {eyeStats.score < 80 && (
                        <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                          <strong>AI Recommendation:</strong> Try our Camera Speaking Drills and Mirror Speaking Challenge to improve focus duration.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <Card className="glass h-full">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-emerald-500 flex items-center gap-2 mb-4">
                        <CheckCircle2 className="h-5 w-5" /> Key Strengths
                      </h3>
                      <ul className="space-y-3">
                        <li className="text-sm bg-background/50 p-3 rounded-lg border border-border">
                          Clear articulation of complex system design
                          trade-offs.
                        </li>
                        <li className="text-sm bg-background/50 p-3 rounded-lg border border-border">
                          Excellent maintained eye contact ensuring engagement.
                        </li>
                        <li className="text-sm bg-background/50 p-3 rounded-lg border border-border">
                          Demonstrated strong leadership signals in behavioral
                          questions.
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="glass h-full">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-destructive flex items-center gap-2 mb-4">
                        <BrainCircuit className="h-5 w-5" /> Growth Areas
                      </h3>
                      <ul className="space-y-3">
                        <li className="text-sm bg-background/50 p-3 rounded-lg border border-border">
                          High usage of filler words ("like", "umm") during
                          technical deep-dive.
                        </li>
                        <li className="text-sm bg-background/50 p-3 rounded-lg border border-border">
                          Hesitation detected when explaining Big-O
                          complexities.
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass border-primary/30">
                  <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 rounded-xl">
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        Skill Gap Identified
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We noticed you struggled with advanced distributed
                        caching concepts.
                      </p>
                    </div>
                    <Button className="shrink-0 font-bold">
                      <Code className="h-4 w-4 mr-2" /> Generate Custom Roadmap
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={() => setStep("setup")}>
                    Start New Simulation
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}

function MetricBar({ label, val }: { label: string; val: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-medium">
        <span>{label}</span>
        <span className="text-muted-foreground">{val}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000"
          style={{ width: `${val}%` }}
        ></div>
      </div>
    </div>
  );
}

function ScoreBox({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-border/50 shadow-sm">
      <div className={`text-3xl font-black mb-1 ${color}`}>{score}</div>
      <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function UserSilhouette() {
  return (
    <svg
      className="w-64 h-64 text-foreground/10 relative z-0"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}
