import { ImageResponse } from "next/og";
export const alt = "TrialAtlas — A clearer view of clinical research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#fafbf7",
        color: "#172e38",
        padding: "80px",
        borderBottom: "20px solid #126d62",
      }}
    >
      <div style={{ fontSize: 28, color: "#126d62", marginBottom: 45 }}>
        TrialAtlas / Clinical Trial Finder
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 76,
          letterSpacing: -3,
          lineHeight: 1.1,
        }}
      >
        A clearer view of
        <br />
        clinical research.
      </div>
      <div style={{ fontSize: 24, color: "#596d72", marginTop: 40 }}>
        Discover studies. Explore locations. Compare possibilities.
      </div>
    </div>,
    size,
  );
}
