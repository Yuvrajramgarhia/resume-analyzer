import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  BrainCircuit,
  ArrowRight,
  Video,
  Target,
  Users,
  Building,
  ShieldCheck,
} from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "motion/react";

const glowVariants: any = {
  initial: { opacity: 0.5, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1.2,
    transition: {
      repeat: Infinity,
      duration: 4,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

export function LandingPage() {
  const { user, profile } = useAuth();

  if (user && profile) {
    return (
      <Navigate
        to={profile.onboardingComplete ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center relative overflow-hidden bg-mesh animate-mesh">
      {/* Decorative gradient */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent -z-10" />

      {/* Floating orbs */}
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate="animate"
        className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"
      />
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate="animate"
        transition={{
          delay: 2,
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 text-foreground relative"
      >
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center font-black text-xl shadow-md"
          >
            C
          </motion.div>
          <span className="font-extrabold text-2xl tracking-tight group-hover:text-primary transition-colors">
            CareerOS AI
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-muted-foreground">
          {["Products", "Solutions", "Pricing", "Enterprise"].map((item) => (
            <span
              key={item}
              className="relative hover:text-foreground transition-colors cursor-pointer group py-2"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </span>
          ))}
        </nav>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground font-bold glass transition-all duration-300 rounded-xl relative overflow-hidden group"
            asChild
          >
            <Link to="/auth">
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:animate-[shine_1.5s_ease-out]"></div>
            </Link>
          </Button>
        </motion.div>
      </motion.header>

      <main className="container max-w-6xl text-center space-y-8 mt-20 mb-32 z-10 px-4 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-md bg-primary/10 hover:bg-primary/20 transition-colors cursor-default"
          >
            <BrainCircuit className="h-4 w-4" />
            <span>Next-Gen Hiring Ecosystem</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[1.05] max-w-5xl mx-auto"
          >
            Intelligence for <br />
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "linear",
              }}
              className="text-transparent bg-clip-text bg-[length:200%_auto] bg-gradient-to-r from-primary via-secondary to-accent"
            >
              careers
            </motion.span>{" "}
            &{" "}
            <motion.span
              initial={{ backgroundPosition: "100% 50%" }}
              animate={{ backgroundPosition: "0% 50%" }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "linear",
              }}
              className="text-transparent bg-clip-text bg-[length:200%_auto] bg-gradient-to-r from-accent via-secondary to-primary"
            >
              hiring
            </motion.span>
            .
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
          >
            A unified AI platform for Candidates, Recruiters, and Institutions.
            Automate screening, simulate technical interviews, and predict team
            fit.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <Button
                size="lg"
                className="relative h-16 px-10 text-lg rounded-2xl font-black bg-primary text-primary-foreground transition-all flex items-center border border-primary/50 overflow-hidden"
                asChild
              >
                <Link to="/auth">
                  <span className="relative z-10 flex items-center">
                    Enter Ecosystem{" "}
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:animate-[shine_1.5s_ease-out]"></div>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mt-40 pt-20 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

          <FeatureCard
            icon={<Target className="h-8 w-8 text-primary" />}
            title="Candidates"
            description="Auto-apply agents, AI mock interviews, and digital twin projections. Train with your personal AI career coach."
            color="primary"
          />

          <FeatureCard
            icon={<Users className="h-8 w-8 text-secondary" />}
            title="Recruiters"
            description="Create unbiased AI screening campaigns. Let our intelligent models interview, rank, and shortlist your hiring pool."
            color="secondary"
          />

          <FeatureCard
            icon={<Building className="h-8 w-8 text-accent" />}
            title="Institutions"
            description="Improve placement outcomes. Provide enterprise-grade mock interviews and track batch employability readiness."
            color="accent"
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "secondary" | "accent";
}) {
  const colorMap = {
    primary:
      "from-primary to-accent border-primary hover:border-primary/50 shadow-md",
    secondary:
      "from-secondary to-accent border-secondary hover:border-secondary/50 shadow-md",
    accent:
      "from-accent to-primary border-accent hover:border-accent/50 shadow-md",
  };

  const bgMap = {
    primary: "bg-primary/20",
    secondary: "bg-secondary/20",
    accent: "bg-accent/20",
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className={`glass-card p-10 rounded-[2rem] border border-border/50 transition-all duration-500 group relative overflow-hidden`}
    >
      <motion.div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colorMap[color].split(" ")[0]} ${colorMap[color].split(" ")[1]} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-[2rem]`}
      />
      <div className="absolute -inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <div className="flex items-center justify-between mb-8 relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`${bgMap[color]} p-4 rounded-2xl ${colorMap[color].split(" shadow-")[1] ? "shadow-" + colorMap[color].split(" shadow-")[1] : ""} transition-transform`}
        >
          {icon}
        </motion.div>
      </div>
      <h3 className="font-bold text-3xl mb-4 text-foreground relative z-10">
        {title}
      </h3>
      <p className="text-muted-foreground text-lg leading-relaxed relative z-10">
        {description}
      </p>
    </motion.div>
  );
}
