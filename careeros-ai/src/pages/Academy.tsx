import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Map as MapIcon,
  MessageSquare,
  Code,
  Trophy,
  LayoutDashboard,
  PlayCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  TrendingUp,
  BrainCircuit,
  TerminalSquare
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";

type Tab = "dashboard" | "roadmap" | "courses" | "tutor" | "practice";

export function Academy() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div className="flex flex-col gap-4 h-full max-w-7xl mx-auto w-full relative overflow-hidden">
      <header className="shrink-0 glass rounded-2xl px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              CareerOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Academy</span>
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Learn, Practice, Assess, and Get Hired.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isPremium && (
            <Button
              variant="outline"
              className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10 font-bold glass shadow-md"
              onClick={() => setIsPremium(true)}
            >
              <Zap className="h-4 w-4 mr-2" /> Upgrade to Pro
            </Button>
          )}
        </div>
      </header>

      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        {/* Nav Sidebar */}
        <div className="w-56 shrink-0 glass rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
          <NavButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <NavButton active={activeTab === "roadmap"} onClick={() => setActiveTab("roadmap")} icon={<MapIcon className="h-4 w-4" />} label="Learning Paths" />
          <NavButton active={activeTab === "courses"} onClick={() => setActiveTab("courses")} icon={<PlayCircle className="h-4 w-4" />} label="Course Library" />
          <div className="py-2">
            <div className="h-px bg-muted w-full" />
          </div>
          <NavButton active={activeTab === "tutor"} onClick={() => setActiveTab("tutor")} icon={<MessageSquare className="h-4 w-4" />} label="AI Tutor" premium={!isPremium} />
          <NavButton active={activeTab === "practice"} onClick={() => setActiveTab("practice")} icon={<Code className="h-4 w-4" />} label="Practice Labs" />
        </div>

        {/* Content Area */}
        <div className="flex-1 glass rounded-2xl overflow-y-auto no-scrollbar relative p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && <DashboardTab key="dashboard" profile={profile} />}
            {activeTab === "roadmap" && <RoadmapTab key="roadmap" />}
            {activeTab === "courses" && <CoursesTab key="courses" />}
            {activeTab === "tutor" && <TutorTab key="tutor" isPremium={isPremium} />}
            {activeTab === "practice" && <PracticeTab key="practice" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, premium }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; premium?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative ${
        active
          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-md"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      {active && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r-full shadow-md" />}
      {icon}
      <span>{label}</span>
      {premium && <Lock className="h-3 w-3 ml-auto text-amber-500" />}
    </button>
  );
}

function DashboardTab({ profile }: { profile: any; key?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Growth Dashboard</h2>
        <p className="text-sm text-muted-foreground">Track your learning progress and skill readiness.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card border-border/50 bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Learning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-400 flex items-center gap-2">
              <Zap className="h-6 w-6" /> 14 Days
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50 bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Employability Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" /> 78%
            </div>
            <p className="text-xs text-muted-foreground mt-1">+5% this week</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50 bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certifications Built</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-indigo-400 flex items-center gap-2">
              <Trophy className="h-6 w-6" /> 2
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card border-border/50 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Advanced SQL Foundations</p>
                <p className="text-xs text-muted-foreground">Completed today</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm">React Component Patterns</p>
                <p className="text-xs text-muted-foreground">Completed 3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Weak Areas to Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">System Design</span>
                <span className="text-sm font-bold text-amber-500">45%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[45%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Data Structures</span>
                <span className="text-sm font-bold text-amber-500">60%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[60%]" />
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2">
              Generate Practice Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function RoadmapTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Your AI Learning Roadmap</h2>
          <p className="text-sm text-muted-foreground">Target Role: Software Engineer (Full Stack)</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Sparkles className="h-4 w-4 mr-2" /> Recalculate Path
        </Button>
      </div>

      <div className="relative pl-6 space-y-6 mt-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-muted-foreground/20" />
        
        {/* Phase 1 */}
        <div className="relative">
          <div className="absolute -left-[30px] top-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-background z-10">
            <CheckCircle2 className="h-3 w-3 text-background" />
          </div>
          <Card className="glass-card border-border/50 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-500 uppercase tracking-wider">Phase 1 • Core Frontend</CardTitle>
              <CardDescription className="text-foreground/80 font-bold text-lg">React & State Management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You nailed this during the mock assessment. 100% complete.</p>
            </CardContent>
          </Card>
        </div>

        {/* Phase 2 */}
        <div className="relative">
          <div className="absolute -left-[30px] top-1 h-5 w-5 rounded-full bg-indigo-500 animate-pulse ring-4 ring-background z-10"></div>
          <Card className="glass-card border-indigo-500/30 bg-indigo-500/10 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-400 uppercase tracking-wider">Phase 2 • Backend APIs (Current)</CardTitle>
              <CardDescription className="text-foreground font-bold text-lg">Node.js, Express, & GraphQL</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">You have a skill gap here based on your target role. Complete these modules.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm"><PlayCircle className="h-4 w-4 text-primary" /> REST API Principles</div>
                <div className="flex items-center gap-2 text-sm"><Code className="h-4 w-4 text-primary" /> Express Middleware Lab</div>
              </div>
              <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700">Continue Learning</Button>
            </CardContent>
          </Card>
        </div>

        {/* Phase 3 */}
        <div className="relative">
          <div className="absolute -left-[30px] top-1 h-5 w-5 rounded-full bg-muted flex items-center justify-center ring-4 ring-background z-10"></div>
          <Card className="glass-card border-border/50 bg-muted/50 opacity-60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Phase 3 • Infrastructure</CardTitle>
              <CardDescription className="text-foreground font-bold text-lg">Docker & CI/CD Pipelines</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Locked until Phase 2 completion.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function CoursesTab() {
  const categories = ["Programming", "System Design", "Algorithms", "Soft Skills"];
  const [activeCat, setActiveCat] = useState("Programming");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Course Library</h2>
        <p className="text-sm text-muted-foreground">Master specifically what companies look for.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(c => (
          <Button
            key={c}
            variant={activeCat === c ? "default" : "outline"}
            className={activeCat === c ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-muted/50 border-border/50 text-muted-foreground hover:text-foreground"}
            onClick={() => setActiveCat(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => (
          <Card key={i} className="glass-card border-border/50 bg-muted/50 overflow-hidden group cursor-pointer hover:border-indigo-500/50 transition-colors">
            <div className="h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 relative">
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <PlayCircle className="h-10 w-10 text-foreground drop-shadow-md" />
               </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold mb-1">Advanced React Hooks {i}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                Deep dive into useMemo, useCallback, and custom hooks for performance optimization.
              </p>
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>12 Lessons</span>
                <span>2.5 Hours</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function TutorTab({ isPremium }: { isPremium: boolean; key?: string }) {
  if (!isPremium) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="h-20 w-20 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-6 ring-8 ring-amber-500/5">
           <Lock className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Unlock AI Tutor</h2>
        <p className="text-muted-foreground mb-8">
          Get 24/7 personalized mentoring, concept explanations, and debugging help mapped directly to your job goals.
        </p>
        <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg shadow-md">
           Upgrade to Pro
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col">
       <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <BrainCircuit className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h2 className="font-bold leading-none">CareerOS AI Tutor</h2>
            <p className="text-xs text-indigo-400 mt-1">Online & Ready</p>
          </div>
       </div>

       <div className="flex-1 bg-muted/50 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto mb-4 border border-border/50">
          <div className="flex gap-4 max-w-[80%]">
             <div className="h-8 w-8 rounded-full bg-indigo-500 shrink-0"></div>
             <div className="bg-muted p-3 rounded-2xl rounded-tl-sm text-sm border border-border/50">
               Hello! I noticed you struggled with System Design in your last mock interview. Would you like me to explain load balancing or spin up a mini design exercise?
             </div>
          </div>
          <div className="flex gap-4 max-w-[80%] self-end flex-row-reverse">
             <div className="h-8 w-8 rounded-full bg-primary shrink-0"></div>
             <div className="bg-primary/20 text-primary-foreground p-3 rounded-2xl rounded-tr-sm text-sm border border-primary/20">
               Could you explain consistent hashing first?
             </div>
          </div>
       </div>

       <div className="relative">
         <input type="text" placeholder="Ask your tutor anything..." className="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-indigo-500" />
         <Button size="icon" className="absolute right-1 top-1 bottom-1 h-auto bg-indigo-600 hover:bg-indigo-700">
           <MessageSquare className="h-4 w-4" />
         </Button>
       </div>
    </motion.div>
  );
}

function PracticeTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Practice Labs & Assessments</h2>
        <p className="text-sm text-muted-foreground">Hands-on exercises to prove your skills.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card border-border/50 bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
             <div className="h-16 w-16 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <TerminalSquare className="h-8 w-8" />
             </div>
             <div>
                <h3 className="font-bold text-lg">Coding Sandbox</h3>
                <p className="text-sm text-muted-foreground mt-1">Algorithms & Data Structures</p>
             </div>
             <Button variant="outline" className="mt-2 w-full">Start Lab</Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
             <div className="h-16 w-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <BrainCircuit className="h-8 w-8" />
             </div>
             <div>
                <h3 className="font-bold text-lg">System Design</h3>
                <p className="text-sm text-muted-foreground mt-1">Architecture Case Studies</p>
             </div>
             <Button variant="outline" className="mt-2 w-full">Start Mock</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-border/50 bg-muted/50 mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Live Assessments</CardTitle>
          <CardDescription>Verified by industry standards</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center font-bold">
                    SQL
                 </div>
                 <div>
                    <p className="font-bold">Advanced SQL Certification</p>
                    <p className="text-xs text-muted-foreground">30 mins • AI Proctored</p>
                 </div>
              </div>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Take Assessment</Button>
           </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
