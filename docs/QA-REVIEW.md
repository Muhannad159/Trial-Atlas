# TrialAtlas verification — 26 October 2026

## Fixes from scenario testing

- A malformed registry search payload now produces the unavailable state rather than claiming there are zero matches.
- A comparison whose requested records are all missing/unavailable has a distinct recovery message. Partial comparisons identify omitted records; exports fail explicitly when a requested record cannot be retrieved.
- Reserved object-property names such as `/constructor` and `/__proto__` resolve to the not-found page instead of failing in editorial rendering.
- Export downloads have a 35-second client timeout and re-enable their controls after failure.
- Maps resize when revealed on mobile, ignore out-of-range coordinates, and retain the accessible location list when map loading fails.
- Removing a study from the comparison also removes it from the in-memory tray.
- MapLibre upgraded from 5.24.0 to 6.16.0: built-in Arabic shaping/bidirectional layout and the matching Next.js-bundled worker. No external RTL plugin is needed. WebGL2 is required; unsupported browsers retain the text fallback.
- Search cards display registry update dates. Methodology documents data transformations, source terms, contact-use restrictions, and potentially stale caches during outages.

## Coverage

Automated browser workflows cover pagination/filter persistence, new-search cursor reset, partial and unavailable comparisons, duplicate/invalid IDs, three-study limits, PDF/CSV output, failed downloads and retries, clipboard denial, mobile map failure and list recovery, sparse records, malformed upstream responses, not-found routes, selection storage behavior, and selection removal. Axe checks cover the homepage, search, study details, and comparison; these are automated checks, not a full accessibility certification.

Unit/API tests cover input bounds, API query construction, mapping missing values, CSV formula escaping, structured-data escaping, registry outages/timeouts, and exact-NCT PubMed fallback.

Live production smoke checks used real ClinicalTrials.gov searches and OpenFreeMap tiles. Arabic presentation-form glyph requests completed successfully, labels were visually reviewed, and no page errors occurred during the map check.

Production dependency audit after the upgrade: zero known vulnerabilities reported by `npm audit --omit=dev`. This is a point-in-time dependency check, not a penetration test. Browser checks were run in desktop Chrome with mobile viewport emulation; physical iOS/Android and Firefox/Safari were not tested.

## Operational limits

- Registry and PubMed availability/freshness remain upstream dependencies; source update dates are not guarantees of current recruitment.
- PubMed throttling is per process. A shared quota/cache is needed before scaling across many server instances.
- No load test, jurisdiction-specific legal clearance, or guarantee of search ranking is implied.
- Configure the final public origin and maintainer email before deployment. Review hosting logs/retention and cross-border handling before launch.

## Official data-use sources

- ClinicalTrials.gov terms: https://clinicaltrials.gov/about-site/terms-conditions
- NLM reuse conditions: https://www.nlm.nih.gov/databases/download.html
- NCBI notices: https://www.ncbi.nlm.nih.gov/home/about/policies/
- NCBI API guidance: https://www.ncbi.nlm.nih.gov/books/NBK25497/
- Egyptian Personal Data Protection Center: https://pdpc.gov.eg/

ClinicalTrials.gov data are available internationally without charge, subject to attribution, current-data/update-date and modification notices, restrictions on ownership claims, and a prohibition on marketing with extracted email addresses. Third-party copyright can still apply. Free portfolio status is not evidence of an Egyptian regulatory exemption. Ask the Egyptian authority or qualified local counsel about the actual hosting/logging and published contact-data processing; TrialAtlas is not a clinical-study sponsor or an enrollment service.
