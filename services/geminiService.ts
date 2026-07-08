import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanResponse, SurveyPlan, CourseGenerationResponse } from "../types";

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
        Automatically select the best framework or framework combination for this training from the following EIB Group hybrid portfolio based on the Topic, Target Audience, and Subsidiary context:
        1. "Korn Ferry Leadership Architect" (Global Leadership Core: behavioral, executive, and management competencies across all subsidiaries).
        2. "PMI Talent Triangle / PMBOK" (Global Project Delivery Core: project management, lifecycle coordination, and governance).
        3. "Lean Six Sigma (LSS)" (Manufacturing & Operational Core: process improvement, defect reduction, Yellow/Green/Black Belt tracks).
        4. "IATF 16949 / ISO 9001" (Automotive Quality Core: strict compliance, auditing, and competency controls for automotive personnel).
        5. "NICE Framework" (Cyber Security: Incident analysis, security engineering, digital forensics, and threat response for DCI).
        6. "Intelligence Tradecraft Core Competencies" (Intelligence Core: intelligence collection, counterintelligence, clandestine tradecraft, and analysis).
        7. "Logical Framework Approach (LogFrame) / Theory of Change" (Non-profit NGO Core: Monitoring & Evaluation (M&E), donor reporting, social impact metrics).
        8. "ScreenSkills Creative Skillset" (Media & Broadcasting Core: radio presenting, audio engineering, audience management, transmission safety).
        9. "SFIA (Skills Framework for the Information Age)" (IT & Software Engineering Core: professional competencies, engineering levels 1-7, and digital capability).
      `;
    }

    const prompt = `
      Act as a Group Learning & Development Director at EIB Group.
      Design a highly professional and tailored training program for: "${topic}".
      Target Audience: ${targetAudience}.
      Desired Duration: ${duration}.
      
      ${frameworkDirective}
      
      Return a JSON object with a catchy Title, a brief Overview, the exact frameworkUsed (e.g. "NICE Framework" or "Lean Six Sigma (LSS)"), and a list of Modules.
      For each module:
      1. Provide a name.
      2. List 2-3 learning objectives.
      3. Estimated duration.
      4. Assign the target level, competency, or regulation standard under the chosen framework as 'levelOrStandard' (e.g., "Korn Ferry Competency: Courage", "NICE Specialty: Digital Forensics (AN-DFN)", "Lean Six Sigma: Green Belt Certification", "LogFrame Monitoring & Evaluation", or "PMI Performance Domain: Delivery").
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
            Automatically select the most appropriate framework from the following EIB Group hybrid portfolio to conduct this analysis based on the role and goal:
            1. "Korn Ferry Leadership Architect" (Global Leadership Core: leadership, behavioral, and management competencies for directors/executives).
            2. "PMI Talent Triangle / PMBOK" (Global Project Delivery Core: project management, planning, and program execution).
            3. "Lean Six Sigma (LSS)" (Manufacturing Operations: defect reduction, process efficiency, and quality audits).
            4. "IATF 16949 / ISO 9001" (Automotive Quality Standards: QA protocols and manufacturing competency).
            5. "NICE Framework" (Cybersecurity & Digital Forensics: SOC analysis, incident containment, threat hunting).
            6. "Intelligence Tradecraft Core Competencies" (Intelligence Core: counterintelligence, analysis, and active operations tradecraft).
            7. "Logical Framework Approach (LogFrame) / Theory of Change" (Non-Profit and NGOs: field assessments, monitoring, and impact indicators).
            8. "ScreenSkills Creative Skillset" (Media and Broadcast: audience acquisition, on-air presenting, sound engineering, delay panels).
            9. "SFIA (Skills Framework for the Information Age)" (IT, Digital & Software Engineering: professional competencies, software development levels 1-7).
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

export const generateCourseSyllabus = async (
  title: string,
  description: string,
  category: string,
  level: string,
  format: string,
  duration: number,
  targetSubsidiaries: string,
  isStrategic: boolean,
  videoUrl?: string,
  thumbnailUrl?: string
): Promise<CourseGenerationResponse | null> => {
  try {
    const ai = getAIClient();

    const prompt = `
      Act as a Group Learning & Development Director at EIB Group.
      Design an exhaustive, custom-tailored 5-lesson course syllabus and a 10-question customized quiz based on the following input:
      
      Course Title: "${title}"
      Description: "${description}"
      Category: "${category}"
      Level: "${level}"
      Format: "${format}"
      Duration: "${duration} Hours"
      Target Subsidiaries: "${targetSubsidiaries}"
      Strategic Briefing: "${isStrategic ? 'Yes (Strict OPSEC, hide from public catalogs)' : 'No (Public L&D catalog)'}"

      You MUST align the lessons and quiz questions to the appropriate EIB Group blended framework based on the subsidiary context. E.g.:
      - Cybersecurity -> NICE Framework standards
      - Manufacturing/Automotive -> Lean Six Sigma (LSS) / IATF 16949
      - Leadership -> Korn Ferry Leadership Architect
      - Projects -> PMI PMBOK
      - Non-Profit -> Logical Framework Approach (LogFrame)
      - Media -> ScreenSkills
      - IT, Digital & Software Engineering -> SFIA (Skills Framework for the Information Age) Framework (professional competencies, capability levels 1-7)

      Generate:
      1. exactly 5 sequential dynamic Lessons. Each lesson should have a "title", a comprehensive paragraph of "content" (be descriptive, providing actual educational content/guidance appropriate for the course category), and a lesson "duration".
      2. exactly 10 multiple-choice Quiz Questions based on the lesson contents, complete with 4 "options" (A, B, C, D), the exact "correctAnswer" (e.g. "A"), and a detailed "explanation" for why it is correct.
      3. Recommend the optimal frameworkUsed (e.g. "NICE Framework" or "Lean Six Sigma (LSS)" or "Korn Ferry Leadership Architect").

      Return a clean JSON matching the requested CourseGenerationResponse schema.
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
            category: { type: Type.STRING },
            level: { type: Type.STRING },
            format: { type: Type.STRING },
            duration: { type: Type.STRING },
            frameworkUsed: { type: Type.STRING, description: "The specific framework selected for alignment (e.g., NICE Framework, Korn Ferry Leadership Architect, Lean Six Sigma)" },
            targetSubsidiaries: { type: Type.STRING },
            isStrategic: { type: Type.BOOLEAN },
            videoUrl: { type: Type.STRING },
            thumbnailUrl: { type: Type.STRING },
            lessons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  duration: { type: Type.STRING }
                },
                required: ["title", "content", "duration"]
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["title", "description", "category", "level", "format", "duration", "frameworkUsed", "targetSubsidiaries", "isStrategic", "lessons", "quiz"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as CourseGenerationResponse;
  } catch (error) {
    console.error("Error generating course syllabus:", error);
    return null;
  }
};