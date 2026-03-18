export const marketAssessment = {
  overview: {
    shortest_version:
      "High-agency systems-focused engineer and solo builder, strongest in AI automation, backend/platform engineering, real-time decision systems, and reliability-focused architecture.",

    marketable_version:
      "A strong systems engineer with platform-architect tendencies, especially valuable in roles involving AI automation, operator control, real-time pipelines, and governed execution.",

    blunt_read:
      "Not a generic full-stack dev and not just an AI tinkerer. Strongest when building messy, cross-functional systems that need reliability, observability, and controlled automation.",

    core_constraint:
      "Can overbuild or over-explain unless the story is tightly framed around outcomes, deployed reality, and the simplest externally legible value."
  },

  capability_read: {
    technical_depth: "High",
    systems_thinking: "High",
    reliability_mindset: "High",
    operator_empathy: "High",
    cross_domain_range: "High",
    product_simplicity: "Mixed but improving",
    execution_stamina: "High, with overload potential",
    market_packaging: "Undersold unless translated clearly"
  },

  strengths: {
    summary: [
      "Systems architecture and end-to-end pipeline thinking",
      "Reliability, auditability, and proof-first engineering",
      "Backend/platform work across APIs, orchestration, and infra",
      "Real-world debugging under messy runtime conditions",
      "AI as governed infrastructure, not just a prompt interface",
      "High-leverage AI-assisted development workflow"
    ],

    detail: [
      {
        name: "Systems thinking",
        description:
          "Naturally thinks in flows, boundaries, recovery paths, handoff layers, operator controls, and sources of truth."
      },
      {
        name: "Reliability mindset",
        description:
          "Cares about logs, deterministic behavior, paper-first rollout, explicit guardrails, rollback thinking, and proof of done."
      },
      {
        name: "Cross-layer execution",
        description:
          "Comfortable moving between backend logic, infra, automation, event pipelines, observability, and product-level control surfaces."
      },
      {
        name: "Governed AI thinking",
        description:
          "Treats LLMs and agents as components inside controlled systems with trust boundaries, routing, validation, and operator oversight."
      },
      {
        name: "Operator-focused design",
        description:
          "Builds for the human running the machine, not just the machine itself. Values dashboards, receipts, naming clarity, and debuggability."
      },
      {
        name: "AI-assisted development",
        description:
          "Uses AI tools as reasoning partners and execution accelerators while maintaining strict architectural control, validation, and continuity."
      }
    ],

    deep_dive: [
      "Most engineers can build features. Aizak’s stronger edge is building control loops around features: logs, recovery, state visibility, and proof paths.",
      "Most AI candidates talk about prompts or models. Aizak’s stronger edge is system design around AI behavior: context, routing, validation, and controlled execution.",
      "Most solo builders can hack something together. Aizak’s stronger edge is making multi-component systems understandable and governable under runtime pressure.",
      "Most developers use AI for code snippets. Aizak uses AI as a system-level reasoning partner, maintaining memory and continuity across complex, long-running projects."
    ]
  },

  canonical_constraints: [
    "Over-architecture risk",
    "Scope expansion risk",
    "Needs clear built vs planned separation",
    "Needs simplified external framing"
  ],

  areas_to_manage_and_constraints: {
    summary: [
      "Over-architecture risk",
      "Scope expansion risk",
      "Needs clear built vs planned separation",
      "Needs simplified external framing"
    ],

    detail: [
      {
        name: "Overbuilding",
        description:
          "Strong enough architecturally to build future-safe systems early, which is useful but can create complexity before value is proven."
      },
      {
        name: "Scope hydra",
        description:
          "Takes on architecture, implementation, observability, governance, operator tooling, and continuity at once. Main bottleneck is bandwidth, not intelligence."
      },
      {
        name: "Verification drift",
        description:
          "Must consistently separate what is implemented, tested, deployed, and planned so architecture does not get mistaken for live capability."
      },
      {
        name: "External simplification",
        description:
          "Internally coherent systems can sound dense or overly custom unless translated into problem → system → outcome → proof."
      }
    ]
  },

  employer_perception: {
    best_case:
      "A strong startup, AI infrastructure team, automation platform team, or advanced systems group would likely see a high-agency engineer who can own messy zero-to-one systems end to end.",

    average_case:
      "A normal employer may see someone clearly technical and unusually capable, but potentially harder to classify if the story is not simplified.",

    skeptical_case:
      "Conservative hiring loops may worry about breadth, custom terminology, architecture heaviness, or unclear boundaries between live and planned systems.",

    what_impresses: [
      "Builds real systems tested under continuous runtime instead of toy demos",
      "Cares about failure modes and proof",
      "Can bridge backend, infra, automation, and AI",
      "Understands operator trust and control",
      "Treats AI as something to govern, not just something to call"
    ],

    what_confuses: [
      "Too many internal project names",
      "Too much architecture too early",
      "Not enough separation between live and roadmap state",
      "Hard to quickly identify the strongest commercial wedge"
    ]
  },

  role_fit: {
    best_fit_titles: [
      "AI & Software Engineer",
      "AI Platform Engineer",
      "Automation Systems Engineer",
      "Applied AI Engineer",
      "Backend / Platform Engineer",
      "AI Reliability Engineer",
      "Founding Engineer",
      "Technical Product Architect"
    ],

    strongest_lane:
      "Reliable AI automation, backend/platform systems, operator tooling, and real-time decision infrastructure.",

    weaker_fit_titles: [
      "Pure frontend engineer",
      "Narrow CRUD-only backend developer",
      "Highly bureaucratic low-ownership role"
    ]
  },

  positioning: {
    safest_one_liner:
      "Builds reliable AI-powered systems using backend logic, APIs, automation pipelines, and strong observability.",

    stronger_one_liner:
      "Builds auditable AI automation and real-time decision systems with a focus on reliability, operator control, and governed execution.",

    interview_focus: [
      "Lead with outcomes, not subsystem names",
      "Use problem → system → outcome → proof",
      "Keep built / tested / deployed / planned separate",
      "Use Chad and the tradebot as the two main flagship anchors"
    ]
  },

  commercial_value: {
    raw_value:
      "Underlying capability appears stronger than a generic senior engineer because of the combination of architecture, reliability, automation, infra, AI systems, and operator-centric design.",

    biggest_unlock:
      "Compress the story into 2–3 flagship systems with clear outcomes, clear scope, and clear proof.",

    biggest_threat:
      "Sounding more visionary than grounded, or presenting too much architecture before explaining what is actually working."
  }
};
