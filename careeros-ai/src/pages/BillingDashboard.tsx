import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CreditCard, CheckCircle2, AlertCircle, Clock, FileText, Download } from "lucide-react";
import { PremiumModal } from "../components/PremiumModal";

export function BillingDashboard() {
  const { profile } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [invoices, setInvoices] = useState([
    { id: "INV-2026-001", date: "2026-01-01", amount: "$12.00", status: "Paid" },
    { id: "INV-2025-012", date: "2025-12-01", amount: "$12.00", status: "Paid" },
  ]);

  const userTier = profile?.tier || "free";
  const isPremium = userTier !== "free" && userTier !== "basic" && userTier !== "standard";

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <header className="glass rounded-3xl p-8 relative overflow-hidden shadow-xl border border-border/50">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
         <div className="relative z-10">
           <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
             Billing & Subscription
           </h1>
           <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
             Manage your billing details, view past invoices, and upgrade your plan.
           </p>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Plan Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="glass shadow-xl border-border/50 relative overflow-hidden">
            {isPremium && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-amber-400"></div>
            )}
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Current Plan</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  {userTier}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black mb-1 capitalize">{userTier} Plan</h2>
                  {isPremium ? (
                    <p className="text-muted-foreground text-sm">Your subscription renews on Jan 1, 2027</p>
                  ) : (
                    <p className="text-muted-foreground text-sm">Upgrade for unlimited features.</p>
                  )}
                </div>
                <div className="flex gap-3">
                  {isPremium ? (
                    <>
                      <Button variant="outline">Manage Plan</Button>
                      <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20">Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => setShowPremiumModal(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0">
                       Upgrade to Pro
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/50 pt-6">
                <div>
                   <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 font-mono">Usage</h4>
                   <div className="flex items-center gap-2 font-medium">
                     <AlertCircle className="h-4 w-4 text-amber-500" />
                     {isPremium ? "Unlimited" : "3 / 3 Free Sessions"}
                   </div>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 font-mono">Status</h4>
                   <div className="flex items-center gap-2 font-medium">
                     <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Active
                   </div>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 font-mono">Billing</h4>
                   <div className="flex items-center gap-2 font-medium">
                     <Clock className="h-4 w-4 text-blue-500" /> {isPremium ? "Yearly" : "N/A"}
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Past Invoices */}
          <Card className="glass shadow-xl border-border/50">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Billing History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
               {isPremium ? (
                 <div className="divide-y divide-border/50">
                   {invoices.map((inv) => (
                     <div key={inv.id} className="py-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="h-10 w-10 bg-background/50 rounded-lg border border-border flex items-center justify-center">
                           <FileText className="h-5 w-5 text-muted-foreground" />
                         </div>
                         <div>
                           <p className="font-bold text-sm tracking-tight">{inv.id}</p>
                           <p className="text-xs text-muted-foreground">{inv.date}</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-6">
                         <div className="text-right">
                           <p className="font-bold text-sm">{inv.amount}</p>
                           <p className="text-xs font-medium text-emerald-500">{inv.status}</p>
                         </div>
                         <Button variant="ghost" size="icon" className="hover:text-primary"><Download className="h-4 w-4" /></Button>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-12 text-center text-muted-foreground">
                   <FileText className="h-10 w-10 mx-auto opacity-20 mb-3" />
                   <p className="text-sm">No billing history available.</p>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="glass shadow-xl border-border/50">
             <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" /> Payment Method
                </CardTitle>
             </CardHeader>
             <CardContent className="pt-6">
                {isPremium ? (
                  <div className="space-y-4">
                    <div className="bg-background/50 border border-border rounded-xl p-4 flex items-center gap-4">
                      <div className="h-8 w-12 bg-white rounded flex items-center justify-center relative overflow-hidden">
                        <span className="text-[10px] font-black text-blue-800 absolute right-1 italic">VISA</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/28</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full text-xs">Update Payment Method</Button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground space-y-3">
                    <p className="text-sm">No payment method on file.</p>
                    <Button variant="outline" className="w-full text-xs" onClick={() => setShowPremiumModal(true)}>Add Payment Method</Button>
                  </div>
                )}
             </CardContent>
          </Card>
        </div>
      </div>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}
