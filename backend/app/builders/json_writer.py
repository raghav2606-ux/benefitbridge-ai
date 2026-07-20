import json
import os
import tempfile
from pathlib import Path
from threading import RLock


class JSONWriter:
    _lock = RLock()
    def load(self, filepath):
        """
        Load JSON file.
        Returns an empty list if the file is empty.
        """

        filepath = Path(filepath)
        if not filepath.exists():
            return []

        with filepath.open("r", encoding="utf-8") as file:
            content = file.read().strip()

            if content == "":
                return []

            parsed = json.loads(content)
            if not isinstance(parsed, list):
                raise ValueError("Scheme data must be a JSON array")
            return parsed

    def save(self, filepath, data):
        """
        Save data into JSON file.
        """

        filepath = Path(filepath)
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with self._lock:
            descriptor, temporary_path = tempfile.mkstemp(dir=filepath.parent, prefix=f".{filepath.stem}-", suffix=".tmp")
            try:
                with os.fdopen(descriptor, "w", encoding="utf-8") as file:
                    json.dump(data, file, indent=4, ensure_ascii=False)
                    file.flush()
                    os.fsync(file.fileno())
                os.replace(temporary_path, filepath)
            except Exception:
                if os.path.exists(temporary_path):
                    os.unlink(temporary_path)
                raise

    def append(self, filepath, scheme):
        """
        Append one scheme.
        """

        data = self.load(filepath)

        data.append(scheme)

        self.save(filepath, data)
