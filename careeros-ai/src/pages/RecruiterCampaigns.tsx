import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Briefcase,
  Settings,
  Users,
  BrainCircuit,
  Activity,
  BarChart,
  ChevronRight,
  Play,
} from "lucide-react";
import { motion } from "motion/react";

const CAMPAIGNS = [
  {
    id: "1",
    title: "Senior Backend Engineer",
    candidates: 45,
    avgScore: 82,
    status: "Active",
    biasTested: true,
  },
  {
    id: "2",
    title: "Growth Marketing Lead",
    candidates: 12,
    avgScore: 75,
    status: "Active",
    biasTested: true,
  },
  {
    id: "3",
    title: "UX Designer",
    candidates: 89,
    avgScore: 88,
    status: "Draft",
    biasTested: false,
  },
];

export function RecruiterCampaigns() {
  return (
    <div className="flex flex-col gap-4 h-full max-w-7xl mx-auto w-full relative">
      <header className="h-20 shrink-0 glass rounded-2xl px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 text-primary rounded-xl">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Campaigns</h1>
            <span className="text-sm text-muted-foreground">
              Automated Screening & Intelligent Hiring
            </span>
          </div>
        </div>
        <Button className="font-bold shadow-lg">Create Campaign</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <Card className="glass shadow-sm border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="h-20 w-20 text-blue-500" />
          </div>
          <CardContent className="p-6">
            <div className="text-sm text-blue-500 font-bold mb-1 uppercase tracking-widest text-[10px]">
              Active Campaigns
            </div>
            <div className="text-4xl font-black text-foreground">12</div>
          </CardContent>
        </Card>
        <Card className="glass shadow-sm border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="h-20 w-20 text-purple-500" />
          </div>
          <CardContent className="p-6">
            <div className="text-sm text-purple-500 font-bold mb-1 uppercase tracking-widest text-[10px]">
              Total Candidates Screened
            </div>
            <div className="text-4xl font-black text-foreground">1,482</div>
          </CardContent>
        </Card>
        <Card className="glass shadow-sm border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit className="h-20 w-20 text-emerald-500" />
          </div>
          <CardContent className="p-6">
            <div className="text-sm text-emerald-500 font-bold mb-1 uppercase tracking-widest text-[10px]">
              Avg AI Hiring Accuracy
            </div>
            <div className="text-4xl font-black text-foreground">94%</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 glass rounded-2xl p-6 overflow-hidden flex flex-col border border-border/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Campaign Pipeline</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
            <Button variant="outline" size="sm">
              <BarChart className="h-4 w-4 mr-2" /> Reports
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto pr-2 flex flex-col gap-3">
          {CAMPAIGNS.map((camp) => (
            <motion.div
              whileHover={{ scale: 1.01 }}
              key={camp.id}
              className="bg-background/50 border border-border/50 hover:border-primary/50 transition-colors p-4 rounded-xl flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${camp.status === "Active" ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground border border-border"}`}
                >
                  {camp.title.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{camp.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {camp.candidates} Candidates
                    </span>
                    <span className="flex items-center gap-1">
                      <BrainCircuit className="h-3 w-3" /> {camp.avgScore} Avg
                      Score
                    </span>
                    {camp.biasTested && (
                      <span className="text-emerald-500 flex items-center gap-1">
                        Bias Audited
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${camp.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-muted text-muted-foreground border border-border"}`}
                >
                  {camp.status}
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
