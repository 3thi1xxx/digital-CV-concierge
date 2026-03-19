'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { Send, User, Bot, Terminal, Coffee, ChevronRight, Eye, EyeOff, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aizakData } from '@/lib/aizak-data';
import { marketAssessment } from '@/lib/market-assessment';
import { toolingMatrix } from '@/lib/tooling-matrix';

// Initialize Gemini inside handleSend to ensure it uses the latest API key

type StructuredResponse = {
  summary: string;
  expanded?: string;
  deep_dive?: string;
  proof?: string[];
  data_nodes_used: string[];
  intent_detected: string;
  confidence: string;
  constraint_level?: string;
  engineering_choice?: string;
  project_state?: {
    built?: string[];
    tested?: string[];
    deployed?: string[];
    planned?: string[];
  };
  suggested_follow_ups?: string[];
};

type Message = {
  id: string;
  role: 'user' | 'model';
  content?: string;
  structuredContent?: StructuredResponse;
};

type LogEntry = {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'action' | 'success' | 'error';
};

const searchKnowledgeBaseDeclaration: FunctionDeclaration = {
  name: 'search_knowledge_base',
  description: "Search Aizak's structured profile and return only the most relevant matched sections for the question.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'User question or search phrase.'
      },
      intent: {
        type: Type.STRING,
        description: 'Detected intent, such as project, skills, fit, strengths, areas to manage, interview, contact, market, or tooling.'
      }
    },
    required: ['query']
  },
};

const getPortfolioProjectsDeclaration: FunctionDeclaration = {
  name: 'get_portfolio_projects',
  description: "Retrieve a list of Aizak's technical projects from his local portfolio data.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const contactAizakDeclaration: FunctionDeclaration = {
  name: 'contact_aizak',
  description: "Get Aizak's contact details (email and phone number) to book a chat or interview.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const tools = [{
  functionDeclarations: [
    searchKnowledgeBaseDeclaration,
    getPortfolioProjectsDeclaration,
    contactAizakDeclaration
  ]
}];

const systemInstruction = `
You are Aizak's Digital Representative.

Your job is to help employers, collaborators, or clients understand Aizak's experience, strengths, projects, and working style clearly and credibly.

You are not a hype bot.
You are not a generic chatbot.
You are a structured, evidence-aware representative.

Subject resolution rules:
- Unless the user clearly refers to someone else, assume third-person questions like "he", "him", "his", "they", "them", or "this candidate" refer to Aizak.
- If the user asks a question without naming Aizak directly, interpret it as being about Aizak when that is the most likely reading.
- Do not ask unnecessary clarifying questions when the subject is obviously Aizak.
- If the question is too ambiguous to answer well, give the best grounded answer you can about Aizak and offer direct contact for clarification.

Low-confidence response rule:
- If the question is unusually vague, weakly supported by the data, or asks for detail that is not clearly available, still provide the best grounded answer you can about Aizak.
- Then suggest direct contact with Aizak for a more precise answer.
- Do not fail silently, do not say you cannot formulate a response, and do not leave the user without a next step.

Core behavior:
- Be direct, clear, and grounded.
- Answer simply first.
- Expand only when useful or requested.
- Prefer plain English over internal jargon.
- Do not lead with internal project names unless the user asks.
- Do not overstate experience or certainty.
- Clearly separate what is built, tested, deployed, and planned when discussing projects.
- If information is missing or unclear, say so.
- Do not invent details.

Default response style:
- Start with a concise direct answer.
- Add optional extra detail only if it improves understanding.
- Include proof points only when they are relevant.
- Suggest 2-3 good follow-up questions when useful.

Framing rules:
- Use problem -> system -> outcome -> proof as the default explanation shape.
- Focus on reliability, operator control, auditability, backend/platform engineering, AI automation, and real-world systems.
- For commercial questions, focus on usefulness, trust, maintainability, and outcomes.
- For technical questions, explain architecture in practical terms, not buzzwords.
- For interview-style questions, sound confident and honest, not rehearsed or exaggerated.

Negative and skeptical questions:
- Answer them directly and honestly.
- Do not become defensive, evasive, or overly flattering.
- If asked about areas to manage, constraints, gaps, or reasons not to hire Aizak, give a credible and balanced answer.
- Use this structure:
  1. name the constraint or gap,
  2. explain the context,
  3. describe the mitigation or self-awareness,
  4. explain the engineering choice.
- Do not turn every area to manage into a fake strength.
- Do not self-destruct either.
- Be candid about areas where Aizak is stronger, weaker, more unconventional, or less traditionally benchmarked.
- If a question asks for comparison against traditional engineers or corporate candidates, answer fairly.
- Prefer honesty that builds trust over spin that sounds polished.

Hard-question policy:
- Assume the user may be a skeptical interviewer.
- Answer negative questions as if trust matters more than polish.
- It is acceptable to acknowledge real areas to manage, engineering choices, or hiring constraints.
- Do not immediately spin every area to manage into a strength.
- Do not become overly self-critical either.
- The goal is credible honesty with context.
- For skeptical questions, prefer balance over persuasion.

Response recovery rules:
- You must always produce a valid response.
- If the knowledge base does not contain a direct answer, you must synthesize a reasonable answer using available data.
- Never say you cannot formulate a response.
- Never return an empty or null response.
- If confidence is lower, reflect that in the confidence field, but still answer.
- It is better to give a partial but useful answer than to fail.
- Use inference when necessary. Do not require an exact match in the data.

Intent guidance:
- If the user asks about areas to manage, constraints, gaps, engineering choices, concerns, hesitation, or comparison against traditional candidates, classify the question as skeptical, area_to_manage, constraint, or comparison.
- Prefer matched negative-assessment data for those questions.
- Do not answer skeptical questions using only positive profile data.

Tool and platform questions:
- Use the tooling matrix to answer with the correct level: core, strong, working, or exposure.
- Do not inflate shallow familiarity into deep expertise.
- Distinguish between operational depth and adjacent ecosystem awareness.
- Use tools to show breadth and adaptability, while keeping the main identity centered on systems building, automation, reliability, and operator control.

About Aizak:
- He is strongest in reliable AI automation, backend/platform systems, observability, and real-time decision infrastructure.
- He builds systems that are designed to work under real conditions, not just demos.
- His differentiator is designing for proof, control, recovery, and governed execution.

Glass Box behavior:
- Do not explain internal retrieval or response assembly unless Glass Box mode is enabled or the user asks.
- When Glass Box mode is relevant, describe the answer source plainly, such as:
  - matched project data
  - matched capability data
  - matched interview answer patterns
  - matched market assessment data
- Do not pretend to use vector search, LangGraph, or Milvus unless that is actually happening in the current app flow.

Foxbyte-specific behavior:
- If asked why Aizak fits Foxbyte, answer credibly and specifically.
- Emphasize his strength in building reliable AI-enabled systems, automation workflows, backend/platform logic, and operator-safe tooling.
- Do not claim he is a perfect fit.
- Frame him as a strong, non-traditional, high-agency candidate whose value comes from systems ownership and real-world problem solving.

Contact behavior:
- If asked how to contact Aizak, use the contact_aizak tool.
- If the answer is not available from tools or data, say you do not know and offer to connect them with Aizak.

Never:
- overhype
- overexplain on the first pass
- dump too many subsystem names
- present roadmap items as live systems
- claim hidden knowledge that is not in the provided data

Response discipline:
- summary must stand on its own
- expanded should add useful detail, not restate summary
- deep_dive should only appear when the question warrants technical depth
- proof should be concrete and short
- suggested_follow_ups should be highly relevant, not generic
- do not repeat the same phrasing across summary, expanded, and deep_dive
- avoid using the same signature phrases too often

AI workflow explanation:
- Aizak is the primary system architect and builder.
- AI tools assist execution, reasoning, and validation, but do not replace engineering ownership.
- All systems are designed, reviewed, and validated by Aizak before being accepted.
- If asked how Aizak builds systems, explain the structured AI-assisted workflow.
- Emphasize that Aizak remains the architect and decision-maker.
- Present AI tools as accelerators and reasoning partners, not replacements.
- Highlight validation, proof, and control as key parts of the process.
- Avoid framing the work as "AI built it".
- Frame it as "Aizak designed and operated the system, using AI to assist execution and reasoning."

Prompt flow rules:
- Suggested prompts must follow a logical progression from the current answer.
- Do not show unrelated or random prompts.
- Prefer moving from: overview -> detail -> proof -> skepticism -> fit.
- Avoid repeating the same type of question (e.g. tools -> tools -> tools).
- Ensure at least one deeper or more critical question is always suggested.
- If the user asks "Start with overview", suggest broad questions like "Who is Aizak in simple terms?", "What does Aizak actually build?", "What makes Aizak different from a typical engineer?".
- If the user asks "Show me technical depth", suggest technical questions like "What are Aizak's strongest technical skills?", "How does Aizak build reliable AI systems?", "How are Aizak's systems structured?".
- If the user asks "Challenge this candidate", immediately suggest hard/skeptical questions like "What are Aizak's biggest areas to manage?", "Does Aizak over-engineer systems?", "What's not fully built yet?", "Why might this approach fail?".
`;

const INITIAL_PROMPTS = [
  "What is this chatbot and how should I use it?",
  "Who is Aizak in simple terms?",
  "What does Aizak actually build?",
  "Show me the systems Aizak has built",
  "What makes Aizak different from a typical engineer?",
  "How should I evaluate Aizak?"
];

const EXPLORE_PROMPTS = [
  "Start with overview",
  "Show me technical depth",
  "Challenge this candidate",
  "How was this system built using AI?"
];

export default function AgenticCV() {
  const SESSION_MINUTES = 60;
  const WARNING_MINUTES = 5;

  function normalizeUserQuery(input: string) {
    const text = input.trim();
    const lower = text.toLowerCase();

    const likelyRefersToAizak =
      /\b(he|him|his|they|them|their|this candidate|the candidate)\b/.test(lower) &&
      !/\b(she|her|hers|someone else|another person)\b/.test(lower);

    if (likelyRefersToAizak && !/\baizak\b/i.test(text)) {
      return `About Aizak: ${text}`;
    }

    return text;
  }

  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const [currentAccessCode, setCurrentAccessCode] = useState<string | null>(null);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [sessionNow, setSessionNow] = useState<number>(Date.now());
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);

  const [glassBoxMode, setGlassBoxMode] = useState(false);
  const [requestMetrics, setRequestMetrics] = useState({ latency: 0, promptTokens: 0, candidateTokens: 0 });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hi — I’m Aizak’s digital representative. I can help you understand his background, technical strengths, projects, and how he approaches building reliable AI and software systems. Ask naturally, and I’ll keep it clear."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePrompts, setActivePrompts] = useState<string[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 'init-1', timestamp: new Date(), message: 'System initialized.', type: 'info' },
    { id: 'init-2', timestamp: new Date(), message: 'Mounting local profile datasets...', type: 'info' },
    { id: 'init-3', timestamp: new Date(), message: 'Knowledge base ready.', type: 'success' },
    { id: 'init-4', timestamp: new Date(), message: 'Awaiting user query.', type: 'info' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, { id: Math.random().toString(36).substring(7), timestamp: new Date(), message, type }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, logs]);

  useEffect(() => {
    setActivePrompts(INITIAL_PROMPTS);
  }, []);

  useEffect(() => {
    const storedCodes = sessionStorage.getItem("aizak_used_codes");
    if (storedCodes) {
      try {
        const codes = JSON.parse(storedCodes);
        if (Array.isArray(codes) && codes.length > 0) {
          setUsedCodes(codes);
          setCurrentAccessCode(codes[codes.length - 1]);
        }
      } catch (e) {
        // ignore
      }
    }
    const stored = sessionStorage.getItem("aizak_session_started_at");
    if (stored) {
      setSessionStartedAt(Number(stored));
    } else {
      // Start session immediately if not started
      const now = Date.now();
      setSessionStartedAt(now);
      sessionStorage.setItem("aizak_session_started_at", String(now));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sessionEndsAt = sessionStartedAt ? sessionStartedAt + SESSION_MINUTES * 60 * 1000 : null;
  const msRemaining = sessionEndsAt ? sessionEndsAt - sessionNow : null;
  const minutesRemaining = msRemaining !== null ? Math.max(0, Math.ceil(msRemaining / 60000)) : null;

  useEffect(() => {
    if (!sessionStartedAt || !sessionEndsAt) return;

    const remaining = sessionEndsAt - sessionNow;
    setSessionExpired(remaining <= 0);
    setShowExpiryWarning(remaining > 0 && remaining <= WARNING_MINUTES * 60 * 1000);
  }, [sessionStartedAt, sessionEndsAt, sessionNow]);

  const handleSend = async (text: string = input) => {
    if (sessionExpired || !text.trim() || isLoading) return;

    if (!sessionStartedAt) {
      const now = Date.now();
      setSessionStartedAt(now);
      sessionStorage.setItem("aizak_session_started_at", String(now));
    }

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    addLog(`Normalizing query and dispatching to LLM...`, 'action');

    try {
      const normalizedText = normalizeUserQuery(text);
      const contents: any[] = messages
        .filter(m => m.id !== 'welcome')
        .map(m => {
          let textContent = m.content || " ";
          if (m.structuredContent) {
             textContent = m.structuredContent.summary;
             if (m.structuredContent.expanded) {
                 textContent += "\n\n" + m.structuredContent.expanded;
             }
             if (m.structuredContent.deep_dive) {
                 textContent += "\n\n" + m.structuredContent.deep_dive;
             }
             if (m.structuredContent.engineering_choice) {
                 textContent += "\n\nEngineering Choice: " + m.structuredContent.engineering_choice;
             }
          }
          return {
            role: m.role,
            parts: [{ text: textContent }]
          };
        });
      contents.push({ role: 'user', parts: [{ text: normalizedText }] });

      addLog('Evaluating tool routing...', 'action');

      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          expanded: { type: Type.STRING },
          deep_dive: { type: Type.STRING },
          proof: { type: Type.ARRAY, items: { type: Type.STRING } },
          data_nodes_used: { type: Type.ARRAY, items: { type: Type.STRING } },
          intent_detected: { type: Type.STRING },
          confidence: { type: Type.STRING, description: "high, medium, or low confidence" },
          constraint_level: { type: Type.STRING, description: "low, medium, or high" },
          engineering_choice: { type: Type.STRING, description: "Short explanation of the relevant engineering choice, if applicable." },
          project_state: {
            type: Type.OBJECT,
            properties: {
              built: { type: Type.ARRAY, items: { type: Type.STRING } },
              tested: { type: Type.ARRAY, items: { type: Type.STRING } },
              deployed: { type: Type.ARRAY, items: { type: Type.STRING } },
              planned: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          suggested_follow_ups: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary"]
      };

      function fallbackResponse(userInput: string) {
        const lower = userInput.toLowerCase();

        if (/\b(team|collaborate|collaboration|work with others|small team)\b/.test(lower)) {
          return {
            summary: "Yes — Aizak appears to work well in collaborative environments, especially where engineers are expected to think independently and contribute across system design, delivery, and iteration.",
            expanded: "His background is unusual because much of his recent work is solo-built, but his earlier roles involved operations, sales, logistics, training, and cross-functional coordination. He is likely strongest in small, high-trust teams where ownership and technical judgment matter.",
            data_nodes_used: ["fallback.teamwork"],
            intent_detected: "teamwork",
            confidence: "medium",
            suggested_follow_ups: [
              "What kind of team environment suits Aizak best?",
              "Where is Aizak stronger or weaker than a traditional engineer?",
              "Why might Foxbyte be a good fit for Aizak?"
            ]
          };
        }

        if (/\b(good parts|strengths|best at|strongest|edge|different)\b/.test(lower)) {
          return {
            summary: "Aizak’s strongest qualities are systems thinking, technical ownership, reliability-focused design, and the ability to connect architecture to real operational outcomes.",
            expanded: "He looks strongest when a problem spans backend logic, automation, observability, runtime behavior, and product thinking at the same time. He also stands out for being unusually explicit about proof, controls, and built-versus-planned clarity.",
            data_nodes_used: ["fallback.strengths"],
            intent_detected: "strengths",
            confidence: "medium",
            suggested_follow_ups: [
              "What are Aizak's biggest areas to manage?",
              "What systems has Aizak actually built?",
              "What makes Aizak different from a typical engineer?"
            ]
          };
        }

        if (/\b(retrospective|retrospectives|reflective|reflection|reviewing what worked)\b/.test(lower)) {
          return {
            summary: "Aizak appears to be highly retrospective in how he works, especially around system failures, overbuilding risk, and validation discipline.",
            expanded: "A recurring pattern in his work is reviewing what failed, separating built from planned work, and tightening systems after real runtime evidence. He does not appear to treat shipping as the finish line — more as part of an ongoing review and improvement loop.",
            data_nodes_used: ["fallback.retrospective"],
            intent_detected: "retrospective",
            confidence: "medium",
            suggested_follow_ups: [
              "What is an example of something in Aizak's system that didn't work?",
              "Does Aizak over-engineer systems?",
              "How does Aizak improve systems over time?"
            ]
          };
        }

        return {
          summary: "I don’t have a strong, evidence-backed answer for that within this system. That’s something Aizak would be best to answer directly.",
          expanded: "This system uses structured prompts and controlled data injection to ensure reliable, explainable responses. If a specific detail isn't in the dataset, I won't guess. Aizak's work spans automation, runtime infrastructure, orchestration, and operator-facing system design. If you'd like to go deeper on a specific area, direct contact is the best next step.",
          data_nodes_used: ["fallback.general"],
          intent_detected: "unknown",
          confidence: "low",
          suggested_follow_ups: [
            "What does Aizak actually build?",
            "What are Aizak's strongest technical skills?",
            "How can I contact Aizak directly?"
          ]
        };
      }

      const generateWithRetry = async (contentsToGenerate: any[], configToUse: any, retries = 3, delay = 2000) => {
        for (let i = 0; i < retries; i++) {
          try {
            const startTime = performance.now();
            const res = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: contentsToGenerate,
              config: configToUse
            });
            const endTime = performance.now();
            
            if (res.usageMetadata) {
              setRequestMetrics({
                latency: Math.round(endTime - startTime),
                promptTokens: res.usageMetadata.promptTokenCount || 0,
                candidateTokens: res.usageMetadata.candidatesTokenCount || 0
              });
            } else {
              setRequestMetrics(prev => ({ ...prev, latency: Math.round(endTime - startTime) }));
            }
            
            return res;
          } catch (error: any) {
            if ((error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) && i < retries - 1) {
              addLog(`Rate limit hit. Retrying in ${delay/1000}s...`, 'error');
              await new Promise(r => setTimeout(r, delay));
              delay *= 2;
            } else {
              throw error;
            }
          }
        }
        throw new Error("Max retries reached");
      };

      let response = await generateWithRetry(contents, {
        systemInstruction,
        tools,
        temperature: 0.35,
        responseMimeType: "application/json",
        responseSchema
      });

      let callDepth = 0;
      const MAX_DEPTH = 1;

      while (response.functionCalls && response.functionCalls.length > 0 && callDepth < MAX_DEPTH) {
        callDepth++;
        let functionCalls = response.functionCalls;
        let functionResponses: any[] = [];

        for (const call of functionCalls) {
          addLog(`Executing tool: ${call.name}(${JSON.stringify(call.args || {})})`, 'action');
          
          let result;
          if (call.name === 'search_knowledge_base') {
            const query = call.args?.query as string;
            const intent = (call.args?.intent as string) || 'general';
            addLog(`> Fetching local data nodes for topic: '${intent}'`, 'info');
            
            const matches = [];
            const intentLower = intent.toLowerCase();
            
            if (intentLower.includes('project') || intentLower.includes('built') || intentLower.includes('system')) {
              matches.push({ path: "aizakData.flagship_projects", label: "Flagship Projects", relevance: "high", data: aizakData.flagship_projects });
            }
            if (intentLower.includes('skill') || intentLower.includes('tech') || intentLower.includes('backend')) {
              matches.push({ path: "aizakData.capabilities", label: "Capabilities", relevance: "high", data: aizakData.capabilities });
            }
            if (intentLower.includes('fit') || intentLower.includes('role') || intentLower.includes('market')) {
              matches.push({ path: "marketAssessment.role_fit", label: "Role Fit", relevance: "high", data: marketAssessment.role_fit });
              matches.push({ path: "marketAssessment.employer_perception", label: "Employer Perception", relevance: "medium", data: marketAssessment.employer_perception });
            }
            if (
              intentLower.includes('team') ||
              intentLower.includes('collaborat') ||
              intentLower.includes('people') ||
              intentLower.includes('fit with others')
            ) {
              matches.push({ path: "aizakData.working_style", label: "Working Style", relevance: "high", data: aizakData.working_style });
              matches.push({ path: "marketAssessment.role_fit", label: "Role Fit", relevance: "medium", data: marketAssessment.role_fit });
              matches.push({ path: "aizakData.work_experience", label: "Work Experience", relevance: "medium", data: aizakData.work_experience });
            }
            if (
              intentLower.includes('strength') || 
              intentLower.includes('different') || 
              intentLower.includes('edge') ||
              intentLower.includes('good') ||
              intentLower.includes('best') ||
              intentLower.includes('strong')
            ) {
              matches.push({ path: "marketAssessment.strengths", label: "Strengths", relevance: "high", data: marketAssessment.strengths });
              matches.push({ path: "aizakData.capabilities", label: "Capabilities", relevance: "medium", data: aizakData.capabilities });
            }
            if (intentLower.includes('weakness') || intentLower.includes('manage') || intentLower.includes('constraint') || intentLower.includes('risk') || intentLower.includes('improve') || intentLower.includes('gap') || intentLower.includes('opportunity') || intentLower.includes('skeptical') || intentLower.includes('concern') || intentLower.includes('hesitate')) {
              matches.push({ path: "marketAssessment.areas_to_manage_and_constraints", label: "Areas to Manage & Constraints", relevance: "high", data: (marketAssessment as any).areas_to_manage_and_constraints });
              matches.push({ path: "aizakData.skeptical_questions", label: "Skeptical Questions", relevance: "high", data: (aizakData as any).skeptical_questions });
            }
            if (intentLower.includes('chatbot') || intentLower.includes('how was this built') || intentLower.includes('where does this information come from') || intentLower.includes('generated') || intentLower.includes('real')) {
              matches.push({ path: "aizakData.chatbot_context", label: "Chatbot Context", relevance: "high", data: (aizakData as any).chatbot_context });
            }
            if (intentLower.includes('interview') || intentLower.includes('approach') || intentLower.includes('think') || intentLower.includes('manage') || intentLower.includes('bandwidth') || intentLower.includes('prioritise') || intentLower.includes('workflow') || intentLower.includes('ai')) {
              matches.push({ path: "aizakData.interview_answers", label: "Interview Answers", relevance: "high", data: aizakData.interview_answers });
              matches.push({ path: "aizakData.working_style", label: "Working Style", relevance: "medium", data: aizakData.working_style });
              matches.push({ path: "aizakData.execution_style", label: "Execution Style", relevance: "high", data: (aizakData as any).execution_style });
              matches.push({ path: "aizakData.development_workflow", label: "Development Workflow", relevance: "high", data: (aizakData as any).development_workflow });
            }
            if (intentLower.includes('bio') || intentLower.includes('who')) {
              matches.push({ path: "aizakData.bio", label: "Bio", relevance: "high", data: aizakData.bio });
              matches.push({ path: "aizakData.positioning", label: "Positioning", relevance: "high", data: aizakData.positioning });
            }
            if (intentLower.includes('tool') || intentLower.includes('platform') || intentLower.includes('stack') || intentLower.includes('use')) {
              matches.push({ path: "toolingMatrix", label: "Tooling Matrix", relevance: "high", data: toolingMatrix });
              matches.push({ path: "aizakData.aiNativeTooling", label: "AI Native Tooling", relevance: "high", data: (aizakData as any).aiNativeTooling });
            }
            if (intentLower.includes('deploy') || intentLower.includes('host') || intentLower.includes('infra') || intentLower.includes('server')) {
              matches.push({ path: "aizakData.deploymentSurfaces", label: "Deployment Surfaces", relevance: "high", data: (aizakData as any).deploymentSurfaces });
            }
            if (intentLower.includes('workflow') || intentLower.includes('business') || intentLower.includes('ops') || intentLower.includes('process')) {
              matches.push({ path: "aizakData.workflowSurfaces", label: "Workflow Surfaces", relevance: "high", data: (aizakData as any).workflowSurfaces });
              matches.push({ path: "aizakData.businessSystemsExposure", label: "Business Systems Exposure", relevance: "high", data: (aizakData as any).businessSystemsExposure });
            }
            
            if (matches.length === 0) {
              matches.push({ path: "aizakData.bio.summary", label: "Bio Summary", relevance: "medium", data: aizakData.bio.summary });
              matches.push({ path: "aizakData.capabilities.summary", label: "Core Capabilities", relevance: "medium", data: aizakData.capabilities.summary });
            }

            result = { matches };
            addLog(`> Matched relevant profile sections.`, 'success');
          } else if (call.name === 'get_portfolio_projects') {
            addLog(`> Retrieving projects from local portfolio...`, 'info');
            result = { projects: aizakData.flagship_projects };
            addLog(`> Retrieved projects from local portfolio.`, 'success');
          } else if (call.name === 'contact_aizak') {
            addLog(`> Retrieving contact information...`, 'info');
            result = { status: 'Available for contact', contact_info: aizakData.contact, message: 'Please reach out via email or phone to schedule a chat.' };
            addLog(`> Retrieved contact information.`, 'success');
          } else {
            result = { error: "Unknown tool" };
          }

          functionResponses.push({
            id: call.id,
            name: call.name,
            response: result
          });
        }

        addLog(`Injecting data nodes into context window...`, 'action');

        contents.push({
            role: 'model',
            parts: response.candidates?.[0]?.content?.parts || []
        });
        
        contents.push({
            role: 'user',
            parts: functionResponses.map(fr => ({
                functionResponse: {
                    id: fr.id,
                    name: fr.name,
                    response: fr.response
                }
            }))
        });

        response = await generateWithRetry(contents, {
          systemInstruction,
          temperature: 0.35,
          responseMimeType: "application/json",
          responseSchema
        });
      }

      if (callDepth === 0) {
         addLog(`No external tools required. Structured answer assembled.`, 'action');
      } else if (response.functionCalls && response.functionCalls.length > 0) {
         addLog(`Max tool execution depth reached. Structured answer assembled.`, 'action');
      }

      let parsed;
      if (response.text) {
        try {
          parsed = JSON.parse(response.text);
        } catch (e) {
          parsed = fallbackResponse(normalizedText);
          addLog(`Failed to parse structured response, using fallback.`, 'error');
        }
      } else {
        parsed = fallbackResponse(normalizedText);
        addLog(`Response text was empty, using fallback.`, 'error');
      }

      if (!parsed.summary) {
        parsed = fallbackResponse(normalizedText);
        addLog(`Response missing summary, using fallback.`, 'error');
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', structuredContent: parsed }]);
      addLog(`Response generated and structured successfully.`, 'success');
      
      if (parsed.suggested_follow_ups && parsed.suggested_follow_ups.length > 0) {
        setActivePrompts(parsed.suggested_follow_ups);
      } else {
        setActivePrompts(INITIAL_PROMPTS.slice(0, 3));
      }

    } catch (error: any) {
      console.error("Error generating response:", error);
      addLog(`Error: ${error.message}`, 'error');
      
      let errorMessage = "I encountered an error while processing your request. Please try again.";
      if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('429')) {
        errorMessage = "I'm currently experiencing high traffic and have hit my API rate limit. Please wait a moment and try again.";
      }
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: errorMessage }]);
      setActivePrompts(INITIAL_PROMPTS.slice(0, 3));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticate = (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    if (/^EVAL-\d+$/.test(normalizedCode)) {
      if (usedCodes.includes(normalizedCode)) {
        setAuthError('This access code has already been used.');
        return;
      }
      
      const newUsedCodes = [...usedCodes, normalizedCode];
      setUsedCodes(newUsedCodes);
      setCurrentAccessCode(normalizedCode);
      sessionStorage.setItem("aizak_used_codes", JSON.stringify(newUsedCodes));
      
      setAccessCodeInput('');
      setAuthError('');
      
      const now = Date.now();
      setSessionStartedAt(now);
      sessionStorage.setItem("aizak_session_started_at", String(now));
      
      if (sessionExpired) {
        addLog(`Session extended using code: ${normalizedCode}`, 'success');
      } else {
        addLog(`Session authenticated using code: ${normalizedCode}`, 'success');
      }
    } else {
      setAuthError('Invalid access code. Please use format EVAL-XX.');
    }
  };



  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0B0D10] text-[#E6EAF0] font-sans">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E232A_1px,transparent_1px),linear-gradient(to_bottom,#1E232A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Left Pane: Partnership Focus (Chat) */}
      <div className="flex-1 flex flex-col border-r border-[#1E232A] relative bg-[#0B0D10]/80 backdrop-blur-sm z-10">
        {/* Header */}
        <header className="p-6 border-b border-[#1E232A] flex items-center justify-between bg-[#0B0D10]/90">
          <div>
            <div className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-widest mb-1">Guided Evaluation Interface</div>
            <h1 className="text-xl font-medium tracking-tight text-[#E6EAF0] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#3B82F6]" />
              Aizak
            </h1>
            <p className="text-sm text-[#98A2B3] mt-1">Candidate Evaluation System</p>
            <p className="text-xs text-[#98A2B3]/70 mt-0.5">Explore how I think, build, and make decisions.</p>
            <div className="mt-4 p-3 bg-[#111418] border border-[#1E232A] rounded-md max-w-xl">
              <div className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-widest mb-1.5">Why this exists</div>
              <p className="text-xs text-[#98A2B3] leading-relaxed">
                This system exists to replace a static CV with something closer to how real work is evaluated — through interaction, questioning, and observable reasoning. It was built using AI as a high-leverage execution tool, with Aizak acting as the architect, validator, and final decision-maker.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGlassBoxMode(!glassBoxMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors border ${
                glassBoxMode 
                  ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' 
                  : 'bg-[#111418] text-[#98A2B3] border-[#1E232A] hover:text-[#E6EAF0]'
              }`}
            >
              {glassBoxMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Execution Trace
            </button>
            <button 
              onClick={() => handleSend("I'd like to book a coffee chat with Aizak.")}
              className="flex items-center gap-2 px-4 py-2 bg-[#E6EAF0] text-[#0B0D10] rounded-md text-sm font-medium hover:bg-white transition-colors"
            >
              <Coffee className="w-4 h-4" />
              Book Coffee
            </button>
          </div>
        </header>

        {/* System Status Strip */}
        {sessionStartedAt && !sessionExpired && (
          <div className="border-b border-[#1E232A] bg-[#111418] px-6 py-2 text-[10px] font-mono text-[#98A2B3] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="uppercase tracking-wider">
                  {currentAccessCode ? `SESSION: ACTIVE • MODE: EXTENDED • ACCESS: ${currentAccessCode}` : 'SESSION: ACTIVE'}
                </span>
              </div>
              {minutesRemaining !== null && (
                <>
                  <span className="text-[#1E232A]">|</span>
                  <span className="text-[#E6EAF0]">T-{minutesRemaining}M REMAINING</span>
                </>
              )}
            </div>
            <div className="text-[#98A2B3]/70 hidden sm:block uppercase tracking-wider">
              This evaluation is intentionally time-bounded to reflect real-world system constraints.
            </div>
          </div>
        )}

        {showExpiryWarning && !sessionExpired && (
          <div className="border-b border-[#F59E0B]/30 bg-[#F59E0B]/10 px-6 py-2 text-[10px] font-mono text-[#F59E0B] flex items-center gap-2 uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            Warning: Session approaching termination. Direct contact recommended for extended inquiry.
          </div>
        )}

        {sessionExpired && (
          <div className="mx-6 mt-4 rounded-md border border-[#1E232A] bg-[#111418] px-4 py-4">
            <div className="text-sm text-[#E6EAF0] font-medium font-mono uppercase tracking-wider">Guided session complete</div>
            <p className="mt-2 text-sm text-[#98A2B3]">
              This system is intentionally time-bounded to keep the evaluation focused and reflect real-world system constraints.
            </p>
            <p className="mt-2 text-sm text-[#98A2B3]">
              If you&apos;d like to continue exploring:
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleSend("I'd like to book a coffee chat with Aizak.")}
                className="px-4 py-2 bg-[#E6EAF0] text-[#0B0D10] rounded-md text-sm font-medium hover:bg-white transition-colors"
              >
                Book Coffee
              </button>
              <a
                href="mailto:aizaksalanoa@gmail.com"
                className="px-4 py-2 bg-[#111418] border border-[#1E232A] text-[#E6EAF0] rounded-md text-sm hover:border-[#3B82F6]/50 transition-colors"
              >
                Email Aizak
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1E232A]">
              <p className="text-xs text-[#98A2B3] mb-3 uppercase tracking-wider font-mono">—or—</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAuthenticate(accessCodeInput);
              }} className="flex items-start gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={accessCodeInput}
                    onChange={(e) => { setAccessCodeInput(e.target.value); setAuthError(''); }}
                    placeholder="Enter access code to continue (e.g., EVAL-01)"
                    className="w-full bg-[#0B0D10] border border-[#1E232A] rounded-md px-3 py-2 text-sm text-[#E6EAF0] placeholder-[#98A2B3]/50 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-mono"
                  />
                  {authError && <p className="text-xs text-[#EF4444] mt-1">{authError}</p>}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Extend Session
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#111418] border border-[#1E232A] text-[#98A2B3]' : 'bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6]'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-mono text-[#98A2B3] uppercase tracking-wider px-1">
                    {msg.role === 'user' ? 'Query Submitted' : 'System Output'}
                  </span>
                  <div className={`p-4 rounded-md text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#111418] text-[#E6EAF0] border border-[#1E232A]' 
                      : 'bg-[#0E1116] border border-[#1E232A] border-l-2 border-l-[#3B82F6] text-[#E6EAF0]'
                  }`}>
                    {msg.content && msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line.split(/(\*\*.*?\*\*)/).map((part, j) => 
                          part.startsWith('**') && part.endsWith('**') 
                            ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong> 
                            : part
                        )}
                      </p>
                    ))}
                    {msg.structuredContent && (
                      <div className="flex flex-col gap-3">
                        <p className="text-[#E6EAF0]">{msg.structuredContent.summary}</p>
                        
                        {msg.structuredContent.expanded && (
                          <details className="group">
                            <summary className="cursor-pointer text-xs font-mono uppercase tracking-wider text-[#3B82F6] hover:text-[#1D4ED8] transition-colors list-none flex items-center gap-1 select-none">
                              <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                              Expand Explanation
                            </summary>
                            <p className="mt-2 text-[#98A2B3] text-sm pl-4 border-l-2 border-[#1E232A]">{msg.structuredContent.expanded}</p>
                          </details>
                        )}

                        {msg.structuredContent.deep_dive && (
                          <details className="group">
                            <summary className="cursor-pointer text-xs font-mono uppercase tracking-wider text-[#10B981] hover:text-[#10B981]/80 transition-colors list-none flex items-center gap-1 select-none">
                              <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                              Technical Detail
                            </summary>
                            <p className="mt-2 text-[#98A2B3] text-sm pl-4 border-l-2 border-[#1E232A]">{msg.structuredContent.deep_dive}</p>
                          </details>
                        )}

                        {msg.structuredContent.engineering_choice && (
                          <div className="mt-4 p-4 bg-[#111418] rounded-md border border-[#1E232A]">
                            <div className="text-[10px] font-mono text-[#3B82F6] mb-2 uppercase tracking-widest">Engineering Choice</div>
                            <div className="text-sm text-[#E6EAF0] leading-relaxed">{msg.structuredContent.engineering_choice}</div>
                          </div>
                        )}

                        {msg.structuredContent.proof && msg.structuredContent.proof.length > 0 && (
                          <div className="mt-2 pt-3 border-t border-[#1E232A]">
                            <span className="text-[10px] font-mono text-[#98A2B3] uppercase tracking-widest">Proof Signals</span>
                            <ul className="mt-2 flex flex-wrap gap-2">
                              {msg.structuredContent.proof.map((p, i) => (
                                <li key={i} className="text-xs px-2.5 py-1 bg-[#111418] border border-[#1E232A] rounded-md text-[#E6EAF0]">{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {msg.structuredContent.confidence === 'low' && (
                          <div className="mt-3 text-xs font-mono text-[#F59E0B] border-t border-[#1E232A] pt-3">
                            {'>'} LOW CONFIDENCE SIGNAL. Direct contact recommended for specific details.
                          </div>
                        )}

                        {glassBoxMode && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-3 bg-[#0B0D10] border border-[#1E232A] rounded-md font-mono text-[10px] text-[#98A2B3] overflow-hidden"
                          >
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#1E232A]">
                              <Terminal className="w-3 h-3 text-[#3B82F6]" />
                              <span className="uppercase tracking-widest font-semibold text-[#E6EAF0]">Execution Trace</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-y-1.5">
                              <span className="text-[#98A2B3]">Intent:</span>
                              <span className="text-[#3B82F6]">{msg.structuredContent.intent_detected}</span>
                              <span className="text-[#98A2B3]">Confidence:</span>
                              <span className={`capitalize ${
                                msg.structuredContent.confidence === 'high' ? 'text-[#10B981]' : 
                                msg.structuredContent.confidence === 'medium' ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                              }`}>
                                {msg.structuredContent.confidence}
                                <span className="text-[#98A2B3]/70 lowercase text-[9px] ml-1.5">(based on structured match)</span>
                              </span>
                              {msg.structuredContent.constraint_level && (
                                <>
                                  <span className="text-[#98A2B3]">Constraint:</span>
                                  <span className={`capitalize ${
                                    msg.structuredContent.constraint_level === 'low' ? 'text-[#10B981]' : 
                                    msg.structuredContent.constraint_level === 'medium' ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                                  }`}>{msg.structuredContent.constraint_level}</span>
                                </>
                              )}
                              <span className="text-[#98A2B3]">Data Nodes:</span>
                              <span className="text-[#10B981]">{msg.structuredContent.data_nodes_used?.join(', ') || 'None'}</span>
                              {msg.structuredContent.project_state && Object.keys(msg.structuredContent.project_state).length > 0 && (
                                <>
                                  <span className="text-[#98A2B3]">State:</span>
                                  <span className="text-[#98A2B3]">
                                    {Object.entries(msg.structuredContent.project_state)
                                      .filter(([_, items]) => Array.isArray(items) && items.length > 0)
                                      .map(([state, items]) => `${state}: ${(items as string[]).length} items`)
                                      .join(' | ')}
                                  </span>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-md bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-md bg-[#0E1116] border border-[#1E232A] border-l-2 border-l-[#3B82F6] flex items-center gap-2 h-[52px]">
                <div className="w-2 h-4 bg-[#3B82F6] animate-pulse" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#0B0D10] border-t border-[#1E232A] z-10">
          {!isLoading && !sessionExpired && (
            <div className="mb-4 space-y-4">
              <div>
                <div className="text-[10px] font-mono text-[#98A2B3] uppercase tracking-widest mb-2">Evaluation Paths</div>
                <div className="flex flex-wrap gap-2">
                  {EXPLORE_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-xs px-3 py-1.5 bg-[#111418] border border-[#1E232A] rounded-md text-[#E6EAF0] hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 transition-colors text-left font-medium flex items-center gap-1.5"
                    >
                      <Briefcase className="w-3 h-3 text-[#3B82F6]" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {activePrompts.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono text-[#98A2B3] uppercase tracking-widest mb-2">Suggested Queries</div>
                  <div className="flex flex-wrap gap-2">
                    {activePrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="text-xs px-3 py-1.5 bg-[#111418] border border-[#1E232A] rounded-md text-[#98A2B3] hover:text-[#E6EAF0] hover:border-[#98A2B3]/50 transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter query (e.g., 'What is his approach to system design?')"
              className="w-full bg-[#111418] border border-[#1E232A] rounded-md py-4 pl-4 pr-12 text-sm text-[#E6EAF0] placeholder:text-[#98A2B3]/50 focus:outline-none focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              disabled={isLoading || sessionExpired}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || sessionExpired}
              className="absolute right-2 p-2 text-[#98A2B3] hover:text-[#3B82F6] disabled:opacity-50 disabled:hover:text-[#98A2B3] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Pane: Engineering Focus (Terminal) */}
      <div className="w-[400px] lg:w-[500px] flex flex-col bg-[#0B0D10] border-l border-[#1E232A] font-mono text-xs relative hidden md:flex z-10">
        <header className="p-4 border-b border-[#1E232A] flex items-center gap-2 bg-[#0E1116]">
          <Terminal className="w-4 h-4 text-[#10B981]" />
          <span className="text-[#E6EAF0] uppercase tracking-widest font-semibold">Execution Feed</span>
          <div className="ml-auto flex gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#1E232A]'}`} style={{ animationDelay: '0ms' }} />
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#1E232A]'}`} style={{ animationDelay: '150ms' }} />
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#1E232A]'}`} style={{ animationDelay: '300ms' }} />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 leading-relaxed"
              >
                <span className="text-[#98A2B3]/50 shrink-0 select-none" suppressHydrationWarning>
                  {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                </span>
                <span className={`
                  ${log.type === 'info' ? 'text-[#98A2B3]' : ''}
                  ${log.type === 'action' ? 'text-[#3B82F6]' : ''}
                  ${log.type === 'success' ? 'text-[#10B981]' : ''}
                  ${log.type === 'error' ? 'text-[#EF4444]' : ''}
                `}>
                  {log.type === 'action' ? '> ' : ''}{log.message}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>

        {/* System Telemetry & Architecture */}
        <div className="p-4 border-t border-[#1E232A] bg-[#0E1116] flex flex-col gap-4">
          <div>
            <div className="text-[10px] text-[#98A2B3] uppercase tracking-widest mb-2 font-semibold flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-[#F59E0B] animate-pulse' : 'bg-[#10B981]'}`} />
              Last Request Metrics
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="bg-[#111418] p-2 rounded-md border border-[#1E232A]">
                <div className="text-[#98A2B3] mb-1">LATENCY</div>
                <div className="text-[#F59E0B]">{requestMetrics.latency > 0 ? `${requestMetrics.latency}ms` : '--'}</div>
              </div>
              <div className="bg-[#111418] p-2 rounded-md border border-[#1E232A]">
                <div className="text-[#98A2B3] mb-1">PROMPT TOKENS</div>
                <div className="text-[#3B82F6]">{requestMetrics.promptTokens > 0 ? requestMetrics.promptTokens : '--'}</div>
              </div>
              <div className="bg-[#111418] p-2 rounded-md border border-[#1E232A]">
                <div className="text-[#98A2B3] mb-1">OUTPUT TOKENS</div>
                <div className="text-[#10B981]">{requestMetrics.candidateTokens > 0 ? requestMetrics.candidateTokens : '--'}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#98A2B3] uppercase tracking-widest mb-3 font-semibold">System Path</div>
            <div className="flex items-center justify-between text-[#98A2B3] text-[10px]">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-md border border-[#1E232A] flex items-center justify-center bg-[#111418]">
                  <User className="w-3 h-3" />
                </div>
                <span className="text-center leading-tight">User<br/>Query</span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#1E232A]" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-md border border-[#3B82F6]/30 flex items-center justify-center bg-[#3B82F6]/10 text-[#3B82F6]">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="text-center leading-tight">LLM<br/>(Intent)</span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#1E232A]" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-md border border-[#10B981]/30 flex items-center justify-center bg-[#10B981]/10 text-[#10B981]">
                  <Terminal className="w-3 h-3" />
                </div>
                <span className="text-center leading-tight">Local<br/>KB</span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#1E232A]" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-md border border-[#8B5CF6]/30 flex items-center justify-center bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="text-center leading-tight">LLM<br/>(Synthesis)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
