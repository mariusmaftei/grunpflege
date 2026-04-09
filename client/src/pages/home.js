import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "../i18n";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "../components/motion/ScrollReveal";
import styles from "./home.module.css";

import BeforeAfterSlider from "../components/UI/BeforeAfterSlider/BeforeAfterSlider";
import ServicesSection from "../components/sections/ServiceSection/ServiceSection";
import ServicesCtaSection from "../components/sections/ServicesCtaSection/ServicesCtaSection";

import RoundaboutBeforeImage from "../assets/images/gallery/before-after/roundabout-before.webp";
import RoundaboutAfterImage from "../assets/images/gallery/before-after/roundabout-after.webp";
import GardenBeforeImage from "../assets/images/gallery/before-after/garden-before.jpg";
import GardenAfterImage from "../assets/images/gallery/before-after/garden-after.jpg";
import GrassBeforeImage from "../assets/images/gallery/before-after/grass-before.jpg";
import GrassAfterImage from "../assets/images/gallery/before-after/grass-after.jpg";
import CarouselContainer from "../components/UI/InfiniteCarousel/carousel-container";
import { fetchHomeCarouselConfig } from "../services/gallery-services";
import { PATH_GALERIE, PATH_KONTAKT } from "../constants/paths";
import { useLocalizedPath } from "../hooks/useLocalizedPath";

const WHY_CHOOSE_KEYS = [
  "experiencedTeam",
  "qualityMaterials",
  "customSolutions",
  "satisfaction",
];

export default function HomePage() {
  const { t } = useTranslation("home");
  const reduceMotion = useReducedMotion();
  const kontaktPath = useLocalizedPath(PATH_KONTAKT);
  const galeriePath = useLocalizedPath(PATH_GALERIE);

  const [carouselRowsData, setCarouselRowsData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchHomeCarouselConfig()
      .then((rows) => {
        if (!cancelled) setCarouselRowsData(rows);
      })
      .catch(() => {
        if (!cancelled) setCarouselRowsData([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // This ensures that the translations are loaded
  useEffect(() => {
    // This is just to trigger a re-render when the language changes
  }, [t]);

  // iOS Safari parallax fix
  useEffect(() => {
    // Detect iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      // Get the elements with parallax backgrounds
      const heroSection = document.querySelector(`.${styles.heroSection}`);
      const showcaseSection = document.querySelector(
        `.${styles.gardenShowcaseSection}`,
      );

      // Apply iOS-specific styles
      if (heroSection) {
        heroSection.style.backgroundAttachment = "scroll";
        // Optionally increase quality for iOS
        heroSection.style.backgroundSize = "cover";
      }

      if (showcaseSection) {
        showcaseSection.style.backgroundAttachment = "scroll";
        // Optionally increase quality for iOS
        showcaseSection.style.backgroundSize = "cover";
      }
    }
  }, []);

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        {/* Hero Section with Real Image */}
        <section className={styles.heroSection}>
          <motion.div
            className={styles.heroContent}
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h1 className={styles.heroTitle}>{t("hero.title")}</h1>
            <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>
            <Link to={kontaktPath} className={styles.ctaButton}>
              {t("hero.cta")}
            </Link>
          </motion.div>
        </section>

        {/* Transformation Showcase with Real Images */}
        <section className={styles.transformationSection}>
          <div className={styles.sectionContainer}>
            <ScrollReveal className="text-center">
              <h2 className={styles.sectionTitle}>
                {t("transformation.title")}
              </h2>
              <p className={styles.sectionDescription}>
                {t("transformation.description")}
              </p>
            </ScrollReveal>

            <div className={styles.slidersGrid}>
              {/* Slider 1: Lawn Maintenance */}
              <ScrollReveal delay={0.05}>
              <div>
                <h3 className={styles.sliderTitle}>
                  {t("transformation.sliders.lawn.title")}
                </h3>
                <div className={styles.sliderContainer}>
                  <BeforeAfterSlider
                    beforeImage={GrassBeforeImage}
                    afterImage={GrassAfterImage}
                    beforeLabel={t("transformation.sliders.lawn.before")}
                    afterLabel={t("transformation.sliders.lawn.after")}
                  />
                </div>
              </div>
              </ScrollReveal>

              {/* Slider 2: Roundabout Project */}
              <ScrollReveal delay={0.1}>
              <div>
                <h3 className={styles.sliderTitle}>
                  {t("transformation.sliders.roundabout.title")}
                </h3>
                <div className={styles.sliderContainer}>
                  <BeforeAfterSlider
                    beforeImage={RoundaboutBeforeImage}
                    afterImage={RoundaboutAfterImage}
                    beforeLabel={t("transformation.sliders.roundabout.before")}
                    afterLabel={t("transformation.sliders.roundabout.after")}
                  />
                </div>
              </div>
              </ScrollReveal>

              {/* Slider 3: Garden Renovation */}
              <ScrollReveal delay={0.15}>
              <div>
                <h3 className={styles.sliderTitle}>
                  {t("transformation.sliders.garden.title")}
                </h3>
                <div className={styles.sliderContainer}>
                  <BeforeAfterSlider
                    beforeImage={GardenBeforeImage}
                    afterImage={GardenAfterImage}
                    beforeLabel={t("transformation.sliders.garden.before")}
                    afterLabel={t("transformation.sliders.garden.after")}
                  />
                </div>
              </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.08}>
              <p className={styles.transformationCaption}>
                {t("transformation.caption")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        <ServicesSection />

        {/* Project Gallery Carousel */}
        <section id="gallery" className={styles.gallerySection}>
          <div className={styles.sectionContainer}>
            <ScrollReveal className="text-center">
              <h2 className={styles.sectionTitle}>{t("gallery.title")}</h2>
              <p className={styles.sectionDescription}>
                {t("gallery.description")}
              </p>
            </ScrollReveal>
            {carouselRowsData !== null &&
            carouselRowsData.some((r) => r.images?.length > 0) ? (
              <ScrollReveal delay={0.12}>
                <CarouselContainer
                  rowsData={carouselRowsData.filter((r) => r.images?.length > 0)}
                />
              </ScrollReveal>
            ) : null}
          </div>
        </section>

        {/* Garden Showcase Section */}
        <section className={styles.gardenShowcaseSection}>
          <ScrollReveal className={styles.showcaseContent}>
            <h2 className={styles.showcaseTitle}>{t("showcase.title")}</h2>
            <Link to={galeriePath} className={styles.ctaButton}>
              {t("showcase.cta")}
            </Link>
          </ScrollReveal>
        </section>

        <section
          className={styles.whyChooseSection}
          aria-labelledby="why-choose-heading"
        >
          <div className={styles.whyChooseContainer}>
            <ScrollReveal className="text-center">
              <h2
                id="why-choose-heading"
                className={styles.sectionTitle}
              >
                {t("whyChoose.title")}
              </h2>
              <p className={styles.sectionDescription}>
                {t("whyChoose.description")}
              </p>
            </ScrollReveal>
            <div className={styles.whyChooseGrid}>
              {WHY_CHOOSE_KEYS.map((key, index) => (
                <ScrollReveal
                  key={key}
                  delay={Math.min(index * 0.08, 0.28)}
                  className={styles.whyChooseItem}
                >
                  <div className={styles.whyChooseIcon}>
                    <FontAwesomeIcon icon={faCheck} aria-hidden />
                  </div>
                  <h3 className={styles.whyChooseItemTitle}>
                    {t(`whyChoose.items.${key}.title`)}
                  </h3>
                  <p className={styles.whyChooseItemDescription}>
                    {t(`whyChoose.items.${key}.description`)}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <ServicesCtaSection />
      </main>
    </div>
  );
}
