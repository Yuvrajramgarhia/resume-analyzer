import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CandidateOnboarding() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    roleTarget: "",
    industry: "",
    experienceLevel: "",
    salary: "",
    locationPreference: "remote",
    degree: "",
    college: "",
    gradYear: "",
    cgpa: "",
    skillsStr: "",
    experienceStr: "",
    resumeFile: null as File | null,
    github: "",
    linkedin: "",
    portfolio: ""
  });

  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (step < 8) {
       setStep(step + 1);
       if (step + 1 === 8) {
          setIsSubmitting(true);
          setTimeout(() => {
             setIsSubmitting(false);
             setIsFinished(true);
          }, 3000);
       }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    // Complete onboarding saves profile to Firebase and routes to Dashboard
    completeOnboarding({ ...formData, onboardingComplete: true });
  };

  const currentProgress = ((step - 1) / 7) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent -z-10" />

      <div className="p-6 flex justify-between items-center z-10 w-full max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase border border-primary/20">
          <BrainCircuit className="h-4 w-4" />
          <span>CareerOS AI</span>
        </div>
        <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
           Step {Math.min(step, 8)} of 8
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-6 mb-4 z-10">
         <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 0.5 }}
            />
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                    <h2 className="text-3xl font-black tracking-tight mb-2">Basic Info</h2>
                    <p className="text-muted-foreground mb-8">Let's build the foundation of your AI profile.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="E.g. Jane Doe" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-sm font-medium">Phone</label>
                           <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="+1 234 567 8900" />
                        </div>
                        <div>
                           <label className="text-sm font-medium">City / Country</label>
                           <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Mumbai, IN" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <Button size="lg" onClick={handleNext} disabled={!formData.name} className="font-bold">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Career Goals</h2>
                     <p className="text-muted-foreground mb-8">What are you aiming for next?</p>
                     <div className="space-y-4">
                       <div>
                         <label className="text-sm font-medium">Target Role</label>
                         <input value={formData.roleTarget} onChange={(e) => setFormData({ ...formData, roleTarget: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="e.g. Senior Frontend Engineer" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="text-sm font-medium">Experience Level</label>
                           <select value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                             <option value="">Select...</option>
                             <option value="fresher">Fresher</option>
                             <option value="1-3">1-3 years</option>
                             <option value="3-5">3-5 years</option>
                             <option value="5+">5+ years</option>
                           </select>
                         </div>
                         <div>
                           <label className="text-sm font-medium">Expected Salary</label>
                           <input value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="e.g. ₹12 LPA" />
                         </div>
                       </div>
                       <div>
                         <label className="text-sm font-medium">Work Style Preference</label>
                         <div className="grid grid-cols-3 gap-2 mt-1">
                           {["remote", "hybrid", "onsite"].map((t) => (
                             <button key={t} onClick={() => setFormData({ ...formData, locationPreference: t })} className={`h-10 rounded text-sm font-bold capitalize transition-all ${formData.locationPreference === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-primary/20"}`}>{t}</button>
                           ))}
                         </div>
                       </div>
                     </div>
                     <div className="mt-8 flex justify-between">
                        <Button variant="ghost" onClick={handleBack} className="font-bold"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Button size="lg" onClick={handleNext} disabled={!formData.roleTarget} className="font-bold">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Education</h2>
                     <p className="text-muted-foreground mb-8">Your academic background and certifications.</p>
                     <div className="space-y-4">
                       <div>
                         <label className="text-sm font-medium">Degree</label>
                         <input value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="e.g. B.S. Computer Science" />
                       </div>
                       <div>
                         <label className="text-sm font-medium">Institution/College</label>
                         <input value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="e.g. IIT Bombay" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="text-sm font-medium">Graduation Year</label>
                           <input value={formData.gradYear} onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="2024" />
                         </div>
                         <div>
                           <label className="text-sm font-medium">CGPA / Score</label>
                           <input value={formData.cgpa} onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="3.8/4.0" />
                         </div>
                       </div>
                     </div>
                     <div className="mt-8 flex justify-between">
                        <Button variant="ghost" onClick={handleBack} className="font-bold"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Button size="lg" onClick={handleNext} className="font-bold">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Skills & Tools</h2>
                     <p className="text-muted-foreground mb-8">What are your strongest abilities?</p>
                     <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Comma separated list (e.g. React, Python, Docker)</label>
                          <textarea 
                            value={formData.skillsStr} 
                            onChange={(e) => setFormData({ ...formData, skillsStr: e.target.value })} 
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                            placeholder="Enter your top skills..." 
                          />
                        </div>
                     </div>
                     <div className="mt-8 flex justify-between">
                        <Button variant="ghost" onClick={handleBack} className="font-bold"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Button size="lg" onClick={handleNext} disabled={!formData.skillsStr} className="font-bold">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

             {step === 5 && (
              <motion.div key="5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Experience Highlights</h2>
                     <p className="text-muted-foreground mb-8">Summarize your past work or major personal projects.</p>
                     <div className="space-y-4">
                        <div>
                          <textarea 
                            value={formData.experienceStr} 
                            onChange={(e) => setFormData({ ...formData, experienceStr: e.target.value })} 
                            className="flex min-h-[150px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                            placeholder="e.g. 2 years Software Engineer at Tech Corp. Built microservices..." 
                          />
                        </div>
                     </div>
                     <div className="mt-8 flex justify-between">
                        <Button variant="ghost" onClick={handleBack} className="font-bold"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Button size="lg" onClick={handleNext} className="font-bold">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

             {step === 6 && (
              <motion.div key="6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Socials & Vault</h2>
                     <p className="text-muted-foreground mb-8">Connect your online presence.</p>
                     <div className="space-y-4">
                        <div>
                           <label className="text-sm font-medium">LinkedIn URL</label>
                           <input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="https://linkedin.com/in/..." />
                        </div>
                        <div>
                           <label className="text-sm font-medium">GitHub URL</label>
                           <input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="https://github.com/..." />
                        </div>
                        <div>
                           <label className="text-sm font-medium">Portfolio URL</label>
                           <input value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="https://..." />
                        </div>
                        <div className="pt-4">
                           <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-primary/5">
                              <UploadCloud className="h-8 w-8 text-primary mb-2" />
                              <span className="text-sm font-bold">Upload Resume (PDF)</span>
                              <span className="text-xs text-muted-foreground mt-1">We will parse it to auto-complete your profile.</span>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 flex justify-between">
                        <Button variant="ghost" onClick={handleBack} className="font-bold"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Button size="lg" onClick={handleNext} className="font-bold">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

             {step === 7 && (
              <motion.div key="7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl text-center p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-4">Initial Assessment</h2>
                     <p className="text-muted-foreground mb-8">Before we initialize, let's gauge your current readiness. It takes 5 minutes.</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                       <div className="bg-background/50 border rounded-xl p-4">
                          <h4 className="font-bold">Aptitude</h4>
                          <p className="text-xs text-muted-foreground mt-1">10 quick logic questions.</p>
                          <Button variant="outline" size="sm" className="w-full mt-4">Start</Button>
                       </div>
                       <div className="bg-background/50 border rounded-xl p-4">
                          <h4 className="font-bold">Communication</h4>
                          <p className="text-xs text-muted-foreground mt-1">2 minute speaking sample.</p>
                          <Button variant="outline" size="sm" className="w-full mt-4">Start</Button>
                       </div>
                       <div className="bg-background/50 border rounded-xl p-4 opacity-50">
                          <h4 className="font-bold">Technical Focus</h4>
                          <p className="text-xs text-muted-foreground mt-1">Core language test.</p>
                          <span className="text-xs font-bold text-primary mt-4 block uppercase tracking-widest">Optional</span>
                       </div>
                     </div>

                     <div className="mt-8 flex justify-between">
                        <Button variant="ghost" onClick={handleBack} className="font-bold"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Button size="lg" onClick={handleNext} className="font-bold">Skip & Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                </Card>
              </motion.div>
            )}

            {step === 8 && (
              <motion.div key="8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl h-full flex flex-col justify-center items-center text-center p-12">
                  {isSubmitting ? (
                    <div className="flex flex-col items-center gap-6">
                      <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
                      <h2 className="text-2xl font-bold">Initializing Digital Twin...</h2>
                      <p className="text-muted-foreground text-sm max-w-sm">Generating your employability score, skill roadmap, and learning plan...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h2 className="text-3xl font-black tracking-tight">Ready for takeoff.</h2>
                      <p className="text-muted-foreground max-w-md">Your profile framework is set. Welcome to CareerOS.</p>
                      <Button size="lg" className="w-full mt-4 font-bold shadow-md" onClick={handleFinish}>
                        Enter Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

