import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent } from "../components/ui/card";
import {
  Share2,
  Database,
  Code,
  Shield,
  Cloud,
  Lightbulb,
  User,
  LayoutDashboard,
  BrainCircuit,
  ExternalLink,
} from "lucide-react";

const TABS = [
  { id: "arch", label: "System Architecture", icon: Share2 },
  { id: "db", label: "DB Schema", icon: Database },
  { id: "ai", label: "AI Interview Engine", icon: BrainCircuit },
  { id: "api", label: "APIs & Permissions", icon: Code },
  { id: "business", label: "Business & Roadmap", icon: Lightbulb },
  { id: "cloud", label: "Cloud & Security", icon: Cloud },
];

const initialNodes = [
  {
    id: "1",
    position: { x: 50, y: 50 },
    data: { label: "Candidate Dashboard" },
    style: {
      background: "#1e293b",
      color: "#fff",
      border: "1px solid #475569",
      borderRadius: "8px",
    },
  },
  {
    id: "2",
    position: { x: 50, y: 150 },
    data: { label: "Recruiter Dashboard" },
    style: {
      background: "#1e293b",
      color: "#fff",
      border: "1px solid #475569",
      borderRadius: "8px",
    },
  },

  {
    id: "3",
    position: { x: 300, y: 100 },
    data: { label: "FastAPI Backend Gateway" },
    style: {
      background: "#3b82f6",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
    },
  },

  {
    id: "4",
    position: { x: 550, y: 20 },
    data: { label: "AI Match Engine (Gemini)" },
    style: {
      background: "#8b5cf6",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
    },
  },

  {
    id: "5",
    position: { x: 550, y: 100 },
    data: { label: "AI Interview Service" },
    style: {
      background: "#10b981",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
    },
  },

  {
    id: "6",
    position: { x: 550, y: 200 },
    data: { label: "ATS Resume Scraper" },
    style: {
      background: "#f59e0b",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
    },
  },

  {
    id: "7",
    position: { x: 850, y: 100 },
    data: { label: "PostgreSQL Database" },
    style: {
      background: "#1e293b",
      color: "#fff",
      border: "1px solid #475569",
      borderRadius: "8px",
    },
  },

  {
    id: "8",
    position: { x: 850, y: 200 },
    data: { label: "Job Boards API (LinkedIn/Indeed)" },
    style: {
      background: "#1e293b",
      color: "#fff",
      border: "border: 1px dashed #475569",
      borderRadius: "8px",
    },
  },
];

const initialEdges = [
  {
    id: "e1-3",
    source: "1",
    target: "3",
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  },
  {
    id: "e3-6",
    source: "3",
    target: "6",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e3-7",
    source: "3",
    target: "7",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e6-8",
    source: "6",
    target: "8",
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  },
  {
    id: "e4-7",
    source: "4",
    target: "7",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e5-7",
    source: "5",
    target: "7",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export function SystemArchitecture() {
  const [activeTab, setActiveTab] = useState("arch");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, markerEnd: { type: MarkerType.ArrowClosed } },
          eds,
        ),
      ),
    [setEdges],
  );

  return (
    <div className="flex flex-col gap-4 h-full relative overflow-y-auto">
      <header className="h-16 shrink-0 glass rounded-2xl px-6 flex items-center justify-between shadow-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Share2 className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">
            CareerOS AI Documentation
          </h1>
          <span className="text-sm text-muted-foreground hidden sm:inline-block border-l border-border/50 pl-4 ml-2">
            Startup OS & Blueprint
          </span>
        </div>
      </header>

      <div className="flex gap-2 p-1 bg-muted/20 glass rounded-xl w-max shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-[600px] mb-8 relative">
        {activeTab === "arch" && (
          <div className="h-full glass rounded-2xl p-4 overflow-hidden border border-border/50">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              colorMode="dark"
              fitView
              fitViewOptions={{ padding: 0.2 }}
            >
              <Background color="#334155" variant={"dots" as any} />
              <Controls className="bg-background border-border/50 fill-primary" />
              <MiniMap
                className="bg-background border border-border/50 mask-image-gradient"
                nodeStrokeColor="#475569"
                nodeColor="#1e293b"
              />
            </ReactFlow>
          </div>
        )}

        {activeTab === "db" && (
          <div className="glass rounded-2xl p-8 border border-border/50">
            <h2 className="text-2xl font-bold mb-6">
              PostgreSQL Database Schema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background/50 p-6 rounded-xl border border-border">
                <h3 className="font-bold text-primary mb-4 border-b border-border/50 pb-2">
                  Users & Profiles
                </h3>
                <pre className="text-sm text-muted-foreground font-mono">
                  {`Table users {
  id uuid PK
  email varchar
  role_id uuid FK -> roles.id
  created_at timestamp
  last_login timestamp
}

Table roles {
  id uuid PK
  name enum('candidate', 'recruiter', 'institution', 'admin')
}

Table permissions {
  id uuid PK
  role_id uuid FK -> roles.id
  action varchar
  resource varchar
}

Table candidate_profiles {
  id uuid PK
  user_id uuid FK -> users.id
  resume_url varchar
  skills jsonb
  employability_score int
  digital_twin_data jsonb
}

Table recruiter_profiles {
  id uuid PK
  user_id uuid FK -> users.id
  company_name varchar
  hiring_volume varchar
}

Table institution_profiles {
  id uuid PK
  user_id uuid FK -> users.id
  institute_name varchar
  student_count varchar
}`}
                </pre>
              </div>

              <div className="bg-background/50 p-6 rounded-xl border border-border">
                <h3 className="font-bold text-primary mb-4 border-b border-border/50 pb-2">
                  Hiring Core & System
                </h3>
                <pre className="text-sm text-muted-foreground font-mono">
                  {`Table credentials {
  id uuid PK
  user_id uuid FK -> users.id
  password_hash varchar
  auth_provider varchar
  is_verified boolean
}

Table login_sessions {
  id uuid PK
  user_id uuid FK -> users.id
  token varchar
  device_id uuid FK -> trusted_devices.id
  expires_at timestamp
}

Table password_reset_tokens {
  id uuid PK
  user_id uuid FK -> users.id
  token varchar
  expires_at timestamp
  used boolean
}

Table email_verification_tokens {
  id uuid PK
  user_id uuid FK -> users.id
  token varchar
  expires_at timestamp
  used boolean
}

Table otp_tokens {
  id uuid PK
  user_id uuid FK -> users.id
  phone_number varchar
  otp_hash varchar
  expires_at timestamp
}

Table failed_login_attempts {
  id uuid PK
  email varchar
  ip_address varchar
  attempt_time timestamp
}

Table trusted_devices {
  id uuid PK
  user_id uuid FK -> users.id
  device_hash varchar
  device_name varchar
  last_used timestamp
}

Table auth_audit_logs {
  id uuid PK
  user_id uuid FK -> users.id
  event_type varchar
  ip_address varchar
  user_agent text
  created_at timestamp
}

Table verification_requests {
  id uuid PK
  user_id uuid FK -> users.id
  status enum('pending', 'approved', 'rejected')
  documents jsonb
}

Table activity_logs {
  id uuid PK
  user_id uuid FK -> users.id
  action varchar
  ip_address varchar
  created_at timestamp
}

Table notifications {
  id uuid PK
  user_id uuid FK -> users.id
  type varchar
  message text
  read boolean
}

Table subscriptions {
  id uuid PK
  user_id uuid FK -> users.id
  tier enum('free', 'pro', 'enterprise')
  status varchar
}

Table jobs {
  id uuid PK
  recruiter_id uuid FK
  title varchar
}

Table ai_interviews {
  id uuid PK
  candidate_id uuid FK
  scores jsonb
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="glass rounded-2xl p-8 border border-border/50">
            <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-3">
              <BrainCircuit className="h-6 w-6" /> AI Interview Engine Flow
            </h2>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 shrink-0 bg-primary/20 text-primary font-black rounded-lg flex items-center justify-center border border-primary/30 text-xl border border-primary/50 shadow-md">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Campaign / Environment Setup
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    The system defines the context. For HR, a specific
                    "Campaign" is used (e.g. "Backend Dev Round"). For
                    Candidates, it's a "Mock Selection". The system uses Gemini
                    models to generate an adaptive Question Bank based on the
                    resume, job description, and chosen difficulty.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 shrink-0 bg-primary/20 text-primary font-black rounded-lg flex items-center justify-center border border-primary/50 shadow-md text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Real-time Multimodal Interview
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    The candidate enters the session. WebRTC streams
                    video/audio. The AI (powered by Google Gemini Live API / Web
                    Speech API) asks questions, adapting in real-time based on
                    the candidate's answers. If it's a coding round, a Monaco
                    Editor is synced and evaluated incrementally.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 shrink-0 bg-primary/20 text-primary font-black rounded-lg flex items-center justify-center border border-primary/50 shadow-md text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Real-time Metric Extraction
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    OpenCV / MediaPipe runs client-side strictly for basic "Eye
                    Contact" and "Body Language" metrics (saving bandwidth). NLP
                    pipelines extract filler words, speech clarity, and semantic
                    accuracy of technical answers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 shrink-0 bg-primary/20 text-primary font-black rounded-lg flex items-center justify-center border border-primary/50 shadow-md text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Comprehensive Scorecard Generation
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Post-interview, the system aggregates Communication,
                    Technical, Confidence, and Problem Solving scores. It
                    outputs a <strong>Detailed Feedback Report</strong>{" "}
                    alongside a "Hiring Probability Score" or "Team
                    Compatibility Score" for HR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="glass rounded-2xl p-8 border border-border/50">
            <h2 className="text-2xl font-bold mb-6">APIs & Role Permissions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-emerald-500 mb-4 uppercase tracking-widest text-sm">
                  Core REST/GraphQL Endpoints
                </h3>
                <ul className="space-y-4 font-mono text-sm">
                  <li className="bg-background/50 p-3 rounded border border-border">
                    <span className="text-blue-400 font-bold">POST</span>{" "}
                    /api/v1/resume/parse
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Candidate only
                    </span>
                  </li>
                  <li className="bg-background/50 p-3 rounded border border-border">
                    <span className="text-blue-400 font-bold">GET</span>{" "}
                    /api/v1/interviews/campaigns
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Recruiter only
                    </span>
                  </li>
                  <li className="bg-background/50 p-3 rounded border border-border">
                    <span className="text-green-400 font-bold">WS</span>{" "}
                    /api/v1/stream/interview
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Candidate / Secure Token
                    </span>
                  </li>
                  <li className="bg-background/50 p-3 rounded border border-border">
                    <span className="text-blue-400 font-bold">GET</span>{" "}
                    /api/v1/talent/crm/pipeline
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Recruiter only
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-amber-500 mb-4 uppercase tracking-widest text-sm">
                  Role Definitions
                </h3>
                <div className="space-y-4">
                  <div className="bg-background/50 p-4 rounded-xl border border-border">
                    <h4 className="font-bold text-foreground">Candidate</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Read/Write access to own profile, own resume, and own
                      interview results. Cannot query global job data
                      arbitrarily. Express consent required for Auto-Apply Agent
                      and Recruiter Visibility.
                    </p>
                  </div>
                  <div className="bg-background/50 p-4 rounded-xl border border-border">
                    <h4 className="font-bold text-foreground">
                      HR / Recruiter
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Read access to Candidates who have "Opted-In". Write
                      access to Campaigns, Job Posts, and CRM Notes. AI Bias
                      Detection flag cannot be overridden.
                    </p>
                  </div>
                  <div className="bg-background/50 p-4 rounded-xl border border-border opacity-50">
                    <h4 className="font-bold text-foreground">System Admin</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Global audit logs, billing, and platform moderation. No
                      PII access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "business" && (
          <div className="glass rounded-2xl p-8 border border-border/50">
            <h2 className="text-2xl font-bold mb-6">
              Startup Business Model & Roadmap
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  B2B SaaS (HR Intelligence)
                </h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    <strong>Tier 1:</strong> ₹24,999/mo (Up to 5 AI Campaigns,
                    basic CRM)
                  </li>
                  <li>
                    <strong>Tier 2:</strong> ₹64,999/mo (Unlimited Campaigns, API
                    access, ATS Integration)
                  </li>
                  <li>
                    <strong>Enterprise:</strong> Custom (Whitelabel AI
                    Interviewer, Bias Audits)
                  </li>
                </ul>
              </div>
              <div className="bg-secondary/20 p-6 rounded-xl border border-secondary">
                <h3 className="font-bold text-lg mb-2 text-foreground">
                  B2C Freemium (CareerOS)
                </h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    <strong>Basic:</strong> Free (1 Mock Interview/mo, Resume
                    Analysis)
                  </li>
                  <li>
                    <strong>Pro Engine:</strong> ₹999/mo (Unlimited Mocks,
                    Auto-Apply Agent, Skill Simulator)
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="font-bold text-xl mb-4 border-b border-border/50 pb-2">
              Development Roadmap
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-background/50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold">
                  Phase 1: Minimum Viable Product (Current)
                </h4>
                <p className="text-sm text-muted-foreground">
                  React + Tailwind Frontend, Resume ATS Scoring, Mock Interview
                  Simulation UI, Recruiter Pipeline View.
                </p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border-l-4 border-amber-500">
                <h4 className="font-bold">Phase 2: Deep AI Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Voice + Video real-time streaming, OpenCV client-side
                  analysis, Candidate Digital Twin projection models.
                </p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-bold">Phase 3: Scale & Ecosystem</h4>
                <p className="text-sm text-muted-foreground">
                  Enterprise ATS integrations (Workday, Greenhouse), B2B Team
                  Compatibility matching, Auto-Apply autonomous agents.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cloud" && (
          <div className="glass rounded-2xl p-8 border border-border/50">
            <h2 className="text-2xl font-bold mb-6">
              Scalable Cloud & Security Design
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                  <Cloud className="h-5 w-5 text-primary" /> Cloud Architecture
                </h3>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="bg-background/50 p-4 rounded border border-border">
                    <strong className="text-foreground">Compute:</strong> Google
                    Cloud Run (Serverless containers for FastAPI backend).
                    Auto-scales to handle interview bursts.
                  </li>
                  <li className="bg-background/50 p-4 rounded border border-border">
                    <strong className="text-foreground">
                      Frontend Hosting:
                    </strong>{" "}
                    Vercel / Cloudflare Pages for ultra-fast global CDN
                    delivery.
                  </li>
                  <li className="bg-background/50 p-4 rounded border border-border">
                    <strong className="text-foreground">AI Inference:</strong>{" "}
                    Google Gemini Pro / Flash API for heavy NLP. Web Speech API
                    for low-latency ASR (Fallback to Whisper).
                  </li>
                  <li className="bg-background/50 p-4 rounded border border-border">
                    <strong className="text-foreground">Data Storage:</strong>{" "}
                    Cloud SQL (PostgreSQL).
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-destructive" /> Security &
                  Compliance
                </h3>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="bg-background/50 p-4 rounded border border-border border-l-4 border-l-destructive">
                    <strong className="text-foreground">PII Encryption:</strong>{" "}
                    Resumes and interview transcripts are encrypted at rest
                    using AES-256. Short-lived signed URLs for video playback.
                  </li>
                  <li className="bg-background/50 p-4 rounded border border-border">
                    <strong className="text-foreground">
                      Zero-Trust Auth:
                    </strong>{" "}
                    JWT based authentication. WebSockets use one-time handshake
                    tokens.
                  </li>
                  <li className="bg-background/50 p-4 rounded border border-border">
                    <strong className="text-foreground">AI Bias Audits:</strong>{" "}
                    LLM prompt engineering specifically instructs the model to
                    ignore names, genders, and protected classes during "Rank
                    Candidate" calls.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
