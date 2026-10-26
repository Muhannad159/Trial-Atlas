import type { TrialDetail } from "@/types/trial";
import type { RawStudy } from "./schema";
export function mapStudy(study: RawStudy): TrialDetail {
  const p = study.protocolSection;
  const design = p.designModule?.designInfo;
  return {
    id: p.identificationModule.nctId,
    title: p.identificationModule.briefTitle,
    status: p.statusModule.overallStatus,
    updated: p.statusModule.lastUpdatePostDateStruct?.date || "",
    phases: p.designModule?.phases || [],
    studyType: p.designModule?.studyType || "",
    conditions: p.conditionsModule?.conditions || [],
    sponsor: p.sponsorCollaboratorsModule?.leadSponsor?.name || "Not provided",
    summary: p.descriptionModule?.briefSummary || "",
    description: p.descriptionModule?.detailedDescription || "",
    locations: (p.contactsLocationsModule?.locations || []).map((l) => ({
      facility: l.facility || "Study site",
      city: l.city || "",
      country: l.country || "",
      status: l.status,
      lat: l.geoPoint?.lat,
      lng: l.geoPoint?.lon,
    })),
    eligibility: p.eligibilityModule?.eligibilityCriteria || "",
    minAge: p.eligibilityModule?.minimumAge || "Not provided",
    maxAge: p.eligibilityModule?.maximumAge || "Not provided",
    sex: p.eligibilityModule?.sex || "Not provided",
    healthyVolunteers: p.eligibilityModule?.healthyVolunteers,
    enrollment: p.designModule?.enrollmentInfo?.count,
    enrollmentType: p.designModule?.enrollmentInfo?.type,
    startDate: p.statusModule.startDateStruct?.date || "",
    completionDate: p.statusModule.completionDateStruct?.date || "",
    design: [
      design?.allocation,
      design?.interventionModel,
      design?.primaryPurpose,
      design?.observationalModel,
      design?.timePerspective,
      design?.maskingInfo?.masking,
    ].filter((v): v is string => !!v),
    interventions: (p.armsInterventionsModule?.interventions || []).map(
      (i) => ({
        name: i.name || "",
        type: i.type || "",
        description: i.description || "",
      }),
    ),
    outcomes: (p.outcomesModule?.primaryOutcomes || []).map((o) => ({
      measure: o.measure || "",
      description: o.description || "",
      timeFrame: o.timeFrame || "",
    })),
    references: (p.referencesModule?.references || [])
      .filter((r) => r.pmid && /^\d+$/.test(r.pmid))
      .map((r) => ({ pmid: r.pmid!, type: r.type || "" })),
  };
}
