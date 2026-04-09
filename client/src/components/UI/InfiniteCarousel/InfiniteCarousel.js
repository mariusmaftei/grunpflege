import styles from "./InfiniteCarousel.module.css";

export default function InfiniteCarousel({
  images,
  duration = 40,
  reverse = false,
  rowId = "row",
}) {
  const duplicateImages = (imgs) => [...imgs, ...imgs];

  return (
    <div className={styles.carouselRow}>
      <div
        className={styles.carouselTrack}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {duplicateImages(images).map((image, index) => (
          <div
            key={`${rowId}-${image.id ?? "img"}-${index}`}
            className={`${styles.carouselItem} ${styles[image.format]}`}
            style={{ width: `${image.width}px`, flexShrink: 0 }}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt || ""}
              className={styles.carouselImage}
              width={image.width}
              height={280}
            />
            <div className={styles.imageCaption}>{image.description || ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
