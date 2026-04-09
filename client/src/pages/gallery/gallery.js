import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./gallery.module.css";

import "../../i18n";
import { fetchPublicGalleryForFilter } from "../../services/gallery-services";

const INITIAL_VISIBLE = 9;
const LOAD_MORE_STEP = 9;

export default function GalleryPage() {
  const { t } = useTranslation("gallery");

  const categories = [
    { id: "all", name: t("filter.categories.all") },
    { id: "gardens", name: t("filter.categories.gardens") },
    { id: "lawns", name: t("filter.categories.lawns") },
    { id: "trees", name: t("filter.categories.trees") },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const list = await fetchPublicGalleryForFilter(selectedCategory);
        if (!cancelled) {
          setFilteredImages(list);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e?.message || "loadFailed");
          setFilteredImages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [selectedCategory]);

  const displayedImages = filteredImages.slice(0, visibleCount);
  const hasMoreImages = visibleCount < filteredImages.length;
  const scrollSentinelRef = useRef(null);

  useEffect(() => {
    const el = scrollSentinelRef.current;
    if (!el || !hasMoreImages) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisibleCount((prev) =>
          Math.min(prev + LOAD_MORE_STEP, filteredImages.length),
        );
      },
      { root: null, rootMargin: "280px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMoreImages, visibleCount, filteredImages.length]);

  const closePreview = useCallback(() => setPreviewImage(null), []);

  useEffect(() => {
    if (!previewImage) return;
    const onKey = (e) => {
      if (e.key === "Escape") closePreview();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [previewImage, closePreview]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const openPreview = (image) => setPreviewImage(image);

  const previewSrc = previewImage
    ? previewImage.fullSrc || previewImage.src
    : "";

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <section className={styles.gallerySection}>
          <div className={styles.galleryContainer}>
            <h1 className={styles.galleryTitle}>{t("title")}</h1>
            <p className={styles.galleryDescription}>{t("description")}</p>

            <div className={styles.filterContainer}>
              <label htmlFor="category-filter" className={styles.filterLabel}>
                {t("filter.label")}
              </label>
              <select
                id="category-filter"
                className={styles.filterSelect}
                value={selectedCategory}
                onChange={handleCategoryChange}
                disabled={loading}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className={styles.loadingState}>{t("loading")}</p>
            ) : null}

            {!loading && loadError ? (
              <p className={styles.errorState}>{t("loadError")}</p>
            ) : null}

            {!loading && !loadError ? (
              <div className={styles.galleryMasonry}>
                {displayedImages.map((image) => (
                    <div
                      key={image.id}
                      className={`${styles.galleryItem} ${styles.itemNatural}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => openPreview(image)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openPreview(image);
                        }
                      }}
                    >
                      <div className={styles.imageContainer}>
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          loading="lazy"
                          className={styles.galleryImage}
                          draggable={false}
                        />
                        <div className={styles.imageOverlay}>
                          <div className={styles.categoryTag}>
                            {t(`filter.apiCategories.${image.category}`, {
                              defaultValue: image.category,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            ) : null}

            {!loading && !loadError && hasMoreImages ? (
              <div
                ref={scrollSentinelRef}
                className={styles.scrollSentinel}
                aria-hidden
              />
            ) : null}

            {!loading && !loadError && filteredImages.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{t("emptyState")}</p>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      {previewImage ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={t("lightbox.dialogLabel")}
        >
          <div
            className={styles.lightboxBackdrop}
            onClick={closePreview}
            aria-hidden
          />
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={closePreview}
            aria-label={t("lightbox.close")}
          >
            ×
          </button>
          <div
            className={styles.lightboxPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewSrc || "/placeholder.svg"}
              alt={previewImage.alt}
              className={styles.lightboxImage}
            />
            {previewImage.description ? (
              <p className={styles.lightboxCaption}>{previewImage.description}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
