import Container from "@/components/ui/Container";

const stats = [
  {
    value: "20",
    label: "Recorded Schemes",
  },
  {
    value: "9",
    label: "Categories Covered",
  },
  {
    value: "100%",
    label: "Criteria Transparency",
  },
  {
    value: "0",
    label: "Applications Submitted",
  },
];

export default function Statistics() {
  return (
    <section className="bg-slate-900 py-24">
      <Container>
        <div className="grid gap-10 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <h2 className="text-5xl font-bold text-white">
                {stat.value}
              </h2>

              <p className="mt-4 text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
