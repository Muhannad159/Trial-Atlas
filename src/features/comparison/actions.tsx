"use client";
import { useState } from "react";
import { Download, Link as LinkIcon } from "lucide-react";
export function ComparisonActions({ ids }: { ids: string[] }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function download(format: "pdf" | "csv") {
    setBusy(true);
    setMessage(`Preparing ${format.toUpperCase()}…`);
    try {
      const response = await fetch(
        `/api/export/${format}?ids=${ids.join(",")}`,
        { signal: AbortSignal.timeout(35000) },
      );
      if (!response.ok) throw new Error();
      const url = URL.createObjectURL(await response.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `trialatlas-comparison.${format}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Your download is ready.");
    } catch {
      setMessage("The export could not be generated. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/compare?ids=${ids.join(",")}`,
      );
      setMessage(
        "Comparison link copied. Bookmark this page to keep your selection.",
      );
    } catch {
      setMessage(
        "Copy the current address from your browser to share this comparison.",
      );
    }
  }
  return (
    <div className="mb-7">
      <div className="flex flex-wrap gap-3">
        <button
          className="button button-primary"
          disabled={busy}
          onClick={() => download("pdf")}
        >
          <Download size={15} />
          Download PDF
        </button>
        <button
          className="button"
          disabled={busy}
          onClick={() => download("csv")}
        >
          <Download size={15} />
          Export CSV
        </button>
        <button className="button" onClick={share}>
          <LinkIcon size={15} />
          Copy share link
        </button>
      </div>
      <p role="status" className="text-xs text-muted mt-3 min-h-4">
        {message ||
          "The link preserves study IDs. Reopening it retrieves the latest available records."}
      </p>
    </div>
  );
}
