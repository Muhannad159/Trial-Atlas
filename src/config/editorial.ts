export const editorial = {
  "how-clinical-trials-work": {
    title: "Understanding clinical trials",
    eyebrow: "A clearer starting point",
    description:
      "Understand what a clinical trial is, what study records tell you, and how to take the next step.",
    sections: [
      [
        "What is a clinical trial?",
        "A clinical trial is a research study in which people are assigned to an intervention, such as a medicine, device, procedure, or behavioral approach, so researchers can evaluate its effects. An observational study follows people and outcomes without assigning an intervention.",
      ],
      [
        "What does a study phase mean?",
        "For many drug trials, phases describe stages of research: early studies often investigate safety and dosing, while later studies examine effects in larger groups and may compare treatments. Some device, behavioral, and observational studies do not have a phase. A later phase does not guarantee benefit.",
      ],
      [
        "Read more than the title",
        "Review the purpose, design, interventions, outcomes, participation criteria, site status, and dates. Requirements can include a specific diagnosis, prior treatments, or test results. TrialAtlas displays the reported criteria; it does not assess whether you qualify.",
      ],
      [
        "Contact the research team",
        "Use the official study contact to ask about availability, visits, risks, possible benefits, costs, travel, and any study-partner requirements. Discuss participation with a qualified healthcare professional. Taking part is voluntary; the study team explains the informed-consent process.",
      ],
      [
        "Where the information comes from",
        "ClinicalTrials.gov records are submitted by study sponsors or investigators. A listing is not an endorsement, a guarantee of quality, or confirmation that an intervention is safe or effective. Always confirm current details with the official study team.",
      ],
    ],
  },
  methodology: {
    title: "Sources & methodology",
    eyebrow: "Know what you’re looking at",
    description:
      "How TrialAtlas finds, organizes, and presents public research information.",
    sections: [
      [
        "Primary source",
        "TrialAtlas retrieves study records from ClinicalTrials.gov API v2. We preserve NCT identifiers and link every record to its authoritative source. Search defaults to recruiting and not-yet-recruiting interventional studies, ordered by last update. Other statuses and observational studies are available in the filters.",
      ],
      [
        "Freshness and completeness",
        "Searches and study details are scheduled to revalidate every six hours. Cached information may be older during an upstream outage. Check the official record for the latest data. The registry update date describes when a record was posted, not when a site last confirmed availability. Missing fields are labeled as unavailable. Overall trial status can differ from individual site status.",
      ],
      [
        "Maps and topics",
        "Maps use coordinates provided in the registry and show sites only for the current results page. Studies without coordinates remain in the text list. Topic pages use curated condition or keyword searches; imaging mentions do not necessarily indicate that imaging is the primary intervention. Rare-disease results are a starting point, not an exhaustive catalog.",
      ],
      [
        "Related evidence",
        "PubMed citations come from PMIDs in the trial record or a search for its exact NCT identifier. We do not use broad topic similarity to imply a direct relationship. Citations may describe background research rather than results. PubMed responses are scheduled to revalidate every 24 hours; missing citations do not prove that no publications exist.",
      ],
      [
        "Comparison and exports",
        "Comparison highlights differences in reported values, with no quality score or recommendation. Shared links store study IDs and load the latest available data when reopened. Downloads record when the report was generated and include source links.",
      ],
      [
        "How records are presented",
        "TrialAtlas selects fields from the registry, converts machine labels into readable text, groups sites by country on search cards, shortens card summaries visually, and formats reported values for comparison and export. Full study descriptions and eligibility text are rendered as sanitized Markdown. Missing values receive explicit labels. Maps omit sites without valid coordinates but retain them in text lists. Study contact fields are omitted from the app and exports; the official record provides current contact information. We do not alter the underlying research findings or claim ownership of the source database.",
      ],
      [
        "Source terms",
        "ClinicalTrials.gov data are attributed to ClinicalTrials.gov and each study shows its last registry update date. Study contact addresses are for participation inquiries, not marketing or promotion. Third-party material may have its own copyright restrictions. See the official source terms linked below.",
      ],
      [
        "NLM attribution",
        "This product uses publicly available data from the U.S. National Library of Medicine (NLM), National Institutes of Health, Department of Health and Human Services; NLM is not responsible for the product and does not endorse or recommend this or any other product.",
      ],
    ],
  },
  "data-terms": {
    title: "Data sources & terms",
    eyebrow: "Source acknowledgment",
    description:
      "The origin of study information and the terms governing its reuse.",
    sections: [
      [
        "Source and ownership",
        "Study information comes from ClinicalTrials.gov, a United States Government database maintained by the National Library of Medicine (NLM), National Institutes of Health (NIH). Citation metadata comes from PubMed through NCBI. TrialAtlas is an independent interface and claims no proprietary rights over the source databases or their records.",
      ],
      [
        "Applicable source terms",
        "TrialAtlas uses these data sources subject to their applicable terms and conditions. These include the ClinicalTrials.gov Terms and Conditions and the applicable NLM/NCBI data-use terms. Those source terms govern the data; this notice does not replace them, grant additional rights, or imply government approval.",
      ],
      [
        "Updates and presentation",
        "Each study shows its last registry update date. Study data are scheduled to revalidate after six hours and PubMed metadata after 24 hours when requested. Cached records may remain older during outages, and exports are dated snapshots. Selected fields are reformatted, labels are made readable, card summaries are visually shortened, and contact fields are omitted. See Sources & methodology for the full description of these changes and the official record for current information.",
      ],
      [
        "Study contacts",
        "TrialAtlas does not display structured study contact names, emails, or phone numbers in its pages, comparisons, or exports. Participation inquiries should go through the official ClinicalTrials.gov study record. Extracted registry email addresses must not be used for marketing or promotion.",
      ],
      [
        "No endorsement or medical advice",
        "NLM, NIH, and the United States Government do not endorse TrialAtlas. Source information may be incomplete or out of date. TrialAtlas does not provide medical advice or determine eligibility; verify information with the responsible study team.",
      ],
      [
        "Further reuse",
        "Public access does not remove applicable copyright or other source conditions. Third-party material may have additional restrictions. Anyone reusing source data must review the original terms; TrialAtlas does not grant rights to third-party content.",
      ],
    ],
  },
  about: {
    title: "A clearer view of research",
    eyebrow: "About TrialAtlas",
    description:
      "A public tool for finding, understanding, and comparing clinical research.",
    sections: [
      [
        "The idea",
        "Finding a study is only the beginning. Understanding its purpose, participation criteria, locations, and evidence takes context. TrialAtlas brings these details together in a readable workspace for patients, caregivers, clinicians, and researchers.",
      ],
      [
        "Built by Muhannad Abdallah",
        "TrialAtlas is an independent software project exploring useful, accessible healthcare data interfaces. It combines public research records with transparent source links and a comparison workflow. It is not affiliated with ClinicalTrials.gov, NIH, NLM, or any study sponsor.",
      ],
      [
        "Open to explore",
        "You can search, compare, and download study summaries without an account. TrialAtlas does not enroll participants, assess eligibility, or provide medical recommendations. The research team is the right place for participation questions.",
      ],
    ],
  },
  privacy: {
    title: "Privacy",
    eyebrow: "Simple by design",
    description: "What happens to information when you use TrialAtlas.",
    sections: [
      [
        "No patient profiles",
        "TrialAtlas has no user accounts, patient profiles, inquiry forms, or application database. Do not enter names, medical records, or other personal information in searches. We do not request browser geolocation or use advertising or analytics cookies.",
      ],
      [
        "Your selection and URLs",
        "The comparison tray exists in memory during your visit. We do not save it in localStorage, sessionStorage, or cookies. Search filters and comparison IDs appear in URLs, so they may be stored in browser history or shared when you copy a link. Downloads are saved to your device.",
      ],
      [
        "Technical requests",
        "Hosting infrastructure may process IP addresses, request URLs, and ordinary access logs. Study searches are sent server-side to ClinicalTrials.gov, and evidence requests to NCBI. Interactive maps contact OpenFreeMap directly and may expose ordinary network information to that provider. This app does not claim those providers keep no logs.",
      ],
      [
        "External links",
        "Official study records and PubMed links open external services. Their privacy practices apply when you use them.",
      ],
    ],
  },
  disclaimer: {
    title: "Information, with context",
    eyebrow: "Disclaimer",
    description: "The purpose and limitations of TrialAtlas study information.",
    sections: [
      [
        "Research discovery",
        "TrialAtlas provides public research information for exploration. It does not provide medical advice, diagnosis, treatment recommendations, eligibility assessments, or enrollment services. Contact the official study team and a qualified healthcare professional to discuss participation.",
      ],
      [
        "No endorsement",
        "A study appearing in TrialAtlas or ClinicalTrials.gov is not an endorsement or proof that an intervention is safe, effective, or suitable for you. Records may be incomplete or out of date. Confirm details with the responsible research team.",
      ],
      [
        "Evidence and comparisons",
        "Referenced articles may report background information rather than study results. Differences in study designs and populations can limit comparison. Highlighted differences are descriptive and do not rank studies or treatments.",
      ],
      [
        "Source policies",
        "NCBI data and citations are subject to NCBI policies and notices. PubMed abstracts may be protected by copyright; TrialAtlas shows citation metadata and links rather than redistributing article full text.",
      ],
    ],
  },
} as const;
