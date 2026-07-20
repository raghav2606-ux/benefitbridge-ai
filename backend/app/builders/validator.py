from app.models.scheme_model import Scheme


class SchemeValidator:

    @staticmethod
    def validate_scheme(scheme: Scheme):
        """
        Validate business rules for a scheme.
        Returns a list of errors.
        """

        errors = []

        # Age validation
        if scheme.eligibility.min_age > scheme.eligibility.max_age:
            errors.append("Minimum age cannot be greater than maximum age.")

        # Income validation
        if scheme.eligibility.max_family_income < 0:
            errors.append("Family income cannot be negative.")

        # Scheme name
        if len(scheme.name.strip()) == 0:
            errors.append("Scheme name cannot be empty.")

        # Official URL
        if len(scheme.application.official_url.strip()) == 0:
            errors.append("Official URL is required.")

        return errors