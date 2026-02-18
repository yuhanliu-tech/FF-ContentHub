/**
 * Focus areas / example advisory session topics from Expert menu (Feb 2026).
 * Used when advisory_topics is not set in Strapi for an expert.
 * Key by expert name (match Strapi expert_bios.name).
 */
export interface AdvisoryTopic {
  title: string;
  points: string[];
}

export const expertAdvisoryTopicsByName: Record<string, AdvisoryTopic[]> = {
  "Ethan Mollick": [
    {
      title: "The Urgency & AI Adoption Gap",
      points: [
        "The gap between AI capability and enterprise adoption is a strategic vulnerability",
        "What separates leaders from laggards in the race to integrate",
        'Why "wait and see" is the riskiest strategy',
      ],
    },
    {
      title: "Navigating the Jagged Frontier",
      points: [
        "AI's uneven capabilities create both strategic opportunity and hidden risk",
        "Most organizations are dramatically underutilizing available AI",
        "Questions organizational leaders should be asking, and the answers that matter",
      ],
    },
    {
      title: "Management as Competitive Advantage in the AI Era",
      points: [
        "The companies that win will experiment with AI management techniques, not wait for SaaS vendors to decide",
        "Why AI demands a return to the management innovation that drove 20th-century American dominance",
        "Preparing for a future where AI gets better, cheaper, and more autonomous faster than expected",
      ],
    },
    {
      title: "The New Shape of Work: Humans, Agents, and the Decisions Ahead",
      points: [
        "The shift from AI as tool to AI as autonomous collaborator, and what it means for workforce strategy",
        "How to decide: tasks done alone, done with AI, delegated to AI, or fully autonomous",
        "Managing risk when AI agents make mistakes, and when humans over-rely on them",
      ],
    },
    {
      title: "Preparing for the AI That Hasn't Arrived Yet",
      points: [
        '"Assume this is the worst AI you\'ll ever use": why leaders must build for exponential improvement',
        "Designing systems that swap in better models, not over-optimize for today's limitations",
        "What the next 2-3 years will likely bring, and how to avoid being left behind",
      ],
    },
  ],
  "Dan Shapiro": [
    {
      title: "Transforming Manufacturing into AI-First Organizations",
      points: [
        "Leading Glowforge's journey from hardware startup to 25% revenue growth through AI integration",
        "Practical strategies for adopting AI across every function, from factory floor to executive suite",
        "Building organizational cultures where everyone has access to cutting-edge AI tools and training",
      ],
    },
    {
      title: "Technical Deflation: How Falling AI Costs Change Everything",
      points: [
        "Why the rapidly decreasing cost of code is fundamentally changing tech debt strategy",
        "When to ship fast and messy vs. when to refactor (and how AI changes the calculation)",
        "Rethinking development roadmaps in an era where tomorrow's fixes are cheaper than today's",
      ],
    },
    {
      title: "AI Development Strategies That Actually Work",
      points: [
        "Slot machine development: Running parallel AI attempts and picking winners",
        "Moving from careful, token-by-token prompting to high-volume, high-speed iteration",
        "The five levels of AI integration: from spicy autocomplete to the dark factory",
      ],
    },
    {
      title: "Building Products Customers Love with AI",
      points: [
        "How Glowforge uses AI to transform job descriptions, customer support, and product development",
        'Overcoming the three fatal misconceptions: the perfection fallacy, the waiting game, and "AI is IT\'s problem"',
        "Creating accessible, beautiful products that empower creators without requiring engineering backgrounds",
      ],
    },
  ],
  "Daniel Rock": [
    {
      title: "Economic Foundations of AI",
      points: [
        "The Productivity J-Curve: Why AI's economic impact unfolds over time, not overnight",
        "How intangible capital investments determine which firms win with AI",
        "Measuring the true market value of AI talent and technology investments in your organization",
      ],
    },
    {
      title: "AI Implementation Strategy & ROI",
      points: [
        "From AI experiments to business transformation: Building complementary organizational capabilities",
        "The economics of AI deployment: Where productivity gains actually come from",
        "Strategic frameworks for calculating and capturing AI implementation returns",
      ],
    },
    {
      title: "Labor Markets & Organizational Design in the AI Era",
      points: [
        "Which occupations face the greatest exposure to LLMs and what this means for workforce planning",
        "Research-based insights on skill-biased technological change and job market implications",
        "Designing AI-human complementarity: Moving beyond automation vs. augmentation debates",
      ],
    },
    {
      title: "Building with Frontier AI: Claude Skills & Agentic Systems",
      points: [
        "Understanding Claude Skills: What they are, how to design them, and their role in organizational AI strategy",
        "Building and deploying custom Skills to encode institutional knowledge and workflows",
        "Agentic AI in practice: Designing breakthrough solutions that unlock massive enterprise value",
      ],
    },
  ],
  "Simon Willison": [
    {
      title: "The Prompt Injection Crisis and LLM Security",
      points: [
        'Understanding the "lethal trifecta": private data, untrusted content, and external communication',
        "Why prompt injection remains unsolved and what it means for AI agent deployment",
        "Real-world vulnerabilities in tools like ChatGPT, Claude Code, GitHub Copilot, and MCP servers",
        "Practical design patterns for building more secure LLM-powered systems",
      ],
    },
    {
      title: "Practical AI Tools for Software Engineers",
      points: [
        "Building with the LLM command-line tool: A hype-free approach to everyday AI workflows",
        'Using AI as your "weird, over-confident intern": Setting realistic expectations',
        "Structured data extraction, alt text generation, and accessibility improvements with LLMs",
        "Why running local models teaches you more about how LLMs actually work",
      ],
    },
    {
      title: "Datasette and Tools for Data Journalism",
      points: [
        "Publishing data and building APIs for investigative journalism with Datasette",
        "The plugin architecture: Enabling low-friction collaboration in open source",
        "SQLite as the foundation for powerful data exploration and analysis tools",
        "Building toward Pulitzer-worthy data journalism tooling",
      ],
    },
    {
      title: "Learning, Building, and Blogging in Public",
      points: [
        "Why blogging in 2026 gives you outsized influence (and how to do it effectively)",
        "Using GitHub issues as an external brain to manage hundreds of projects",
        "The Django origin story and lessons from 20+ years of web development",
        "Rapid prototyping with AI: From idea to working demo in minutes",
      ],
    },
  ],
  "Adam Davidson": [
    {
      title: "Making Complex Economic Forces Understandable",
      points: [
        'Breaking down how AI is reshaping business models, just as "The Giant Pool of Money" explained the 2008 financial crisis',
        "Translating complicated economic interconnections into stories that resonate with both executives and frontline employees",
        "Cutting through AI hype to reveal what's actually happening and what it means for your organization",
      ],
    },
    {
      title: "The Passion Economy: Thriving in the 21st Century",
      points: [
        "Why the rules of business have fundamentally changed from the widget economy to the passion economy",
        "The eight rules of the new economy: intimacy, specialization, automation, and knowing your true value",
        "How small and medium enterprises are succeeding by breaking traditional economic laws of supply, demand, and pricing",
      ],
    },
    {
      title: "Navigating AI Transformation Without Taking Sides",
      points: [
        'Moving past "AI will save us" vs. "AI will destroy us" to practical understanding',
        "What prompt engineering, AI alignment, and new job categories mean for your workforce",
        'When to worry about the machines and when to embrace them as "capable but naive interns"',
      ],
    },
    {
      title: "Storytelling as a Business Strategy",
      points: [
        "How to communicate your company's purpose with urgency and clarity",
        "Creating shows, content, and narratives that people actually need to hear",
        "Why the best reporting starts with questions everyone else thinks are too obvious to ask",
      ],
    },
  ],
  "James Cham": [
    {
      title: "Spotting the Future Before It Arrives",
      points: [
        "How venture capitalists identify emerging AI trends by seeing thousands of cutting-edge technologies first",
        "Lessons from the Machine Intelligence Landscape: Mapping the AI startup ecosystem since 2014",
        "What Bloomberg Beta's portfolio reveals about where AI is actually creating business value",
      ],
    },
    {
      title: "When Discipline Meets Conviction: Investing Through AI Hype Cycles",
      points: [
        "Navigating the pattern: euphoria, over-investment, correction, consolidation, and compounding",
        "Are we in an AI bubble? Why enduring value requires both patient capital and clear conviction",
        "How to separate signal from noise when evaluating AI implementation opportunities",
      ],
    },
    {
      title: "The Future of Work: From Knowledge Workers to AI-Augmented Teams",
      points: [
        "Why we started with the premise that everyone's becoming a knowledge worker",
        "How the best software developers provide the blueprint for AI-enhanced productivity",
        "Machine learning as different from software development: New economic models and business opportunities",
      ],
    },
    {
      title: "From 0 to 1 in the Age of AI",
      points: [
        "Why great ideas require patient capital and a median of 7+ months before seed funding",
        "Building companies with real technical risk and market risk at venture scale",
        "The audacity required for tough tech teams to drive asymmetric change",
      ],
    },
  ],
  "Alex Komoroske": [
    {
      title: "Gardening Platforms: A New Mental Model for Technology",
      points: [
        'Why "gardening" beats "architecting" when building adaptive systems and platforms',
        "Lessons from the Slime Mold framework: How organizations actually work vs. how we think they work",
        "Nurturing emergence rather than exerting rigid control in complex systems",
      ],
    },
    {
      title: "Intentional Technology: Designing AI for Human Flourishing",
      points: [
        "The four pillars: human-centered, private by design, pro-social, and open-ended",
        "Why tiny technical decisions (like same-origin policy) become humanity's biggest pivots",
        "Building AI as an exocortex that extends your agency, not harvests your engagement",
      ],
    },
    {
      title: "Breaking Free from Centralization: Data Sovereignty in the AI Era",
      points: [
        "The real AI battle: Who controls your context and personal memories?",
        "Why bundling AI models with centralized data storage recreates the social media playbook",
        "Open ecosystems vs. walled gardens: Designing composable systems for AI's next 30 years",
      ],
    },
    {
      title: "Strategy from the Ground Up: Adjacent Possible Thinking",
      points: [
        "Moving beyond grand visions to actionable steps within reach",
        "Using \"strategy salons\" and \"nerd clubs\" to generate breakthrough ideas",
        "How to align company-wide strategy without dictating structure",
      ],
    },
  ],
  "Matt Beane": [
    {
      title: "The Three C's: Challenge, Complexity, and Connection",
      points: [
        "Why skill comes from struggle at the edge of your capability, not from comfort",
        "How intelligent machines disrupt the timeless formula for human ability",
        "Preserving the expert-novice relationship in the age of automation",
      ],
    },
    {
      title: "Shadow Learning: How the Best Workers Build Skill Despite the System",
      points: [
        "Uncovering positive deviants who find ways to develop expertise when approved methods fail",
        "Why surgical trainees watched hundreds of hours of YouTube despite mentors saying it wouldn't work",
        "The hidden curriculum of skill development in AI-augmented workplaces",
      ],
    },
    {
      title: "The War Between Productivity and Skill Development",
      points: [
        "How we're unintentionally removing novices from processes for the sake of efficiency",
        "Why default AI designs block the apprenticeship relationship that's worked for thousands of years",
        "Turning AI into an ally: Jointly optimizing for both performance gains and human capability",
      ],
    },
    {
      title: "Building 21st Century Apprenticeship Infrastructure",
      points: [
        "Practical strategies for direct, collaborative contact between experts and novices",
        "Designing technology that preserves rather than destroys skill development opportunities",
        "How to use ChatGPT and other AI tools without letting them subtly deprive you of challenge",
      ],
    },
  ],
  "Aria Finger": [
    {
      title: "AI's Role in Driving Social Impact",
      points: [
        "Exploring how organizations can leverage AI to scale civic engagement and create meaningful change",
        "Balancing technological innovation with human-centered approaches to social challenges",
      ],
    },
    {
      title: "Building Purpose-Driven Organizations at Scale",
      points: [
        "Growing mission-driven companies from startup to global reach while maintaining cultural values",
        "Creating organizational structures that prioritize both impact and operational excellence",
      ],
    },
    {
      title: "Engaging Gen Z and Millennials in the Workplace",
      points: [
        "Understanding how younger generations approach work, purpose, and professional fulfillment",
        "Building diverse, inclusive teams that drive innovation and measurable outcomes",
      ],
    },
    {
      title: "Strategic Technology Partnerships",
      points: [
        "Connecting Fortune 100 companies with emerging tech innovators and social enterprises",
        "Designing purpose-driven collaborations that create value for both corporations and communities",
      ],
    },
  ],
  "Jessica Johnston": [
    {
      title: "AI Integration Across Enterprise Operations",
      points: [
        "Translating AI capabilities into practical solutions for multinational organizations",
        "Building cross-functional alignment between technology teams and business stakeholders to drive AI adoption",
      ],
    },
    {
      title: "Leading Change Through Complex Organizations",
      points: [
        "Managing transformation initiatives across government, corporate, and nonprofit sectors",
        "Creating sustainable structures that support innovation while maintaining organizational stability",
      ],
    },
    {
      title: "Building High-Performance Global Teams",
      points: [
        "Developing collaborative frameworks for distributed teams working on strategic initiatives",
        "Fostering cultures that balance agility with accountability in technology-driven environments",
      ],
    },
    {
      title: "Strategic Advisory for Enterprise Transformation",
      points: [
        "Connecting senior leadership vision with on-the-ground execution capabilities",
        "Designing engagement strategies that accelerate organizational learning and adoption",
      ],
    },
  ],
  "Lilach Mollick": [
    {
      title: "Designing AI-Powered Educational Experiences",
      points: [
        "Building effective AI simulations and interactive learning tools for complex skill development",
        "Creating practical frameworks for instructors to design their own AI-enhanced assignments",
      ],
    },
    {
      title: "Seven Strategic Approaches to AI in the Classroom",
      points: [
        "Implementing AI as tutor, coach, mentor, teammate, tool, simulator, and student in learning environments",
        "Helping learners develop critical evaluation skills while maintaining the human in the loop",
      ],
    },
    {
      title: "Transforming Teaching Practice with AI Tools",
      points: [
        "Applying evidence-based teaching strategies using AI to create personalized learning at scale",
        "Addressing student misconceptions and enabling frequent practice through AI-assisted methods",
      ],
    },
    {
      title: "Balancing AI Innovation with Educational Integrity",
      points: [
        "Navigating the promises and risks of AI adoption in teaching and training contexts",
        "Designing systems that enhance rather than replace human judgment and creativity",
      ],
    },
  ],
  "Ayham Boucher": [
    {
      title: "From AI Experiments to Production Systems",
      points: [
        "Moving beyond prototypes to deploy AI agents and RAG systems that solve real institutional problems",
        "Building rapid iteration cycles where teams learn to fail fast and pivot based on user feedback",
      ],
    },
    {
      title: "Democratizing AI Innovation Across Organizations",
      points: [
        "Creating collaborative environments where students, faculty, and staff break down silos to build together",
        "Establishing bootcamps and sprint-based programs that accelerate AI adoption across diverse teams",
      ],
    },
    {
      title: "Practical RAG and Agent Architecture",
      points: [
        "Designing retrieval-augmented generation systems that ground AI responses in institutional knowledge",
        "Building multi-agent workflows with tool integration, memory, and reasoning capabilities for autonomous execution",
      ],
    },
    {
      title: "Leading AI Transformation in Higher Education",
      points: [
        "Balancing innovation velocity with responsible governance, security, and human oversight",
        "Navigating academic integrity challenges while reimagining teaching methods for the AI era",
      ],
    },
  ],
  "Claudine Gartenberg": [
    {
      title: "Corporate Purpose as Competitive Strategy",
      points: [
        "Understanding when purpose and profits reinforce each other versus when they create tradeoffs",
        "Linking employee beliefs about organizational meaning to measurable financial performance",
      ],
    },
    {
      title: "How Ownership Structure Shapes Organizational Culture",
      points: [
        "Examining differences in purpose strength between public companies, private equity, and founder-led firms",
        "Understanding how investor time horizons influence leadership decisions and employee experience",
      ],
    },
    {
      title: "Strategic Decisions and Their Impact on Purpose",
      points: [
        "Analyzing how acquisitions, particularly those involving unusual industry combinations, affect organizational coherence",
        "Managing the tension between strategic expansion and maintaining employee sense of meaning",
      ],
    },
    {
      title: "Pay Inequality and Organizational Performance",
      points: [
        "Exploring how compensation structures and social comparison affect firm strategy and outcomes",
        "Designing incentive systems that balance fairness perceptions with competitive positioning",
      ],
    },
  ],
  "Dr. Hila Lifshitz": [
    {
      title: "Human-AI Collaboration Patterns for Knowledge Work",
      points: [
        "Understanding Centaurs, Cyborgs, and Self-Automators: three distinct modes professionals use to work with AI",
        "Navigating the jagged frontier between tasks where AI excels and where human judgment remains critical",
      ],
    },
    {
      title: "From Closed Innovation to Open Problem-Solving",
      points: [
        "Lessons from NASA's decade-long transformation from internal R&D to open innovation communities",
        "Managing professional identity shifts when organizations open knowledge boundaries to external expertise",
      ],
    },
    {
      title: "Designing AI Integration That Preserves Human Agency",
      points: [
        "Maintaining employee ownership and championing behavior when introducing generative AI into creative work",
        "Balancing efficiency gains with the risk of disengagement when AI handles idea generation",
      ],
    },
    {
      title: "The Future of Expertise in AI-Enhanced Organizations",
      points: [
        "How different collaboration modes lead to upskilling, newskilling, or deskilling outcomes",
        "Strategic task selection to determine when AI should support, integrate with, or avoid specific workflows",
      ],
    },
  ],
};

export function getAdvisoryTopicsForExpert(
  name: string,
  advisoryTopicsRichtext?: string | null
): AdvisoryTopic[] | null {
  if (advisoryTopicsRichtext?.trim()) {
    return null; // caller will render richtext from Strapi
  }
  return expertAdvisoryTopicsByName[name] ?? null;
}

/** Generate URL slug from expert name when Strapi slug is missing (e.g. existing entries before slug was added). */
export function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}
