export function readLocalStorage<T>(key: string, parse: (value: unknown) => T | null): T | null {
  if (typeof window === "undefined") return null;

  try {
    return parse(JSON.parse(window.localStorage.getItem(key) ?? "null"));
  } catch {
    return null;
  }
}

export function writeLocalStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeLocalStorage(key: string) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
