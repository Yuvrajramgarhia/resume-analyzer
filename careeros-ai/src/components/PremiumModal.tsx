import React, { useState } from "react";
import { Button } from "./ui/button";
import { CheckCircle2, X, Zap, Shield, Star, Rocket, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "sonner";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { profile, user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (planName: string) => {
    if (!user) return;
    setSelectedPlan(planName);
    setIsProcessing(true);
    
    try {
      // Simulate Stripe/Razorpay checkout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const role = profile?.role || "candidate";
      const collectionName = role === "candidate" ? "candidate_profiles" 
                           : role === "recruiter" ? "recruiter_profiles" 
                           : "institution_profiles";
                           
      await setDoc(doc(db, collectionName, user.uid), {
        tier: planName.toLowerCase()
      }, { merge: true });

      // Also update the users collection so the Context / Layout picks it up
      await setDoc(doc(db, "users", user.uid), {
        tier: planName.toLowerCase()
      }, { merge: true });
      
      toast.success(`Successfully upgraded to ${planName}!`);
      window.location.reload(); // Reload to apply changes instantly
    } catch (e) {
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const getPlans = () => {
    switch (profile?.role) {
      case "recruiter":
        return [
          {
            name: "Basic",
            price: billingCycle === "yearly" ? 3999 : 4999,
            features: ["100 Candidate Searches/mo", "Basic Resume Parsing", "Standard Support"],
            recommended: false,
          },
          {
            name: "Pro",
            price: billingCycle === "yearly" ? 11999 : 14999,
            features: ["Unlimited Searches", "AI Ranking & Bias Detection", "Interview Campaigns", "Team Fit Prediction", "24/7 Priority Support"],
            recommended: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            features: ["ATS Integrations", "Team Seats", "White-label Portal", "SSO & Compliance", "Dedicated Account Manager"],
            recommended: false,
            actionText: "Contact Sales"
          }
        ];
      case "institution":
        return [
          {
            name: "Standard",
            price: billingCycle === "yearly" ? 24999 : 29999,
            features: ["Basic Placement Tracking", "Student Profiles", "Support Email"],
            recommended: false,
          },
          {
            name: "Pro",
            price: billingCycle === "yearly" ? 64999 : 79999,
            features: ["Placement Intelligence", "Bulk Mock Interviews", "Employability Analytics", "Recruiter Access Portal", "Branded Dashboards"],
            recommended: true,
          }
        ];
      default: // candidate
        return [
          {
            name: "Free",
            price: 0,
            features: ["Basic Resume Scans (3/mo)", "Mock Interviews (3/mo)", "Standard Career Agent", "Job Matches"],
            recommended: false,
            actionText: "Current Plan"
          },
          {
            name: "Pro",
            price: billingCycle === "yearly" ? 999 : 1499,
            features: ["Unlimited Resume Analysis", "Unlimited AI Interviews", "Eye Contact Intelligence", "Advanced Career Agent", "Auto Apply Agent", "Verified Badges"],
            recommended: true,
          },
          {
            name: "Elite",
            price: billingCycle === "yearly" ? 3999 : 4999,
            features: ["1:1 Mentor Sessions", "Recruiter Priority Matching", "Portfolio AI Scoring", "Startup Accelerator", "Exclusive Hiring Events"],
            recommended: false,
          }
        ];
    }
  };

  const plans = getPlans();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 z-50"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-black text-foreground tracking-tight mb-4">
              Unlock Your Full Potential
            </h2>
            <p className="text-lg text-muted-foreground">
              Upgrade to Pro and get access to our most advanced AI tools, tailored specifically for {profile?.role === 'recruiter' ? 'supercharging your hiring' : profile?.role === 'institution' ? 'transforming student placements' : 'accelerating your career'}.
            </p>
            
            <div className="flex items-center justify-center mt-8 gap-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-primary' : 'text-muted-foreground'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-7 rounded-full bg-muted border border-border relative transition-colors flex items-center"
              >
                <div className={`w-5 h-5 rounded-full bg-primary mx-1 transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`} />
              </button>
              <span className={`text-sm font-medium flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-primary' : 'text-muted-foreground'}`}>
                Yearly <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div 
                key={plan.name} 
                className={`rounded-3xl p-6 relative flex flex-col ${
                  plan.recommended 
                    ? 'bg-gradient-to-b from-primary/5 to-card border-2 border-primary shadow-xl transform md:-translate-y-4' 
                    : 'bg-card border border-border shadow-sm'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-4xl font-black text-foreground">₹{plan.price}</span>
                      <span className="text-muted-foreground text-sm">/mo</span>
                    </>
                  ) : (
                    <span className="text-4xl font-black text-foreground">{plan.price}</span>
                  )}
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-3">
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${plan.recommended ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => plan.actionText !== "Current Plan" && plan.actionText !== "Contact Sales" && handleUpgrade(plan.name)}
                  disabled={isProcessing || plan.actionText === "Current Plan"}
                  className={`w-full py-6 rounded-2xl font-bold text-base transition-all ${
                    plan.recommended 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md' 
                      : plan.actionText === "Current Plan"
                      ? 'bg-muted text-muted-foreground border border-border cursor-not-allowed'
                      : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                  }`}
                >
                  {isProcessing && selectedPlan === plan.name ? (
                     <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Processing...</>
                  ) : (
                    plan.actionText || 'Upgrade Now'
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          <p className="text-center text-muted-foreground text-xs mt-10">
            Secure payments via Razorpay & Stripe. Cancel anytime. 14-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
