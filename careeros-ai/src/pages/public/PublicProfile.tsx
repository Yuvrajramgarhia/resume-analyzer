import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BadgeCheck, MapPin, Briefcase, DollarSign, ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";

export function PublicProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const docRef = doc(db, "candidate_profiles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        <div className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground space-y-4">
        <h1 className="text-2xl font-bold">Profile not found or is private</h1>
        <Link to="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar Minimal */}
      <nav className="h-16 border-b glass flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <div className="h-3 w-3 bg-white rounded-sm" />
          </div>
          Career<span className="text-muted-foreground">OS</span>
        </div>
        <Link to="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2"/> Main Platform
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto p-6 space-y-8 mt-4">
        <header className="glass rounded-3xl p-8 relative overflow-hidden shadow-xl border border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center relative z-10 w-full">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-foreground text-4xl font-bold shadow-lg shrink-0">
                  {profile.name?.charAt(0) || "U"}
                </div>
              {profile.isVerified && (
                <div className="absolute bottom-0 right-0 bg-background rounded-full p-1 shadow-sm">
                  <div className="bg-emerald-500 text-white rounded-full p-1" title="Verified Candidate">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                </div>
              )}
              </div>
              <div className="space-y-3">
                 <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                 <p className="text-lg text-muted-foreground">{profile.headline || "Professional"}</p>
                 <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {profile.location && (
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/> {profile.location}</span>
                    )}
                    {profile.workType && (
                      <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4"/> {profile.workType}</span>
                    )}
                    {profile.salary && (
                      <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4"/> {profile.salary}</span>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </header>

        {profile.summary && (
          <Card className="glass-card shadow-lg border-border/50">
             <CardHeader>
               <CardTitle className="text-xl">About Me</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="prose prose-invert max-w-none text-muted-foreground">
                  <Markdown>{profile.summary}</Markdown>
                </div>
             </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
