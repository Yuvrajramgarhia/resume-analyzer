import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, Mail, Download, Calendar, ExternalLink, 
  MapPin, DollarSign, Briefcase, Award, TrendingUp, 
  Video, FileText, CheckCircle2, ChevronRight, Activity, MessageSquare, Star
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getCandidateProfile } from "../lib/recruiterApi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCandidate() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getCandidateProfile(id);
        setProfile(data);
      } catch (err) {
        setError("Could not load candidate profile.");
      } finally {
        setLoading(false);
      }
    }
    loadCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10 px-4 animate-pulse">
        <div className="h-40 bg-muted/30 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="h-64 bg-muted/20 rounded-xl"></div>
             <div className="h-48 bg-muted/20 rounded-xl"></div>
             <div className="h-64 bg-muted/20 rounded-xl"></div>
          </div>
          <div className="space-y-6">
             <div className="h-48 bg-muted/20 rounded-xl"></div>
             <div className="h-48 bg-muted/20 rounded-xl"></div>
             <div className="h-32 bg-muted/20 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Candidate Not Found</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Header */}
      <header className="glass rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Candidates
        </Link>
        
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">{profile.fullName}</h1>
              <p className="text-lg text-primary font-medium">{profile.targetRole}</p>
              
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                 <div className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {profile.preferredLocation}</div>
                 <div className="flex items-center gap-1"><DollarSign className="h-4 w-4"/> {profile.salaryExpectation}</div>
                 <div className="flex items-center gap-1"><Briefcase className="h-4 w-4"/> {profile.workPreference}</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="bg-background/50 border rounded-xl p-3 flex justify-between items-center shadow-sm">
               <span className="text-sm font-medium">Employability</span>
               <span className="text-xl font-bold text-emerald-500">{profile.employabilityScore}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="bg-primary hover:bg-primary/90 flex-1" onClick={() => toast.success("Candidate Shortlisted!")}>
                <Star className="h-4 w-4 mr-1" /> Shortlist
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Message Drafted")}>
                <MessageSquare className="h-4 w-4 mr-1" /> Message
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
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Resume Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <p className="text-sm text-foreground/90 leading-relaxed italic border-l-2 border-primary/50 pl-3">
                    "{profile.resume.summary}"
                  </p>
               </div>
               <div className="flex gap-4">
                  <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-2 rounded-lg flex flex-col justify-center items-center">
                    <span className="text-xs uppercase font-bold tracking-wider">ATS Score</span>
                    <span className="text-2xl font-black">{profile.resume.atsScore}</span>
                  </div>
                  <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-2 rounded-lg flex flex-col justify-center items-center">
                    <span className="text-xs uppercase font-bold tracking-wider">Versions</span>
                    <span className="text-2xl font-black">{profile.resume.uploadedCount}</span>
                  </div>
                  <Button variant="outline" className="ml-auto mt-auto whitespace-nowrap">
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
               </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Skills & Proficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.skills.map((skill: any, i: number) => (
                  <div key={i} className="bg-background/40 border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm flex items-center gap-1">
                        {skill.name}
                        {skill.verified && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                      </span>
                      <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${skill.proficiency}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experience.length === 0 ? (
                <p className="text-sm text-muted-foreground">No experience details available.</p>
              ) : (
                profile.experience.map((exp: any, i: number) => (
                  <div key={i} className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-border last:before:hidden">
                    <div className="absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-background bg-primary"></div>
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="font-bold text-base">{exp.job_title}</h4>
                      <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">{exp.start_date} - {exp.end_date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 font-medium flex items-center gap-1">
                      <Building2Icon className="h-3.5 w-3.5" /> {exp.company}
                    </p>
                    <ul className="text-sm text-foreground/80 space-y-1.5 list-disc pl-4 marker:text-muted-foreground">
                      {Array.isArray(exp.responsibilities) 
                        ? exp.responsibilities.map((r: string, j: number) => <li key={j}>{r}</li>)
                        : <li>{exp.responsibilities}</li>
                      }
                    </ul>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.map((edu: any, i: number) => (
                <div key={i} className="border-l-2 border-primary/50 pl-4 py-1">
                  <h4 className="font-bold">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">{edu.college} • Class of {edu.year}</p>
                  {edu.cgpa && <p className="text-sm font-medium mt-1">CGPA: {edu.cgpa}</p>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Projects</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              {profile.projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects listed.</p>
              ) : (
                profile.projects.map((proj: any, i: number) => (
                  <div key={i} className="border bg-background/50 rounded-xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold mb-1 flex items-center gap-2">
                        {proj.name}
                        {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80"><ExternalLink className="h-3.5 w-3.5" /></a>}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies?.map((tech: string, j: number) => (
                          <span key={j} className="text-[10px] uppercase font-bold bg-secondary tracking-wider text-secondary-foreground px-2 py-0.5 rounded border">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Portfolio Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-background/50 border rounded-xl p-4 text-center">
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2">GitHub Activity Score</p>
                    <div className="text-3xl font-black text-emerald-500">{profile.portfolio.activityScore}/100</div>
                 </div>
                 <div className="bg-background/50 border rounded-xl p-4 text-center">
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2">Project Quality</p>
                    <div className="text-3xl font-black text-indigo-500">{profile.portfolio.qualityScore}/100</div>
                 </div>
                 <div className="bg-background/50 border rounded-xl p-4 text-center">
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2">Coding Consistency</p>
                    <div className="text-xl font-bold font-mono">{profile.portfolio.consistency}</div>
                 </div>
                 <div className="bg-background/50 border rounded-xl p-4 flex flex-col justify-center items-center gap-2">
                    <a href={profile.portfolio.gitHubUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1"><ExternalLink className="h-4 w-4" /> GitHub</a>
                    <a href={profile.portfolio.linkedInUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-500 hover:underline flex items-center gap-1"><ExternalLink className="h-4 w-4" /> LinkedIn</a>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="glass-card border-emerald-500/20">
            <CardHeader className="bg-emerald-500/5 pb-4 border-b border-emerald-500/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" /> Career Agent Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Recommended Role</span>
                <p className="font-medium text-sm mt-0.5">{profile.insights.recommendedRole}</p>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Hiring Probability</span>
                <span className="font-black text-emerald-500 text-lg">{(profile.insights.hiringProbability * 100).toFixed(0)}%</span>
              </div>
              <div className="border-t border-border pt-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2 block">Identified Weaknesses</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.insights.weaknesses.map((w: string, i: number) => (
                    <span key={i} className="text-xs bg-destructive/10 text-destructive border border-destructive/20 px-2 py-1 rounded-md">{w}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-500" /> AI Interview Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background border rounded-lg p-3 text-center">
                   <div className="text-2xl font-black text-indigo-500 mb-1">{profile.interviews.total}</div>
                   <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Mocks Taken</div>
                </div>
                <div className="bg-background border rounded-lg p-3 text-center">
                   <div className="text-2xl font-black text-emerald-500 mb-1">{profile.interviews.confidenceScore}</div>
                   <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Avg Confidence</div>
                </div>
                <div className="bg-background border rounded-lg p-3 text-center">
                   <div className="text-2xl font-black text-blue-500 mb-1">{profile.interviews.communicationScore}</div>
                   <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Communication</div>
                </div>
                <div className="bg-background border rounded-lg p-3 text-center">
                   <div className="text-2xl font-black text-amber-500 mb-1">{profile.interviews.eyeContactScore}</div>
                   <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Eye Contact</div>
                </div>
              </div>
              <div className="bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-lg text-sm mb-4">
                <p className="font-bold flex items-center justify-between mb-2">
                  <span>Readiness trend:</span> <span className="text-indigo-600 dark:text-indigo-400">{profile.interviews.readinessTrend}</span>
                </p>
                <div className="h-20 w-full mt-2">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={[{time:1, focus:90},{time:2, focus:95},{time:3, focus:92},{time:4, focus: 85}, {time: 5, focus: profile.interviews.eyeContactScore}]}>
                       <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px", fontSize: "12px" }} />
                       <Line type="monotone" dataKey="focus" stroke="#10b981" strokeWidth={2} dot={true} name="Gaze Consistency" />
                     </LineChart>
                   </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> Learning & Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-3 mb-4 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  <Activity className="h-5 w-5 text-amber-500" /> 
                  <div>
                    <div className="font-bold text-sm">Learning Streak</div>
                    <div className="text-xs text-muted-foreground">{profile.learning.streak} Days Active</div>
                  </div>
               </div>
               <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Completed Courses</h4>
               <ul className="space-y-2 text-sm font-medium">
                 {profile.learning.coursesCompleted.map((c: string, i: number) => (
                   <li key={i} className="flex gap-2 items-start"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span>{c}</span></li>
                 ))}
               </ul>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" /> Job Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                   <span className="text-muted-foreground font-medium">Applications</span>
                   <span className="font-black text-lg">{profile.jobActivity.applicationsApplied}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                   <span className="text-muted-foreground font-medium">Interview Invites</span>
                   <span className="font-black text-lg text-blue-500">{profile.jobActivity.invites}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground font-medium">Offers</span>
                   <span className="font-black text-lg text-emerald-500">{profile.jobActivity.offers}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-500/20">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold text-yellow-700 dark:text-yellow-500">Recruiter Notes</CardTitle>
             </CardHeader>
             <CardContent>
                <textarea 
                  className="w-full bg-background/50 border border-yellow-500/30 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 resize-none min-h-[100px]"
                  placeholder="Add your internal notes here..."
                  defaultValue={profile.notes}
                />
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

function Building2Icon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}
