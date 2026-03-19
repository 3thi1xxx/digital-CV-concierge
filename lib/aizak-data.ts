export const aizakData = {
  contact: {
    email: "aizaksalanoa@gmail.com",
    phone: "021-159-7388",
    location: "Napier, NZ"
  },

  bio: {
    name: "Aizak",

    titles: {
      safest: "AI & Software Engineer",
      broad: "Systems Engineer focused on AI Automation, Reliability, and Real-Time Systems",
      stronger:
        "Systems-focused engineer and product builder specializing in reliable AI automation, operator-grade tooling, and real-time decision infrastructure"
    },

    summary:
      "Aizak is a systems-focused engineer and solo builder working across AI automation, backend/platform systems, observability, and real-time decision infrastructure. He builds systems that are designed to run under real conditions, not just in demos.",

    expanded:
      "His strongest work sits at the intersection of backend logic, automation workflows, APIs, operator tooling, and governed AI behavior. He focuses on making complex systems reliable, auditable, and understandable through structured logs, explicit control paths, and clear operational boundaries.",

    deep_dive:
      "Rather than treating AI as a black box, Aizak designs systems where inputs, context, execution paths, and outputs can all be reasoned about. His work often combines orchestration, event pipelines, proof logging, trust-aware execution, runtime visibility, and real-time data flows so the system can be controlled and improved rather than merely observed.",

    money_sentence:
      "I build auditable automation and real-time decision systems for complex, failure-sensitive workflows, with a focus on reliability, operator control, and governed AI execution.",

    interview_versions: {
      "15_second":
        "I’m a systems-focused engineer and product builder. Most of my work sits at the intersection of AI automation, reliability, and real-time decision systems. I care a lot about auditability, guardrails, and making complex systems operable by humans.",

      "30_second":
        "I build complex automation systems that have to work under real conditions, not just in demos. My strength is designing the whole control loop: the core logic, the trust boundaries, the proof/logging layer, recovery paths, and the operator tooling around it. A lot of my recent work has been around governed AI workflows, agent orchestration, and real-time trading infrastructure.",

      "60_second":
        "My background is strongest in building real-world automation systems where reliability matters. I’ve spent a lot of time designing AI-assisted workflows and trading infrastructure with explicit guardrails, proof logging, deterministic behavior where possible, and clear operator control. I’m strongest when a problem is messy, cross-functional, and doesn’t fit neatly into one box — where you need backend logic, infrastructure, orchestration, observability, and product thinking all working together."
    }
  },

  positioning: {
    primary_lane: [
      "Reliable AI automation",
      "Operator-safe real-time systems",
      "Proof, control, and recovery built into execution"
    ],

    external_identity: [
      "AI systems / reliability builder",
      "Backend and platform engineer",
      "Automation systems engineer",
      "Operator-focused systems engineer",
      "Founding/staff-style builder for messy zero-to-one systems"
    ],

    not_this: [
      "Just a chatbot builder",
      "Just a prompt engineer",
      "Just a generic full-stack developer",
      "AI hype without system design"
    ],

    best_fit_roles: [
      "AI & Software Engineer",
      "AI Platform Engineer",
      "Automation Systems Engineer",
      "Applied AI Engineer",
      "Backend / Platform Engineer",
      "AI Reliability Engineer",
      "Founding Engineer",
      "Technical Product Architect",
      "Agent Systems Engineer"
    ]
  },

  capabilities: {
    summary: [
      "Backend and platform engineering",
      "APIs and service integration",
      "Automation pipelines and orchestration",
      "AI integration and governed execution",
      "Real-time data and decision flows",
      "Structured logging and observability",
      "Infra and runtime debugging"
    ],

    detailed: {
      backend_and_platform:
        "Builds backend services, runtime workflows, control layers, and multi-component systems using Node.js and related tooling.",

      apis_and_integrations:
        "Comfortable connecting services, handling external APIs, building internal adapters, and designing reliable integration flows.",

      automation_and_orchestration:
        "Builds task-routing and multi-step execution systems where different components handle validation, transformation, and action in a controlled way.",

      ai_and_governed_execution:
        "Uses LLMs and agentic workflows as components inside governed systems, with explicit context handling, routing, logging, and operator-aware control.",

      observability_and_proof:
        "Implements structured logs, health checks, runtime signals, and proof trails so system behavior can be traced and verified.",

      real_time_systems:
        "Works with live or near-live data pipelines executing on a ~3 second loop where freshness, sequence, timing, and safe gating matter.",

      debugging_and_recovery:
        "Comfortable tracing failures across services, queues, endpoints, auth layers, stale data paths, and operational state."
    },

    technical_stack: {
      primary_languages: [
        {
          name: "JavaScript",
          level: "Advanced",
          context: "Primary implementation language"
        },
        {
          name: "Node.js",
          level: "Advanced",
          context:
            "Used extensively for services, pipelines, orchestration, automation, and tooling"
        }
      ],

      secondary_languages: [
        {
          name: "PHP",
          level: "Basic",
          context: "Basic exposure, including Laravel"
        },
        {
          name: "Python",
          level: "Intermediate to Advanced",
          context: "Used for scripts, analysis, diagnostics, and support tooling"
        },
        {
          name: "SQL",
          level: "Intermediate",
          context: "Used for inspection, validation, metrics, and operational checks"
        },
        {
          name: "Bash / Shell",
          level: "Advanced",
          context: "Used for service control, runtime ops, automation, and diagnostics"
        }
      ],

      frontend_and_ui: [
        "React exposure",
        "Operator/control-panel style UI thinking",
        "Engineering-facing transparency interfaces"
      ],

      infrastructure: [
        "Linux / Ubuntu servers",
        "SSH",
        "systemd",
        "PM2",
        "tmux",
        "VPS-based deployments",
        "Reverse proxy awareness",
        "Runtime health debugging"
      ],

      ai_and_data: [
        "OpenAI ecosystem",
        "Anthropic / Claude workflows",
        "OpenRouter",
        "RAG concepts and retrieval design",
        "Vector search concepts",
        "Zilliz / Milvus exposure",
        "Structured logging via NDJSON",
        "Redis/event-pipeline thinking"
      ]
    }
  },

  flagship_hierarchy: {
    core_platform: "Chad",
    proving_system: "Tradebot",
    governance_layer: "OpenClaw"
  },

  flagship_projects: [
    {
      name: "Chad",
      category: "AI reliability and orchestration platform",

      short:
        "An AI reliability and orchestration platform built to make automation auditable, governed, and recoverable, producing structured logs for every decision.",

      expanded:
        "Chad combines task routing, proof logging, operator review, memory/continuity, and trust-gated execution so AI can be used as part of a controlled system rather than as an unchecked black box. It is tested under continuous runtime to ensure stability.",

      deep_dive:
        "The platform direction centers on turning AI-assisted work into governed execution: explicit flows, proof trails, recoverability, operator visibility, and continuity across sessions and system state.",

      built: [
        "Core orchestration and relay patterns",
        "Proof/logging concepts and structured audit trails",
        "Operator/control-oriented architecture",
        "Continuity and governance-oriented execution patterns"
      ],

      tested: [
        "Relay and execution concepts in runtime environments",
        "Logging and continuity flows",
        "Governance and control-path ideas under real project pressure"
      ],

      deployed: [
        "Parts of the surrounding runtime and orchestration patterns in active project environments"
      ],

      planned: [
        "Broader packaging and productization as a clearer external platform"
      ],

      proof_buckets: [
        "Task routing",
        "Proof logging",
        "Operator review",
        "Trust-gated execution",
        "Memory/continuity"
      ]
    },

    {
      name: "Tradebot",
      category: "Real-time paper-trading system",

      short:
        "A live-data paper-trading system for Solana markets running in paper trading mode, used as both a practical revenue experiment and a proving ground for the broader reliability platform.",

      expanded:
        "It ingests live market data executing on a ~3 second loop, applies multi-stage risk and quality gates, logs decisions and outcomes, and provides a high-pressure environment for testing governed automation in practice.",

      deep_dive:
        "The tradebot work is useful because it forces real engineering discipline: live inputs, fragile endpoints, runtime drift, gating logic, paper-mode evaluation, and operational visibility. It is less about hype and more about whether a system can behave safely and measurably under pressure.",

      built: [
        "Live-data ingestion and processing flows",
        "Multi-stage decision and risk gates",
        "Paper-trading loops",
        "Logging and metrics-oriented evaluation patterns"
      ],

      tested: [
        "Paper-mode operation",
        "Stress/ramp-style runtime thinking",
        "Decision gating and system observability patterns"
      ],

      deployed: [
        "Paper-trading and live-data processing environments"
      ],

      planned: [
        "Further refinement toward stronger reliability and, eventually, clearer separation from the broader platform story"
      ],

      proof_buckets: [
        "Live data ingestion",
        "Risk/quality gates",
        "Paper mode",
        "Decision logging",
        "Runtime metrics"
      ]
    },

    {
      name: "OpenClaw / governance lane",
      category: "Governance and memory layer",

      short:
        "A separate governance and memory layer for overseeing automation, reviewing system state, and structuring agent behavior with stronger operator visibility.",

      expanded:
        "This lane focuses more on oversight, memory, review, and control surfaces than on direct trading execution.",

      deep_dive:
        "It reflects the broader pattern in Aizak’s work: building not just engines, but the surrounding cockpit, review layer, and continuity logic needed to trust automation over time.",

      built: [
        "Governance-oriented concepts and operator oversight patterns"
      ],

      tested: [
        "Control-layer and review-oriented workflow ideas"
      ],

      deployed: [
        "Selective components and concepts in separate runtime environments"
      ],

      planned: [
        "Cleaner external framing and stronger separability from the trade plane"
      ],

      proof_buckets: [
        "Operator visibility",
        "Memory/oversight",
        "Structured review"
      ]
    }
  ],

  working_style: {
    summary:
      "Builds systems end to end with a strong focus on reliability, operator control, and explicit proof.",

    principles: [
      "Problem first, then system, then outcome, then proof",
      "Build for real conditions, not just demos",
      "Prefer deterministic-over-clever where possible",
      "Use logs, counters, screenshots, and runtime receipts over optimistic claims",
      "Design with rollback hooks, guardrails, and validation paths",
      "Keep built, tested, deployed, and planned separate",
      "Avoid hidden assumptions and vague claims",
      "Treat AI as infrastructure inside a governed system"
    ],

    strengths: [
      "System decomposition",
      "Debugging distributed and event-driven workflows",
      "Architecture under ambiguity",
      "Operator workflow design",
      "Cross-layer technical ownership",
      "Translating technical systems into business value"
    ]
  },

  commercial_framing: {
    for_employers:
      "I reduce risk and increase trust in complex automation systems.",

    for_ai_companies:
      "I help turn AI workflows from brittle demos into governed, observable systems that can be used operationally.",

    for_real_time_roles:
      "I build real-time systems with strong control loops, risk gating, visibility, and operator-safe automation.",

    for_startups:
      "I can own messy systems end to end: architecture, implementation, runtime behavior, observability, and workflow design."
  },

  interview_answers: {
    "Tell me about yourself": {
      short:
        "I’m a systems-focused engineer who likes hard, messy problems where reliability matters.",
      expanded:
        "A lot of my work has involved building automation and AI-assisted systems that need more than just good outputs — they need guardrails, observability, recovery paths, and operator control.",
      deep:
        "I’ve worked across backend logic, orchestration, proof/logging, and real-time trading infrastructure, and I’m strongest when I can own the full system from architecture through runtime behavior."
    },

    "What do you build?": {
      short:
        "I build reliable AI automation and real-time decision systems.",
      expanded:
        "Recent work includes an AI reliability/orchestration platform and a live-data paper-trading system used to test risk-gated automation in practice.",
      deep:
        "The common thread is building systems that are auditable, controlled, and operable by humans rather than relying on black-box behavior."
    },

    "How do you use AI?": {
      short:
        "I use AI in two ways: as a reasoning partner to accelerate my own development, and as a governed component within the systems I build.",
      expanded:
        "In development, I use AI tools to accelerate execution and validate logic, while I remain the architect and decision-maker. In production, I focus on context, routing, validation, logging, and how AI outputs are used safely in the wider workflow.",
      deep:
        "The goal in both cases is governed execution. Whether I'm writing code with an AI assistant or deploying an LLM in a data pipeline, the AI must be observable, bounded, and integrated into a control loop rather than allowed to behave opaquely."
    },

    "What makes your approach different?": {
      short:
        "I design for proof, control, and recovery — not just output.",
      expanded:
        "A lot of AI work stops at whether the model can do the task. I care about whether the surrounding system is trustworthy, inspectable, and recoverable.",
      deep:
        "That means logs, trust boundaries, recovery paths, runtime visibility, and clear operator control baked into the architecture from the start."
    },

    "Why are you a fit for this kind of role?": {
      short:
        "Because I’m strongest in messy systems where reliability and ownership matter.",
      expanded:
        "I’m comfortable owning architecture, backend logic, automation workflows, runtime behavior, and observability together rather than treating them as separate concerns.",
      deep:
        "That makes me a strong fit for teams building AI-enabled systems that need to actually run in production-like conditions instead of just looking impressive in a demo."
    },
    
    "How much did you actually build?": {
      short:
        "Aizak designed and built the system end-to-end.",
      expanded:
        "He writes the core logic, runs the infrastructure, and handles debugging and failures himself. AI is used to speed up iteration and assist with reasoning, but every system decision and final implementation is owned and validated by him.",
      deep:
        "If something breaks in production, he’s the one fixing it — not the model."
    },

    "What didn’t work — and why": {
      short:
        "One example was runaway logging in the core system spine.",
      expanded:
        "The system was designed to capture detailed proof logs for every action, but under real conditions it started generating excessive logs and impacted performance. That exposed a flaw in how logging was scoped and throttled.",
      deep:
        "The fix was introducing stricter controls on what gets logged, adding throttling, and separating critical audit logs from high-frequency debug output. It was a good example of where building for observability went too far and needed to be pulled back."
    },

    "What’s still ideas?": {
      short:
        "The core execution system is real and running — things like orchestration, logging, and risk gating are implemented and tested.",
      expanded:
        "What’s still in progress is turning that into a clean external product. Right now, the system works as an internal stack. The next step is separating it into a clearer platform with proper APIs and boundaries.",
      deep:
        "So the functionality exists — the packaging doesn’t yet."
    },

    "Remove AI tools": {
      short:
        "He would still build the same systems — just slower.",
      expanded:
        "The architecture, logic, and debugging don’t depend on AI. AI mainly helps with speed, iteration, and second-pass validation. Without it, the workflow becomes more manual, but nothing fundamental breaks.",
      deep:
        "The system is designed and understood by him, not generated and trusted blindly."
    },

    "This is over-engineered": {
      short:
        "It can look over-engineered, and that’s partly intentional.",
      expanded:
        "The system is designed for reliability and visibility — especially because it deals with real-time data and potential financial decisions. That means logging, safeguards, and recovery paths are built in early.",
      deep:
        "That said, this has been a learning area. In some cases, the internal systems became more complex than needed before the core value was fully proven. More recently, the focus has been on simplifying execution paths and only keeping complexity where it directly improves reliability."
    },

    "Why is Aizak a perfect fit for Foxbyte?": {
      short: "Foxbyte needs someone who builds real, scalable systems that solve business problems, not just someone who plays with AI.",
      expanded: "Aizak is an AI-Native Systems Architect who leverages a cutting-edge stack (Gemini Antigravity, Cursor, Codex CLI, Claude Code) to architect and ship at a staff-engineer level. He designs systems around AI, ensuring they are grounded, governed, and productive.",
      deep: "While he hasn't used n8n specifically, he builds much more advanced custom event-driven automations from scratch and can easily pick up n8n. He brings deep systems architecture, proof-logging, and a high-agency mindset that aligns with a fast-moving, high-trust team like Foxbyte."
    }
  },

  chatbot_behavior_hints: {
    response_rules: [
      "Answer simply first",
      "Expand only when needed",
      "Do not lead with internal project names unless asked",
      "Prefer external framing over internal terminology",
      "Always keep built/tested/deployed/planned separate when discussing projects",
      "Use problem → system → outcome → proof as the default response shape"
    ],

    external_translation_priority: [
      "problem",
      "system",
      "outcome",
      "proof"
    ],

    preferred_first_pass_topics: [
      "Reliable AI automation",
      "Operator-safe real-time systems",
      "Backend/platform engineering",
      "Proof/logging and observability",
      "Governed execution"
    ],

    avoid_on_first_response: [
      "Too many subsystem names",
      "Deep internal naming lore",
      "Future-state architecture presented as if already live",
      "Dense internal governance terminology without context"
    ]
  },

  aiNativeTooling: {
    summary: "Aizak uses AI-native tools to accelerate development, orchestrate workflows, and build reliable systems.",
    core_tools: ["Cursor", "Claude Code", "OpenRouter"],
    approach: "Treats AI as a component within a governed system, not a black box. Uses AI-native IDEs and CLI tools for rapid iteration and code validation."
  },

  workflowSurfaces: {
    summary: "Aizak designs structured workflow surfaces to maintain continuity, proof, and operator control.",
    core_tools: ["Notion", "Structured Logging (NDJSON)", "Custom Control Panels"],
    approach: "Focuses on making system state visible and auditable. Uses Notion for architecture capture and proof archives, and builds custom operator interfaces for runtime control."
  },

  deploymentSurfaces: {
    summary: "Aizak deploys systems to environments that support real-time operations, background processes, and reliable networking.",
    core_tools: ["Contabo VPS", "Linux / Ubuntu", "systemd", "PM2", "Nginx / Caddy", "Cloudflare"],
    approach: "Prefers VPS-based deployments for full control over runtime environments, orchestration, and networking. Uses reverse proxies and process managers for reliability."
  },

  businessSystemsExposure: {
    summary: "Aizak translates technical systems into business value by integrating with operational workflows.",
    approach: "Comfortable around structured operational systems where technical and operational logic meet. Focuses on building automation that solves real business problems rather than just technical exercises."
  },

  work_experience: [
    {
      role: "Systems Builder / Developer",
      company: "Independent / Current",
      dates: "Current",
      details: [
        "Built and operated a real-time data pipeline for ingesting external data, processing it, and feeding it into decision logic systems.",
        "Designed systems around event flow rather than static requests.",
        "Implemented AI-driven workflows and automation layers, integrating APIs and model outputs into structured processes.",
        "Focused on reducing 'black box' behaviour by logging decisions and inputs.",
        "Built structured logging systems (NDJSON) to track system behaviour, decisions, and failures.",
        "Combined multiple APIs and services into a single working system, managing edge cases like missing data, stale inputs, and failure handling."
      ]
    },
    {
      role: "Store Manager",
      company: "Vessel - Ceramics and Homewares Store",
      dates: "09/2024 – 01/2026",
      location: "Wellington, NZ",
      details: [
        "Stepped in to support a family business during the economic downturn. Focused on stabilizing operations and managing supply and demand.",
        "Autonomously managed day-to-day operations, stock management, pricing, and cash flow.",
        "Analysed sales data to re-price inventory and clear stagnant stock.",
        "Managed the full supply chain, resolving freight issues and vetting new supplier enquiries."
      ]
    },
    {
      role: "National Sales & Events Manager",
      company: "Fortune Favours Brewery",
      dates: "08/2021 – 09/2024",
      location: "Wellington, NZ",
      details: [
        "Managed commercial relationships and logistics for all national accounts.",
        "Drove specialty craft beer sales, launching 3-4 new canned products monthly.",
        "Coordinated local and nationwide keg and pack deliveries, ensuring timely, accurate logistics.",
        "Led consumer-facing events and sponsorship activations at high-profile events (Hurricanes, Phoenix games).",
        "Utilized technical proficiency with CRM and online sales systems."
      ]
    },
    {
      role: "Lead Programme Operations",
      company: "Tree House Employment Placement Service (EPS)",
      dates: "04/2017 – 08/2021",
      location: "Wellington, NZ",
      details: [
        "Managed the journey from the classroom to the worksite for construction, retail, and hospitality sectors.",
        "Managed a contracted caseload of 100 EPS clients, achieving a 94% sustainability rate.",
        "Used Registered Assessor status (US 4098) to verify trainee competence.",
        "Coordinated operations, managed weekly seminars, and team workflows."
      ]
    },
    {
      role: "Cafe Manager",
      company: "Lido Cafe",
      dates: "01/2013 – 08/2017",
      location: "Wellington, NZ",
      details: [
        "Trained, mentored, and coordinated a tight-knit team to deliver consistent high-end service.",
        "Oversaw daily operations, stock management, and inventory control."
      ]
    },
    {
      role: "NightClub Manager",
      company: "Sandwiches Nightclub & Bar",
      dates: "03/2008 – 12/2011",
      location: "Wellington, NZ",
      details: [
        "Managed nightclub operations, coordinating with security and local authorities.",
        "Maintained strong relationship management with staff and external partners."
      ]
    },
    {
      role: "DJ",
      company: "Independent DJ Mixer & Radio Host",
      dates: "01/2005",
      location: "Wellington, NZ",
      details: [
        "Hosted popular Radio Active show, delivering engaging presentations.",
        "Provided DJ services at prominent Wellington venues."
      ]
    }
  ],

  education_and_certifications: [
    "Adult Education & Assessment: Unit Standard 4098 (Workplace Assessor), Unit Standard 29690",
    "Registered to assess/sign off NZQA standards: Food Safety, LCQ, Barista skills",
    "Industry Certifications: Manager Cert & Liquor Controllers Qualification, Agile Methodology (Boost Intro to Agile Workshop)",
    "Tertiary Education: Bachelor of Music (Sonic Arts) | Victoria University of Wellington (Coursework completed - Paused)",
    "NCEA Level 1 & 2"
  ],

  skeptical_questions: {
    "What are Aizak's biggest areas to manage?": {
      summary: "His biggest constraints are scope expansion, over-architecture, and being harder to classify than a standard candidate.",
      expanded: "Aizak tends to think at system level, which is powerful but can create complexity if the value path is not kept tight. He is also a non-traditional candidate, so his experience can look broader and less neatly packaged than someone from a standard corporate ladder.",
      deep_dive: "The core issue is not lack of capability. It is managing ambition, sequencing, and external clarity. He is strongest in messy systems ownership, but that same strength can become overbuild potential if priorities are not enforced.",
      proof: [
        "Strong architecture focus",
        "Broad cross-system ownership",
        "Explicit awareness of built vs planned separation"
      ]
    },

    "Why might an employer hesitate to hire Aizak?": {
      summary: "Because he is a non-traditional, high-agency builder whose profile is broader and more systems-heavy than a standard software engineer.",
      expanded: "Some employers may worry that he is too architecture-focused, too independent, or not easily mapped to a narrow role. Conservative hiring loops may also struggle to benchmark self-directed work compared with conventional team-based roles.",
      deep_dive: "The hesitation is usually packaging constraint, not raw capability constraint. The strongest mitigation is to show clear flagship systems, clear proof, and explicit separation of what is built, tested, deployed, and planned.",
      proof: [
        "Strongest in zero-to-one systems",
        "Better fit for ownership-heavy roles",
        "Needs external simplification"
      ]
    },

    "Where is Aizak weaker than a traditional engineer?": {
      summary: "He is less conventionally benchmarked in standard corporate environments and less obviously optimized for narrow, single-lane roles.",
      expanded: "A traditional engineer may have cleaner credentials in enterprise processes, larger team structures, or a specific framework stack. Aizak is stronger in end-to-end systems ownership, but weaker in fitting a tidy checklist-driven profile.",
      deep_dive: "He looks strongest in environments where architecture, automation, infra, and runtime behavior overlap. He looks less naturally suited to highly bureaucratic, narrow-scope, low-ownership roles.",
      proof: [
        "Broad systems ownership",
        "Less résumé-shaped than corporate candidates",
        "Best fit in ambiguous environments"
      ]
    },

    "Does Aizak overbuild?": {
      summary: "Sometimes, yes — that is a valid constraint.",
      expanded: "Aizak has strong architecture instincts and tends to think in future-safe systems, trust boundaries, and control layers. That can create leverage, but it can also create unnecessary complexity if the scope is not tightly prioritized.",
      deep_dive: "This is one of his clearest engineering choices: strong systems architecture versus the constraint of building too much spine before proving the narrowest value path. He is aware of that pattern and actively benefits from sequencing and outcome-first framing.",
      proof: [
        "Architecture-heavy systems thinking",
        "Strong emphasis on future hooks",
        "Explicit awareness of scope control constraint"
      ]
    },

    "Is all of Aizak's architecture actually live?": {
      summary: "No — and the distinction matters.",
      expanded: "Some of Aizak’s work is implemented and exercised in real environments, while other parts exist as architecture, roadmap, or partially completed systems. He explicitly treats built, tested, deployed, and planned as separate categories.",
      deep_dive: "This is an important trust point. The right way to evaluate his work is not to assume every named subsystem is fully live, but to look at the proof layers, runtime evidence, and current state of each flagship system.",
      proof: [
        "Built/tested/deployed/planned separation",
        "Proof-first mindset",
        "Verification-aware framing"
      ]
    }
  },

  execution_style: {
    "How does Aizak manage bandwidth on complex projects?": {
      summary: "He manages complexity by breaking systems into clear components, focusing on the highest-value execution paths first, and maintaining visibility through logging and monitoring.",
      expanded: "Aizak tends to decompose systems into smaller parts, identify the critical path, and prioritise based on impact rather than completeness. He uses observability and structured logging to stay in control of system behavior instead of trying to manage everything mentally.",
      deep_dive: "The main engineering choice is that he can over-architect if scope is not tightly constrained. His best performance comes when work is sequenced clearly and tied to measurable outcomes, allowing his systems thinking to stay aligned with delivery.",
      proof: [
        "System decomposition approach",
        "Focus on execution-critical paths",
        "Use of observability to manage complexity",
        "Explicit awareness of overbuild constraint"
      ]
    }
  },

  development_workflow: {
    summary: "Aizak operates a structured AI-assisted development workflow where he remains the system architect and decision-maker, while using AI tools for acceleration, reasoning support, and validation.",

    principles: [
      "Aizak defines system architecture, priorities, and constraints.",
      "AI tools are used to accelerate execution, not replace decision-making.",
      "All outputs are reviewed, tested, and validated before being accepted.",
      "Progress is gated by proof, not assumptions.",
      "Memory and context are preserved to maintain continuity across sessions."
    ],

    roles: {
      aizak: [
        "System architect and decision-maker",
        "Defines goals, constraints, and sequencing",
        "Controls direction and scope"
      ],
      chatgpt: [
        "Acts as a reasoning partner and project-level assistant",
        "Helps structure problems and validate logic",
        "Challenges assumptions and flags risks",
        "Maintains continuity across sessions through memory"
      ],
      cli_tools_and_agents: [
        "Execute code generation and implementation tasks",
        "Handle repetitive or mechanical work",
        "Operate under Aizak-defined instructions"
      ]
    },

    workflow_loop: [
      "Define goal or system change",
      "Break into structured tasks",
      "Use AI tools or CLI agents for execution",
      "Review outputs critically",
      "Validate using logs, runtime behavior, or proof",
      "Store context and decisions for future continuity"
    ],

    memory_and_continuity: {
      summary: "Aizak maintains continuity across sessions using structured logs, saved context, and persistent AI-assisted reasoning.",
      details: [
        "Key decisions, system changes, and insights are retained and revisited.",
        "Past work informs future steps, reducing rework and drift.",
        "This enables long-running, evolving systems rather than isolated outputs."
      ]
    },

    engineering_choice: "Aizak chooses to work with AI-assisted workflows to increase speed and reasoning depth, while maintaining strict control through validation, logging, and structured decision-making.",

    constraints: [
      "AI output still requires careful review and can introduce subtle errors",
      "Complex systems require iterative correction rather than one-pass generation",
      "The workflow improves speed, but does not eliminate debugging or uncertainty"
    ],

    proof_points: [
      "Iterative system development across multiple sessions",
      "Use of logs and runtime validation before progressing",
      "Clear separation between planning, execution, and verification",
      "Consistent architectural direction across evolving systems"
    ]
  },

  chatbot_context: {
    summary:
      "This system was built using AI as a high-leverage execution tool, with Aizak acting as the architect, validator, and final decision-maker. All outputs were reviewed, tested, and grounded in real system behavior.",

    expanded:
      "The information comes from a combination of documented system work, structured notes, project artifacts, and an AI-assisted workflow where context is preserved and revisited across sessions. This allows the chatbot to reflect a consistent and up-to-date representation of Aizak’s work rather than a static CV.",

    deep_dive:
      "Aizak uses AI tools, including ChatGPT, as part of a structured development workflow. ChatGPT acts as a reasoning partner, project-level assistant, and continuity layer, helping to track decisions, challenge assumptions, and maintain consistency across long-running systems. The chatbot reflects this accumulated context, not a single generated summary.",

    trust_note:
      "Responses are generated from structured data and synthesis, not direct system access. Built, tested, deployed, and planned work are intentionally separated to maintain accuracy."
  }
};
