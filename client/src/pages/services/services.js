import { useTranslation } from "react-i18next";
import ServicesSection from "../../components/sections/ServiceSection/ServiceSection";

import "../../i18n";
import styles from "./services.module.css";

export default function ServicesPage() {
  const { t } = useTranslation("services");

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroOverlay} aria-hidden />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{t("hero.title")}</h1>
            <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>
          </div>
        </section>
        <ServicesSection omitSectionHeader />
      </main>
    </div>
  );
}
