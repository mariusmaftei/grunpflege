const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:8080").replace(/\/$/, "");

export function getApiBaseUrl() {
  return API_BASE;
}

export function resolveMediaUrl(urlPath) {
  if (!urlPath) return "";
  if (urlPath.startsWith("http")) return urlPath;
  return `${API_BASE}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
}

export async function fetchJson(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}
