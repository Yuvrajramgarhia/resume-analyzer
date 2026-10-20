import { useState, useEffect, useRef } from "react";

export interface EyeTrackingStats {
  currentFocus: number;
  isDistracted: boolean;
  score: number;
  alerts: string[];
  timeline: { time: number; focus: number }[];
}

export function useEyeTracking(isActive: boolean) {
  const [stats, setStats] = useState<EyeTrackingStats>({
    currentFocus: 100, // 0-100% looking at camera
    isDistracted: false,
    score: 100,
    alerts: [],
    timeline: [],
  });

  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isActive) return;
    
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      setStats((prev) => {
        // Simulate eye tracking variations
        const rand = Math.random();
        let newFocus = prev.currentFocus;
        let isDistracted = false;
        let newAlerts = [...prev.alerts];

        if (rand > 0.85) {
          // Look away event
          newFocus = Math.max(0, newFocus - Math.floor(Math.random() * 30 + 20));
          isDistracted = true;
          if (newAlerts.length === 0 || newAlerts[0] !== "Look toward camera") {
            newAlerts.unshift("Look toward camera");
          }
        } else if (rand < 0.2) {
          // Nervous blinking / slight distraction
          newFocus = Math.max(50, newFocus - Math.floor(Math.random() * 15 + 5));
          if (newAlerts.length === 0 || newAlerts[0] !== "Maintain steady gaze") {
            newAlerts.unshift("Maintain steady gaze");
          }
        } else {
          // Good focus
          newFocus = Math.min(100, newFocus + Math.floor(Math.random() * 15 + 5));
          if (newFocus > 85) {
            newAlerts = []; // clear alerts
          }
        }

        // Keep only top 2 alerts
        newAlerts = newAlerts.slice(0, 2);

        // Update overall score smoothly
        const newScore = Math.round((prev.score * 0.95) + (newFocus * 0.05));

        const now = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        return {
          currentFocus: newFocus,
          isDistracted,
          score: newScore,
          alerts: newAlerts,
          timeline: [...prev.timeline, { time: now, focus: newFocus }],
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive]);

  return stats;
}
