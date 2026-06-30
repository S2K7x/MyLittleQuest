import { getAllCertifications } from "@/lib/content";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  not_started: "À venir",
  in_progress: "En cours",
  needs_review: "En révision",
  complete: "Disponible",
};

const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-500",
  in_progress: "bg-blue-100 text-blue-700",
  needs_review: "bg-yellow-100 text-yellow-700",
  complete: "bg-green-100 text-green-700",
};

export default function Home() {
  const certifications = getAllCertifications();

  return (
    <main className="min-h-screen px-4 py-10 max-w-lg mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">MyLittleQuest</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Apprends des certifications informatiques en jouant.
        </p>
      </header>

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Certifications
        </h2>

        {certifications.length === 0 ? (
          <p className="text-sm text-gray-400">
            Aucune certification disponible pour l'instant.
          </p>
        ) : (
          <ul className="space-y-3">
            {certifications.map((cert) => (
              <li key={cert.slug}>
                <Link
                  href={`/certif/${cert.slug}`}
                  className="block bg-white rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {cert.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{cert.code}</p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                        STATUS_COLORS[cert.status] ?? STATUS_COLORS.not_started
                      }`}
                    >
                      {STATUS_LABELS[cert.status] ?? cert.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-3">
                    {cert.exam_domains.length} domaines
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
