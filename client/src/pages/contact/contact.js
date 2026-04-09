import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faClock,
  faCircleQuestion,
  faLeaf,
  faCheck,
  faCalendarAlt,
  faMapMarkedAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

import styles from "./contact.module.css";
import { PATH_KONTAKT } from "../../constants/paths";
import { useLocalizedPath } from "../../hooks/useLocalizedPath";

const WHY_CHOOSE_KEYS = [
  "experiencedTeam",
  "qualityMaterials",
  "customSolutions",
  "satisfaction",
];

export default function ContactPage() {
  const { t } = useTranslation("contact");
  const { t: tCommon } = useTranslation("common");
  const kontaktPath = useLocalizedPath(PATH_KONTAKT);

  // This ensures that the translations are loaded
  useEffect(() => {
    // This is just to trigger a re-render when the language changes
  }, [t, tCommon]);

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        {/* Hero Section with Overlay */}
        <section className={styles.contactHero}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.contactHeroContent}>
            <h1 className={styles.contactTitle}>{t("hero.title")}</h1>
            <p className={styles.contactSubtitle}>{t("hero.subtitle")}</p>
          </div>
        </section>

        {/* Contact Methods Section - Moved here between hero and main contact section */}
        <section className={styles.contactMethodsSection}>
          <div className={styles.contactMethodsContainer}>
            <div className={styles.contactMethodsHeader}>
              <h2 className={styles.contactMethodsTitle}>
                {t("contactMethods.title")}
              </h2>
              <p className={styles.contactMethodsDescription}>
                {t("contactMethods.description")}
              </p>
            </div>

            <div className={styles.contactMethodsGrid}>
              <div className={styles.contactMethodCard}>
                <div className={styles.contactMethodIcon}>
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className={styles.contactMethodContent}>
                  <h3 className={styles.contactMethodTitle}>
                    {t("contactMethods.phone.title")}
                  </h3>
                  <a
                    href={`tel:${tCommon("phone")}`}
                    className={styles.contactMethodValue}
                  >
                    {tCommon("phone")}
                  </a>
                  <p className={styles.contactMethodDescription}>
                    {t("contactMethods.phone.description")}
                  </p>
                </div>
              </div>

              <div className={styles.contactMethodCard}>
                <div className={styles.contactMethodIcon}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className={styles.contactMethodContent}>
                  <h3 className={styles.contactMethodTitle}>
                    {t("contactMethods.email.title")}
                  </h3>
                  <a
                    href="mailto:cristian.bogdan_ciobanu@yahoo.com"
                    className={styles.contactMethodValue}
                  >
                    cristian.bogdan_ciobanu@yahoo.com
                  </a>
                  <p className={styles.contactMethodDescription}>
                    {t("contactMethods.email.description")}
                  </p>
                </div>
              </div>

              <div className={styles.contactMethodCard}>
                <div className={styles.contactMethodIcon}>
                  <FontAwesomeIcon icon={faWhatsapp} />
                </div>
                <div className={styles.contactMethodContent}>
                  <h3 className={styles.contactMethodTitle}>
                    {t("contactMethods.whatsapp.title")}
                  </h3>
                  <a
                    href={`https://wa.me/${tCommon("phone").replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    className={styles.contactMethodValue}
                  >
                    {tCommon("phone")}
                  </a>
                  <p className={styles.contactMethodDescription}>
                    {t("contactMethods.whatsapp.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Contact Section with Map */}
        <section className={styles.mainContactSection}>
          <div className={styles.mainContactContainer}>
            <div className={styles.contactInfoPanel}>
              <div className={styles.contactInfoHeader}>
                <FontAwesomeIcon
                  icon={faLeaf}
                  className={styles.contactInfoHeaderIcon}
                />
                <h2 className={styles.contactInfoTitle}>
                  {t("contactInfo.title")}
                </h2>
              </div>

              <p className={styles.contactInfoDescription}>
                {t("contactInfo.description")}
              </p>

              <div className={styles.contactInfoList}>
                <div className={styles.contactInfoItem}>
                  <div className={styles.contactInfoItemIcon}>
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div className={styles.contactInfoItemContent}>
                    <h3 className={styles.contactInfoItemLabel}>
                      {t("contactInfo.phone")}
                    </h3>
                    <a
                      href={`tel:${tCommon("phone")}`}
                      className={styles.contactInfoItemValue}
                    >
                      {tCommon("phone")}
                    </a>
                  </div>
                </div>

                <div className={styles.contactInfoItem}>
                  <div className={styles.contactInfoItemIcon}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className={styles.contactInfoItemContent}>
                    <h3 className={styles.contactInfoItemLabel}>
                      {t("contactInfo.email")}
                    </h3>
                    <a
                      href="mailto:cristian.bogdan_ciobanu@yahoo.com"
                      className={styles.contactInfoItemValue}
                    >
                      cristian.bogdan_ciobanu@yahoo.com
                    </a>
                  </div>
                </div>

                <div className={styles.contactInfoItem}>
                  <div className={styles.contactInfoItemIcon}>
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>
                  <div className={styles.contactInfoItemContent}>
                    <h3 className={styles.contactInfoItemLabel}>
                      {t("contactInfo.address")}
                    </h3>
                    <p className={styles.contactInfoItemValue}>
                      Eichendorffstraße 7C
                      <br />
                      63768 Hösbach, Germany
                    </p>
                  </div>
                </div>

                <div className={styles.contactInfoItem}>
                  <div className={styles.contactInfoItemIcon}>
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  <div className={styles.contactInfoItemContent}>
                    <h3 className={styles.contactInfoItemLabel}>
                      {t("contactInfo.openingHours")}
                    </h3>
                    <p className={styles.contactInfoItemValue}>
                      {tCommon("footer.monday")}
                      <br />
                      {tCommon("footer.saturday")}
                      <br />
                      {tCommon("footer.sunday")}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.socialLinks}>
                <h3 className={styles.socialTitle}>
                  {t("contactInfo.followUs")}
                </h3>
                <div className={styles.socialIcons}>
                  <a
                    href="https://www.facebook.com/cristianbogdan.ciobanu"
                    className={styles.socialIcon}
                    aria-label="Facebook"
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a
                    href="https://www.instagram.com/bubulusca/?hl=en"
                    className={styles.socialIcon}
                    aria-label="Instagram"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a
                    href="https://x.com/Schlossg0ld"
                    className={styles.socialIcon}
                    aria-label="X"
                  >
                    <FontAwesomeIcon icon={faXTwitter} />
                  </a>
                  <a
                    href={`https://wa.me/${tCommon("phone").replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    className={styles.socialIcon}
                    aria-label="WhatsApp"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.mapPanel}>
              <div className={styles.mapContainer}>
                <div className={styles.mapHeader}>
                  <FontAwesomeIcon
                    icon={faMapMarkedAlt}
                    className={styles.mapHeaderIcon}
                  />
                  <h3 className={styles.mapHeaderTitle}>{t("map.title")}</h3>
                </div>
                <div className={styles.simpleMapContainer}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5129.423104709639!2d9.221197798973396!3d49.998017153805996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd36371bed1e3b%3A0x4178034b683ed563!2sEichendorffstra%C3%9Fe%207C%2C%2063768%20H%C3%B6sbach%2C%20Germany!5e0!3m2!1sen!2sro!4v1746619897680!5m2!1sen!2sro"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Cristian Cionabu Gartenbau Standort"
                    className={styles.simpleMapIframe}
                    aria-hidden="false"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={styles.whyChooseSection}
          aria-labelledby="contact-why-choose-heading"
        >
          <div className={styles.whyChooseContainer}>
            <h2 id="contact-why-choose-heading" className={styles.whyChooseTitle}>
              {t("whyChoose.title")}
            </h2>
            <p className={styles.whyChooseDescription}>
              {t("whyChoose.description")}
            </p>

            <div className={styles.whyChooseGrid}>
              {WHY_CHOOSE_KEYS.map((key) => (
                <div key={key} className={styles.whyChooseItem}>
                  <div className={styles.whyChooseIcon}>
                    <FontAwesomeIcon icon={faCheck} aria-hidden />
                  </div>
                  <h3 className={styles.whyChooseItemTitle}>
                    {t(`whyChoose.items.${key}.title`)}
                  </h3>
                  <p className={styles.whyChooseItemDescription}>
                    {t(`whyChoose.items.${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <div className={styles.faqContainer}>
            <h2 className={styles.faqTitle}>{t("faq.title")}</h2>
            <p className={styles.faqDescription}>{t("faq.description")}</p>

            <div className={styles.faqGrid}>
              {t("faq.items", { returnObjects: true }).map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>
                    <FontAwesomeIcon icon={faCircleQuestion} /> {faq.question}
                  </h3>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule Consultation Section */}
        <section className={styles.scheduleSection}>
          <div className={styles.scheduleContainer}>
            <h2 className={styles.scheduleTitle}>{t("schedule.title")}</h2>
            <p className={styles.scheduleDescription}>
              {t("schedule.description")}
            </p>
            <Link to={kontaktPath} className={styles.scheduleButton}>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className={styles.scheduleButtonIcon}
              />{" "}
              {t("schedule.button")}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
