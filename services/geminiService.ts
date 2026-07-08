import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanResponse, SurveyPlan } from "../types";

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing from environment variables");
    throw new Error("API Configuration Error: Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTrainingStrategy = async (
  topic: string,
  targetAudience: string,
  duration: string,
  frameworkId?: string
): Promise<AIPlanResponse | null> => {
  try {
    const ai = getAIClient();

    let frameworkDirective = "";
    if (frameworkId && frameworkId !== "auto") {
      frameworkDirective = `You MUST use the following specific framework for this curriculum: "${frameworkId}".`;
    } else {
      frameworkDirective = `
        Automatically select the best framework for this training from the following 6 options based on the Topic and Target Audience:
        1. "SFIA Foundation" (Enterprise Skills: technology, career paths, and general business roles).
        2. "Korn Ferry" (Leadership: behavioral, executive, and management competencies).
        3. "National Initiative for Cybersecurity Education (NICE)" (Cybersecurity: SOC analysts, security engineers, incident response).
        4. "ISACA" (IT Governance: risk, compliance, COBIT, and information security).
        5. "Project Management Institute (PMI)" (Project Delivery: drone deployments, agile/waterfall client projects).
        6. "National Aviation Regulations and Operational Standards" (Aviation Operations: drone/UAS pilots, flight operations, maintenance, safety).
      `;
    }

    const prompt = `
      Act as a Group Learning & Development Manager at EIB Group.
      Design a structured training program for: "${topic}".
      Target Audience: ${targetAudience}.
      Desired Duration: ${duration}.
      
      ${frameworkDirective}
      
      Return a JSON object with a catchy Title, a brief Overview, the exact frameworkUsed (e.g. "Korn Ferry" or "SFIA Foundation"), and a list of Modules.
      For each module:
      1. Provide a name.
      2. List 2-3 learning objectives.
      3. Estimated duration.
      4. Assign the target level, competency, or regulation standard under the chosen framework as 'levelOrStandard' (e.g., "Korn Ferry Competency: Courage", "SFIA Level 3: Apply", "NICE competency: Security Provision", "PMI Performance Domain: Stakeholder", or "Aviation Regulation: Part 107 / CAA Rule Category: Specific").
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            frameworkUsed: { type: Type.STRING, description: "The exact framework selected or used" },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  objectives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  duration: { type: Type.STRING },
                  levelOrStandard: { type: Type.STRING, description: "The level, competency, or regulation standard under the chosen framework" }
                },
                required: ["name", "objectives", "duration", "levelOrStandard"]
              }
            }
          },
          required: ["title", "overview", "modules", "frameworkUsed"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIPlanResponse;

  } catch (error) {
    console.error("Error generating strategy:", error);
    return null;
  }
};

export const analyzeSkillGap = async (
  role: string,
  currentSkills: string,
  businessGoal: string,
  frameworkId?: string
): Promise<string> => {
    try {
        const ai = getAIClient();
        
        let frameworkDirective = "";
        if (frameworkId && frameworkId !== "auto") {
          frameworkDirective = `Conduct this Gap Analysis strictly using the "${frameworkId}" framework.`;
        } else {
          frameworkDirective = `
            Automatically select the most appropriate framework from the following 6 options to conduct this analysis based on the role and goal:
            1. "SFIA Foundation" (Enterprise Skills: technology, career paths, and general business roles)
            2. "Korn Ferry" (Leadership: leadership, behavioral, executive, and management competencies)
            3. "National Initiative for Cybersecurity Education (NICE)" (Cybersecurity: SOC analysts, security engineers, incident response, etc.)
            4. "ISACA" (IT Governance: governance, risk, compliance, COBIT, and information security)
            5. "Project Management Institute (PMI)" (Project Delivery: project management, agile/waterfall coordination, drone deployment projects)
            6. "National Aviation Regulations and Operational Standards" (Aviation Operations: drone/UAS pilots, flight operations, air safety, and maintenance)
          `;
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `
              Role: ${role}
              Current Team Skills: ${currentSkills}
              Business Goal: ${businessGoal}
              
              ${frameworkDirective}
              
              Conduct a comprehensive Gap Analysis.
              1. Explicitly state which framework was selected and WHY it is the ideal fit for this business area / role.
              2. Estimate the current competency level, certification, or standard of the team based on the description.
              3. Determine the target standard, level, or competency required to meet the Business Goal.
              4. Identify specific gaps (e.g., in leadership behaviors, cyber operations, risk controls, project delivery, or aviation compliance depending on the chosen framework).
              5. Recommend 3 specific, actionable training or certification interventions to bridge this gap.
              
              Format the output clearly with bold headings and professional, structured markdown.
            `,
        });
        return response.text || "Could not generate analysis.";
    } catch (error) {
        console.error("Error analyzing gap:", error);
        return "Error analyzing skills gap. Please check your API Key configuration.";
    }
}

export const generateNeedsAssessmentSurvey = async (
  focusArea: string,
  respondentRole: string,
  intent: string
): Promise<SurveyPlan | null> => {
  try {
    const ai = getAIClient();
    const prompt = `
      Act as a Senior Organizational Development Consultant.
      Create a diagnostic questionnaire/survey to be sent to: ${respondentRole}.
      The focus area is: ${focusArea}.
      The strategic intent is: ${intent}.

      Generate 5-7 high-impact questions.
      
      CRITICAL: Return JSON matching this structure exactly.
      questions array items must have:
      - question: string
      - type: string (MUST be exactly "scale", "text", or "choice")
      - rationale: string
      - options: array of strings (ONLY if type is "choice")
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            type: { 
                                type: Type.STRING, 
                                description: "One of: scale, text, choice" 
                            },
                            rationale: { type: Type.STRING },
                            options: { 
                                type: Type.ARRAY, 
                                items: { type: Type.STRING },
                                description: "Required only if type is choice"
                            }
                        },
                        required: ["question", "type", "rationale"]
                    }
                }
            },
            required: ["title", "description", "targetAudience", "questions"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as SurveyPlan;
  } catch (error) {
      console.error("Error generating survey:", error);
      throw error; 
  }
}

export const robustifyReport = async (
  shallowReport: string,
  context: string
): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `
        Act as a Senior Operations Manager at EIB Group. 
        The following daily work report is considered "too shallow" by management.
        Your task is to expand and "robustify" this report into a professional, detailed, and analytical document.
        
        Shallow Report Content: "${shallowReport}"
        Context (Role/Subsidiary): ${context}
        
        Guidelines:
        1. Use professional, operational language (e.g., "operational tempo", "situational awareness", "strategic alignment").
        2. Break down the tasks into specific, measurable actions.
        3. Add analytical insights (e.g., why this task matters, what the impact is).
        4. Ensure it sounds like it came from a high-performing employee at a strategic firm like EIB STRATOC.
        
        Return ONLY the expanded text for the "Completed Tasks" or "Overall Situation" section.
      `,
    });
    return response.text || shallowReport;
  } catch (error) {
    console.error("Error robustifying report:", error);
    return shallowReport;
  }
};