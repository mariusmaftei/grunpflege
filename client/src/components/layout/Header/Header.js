import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../../UI/LanguageSwitcher/LanguageSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import siteLogo from "../../../assets/images/logo/grunpflege-logo.png";
import {
  PATH_GALERIE,
  PATH_KONTAKT,
  PATH_LEISTUNGEN,
} from "../../../constants/paths";
import { useLocalizedPath } from "../../../hooks/useLocalizedPath";

import styles from "./Header.module.css";

export default function Header() {
  const { t } = useTranslation("common");
  const homePath = useLocalizedPath("/");
  const leistungenPath = useLocalizedPath(PATH_LEISTUNGEN);
  const galeriePath = useLocalizedPath(PATH_GALERIE);
  const kontaktPath = useLocalizedPath(PATH_KONTAKT);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close menu if click is outside menu and not on the burger button
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    // Add event listener when menu is open
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <Link to={homePath} className={styles.logoLink}>
            <img
              src={siteLogo}
              alt="Grünpflege"
              className={styles.logoImage}
            />
          </Link>
        </div>

        <div className={styles.headerRight}>
          <LanguageSwitcher />

          <a href={`tel:${t("phone")}`} className={styles.phoneNumber}>
            <FontAwesomeIcon icon={faPhone} className={styles.phoneIcon} />
            <span className={styles.phoneText}>{t("phone")}</span>
          </a>

          <button
            className={styles.mobileMenuButton}
            onClick={toggleMenu}
            aria-label="Menü umschalten"
            ref={buttonRef}
          >
            <span className={styles.menuIcon}></span>
          </button>

          <nav
            className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
            ref={menuRef}
          >
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link to={homePath} className={styles.navLink} onClick={closeMenu}>
                  {t("navigation.home")}
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  to={leistungenPath}
                  className={styles.navLink}
                  onClick={closeMenu}
                >
                  {t("navigation.services")}
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  to={galeriePath}
                  className={styles.navLink}
                  onClick={closeMenu}
                >
                  {t("navigation.gallery")}
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  to={kontaktPath}
                  className={styles.navLink}
                  onClick={closeMenu}
                >
                  {t("navigation.contact")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
