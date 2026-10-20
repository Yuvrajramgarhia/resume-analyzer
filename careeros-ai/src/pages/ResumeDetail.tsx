import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  FileText,
  ArrowLeft,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Map,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function ResumeDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const d = await getDoc(doc(db, "resumes", id));
      if (d.exists()) {
        const fullData = d.data();
        if (fullData.parsedData) {
          fullData.parsedData = JSON.parse(fullData.parsedData);
        }
        setData({ id: d.id, ...fullData });
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const togglePublic = async () => {
    if (!data) return;
    const newStatus = !data.isPublic;
    try {
      await updateDoc(doc(db, "resumes", data.id), {
        isPublic: newStatus,
        updatedAt: Date.now(),
      });
      setData({ ...data, isPublic: newStatus });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8">Resume not found</div>;
  if (data.status === "processing")
    return <div className="p-8">Resume is still processing...</div>;
  if (data.status === "failed")
    return <div className="p-8 text-destructive">Failed to parse resume.</div>;

  const parsed = data.parsedData;
  const score = parsed?.atsScore || 0;

  // Chart data
  const chartData = [
    { name: "Matched", value: score, color: "hsl(var(--primary))" },
    { name: "Missing", value: 100 - score, color: "hsl(var(--muted))" },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <header className="h-16 shrink-0 glass rounded-2xl px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 w-8 p-0 rounded-full bg-background/20 hover:bg-background/40"
          >
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-muted-foreground hidden sm:inline-block">
            Analysis:
          </span>
          <span className="font-semibold truncate max-w-[150px] md:max-w-xs">
            {data.fileName}
          </span>
          <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 text-[10px] uppercase font-bold rounded">
            {data.roleTarget}
          </span>
        </div>
        <div className="flex gap-3 text-sm">
          <Button
            variant={data.isPublic ? "default" : "secondary"}
            onClick={togglePublic}
            size="sm"
            className="h-8"
          >
            <Globe className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">
              {data.isPublic ? "Public to Recruiters" : "Make Public"}
            </span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-2xl no-scrollbar pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Score Card */
          /* md:col-span-4 */}
          <Card className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 border-primary/20 bg-primary/5">
            <h3 className="text-muted-foreground text-sm mb-4">
              ATS Optimization Score
            </h3>
            <div className="h-40 w-full relative mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black">{score}</span>
                <span className="text-[10px] text-muted-foreground uppercase mt-1 px-2 py-0.5 rounded bg-background/50">
                  Match
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed px-4">
              {score >= 80
                ? "Your resume ranks excellently for this specific role profile."
                : score >= 60
                  ? "Good start, but missing some key requirements."
                  : "Significant gaps detected for this specific role."}
            </p>
          </Card>

          {/* Missing Keywords */
          /* md:col-span-8 */}
          <Card className="md:col-span-8 flex flex-col">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center justify-between flex-row">
                <span>Extracted Profile Data</span>
                <span className="text-primary">
                  {parsed.skills?.length || 0} Skills
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col gap-6">
              <div>
                <h4 className="text-[11px] font-bold text-destructive uppercase mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" /> Critical Missing
                  Keywords
                </h4>
                {parsed.missingKeywords?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {parsed.missingKeywords.map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-destructive/10 text-destructive border border-destructive/20 text-[11px] font-medium rounded"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4" /> No critical missing
                    keywords detected!
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase mb-3">
                  Verified Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {parsed.skills?.map((sk: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-secondary text-secondary-foreground border rounded text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Roadmap */
          /* md:col-span-12 */}
          <Card className="md:col-span-12">
            <CardHeader className="border-b border-border/50 bg-muted/10">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Map className="h-4 w-4 text-primary" /> Career Copilot Roadmap
              </CardTitle>
              <CardDescription>
                Generated projections for next 12-24 months
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-muted/20 p-4 rounded-xl border">
                  <h4 className="text-xs font-bold uppercase text-primary mb-3 flex items-center gap-2">
                    <Lightbulb className="h-3.5 w-3.5" /> Profile Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {parsed.careerRoadmap?.currentProfileAnalysis ||
                      "No analysis generated."}
                  </p>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-border/50 hidden md:block"></div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] font-bold text-muted-foreground uppercase mb-2">
                        Target Roles
                      </div>
                      <ul className="space-y-2">
                        {parsed.careerRoadmap?.nextCareerRoles?.map(
                          (r: string, i: number) => (
                            <li
                              key={i}
                              className="text-sm font-medium flex items-center gap-2 bg-background p-2 rounded border shadow-sm"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                              {r}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6 pl-0 md:pl-6">
                    <div>
                      <div className="text-[11px] font-bold text-emerald-500 uppercase mb-2">
                        Recommended Certs
                      </div>
                      <ul className="space-y-2">
                        {parsed.careerRoadmap?.recommendedCertifications?.map(
                          (c: string, i: number) => (
                            <li
                              key={i}
                              className="text-xs text-muted-foreground border-l-2 border-emerald-500/50 pl-3 py-1"
                            >
                              {c}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-500 uppercase mb-2">
                        Skills to Acquire
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {parsed.careerRoadmap?.recommendedSkillsToLearn?.map(
                          (s: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[11px] font-medium rounded"
                            >
                              {s}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formatting */}
          <Card className="md:col-span-12">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Content &
                Formatting Critique
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsed.grammarAndFormattingFeedback?.map(
                  (fb: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground p-4 bg-background border rounded-lg shadow-sm flex gap-3"
                    >
                      <span className="text-amber-500 font-serif text-lg leading-none shrink-0">
                        "
                      </span>
                      <span className="leading-relaxed">{fb}</span>
                    </li>
                  ),
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
