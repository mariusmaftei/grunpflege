import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  exchangeGoogleCredential,
  fetchMe,
  getApiToken,
  setApiToken,
} from "../services/api.js";
import { parseGoogleCredential } from "../utils/parseGoogleCredential";

const AuthContext = createContext(null);
const STORAGE_KEY = "grunpflegeAdminGoogle";

function readGoogleClientId() {
  const raw = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  if (!raw) return "";
  return String(raw)
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
}

function allowedEmailsList() {
  const raw = process.env.REACT_APP_ALLOWED_ADMIN_EMAILS;
  if (!raw?.trim()) return null;
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isEmailAllowed(email) {
  if (!email) return false;
  const list = allowedEmailsList();
  if (!list?.length) return true;
  return list.includes(email.toLowerCase());
}

function consumeRedirectAuthHash() {
  if (typeof window === "undefined") return false;
  const raw = window.location.hash?.replace(/^#/, "");
  if (!raw) return false;
  const params = new URLSearchParams(raw);
  const token = params.get("gp_token");
  if (!token) return false;
  const path = window.location.pathname + window.location.search;
  window.history.replaceState(null, "", path);
  setApiToken(token);
  return true;
}

function AuthDisabledProvider({ children }) {
  const value = useMemo(
    () => ({
      user: null,
      loading: false,
      googleConfigured: false,
      registerGoogleSignIn: () => {},
      signOutUser: () => {},
    }),
    [],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }) {
  const clientId = readGoogleClientId();
  if (!clientId) {
    return <AuthDisabledProvider>{children}</AuthDisabledProvider>;
  }
  return <AuthGoogleInner>{children}</AuthGoogleInner>;
}

function AuthGoogleInner({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromRedirect = consumeRedirectAuthHash();
      const token = getApiToken();

      let raw = sessionStorage.getItem(STORAGE_KEY);
      let storedProfile = null;
      if (raw) {
        try {
          const p = JSON.parse(raw)?.profile;
          if (p?.email) storedProfile = p;
        } catch {
          sessionStorage.removeItem(STORAGE_KEY);
          raw = null;
        }
      }

      if (!token) {
        if (raw) sessionStorage.removeItem(STORAGE_KEY);
        if (!cancelled) setLoading(false);
        return;
      }

      if (fromRedirect || !storedProfile) {
        try {
          const data = await fetchMe();
          if (cancelled) return;
          if (!data?.user?.email) throw new Error("no user");
          const profile = {
            email: data.user.email,
            name: data.user.name || data.user.email,
            picture: data.user.picture || "",
          };
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ profile }));
          setUser(profile);
        } catch {
          if (!cancelled) {
            setApiToken(null);
            sessionStorage.removeItem(STORAGE_KEY);
          }
        }
        if (!cancelled) setLoading(false);
        return;
      }

      setUser(storedProfile);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const registerGoogleSignIn = useCallback(async (credentialResponse) => {
    const profile = parseGoogleCredential(credentialResponse?.credential);
    if (!profile) return;
    await exchangeGoogleCredential(credentialResponse.credential);
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ credential: credentialResponse.credential, profile }),
    );
    setUser(profile);
  }, []);

  const signOutUser = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setApiToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      googleConfigured: true,
      registerGoogleSignIn,
      signOutUser,
    }),
    [user, loading, registerGoogleSignIn, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
