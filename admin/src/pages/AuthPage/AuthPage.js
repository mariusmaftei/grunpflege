import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import GoogleRedirectLogin from "../../components/GoogleRedirectLogin/GoogleRedirectLogin";
import { useAuth, isEmailAllowed } from "../../context/AuthContext";
import logoGrunpflege from "../../assets/images/grunpflege-logo.png";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const { user, loading, googleConfigured } = useAuth();
  const [error, setError] = useState("");
  const location = useLocation();
  const from = location.state?.from || "/admin";
  const isRegister = location.pathname === "/register";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("auth_err");
    if (!err) return;
    const map = {
      csrf: "Sign-in security check failed. Try again.",
      missing_credential: "Google did not return a sign-in token. Try again.",
      verification_failed: "Could not verify Google sign-in.",
    };
    setError(map[err] || "Sign-in failed. Try again.");
    params.delete("auth_err");
    const next =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "");
    window.history.replaceState(null, "", next);
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <aside className={styles.hero} aria-hidden="true" />
        <div className={styles.panel}>
          <div className={styles.card}>
            <div className={styles.spinner} aria-hidden />
            <p className={styles.muted}>Checking your session…</p>
          </div>
        </div>
      </div>
    );
  }

  if (user && isEmailAllowed(user.email)) {
    return <Navigate to={from} replace />;
  }

  if (user && !isEmailAllowed(user.email)) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ email: user.email, reason: "session", from }}
      />
    );
  }

  return (
    <div className={styles.page}>
      <aside className={styles.hero} aria-label="Grünpflege admin">
        <div className={styles.heroGlow} aria-hidden />
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Admin console</span>
          <div className={styles.heroBrand}>
            <img
              src={logoGrunpflege}
              alt=""
              className={styles.heroLogo}
              width={140}
              height={140}
              decoding="async"
              aria-hidden
            />
            <div className={styles.heroBrandText}>
              <span className={styles.heroWordmark}>Grünpflege</span>
              <span className={styles.heroTagline}>
                Garden care · Back office
              </span>
            </div>
          </div>
          <h2 className={styles.heroTitle}>
            Manage your gallery with confidence
          </h2>
          <p className={styles.heroLead}>
            One secure Google sign-in for your team. Upload images, sync with
            your API, and keep the public site up to date.
          </p>
          <ul className={styles.heroList}>
            <li>Enterprise-grade Google identity</li>
            <li>One flow for new and returning admins</li>
            <li>API-backed sessions for uploads</li>
          </ul>
        </div>
      </aside>

      <div className={styles.panel}>
        <div className={styles.panelGlow} aria-hidden />
        <div className={styles.panelContent}>
          <p className={styles.panelGreenTitle} aria-hidden>
            {isRegister ? "Register" : "Login"}
          </p>
          <p className={styles.panelGreenHint} aria-hidden>
            Google · secure access
          </p>
          <div className={styles.card}>
            <div className={styles.cardAccent} aria-hidden />
            <p className={styles.kicker}>
              {isRegister ? "New account" : "Welcome back"}
            </p>
            <h1 className={styles.title}>
              {isRegister ? "Create your access" : "Sign in to continue"}
            </h1>
            <p className={styles.subtitle}>
              {isRegister
                ? "Use Google once — your profile is created on the server the first time you continue."
                : "Use the Google account linked to this admin workspace."}
            </p>

            {!googleConfigured && (
              <div className={styles.warn}>
                <strong className={styles.warnTitle}>
                  Google Client ID missing
                </strong>
                <ol className={styles.warnList}>
                  <li>
                    Put your Web client ID in{" "}
                    <code className={styles.code}>admin/.env</code> as{" "}
                    <code className={styles.code}>
                      REACT_APP_GOOGLE_CLIENT_ID=…apps.googleusercontent.com
                    </code>{" "}
                    (no quotes).
                  </li>
                  <li>
                    Run <code className={styles.code}>npm start</code> from the{" "}
                    <code className={styles.code}>admin</code> folder (Create
                    React App only loads{" "}
                    <code className={styles.code}>admin/.env</code>).
                  </li>
                  <li>
                    In{" "}
                    <a
                      className={styles.warnLink}
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Cloud → Credentials
                    </a>
                    , open your OAuth 2.0 Client ID → add this exact{" "}
                    <strong>Authorized JavaScript origin</strong>:{" "}
                    <code className={styles.code}>
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : "http://localhost:3000"}
                    </code>
                    , and this <strong>Authorized redirect URI</strong>:{" "}
                    <code className={styles.code}>
                      {`${(process.env.REACT_APP_API_URL || "http://localhost:8080").replace(
                        /\/$/,
                        "",
                      )}${process.env.REACT_APP_GOOGLE_LOGIN_PATH || "/auth/google/callback"}`}
                    </code>
                  </li>
                  <li>
                    Stop and start the dev server again after changing{" "}
                    <code className={styles.code}>.env</code>.
                  </li>
                </ol>
              </div>
            )}

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            {googleConfigured && (
              <div className={styles.googleWrap}>
                <p className={styles.googleLabel}>Continue with</p>
                <div className={styles.googleSlot}>
                  <GoogleRedirectLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    text={isRegister ? "signup_with" : "signin_with"}
                  />
                </div>
              </div>
            )}

            <nav className={styles.switch} aria-label="Auth options">
              {isRegister ? (
                <>
                  <span className={styles.switchText}>
                    Already have access?
                  </span>
                  <Link
                    className={styles.switchLink}
                    to="/login"
                    state={location.state}
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  <span className={styles.switchText}>First time here?</span>
                  <Link
                    className={styles.switchLink}
                    to="/register"
                    state={location.state}
                  >
                    Register with Google
                  </Link>
                </>
              )}
            </nav>

            <p className={styles.legal}>
              By continuing you agree to use this panel only for authorized
              Grünpflege administration. Google handles authentication; we never
              see your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
