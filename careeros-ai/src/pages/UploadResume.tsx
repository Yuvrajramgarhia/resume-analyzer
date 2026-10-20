import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { parseResumeWithAI } from "../lib/gemini";
import { UploadCloud, File, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const JOB_ROLES = [
  "Software Engineer",
  "Data Analyst",
  "Product Manager",
  "UI/UX Designer",
  "HR / Recruiter",
  "Marketing Manager",
];

export function UploadResume() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [roleTarget, setRoleTarget] = useState(JOB_ROLES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [parsingStep, setParsingStep] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      setError("Please select a file first.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError(
        "Please upload a PDF file. We strongly recommend PDF for best ATS simulation.",
      );
      return;
    }

    setIsProcessing(true);
    setError("");
    setParsingStep("Initializing secure environment...");

    try {
      const resumeRef = await addDoc(collection(db, "resumes"), {
        userId: user.uid,
        fileName: file.name,
        roleTarget,
        status: "processing",
        isPublic: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      setParsingStep("Uploading and parsing document...");

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string;
          setParsingStep("AI evaluating against role target...");

          const parsedObject = await parseResumeWithAI(
            base64Data,
            file.type,
            roleTarget,
          );

          setParsingStep("Finalizing scores...");

          const payload = {
            status: "completed",
            atsScore: parsedObject.atsScore,
            parsedData: JSON.stringify(parsedObject),
            updatedAt: Date.now(),
          };

          await updateDoc(doc(db, "resumes", resumeRef.id), payload);

          navigate(`/resume/${resumeRef.id}`);
        } catch (err: any) {
          console.error(err);
          await updateDoc(doc(db, "resumes", resumeRef.id), {
            status: "failed",
            updatedAt: Date.now(),
          });
          setError("Failed to parse resume: " + err.message);
          setIsProcessing(false);
          setFile(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setError("Upload failed: " + err.message);
      setIsProcessing(false);
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full max-w-4xl mx-auto w-full">
      <header className="h-16 shrink-0 glass rounded-2xl px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">Evaluate Resume</h1>
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            See exactly how AI and recruiters rank your profile.
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-auto rounded-2xl no-scrollbar flex flex-col gap-6 w-full">
        <Card className="flex flex-col flex-1 p-8 border-dashed border-2 bg-muted/10 items-center justify-center min-h-[400px]">
          <div
            className="flex flex-col items-center justify-center text-center max-w-md"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <UploadCloud className="h-16 w-16 text-primary mb-6 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">Drag and drop PDF</h3>
            <p className="text-sm text-muted-foreground mb-8">
              Or click below to browse your local files for analysis.
            </p>

            <label htmlFor="file-upload" className="cursor-pointer group flex">
              <span className="inline-flex flex-1 items-center justify-center p-[1px] rounded-lg bg-gradient-to-r from-primary to-emerald-500 overflow-hidden">
                <span className="inline-flex items-center px-8 py-3 bg-background rounded-[7px] text-sm font-bold text-primary group-hover:bg-primary/10 transition-colors">
                  Select File
                </span>
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFile(e.target.files[0]);
                }}
              />
            </label>

            {file && (
              <div className="mt-8 flex items-center gap-3 px-4 py-3 bg-secondary/50 border border-primary/20 rounded-xl max-w-full shadow-sm text-secondary-foreground">
                <File className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm truncate font-bold text-center w-full">
                  {file.name}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-muted/5 flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Target Role Parameter
            </h4>
            <select
              className="w-full h-12 px-4 rounded-lg bg-background border border-border/50 focus:outline-primary focus:border-primary text-sm font-medium"
              value={roleTarget}
              onChange={(e) => setRoleTarget(e.target.value)}
            >
              {JOB_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <Button
            size="lg"
            className="w-full md:w-auto px-8 py-6 h-auto text-base shadow-lg transition-transform active:scale-95 border-none"
            onClick={handleUpload}
            disabled={!file || isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Sparkles className="h-5 w-5" /> {parsingStep}
              </span>
            ) : (
              <span className="flex items-center gap-2 font-bold font-mono uppercase tracking-wide">
                Commence Analysis
              </span>
            )}
          </Button>
        </Card>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-start gap-3 shadow-lg">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div
              dangerouslySetInnerHTML={{ __html: error }}
              className="text-sm font-medium leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
}
