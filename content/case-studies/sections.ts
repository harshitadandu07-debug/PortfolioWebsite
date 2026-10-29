// The sections shown in each case study's side navigation. `block` is the index of the block in the case study's
// `blocks` array whose top is where the section starts, so the link lands on that section's eyebrow label.
export type NavSection = { id: string; label: string; block: number };

export const caseStudySections: Record<string, NavSection[]> = {
  doodlelearning: [
    { id: "overview", label: "Overview", block: 0 },
    { id: "at-a-glance", label: "At a glance", block: 1 },
    { id: "business-goal", label: "Business goal", block: 2 },
    { id: "tldr", label: "TL;DR", block: 3 },
    { id: "business-implication", label: "Business implication", block: 6 },
    { id: "hypothesis", label: "Our hypothesis", block: 7 },
    { id: "speaking-to-users", label: "Speaking to users", block: 8 },
    { id: "solution-ideation", label: "Solution ideation", block: 10 },
  ],
  soldesignsystem: [
    { id: "overview", label: "Overview", block: 0 },
    { id: "impact", label: "Impact", block: 4 },
    { id: "context", label: "The context", block: 6 },
    { id: "problem", label: "The problem", block: 10 },
    { id: "buy-in", label: "Stakeholder buy-in", block: 16 },
    { id: "scope", label: "Defining the scope", block: 21 },
    { id: "homepage", label: "Reimagining the homepage", block: 26 },
    { id: "components", label: "Extracting components", block: 31 },
    { id: "delivery", label: "Final delivery", block: 42 },
    { id: "reflections", label: "Reflections", block: 44 },
  ],
};
