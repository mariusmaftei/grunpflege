import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, isEmailAllowed } from "../context/AuthContext";
import styles from "./ProtectedRoute.module.css";

export default function ProtectedRoute() {
  const { user, loading, googleConfigured } = useAuth();
  const location = useLocation();

  if (!googleConfigured) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname?.startsWith("/admin") ? location.pathname : "/admin" }}
      />
    );
  }

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} aria-hidden />
        <p className={styles.muted}>Loading session…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname || "/admin" }} />;
  }

  if (!isEmailAllowed(user.email)) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{
          email: user.email,
          reason: "session",
          from: location.pathname?.startsWith("/admin") ? location.pathname : "/admin",
        }}
      />
    );
  }

  return <Outlet />;
}
