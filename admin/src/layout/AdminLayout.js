import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../pages/AdminPage/AdminPage.module.css";

export default function AdminLayout() {
  const { user, signOutUser } = useAuth();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar} aria-label="Admin navigation">
        <div className={styles.sideUser}>
          <div className={styles.avatarWrap}>
            {user?.picture ? (
              <img src={user.picture} alt="" className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarFallback}>{initial}</span>
            )}
          </div>
          <div className={styles.sideUserText}>
            <div className={styles.sideUserNameRow}>
              <div className={styles.sideUserName}>{user?.name || "Admin"}</div>
              <span className={styles.adminBadge}>Admin</span>
            </div>
            <div className={styles.sideUserEmail} title={user?.email}>
              {user?.email}
            </div>
          </div>
          <button type="button" className={styles.signOut} onClick={() => signOutUser()}>
            Sign out
          </button>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/admin/gallery/upload"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navActive : ""}`
            }
          >
            <span className={styles.navIcon} aria-hidden />
            Upload
          </NavLink>
          <NavLink
            to="/admin/gallery/manage"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navActive : ""}`
            }
          >
            <span className={styles.navIcon} aria-hidden />
            Manage
          </NavLink>
          <button type="button" className={styles.navItem} disabled title="Coming later">
            <span className={styles.navIconMuted} aria-hidden />
            Content
          </button>
          <button type="button" className={styles.navItem} disabled title="Coming later">
            <span className={styles.navIconMuted} aria-hidden />
            Settings
          </button>
        </nav>
      </aside>

      <Outlet />
    </div>
  );
}
