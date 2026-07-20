from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
SCHEMES_DIR = DATA_DIR / "schemes"


def resolve_scheme_file(filepath: str | None = None) -> Path:
    """Resolve legacy paths only when they remain in the application data directory."""
    candidate = Path(filepath or "data/education.json")
    if not candidate.is_absolute():
        candidate = BASE_DIR / candidate.relative_to("data") if candidate.parts[:1] == ("data",) else DATA_DIR / candidate
    resolved = candidate.resolve()
    data_root = DATA_DIR.resolve()
    if resolved.suffix.lower() != ".json" or data_root not in resolved.parents:
        raise ValueError("filepath must reference a JSON file inside the application data directory")
    return resolved


def scheme_files() -> list[Path]:
    return [DATA_DIR / "education.json", *sorted(SCHEMES_DIR.glob("*.json"))]
