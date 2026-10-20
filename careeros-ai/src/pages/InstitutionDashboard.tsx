import React from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  Building,
  Users,
  TrendingUp,
  BarChart,
  ChevronRight,
  Activity,
  CalendarDays,
  BrainCircuit,
  Video,
} from "lucide-react";
import { motion } from "motion/react";

const BATCHES = [
  {
    id: "1",
    dept: "Computer Science",
    students: 450,
    avgPlacementScore: 82,
    interviewed: 320,
  },
  {
    id: "2",
    dept: "Information Tech",
    students: 250,
    avgPlacementScore: 78,
    interviewed: 150,
  },
  {
    id: "3",
    dept: "Business Admin",
    students: 600,
    avgPlacementScore: 88,
    interviewed: 400,
  },
];

export function InstitutionDashboard() {
  return (
    <div className="flex flex-col gap-4 h-full max-w-7xl mx-auto w-full relative">
      <header className="h-20 shrink-0 glass rounded-2xl px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-500">
              Placement Intelligence
            </h1>
            <span className="text-sm text-muted-foreground">
              University Dashboard
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <Card className="glass shadow-sm border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="h-20 w-20 text-emerald-500" />
          </div>
          <CardContent className="p-6">
            <div className="text-sm text-emerald-500 font-bold mb-1 uppercase tracking-widest text-[10px]">
              Onboarded Students
            </div>
            <div className="text-4xl font-black text-foreground">1,300</div>
          </CardContent>
        </Card>
        <Card className="glass shadow-sm border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit className="h-20 w-20 text-blue-500" />
          </div>
          <CardContent className="p-6">
            <div className="text-sm text-blue-500 font-bold mb-1 uppercase tracking-widest text-[10px]">
              Mock Interviews Taken
            </div>
            <div className="text-4xl font-black text-foreground">8,451</div>
          </CardContent>
        </Card>
        <Card className="glass shadow-sm border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="h-20 w-20 text-purple-500" />
          </div>
          <CardContent className="p-6">
            <div className="text-sm text-purple-500 font-bold mb-1 uppercase tracking-widest text-[10px]">
              Avg Employability Gain
            </div>
            <div className="text-4xl font-black text-foreground">+24%</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 glass rounded-2xl p-6 overflow-hidden flex flex-col border border-border/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Department Readiness</h2>
        </div>

        <div className="flex-1 overflow-auto pr-2 flex flex-col gap-3">
          {BATCHES.map((batch) => (
            <motion.div
              whileHover={{ scale: 1.01 }}
              key={batch.id}
              className="bg-background/50 border border-border/50 hover:border-emerald-500/50 transition-colors p-4 rounded-xl flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                  {batch.dept.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{batch.dept}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {batch.students} Students
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-3 w-3" /> {batch.interviewed}{" "}
                      Evaluated
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
                    Avg Score
                  </div>
                  <div className="text-lg font-black text-emerald-500">
                    {batch.avgPlacementScore}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ensure Video icon is imported from lucide-react if needed, replaced with Activity or something if missing. We will add to imports.
