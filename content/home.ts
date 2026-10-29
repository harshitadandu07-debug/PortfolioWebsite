export const hero = {
  title: "Hi, I'm Harshita",
  tagline: "I turn data into meaning, tell stories through interfaces, and build systems that scale.",
  talkLink: "Talk to me",
  talkRest: " about anything design, vibe-coding or my go-to coffee order <3",
  linkedin: "https://www.linkedin.com/in/harshita-dandu/",
  email: "mailto:harshitadandu07@gmail.com",
  school: "MS HCI @ Pratt Institute",
  current: "Currently designing for",
  prev: "Prev Product Design @ HPE, Homezen Inn.",
};

export const filters = ["Product Strategy", "AR/VR Design", "Design Systems"];

export type Project = {
  slug: string;
  href: string;
  title: string;
  tags: string[];
  tagFont: "apfel" | "raleway";
};

export const projects: Project[] = [
  {
    slug: "saciva",
    href: "/saciva",
    title: "Improving feature discoverability & result relevance to increase user acquisition & conversion",
    tags: ["B2C", "Growth", "Designing for AI"],
    tagFont: "apfel",
  },
  {
    slug: "soldesignsystem",
    href: "/soldesignsystem",
    title: "Reducing Rework and Helping Teams Scale Faster by Building SoL’s First Design System",
    tags: ["Design System", "Dev Handoff", "EdTech"],
    tagFont: "apfel",
  },
  {
    slug: "soakmaster",
    href: "/soakmaster",
    title: "SoakMaster - Boosting team productivity with a dashboard that reduced manual effort by 96%",
    tags: ["B2B Enterprise Dashboard", "Data Visualization", "End-to-End"],
    tagFont: "raleway",
  },
  {
    // Placeholder for the Discovery Education case study (replaces the UpForm card).
    slug: "doodlelearning",
    href: "/doodlelearning",
    title: "Discovery Education",
    tags: ["Product Design Intern, Growth"],
    tagFont: "apfel",
  },
];

export const testimonials = [
  {
    name: "A S Maadheswaran",
    role: "Senior Manager | HPE",
    nameWeight: "semibold",
    size: 16,
    quote: [
      "“Harshita is a dedicated young talent who ",
      ["designed and delivered", true],
      " an ",
      ["end-to-end", true],
      " testing automation tool, with thoughtful collaboration and a knack for ",
      ["asking the right questions", true],
      " to drive continuous improvement”",
    ],
  },
  {
    name: "Madhav Tankha",
    role: "Assistant Director of UX | MoMA",
    nameWeight: "semibold",
    size: 16,
    quote: [
      "“Harshita is a really good designer and researcher, ",
      ["constantly iterating her work with an eye towards perfecting every aspect of it.", true],
      "”",
    ],
  },
  {
    name: "Anusree K Manoj",
    role: "Software Engineer | HPE",
    nameWeight: "bold",
    size: 18,
    quote: [
      "Harshita is a talented designer with a strong user-centered mindset, ",
      ["blending creativity and analytical thinking", true],
      " while consistently showing ",
      ["professionalism, collaboration, and a genuine eagerness to grow.", true],
    ],
  },
] as const;

export const contact = {
  title: "Say hello <3",
  subtitle: "Would love to talk projects, collaborations, or anything design!",
};
