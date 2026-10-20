import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import {
  Clock,
  Loader2,
  Sparkles,
  Building2,
  ChevronRight,
  TrendingUp,
  Target,
  BrainCircuit,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

export function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResumes() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "resumes"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResumes(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadResumes();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full max-w-7xl mx-auto w-full">
      <header className="h-20 shrink-0 glass-card rounded-[2rem] px-8 flex items-center justify-between border-border/50 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex flex-col items-center justify-center font-black text-xl text-primary shadow-md">
            C
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              CareerOS Operations
            </h1>
            <span className="text-sm font-medium text-muted-foreground hidden sm:block uppercase tracking-widest text-[10px]">
              Intelligence Center Active
            </span>
          </div>
        </div>
        <Button
          asChild
          className="relative z-10 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md animate-glow"
        >
          <Link to="/upload">
            <Sparkles className="h-4 w-4 mr-2" />
            INITIALIZE ANALYSIS
          </Link>
        </Button>
      </header>

      {/* Intelligence Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <Card className="glass-card shadow-lg border-border/50 relative overflow-hidden rounded-[1.5rem] group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform group-hover:text-primary">
            <Target className="h-24 w-24" />
          </div>
          <CardContent className="p-8">
            <div className="text-sm text-primary font-bold mb-2 uppercase tracking-[0.2em] text-[10px] drop-shadow-sm">
              Employability Score
            </div>
            <div className="flex items-end gap-3">
              <div className="text-5xl font-black text-foreground drop-shadow-sm">
                84
              </div>
              <div className="text-sm text-primary font-bold mb-1.5 flex items-center bg-primary/10 px-2 py-1 rounded-md">
                <TrendingUp className="h-3 w-3 mr-1" /> +4% this month
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card shadow-lg border-border/50 relative overflow-hidden rounded-[1.5rem] group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform group-hover:text-secondary">
            <BrainCircuit className="h-24 w-24" />
          </div>
          <CardContent className="p-8">
            <div className="text-sm text-secondary font-bold mb-2 uppercase tracking-[0.2em] text-[10px] drop-shadow-sm">
              Skill Gap Simulation
            </div>
            <div className="text-2xl font-black text-foreground mb-2 leading-tight">
              +14% chance if <br />
              you learn
            </div>
            <div className="text-xs font-bold text-secondary bg-secondary/10 border border-secondary/20 inline-block px-3 py-1.5 rounded-lg shadow-sm">
              GraphQL / Apollo
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card shadow-lg border-border/50 relative overflow-hidden rounded-[1.5rem] group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform group-hover:text-accent">
            <Sparkles className="h-24 w-24" />
          </div>
          <CardContent className="p-8">
            <div className="text-sm text-accent font-bold mb-2 uppercase tracking-[0.2em] text-[10px] drop-shadow-sm">
              Digital Twin Projection
            </div>
            <div className="text-2xl font-black text-foreground mb-2 leading-tight">
              Senior Level in <br />
              1.2 Years
            </div>
            <div className="text-xs font-medium text-muted-foreground w-3/4">
              Based on current trajectory and market conditions
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mt-6 mb-2 px-2">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-md"></div>
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Intelligence Hub
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-2"></div>
      </div>

      {resumes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 glass-card rounded-[2rem] flex flex-col items-center justify-center p-12 text-center border-dashed border-border"
        >
          <div className="h-20 w-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm animate-float">
            <Sparkles className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-black mb-3 text-foreground">
            No Profiles Initialized
          </h3>
          <p className="text-muted-foreground max-w-md mb-8 text-lg">
            Upload your first resume to get deep AI analysis and start
            generating your custom career roadmap.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-md transition-all animate-glow"
          >
            <Link to="/upload">Initialize Profile</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="flex-1 overflow-auto rounded-[2rem] no-scrollbar pb-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1"
          >
            {resumes.map((r) => (
              <motion.div key={r.id} variants={fadeInUp}>
                <Link to={`/resume/${r.id}`}>
                  <Card className="glass-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer h-full group rounded-[1.5rem] overflow-hidden border-border/50">
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle
                            className="text-lg font-bold text-foreground line-clamp-1"
                            title={r.fileName}
                          >
                            {r.fileName}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1.5 text-primary font-medium text-xs tracking-wider uppercase">
                            <Building2 className="h-3.5 w-3.5" /> {r.roleTarget}
                          </CardDescription>
                        </div>
                        {r.status === "completed" && (
                          <div className="flex flex-col items-center justify-center min-w-[3rem] h-[3rem] rounded-xl border border-primary/30 bg-primary/10 text-primary font-black shadow-sm">
                            {r.atsScore}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pt-4 border-t border-border/50">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 opacity-70" />
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                        {r.status === "processing" ? (
                          <span className="text-secondary font-bold animate-pulse flex items-center gap-1.5 tracking-wider uppercase text-[10px]">
                            <Loader2 className="h-3 w-3 animate-spin" />{" "}
                            PROCESSING
                          </span>
                        ) : r.status === "failed" ? (
                          <span className="text-destructive font-bold tracking-wider uppercase text-[10px]">
                            FAILED
                          </span>
                        ) : (
                          <span className="text-primary font-bold flex items-center group-hover:translate-x-1 transition-transform tracking-wider uppercase text-[10px]">
                            REPORT <ChevronRight className="h-3 w-3 ml-0.5" />
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
