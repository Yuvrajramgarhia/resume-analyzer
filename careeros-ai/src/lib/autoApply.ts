import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, Timestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ai } from './gemini';
import { Type } from '@google/genai';

// Types
export interface JobListing {
  id?: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  matchReason: string;
  skills: string[];
  isRemote: boolean;
  postedAt: string;
}

export interface ApplicationPacket {
  id?: string;
  userId: string;
  jobId: string;
  jobSnapshot: JobListing;
  status: 'prepared' | 'awaiting_approval' | 'submitted' | 'viewed' | 'assessment' | 'interview' | 'offer' | 'rejected' | 'failed';
  tailoredResume: string;
  coverLetter: string;
  fitScore: number;
  createdAt: any;
  updatedAt: any;
}

// 1 & 2) Job Discovery & Matching Engine
export async function discoverAndMatchJobs(preferences: string, userProfileContext: string): Promise<JobListing[]> {
  const prompt = `
  You are an Intelligent Job Discovery Module & Candidate Matching Engine.
  Based on the user preferences: "${preferences}" and user resume/profile summary: "${userProfileContext}".
  
  Generate exactly 3 to 10 highly relevant job listings. For each job, calculate:
  - matchScore: Overall fit score (0-100) based on skill match, experience fit, and location fit.
  - matchReason: Give a 1-sentence explanation. E.g., "Matched because Python and remote prefernce align strongly."
  
  Return in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            location: { type: Type.STRING },
            salary: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            matchReason: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            isRemote: { type: Type.BOOLEAN },
            postedAt: { type: Type.STRING },
          },
          required: ["title", "company", "location", "salary", "matchScore", "matchReason", "skills", "isRemote", "postedAt"],
        },
      },
    },
  });

  const jobs = JSON.parse(response.text);
  // Store these discovered jobs in Firestore? Usually we wait for user to apply, but auto-apply should maybe store them.
  return jobs.map((job: any) => ({ ...job, id: Math.random().toString(36).substring(7) }));
}

// 3 & 4) Resume Tailoring & Application Preparation
export async function prepareApplication(job: JobListing, userContext: string, userId: string): Promise<ApplicationPacket> {
  const prompt = `
  You are a Resume Tailoring Engine. 
  Target Role: ${job.title} at ${job.company}.
  Candidate Context: ${userContext}
  
  Generate a custom tailored resume summary/diff and a custom cover letter.
  Provide an updated fit score after tailoring.
  Return as JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tailoredResume: { type: Type.STRING, description: "A markdown tailored version of the resume / summary." },
          coverLetter: { type: Type.STRING, description: "A highly personalized cover letter." },
          fitScore: { type: Type.NUMBER, description: "New match score (0-100)" },
        },
        required: ["tailoredResume", "coverLetter", "fitScore"],
      },
    },
  });

  const generated = JSON.parse(response.text);

  const packet: Omit<ApplicationPacket, 'id'> = {
    userId,
    jobId: job.id || 'unknown',
    jobSnapshot: job,
    status: 'awaiting_approval',
    tailoredResume: generated.tailoredResume,
    coverLetter: generated.coverLetter,
    fitScore: generated.fitScore,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'applications'), packet);
  return { ...packet, id: docRef.id } as ApplicationPacket;
}

// 5 & 6) Approval & Submission Engine
export async function approveAndSubmitApplication(applicationId: string) {
  const docRef = doc(db, 'applications', applicationId);
  await updateDoc(docRef, {
    status: 'submitted',
    updatedAt: serverTimestamp()
  });
  
  // Create an application log
  await addDoc(collection(db, 'application_logs'), {
    applicationId,
    action: 'submitted',
    timestamp: serverTimestamp()
  });
}

export async function rejectApplication(applicationId: string) {
  const docRef = doc(db, 'applications', applicationId);
  await updateDoc(docRef, {
    status: 'rejected',
    updatedAt: serverTimestamp()
  });
}

// 7) Get Tracking Data
export async function getUserApplications(userId: string): Promise<ApplicationPacket[]> {
  const q = query(collection(db, 'applications'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApplicationPacket));
}
