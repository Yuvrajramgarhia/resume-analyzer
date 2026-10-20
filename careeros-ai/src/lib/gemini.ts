import { GoogleGenAI, Type } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY });

export async function parseResumeWithAI(
  base64Data: string,
  mimeType: string,
  jobRoleTarget: string,
) {
  // Strip "data:application/pdf;base64," prefix if present
  const base64DataClean = base64Data.replace(/^data:.*?;base64,/, "");

  const prompt = `
  You are an expert ATS (Applicant Tracking System), senior technical recruiter, and career planner.
  Analyze this resume data in the context of the user applying for the role: "${jobRoleTarget}".

  Evaluate it ruthlessly but constructively.
  Calculate an ATS score (0-100).
  List missing keywords critical for ${jobRoleTarget}.
  Extract a grammar and formatting critique.
  Recommend a career roadmap (next steps, skills to learn, certs).
  
  Do not hallucinate. If the resume is empty or invalid, return a 0 score and note the error.
  `;

  // Define schema for structured JSON output
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: {
      parts: [
        { inlineData: { mimeType, data: base64DataClean } },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          atsScore: {
            type: Type.NUMBER,
            description:
              "A score from 0 to 100 representing how well the resume matches the target role.",
          },
          extractedName: { type: Type.STRING },
          extractedContact: { type: Type.STRING },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Directly extracted skills",
          },
          experienceSummary: {
            type: Type.STRING,
            description: "2 sentence summary of experience",
          },
          missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              "Crucial keywords, skills, or tooling missing for the target role.",
          },
          grammarAndFormattingFeedback: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              "Bullet points detailing formatting/grammar errors or structural suggestions.",
          },
          careerRoadmap: {
            type: Type.OBJECT,
            properties: {
              currentProfileAnalysis: { type: Type.STRING },
              recommendedSkillsToLearn: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedCertifications: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              nextCareerRoles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
        required: [
          "atsScore",
          "extractedName",
          "skills",
          "missingKeywords",
          "careerRoadmap",
          "grammarAndFormattingFeedback",
        ],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function generateRejectionInsight(company: string, role: string) {
  const prompt = `
  You are an expert tech recruiter and AI career copilot. A user was recently rejected from ${company} for the role of ${role}.
  
  Please run a 'Rejection Insight Engine' analysis. Since we don't have their exact resume or the specific reason, generate a realistic, high-quality, highly technical probable post-mortem for a competitive role at this company.
  
  Provide:
  1. Primary probable rejection reasons (ATS mismatch, market competition, missing skills).
  2. A corrective action plan with concrete next steps.
  3. A short, encouraging but realistic evaluation summary.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          probableReasons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
            },
          },
          actionPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                details: { type: Type.STRING },
              },
            },
          },
        },
        required: ["summary", "probableReasons", "actionPlan"],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function chatWithCareerAgent(
  userMessage: string,
  chatHistory: { role: "user" | "model" | "agent"; text: string }[],
  candidateContext: any
) {
  const prompt = `
  You are an expert AI Career Agent acting as a Recruiter, Mentor, Coach, and Career Manager for the user.
  
  You must be proactive, intelligent, adaptive, and personalized. 
  NEVER repeat the same generic advice. ALWAYS use the candidate's context and chat memory to generate highly specific, actionable, and conversational replies.
  Detect their emotional tone (stress, low confidence, excitement) and adapt your tone accordingly.
  When they ask for plans, create step-by-step daily tasks. Ask smart follow-up questions to guide them.

  CANDIDATE CONTEXT:
  Here is the candidate's profile context (skills, jobs, resume summary, weak points, goals, etc.):
  ${JSON.stringify(candidateContext, null, 2)}
  
  INSTRUCTIONS:
  1. Analyze the user's latest message and intent.
  2. Map it to their Profile Context.
  3. Generate a distinct, personalized response.
  4. Use markdown formatting to make your reply readable.
  5. If needed, ask one clear follow-up question.

  USER'S LATEST MESSAGE:
  "${userMessage}"
  `;

  // Filter and format history for Gemini
  // Gemini expects roles to be "user" or "model"
  const history = chatHistory.map(msg => ({
    role: msg.role === "agent" ? "model" as const : "user" as const,
    parts: [{ text: msg.text }]
  }));

  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "replace_me_with_real_key" || apiKey === "YOUR_API_KEY") {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `*[Mock AI Response]*\n\nHello! I am your AI Career Agent. Since you haven't configured a real Gemini API key yet, I'm operating in offline mock mode.\n\nBut here is some tailored advice: Keep learning, update your resume to highlight your impact, and stay consistent! \n\n*You asked:* "${userMessage}"`;
  }

  const chat = ai.chats.create({
    model: "gemini-1.5-pro",
    config: { systemInstruction: "You are an expert AI Career Agent. Provide short, concise, and helpful advice." },
    history: history,
  });

  const response = await chat.sendMessage({
    message: prompt,
  });

  return response.text;
}

export async function searchJobs(preferences: string) {
  const prompt = `
  You are an Intelligent Job Discovery Module that integrates with major job board APIs (LinkedIn, Indeed, Glassdoor).
  Because we don't have direct live API access right now, simulate the real-time search of job listings based on the user's preferences: "${preferences}".
  Return exactly 3 to 10 highly relevant realistic job list items in a JSON array. 
  
  Each object in the array should conform exactly to this schema:
  {
    "id": (unique string),
    "title": (string),
    "company": (string),
    "location": (string),
    "salary": (string e.g. "$150k - $200k"),
    "matchScore": (number 1-100),
    "matchReason": (string, explaining why it's a fit),
    "skills": (array of strings, max 3),
    "isRemote": (boolean),
    "postedAt": (string e.g. "1d ago")
  }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            location: { type: Type.STRING },
            salary: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            matchReason: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            isRemote: { type: Type.BOOLEAN },
            postedAt: { type: Type.STRING },
          },
          required: [
            "id",
            "title",
            "company",
            "location",
            "salary",
            "matchScore",
            "matchReason",
            "skills",
            "isRemote",
            "postedAt",
          ],
        },
      },
    },
  });

  return JSON.parse(response.text);
}
