from app.data_loader import load_all_schemes


class EligibilityService:
    @staticmethod
    def _matches(value: str | None, allowed: list[str]) -> bool:
        normalized = {item.strip().lower() for item in allowed if item.strip()}
        return not normalized or bool({"any", "all"} & normalized) or (
            value is not None and value.strip().lower() in normalized
        )

    def check_eligibility(self, user_profile):
        eligible_schemes = []
        for scheme in load_all_schemes():
            eligibility = scheme.get("eligibility", {})
            min_age = eligibility.get("min_age", 0)
            max_age = eligibility.get("max_age", 150)
            if not min_age <= user_profile.age <= max_age:
                continue
            if user_profile.income > eligibility.get("max_family_income", float("inf")):
                continue
            if not self._matches(user_profile.gender, eligibility.get("gender", ["Any"])):
                continue
            if not self._matches(user_profile.category, eligibility.get("category", ["Any"])):
                continue
            if not self._matches(user_profile.citizenship, [eligibility.get("citizenship", "Any")]):
                continue
            if not self._matches(user_profile.occupation, eligibility.get("occupation", ["Any"])):
                continue
            if not self._matches(user_profile.education_level, eligibility.get("education_level", ["Any"])):
                continue
            if not self._matches(user_profile.class_or_course, eligibility.get("class_or_course", ["Any"])):
                continue
            if eligibility.get("disability_required", False) and not user_profile.has_disability:
                continue
            if eligibility.get("farmer_required", False) and not user_profile.is_farmer:
                continue

            scheme_state = scheme.get("state", "All India")
            if eligibility.get("state_specific", False) and scheme_state.lower() not in {
                "all india", user_profile.state.lower()
            }:
                continue

            required_documents = scheme.get("required_documents", [])
            supplied_documents = {document.strip().lower() for document in user_profile.available_documents}
            document_status = [
                {
                    "name": document,
                    "status": "Ready" if document.lower() in supplied_documents else "Missing",
                    # Kept explicit so a future OCR pipeline can report "ocr" here
                    # without changing the readiness response contract.
                    "source": "self_reported",
                }
                for document in required_documents
            ]
            missing_documents = [item["name"] for item in document_status if item["status"] == "Missing"]
            document_recommendation = (
                "All required documents are marked ready. Review each document before applying."
                if not missing_documents
                else f"Before applying, arrange: {', '.join(missing_documents)}."
            )
            checks = [
                ("Age Match", True), ("Income Match", True), ("Gender Match", True),
                ("Category Match", True), ("Citizenship Match", True), ("State Match", True),
                ("Profile Requirements", True),
            ]
            matched_count = sum(matched for _, matched in checks)
            confidence = round(matched_count / len(checks) * 100)
            application = scheme.get("application", {})
            eligible_schemes.append({
                "scheme_id": scheme.get("id", ""),
                "scheme_name": scheme.get("name", "Unnamed scheme"),
                "category": scheme.get("category", "Uncategorized"),
                "government_level": scheme.get("government_level", "Unknown"),
                "state": scheme_state,
                "summary": scheme.get("description", ""),
                "eligibility": eligibility,
                "required_documents": required_documents,
                "document_status": document_status,
                "document_readiness": {
                    "ready_count": len(document_status) - len(missing_documents),
                    "missing_count": len(missing_documents),
                    "recommendation": document_recommendation,
                },
                "benefit": scheme.get("benefit", {}),
                "application": application,
                "action_plan": [
                    "Review the official eligibility criteria.",
                    *[f"Provide {document}." for document in required_documents],
                    f"Apply via {application.get('portal', 'the official portal')}." if application else "Check the official source for application instructions.",
                ],
                "eligibility_score": confidence,
                "eligibility_confidence": confidence,
                "estimated_benefit": scheme.get("benefit", {}).get("amount", "Not specified"),
                "difficulty": scheme.get("ai_metadata", {}).get("difficulty", "Not specified"),
                "processing_time": scheme.get("ai_metadata", {}).get("estimated_processing_time", "Not specified"),
                "eligibility_breakdown": [
                    {"title": title, "score": round(100 / len(checks)), "matched": matched} for title, matched in checks
                ],
                "recommended_next_steps": [
                    "Review the eligibility criteria on the official portal.",
                    *[f"Keep your {document} ready." for document in required_documents],
                    f"Complete the application through {application.get('portal', 'the official portal')}." if application else "Use the official source to complete your application.",
                ],
                "ai_explanation": {
                    "summary": scheme.get("ai_explanation", {}).get(
                        "summary", "Your supplied profile matches the recorded criteria."
                    ),
                    "why_eligible": [
                        f"Your age ({user_profile.age}) is within the recorded range of {min_age}-{max_age}.",
                        "Your supplied income and profile details meet the criteria evaluated here.",
                    ],
                    "confidence": confidence,
                },
            })
        return {"success": True, "total_eligible": len(eligible_schemes), "eligible_schemes": eligible_schemes}
