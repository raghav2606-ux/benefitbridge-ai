from app.builders.json_writer import JSONWriter
from app.config import scheme_files


def load_all_schemes() -> list[dict]:
    writer = JSONWriter()
    schemes: list[dict] = []
    for filepath in scheme_files():
        schemes.extend(writer.load(filepath))
    return schemes
