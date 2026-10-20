import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Building,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstitutionOnboarding() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    instituteName: "",
    logoFile: null as File | null,
    departments: "",
    studentCount: "",
    placementOfficerName: "",
    placementOfficerEmail: "",
    companyPartnerships: "",
    placementGoals: "",
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
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-emerald-500/10 to-transparent -z-10" />

      <div className="p-6 flex justify-between items-center z-10 w-full max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold tracking-widest uppercase border border-emerald-500/20">
          <Building className="h-4 w-4" />
          <span>CareerOS Institutional</span>
        </div>
        <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
           Step {Math.min(step, 4)} of 4
        </div>
      </div>

       <div className="w-full max-w-4xl mx-auto px-6 mb-4 z-10">
         <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
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
                     <h2 className="text-3xl font-black tracking-tight mb-2">Institution Details</h2>
                     <p className="text-muted-foreground mb-8">Set up your university or bootcamp domain.</p>
                     <div className="space-y-4">
                       <div>
                         <label className="text-sm font-medium">Institution Name</label>
                         <input value={formData.instituteName} onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" placeholder="E.g. IIT Delhi" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="text-sm font-medium">Estimated Batch Size</label>
                           <select value={formData.studentCount} onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                             <option value="">Select...</option>
                             <option value="small">Less than 500</option>
                             <option value="medium">500 - 2,000</option>
                             <option value="large">2,000+</option>
                           </select>
                         </div>
                         <div>
                           <label className="text-sm font-medium">Departments/Faculties</label>
                           <input value={formData.departments} onChange={(e) => setFormData({ ...formData, departments: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" placeholder="E.g. Computer Science, Business" />
                         </div>
                       </div>
                        <div className="pt-2">
                           <div className="border border-dashed border-emerald-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-emerald-500/60 transition-colors cursor-pointer bg-emerald-500/5">
                              <UploadCloud className="h-6 w-6 text-emerald-500 mb-2" />
                              <span className="text-sm font-bold">Upload Institution Logo</span>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 flex justify-end">
                       <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={handleNext} disabled={!formData.instituteName} >Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Placement Officer Info</h2>
                     <p className="text-muted-foreground mb-8">Who is managing student outcomes?</p>
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-sm font-medium">Officer Full Name</label>
                              <input value={formData.placementOfficerName} onChange={(e) => setFormData({ ...formData, placementOfficerName: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" placeholder="E.g. John Doe" />
                           </div>
                           <div>
                              <label className="text-sm font-medium">Official Contact Email</label>
                              <input type="email" value={formData.placementOfficerEmail} onChange={(e) => setFormData({ ...formData, placementOfficerEmail: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" placeholder="john@university.edu" />
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 flex justify-between">
                       <Button variant="ghost" className="font-bold" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                       <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={handleNext} disabled={!formData.placementOfficerName} >Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="glass border-border/50 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                     <h2 className="text-3xl font-black tracking-tight mb-2">Placement Strategy</h2>
                     <p className="text-muted-foreground mb-8">Map out your institutional targets.</p>
                     <div className="space-y-4">
                       <div>
                         <label className="text-sm font-medium">Top Company Partnerships</label>
                         <input value={formData.companyPartnerships} onChange={(e) => setFormData({ ...formData, companyPartnerships: e.target.value })} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" placeholder="E.g. Google, Microsoft, Accenture" />
                       </div>
                       <div>
                         <label className="text-sm font-medium">Yearly Placement Goals</label>
                         <textarea value={formData.placementGoals} onChange={(e) => setFormData({ ...formData, placementGoals: e.target.value })} className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" placeholder="E.g. Achieve 90%+ placement rate for computer science graduates." />
                       </div>
                     </div>
                     <div className="mt-8 flex justify-between">
                       <Button variant="ghost" className="font-bold" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                       <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={handleNext} disabled={!formData.companyPartnerships} >Complete <ChevronRight className="ml-2 h-4 w-4" /></Button>
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
                      <Building className="h-16 w-16 text-emerald-500 animate-pulse" />
                      <h2 className="text-2xl font-bold">Creating Placement Hub...</h2>
                      <p className="text-muted-foreground text-sm max-w-sm">Generating enterprise APIs to sync student portfolios and mock interview batch analytics.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h2 className="text-3xl font-black tracking-tight">Hub Confirmed.</h2>
                      <p className="text-muted-foreground max-w-md">You are ready to invite students and track their structural readiness for placements.</p>
                      <Button size="lg" className="w-full mt-4 font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md" onClick={handleFinish}>
                        Enter Placement Dashboard <ChevronRight className="ml-2 h-4 w-4" />
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
