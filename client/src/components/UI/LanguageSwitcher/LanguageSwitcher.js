import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./LanguageSwitcher.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { switchPathLocale } from "../../../constants/paths";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    const nextPath = switchPathLocale(pathname, lng);
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("language", lng);
    } catch {
      /* ignore */
    }
    navigate(nextPath, { replace: true });
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.languageButton}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FontAwesomeIcon icon={faGlobe} className={styles.globeIcon} />
        <span className={styles.languageCode}>
          {i18n.language === "de" ? "DE" : "EN"}
        </span>
      </button>
      {isOpen && (
        <div className={styles.languageDropdown}>
          <button
            className={`${styles.languageOption} ${
              i18n.language === "de" ? styles.active : ""
            }`}
            onClick={() => changeLanguage("de")}
          >
            Deutsch
          </button>
          <button
            className={`${styles.languageOption} ${
              i18n.language === "en" ? styles.active : ""
            }`}
            onClick={() => changeLanguage("en")}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}
