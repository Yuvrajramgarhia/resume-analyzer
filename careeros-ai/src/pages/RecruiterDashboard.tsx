import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Users2, Search, Building2, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";

export function RecruiterDashboard() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicResumes() {
      try {
        const q = query(
          collection(db, "resumes"),
          where("isPublic", "==", true),
          where("status", "==", "completed"),
          orderBy("updatedAt", "desc"),
          limit(50),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          parsed: JSON.parse(doc.data().parsedData || "{}"),
        }));
        // Sort by ATS score descending
        data.sort(
          (a: any, b: any) =>
            (b.parsed?.atsScore || 0) - (a.parsed?.atsScore || 0),
        );
        setCandidates(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadPublicResumes();
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full max-w-7xl mx-auto w-full">
      <header className="h-16 shrink-0 glass rounded-2xl px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Candidates HQ
          </h1>
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            Browse public candidates sorted by ATS match score.
          </span>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 p-12 text-center text-muted-foreground animate-pulse glass rounded-2xl flex items-center justify-center">
          Scanning database...
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex-1 glass rounded-2xl flex flex-col items-center justify-center py-16 text-center border-dashed">
          <Users2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-1">No public candidates yet</h3>
          <p className="text-sm text-muted-foreground">
            Candidates need to opt-in to make their profiles public.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-2xl no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
            {candidates.map((c) => (
              <Card
                key={c.id}
                className="flex flex-col hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {c.parsed?.extractedName || "Anonymous Candidate"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 mt-1 text-primary">
                        <Building2 className="h-3.5 w-3.5" /> {c.roleTarget}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-background border border-primary/20 shadow-sm min-w-14">
                      <span className="text-sm font-semibold text-primary">
                        {c.parsed?.atsScore || 0}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase leading-none mt-1">
                        Match
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Top Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5 line-clamp-3 overflow-hidden">
                      {c.parsed?.skills
                        ?.slice(0, 8)
                        .map((sk: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-[11px] font-medium border border-border/50"
                          >
                            {sk}
                          </span>
                        ))}
                      {c.parsed?.skills?.length > 8 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          +{c.parsed.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to={`/recruiter/candidate/${c.userId || c.uid || c.id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" /> View Full
                      Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
