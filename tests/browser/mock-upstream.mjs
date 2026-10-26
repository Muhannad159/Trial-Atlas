// Only loaded by Playwright's server process. Production never imports this file.
const realFetch = globalThis.fetch;
const studies = Array.from({ length: 4 }, (_, i) => ({
  protocolSection: {
    identificationModule: {
      nctId: `NCT0000000${i + 1}`,
      briefTitle: `Example diabetes research study ${i + 1}`,
    },
    statusModule: {
      overallStatus: "RECRUITING",
      lastUpdatePostDateStruct: { date: "2026-01-01" },
    },
    descriptionModule: {
      briefSummary: "Synthetic record for testing the discovery workflow.",
    },
    conditionsModule: { conditions: ["Diabetes"] },
    sponsorCollaboratorsModule: {
      leadSponsor: { name: "Example research group" },
    },
    designModule: {
      studyType: "INTERVENTIONAL",
      phases: [i % 2 ? "PHASE3" : "PHASE2"],
      enrollmentInfo: { count: 100 + i, type: "ESTIMATED" },
    },
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
          facility: "Example site",
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
}));
globalThis.fetch = async (input, init) => {
  const url = new URL(
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url,
  );
  if (url.hostname === "clinicaltrials.gov") {
    if (url.pathname === "/api/v2/studies") {
      if (url.searchParams.get("query.cond") === "malformed")
        return Response.json({ unexpected: true });
      if (url.searchParams.get("query.cond") === "outage")
        return new Response("", { status: 503 });
      if (url.searchParams.get("query.cond") === "empty")
        return Response.json({ studies: [], totalCount: 0 });
      const page = url.searchParams.has("pageToken");
      return Response.json({
        studies: page ? studies.slice(3) : studies,
        totalCount: 5,
        ...(!page ? { nextPageToken: "second-page" } : {}),
      });
    }
    const id = url.pathname.split("/").at(-1);
    if (id === "NCT99999998") return new Response("", { status: 503 });
    if (id === "NCT99999997")
      return Response.json({
        protocolSection: {
          identificationModule: { nctId: id, briefTitle: "Sparse test study" },
          statusModule: { overallStatus: "UNKNOWN" },
        },
      });
    const record = studies.find(
      (s) => s.protocolSection.identificationModule.nctId === id,
    );
    return record ? Response.json(record) : new Response("", { status: 404 });
  }
  if (url.hostname === "eutils.ncbi.nlm.nih.gov") {
    if (url.pathname.endsWith("esearch.fcgi"))
      return Response.json({ esearchresult: { idlist: [] } });
    return Response.json({
      result: {
        12345678: {
          title: "Example background article",
          fulljournalname: "Example Journal",
          pubdate: "2026",
          authors: [{ name: "Example author" }],
        },
      },
    });
  }
  return realFetch(input, init);
};
