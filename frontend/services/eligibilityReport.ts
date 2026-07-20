import { jsPDF } from "jspdf";
import { EligibilityRequest, EligibleScheme } from "@/types/eligibility";

const PAGE_WIDTH = 210;
const MARGIN = 16;

function formatProfile(profile: EligibilityRequest) {
  return [
    ["Age", `${profile.age} years`], ["Gender", profile.gender], ["Annual income", `INR ${profile.income.toLocaleString("en-IN")}`],
    ["State", profile.state], ["Category", profile.category], ["Citizenship", profile.citizenship || "Not provided"],
    ["Occupation", profile.occupation || "Not provided"], ["Education", profile.education_level || "Not provided"],
    ["Course", profile.class_or_course || "Not provided"], ["Disability", profile.has_disability ? "Yes" : "No"], ["Farmer", profile.is_farmer ? "Yes" : "No"],
  ];
}

export function downloadEligibilityReport(profile: EligibilityRequest, schemes: EligibleScheme[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;
  const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date());

  const header = () => {
    doc.setFillColor(15, 23, 42); doc.rect(0, 0, PAGE_WIDTH, 38, "F");
    doc.setFillColor(37, 99, 235); doc.circle(181, 9, 25, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(19); doc.text("BenefitBridge AI", MARGIN, 17);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(191, 219, 254); doc.text("PERSONALIZED ELIGIBILITY REPORT", MARGIN, 25);
    doc.setTextColor(71, 85, 105); doc.setFontSize(8); doc.text(`Generated ${date}`, MARGIN, 45);
    y = 52;
  };
  const footer = (page: number) => {
    doc.setDrawColor(226, 232, 240); doc.line(MARGIN, 283, PAGE_WIDTH - MARGIN, 283);
    doc.setTextColor(100, 116, 139); doc.setFontSize(8); doc.text("BenefitBridge AI - Use official portals to verify final eligibility.", MARGIN, 289);
    doc.text(`Page ${page}`, PAGE_WIDTH - MARGIN, 289, { align: "right" });
  };
  const nextPage = () => { footer(doc.getNumberOfPages()); doc.addPage(); header(); };
  const ensure = (height: number) => { if (y + height > 275) nextPage(); };
  const title = (label: string) => { ensure(13); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.text(label, MARGIN, y); y += 7; doc.setDrawColor(191, 219, 254); doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y); y += 7; };
  const paragraph = (text: string, color: [number, number, number] = [71, 85, 105]) => { doc.setTextColor(...color); doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); const lines = doc.splitTextToSize(text, PAGE_WIDTH - 2 * MARGIN); ensure(lines.length * 4.7 + 4); doc.text(lines, MARGIN, y); y += lines.length * 4.7 + 4; };
  const pill = (text: string, x: number, width: number, color: [number, number, number]) => { doc.setFillColor(...color); doc.roundedRect(x, y - 4.5, width, 7, 2, 2, "F"); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.text(text, x + width / 2, y, { align: "center" }); };

  header();
  doc.setFillColor(239, 246, 255); doc.roundedRect(MARGIN, y, PAGE_WIDTH - 2 * MARGIN, 20, 3, 3, "F");
  doc.setTextColor(30, 64, 175); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(`${schemes.length} recommended scheme${schemes.length === 1 ? "" : "s"}`, MARGIN + 6, y + 8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(71, 85, 105); doc.text("Matched from the profile and recorded scheme criteria.", MARGIN + 6, y + 14); y += 29;

  title("Profile summary");
  const profileRows = formatProfile(profile);
  profileRows.forEach(([label, value], index) => {
    ensure(8); const x = index % 2 === 0 ? MARGIN : 108; if (index % 2 === 0) { doc.setFillColor(248, 250, 252); doc.roundedRect(MARGIN, y - 4, PAGE_WIDTH - 2 * MARGIN, 8, 1.5, 1.5, "F"); }
    doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.text(label.toUpperCase(), x + 3, y);
    doc.setTextColor(30, 41, 59); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.text(value, x + 34, y);
    if (index % 2 === 1 || index === profileRows.length - 1) y += 9;
  });
  y += 4;

  title("Recommended schemes");
  schemes.forEach((scheme, schemeIndex) => {
    ensure(48); doc.setFillColor(255, 255, 255); doc.setDrawColor(219, 234, 254); doc.roundedRect(MARGIN, y, PAGE_WIDTH - 2 * MARGIN, 15, 3, 3, "FD");
    doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(`${schemeIndex + 1}. ${scheme.scheme_name}`, MARGIN + 5, y + 7);
    pill(`${scheme.eligibility_score}/100 ELIGIBILITY`, 145, 44, [37, 99, 235]); y += 21;
    paragraph(scheme.ai_explanation.summary);
    doc.setFillColor(248, 250, 252); doc.roundedRect(MARGIN, y, PAGE_WIDTH - 2 * MARGIN, 17, 2, 2, "F");
    [["Benefit estimate", scheme.estimated_benefit], ["Processing time", scheme.processing_time], ["Difficulty", scheme.difficulty]].forEach(([label, value], index) => { const x = MARGIN + 5 + index * 58; doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.text(label.toUpperCase(), x, y + 6); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.text(value, x, y + 12); }); y += 23;
    doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.text("Why eligible", MARGIN, y); y += 5;
    scheme.ai_explanation.why_eligible.forEach((reason) => { ensure(9); doc.setFillColor(22, 163, 74); doc.circle(MARGIN + 2, y - 1.2, 1.4, "F"); paragraph(reason, [51, 65, 85]); });
    doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.text("Document readiness", MARGIN, y); y += 6;
    scheme.document_status.forEach((document) => { ensure(7); const ready = document.status === "Ready"; doc.setTextColor(51, 65, 85); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.text(document.name, MARGIN + 3, y); pill(ready ? "READY" : "MISSING", 164, 25, ready ? [22, 163, 74] : [217, 119, 6]); y += 6; });
    paragraph(`AI recommendation: ${scheme.document_readiness?.recommendation ?? "Review each required document before applying."}`, [8, 145, 178]);
    doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.text("Application details", MARGIN, y); y += 5;
    paragraph(`Portal: ${scheme.application.portal}\nDeadline: ${scheme.application.deadline}\nOfficial link: ${scheme.application.official_url}`);
    const nextSteps = scheme.recommended_next_steps ?? scheme.action_plan;
    doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.text("Recommended next steps", MARGIN, y); y += 5;
    nextSteps.forEach((step, index) => paragraph(`${index + 1}. ${step}`));
    y += 5;
  });
  footer(doc.getNumberOfPages());
  doc.save(`benefitbridge-eligibility-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
