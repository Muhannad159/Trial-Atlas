import { notFound } from "next/navigation";
import { conditionHubs } from "@/config/hubs";
import { HubPage } from "@/features/search/hub-page";
import { metadata as makeMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return conditionHubs.map((h) => ({ slug: h.slug }));
}
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const hub = conditionHubs.find((h) => h.slug === slug);
  return hub
    ? makeMetadata(
        `${hub.title} clinical trials`,
        hub.description,
        `/conditions/${slug}`,
      )
    : { title: "Topic not found" };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const hub = conditionHubs.find((h) => h.slug === slug);
  if (!hub) notFound();
  return <HubPage hub={hub} />;
}
