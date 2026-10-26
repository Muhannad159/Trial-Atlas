"use client";
import dynamic from "next/dynamic";
import type { TrialSummary } from "@/types/trial";
const StudyMap = dynamic(() => import("./study-map"), {
  ssr: false,
  loading: () => <div className="skeleton h-80" />,
});
export function DetailMap({ trial }: { trial: TrialSummary }) {
  return <StudyMap trials={[trial]} />;
}
