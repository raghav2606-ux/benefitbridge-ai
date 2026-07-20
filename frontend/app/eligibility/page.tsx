import Container from "@/components/ui/Container";
import EligibilityForm from "@/components/forms/EligibilityForm";

export default function EligibilityPage() {
  return (
    <Container className="py-12 sm:py-20">
      <div className="max-w-3xl">
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950/60 dark:text-blue-200">Eligibility checker</span>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        Find the schemes that match your profile.
      </h1>

      <p className="mt-4 text-slate-600 dark:text-slate-300">
        Fill in your details to discover the government schemes
        you may qualify for.
      </p></div>

      <EligibilityForm />
    </Container>
  );
}
