import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import authStyles from "../AuthPage/AuthPage.module.css";
import styles from "./AccessDeniedPage.module.css";
import logoGrunpflege from "../../assets/images/grunpflege-logo.png";

export default function AccessDeniedPage() {
  const { signOutUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const state = location.state || {};
  const email = state.email || searchParams.get("email") || "";
  const message = state.message;
  const reason = state.reason || searchParams.get("reason") || "";
  const from = state.from;

  const goToLogin = () => {
    signOutUser();
    navigate("/login", { replace: true, state: { from: from || "/admin" } });
  };

  if (loading) {
    return (
      <div className={authStyles.page}>
        <aside className={authStyles.hero} aria-hidden="true" />
        <div className={authStyles.panel}>
          <div className={authStyles.card}>
            <div className={authStyles.spinner} aria-hidden />
            <p className={authStyles.muted}>Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  if (process.env.NODE_ENV !== "production" && (message || reason)) {
    // Keep technical details out of the UI, but still visible for developers.
    console.warn("[access-denied]", { reason, message, email });
  }

  return (
    <div className={authStyles.page}>
      <aside className={authStyles.hero} aria-label="Grünpflege admin">
        <div className={authStyles.heroGlow} aria-hidden />
        <div className={authStyles.heroInner}>
          <span className={authStyles.heroBadge}>Admin console</span>
          <div className={`${authStyles.heroBrand} ${styles.heroBrand}`}>
            <img
              src={logoGrunpflege}
              alt=""
              className={authStyles.heroLogo}
              width={120}
              height={120}
              decoding="async"
              aria-hidden
            />
            <div className={authStyles.heroBrandText}>
              <span className={authStyles.heroWordmark}>Grünpflege</span>
              <span className={authStyles.heroTagline}>Garden care · Back office</span>
            </div>
          </div>
          <h2 className={authStyles.heroTitle}>Access denied</h2>
          <p className={authStyles.heroLead}>
            This Google account is not authorized to use the admin panel.
          </p>
        </div>
      </aside>
      <div className={authStyles.panel}>
        <div className={authStyles.panelGlow} aria-hidden />
        <div className={authStyles.panelContent}>
          <p className={authStyles.panelGreenTitle} aria-hidden>
            Access
          </p>
          <p className={authStyles.panelGreenHint} aria-hidden>
            Not authorized
          </p>
          <div className={authStyles.card}>
            <div className={authStyles.cardAccent} aria-hidden />
            <div className={styles.denyIcon} aria-hidden>
              !
            </div>
            <p className={authStyles.kicker}>Admin panel</p>
            <h1 className={authStyles.title}>You don’t have access</h1>
            <p className={authStyles.subtitle}>
              This account isn’t authorized to use the Grünpflege admin panel.
            </p>

            {email ? (
              <p className={styles.emailHint}>
                <strong>Signed in as</strong> {email}
              </p>
            ) : null}

            <p className={authStyles.muted}>
              If you believe this is a mistake, contact the administrator and ask to be granted access.
            </p>

            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={goToLogin}>
                Try a different Google account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
