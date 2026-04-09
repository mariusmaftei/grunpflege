export function parseGoogleCredential(credential) {
  if (!credential || typeof credential !== "string") return null;
  try {
    const part = credential.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    const p = JSON.parse(json);
    if (!p?.email) return null;
    return {
      email: p.email,
      name: p.name || p.email,
      picture: p.picture || "",
      sub: p.sub || "",
    };
  } catch {
    return null;
  }
}
