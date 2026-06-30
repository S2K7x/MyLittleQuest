import { getCertification } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CertifPage({ params }: Props) {
  const { slug } = await params;
  const cert = getCertification(slug);
  if (!cert) notFound();

  return (
    <main className="min-h-screen px-4 py-10 max-w-lg mx-auto">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-blue-600 mb-8 active:opacity-70"
      >
        ← Retour
      </Link>

      <header className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">{cert.name}</h1>
        <p className="text-xs text-gray-400 mt-1">{cert.code}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Domaines d'examen
        </h2>
        <ul className="space-y-2">
          {cert.exam_domains.map((domain) => (
            <li
              key={domain.id}
              className="bg-white rounded-xl px-4 py-3 flex justify-between items-center text-sm shadow-sm"
            >
              <span className="text-gray-800">{domain.name}</span>
              <span className="text-gray-400 shrink-0 ml-4">
                {Math.round(domain.weight * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-gray-300">
        Contenu en cours de génération…
      </p>
    </main>
  );
}
