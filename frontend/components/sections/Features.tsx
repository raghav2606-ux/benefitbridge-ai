import {
  BrainCircuit,
  FileCheck2,
  Zap,
} from "lucide-react";

import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";

const features = [
  {
    icon: Zap,
    title: "Fast Eligibility",
    description:
      "Get a clear, criteria-based view of the schemes that match your profile.",
  },
  {
    icon: BrainCircuit,
    title: "AI Guidance",
    description:
      "Understand why a scheme matches, what it offers, and the right next step.",
  },
  {
    icon: FileCheck2,
    title: "Document Readiness",
    description:
      "See the documents you need before starting an official application.",
  },
];

export default function Features() {
  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
      <Container>
        <SectionTitle
          title="Everything You Need"
          subtitle="BenefitBridge AI simplifies discovering and understanding government welfare schemes."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title}>
                <div className="mb-5 inline-flex rounded-2xl bg-blue-100 p-4">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
