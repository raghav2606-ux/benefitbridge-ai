import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Link from "next/link";

const schemes = [
  {
    title: "National Scholarship Portal",
    category: "Education",
    description:
      "Scholarships for school and college students across India.",
  },
  {
    title: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    description:
      "Financial support for eligible farmer families.",
  },
  {
    title: "Ayushman Bharat",
    category: "Healthcare",
    description:
      "Health insurance coverage for eligible families.",
  },
];

export default function FeaturedSchemes() {
  return (
    <section className="bg-white py-24 dark:bg-slate-950">
      <Container>
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Popular Government Schemes
          </h2>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Explore representative records, then verify the latest rules on each official portal.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {schemes.map((scheme) => (
            <Card key={scheme.title}>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {scheme.category}
              </span>

              <h3 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">
                {scheme.title}
              </h3>

              <p className="mt-4 text-slate-600 dark:text-slate-300">
                {scheme.description}
              </p>

              <div className="mt-6">
                <Link href="/schemes" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                  Learn More
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
