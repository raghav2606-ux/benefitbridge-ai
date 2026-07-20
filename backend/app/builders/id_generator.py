import re


class IDGenerator:

    PREFIXES = {
        "Education": "EDU",
        "Agriculture": "AGR",
        "Healthcare": "HEA",
        "Women": "WOM",
        "Employment": "EMP",
        "Housing": "HOU",
        "Startup": "STA",
        "Senior Citizen": "SEN",
        "Disability": "DIS"
    }

    @classmethod
    def generate_id(cls, category, existing_ids):
        """
        Generate the next available scheme ID.
        """

        prefix = cls.PREFIXES.get(category)

        if not prefix:
            raise ValueError(f"Unknown category: {category}")

        numbers = []

        pattern = rf"{prefix}(\d{{3}})"

        for scheme_id in existing_ids:

            match = re.fullmatch(pattern, scheme_id)

            if match:
                numbers.append(int(match.group(1)))

        next_number = 1

        if numbers:
            next_number = max(numbers) + 1

        return f"{prefix}{next_number:03d}"
