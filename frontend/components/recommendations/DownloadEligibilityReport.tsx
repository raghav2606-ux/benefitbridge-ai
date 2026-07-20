"use client";

import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import { downloadEligibilityReport } from "@/services/eligibilityReport";
import { EligibilityRequest, EligibleScheme } from "@/types/eligibility";

interface Props { profile: EligibilityRequest; schemes: EligibleScheme[]; }

export default function DownloadEligibilityReport({ profile, schemes }: Props) {
  return <Button variant="outline" onClick={() => downloadEligibilityReport(profile, schemes)}><Download className="h-4 w-4" /> Download PDF report</Button>;
}
