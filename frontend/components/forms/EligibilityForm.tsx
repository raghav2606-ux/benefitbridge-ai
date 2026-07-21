"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle2, ClipboardCheck, ShieldCheck } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { checkEligibility } from "@/services/eligibility";
import { getApiErrorMessage } from "@/services/api";
import { saveEligibilityHistory } from "@/lib/eligibilityHistory";

import {
  EligibilityRequest,
  EligibleScheme,
} from "@/types/eligibility";

import RecommendationList from "../recommendations/RecommendationList";
import Skeleton from "@/components/ui/Skeleton";

export default function EligibilityForm() {
  const requiredText = (field: string) => ({ required: `${field} is required.`, validate: (value: string | undefined) => Boolean(value?.trim()) || `${field} is required.` });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EligibilityRequest>({
    defaultValues: {
      age: 20,
      gender: "",
      income: 0,
      state: "",
      category: "",
      citizenship: "Indian",
      occupation: "",
      education_level: "",
      class_or_course: "",
      has_disability: false,
      is_farmer: false,
      available_documents: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState<EligibleScheme[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [availableDocumentsText, setAvailableDocumentsText] = useState("");
  const [submittedProfile, setSubmittedProfile] = useState<EligibilityRequest | null>(null);
  const [lastProfile, setLastProfile] = useState<EligibilityRequest | null>(null);

  const presets: Array<{ label: string; profile: EligibilityRequest }> = [
    { label: "Student demo", profile: { age: 20, gender: "Any", income: 0, state: "Himachal Pradesh", category: "General", citizenship: "Indian", occupation: "Student", education_level: "Undergraduate", class_or_course: "B.Tech", has_disability: false, is_farmer: false, available_documents: [] } },
    { label: "Farmer demo", profile: { age: 38, gender: "Any", income: 120000, state: "Punjab", category: "General", citizenship: "Indian", occupation: "Farmer", education_level: "Any", class_or_course: "Any", has_disability: false, is_farmer: true, available_documents: [] } },
    { label: "Senior demo", profile: { age: 72, gender: "Any", income: 180000, state: "Maharashtra", category: "General", citizenship: "Indian", occupation: "Any", education_level: "Any", class_or_course: "Any", has_disability: false, is_farmer: false, available_documents: [] } },
  ];

  function applyPreset(profile: EligibilityRequest) {
    reset(profile);
    setAvailableDocumentsText("Aadhaar Card, Bank Account Details");
    toast.success("Demo profile loaded. You can edit any detail before checking.");
  }

  async function runEligibilityCheck(profile: EligibilityRequest) {
    try {
      setLoading(true);
      setRequestError(null);
      setLastProfile(profile);
      const response = await checkEligibility(profile);

      setSchemes(response.eligible_schemes);
      setSubmittedProfile(profile);
      setSubmitted(true);
      if (!saveEligibilityHistory(profile, response.eligible_schemes)) toast.error("Your results are ready, but could not be saved in this browser.");
      toast.success(response.eligible_schemes.length ? `${response.eligible_schemes.length} eligibility match${response.eligible_schemes.length === 1 ? "" : "es"} found.` : "Eligibility check complete. No matches found.");
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Something went wrong while checking eligibility.");
      setRequestError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: EligibilityRequest) {
    await runEligibilityCheck({
      ...data,
      gender: data.gender.trim(),
      state: data.state.trim(),
      category: data.category.trim(),
      citizenship: data.citizenship?.trim(),
      occupation: data.occupation?.trim(),
      education_level: data.education_level?.trim(),
      class_or_course: data.class_or_course?.trim(),
      available_documents: availableDocumentsText.split(",").map((document) => document.trim()).filter(Boolean),
    });
  }

  return (
    <>
      <form noValidate aria-busy={loading} onSubmit={handleSubmit(onSubmit)} className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25 sm:p-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"><ClipboardCheck className="h-3.5 w-3.5" /> Profile check</div><h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Tell us about yourself</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">We only use these details to evaluate the listed criteria.</p></div><div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Clear, criteria-based results</div></div>
        <div className="mb-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70"><p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Try a demo profile</p><div className="mt-3 flex flex-wrap gap-2">{presets.map((preset) => <button key={preset.label} type="button" onClick={() => applyPreset(preset.profile)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-300">{preset.label}</button>)}</div></div>
        <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Age"
          type="number"
          min="0"
          max="150"
          placeholder="20"
          {...register("age", {
            required: true,
            valueAsNumber: true,
            min: { value: 0, message: "Age cannot be negative." },
            max: { value: 150, message: "Enter a valid age." },
          })}
          error={errors.age?.message}
        />

        <Input
          label="Gender"
          placeholder="Male"
          {...register("gender", requiredText("Gender"))}
          error={errors.gender?.message}
        />

        <Input
          label="Annual Income"
          type="number"
          min="0"
          placeholder="100000"
          {...register("income", {
            required: "Annual income is required.",
            valueAsNumber: true,
            min: { value: 0, message: "Income cannot be negative." },
          })}
          error={errors.income?.message}
        />

        <Input
          label="State"
          placeholder="Himachal Pradesh"
          {...register("state", requiredText("State"))}
          error={errors.state?.message}
        />

        <Input
          label="Category"
          placeholder="General"
          {...register("category", requiredText("Category"))}
          error={errors.category?.message}
        />

        <Input
          label="Occupation"
          placeholder="Student"
          {...register("occupation")}
        />

        <Input
          label="Education Level"
          placeholder="Undergraduate"
          {...register("education_level")}
        />

        <Input
          label="Class or Course"
          placeholder="B.Tech"
          {...register("class_or_course")}
        />

        <Input
          label="Citizenship"
          placeholder="Indian"
          {...register("citizenship", requiredText("Citizenship"))}
          error={errors.citizenship?.message}
        />

        <div className="md:col-span-2">
          <Input
            label="Documents you already have"
            placeholder="Aadhaar Card, Income Certificate"
            value={availableDocumentsText}
            onChange={(event) => setAvailableDocumentsText(event.target.value)}
          />
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Separate document names with commas. This is self-reported today; future OCR verification can be added without changing your results.</p>
        </div>

        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-slate-800">
          <input className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900" type="checkbox" {...register("has_disability")} />
          I have a disability
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-slate-800">
          <input className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900" type="checkbox" {...register("is_farmer")} />
          I am a farmer
        </label>

        <div className="md:col-span-2">
          <Button type="submit" fullWidth isLoading={loading}>
            Check eligibility
          </Button>
        </div>
        </div>
      </form>

      {requestError && <div role="alert" aria-live="assertive" className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" /><div><p className="font-bold">We couldn’t check eligibility</p><p className="mt-1 text-sm leading-6">{requestError}</p></div></div>}

      {loading && <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading eligibility results"><div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-700">Analyzing your profile against the available scheme criteria…</div>{Array.from({ length: 3 }, (_, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><Skeleton className="h-6 w-24" /><Skeleton className="mt-6 h-7 w-4/5" /><Skeleton className="mt-4 h-4 w-full" /><Skeleton className="mt-2 h-4 w-3/4" /><Skeleton className="mt-7 h-11 w-full" /></div>)}</div>}

      {requestError && lastProfile && <div className="mt-3"><Button type="button" variant="outline" onClick={() => void runEligibilityCheck(lastProfile)} isLoading={loading}>Retry eligibility check</Button></div>}

      {submitted && schemes.length > 0 && <div role="status" className="mt-7 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><p className="font-bold">Your results are ready</p><p className="mt-1 text-sm leading-6">We found {schemes.length} matching scheme{schemes.length === 1 ? "" : "s"} based on the profile details you supplied.</p></div></div>}

      {submitted && (
        <RecommendationList schemes={schemes} profile={submittedProfile} />
      )}
    </>
  );
}
