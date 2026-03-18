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
    { id: 'init-2', timestamp: new Date(), message: 'Loading structured profile datasets...', type: 'info' },
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

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    addLog(`Analyzing query for intent: "${text}"`, 'action');

    try {
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
      contents.push({ role: 'user', parts: [{ text }] });

      addLog(`Querying knowledge base and routing to tools...`, 'action');

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
        return {
          summary: "Aizak approaches complex projects by structuring them into clear systems, prioritising the highest-value components first, and maintaining visibility through logging and monitoring.",
          expanded: "He tends to break systems into components, focus on critical execution paths, and use observability to avoid losing control of complexity. While he can lean toward over-architecting, he is aware of this and benefits from clear sequencing and defined outcomes.",
          data_nodes_used: ["fallback.synthesized"],
          intent_detected: "general",
          confidence: "medium",
          suggested_follow_ups: [
            "What are Aizak's biggest strengths?",
            "Does Aizak overbuild systems?",
            "How does Aizak prioritise work?"
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
            addLog(`> Searching local knowledge base for intent: '${intent}'`, 'info');
            
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
            if (intentLower.includes('strength') || intentLower.includes('different') || intentLower.includes('edge')) {
              matches.push({ path: "marketAssessment.strengths", label: "Strengths", relevance: "high", data: marketAssessment.strengths });
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
            addLog(`> Retrieved ${aizakData.flagship_projects.length} projects.`, 'success');
          } else if (call.name === 'contact_aizak') {
            addLog(`> Retrieving contact information...`, 'info');
            result = { status: 'Available for contact', contact_info: aizakData.contact, message: 'Please reach out via email or phone to schedule a chat.' };
            addLog(`> Contact details retrieved.`, 'success');
          } else {
            result = { error: "Unknown tool" };
          }

          functionResponses.push({
            id: call.id,
            name: call.name,
            response: result
          });
        }

        addLog(`Selected response data nodes...`, 'action');

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
          parsed = fallbackResponse(text);
        }
      } else {
        parsed = fallbackResponse(text);
        addLog(`Response text was empty, using fallback.`, 'error');
      }

      if (!parsed.summary) {
        parsed = fallbackResponse(text);
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

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Left Pane: Partnership Focus (Chat) */}
      <div className="flex-1 flex flex-col border-r border-zinc-800 relative bg-zinc-950/50">
        {/* Header */}
        <header className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 z-10">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-zinc-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              Aizak
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Agentic CV Concierge</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGlassBoxMode(!glassBoxMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                glassBoxMode 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {glassBoxMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Glass Box
            </button>
            <button 
              onClick={() => handleSend("I'd like to book a coffee chat with Aizak.")}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              <Coffee className="w-4 h-4" />
              Book Coffee
            </button>
          </div>
        </header>

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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-300'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-zinc-500 font-medium px-1">
                    {msg.role === 'user' ? 'You' : 'Aizak Agent'}
                  </span>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-500/10 text-indigo-100 border border-indigo-500/20 rounded-tr-sm' 
                      : 'bg-zinc-900 border border-zinc-800 rounded-tl-sm text-zinc-300'
                  }`}>
                    {msg.content && msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line.split(/(\*\*.*?\*\*)/).map((part, j) => 
                          part.startsWith('**') && part.endsWith('**') 
                            ? <strong key={j} className="text-zinc-100 font-semibold">{part.slice(2, -2)}</strong> 
                            : part
                        )}
                      </p>
                    ))}
                    {msg.structuredContent && (
                      <div className="flex flex-col gap-3">
                        <p className="text-zinc-100">{msg.structuredContent.summary}</p>
                        
                        {msg.structuredContent.expanded && (
                          <details className="group">
                            <summary className="cursor-pointer text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors list-none flex items-center gap-1 select-none">
                              <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                              More detail
                            </summary>
                            <p className="mt-2 text-zinc-300 text-sm pl-4 border-l-2 border-zinc-800">{msg.structuredContent.expanded}</p>
                          </details>
                        )}

                        {msg.structuredContent.deep_dive && (
                          <details className="group">
                            <summary className="cursor-pointer text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors list-none flex items-center gap-1 select-none">
                              <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                              Deep dive
                            </summary>
                            <p className="mt-2 text-zinc-300 text-sm pl-4 border-l-2 border-zinc-800">{msg.structuredContent.deep_dive}</p>
                          </details>
                        )}

                        {msg.structuredContent.engineering_choice && (
                          <div className="mt-4 p-4 bg-blue-950/30 rounded-lg border border-blue-900/50">
                            <div className="text-xs font-mono text-blue-500/70 mb-2 uppercase tracking-wider">Engineering Choice</div>
                            <div className="text-sm text-zinc-300 leading-relaxed">{msg.structuredContent.engineering_choice}</div>
                          </div>
                        )}

                        {msg.structuredContent.proof && msg.structuredContent.proof.length > 0 && (
                          <div className="mt-2 pt-3 border-t border-zinc-800/50">
                            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Proof & Evidence</span>
                            <ul className="mt-2 flex flex-wrap gap-2">
                              {msg.structuredContent.proof.map((p, i) => (
                                <li key={i} className="text-xs px-2.5 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-md text-zinc-300">{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {glassBoxMode && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-3 bg-black/40 border border-zinc-800 rounded-lg font-mono text-[10px] text-zinc-500 overflow-hidden"
                          >
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800/50">
                              <Terminal className="w-3 h-3 text-zinc-400" />
                              <span className="uppercase tracking-wider font-semibold text-zinc-400">Glass Box Diagnostics</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-y-1.5">
                              <span className="text-zinc-600">Intent:</span>
                              <span className="text-indigo-400/80">{msg.structuredContent.intent_detected}</span>
                              <span className="text-zinc-600">Confidence:</span>
                              <span className={`capitalize ${
                                msg.structuredContent.confidence === 'high' ? 'text-emerald-400/80' : 
                                msg.structuredContent.confidence === 'medium' ? 'text-amber-400/80' : 'text-red-400/80'
                              }`}>{msg.structuredContent.confidence}</span>
                              {msg.structuredContent.constraint_level && (
                                <>
                                  <span className="text-zinc-600">Constraint Level:</span>
                                  <span className={`capitalize ${
                                    msg.structuredContent.constraint_level === 'low' ? 'text-emerald-400/80' : 
                                    msg.structuredContent.constraint_level === 'medium' ? 'text-amber-400/80' : 'text-red-400/80'
                                  }`}>{msg.structuredContent.constraint_level}</span>
                                </>
                              )}
                              <span className="text-zinc-600">Data Nodes:</span>
                              <span className="text-emerald-400/80">{msg.structuredContent.data_nodes_used?.join(', ') || 'None'}</span>
                              {msg.structuredContent.project_state && Object.keys(msg.structuredContent.project_state).length > 0 && (
                                <>
                                  <span className="text-zinc-600">Project State:</span>
                                  <span className="text-zinc-400/80">
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
              <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 rounded-tl-sm flex items-center gap-2 h-[52px]">
                <div className="w-2 h-4 bg-indigo-400 animate-pulse" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800">
          {!isLoading && (
            <div className="mb-4 space-y-4">
              <div>
                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Explore like an interviewer</div>
                <div className="flex flex-wrap gap-2">
                  {EXPLORE_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-xs px-3 py-1.5 bg-indigo-950/30 border border-indigo-900/50 rounded-md text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/50 transition-colors text-left font-medium flex items-center gap-1.5"
                    >
                      <Briefcase className="w-3 h-3" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {activePrompts.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Suggested</div>
                  <div className="flex flex-wrap gap-2">
                    {activePrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="text-xs px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors text-left"
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
              placeholder="Ask about Aizak's experience, skills, or ROI..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-4 pr-12 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 text-zinc-400 hover:text-zinc-100 disabled:opacity-50 disabled:hover:text-zinc-400 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Pane: Engineering Focus (Terminal) */}
      <div className="w-[400px] lg:w-[500px] flex flex-col bg-[#0a0a0a] border-l border-zinc-800 font-mono text-xs relative hidden md:flex">
        <header className="p-4 border-b border-zinc-800 flex items-center gap-2 bg-[#0a0a0a] z-10">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="text-zinc-400 uppercase tracking-wider font-semibold">Live Logic Feed</span>
          <div className="ml-auto flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 leading-relaxed"
              >
                <span className="text-zinc-600 shrink-0 select-none" suppressHydrationWarning>
                  {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                </span>
                <span className={`
                  ${log.type === 'info' ? 'text-zinc-400' : ''}
                  ${log.type === 'action' ? 'text-indigo-400' : ''}
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'error' ? 'text-red-400' : ''}
                `}>
                  {log.type === 'action' ? '> ' : ''}{log.message}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>

        {/* System Telemetry & Architecture */}
        <div className="p-4 border-t border-zinc-800 bg-[#0c0c0c] flex flex-col gap-4">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-semibold flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              Last Request Metrics
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
                <div className="text-zinc-500 mb-1">LATENCY</div>
                <div className="text-amber-400">{requestMetrics.latency > 0 ? `${requestMetrics.latency}ms` : '--'}</div>
              </div>
              <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
                <div className="text-zinc-500 mb-1">PROMPT TOKENS</div>
                <div className="text-indigo-400">{requestMetrics.promptTokens > 0 ? requestMetrics.promptTokens : '--'}</div>
              </div>
              <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
                <div className="text-zinc-500 mb-1">OUTPUT TOKENS</div>
                <div className="text-emerald-400">{requestMetrics.candidateTokens > 0 ? requestMetrics.candidateTokens : '--'}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3 font-semibold">Answer Flow</div>
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg border border-zinc-700 flex items-center justify-center bg-zinc-900/50">
                  <User className="w-3 h-3" />
                </div>
                <span className="text-center leading-tight">User<br/>Query</span>
              </div>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg border border-indigo-500/30 flex items-center justify-center bg-indigo-500/10 text-indigo-400">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="text-center leading-tight">LLM<br/>(Intent)</span>
              </div>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 text-emerald-400">
                  <Terminal className="w-3 h-3" />
                </div>
                <span className="text-center leading-tight">Local<br/>KB</span>
              </div>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg border border-purple-500/30 flex items-center justify-center bg-purple-500/10 text-purple-400">
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
