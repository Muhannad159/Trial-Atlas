import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ComparisonExport } from "@/types/trial";
import { comparisonRows } from "./rows";
const styles = StyleSheet.create({
  page: { padding: 35, fontFamily: "Helvetica", fontSize: 9, color: "#172e38" },
  title: { fontSize: 24, marginBottom: 10, color: "#126d62" },
  note: { fontSize: 9, lineHeight: 1.5, marginBottom: 20 },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #dce3df",
    paddingVertical: 9,
  },
  label: { width: "18%", paddingRight: 10, fontSize: 8, color: "#596d72" },
  value: { flex: 1, paddingHorizontal: 7, fontSize: 8, lineHeight: 1.5 },
  foot: {
    position: "absolute",
    bottom: 18,
    left: 35,
    right: 35,
    fontSize: 7,
    color: "#596d72",
  },
});
export function ComparisonPdf({ data }: { data: ComparisonExport }) {
  const overviewRows = comparisonRows.filter(
    (r) =>
      !["Eligibility", "Locations", "Purpose", "Primary outcomes"].includes(
        r.name,
      ),
  );
  return (
    <Document title="TrialAtlas study comparison" author="TrialAtlas">
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>TrialAtlas / Study comparison</Text>
        <Text style={styles.note}>
          Generated {data.generatedAt}. Public data from ClinicalTrials.gov,
          retrieved from a cache scheduled to refresh every six hours (may be
          older during outages). Research discovery only; study teams determine
          eligibility.
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Study</Text>
          {data.trials.map((t) => (
            <View key={t.id} style={styles.value}>
              <Text>{t.id}</Text>
              <Text>{t.title}</Text>
              <Link src={`https://clinicaltrials.gov/study/${t.id}`}>
                Official record
              </Link>
            </View>
          ))}
        </View>
        {overviewRows.map((r) => (
          <View key={r.name} style={styles.row} wrap={false}>
            <Text style={styles.label}>{r.name}</Text>
            {data.trials.map((t) => (
              <Text key={t.id} style={styles.value}>
                {r.get(t)}
              </Text>
            ))}
          </View>
        ))}
        <Text
          fixed
          style={styles.foot}
          render={({ pageNumber, totalPages }) =>
            `TrialAtlas · Information may change · ${pageNumber} / ${totalPages}`
          }
        />
      </Page>
      {data.trials.map((t) => (
        <Page size="A4" key={t.id} style={styles.page}>
          <Text style={styles.title}>{t.id}</Text>
          <Text style={{ fontSize: 14, marginBottom: 20 }}>{t.title}</Text>
          {comparisonRows
            .filter((r) =>
              [
                "Purpose",
                "Eligibility",
                "Locations",
                "Primary outcomes",
              ].includes(r.name),
            )
            .map((r) => (
              <View key={r.name} style={{ marginBottom: 18 }}>
                <Text style={{ fontSize: 12, marginBottom: 6 }}>{r.name}</Text>
                <Text style={{ fontSize: 9, lineHeight: 1.6 }}>{r.get(t)}</Text>
              </View>
            ))}
          <Link src={`https://clinicaltrials.gov/study/${t.id}`}>
            View authoritative study record
          </Link>
          <Text
            fixed
            style={styles.foot}
            render={({ pageNumber, totalPages }) =>
              `TrialAtlas · Study teams determine eligibility · ${pageNumber} / ${totalPages}`
            }
          />
        </Page>
      ))}
    </Document>
  );
}
