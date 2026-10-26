"use client";
import { useEffect, useRef, useState } from "react";
import type { TrialSummary } from "@/types/trial";
import type { FeatureCollection, Point } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";

export default function StudyMap({ trials }: { trials: TrialSummary[] }) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const coordinates = trials.flatMap((t) =>
    t.locations
      .filter(
        (l) =>
          Number.isFinite(l.lat) &&
          Number.isFinite(l.lng) &&
          Math.abs(l.lat!) <= 90 &&
          Math.abs(l.lng!) <= 180,
      )
      .map((l) => ({ ...l, id: t.id, title: t.title })),
  );
  const features: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: coordinates.map((l) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [l.lng!, l.lat!] },
      properties: {
        id: l.id,
        title: l.title,
        facility: l.facility,
        place: [l.city, l.country].filter(Boolean).join(", "),
        status: l.status || "Site status not provided",
      },
    })),
  };
  const dataKey = JSON.stringify(features);
  useEffect(() => {
    if (!container.current) return;
    let disposed = false;
    let map: import("maplibre-gl").Map | undefined;
    const observer = new ResizeObserver(() => map?.resize());
    observer.observe(container.current);
    import("maplibre-gl")
      .then(({ Map, NavigationControl, Popup, LngLatBounds, setWorkerUrl }) => {
        if (disposed || !container.current) return;
        // MapLibre 6 shapes Arabic and handles bidi internally; serve its matching worker.
        setWorkerUrl(
          new URL(
            "maplibre-gl/dist/maplibre-gl-worker.mjs",
            import.meta.url,
          ).toString(),
        );
        const data = JSON.parse(dataKey) as FeatureCollection<Point>;
        try {
          map = new Map({
            container: container.current,
            style: "https://tiles.openfreemap.org/styles/positron",
            center: [12, 25],
            zoom: 1.1,
            attributionControl: { compact: false },
          });
          map.addControl(
            new NavigationControl({ showCompass: false }),
            "top-right",
          );
          map.on("error", () => setFailed(true));
          map.on("load", () => {
            if (!map || disposed) return;
            map.addSource("sites", {
              type: "geojson",
              data,
              cluster: true,
              clusterMaxZoom: 13,
              clusterRadius: 45,
            });
            map.addLayer({
              id: "clusters",
              type: "circle",
              source: "sites",
              filter: ["has", "point_count"],
              paint: {
                "circle-color": "#126d62",
                "circle-radius": [
                  "step",
                  ["get", "point_count"],
                  19,
                  10,
                  24,
                  50,
                  30,
                ],
                "circle-stroke-width": 5,
                "circle-stroke-color": "#126d6225",
              },
            });
            map.addLayer({
              id: "cluster-count",
              type: "symbol",
              source: "sites",
              filter: ["has", "point_count"],
              layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["Noto Sans Regular"],
                "text-size": 12,
              },
              paint: { "text-color": "#ffffff" },
            });
            map.addLayer({
              id: "site",
              type: "circle",
              source: "sites",
              filter: ["!", ["has", "point_count"]],
              paint: {
                "circle-color": "#126d62",
                "circle-radius": 7,
                "circle-stroke-width": 3,
                "circle-stroke-color": "#ffffff",
              },
            });
            if (data.features.length) {
              const bounds = new LngLatBounds();
              for (const f of data.features)
                bounds.extend(f.geometry.coordinates as [number, number]);
              map.fitBounds(bounds, { padding: 70, maxZoom: 8, duration: 0 });
            }
            map.on("click", "site", (e) => {
              const feature = e.features?.[0];
              if (!feature || !map || feature.geometry.type !== "Point") return;
              const content = document.createElement("div");
              const title = document.createElement("strong");
              title.textContent = feature.properties.facility;
              const place = document.createElement("p");
              place.textContent = feature.properties.place;
              const status = document.createElement("p");
              status.textContent = String(feature.properties.status)
                .replaceAll("_", " ")
                .toLowerCase();
              const link = document.createElement("a");
              link.href = `/trials/${feature.properties.id}`;
              link.textContent = "Open study";
              content.append(title, place, status, link);
              new Popup()
                .setLngLat(feature.geometry.coordinates as [number, number])
                .setDOMContent(content)
                .addTo(map);
            });
            map.on("click", "clusters", async (e) => {
              const f = e.features?.[0];
              if (!f || !map || f.geometry.type !== "Point") return;
              const source = map.getSource(
                "sites",
              ) as import("maplibre-gl").GeoJSONSource;
              const zoom = await source.getClusterExpansionZoom(
                Number(f.properties.cluster_id),
              );
              if (!disposed)
                map.easeTo({
                  center: f.geometry.coordinates as [number, number],
                  zoom,
                  duration: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? 0
                    : 500,
                });
            });
            for (const layer of ["clusters", "site"]) {
              map.on("mouseenter", layer, () => {
                if (map) map.getCanvas().style.cursor = "pointer";
              });
              map.on("mouseleave", layer, () => {
                if (map) map.getCanvas().style.cursor = "";
              });
            }
          });
        } catch {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));
    return () => {
      disposed = true;
      observer.disconnect();
      map?.remove();
    };
  }, [dataKey]);
  return (
    <div className="map-frame">
      <div
        className="h-full"
        ref={container}
        aria-label="Map of study sites"
        role="region"
      />
      <div className="map-caption">
        {failed
          ? "Map unavailable. Use the accessible site list below."
          : coordinates.length
            ? `${coordinates.length} mapped sites · current results page only`
            : "No coordinates available for these studies."}
      </div>
    </div>
  );
}
