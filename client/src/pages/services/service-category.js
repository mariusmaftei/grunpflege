import { useParams, Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { getServiceBySlug } from "../../data/services-config";
import ServicesCtaSection from "../../components/sections/ServicesCtaSection/ServicesCtaSection";
import { PATH_LEISTUNGEN } from "../../constants/paths";
import { useLocalizedPath } from "../../hooks/useLocalizedPath";
import "../../i18n";
import styles from "./service-category.module.css";

function asStringArray(value) {
  return Array.isArray(value) ? value.filter((x) => typeof x === "string") : [];
}

function asStepArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (x) =>
      x &&
      typeof x === "object" &&
      typeof x.title === "string" &&
      typeof x.text === "string"
  );
}

function asFaqArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (x) =>
      x &&
      typeof x === "object" &&
      typeof x.question === "string" &&
      typeof x.answer === "string"
  );
}

function renderIntroBulletLine(text) {
  if (typeof text !== "string") return text;
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <strong key={i} className={styles.introKeyword}>
          {part.slice(1, -1)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ServiceCategoryPage() {
  const { category } = useParams();
  const { t } = useTranslation("home");
  const { t: tServices } = useTranslation("services");
  const leistungenPath = useLocalizedPath(PATH_LEISTUNGEN);

  const service = category ? getServiceBySlug(category) : null;

  if (!service) {
    return <Navigate to={leistungenPath} replace />;
  }

  const key = service.i18nKey;
  const title = t(`services.items.${key}.title`);
  const description = t(`services.items.${key}.description`);
  const tagline = tServices(`details.${key}.tagline`);
  const features = asStringArray(
    tServices(`details.${key}.features`, { returnObjects: true })
  );
  const processSteps = asStepArray(
    tServices("processSteps", { returnObjects: true })
  );
  const faqItems = asFaqArray(
    tServices("faqItems", { returnObjects: true })
  );

  const overviewImages =
    Array.isArray(service.overviewImages) && service.overviewImages.length >= 2
      ? service.overviewImages
      : null;

  const introBullets1 = overviewImages
    ? asStringArray(
        tServices(`details.${key}.introBullets1`, { returnObjects: true })
      )
    : [];
  const introBullets2 = overviewImages
    ? asStringArray(
        tServices(`details.${key}.introBullets2`, { returnObjects: true })
      )
    : [];

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="service-hero-title">
          <div className={styles.heroBackdrop} aria-hidden>
            <div className={styles.heroBackdropGreen}>
              <div className={styles.heroBackdropPattern} />
            </div>
          </div>
          <div className={styles.heroGrid}>
            <div className={styles.heroPanel}>
              <div className={styles.heroContent}>
                <span className={styles.heroIcon} aria-hidden>
                  {service.icon}
                </span>
                <p className={styles.heroEyebrow}>
                  {tServices("detail.heroEyebrow")}
                </p>
                <h1 id="service-hero-title" className={styles.heroTitle}>
                  {title}
                </h1>
                <p className={styles.heroTagline}>{tagline}</p>
                <span className={styles.heroAccentRule} aria-hidden />
              </div>
            </div>
            <div className={styles.heroVisual}>
              <img
                src={service.heroImage ?? service.image}
                alt={title}
                className={styles.heroImg}
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <div className={styles.pageInner}>
          <Link className={styles.backLink} to={leistungenPath}>
            {tServices("backToAll")}
          </Link>

          <section className={styles.introSection} aria-labelledby="overview-heading">
            <h2 id="overview-heading" className={styles.sectionTitle}>
              {tServices("detail.summaryTitle")}
            </h2>
            {overviewImages ? (
              <>
                <div className={styles.introSplit}>
                  <figure className={styles.introSplitFigure}>
                    <img
                      src={overviewImages[0]}
                      alt={tServices(`details.${key}.introAlt1`)}
                      className={styles.introSplitImg}
                      loading="lazy"
                    />
                  </figure>
                  <div className={styles.introSplitText}>
                    <h3 className={styles.introAccentHeading}>
                      {tServices(`details.${key}.introTitle1`)}
                    </h3>
                    <p className={styles.lead}>{description}</p>
                    {introBullets1.length > 0 && (
                      <ul className={styles.introBulletList}>
                        {introBullets1.map((line, i) => (
                          <li key={i} className={styles.introBulletItem}>
                            {renderIntroBulletLine(line)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className={`${styles.introSplit} ${styles.introSplitSpaced}`}>
                  <div className={styles.introSplitText}>
                    <h3 className={styles.introAccentHeading}>
                      {tServices(`details.${key}.introTitle2`)}
                    </h3>
                    <p className={styles.lead}>
                      {tServices(`details.${key}.introBody2`)}
                    </p>
                    {introBullets2.length > 0 && (
                      <ul className={styles.introBulletList}>
                        {introBullets2.map((line, i) => (
                          <li key={i} className={styles.introBulletItem}>
                            {renderIntroBulletLine(line)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <figure className={styles.introSplitFigure}>
                    <img
                      src={overviewImages[1]}
                      alt={tServices(`details.${key}.introAlt2`)}
                      className={styles.introSplitImg}
                      loading="lazy"
                    />
                  </figure>
                </div>
              </>
            ) : (
              <p className={styles.lead}>{description}</p>
            )}
          </section>

          {features.length > 0 && (
            <section
              className={styles.featuresSection}
              aria-labelledby="features-heading"
            >
              <h2 id="features-heading" className={styles.sectionTitle}>
                {tServices("detail.featuresTitle")}
              </h2>
              <p className={styles.sectionIntro}>
                {tServices("detail.featuresIntro")}
              </p>
              <ul className={styles.featureList}>
                {features.map((item, i) => (
                  <li key={i} className={styles.featureItem}>
                    <span className={styles.featureIcon} aria-hidden>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {processSteps.length > 0 && (
            <section
              className={styles.processSection}
              aria-labelledby="process-heading"
            >
              <h2 id="process-heading" className={styles.sectionTitle}>
                {tServices("process.title")}
              </h2>
              <p className={styles.processSubtitle}>
                {tServices("process.subtitle")}
              </p>
              <ol className={styles.stepList}>
                {processSteps.map((step, index) => (
                  <li key={index} className={styles.stepItem}>
                    <div className={styles.stepNumber} aria-hidden>
                      {index + 1}
                    </div>
                    <div className={styles.stepBody}>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepText}>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {faqItems.length > 0 && (
            <section
              className={styles.faqSection}
              aria-labelledby="faq-heading"
            >
              <h2 id="faq-heading" className={styles.sectionTitle}>
                {tServices("faq.title")}
              </h2>
              <p className={styles.faqSubtitle}>{tServices("faq.subtitle")}</p>
              <div className={styles.faqList}>
                {faqItems.map((item, index) => (
                  <details key={index} className={styles.faqItem}>
                    <summary className={styles.faqSummary}>
                      {item.question}
                    </summary>
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        <ServicesCtaSection />
      </main>
    </div>
  );
}
