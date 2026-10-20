import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  BarChart,
  Sparkles,
  BrainCircuit,
  X,
  Plus,
  History,
  Loader2
} from "lucide-react";
import { generateRejectionInsight } from "../lib/gemini";
import { getUserApplications, ApplicationPacket } from "../lib/autoApply";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "interviewing":
    case "interview":
    case "assessment":
      return "text-purple-500 bg-purple-500/10 border-purple-500/20";
    case "submitted":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "rejected":
      return "text-destructive bg-destructive/10 border-destructive/20";
    default:
      return "text-muted-foreground bg-muted border-border";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "interviewing":
    case "interview":
    case "assessment":
      return <Clock className="h-3 w-3 mr-1" />;
    case "submitted":
      return <Send className="h-3 w-3 mr-1" />;
    case "rejected":
      return <XCircle className="h-3 w-3 mr-1" />;
    default:
      return null;
  }
};

export function Applications() {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showHistoryApp, setShowHistoryApp] = useState<any>(null);
  const [insight, setInsight] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Submitted",
    date: new Date().toISOString().split("T")[0],
    nextAction: "",
    nextActionDue: "",
  });

  useEffect(() => {
    if (user) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;
    try {
      const packets = await getUserApplications(user.uid);
      const formattedApps = packets.map(p => ({
        id: p.id,
        company: p.jobSnapshot.company,
        role: p.jobSnapshot.title,
        status: p.status === 'awaiting_approval' ? 'Draft' : (p.status.charAt(0).toUpperCase() + p.status.slice(1)),
        date: p.createdAt ? new Date(p.createdAt.seconds * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        nextAction: p.status === 'awaiting_approval' ? 'Approve Application' : 'Wait for response',
        nextActionDue: p.status === 'awaiting_approval' ? 'Action Needed' : null,
        history: [
          { status: 'Prepared', timestamp: p.createdAt ? new Date(p.createdAt.seconds * 1000).toISOString() : new Date().toISOString(), updatedBy: 'System' },
          ...(p.status === 'submitted' ? [{ status: 'Submitted', timestamp: p.updatedAt ? new Date(p.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(), updatedBy: 'System' }] : [])
        ]
      }));
      setApps(formattedApps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInsight = async (app: any) => {
    setSelectedApp(app);
    if (!insight || insight.appId !== app.id) {
      setIsGenerating(true);
      setInsight(null);
      try {
        const data = await generateRejectionInsight(app.company, app.role);
        setInsight({ appId: app.id, ...data });
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const db = (await import('../lib/firebase')).db;
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      await addDoc(collection(db, 'applications'), {
        userId: user.uid,
        jobId: 'manual',
        jobSnapshot: {
          company: formData.company,
          title: formData.role,
        },
        status: formData.status.toLowerCase(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setShowAddForm(false);
      setFormData({
        company: "",
        role: "",
        status: "Submitted",
        date: new Date().toISOString().split("T")[0],
        nextAction: "",
        nextActionDue: "",
      });
      loadApplications();
      
      const { toast } = await import('sonner');
      toast.success("Application logged manually");
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full max-w-6xl mx-auto w-full relative overflow-hidden">
      <header className="h-16 shrink-0 glass rounded-2xl px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" /> Applications
          </h1>
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            Track and manage your automated submissions.
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="hidden border-border/50 bg-background md:flex"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Manual Entry
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-primary/20 text-primary hover:bg-primary/30 border-0"
          >
            <BarChart className="h-4 w-4 mr-2" /> View Analytics
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-2xl no-scrollbar flex flex-col gap-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2">
          <Card className="glass shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <div className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-widest text-[10px]">
                Active
              </div>
              <div className="text-2xl font-black">{apps.length}</div>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm border-blue-500/20">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <div className="text-sm text-blue-500 font-medium mb-1 uppercase tracking-widest text-[10px]">
                Submitted
              </div>
              <div className="text-2xl font-black text-blue-500">
                {apps.filter((a) => a.status === "Submitted").length}
              </div>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm border-purple-500/20">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <div className="text-sm text-purple-500 font-medium mb-1 uppercase tracking-widest text-[10px]">
                Interviews
              </div>
              <div className="text-2xl font-black text-purple-500">
                {apps.filter((a) => a.status === "Interviewing").length}
              </div>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm border-destructive/20">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <div className="text-sm text-destructive font-medium mb-1 uppercase tracking-widest text-[10px]">
                Rejected
              </div>
              <div className="text-2xl font-black text-destructive">
                {apps.filter((a) => a.status === "Rejected").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="flex flex-col gap-3">
          {apps.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground border-dashed border-2 rounded-2xl opacity-50 bg-background/50">
               <Send className="h-8 w-8 mb-2" />
               <p className="text-sm">No applications found. Use Job Radar to auto-apply, or add one manually.</p>
            </div>
          ) : (
            apps.map((app) => (
              <Card
                key={app.id}
                className="glass hover:bg-muted/5 transition-colors border-border/50"
              >
              <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex gap-4 items-center min-w-0 flex-1">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border/60 shadow-sm">
                    <Building className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate pl-1 flex items-center gap-2">
                      {app.company}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center ${getStatusColor(app.status)}`}
                      >
                        {getStatusIcon(app.status)} {app.status}
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground truncate pl-1 mt-0.5">
                      {app.role}
                    </p>
                  </div>
                </div>

                {/* Actions / Info */}
                <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-8 bg-background md:bg-transparent p-3 md:p-0 rounded-lg border md:border-0 border-border/50">
                  <div className="text-xs">
                    <div className="text-muted-foreground uppercase tracking-widest text-[9px] font-bold mb-1">
                      Applied On
                    </div>
                    <div className="font-medium">{app.date}</div>
                  </div>

                  <div className="text-xs max-w-[150px] truncate">
                    <div className="text-muted-foreground uppercase tracking-widest text-[9px] font-bold mb-1">
                      Next Action
                    </div>
                    <div className="font-medium flex items-center gap-1.5 truncate">
                      <span
                        className={`truncate ${app.status === "Rejected" ? "text-amber-500" : "text-foreground"}`}
                      >
                        {app.nextAction || "-"}
                      </span>
                    </div>
                  </div>

                  {app.status === "Rejected" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-amber-500 border-amber-500/20 hover:bg-amber-500/10 hidden md:flex"
                      onClick={() => handleViewInsight(app)}
                    >
                      <Sparkles className="h-4 w-4 mr-2" /> AI Insight
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground hover:bg-secondary hidden md:flex"
                      onClick={() => setShowHistoryApp(app)}
                    >
                      <History className="h-4 w-4 mr-2" /> History
                    </Button>
                  )}
                  {app.status === "Rejected" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground hover:bg-secondary hidden md:flex ml-2"
                      onClick={() => setShowHistoryApp(app)}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
        </div>
      </div>

      {/* Side Panel for Status History */}
      <AnimatePresence>
        {showHistoryApp && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-20 right-0 bottom-4 w-[400px] glass border border-border/50 shadow-2xl rounded-2xl flex flex-col z-20 overflow-hidden"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Status History</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setShowHistoryApp(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="font-bold text-lg">{showHistoryApp.role}</div>
                <div className="text-sm text-muted-foreground">
                  at {showHistoryApp.company}
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                {showHistoryApp.history && showHistoryApp.history.length > 0 ? (
                  showHistoryApp.history.map((record: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-start relative before:absolute before:left-[11px] before:top-6 before:bottom-[-20px] before:w-[2px] before:bg-border last:before:hidden"
                    >
                      <div
                        className={`h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold border z-10 ${getStatusColor(record.status)}`}
                      >
                        {getStatusIcon(record.status)}
                      </div>
                      <div className="bg-background/50 border border-border/50 rounded-lg p-3 flex-1 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="font-bold text-sm">{record.status}</h5>
                          <span className="text-xs text-muted-foreground">
                            {new Date(record.timestamp).toLocaleDateString()}{" "}
                            {new Date(record.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Updated by:{" "}
                          <span className="font-medium text-foreground">
                            {record.updatedBy || "System"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No history recorded for this application.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Panel for AI Insights */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-20 right-0 bottom-4 w-[400px] glass border border-border/50 shadow-2xl rounded-2xl flex flex-col z-20 overflow-hidden"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Rejection Insight</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setSelectedApp(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Analyzing
                </div>
                <div className="font-bold text-lg">{selectedApp.role}</div>
                <div className="text-sm text-muted-foreground">
                  at {selectedApp.company}
                </div>
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-muted-foreground">
                  <BrainCircuit className="h-8 w-8 animate-pulse text-primary" />
                  <p className="text-sm font-medium animate-pulse">
                    Running post-mortem analysis...
                  </p>
                </div>
              ) : insight ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-6"
                >
                  {/* Summary */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-primary/90 leading-relaxed font-medium">
                    {insight.summary}
                  </div>

                  {/* Probable Reasons */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Probable Causes
                    </h4>
                    <div className="flex flex-col gap-3">
                      {insight.probableReasons?.map(
                        (reason: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-destructive/5 border border-destructive/20 rounded-lg p-3"
                          >
                            <h5 className="font-bold text-destructive text-sm mb-1">
                              {reason.title}
                            </h5>
                            <p className="text-xs text-destructive/80 leading-relaxed">
                              {reason.description}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Action Plan */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Corrective Action Plan
                    </h4>
                    <div className="flex flex-col gap-3">
                      {insight.actionPlan?.map((action: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-start relative before:absolute before:left-[11px] before:top-6 before:bottom-[-12px] before:w-[2px] before:bg-border last:before:hidden"
                        >
                          <div className="h-6 w-6 shrink-0 bg-secondary rounded-full flex items-center justify-center text-[10px] font-bold border border-border/50 z-10">
                            {idx + 1}
                          </div>
                          <div className="bg-background border border-border/50 rounded-lg p-3 flex-1">
                            <h5 className="font-bold text-sm mb-1">
                              {action.step}
                            </h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {action.details}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-2 font-bold group">
                    <Sparkles className="h-4 w-4 mr-2" /> Start Corrective Run
                  </Button>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-destructive">
                  <XCircle className="h-8 w-8" />
                  <p className="text-sm font-medium">
                    Failed to generate insights.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Application Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card glass shadow-2xl rounded-2xl border border-border/50 w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
                <h2 className="font-bold text-lg">Add Manual Application</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form
                onSubmit={handleAddSubmit}
                className="p-6 flex flex-col gap-4"
              >
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <input
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Role</label>
                  <input
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Offer">Offer</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Date Applied</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Next Action</label>
                    <input
                      value={formData.nextAction}
                      onChange={(e) =>
                        setFormData({ ...formData, nextAction: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="e.g. Follow up"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <input
                      type="date"
                      value={formData.nextActionDue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nextActionDue: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border/50">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Application</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
