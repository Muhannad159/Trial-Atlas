# TrialAtlas

A clinical trial finder for exploring public research, viewing study locations, and comparing studies side by side.

![TrialAtlas homepage](docs/images/homepage.png)

## Overview

TrialAtlas turns public clinical-trial records into a clear research-discovery experience. It brings study search, location exploration, side-by-side comparison, eligibility information, and related literature into one workflow, while keeping direct links to the official records. It is designed for researchers, healthcare learners, and anyone exploring the clinical-research landscape.

## Features

- Search by condition, location, intervention, sponsor, recruitment status, phase, age group, and study type.
- Explore interactive maps with Arabic and right-to-left label support.
- Read study details, eligibility criteria, and linked PubMed citations.
- Compare up to three studies, share a comparison link, and export PDF or CSV summaries.
- Browse search-engine-friendly condition and medical-imaging topic pages.

## Run locally

Requires Node.js 22 or newer.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000).

Set `NEXT_PUBLIC_SITE_URL` to your public URL before deploying. Set `NCBI_EMAIL` to your maintainer email; `NCBI_API_KEY` is optional and must remain server-only. Never commit `.env.local`.

## Built with

Next.js App Router, TypeScript, Tailwind CSS, MapLibre, OpenFreeMap, and React PDF.

## Data sources and terms

Study data come from [ClinicalTrials.gov](https://clinicaltrials.gov), a U.S. Government database maintained by NLM/NIH. Citation metadata come from [PubMed](https://pubmed.ncbi.nlm.nih.gov/). TrialAtlas is independent, claims no ownership of these databases, and is not endorsed by NLM, NIH, or the U.S. Government.

TrialAtlas uses these data sources subject to their applicable terms and conditions: [ClinicalTrials.gov terms](https://clinicaltrials.gov/about-site/terms-conditions), [NLM data-use conditions](https://www.nlm.nih.gov/databases/download.html), and [NCBI policies](https://www.ncbi.nlm.nih.gov/home/about/policies/). Third-party copyright restrictions still apply. Extracted study email addresses must not be used for marketing.

Selected fields are reformatted, summaries are visually shortened on cards, labels are made readable, and structured study contact fields are omitted. The app's **Sources & methodology** and **Data sources & terms** pages explain these changes. Always check the official record for current details.

For research discovery only—not medical advice, an eligibility assessment, or an enrollment service.
