import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { 
  BadgeCheck, Save, Edit2, MapPin, Briefcase, DollarSign, 
  ExternalLink, FileText, CheckCircle2, TrendingUp, Award,
  Settings, Lock, Share2, Download, Eye, Activity, X, Copy, Check, Mail, Linkedin, Link2
} from "lucide-react";
import { toast } from "sonner";
import { db } from "../../lib/firebase";
import { query, collection, where, getDocs, orderBy, limit, doc, getDoc, setDoc } from "firebase/firestore";
import QRCode from "react-qr-code";

export function CandidateMyProfile() {
  const { user, profile, toggleVerificationAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    headline: "Backend Developer | Python | SQL | Docker",
    location: "Mumbai, MH",
    workType: "Remote / Hybrid",
    salary: "₹12 LPA",
    summary: "Passionate engineer with a focus on scalable systems.",
  });

  // Autosave when modal fields change
  useEffect(() => {
    if (isEditing && lastSaved) {
       // Optional: implement autosave here with a debouncer
    }
  }, [formData, isEditing]);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      // First try to load from candidate_profiles
      let profileData = {};
      const docRef = doc(db, "candidate_profiles", user!.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        profileData = docSnap.data();
        setFormData(prev => ({ ...prev, ...profileData }));
      }

      // Load latest resume for metrics and default values if profile is blank
      const q = query(collection(db, "resumes"), where("userId", "==", user!.uid), orderBy("updatedAt", "desc"), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        const parsed = data.parsedData ? JSON.parse(data.parsedData) : null;
        setResumeData(parsed);
        if (!docSnap.exists() && parsed?.personal_info?.name) {
          setFormData(prev => ({...prev, name: parsed.personal_info.name}));
        }
        if (!docSnap.exists() && parsed?.professional_summary) {
           setFormData(prev => ({...prev, summary: parsed.professional_summary}));
        }
      }
    }
    loadData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    setIsSaving(true);
    try {
      // Optimistic update done via state binding, save to DB
      await setDoc(doc(db, "candidate_profiles", user.uid), {
         ...formData,
         updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setLastSaved(new Date());
      setIsEditing(false);
      toast.success("Profile saved successfully");
    } catch (e) {
      toast.error("Failed to update profile. Please try again.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 w-full pb-10">
      {/* Header */}
      <header className="glass rounded-3xl p-8 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
            <div className="relative">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-foreground text-4xl font-bold shadow-lg shrink-0">
                {formData.name.charAt(0) || "U"}
              </div>
              {profile?.isVerified && (
                <div className="absolute bottom-0 right-0 bg-background rounded-full p-1 shadow-sm">
                  <div className="bg-emerald-500 text-white rounded-full p-1" title="Verified Candidate">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-3 w-full">
               {isEditing ? (
                 <div className="space-y-2 max-w-sm mx-auto md:mx-0">
                   <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="text-2xl font-bold" />
                   <Input value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} placeholder="Headline" />
                   <div className="flex gap-2">
                     <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Location" className="text-sm" />
                     <Input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="Expected Salary" className="text-sm" />
                   </div>
                 </div>
               ) : (
                 <>
                   <h1 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                     {formData.name || "Candidate Name"} 
                   </h1>
                   <p className="text-lg text-primary font-medium">{formData.headline}</p>
                   
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground font-medium">
                     <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {formData.location}</span>
                     <span className="flex items-center gap-1"><Briefcase className="h-4 w-4"/> {formData.workType}</span>
                     <span className="flex items-center gap-1"><DollarSign className="h-4 w-4"/> {formData.salary}</span>
                   </div>
                 </>
               )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
            <div className="bg-background/80 backdrop-blur border rounded-xl p-3 flex justify-between items-center shadow-sm">
               <span className="text-sm font-medium">Profile Completion</span>
               <span className="text-xl font-bold text-emerald-500">85%</span>
            </div>
            {lastSaved && (
              <span className="text-xs text-muted-foreground text-right block pr-1 -mt-2">
                Draft auto-saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <Button onClick={handleSave} className="flex-1 bg-primary" disabled={isSaving}>
                  <Save className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} /> 
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="flex-1">
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              )}
              <Button variant="secondary" className="flex-1" onClick={() => setShowShareModal(true)}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} rows={4} />
              ) : (
                <p className="text-foreground/90 leading-relaxed text-sm">
                  {formData.summary}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Resume Vault</span>
                <Button variant="outline" size="sm" className="h-8"><Download className="h-3 w-3 mr-2" /> Download Master</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-4 py-3 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest block mb-1">ATS Score</span>
                    <span className="text-3xl font-black">{resumeData?.atsScore || 78}</span>
                  </div>
                  <div className="bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 px-4 py-3 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest block mb-1">Versions</span>
                    <span className="text-3xl font-black">3</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Skills & Proficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {(resumeData?.skills || ["React", "TypeScript", "Node.js"]).map((skill: string, i: number) => {
                  const prof = Math.floor(Math.random() * 40) + 60;
                  return (
                  <div key={i} className="bg-background/40 border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold flex items-center gap-1">
                        {skill}
                        {prof > 80 && <span title="Verified"><CheckCircle2 className="h-3 w-3 text-emerald-500" /></span>}
                      </span>
                      <span className="text-xs text-muted-foreground">{prof}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${prof}%` }} />
                    </div>
                  </div>
                )})}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="glass-card border-emerald-500/20">
            <CardHeader className="bg-emerald-500/5 pb-4 border-b border-emerald-500/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" /> Career Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Recommended Role</span>
                <p className="font-medium text-sm mt-0.5">Senior Backend Engineer</p>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Employability Forecast</span>
                <span className="font-black text-emerald-500 text-lg">High</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> Learning & Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center gap-3 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  <Activity className="h-5 w-5 text-amber-500" /> 
                  <div>
                    <div className="font-bold text-sm">Learning Streak</div>
                    <div className="text-xs text-muted-foreground">12 Days Active</div>
                  </div>
               </div>
               <div className="flex justify-between items-center text-sm border-b pb-2">
                   <span className="text-muted-foreground font-medium">Jobs Applied</span>
                   <span className="font-black text-lg">24</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground font-medium">Interview Invites</span>
                   <span className="font-black text-lg text-blue-500">3</span>
               </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" /> Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <Button variant="ghost" className="w-full justify-start text-sm"><Lock className="mr-2 h-4 w-4" /> Privacy & Security</Button>
               <Button variant="ghost" className="w-full justify-start text-sm"><Eye className="mr-2 h-4 w-4" /> Profile Visibility</Button>
               <Button variant="ghost" className="w-full justify-start text-sm text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50" onClick={toggleVerificationAdmin}>
                 <BadgeCheck className="mr-2 h-4 w-4" /> 
                 {profile?.isVerified ? "Revoke Verification (Admin)" : "Verify Account (Admin)"}
               </Button>
               <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-colors border-primary/20 bg-primary/5 mt-4">
                 <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium">Subscription</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                       {profile?.tier || 'Free'}
                    </span>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="max-w-md w-full glass shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader className="flex flex-row justify-between items-center bg-background/50 border-b p-4">
              <CardTitle className="text-lg">Share Profile</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-inner w-48 h-48 flex items-center justify-center">
                <QRCode value={`${window.location.origin}/p/${user?.uid}`} size={160} />
              </div>
              <div className="w-full space-y-2">
                 <label className="text-sm font-medium">Public Link</label>
                 <div className="flex gap-2">
                   <div className="flex-1 bg-background/50 border rounded-xl px-3 py-2 text-sm text-muted-foreground flex items-center gap-2 overflow-hidden whitespace-nowrap">
                      <Link2 className="h-4 w-4 shrink-0" />
                      {`${window.location.origin}/p/${user?.uid}`}
                   </div>
                   <Button onClick={async () => {
                     await navigator.clipboard.writeText(`${window.location.origin}/p/${user?.uid}`);
                     toast.success("Link copied to clipboard!");
                   }} variant="secondary" className="px-3">
                     <Copy className="h-4 w-4" />
                   </Button>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                 <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open(`mailto:?subject=CareerOS Profile&body=Check out my profile: ${window.location.origin}/p/${user?.uid}`)}>
                   <Mail className="h-4 w-4" /> Email
                 </Button>
                 <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open(`https://linkedin.com/shareArticle?mini=true&url=${window.location.origin}/p/${user?.uid}`)}>
                   <Linkedin className="h-4 w-4" /> LinkedIn
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
