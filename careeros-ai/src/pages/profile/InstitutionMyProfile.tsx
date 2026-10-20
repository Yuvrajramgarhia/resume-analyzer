import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BadgeCheck, Save, Edit2, Users, Building, Activity, GraduationCap, Trophy, BarChart3, Presentation, Link as LinkIcon, Download } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function InstitutionMyProfile() {
  const { profile, user, toggleVerificationAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    name: profile?.name || "Global Tech University",
    location: "Boston, MA",
    departments: "Computer Science, Data Science, Engineering",
  });

  useEffect(() => {
    if (!user) return;
    async function loadProfile() {
      const docRef = doc(db, "institution_profiles", user!.uid);
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
      await setDoc(doc(db, "institution_profiles", user.uid), {
         ...formData,
         updatedAt: new Date().toISOString()
      }, { merge: true });
      setLastSaved(new Date());
      setIsEditing(false);
      toast.success("Institution profile saved securely");
    } catch (e) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 w-full">
      <div className="glass rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 pointer-events-none" />
        
        <div className="relative">
          <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-4xl text-foreground font-bold shadow-lg shrink-0">
            <Building className="h-12 w-12" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-sm">
            {profile?.isVerified && (
              <div className="bg-amber-500 text-white rounded-full p-1.5" title="Verified Partner">
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
                    className="text-2xl font-bold bg-background/50"
                  />
                  <Input 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-black tracking-tight">{formData.name}</h1>
                  <p className="text-xl text-muted-foreground font-medium mt-1">{formData.location}</p>
                </>
              )}
              
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                 <span className="bg-background/80 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider text-muted-foreground">Placement Rating: 94%</span>
                 <span className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-xs font-bold uppercase tracking-wider text-emerald-600">Active Partner</span>
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
                  <Button onClick={handleSave} className="bg-emerald-600 shadow-lg shadow-emerald-500/20" disabled={isSaving}>
                    <Save className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} /> 
                    {isSaving ? "Saving..." : "Save"}
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="md:col-span-3 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="glass border border-emerald-500/20 rounded-2xl p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                    <p className="text-3xl font-black">1.2K</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Active Students</p>
                 </div>
                 <div className="glass border border-blue-500/20 rounded-2xl p-4 text-center">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-3xl font-black">88/100</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Avg Employability</p>
                 </div>
                 <div className="glass border border-purple-500/20 rounded-2xl p-4 text-center">
                    <Trophy className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-3xl font-black">450</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Placements YTD</p>
                 </div>
                 <div className="glass border border-amber-500/20 rounded-2xl p-4 text-center">
                    <Building className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                    <p className="text-3xl font-black">42</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Recruiter Partners</p>
                 </div>
            </div>

            <Card className="glass-card">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Placement Analytics & Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex flex-col gap-3">
                   <div className="bg-background/50 border rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm">Course Completion Rate</h4>
                        <p className="text-xs text-muted-foreground">Students completing assigned curriculum</p>
                      </div>
                      <span className="text-xl font-black text-emerald-500">92%</span>
                   </div>
                   <div className="bg-background/50 border rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm">Mock Interview Success</h4>
                        <p className="text-xs text-muted-foreground">Average technical interview score</p>
                      </div>
                      <span className="text-xl font-black text-indigo-500">76%</span>
                   </div>
                 </div>
                 <Button variant="outline" className="w-full mt-2"><Download className="h-4 w-4 mr-2" /> Download Yearly Placement Report</Button>
              </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                 <CardTitle className="text-md">Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                 <Button variant="ghost" className="w-full justify-start text-sm"><Presentation className="h-4 w-4 mr-2" /> Placement Drives</Button>
                 <Button variant="ghost" className="w-full justify-start text-sm"><GraduationCap className="h-4 w-4 mr-2" /> Top Performers</Button>
                 <Button variant="ghost" className="w-full justify-start text-sm"><LinkIcon className="h-4 w-4 mr-2" /> Company Invites</Button>
                 <Button variant="ghost" className="w-full justify-start text-sm text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50" onClick={toggleVerificationAdmin}>
                   <BadgeCheck className="mr-2 h-4 w-4" /> 
                   {profile?.isVerified ? "Revoke Verification (Admin)" : "Verify Account (Admin)"}
                 </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card bg-emerald-500/5 border-emerald-500/20">
               <CardContent className="p-4 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                 Your institution currently ranks in the Top 5% for AI & Data Science placements this season. Maintain the streak!
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
