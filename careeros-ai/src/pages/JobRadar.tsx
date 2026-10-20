import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Briefcase,
  MapPin,
  Building,
  Star,
  CheckCircle2,
  ChevronRight,
  BarChart,
  DollarSign,
  BrainCircuit,
  ExternalLink,
  Radar,
  Search,
  Loader2,
  XCircle,
  FileText,
  Bell,
  BellRing,
  Plus,
  Trash2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { discoverAndMatchJobs, prepareApplication, approveAndSubmitApplication, rejectApplication, JobListing, ApplicationPacket } from "../lib/autoApply";
import { getUserJobAlerts, createJobAlert, updateJobAlert, deleteJobAlert, JobAlert } from "../lib/jobAlerts";
import Markdown from "react-markdown";
import { toast } from "sonner";

export function JobRadar() {
  const { user, profile } = useAuth();
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [actionState, setActionState] = useState<"idle" | "generating" | "ready">("idle");
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [activePacket, setActivePacket] = useState<ApplicationPacket | null>(null);
  const [previewMode, setPreviewMode] = useState<'none' | 'resume' | 'coverLetter'>('none');
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [newAlertForm, setNewAlertForm] = useState({ keywords: '', location: '', minSalary: '', remoteOnly: false, frequency: 'daily' as 'daily'|'weekly' });

  useEffect(() => {
    if (user) loadAlerts();
  }, [user]);

  const loadAlerts = async () => {
    if (!user) return;
    const alerts = await getUserJobAlerts(user.uid);
    setJobAlerts(alerts);
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!user || !newAlertForm.keywords.trim()) return;
    await createJobAlert({
      userId: user.uid,
      keywords: newAlertForm.keywords,
      location: newAlertForm.location,
      minSalary: newAlertForm.minSalary,
      remoteOnly: newAlertForm.remoteOnly,
      frequency: newAlertForm.frequency,
      isActive: true
    });
    setNewAlertForm({ keywords: '', location: '', minSalary: '', remoteOnly: false, frequency: 'daily' });
    loadAlerts();
    toast.success("Job alert created!");
  };

  const handleRemoveAlert = async (id: string) => {
    await deleteJobAlert(id);
    loadAlerts();
    toast.success("Job alert removed");
  };

  const handleToggleAlert = async (alert: JobAlert) => {
    if(!alert.id) return;
    await updateJobAlert(alert.id, { isActive: !alert.isActive });
    loadAlerts();
    toast.success(`Job alert ${!alert.isActive ? "enabled" : "disabled"}`);
  };

  const handleDeepMatch = async (job: JobListing) => {
    if (!user) return;
    setActionState("generating");
    try {
      const userContext = `Role: ${profile?.role}. Skills: ${profile?.skills?.join(', ') || 'N/A'}. Details: ${profile?.experienceSummary || 'Experienced professional.'}`;
      const packet = await prepareApplication(job, userContext, user.uid);
      setActivePacket(packet);
      setActionState("ready");
    } catch (e) {
      console.error(e);
      setActionState("idle");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !user) return;

    setIsSearching(true);
    setSelectedJob(null);
    setActivePacket(null);
    setActionState("idle");
    setPreviewMode('none');
    try {
      const userContext = `Role: ${profile?.role}. Skills: ${profile?.skills?.join(', ') || 'N/A'}`;
      const results = await discoverAndMatchJobs(searchQuery, userContext);
      setJobs(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleApprove = async () => {
    if (!activePacket?.id) return;
    await approveAndSubmitApplication(activePacket.id);
    toast.success("Application submitted successfully!", {
      description: "You will be notified via email when the recruiter responds."
    });
    setJobs(jobs.filter(j => j.id !== selectedJob?.id));
    setSelectedJob(null);
    setActivePacket(null);
    setActionState("idle");
  };

  const handleReject = async () => {
    if (!activePacket?.id) return;
    await rejectApplication(activePacket.id);
    toast.error("Application rejected", {
      description: "It has been removed from your radar."
    });
    setSelectedJob(null);
    setActivePacket(null);
    setActionState("idle");
  };

  return (
    <div className="flex gap-4 h-full max-w-7xl mx-auto w-full">
      {/* Left List */}
      <div className="w-1/2 flex flex-col gap-4">
        <header className="h-auto shrink-0 glass rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold tracking-tight">Job Radar</h1>
              <span className="text-sm text-muted-foreground hidden lg:block">
                AI-Curated Market Opportunities
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowAlertsModal(true)} className="rounded-full relative">
                <Bell className="h-4 w-4" />
                {jobAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
              <div className="flex items-center gap-2 bg-background/50 border border-border/50 px-3 py-1.5 rounded-full pr-1.5">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">
                  Auto-Apply Agent
                </span>
                <button
                  onClick={() => setAutoApplyEnabled(!autoApplyEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${autoApplyEnabled ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                >
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow-sm ${autoApplyEnabled ? "left-[22px]" : "left-[3px]"}`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Remote Frontend React roles..."
              className="flex-1 h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Discover
            </Button>
          </form>
        </header>

        <div className="flex-1 overflow-auto rounded-2xl no-scrollbar flex flex-col gap-4 pb-4">
          {isSearching ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground opacity-70">
              <Radar className="h-10 w-10 animate-pulse mb-4 text-primary" />
              <p className="text-sm">
                Scanning major job boards (LinkedIn, Indeed, Glassdoor)...
              </p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <Card
                key={job.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${selectedJob?.id === job.id ? "border-primary ring-1 ring-primary/20" : ""}`}
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-primary">
                        <Building className="h-3.5 w-3.5" />{" "}
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center min-w-[50px] h-12 rounded-xl border border-primary/20 bg-primary/10">
                      <span className="text-[15px] font-black text-primary leading-none">
                        {job.matchScore}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">
                        Match
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" /> {job.salary}
                    </span>
                    <span className="flex items-center gap-1.5 ml-auto text-emerald-500">
                      {job.postedAt}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s: string) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-[10px] font-medium border border-border/50"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground border-dashed border-2 rounded-2xl opacity-50">
              <Search className="h-8 w-8 mb-2" />
              <p className="text-sm">
                No jobs found. Try adjusting your preferences.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="w-1/2 flex flex-col gap-4">
        {selectedJob ? (
          <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden shadow-xl border border-border/50">
            <div className="p-6 border-b border-border/50 bg-muted/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex justify-between items-start relative">
                <div>
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <div className="text-muted-foreground mt-1 text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" /> {selectedJob.company} •{" "}
                    {selectedJob.location}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden lg:flex"
                  disabled
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-2" /> View Posting
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto no-scrollbar space-y-6">
              {previewMode !== 'none' && activePacket ? (
                <div className="bg-background border rounded-xl overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center p-3 border-b bg-muted/30">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {previewMode === 'resume' ? 'Tailored Resume Diff' : 'Generated Cover Letter'}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewMode('none')}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 p-4 overflow-auto prose prose-invert prose-sm max-w-none">
                    <Markdown>{previewMode === 'resume' ? activePacket.tailoredResume : activePacket.coverLetter}</Markdown>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-primary mb-3">
                      <BrainCircuit className="h-4 w-4" /> Deep Match Reasoning
                    </h3>
                    <p className="text-sm text-primary/80 leading-relaxed mb-4">
                      {selectedJob.matchReason}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-background rounded-lg p-3 border shadow-sm flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                          Skills
                        </span>
                        <span className="font-bold text-lg text-emerald-500">
                          {selectedJob.matchScore}%
                        </span>
                      </div>
                      <div className="bg-background rounded-lg p-3 border shadow-sm flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                          Exp Fit
                        </span>
                        <span className="font-bold text-lg text-emerald-500">
                          {activePacket ? activePacket.fitScore + "%" : "-"}
                        </span>
                      </div>
                      <div className="bg-background rounded-lg p-3 border shadow-sm flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                          Location
                        </span>
                        <span className="font-bold text-lg text-amber-500">
                          {selectedJob.isRemote ? "100%" : "50%"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3">Copilot Strategy</h4>
                    {actionState === "idle" && (
                      <Button
                        onClick={() => handleDeepMatch(selectedJob)}
                        className="w-full h-12 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                          <SparklesIcon /> Generate Tailored Application Context
                        </span>
                      </Button>
                    )}
                    {actionState === "generating" && (
                      <Button
                        disabled
                        className="w-full h-12 bg-muted text-muted-foreground border-dashed border-2 pointer-events-none"
                      >
                        <span className="flex items-center gap-2 animate-pulse">
                          <BrainCircuit className="h-4 w-4 animate-spin" />{" "}
                          Rewriting Resume & Drafting Packet for {selectedJob.company}...
                        </span>
                      </Button>
                    )}
                    {actionState === "ready" && activePacket && (
                      <div className="space-y-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4">
                          <div className="h-10 w-10 shrink-0 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                              Application Prepared
                            </h5>
                            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                              Resume tailored. Cover letter drafted.
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="shadow-lg"
                              onClick={handleReject}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                              onClick={handleApprove}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" /> Approve & Apply
                            </Button>
                          </div>
                        </div>
                        <div 
                          className="bg-background rounded-lg border p-4 text-xs text-muted-foreground flex justify-between items-center cursor-pointer hover:bg-muted/50"
                          onClick={() => setPreviewMode('resume')}
                        >
                          <span>View Tailored Resume Diff</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                        <div 
                          className="bg-background rounded-lg border p-4 text-xs text-muted-foreground flex justify-between items-center cursor-pointer hover:bg-muted/50"
                          onClick={() => setPreviewMode('coverLetter')}
                        >
                          <span>Review Cover Letter</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 glass rounded-2xl flex flex-col items-center justify-center text-center p-12 opacity-50 border border-dashed">
            <Radar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Job Radar Active</h3>
            <p className="text-sm text-muted-foreground">
              Select a high-match opportunity to analyze your fit and draft a
              tailored application.
            </p>
          </div>
        )}
      </div>

      {showAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-background border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-muted/30">
              <h2 className="font-bold flex items-center gap-2"><BellRing className="h-5 w-5 text-primary" /> Job Alerts</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAlertsModal(false)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 space-y-6">
              <div>
                <h3 className="font-semibold text-sm mb-3">Your Active Alerts</h3>
                {jobAlerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg text-center border-dashed border">No alerts set up yet.</p>
                ) : (
                  <div className="space-y-3">
                    {jobAlerts.map(alert => (
                      <div key={alert.id} className="border p-3 rounded-xl flex items-center justify-between bg-muted/20">
                        <div>
                          <p className="font-bold text-sm">{alert.keywords}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex gap-2">
                            <span>{alert.location || 'Anywhere'}</span> • 
                            <span>{alert.remoteOnly ? 'Remote Only' : 'On-site/Hybrid OK'}</span> • 
                            <span className="capitalize">{alert.frequency}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            className={`w-10 h-5 rounded-full relative transition-colors ${alert.isActive ? "bg-primary" : "bg-muted-foreground/30"}`}
                            onClick={() => handleToggleAlert(alert)}
                          >
                            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow-sm ${alert.isActive ? "left-[22px]" : "left-[3px]"}`}></div>
                          </button>
                          <Button variant="ghost" size="icon" onClick={() => alert.id && handleRemoveAlert(alert.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-sm mb-3">Create New Alert</h3>
                <form onSubmit={handleCreateAlert} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Keywords / Role</label>
                    <input type="text" required placeholder="e.g. Senior React Developer" value={newAlertForm.keywords} onChange={e => setNewAlertForm({...newAlertForm, keywords: e.target.value})} className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                      <input type="text" placeholder="e.g. Mumbai, MH" value={newAlertForm.location} onChange={e => setNewAlertForm({...newAlertForm, location: e.target.value})} className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Min Salary</label>
                      <input type="text" placeholder="e.g. ₹12 LPA" value={newAlertForm.minSalary} onChange={e => setNewAlertForm({...newAlertForm, minSalary: e.target.value})} className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 py-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={newAlertForm.remoteOnly} onChange={e => setNewAlertForm({...newAlertForm, remoteOnly: e.target.checked})} className="rounded border-border text-primary focus:ring-primary" />
                      Remote Only
                    </label>
                    
                    <label className="flex items-center gap-2 text-sm cursor-pointer ml-auto">
                      <span className="text-muted-foreground">Frequency:</span>
                      <select value={newAlertForm.frequency} onChange={e => setNewAlertForm({...newAlertForm, frequency: e.target.value as any})} className="h-8 rounded border bg-background px-2 outline-none">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full"><Plus className="h-4 w-4 mr-2" /> Create Alert</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
