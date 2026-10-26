export interface Hub {
  slug: string;
  title: string;
  eyebrow: string;
  query: string;
  description: string;
  guidance: string;
  kind: "conditions" | "topics";
}
export const conditionHubs: Hub[] = [
  {
    slug: "cancer",
    title: "Cancer",
    eyebrow: "Oncology",
    query: "cancer",
    description:
      "Explore research across cancer types, treatment approaches, and stages of care.",
    guidance:
      "Check the cancer type, stage, previous treatments, and biomarker criteria in each study. A broad cancer search can return studies with very different requirements.",
    kind: "conditions",
  },
  {
    slug: "diabetes",
    title: "Diabetes",
    eyebrow: "Metabolic health",
    query: "diabetes",
    description:
      "Discover studies investigating diabetes treatments, monitoring, and everyday management.",
    guidance:
      "Distinguish Type 1 from Type 2 diabetes and review age ranges, current medications, and treatment history in the original eligibility criteria.",
    kind: "conditions",
  },
  {
    slug: "cardiovascular-disease",
    title: "Heart & vascular health",
    eyebrow: "Cardiology",
    query: "cardiovascular disease",
    description:
      "Find research into heart disease, vascular conditions, prevention, and recovery.",
    guidance:
      "Studies may focus on specific diagnoses or procedures. Read the intervention and outcome sections to understand what the research is investigating.",
    kind: "conditions",
  },
  {
    slug: "alzheimers-disease",
    title: "Alzheimer’s disease",
    eyebrow: "Neurology",
    query: "Alzheimer disease",
    description:
      "Explore research into Alzheimer’s disease, assessment, treatments, and support.",
    guidance:
      "Study requirements can include disease stage, assessments, and participation by a study partner. Contact the study team for details.",
    kind: "conditions",
  },
  {
    slug: "asthma",
    title: "Asthma",
    eyebrow: "Respiratory health",
    query: "asthma",
    description:
      "Browse studies examining asthma care, monitoring, and treatment approaches.",
    guidance:
      "Review the age range, asthma characteristics, and medication criteria. The study team can explain how these requirements are assessed.",
    kind: "conditions",
  },
  {
    slug: "copd",
    title: "COPD",
    eyebrow: "Respiratory health",
    query: "chronic obstructive pulmonary disease",
    description:
      "Discover studies focused on COPD, pulmonary rehabilitation, and respiratory care.",
    guidance:
      "Read the detailed eligibility criteria and study procedures, including any lung-function or treatment-history requirements.",
    kind: "conditions",
  },
  {
    slug: "rare-diseases",
    title: "Rare diseases",
    eyebrow: "Specialist research",
    query: "rare disease",
    description:
      "A starting point for exploring research involving rare conditions.",
    guidance:
      "This topic search is not a complete directory of rare-disease research. Search your specific condition or its alternative name for more precise results.",
    kind: "conditions",
  },
];
export const imagingHubs: Hub[] = [
  {
    slug: "mri",
    title: "MRI research",
    query: "magnetic resonance imaging",
    description:
      "Explore studies investigating or using magnetic resonance imaging.",
  },
  {
    slug: "ct",
    title: "CT research",
    query: "computed tomography",
    description:
      "Explore studies involving computed tomography and imaging workflows.",
  },
  {
    slug: "pet",
    title: "PET research",
    query: "positron emission tomography",
    description:
      "Explore studies involving PET imaging and molecular imaging research.",
  },
  {
    slug: "ultrasound",
    title: "Ultrasound research",
    query: "ultrasound",
    description:
      "Discover studies involving ultrasound imaging and related procedures.",
  },
  {
    slug: "diagnostic-imaging",
    title: "Diagnostic imaging",
    query: "diagnostic imaging",
    description:
      "Explore research into imaging methods and their role in assessment.",
  },
  {
    slug: "ai-medical-imaging",
    title: "AI in medical imaging",
    query: "artificial intelligence AND imaging",
    description:
      "Explore research involving artificial intelligence and medical images.",
  },
].map((h) => ({
  ...h,
  eyebrow: "Imaging & technology",
  kind: "topics" as const,
  guidance:
    "These keyword results may include studies that use imaging as a supporting procedure. Review the purpose, interventions, and outcomes to understand its role. Inclusion here does not establish effectiveness or regulatory approval.",
}));
export const allHubs = [...conditionHubs, ...imagingHubs];
