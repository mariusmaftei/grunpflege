function normalizeApiBase(raw) {
  let s = (raw || "http://localhost:8080").trim().replace(/\/+$/, "");
  s = s.replace(/\/api$/i, "");
  return s;
}

const API_BASE = normalizeApiBase(process.env.REACT_APP_API_URL);

export function normalizeMongoId(raw) {
  if (raw == null || raw === "") return "";
  if (typeof raw === "string") return raw.trim();
  if (typeof raw === "object" && raw !== null) {
    if (typeof raw.$oid === "string") return raw.$oid;
    if (typeof raw.toHexString === "function") return raw.toHexString();
  }
  return String(raw).trim();
}

const TOKEN_KEY = "grunpflegeApiToken";

export function getApiToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setApiToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

export async function fetchMe() {
  const token = getApiToken();
  if (!token) return null;
  let res;
  try {
    res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  return data;
}

export async function exchangeGoogleCredential(credential) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
  } catch {
    const err = new Error(
      `Cannot reach API at ${API_BASE}. Start the Express server and MongoDB, set REACT_APP_API_URL in admin/.env if the API URL is wrong, and ensure server CORS_ORIGIN matches this app (e.g. http://localhost:3000).`,
    );
    err.statusCode = 0;
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Auth failed (${res.status})`);
    err.statusCode = res.status;
    throw err;
  }
  if (!data.token) {
    const err = new Error("Server responded without a JWT. Check server logs and MONGODB_URI.");
    err.statusCode = 502;
    throw err;
  }
  setApiToken(data.token);
  return data;
}

export async function fetchGalleryImages(category) {
  const token = getApiToken();
  if (!token) throw new Error("Not authenticated with API");
  const q = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${API_BASE}/api/uploads/gallery${q}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  if (Array.isArray(data.images)) {
    data.images = data.images.map((img) => {
      const id = normalizeMongoId(img.id ?? img._id);
      return id ? { ...img, id } : img;
    });
  }
  return data;
}

export async function uploadGalleryImageToApi(category, file, description, meta = {}) {
  const token = getApiToken();
  if (!token) throw new Error("Not authenticated with API");
  if (!description || !String(description).trim()) throw new Error("Missing description");
  const body = new FormData();
  body.append("image", file);
  body.append("description", String(description).trim());
  const title = meta.title != null ? String(meta.title).trim() : "";
  const alt = meta.alt != null ? String(meta.alt).trim() : "";
  if (title) body.append("title", title.slice(0, 200));
  if (alt) body.append("alt", alt.slice(0, 500));
  const fileBaseName = meta.fileBaseName != null ? String(meta.fileBaseName).trim().slice(0, 120) : "";
  if (fileBaseName) body.append("fileBaseName", fileBaseName);
  const storageUuid = meta.storageUuid != null ? String(meta.storageUuid).trim() : "";
  if (storageUuid) body.append("storageUuid", storageUuid);
  if (meta.isPublished !== undefined) {
    body.append("isPublished", meta.isPublished ? "true" : "false");
  }
  const res = await fetch(
    `${API_BASE}/api/uploads/gallery/${encodeURIComponent(category)}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
  return data;
}

export function galleryImagePublicUrl(urlPath) {
  if (!urlPath) return "";
  if (urlPath.startsWith("http")) return urlPath;
  return `${API_BASE}${urlPath}`;
}

export async function patchGalleryImage(id, body) {
  const token = getApiToken();
  if (!token) throw new Error("Not authenticated with API");
  const mongoId = normalizeMongoId(id);
  if (!mongoId) throw new Error("Missing image id");
  const res = await fetch(
    `${API_BASE}/api/uploads/gallery/${encodeURIComponent(mongoId)}/metadata`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const hint =
      res.status === 404 && !data.error
        ? " Check REACT_APP_API_URL (origin only, no …/api path) and restart the API server so POST /api/uploads/gallery/:id/metadata is available."
        : "";
    throw new Error((data.error || `Update failed (${res.status})`) + hint);
  }
  return data;
}

export async function deleteGalleryImageFromApi(id) {
  const token = getApiToken();
  if (!token) throw new Error("Not authenticated with API");
  const mongoId = normalizeMongoId(id);
  if (!mongoId) throw new Error("Missing image id");
  const res = await fetch(`${API_BASE}/api/uploads/gallery/${encodeURIComponent(mongoId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 204) return;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Delete failed (${res.status})`);
}

export async function replaceGalleryImageFile(id, file) {
  const token = getApiToken();
  if (!token) throw new Error("Not authenticated with API");
  const mongoId = normalizeMongoId(id);
  if (!mongoId) throw new Error("Missing image id");
  const body = new FormData();
  body.append("image", file);
  const res = await fetch(
    `${API_BASE}/api/uploads/gallery/${encodeURIComponent(mongoId)}/replace`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Replace failed (${res.status})`);
  return data;
}
