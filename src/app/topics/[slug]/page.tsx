import { notFound } from "next/navigation";
import { imagingHubs } from "@/config/hubs";
import { HubPage } from "@/features/search/hub-page";
import { metadata as makeMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return imagingHubs.map((h) => ({ slug: h.slug }));
}
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const hub = imagingHubs.find((h) => h.slug === slug);
  return hub
    ? makeMetadata(
        `${hub.title} clinical studies`,
        hub.description,
        `/topics/${slug}`,
      )
    : { title: "Topic not found" };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const hub = imagingHubs.find((h) => h.slug === slug);
  if (!hub) notFound();
  return <HubPage hub={hub} />;
}
