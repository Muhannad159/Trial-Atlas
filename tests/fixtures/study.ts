// Small synthetic fixture in the shape of the public registry response.
export const study = {
  protocolSection: {
    identificationModule: {
      nctId: "NCT00000001",
      briefTitle: "Example imaging study",
    },
    statusModule: {
      overallStatus: "RECRUITING",
      lastUpdatePostDateStruct: { date: "2026-01-01" },
    },
    descriptionModule: {
      briefSummary: "An example study for automated testing.",
    },
    designModule: {
      studyType: "INTERVENTIONAL",
      phases: ["PHASE2"],
      enrollmentInfo: { count: 100, type: "ESTIMATED" },
    },
    conditionsModule: { conditions: ["Example condition"] },
    eligibilityModule: {
      eligibilityCriteria:
        "Inclusion Criteria:\n* Adults\n\nExclusion Criteria:\n* None listed",
      minimumAge: "18 Years",
      maximumAge: "65 Years",
      sex: "ALL",
      healthyVolunteers: false,
    },
    contactsLocationsModule: {
      locations: [
        {
          facility: "Example research site",
          city: "Cairo",
          country: "Egypt",
          status: "RECRUITING",
          geoPoint: { lat: 30.04, lon: 31.23 },
        },
      ],
      centralContacts: [
        { name: "Example team", email: "research@example.org" },
      ],
    },
    referencesModule: {
      references: [{ pmid: "12345678", type: "BACKGROUND" }],
    },
  },
};
