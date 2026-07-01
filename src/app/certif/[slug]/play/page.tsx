import { getAllAssets, getCertification, getConcepts } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import SessionRunner from "@/components/session/SessionRunner";

interface Props {
  params: Promise<{ slug: string }>;
}

const SESSION_LENGTH = 10;

export default async function PlayPage({ params }: Props) {
  const { slug } = await params;
  const cert = getCertification(slug);
  if (!cert) notFound();

  const allAssets = getAllAssets(slug);
  if (allAssets.length === 0) notFound();

  const concepts = getConcepts(slug);
  const sessionAssets = allAssets.slice(0, SESSION_LENGTH);

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <Link
        href={`/certif/${slug}`}
        className="inline-flex items-center text-sm text-blue-600 mb-6 active:opacity-70"
      >
        ← Quitter
      </Link>

      <SessionRunner certSlug={slug} assets={sessionAssets} concepts={concepts} />
    </main>
  );
}
