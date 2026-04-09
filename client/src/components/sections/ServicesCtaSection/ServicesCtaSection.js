import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

import { PATH_KONTAKT } from "../../../constants/paths";
import { useLocalizedPath } from "../../../hooks/useLocalizedPath";
import styles from "./ServicesCtaSection.module.css";

export default function ServicesCtaSection() {
  const { t: tServices } = useTranslation("services");
  const { t: tCommon } = useTranslation("common");
  const kontaktPath = useLocalizedPath(PATH_KONTAKT);

  return (
    <section className={styles.ctaSection} aria-labelledby="services-cta-heading">
      <div className={styles.ctaInner}>
        <h2 id="services-cta-heading" className={styles.ctaTitle}>
          {tServices("cta.title")}
        </h2>
        <p className={styles.ctaBody}>{tServices("cta.body")}</p>
        <div className={styles.ctaActions}>
          <Link className={styles.ctaPrimary} to={kontaktPath}>
            {tServices("cta.button")}
          </Link>
          <a
            className={styles.ctaSecondary}
            href={`tel:${tCommon("phone")}`}
          >
            <FontAwesomeIcon icon={faPhone} className={styles.ctaPhoneIcon} />
            <span>
              {tServices("cta.phoneLabel")}: {tCommon("phone")}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
