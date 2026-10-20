import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BadgeCheck, Save, Edit2, Shield, Settings, Activity, Building, Users, Star, BarChart, Bell, Zap, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function RecruiterMyProfile() {
  const { profile, user, toggleVerificationAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    name: profile?.name || "John Doe",
    designation: "Senior Technical Recruiter",
    company: "TechNova Solutions",
    location: "Bangalore, IN",
    domain: "Software Engineering & AI",
  });

  useEffect(() => {
    if (!user) return;
    async function loadProfile() {
      const docRef = doc(db, "recruiter_profiles", user!.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(prev => ({ ...prev, ...docSnap.data() }));
      }
    }
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    setIsSaving(true);
    try {
      await setDoc(doc(db, "recruiter_profiles", user.uid), {
         ...formData,
         updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setLastSaved(new Date());
      setIsEditing(false);
      toast.success("Profile saved successfully");
    } catch (e) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 w-full">
      {/* Header */}
      <div className="glass rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
        
        <div className="relative">
          <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl text-foreground font-bold shadow-lg shrink-0">
            {formData.name.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-sm">
            {profile?.isVerified && (
              <div className="bg-emerald-500 text-white rounded-full p-1.5" title="Verified Recruiter">
                <BadgeCheck className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left z-10 w-full space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4">
            <div>
              {isEditing ? (
                <div className="space-y-2 max-w-sm">
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="Full Name"
                    className="text-2xl font-bold bg-background/50"
                  />
                  <Input 
                    value={formData.designation} 
                    onChange={e => setFormData({...formData, designation: e.target.value})} 
                    placeholder="Designation"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-black tracking-tight">{formData.name}</h1>
                  <p className="text-xl text-primary font-medium mt-1">{formData.designation}</p>
                </>
              )}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1 bg-background/50 px-3 py-1 rounded-full border">
                  <Building className="h-4 w-4 text-indigo-500" /> {formData.company}
                </span>
                <span className="flex items-center gap-1 bg-background/50 px-3 py-1 rounded-full border">
                  <MapPin className="h-4 w-4" /> {formData.location}
                </span>
                <span className="flex items-center gap-1 bg-background/50 px-3 py-1 rounded-full border">
                   <Star className="h-4 w-4 text-amber-500" /> Hiring Domain: {formData.domain}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
              {lastSaved && (
                <span className="text-xs text-muted-foreground mr-1">
                  Saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <div className="flex gap-2">
                {isEditing ? (
                  <Button onClick={handleSave} className="bg-primary shadow-lg shadow-primary/20" disabled={isSaving}>
                    <Save className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} /> 
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="shadow-sm">
                    <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg flex items-center gap-2 text-primary"><Activity className="h-5 w-5" /> Hiring Pipeline Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-background border rounded-2xl p-4 text-center hover:border-primary/50 transition-colors">
                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2">Open Roles</p>
                    <p className="text-3xl font-black text-foreground">12</p>
                 </div>
                 <div className="bg-background border rounded-2xl p-4 text-center hover:border-primary/50 transition-colors">
                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2">Shortlisted</p>
                    <p className="text-3xl font-black text-indigo-500">45</p>
                 </div>
                 <div className="bg-background border rounded-2xl p-4 text-center hover:border-primary/50 transition-colors">
                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2">Interviews</p>
                    <p className="text-3xl font-black text-amber-500">89</p>
                 </div>
                 <div className="bg-background border rounded-2xl p-4 text-center hover:border-primary/50 transition-colors">
                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2">Hires</p>
                    <p className="text-3xl font-black text-emerald-500">24</p>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BarChart className="h-5 w-5" /> Efficiency Analytics</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                     <span className="font-medium text-sm">Time to Hire (Average)</span>
                     <span className="font-bold text-lg text-emerald-500">18 Days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                     <span className="font-medium text-sm">Offer Acceptance Rate</span>
                     <span className="font-bold text-lg text-indigo-500">82%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                     <span className="font-medium text-sm">Recruiter Credibility Score</span>
                     <span className="font-bold text-lg flex items-center gap-1 text-amber-500">4.8 <Star className="h-4 w-4 fill-amber-500" /></span>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5" /> Workspace Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <Button variant="ghost" className="w-full justify-start font-medium"><Shield className="h-4 w-4 mr-2 text-muted-foreground" /> Security & Privacy</Button>
               <Button variant="ghost" className="w-full justify-start font-medium"><Bell className="h-4 w-4 mr-2 text-muted-foreground" /> Notifications</Button>
               <Button variant="ghost" className="w-full justify-start font-medium"><Users className="h-4 w-4 mr-2 text-muted-foreground" /> Team Members</Button>
               <Button variant="ghost" className="w-full justify-start text-sm text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50" onClick={toggleVerificationAdmin}>
                 <BadgeCheck className="mr-2 h-4 w-4" /> 
                 {profile?.isVerified ? "Revoke Verification (Admin)" : "Verify Account (Admin)"}
               </Button>
               <Button variant="ghost" className="w-full justify-start font-medium"><Zap className="h-4 w-4 mr-2 text-amber-500" /> Billing & Subscription</Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-indigo-500/20 bg-indigo-500/5">
            <CardHeader>
               <CardTitle className="text-sm font-bold text-indigo-500">Pro Tip</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-foreground/80 leading-relaxed font-medium">Update your active hiring status to "Actively Sourcing" to appear in more candidate recommendations.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
