const SKILL_RULES = [
  {
    domain: "life_science",
    title: "Biotechnology",
    reason:
      "Concept links with life-science systems, lab techniques, and applied biology.",
    keywords: ["photosynthesis", "chlorophyll", "cell", "mitochondria", "dna", "genetics", "enzyme"],
  },
  {
    domain: "life_science",
    title: "Environmental Science",
    reason:
      "Topic connects to ecosystems, climate, sustainability, and resource cycles.",
    keywords: ["ecosystem", "climate", "carbon", "pollution", "environment", "biodiversity"],
  },
  {
    domain: "life_science",
    title: "Medical Sciences",
    reason:
      "Foundational biology/chemistry terms support physiology and health sciences.",
    keywords: ["respiration", "cell", "oxygen", "blood", "metabolism", "enzyme", "anatomy"],
  },
  {
    domain: "engineering",
    title: "Electrical Engineering",
    reason:
      "Circuit and electricity concepts align with electronics and electrical systems.",
    keywords: ["current", "voltage", "resistance", "circuit", "ohm", "series", "parallel"],
  },
  {
    domain: "engineering",
    title: "Mechanical Engineering",
    reason:
      "Motion and force fundamentals map to mechanics and machine design.",
    keywords: ["force", "acceleration", "velocity", "friction", "newton", "momentum"],
  },
  {
    domain: "engineering",
    title: "Chemical Engineering",
    reason:
      "Reaction and process understanding is core for industrial chemistry workflows.",
    keywords: ["reaction", "reactant", "product", "acid", "base", "ph", "equilibrium"],
  },
  {
    domain: "data_math",
    title: "Data Science",
    reason:
      "Statistics and probability concepts are directly useful for data analysis.",
    keywords: ["probability", "mean", "median", "mode", "variance", "distribution"],
  },
  {
    domain: "data_math",
    title: "Software Development",
    reason:
      "Logical problem-solving and equations support algorithmic thinking.",
    keywords: ["algorithm", "logic", "equation", "function", "variable", "optimization"],
  },
  {
    domain: "data_math",
    title: "AI/ML Foundations",
    reason:
      "Pattern recognition, statistics, and modeling concepts align with ML learning paths.",
    keywords: ["model", "prediction", "classification", "regression", "probability", "dataset"],
  },
  {
    domain: "life_science",
    title: "Agricultural Technology",
    reason:
      "Plant, soil, and ecosystem concepts connect with agri-tech applications.",
    keywords: ["plant", "soil", "crop", "photosynthesis", "fertilizer", "irrigation"],
  },
  {
    domain: "engineering",
    title: "Robotics",
    reason:
      "Mechanics, circuits, and control logic combine directly in robotics systems.",
    keywords: ["sensor", "actuator", "motion", "circuit", "control", "automation"],
  },
  {
    domain: "engineering",
    title: "Renewable Energy Systems",
    reason:
      "Energy conversion and electrical fundamentals support clean energy technologies.",
    keywords: ["solar", "energy", "voltage", "power", "efficiency", "battery"],
  },
  {
    domain: "data_math",
    title: "Quantitative Finance",
    reason:
      "Probability, statistics, and mathematical modeling support finance analytics.",
    keywords: ["probability", "risk", "distribution", "variance", "forecast", "model"],
  },
  {
    domain: "core_skills",
    title: "Scientific Communication",
    reason:
      "Explaining concepts clearly improves reporting, presentations, and research writing.",
    keywords: ["explain", "concept", "diagram", "analysis", "observation", "conclusion"],
  },
  {
    domain: "core_skills",
    title: "Research & Analysis",
    reason:
      "Concept decomposition and evidence-based reasoning map to research workflows.",
    keywords: ["hypothesis", "experiment", "data", "inference", "result", "method"],
  },
]

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function rankSkills(text) {
  const normalized = normalizeText(text)
  if (!normalized) return []

  return SKILL_RULES.map((rule) => {
    const score = rule.keywords.reduce(
      (sum, keyword) => (normalized.includes(keyword) ? sum + 1 : sum),
      0
    )
    return {
      domain: rule.domain,
      title: rule.title,
      reason: rule.reason,
      score,
    }
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
}

function pickDominantDomain(ranked) {
  if (!ranked.length) return "core_skills"
  const domainScore = new Map()
  for (const skill of ranked) {
    domainScore.set(skill.domain, (domainScore.get(skill.domain) || 0) + skill.score)
  }
  return [...domainScore.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function pickExpandedSkills(ranked) {
  const selected = [...ranked.slice(0, 4)]
  const selectedTitles = new Set(selected.map((item) => item.title))

  const dominantDomain = pickDominantDomain(ranked)
  const domainCandidates = SKILL_RULES.filter(
    (rule) => rule.domain === dominantDomain && !selectedTitles.has(rule.title)
  ).map((rule) => ({
    domain: rule.domain,
    title: rule.title,
    reason: rule.reason,
    score: 0.6,
  }))

  for (const candidate of domainCandidates) {
    if (selected.length >= 6) break
    selected.push(candidate)
    selectedTitles.add(candidate.title)
  }

  if (selected.length < 6) {
    const generic = SKILL_RULES.filter(
      (rule) => rule.domain === "core_skills" && !selectedTitles.has(rule.title)
    ).map((rule) => ({
      domain: rule.domain,
      title: rule.title,
      reason: rule.reason,
      score: 0.5,
    }))

    for (const candidate of generic) {
      if (selected.length >= 6) break
      selected.push(candidate)
      selectedTitles.add(candidate.title)
    }
  }

  return selected.slice(0, 6)
}

async function mapSkills(text) {
  const ranked = rankSkills(text)
  const expanded = pickExpandedSkills(ranked)
  const skills =
    expanded.length > 0
      ? expanded.map((item) => ({
          title: item.title,
          reason: item.reason,
          relevance: Number(Math.min(1, item.score / 5).toFixed(2)),
          domain: item.domain,
        }))
      : [
          {
            title: "Critical Thinking",
            reason:
              "Current text is generic; strengthen concept clarity to map skills more accurately.",
            relevance: 0.3,
            domain: "core_skills",
          },
          {
            title: "Problem Solving",
            reason:
              "Most academic topics improve stepwise reasoning and structured analysis.",
            relevance: 0.3,
            domain: "core_skills",
          },
        ]

  return {
    skills,
    inputPreview: String(text || "").slice(0, 160),
  }
}

module.exports = {
  mapSkills,
}
