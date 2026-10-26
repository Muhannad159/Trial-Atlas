import { z } from "zod";
const s = z.string().optional();
const list = z.array(z.string()).optional();
export const studySchema = z.object({
  protocolSection: z.object({
    identificationModule: z.object({
      nctId: z.string().regex(/^NCT\d{8}$/),
      briefTitle: z.string(),
    }),
    statusModule: z.object({
      overallStatus: z.string(),
      lastUpdatePostDateStruct: z.object({ date: s }).optional(),
      startDateStruct: z.object({ date: s }).optional(),
      completionDateStruct: z.object({ date: s }).optional(),
    }),
    sponsorCollaboratorsModule: z
      .object({ leadSponsor: z.object({ name: s }).optional() })
      .optional(),
    descriptionModule: z
      .object({ briefSummary: s, detailedDescription: s })
      .optional(),
    conditionsModule: z.object({ conditions: list }).optional(),
    designModule: z
      .object({
        studyType: s,
        phases: list,
        enrollmentInfo: z
          .object({ count: z.number().optional(), type: s })
          .optional(),
        designInfo: z
          .object({
            allocation: s,
            interventionModel: s,
            primaryPurpose: s,
            observationalModel: s,
            timePerspective: s,
            maskingInfo: z.object({ masking: s }).optional(),
          })
          .optional(),
      })
      .optional(),
    eligibilityModule: z
      .object({
        eligibilityCriteria: s,
        minimumAge: s,
        maximumAge: s,
        sex: s,
        healthyVolunteers: z.boolean().optional(),
      })
      .optional(),
    contactsLocationsModule: z
      .object({
        locations: z
          .array(
            z.object({
              facility: s,
              city: s,
              country: s,
              status: s,
              geoPoint: z
                .object({ lat: z.number(), lon: z.number() })
                .optional(),
            }),
          )
          .optional(),
      })
      .optional(),
    armsInterventionsModule: z
      .object({
        interventions: z
          .array(z.object({ name: s, type: s, description: s }))
          .optional(),
      })
      .optional(),
    outcomesModule: z
      .object({
        primaryOutcomes: z
          .array(z.object({ measure: s, description: s, timeFrame: s }))
          .optional(),
      })
      .optional(),
    referencesModule: z
      .object({
        references: z.array(z.object({ pmid: s, type: s })).optional(),
      })
      .optional(),
  }),
});
export type RawStudy = z.infer<typeof studySchema>;
