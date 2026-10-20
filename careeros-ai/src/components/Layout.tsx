import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FileText,
  LayoutDashboard,
  Upload,
  Users,
  LogOut,
  Briefcase,
  RefreshCw,
  Radar,
  Send,
  Share2,
  Building,
  CreditCard,
  BookOpen,
  Zap,
  BadgeCheck
} from "lucide-react";
import { Button } from "./ui/button";
import { Brain } from "lucide-react";
import { PremiumModal } from "./PremiumModal";

export function Layout() {
  const { profile, logOut, updateRole } = useAuth();
  const location = useLocation();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const isRecruiter = profile?.role === "recruiter";
  const isInstitution = profile?.role === "institution";
  const userTier = profile?.tier || "free";

  const navItems = isRecruiter
    ? [
      { name: "Workspace Profile", path: "/profile", icon: LayoutDashboard },
      { name: "Candidates HQ", path: "/dashboard", icon: Users },
      { name: "AI Campaigns", path: "/campaigns", icon: Briefcase },
      { name: "Billing", path: "/billing", icon: CreditCard },
      { name: "Architecture", path: "/architecture", icon: Share2 },
    ]
    : isInstitution
      ? [
        { name: "Institution Profile", path: "/profile", icon: LayoutDashboard },
        { name: "Placement Hub", path: "/dashboard", icon: Building },
        { name: "Billing", path: "/billing", icon: CreditCard },
        { name: "Architecture", path: "/architecture", icon: Share2 },
      ]
      : [
        { name: "Candidate Profile", path: "/profile", icon: LayoutDashboard },
        { name: "Dashboard", path: "/dashboard", icon: Users },
        { name: "Career Agent", path: "/agent", icon: Brain },
        { name: "Academy", path: "/academy", icon: BookOpen },
        { name: "AI Interview", path: "/mock-interview", icon: FileText },
        { name: "Job Radar", path: "/radar", icon: Radar },
        { name: "Applications", path: "/applications", icon: Send },
        { name: "Billing", path: "/billing", icon: CreditCard },
        { name: "Architecture", path: "/architecture", icon: Share2 },
      ];

  const handleRoleToggle = () => {
    // Just cycle through roles for demo purposes
    if (profile?.role === "candidate") updateRole("recruiter");
    else if (profile?.role === "recruiter") updateRole("institution");
    else updateRole("candidate");
  };

  const getNextRoleName = () => {
    if (profile?.role === "candidate") return "Recruiter";
    if (profile?.role === "recruiter") return "Institution";
    return "Candidate";
  };

  return (
    <div className="min-h-screen bg-background flex p-4 gap-4 text-foreground bg-mesh animate-mesh overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      {/* Sidebar */}
      <aside className="w-72 glass-card rounded-[2rem] p-6 flex-col justify-between hidden md:flex border-border/50 shadow-xl z-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-[2rem] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-md">
              C
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground drop-shadow-sm">
              CareerOS
            </span>
          </div>
          <nav className="flex flex-col gap-3">
            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 px-2 drop-shadow-sm">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group overflow-hidden relative ${isActive
                    ? "text-primary border border-primary/20 shadow-sm bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                    }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-md"></div>
                  )}
                  <Icon
                    className={`h-5 w-5 transition-transform ${isActive ? "text-primary scale-110 drop-shadow-sm" : "group-hover:text-primary group-hover:scale-110"}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto flex flex-col gap-4 relative z-10">
          <div className="flex items-center gap-3 pt-6 border-t border-border">
            <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border font-black text-lg text-foreground shadow-sm relative overflow-hidden">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-secondary/10 blur-md pointer-events-none"></div>
              <span className="relative">
                {profile?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold truncate text-foreground flex items-center gap-2">
                {profile?.name || "User"}
                {profile?.isVerified && (
                  <span title="Verified Account" className="inline-flex items-center">
                    <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  </span>
                )}
                {userTier !== "free" && userTier !== "basic" && userTier !== "standard" && (
                  <span className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-extrabold">{userTier}</span>
                )}
              </p>
              <p className="text-[10px] font-semibold text-primary truncate uppercase tracking-widest">
                {profile?.role}
              </p>
            </div>
          </div>
          {(userTier === "free" || userTier === "basic" || userTier === "standard") && (
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0 transition-all rounded-xl shadow-md"
              onClick={() => setShowPremiumModal(true)}
            >
              <Zap className="h-4 w-4 mr-2" /> Upgrade to Pro
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-muted-foreground bg-background hover:bg-muted/50 hover:text-foreground border-border transition-all rounded-xl shadow-sm"
            onClick={handleRoleToggle}
          >
            <RefreshCw className="h-4 w-4 mr-3 text-secondary" />
            Switch to {getNextRoleName()}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl"
            onClick={logOut}
          >
            <LogOut className="h-4 w-4 mr-3" />
            End Session
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar rounded-[2rem] relative z-10">
        <Outlet />
      </main>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}
