import { useEffect, useRef } from "react";
import styles from "./GoogleRedirectLogin.module.css";

const API_BASE = (
  process.env.REACT_APP_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

const rawLoginPath = (
  process.env.REACT_APP_GOOGLE_LOGIN_PATH || "/auth/google/callback"
).trim();
const GOOGLE_LOGIN_PATH = rawLoginPath.startsWith("/")
  ? rawLoginPath
  : `/${rawLoginPath}`;

function encodeState(origin) {
  const json = JSON.stringify({ o: origin.replace(/\/$/, "") });
  return btoa(json)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default function GoogleRedirectLogin({
  clientId,
  disabled,
  text = "signin_with",
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!clientId || disabled) return undefined;

    const initGsi = () => {
      if (!window.google?.accounts?.id || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        ux_mode: "redirect",
        login_uri: `${API_BASE}${GOOGLE_LOGIN_PATH}`,
        state: encodeState(window.location.origin),
      });
      ref.current.innerHTML = "";
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        text,
        shape: "rectangular",
        width: 320,
      });
    };

    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      if (window.google?.accounts?.id) initGsi();
      else existing.addEventListener("load", initGsi);
      return undefined;
    }

    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = initGsi;
    document.head.appendChild(s);
    return undefined;
  }, [clientId, disabled, text]);

  return <div ref={ref} className={styles.slot} />;
}
