import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  MessageSquare,
  TrendingUp,
  Target,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send,
  Sparkles,
  BarChart,
  LineChart,
  Activity,
  Award,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { chatWithCareerAgent } from "../lib/gemini";
import Markdown from "react-markdown";
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "sonner";

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: Date;
};

export function AiCareerAgent() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [candidateContext, setCandidateContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history & candidate context
  useEffect(() => {
    if (!user) return;
    async function loadData() {
      let contextData: any = { profile: profile };

      try {
        const resumeQ = query(collection(db, "resumes"), where("userId", "==", user.uid), orderBy("updatedAt", "desc"), limit(1));
        const resumeSnap = await getDocs(resumeQ);
        if (!resumeSnap.empty) {
          const parsed = JSON.parse(resumeSnap.docs[0].data().parsedData || "{}");
          contextData.resume = parsed;
        }
      } catch (e) {
        console.log("No resumes found or index missing", e);
      }

      try {
        const interviewQ = query(collection(db, "interviews"), where("userId", "==", user.uid));
        const interviewSnap = await getDocs(interviewQ);
        contextData.interviews = interviewSnap.docs.map(d => d.data().overallScore || 0);
      } catch (e) {
        console.log("No interviews found", e);
      }

      setCandidateContext(contextData);

      try {
        // Load chat history
        const chatDoc = await getDoc(doc(db, "agent_chats", user.uid));
        if (chatDoc.exists() && chatDoc.data().messages) {
          const history = chatDoc.data().messages.map((m: any) => ({
            ...m,
            timestamp: m.timestamp?.toDate ? m.timestamp.toDate() : new Date(m.timestamp)
          }));
          setMessages(history);
        } else {
          const initMsg: ChatMessage = {
            id: "1",
            role: "agent",
            text: "Hello! I'm your AI Career Agent. I've analyzed your profile and I'm ready to help you plan your career, improve your skills, and get hired. How can I assist you today?",
            timestamp: new Date()
          };
          setMessages([initMsg]);
        }
      } catch (e) {
        console.error("Failed to load chat history", e);
        const initMsg: ChatMessage = {
          id: "1",
          role: "agent",
          text: "Hello! I'm your AI Career Agent. Let me know how I can assist you today.",
          timestamp: new Date()
        };
        setMessages([initMsg]);
      }
    }
    loadData();
  }, [user, profile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveChatHistory = async (newMessages: ChatMessage[]) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "agent_chats", user.uid), {
        messages: newMessages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() }))
      });
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !candidateContext) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: inputMessage,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Map for history argument
      const historyArg = messages.map(m => ({
        role: m.role as "user" | "agent",
        text: m.text
      }));

      const replyText = await chatWithCareerAgent(newMsg.text, historyArg, candidateContext);

      const agentReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        text: replyText,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, agentReply];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (e) {
      console.error(e);
      toast.error("Failed to connect to Career Agent API.");
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        text: "Ouch, I'm having trouble connecting to my AI core right now. Let's try again in a moment.",
        timestamp: new Date()
      };
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full max-w-7xl mx-auto w-full">
      {/* Left Column: Dashboard & Tracking */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-4 lg:pb-0">
        <header className="shrink-0 glass rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between shadow-xl gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="h-7 w-7 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                AI Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Agent</span>
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                Your Personal Recruiter, Mentor, & Coach.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            <Activity className="h-5 w-5" /> Active & Monitoring
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card border-border/50 bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Employability Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-400">82%</div>
              <p className="text-xs text-muted-foreground mt-1 text-emerald-500/80">Top 15% of candidates</p>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[82%]" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50 bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Learning Streak <Sparkles className="h-3 w-3 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-amber-400">12 Days</div>
              <p className="text-xs text-muted-foreground mt-1 text-amber-500/80">Excellent consistency!</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50 bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Time-to-Hire Forecast <TrendingUp className="h-3 w-3 text-indigo-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-indigo-400">3-5 Wks</div>
              <p className="text-xs text-muted-foreground mt-1 text-indigo-400/80">Based on recent interview performance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Recommendations */}
          <Card className="glass-card border-border/50 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" /> Daily Recommendations
              </CardTitle>
              <CardDescription>Curated tasks to accelerate your career</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Practice SQL Joins</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">You showed weakness here in last week's assessment.</p>
                  <Button size="sm" className="mt-2 text-xs h-7 bg-indigo-600 hover:bg-indigo-700">Start Practice</Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <BriefcaseIcon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Apply for Data Engineer @ Stripe</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Your profile is a 92% match. Deadline is tomorrow.</p>
                  <Button size="sm" className="mt-2 text-xs h-7 bg-emerald-600 hover:bg-emerald-700">Auto-Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accountability & Reminders */}
          <Card className="glass-card border-border/50 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" /> Accountability & Reminders
              </CardTitle>
              <CardDescription>Stay on track with your goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border/50 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Daily Learning Goal</span>
                </div>
                <span className="text-xs font-bold text-amber-500">20 / 45 mins</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border/50 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Amazon Mock Interview</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">Today 4:00 PM</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border/50 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">AWS Cert Renewal</span>
                </div>
                <span className="text-xs font-bold text-red-400">Due in 5 days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-border/50 bg-muted/50 flex-1 min-h-[200px]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" /> Career Trajectory Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col items-center justify-center relative p-8">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <svg viewBox="0 0 400 100" className="w-full h-full text-emerald-500 fill-none stroke-current" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 0 80 Q 50 70 100 60 T 200 40 T 300 20 T 400 10" />
              </svg>
            </div>
            <div className="text-center z-10">
              <h3 className="font-bold text-xl mb-2">Senior Architect Readiness</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                If you maintain your 12-day learning streak and complete the System Design module, you will be highly competitive for Senior Architect roles in approx. 2.5 months. Salary potential jumps by +$40k.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Chat UI */}
      <Card className="w-full lg:w-[400px] shrink-0 glass shadow-xl border-border/50 flex flex-col h-[500px] lg:h-full rounded-2xl overflow-hidden relative">
        <div className="h-16 px-4 border-b flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex flex-col items-center justify-center p-0.5 border border-primary/30 relative">
            <Brain className="h-5 w-5 text-primary" />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border border-background rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm">Career Agent</h3>
            <p className="text-xs text-muted-foreground">Always here to prep you</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted/50 border rounded-tl-sm prose prose-sm dark:prose-invert"
                  }`}
              >
                {msg.role === "agent" ? (
                  <Markdown>{msg.text}</Markdown>
                ) : (
                  msg.text
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-muted/50 border rounded-tl-sm rounded-2xl px-4 py-3 text-sm shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-muted-foreground">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-background/50 backdrop-blur-sm flex flex-col gap-2">
          {/* Quick actions */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {["Create plan", "Recommend jobs", "Mock interview", "Salary advice"].map(action => (
              <button
                key={action}
                type="button"
                onClick={() => setInputMessage(action)}
                className="whitespace-nowrap px-3 py-1 rounded-full border bg-muted/50 text-xs font-medium hover:bg-primary/10 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="relative flex items-end">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Ask for advice, practice, or analysis..."
              className="w-full bg-background border rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none min-h-[48px] max-h-[120px]"
              rows={1}
            />
            <Button
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
              type="submit"
              className="absolute right-1 bottom-1 w-8 h-8 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

function BriefcaseIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
