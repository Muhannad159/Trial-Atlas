import Link from "next/link";
import { notFound } from "next/navigation";
import { editorial } from "@/config/editorial";
import { metadata as makeMetadata } from "@/lib/seo";
import { Breadcrumbs, Eyebrow } from "@/components/ui/primitives";
type Props = { params: Promise<{ page: string }> };
function article(key: string) {
  return Object.hasOwn(editorial, key)
    ? editorial[key as keyof typeof editorial]
    : undefined;
}
export function generateStaticParams() {
  return Object.keys(editorial).map((page) => ({ page }));
}
export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  const data = article(page);
  return data
    ? makeMetadata(data.title, data.description, `/${page}`)
    : { title: "Page not found" };
}
export default async function EditorialPage({ params }: Props) {
  const { page } = await params;
  const data = article(page);
  if (!data) notFound();
  return (
    <div className="container pb-10">
      <Breadcrumbs items={[{ label: data.title }]} />
      <article className="max-w-3xl mx-auto">
        <header className="page-heading">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h1>{data.title}</h1>
          <p>{data.description}</p>
        </header>
        {data.sections.map(([title, body]) => (
          <section key={title} className="detail-section">
            <h2>{title}</h2>
            <p className="prose">{body}</p>
          </section>
        ))}
        <section className="detail-section">
          <h2>Read the original guidance</h2>
          <div className="flex flex-col gap-3">
            <a
              className="text-link"
              href="https://clinicaltrials.gov/find-studies/for-patients/common-questions"
              target="_blank"
              rel="noreferrer"
            >
              ClinicalTrials.gov: common questions
            </a>
            <a
              className="text-link"
              href="https://www.ncbi.nlm.nih.gov/home/about/policies/"
              target="_blank"
              rel="noreferrer"
            >
              NCBI policies and disclaimers
            </a>
            <a
              className="text-link"
              href="https://clinicaltrials.gov/about-site/terms-conditions"
              target="_blank"
              rel="noreferrer"
            >
              ClinicalTrials.gov terms and conditions
            </a>
            <a
              className="text-link"
              href="https://www.nlm.nih.gov/databases/download.html"
              target="_blank"
              rel="noreferrer"
            >
              NLM data reuse conditions
            </a>
            <Link href="/methodology" className="text-link">
              Sources & methodology
            </Link>
            <Link href="/search" className="button button-primary mt-4 w-fit">
              Explore studies
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
