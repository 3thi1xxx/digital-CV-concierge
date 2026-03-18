export const toolingMatrix = {
  summary:
    "Aizak works across custom systems and modern tooling used for planning, deployment, communication, AI workflows, retrieval, and infrastructure. Tool claims should always distinguish between deep operational use, working familiarity, and lighter exposure.",

  rules: {
    level_definitions: {
      core: "Deep operational use in real systems and repeated workflows.",
      strong: "Meaningful hands-on use and credible practical understanding.",
      working: "Real familiarity and usable knowledge, but not a defining specialty.",
      exposure: "Some contact or contextual familiarity, but should not be presented as deep experience."
    },
    confidence_definitions: {
      high: "Strongly supported by project history and repeated usage.",
      medium: "Reasonably supported, but should be phrased carefully.",
      low: "Possible or adjacent, but not strong enough for confident claims."
    },
    chatbot_rules: [
      "Do not inflate working familiarity into expertise.",
      "Do not present exposure as hands-on production depth.",
      "Use tooling references to show range, not as the main identity.",
      "Keep identity anchored in systems building, automation, reliability, and operator control.",
      "If asked directly about a tool with only medium or low confidence support, answer cautiously."
    ],
    identity_anchor: "Tooling supports the work, but Aizak’s identity is systems design, reliability, and execution — not specific tools."
  },

  categories: [
    {
      category: "AI-native development tools",
      tools: [
        {
          name: "Cursor",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has strong working use of Cursor as part of his AI-assisted development workflow.",
          context: "Used in active coding, iteration, and rapid development workflows.",
          how_it_should_be_used_in_answers:
            "Good example of AI-native development workflow and fast iteration.",
          avoid_claiming: [
            "team administration depth",
            "enterprise Cursor governance expertise"
          ]
        },
        {
          name: "Claude Code",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has meaningful hands-on use of Claude Code in code planning, validation, and agent-style workflows.",
          context: "Used for code reasoning, validation, relay-oriented workflows, and lineage discovery.",
          how_it_should_be_used_in_answers:
            "Strong evidence of modern AI-assisted engineering practice.",
          avoid_claiming: [
            "official Anthropic platform expertise beyond actual use"
          ]
        },
        {
          name: "Google AI Studio",
          level: "working",
          confidence: "high",
          safe_phrasing: "Aizak has working familiarity with Google AI Studio for prototyping and experimenting with AI app flows.",
          context: "Used for prototyping and exploring chatbot/demo surfaces.",
          how_it_should_be_used_in_answers:
            "Useful as evidence of adaptability and experimentation.",
          avoid_claiming: [
            "deep production AI Studio deployment expertise"
          ]
        },
        {
          name: "OpenRouter",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has strong working use of OpenRouter for model routing and multi-model workflow experimentation.",
          context: "Used as part of routing, experimentation, and AI workflow integration.",
          how_it_should_be_used_in_answers:
            "Strong evidence of model-agnostic AI systems thinking.",
          avoid_claiming: [
            "official platform administration or partner-level expertise"
          ]
        }
      ]
    },

    {
      category: "Knowledge, planning, and workflow surfaces",
      tools: [
        {
          name: "Notion",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has strong working use of Notion as a knowledge, planning, continuity, and proof-archive surface.",
          context: "Used for architecture capture, proof archives, planning, and system continuity.",
          how_it_should_be_used_in_answers:
            "Strong example of structured operational memory and documentation discipline.",
          avoid_claiming: [
            "complex Notion admin or enterprise workspace governance unless verified"
          ]
        }
      ]
    },

    {
      category: "Deployment and runtime platforms",
      tools: [
        {
          name: "Contabo VPS",
          level: "core",
          confidence: "high",
          safe_phrasing: "Aizak has deep operational use of VPS-based deployment environments, especially Contabo-hosted Linux systems.",
          context: "Used for active runtime systems, orchestration, services, and operational debugging.",
          how_it_should_be_used_in_answers:
            "This is real operational depth and should be treated as a strong signal.",
          avoid_claiming: [
            "formal enterprise cloud architecture certification-style expertise"
          ]
        },
        {
          name: "Cloudflare",
          level: "working",
          confidence: "high",
          safe_phrasing: "Aizak has working familiarity with Cloudflare-fronted deployment patterns as part of runtime and reverse-proxy setups.",
          context: "Used in deployment and networking stack around live services.",
          how_it_should_be_used_in_answers:
            "Good supporting infra signal.",
          avoid_claiming: [
            "deep Cloudflare platform specialization"
          ]
        },
        {
          name: "Nginx / Caddy",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has strong working use of reverse-proxy layers such as Nginx and Caddy within live deployment environments.",
          context: "Used in real deployment and service-access flows.",
          how_it_should_be_used_in_answers:
            "Useful in infra and runtime operations answers.",
          avoid_claiming: [
            "full-time dedicated SRE specialization"
          ]
        }
      ]
    },

    {
      category: "AI retrieval, memory, and data systems",
      tools: [
        {
          name: "Zilliz",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has strong working use of Zilliz as part of vector-backed retrieval, memory, and semantic search workflows.",
          context: "Used in retrieval, memory, and operational intelligence layers.",
          how_it_should_be_used_in_answers:
            "One of the strongest non-generic modern tooling signals.",
          avoid_claiming: [
            "vendor-internal expertise or formal partnership level"
          ]
        },
        {
          name: "Milvus",
          level: "working",
          confidence: "high",
          safe_phrasing: "Aizak has working familiarity with Milvus through vector-search and retrieval-oriented system design.",
          context: "Used alongside Zilliz-oriented retrieval concepts and flows.",
          how_it_should_be_used_in_answers:
            "Good for retrieval and AI systems questions.",
          avoid_claiming: [
            "deep low-level Milvus cluster administration unless verified"
          ]
        },
        {
          name: "Redis",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has strong working use of Redis-style event and state pipelines in real-time system workflows.",
          context: "Used in event pipelines, state handling, and system coordination.",
          how_it_should_be_used_in_answers:
            "Very strong signal for real-time systems and backend engineering.",
          avoid_claiming: [
            "specialist DBA-level Redis internals expertise"
          ]
        },
        {
          name: "SQLite",
          level: "working",
          confidence: "high",
          safe_phrasing: "Aizak has working familiarity with lightweight operational data stores such as SQLite.",
          context: "Used in validation, inspection, and operational tooling contexts.",
          how_it_should_be_used_in_answers:
            "Supporting data-layer evidence.",
          avoid_claiming: [
            "heavy relational database specialization"
          ]
        }
      ]
    },

    {
      category: "Infra and operations tooling",
      tools: [
        {
          name: "SSH",
          level: "core",
          confidence: "high",
          safe_phrasing: "Aizak has deep operational use of SSH-based server administration and remote debugging.",
          context: "Used constantly across live infra and machine coordination.",
          how_it_should_be_used_in_answers:
            "This is core operational capability.",
          avoid_claiming: []
        },
        {
          name: "tmux",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has strong working use of tmux-style terminal operations in multi-service environments.",
          context: "Used in day-to-day operational workflows.",
          how_it_should_be_used_in_answers:
            "Good signal for real operator behavior, not just coding.",
          avoid_claiming: []
        },
        {
          name: "systemd",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has strong working use of systemd-managed service environments.",
          context: "Used in runtime process and service control.",
          how_it_should_be_used_in_answers:
            "Useful for backend and infra competence questions.",
          avoid_claiming: []
        },
        {
          name: "PM2",
          level: "strong",
          confidence: "high",
          safe_phrasing: "Aizak has strong working use of PM2 for process management and runtime operations.",
          context: "Used in active deployed systems.",
          how_it_should_be_used_in_answers:
            "Strong practical Node/runtime signal.",
          avoid_claiming: []
        },
        {
          name: "Docker",
          level: "working",
          confidence: "high",
          safe_phrasing: "Aizak has working familiarity with Docker and container-aware deployment patterns.",
          context: "Used in parts of the broader system environment.",
          how_it_should_be_used_in_answers:
            "Good range signal, but not the headline.",
          avoid_claiming: [
            "deep platform/container orchestration mastery unless verified"
          ]
        },
        {
          name: "VPN / routing / network debugging",
          level: "working",
          confidence: "high",
          safe_phrasing: "Aizak has practical familiarity with VPN, routing, and network-debugging issues in live environments.",
          context: "Used while operating multi-machine and remote systems.",
          how_it_should_be_used_in_answers:
            "Useful to show operator realism.",
          avoid_claiming: [
            "specialist network engineer depth"
          ]
        }
      ]
    }
  ]
};
