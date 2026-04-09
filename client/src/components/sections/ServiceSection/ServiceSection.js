import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "../../motion/ScrollReveal";
import { SERVICE_DEFINITIONS } from "../../../data/services-config";
import {
  getLocaleFromPathname,
  localizePath,
  pathServiceCategory,
} from "../../../constants/paths";
import styles from "./ServiceSection.module.css";

function ServiceParallaxMedia({ image }) {
  const cardRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (reduceMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const strength = 22;
      setOffset({ x: -x * strength, y: -y * strength });
    },
    [reduceMotion],
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const idleScale = reduceMotion ? 1.08 : 1.12;
  const hoverScale = reduceMotion ? 1.02 : 1.04;
  const scale = hovered ? hoverScale : idleScale;
  const bgTransform = reduceMotion
    ? `scale(${scale})`
    : `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;

  return (
    <div
      ref={cardRef}
      className={styles.serviceCard}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handlePointerMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={styles.parallaxLayer}
        style={{
          backgroundImage: `url(${image})`,
          transform: bgTransform,
        }}
        aria-hidden
      />
      <div className={styles.serviceCardScrim} aria-hidden />
    </div>
  );
}

export default function ServicesSection({ omitSectionHeader = false } = {}) {
  const { t } = useTranslation("home");
  const { pathname } = useLocation();
  const locale = getLocaleFromPathname(pathname);

  const services = SERVICE_DEFINITIONS.map((def) => ({
    ...def,
    title: t(`services.items.${def.i18nKey}.title`),
    description: t(`services.items.${def.i18nKey}.description`),
  }));

  return (
    <section className={styles.servicesSection}>
      <div className={styles.sectionContainer}>
        {!omitSectionHeader && (
          <ScrollReveal>
            <h2 className={styles.sectionTitle}>{t("services.title")}</h2>
            <p className={styles.sectionDescription}>
              {t("services.description")}
            </p>
          </ScrollReveal>
        )}

        <div className={styles.servicesList}>
          {services.map((service, index) => (
            <ScrollReveal
              key={service.slug}
              className={`${styles.serviceRow} ${
                index % 2 === 1 ? styles.serviceRowReverse : ""
              }`}
              direction={index % 2 === 0 ? "left" : "right"}
              delay={Math.min(index * 0.07, 0.35)}
            >
              <div className={styles.serviceRowMedia}>
                <Link
                  to={localizePath(pathServiceCategory(service.slug), locale)}
                  className={styles.serviceMediaLink}
                  aria-label={service.title}
                >
                  <ServiceParallaxMedia image={service.image} />
                </Link>
              </div>
              <div className={styles.serviceRowText}>
                <span className={styles.serviceRowIcon} aria-hidden>
                  {service.icon}
                </span>
                <h3 className={styles.serviceRowTitle}>
                  <Link
                    to={localizePath(pathServiceCategory(service.slug), locale)}
                    className={styles.serviceTitleLink}
                  >
                    {service.title}
                  </Link>
                </h3>
                <p className={styles.serviceRowDescription}>
                  {service.description}
                </p>
                <Link
                  className={styles.serviceRowCta}
                  to={localizePath(pathServiceCategory(service.slug), locale)}
                >
                  {t("services.findOutMore")}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
