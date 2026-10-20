import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Users,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RecruiterOnboarding() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    roleTitle: "",
    phoneNumber: "",
    companyName: "",
    industry: "",
    website: "",
    teamSize: "",
    hiringVolume: "",
    locations: "",
    hiringRoles: "",
    logoFile: null as File | null,
    docsFile: null as File | null,
  });

  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (step < 4) {
       setStep(step + 1);
       if (step + 1 === 4) {
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
    completeOnboarding({ ...formData, onboardingComplete: true });
  };

  const currentProgress = ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent -z-10" />

      <div className="p-6 flex justify-between items-center z-10 w-full max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold tracking-widest uppercase border border-blue-500/20">
          <Users className="h-4 w-4" />
          <span>CareerOS HR Suite</span>
        </div>
        <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
           Step {Math.min(step, 4)} of 4
        </div>
      </div>

       <div className="w-full max-w-4xl mx-auto px-6 mb-4 z-10">
         <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 0.5 }}
            />
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Personal Details</h2>
                     <p className="text-muted-foreground mb-8">Who is managing this workspace?</p>
                     <div className="space-y-4">
                       <div>
                         <label className="text-sm font-medium">Full Name</label>
                         <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="E.g. Sarah Smith" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="text-sm font-medium">Designation</label>
                           <input value={formData.roleTitle} onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="E.g. Technical Recruiter" />
                         </div>
                         <div>
                           <label className="text-sm font-medium">Phone Number</label>
                           <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="+1 234 567 8900" />
                         </div>
                       </div>
                     </div>
                     <div className="mt-8 flex justify-end">
                       <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold" onClick={handleNext} disabled={!formData.name || !formData.roleTitle} >Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Company Configuration</h2>
                     <p className="text-muted-foreground mb-8">Tell us about your organization.</p>
                     <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="text-sm font-medium">Company Name</label>
                           <input value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="E.g. Acme Corp" />
                         </div>
                         <div>
                           <label className="text-sm font-medium">Industry</label>
                           <input value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="E.g. Software / SaaS" />
                         </div>
                       </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-sm font-medium">Website</label>
                              <input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="https://acme.com" />
                           </div>
                           <div>
                              <label className="text-sm font-medium">Team Size</label>
                              <select value={formData.teamSize} onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                <option value="">Select...</option>
                                <option value="1-10">1-10</option>
                                <option value="11-50">11-50</option>
                                <option value="51-200">51-200</option>
                                <option value="200+">200+</option>
                              </select>
                           </div>
                        </div>
                        <div className="pt-2">
                           <div className="border border-dashed border-blue-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500/60 transition-colors cursor-pointer bg-blue-500/5">
                              <UploadCloud className="h-6 w-6 text-blue-500 mb-2" />
                              <span className="text-sm font-bold">Upload Company Logo</span>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 flex justify-between">
                       <Button variant="ghost" className="font-bold" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                       <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold" onClick={handleNext} disabled={!formData.companyName} >Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Hiring Pipeline</h2>
                     <p className="text-muted-foreground mb-8">What does your demand look like?</p>
                     <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="text-sm font-medium">Hiring Roles</label>
                           <input value={formData.hiringRoles} onChange={(e) => setFormData({ ...formData, hiringRoles: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="E.g. Engineering, Sales" />
                         </div>
                         <div>
                           <label className="text-sm font-medium">Hiring Volume / Year</label>
                           <input value={formData.hiringVolume} onChange={(e) => setFormData({ ...formData, hiringVolume: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="E.g. 50+" />
                         </div>
                       </div>
                       <div>
                         <label className="text-sm font-medium">Target Locations</label>
                         <input value={formData.locations} onChange={(e) => setFormData({ ...formData, locations: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="E.g. Remote, Bangalore, London" />
                       </div>
                        <div className="pt-2">
                           <div className="border border-dashed border-blue-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500/60 transition-colors cursor-pointer bg-blue-500/5">
                              <UploadCloud className="h-6 w-6 text-blue-500 mb-2" />
                              <span className="text-sm font-bold">Upload Verification Document (Business License)</span>
                              <span className="text-xs text-muted-foreground mt-1 text-center max-w-sm">Required for Premium and verified institution badges on candidate dashboards.</span>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 flex justify-between">
                       <Button variant="ghost" className="font-bold" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                       <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold" onClick={handleNext} disabled={!formData.hiringRoles} >Complete <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl h-full flex flex-col justify-center items-center text-center p-12">
                  {isSubmitting ? (
                    <div className="flex flex-col items-center gap-6">
                      <Users className="h-16 w-16 text-blue-500 animate-pulse" />
                      <h2 className="text-2xl font-bold">Provisioning Workspace...</h2>
                      <p className="text-muted-foreground text-sm max-w-sm">Setting up candidate ranking models and integrating campaign architectures.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h2 className="text-3xl font-black tracking-tight">Setup Complete.</h2>
                      <p className="text-muted-foreground max-w-md">Your HR Suite is ready. Let's start building your first AI-driven screening campaign.</p>
                      <Button size="lg" className="w-full mt-4 font-bold bg-blue-600 hover:bg-blue-700 shadow-md" onClick={handleFinish}>
                        Enter HR Intelligence <ChevronRight className="ml-2 h-4 w-4" />
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
