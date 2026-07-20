import {
  User,
  BrainCircuit,
  BadgeCheck,
  Send,
} from "lucide-react";

import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

const steps = [
  {
    icon: User,
    title: "Tell us about yourself",
    description:
      "Share the details that matter for the schemes you want to explore.",
  },
  {
    icon: BrainCircuit,
    title: "Criteria analysis",
    description:
      "BenefitBridge checks your profile against recorded scheme criteria.",
  },
  {
    icon: BadgeCheck,
    title: "Review recommendations",
    description:
      "Understand benefits, document readiness, and the reason each scheme matched.",
  },
  {
    icon: Send,
    title: "Apply officially",
    description:
      "Continue to the relevant official portal when you are ready to apply.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24 dark:bg-slate-950">
      <Container>
        <SectionTitle
          title="How It Works"
          subtitle="Four clear steps from profile details to the official application portal."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-10 w-10 text-blue-600" />
                </div>

                <div className="mb-3 text-sm font-bold text-blue-600">
                  STEP {index + 1}
                </div>

                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-4 text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
