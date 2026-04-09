import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getApiToken, uploadGalleryImageToApi, galleryImagePublicUrl } from "../../services/api";
import { GALLERY_CATEGORIES, buildGalleryObjectPath } from "../../services/galleryService";
import styles from "../AdminPage/AdminPage.module.css";

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeOptionalBaseName(raw) {
  return String(raw || "").replace(/\s+/g, "-");
}

export default function GalleryUploadPage() {
  const fileRef = useRef(null);

  const [category, setCategory] = useState("");
  const [draftImage, setDraftImage] = useState(null);
  const [imageBaseName, setImageBaseName] = useState("");
  const [description, setDescription] = useState("");
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bulkPct, setBulkPct] = useState(0);
  const [toast, setToast] = useState("");
  const [recent, setRecent] = useState([]);
  const [successModal, setSuccessModal] = useState(null);

  const categoryMeta = useMemo(() => {
    if (!category) {
      return {
        id: "",
        label: "Not selected",
        hint: "Select a category above. It sets the folder and default file name on the server.",
      };
    }
    return GALLERY_CATEGORIES.find((c) => c.id === category) || { id: category, label: category, hint: "" };
  }, [category]);

  const previewObjectPath = useMemo(() => {
    if (!category || !draftImage?.file || !draftImage.storageUuid) return "";
    return buildGalleryObjectPath(
      category,
      draftImage.file.name,
      imageBaseName,
      draftImage.storageUuid,
    );
  }, [category, draftImage, imageBaseName]);

  const hasApiToken = Boolean(getApiToken());
  const hasImage = Boolean(draftImage);
  const descOk = Boolean(String(description).trim());
  const canSubmit = hasApiToken && Boolean(category) && hasImage && descOk && !busy;

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!successModal) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setSuccessModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [successModal]);

  const setImageFromFileList = useCallback((fileList) => {
    if (!category) {
      setToast("Select a category first.");
      return;
    }
    const files = [...fileList].filter((f) => f.type.startsWith("image/"));
    if (!files.length) {
      setToast("Choose an image file (PNG, JPG, WebP).");
      return;
    }
    const file = files[0];
    setDraftImage((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return {
        file,
        previewUrl: URL.createObjectURL(file),
        storageUuid: crypto.randomUUID(),
      };
    });
  }, [category]);

  const clearImage = useCallback(() => {
    setDraftImage((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    setImageBaseName("");
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      if (busy) return;
      if (!category) {
        setToast("Select a category first.");
        return;
      }
      setImageFromFileList(e.dataTransfer.files);
    },
    [busy, category, setImageFromFileList],
  );

  const runUpload = async () => {
    if (!category) {
      setToast("Select a category.");
      return;
    }
    if (!draftImage) {
      setToast("Choose one image to upload.");
      return;
    }
    const descTrim = String(description).trim();
    if (!descTrim) {
      setToast("Enter a description.");
      return;
    }
    if (!hasApiToken) {
      setToast("Sign in again so the API session is active.");
      return;
    }

    const { file, previewUrl, storageUuid } = draftImage;
    const customLabel = String(imageBaseName || "").trim();
    setBusy(true);
    setBulkPct(10);

    try {
      const data = await uploadGalleryImageToApi(category, file, descTrim, {
        fileBaseName: imageBaseName,
        storageUuid,
        isPublished: showOnWebsite,
      });
      const urlPath = data?.image?.urlPath || "";
      const publicUrl = galleryImagePublicUrl(urlPath);

      setBulkPct(100);
      URL.revokeObjectURL(previewUrl);
      setDraftImage(null);
      setImageBaseName("");
      setDescription("");
      setShowOnWebsite(true);

      setRecent((r) =>
        [
          {
            id: String(data?.image?.id || Date.now()),
            name: data?.image?.fileName || file.name,
            size: file.size,
            category,
            path: urlPath,
            publicUrl,
            description: descTrim,
            at: Date.now(),
          },
          ...r,
        ].slice(0, 24),
      );

      setSuccessModal({
        categoryLabel: categoryMeta.label,
        link: publicUrl || urlPath,
        customLabel: customLabel || null,
      });
    } catch (e) {
      setToast(e?.message || "Upload failed.");
    } finally {
      setBulkPct(0);
      setBusy(false);
    }
  };

  return (
    <>
      {successModal ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setSuccessModal(null)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-success-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalIconWrap} aria-hidden>
              <span className={styles.modalCheck}>✓</span>
            </div>
            <h2 id="upload-success-title" className={styles.modalTitle}>
              All set
            </h2>
            <p className={styles.modalLead}>Your image was uploaded as WebP and saved to the gallery.</p>
            <p className={styles.modalBody}>
              {successModal.customLabel ? (
                <>
                  Custom name <strong className={styles.modalEm}>{successModal.customLabel}</strong> · category{" "}
                  <strong className={styles.modalEm}>{successModal.categoryLabel}</strong>
                </>
              ) : (
                <>
                  Category <strong className={styles.modalEm}>{successModal.categoryLabel}</strong>
                </>
              )}
            </p>
            {successModal.link ? (
              <div className={styles.modalPreviewWrap}>
                <img src={successModal.link} alt="" className={styles.modalPreviewImg} decoding="async" />
              </div>
            ) : null}
            {successModal.link ? (
              <a
                className={styles.modalLink}
                href={successModal.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open full image
              </a>
            ) : null}
            <button type="button" className={styles.modalBtn} onClick={() => setSuccessModal(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      <div className={styles.mainCol}>
        <header className={styles.topBar}>
          <div>
            <p className={styles.crumb}>Admin / Gallery / Upload</p>
            <h1 className={styles.pageTitle}>Upload image</h1>
            <p className={styles.pageLead}>
              Upload one image at a time with a category and description.
            </p>
          </div>
        </header>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Image selected</span>
            <span className={styles.statValue}>{hasImage ? "Yes" : "No"}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Category</span>
            <span className={styles.statValueSm}>{categoryMeta.label}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>This session</span>
            <span className={styles.statValue}>{recent.length}</span>
          </div>
        </div>

        {toast ? (
          <div className={styles.toast} role="status">
            {toast}
          </div>
        ) : null}

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>New upload</h2>
            <p className={styles.panelDesc}>
              Category, one image, and description are required. Then upload.
            </p>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={(e) => {
              setImageFromFileList(e.target.files);
              e.target.value = "";
            }}
          />

          <div className={styles.uploadForm}>
            <div className={styles.formBlock}>
              <div className={styles.fieldLabelRow}>
                <span className={styles.fieldLabel}>Category</span>
                <span className={styles.requiredMark} aria-hidden>
                  Required
                </span>
              </div>
              <div className={styles.tabs} role="tablist" aria-label="Gallery category">
                {GALLERY_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={category === c.id}
                    className={category === c.id ? styles.tabOn : styles.tab}
                    onClick={() => !busy && setCategory(c.id)}
                    disabled={busy}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <p className={styles.fieldHint}>{categoryMeta.hint}</p>
            </div>

            <div className={styles.formBlock}>
              <div className={styles.fieldLabelRow}>
                <span className={styles.fieldLabel}>Image</span>
                <span className={styles.requiredMark} aria-hidden>
                  Required
                </span>
              </div>
              {!hasImage ? (
                <button
                  type="button"
                  className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!busy && category) setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => !busy && category && fileRef.current?.click()}
                  disabled={busy || !category}
                  title={!category ? "Select a category first" : undefined}
                >
                  <span className={styles.dropIcon} aria-hidden />
                  <span className={styles.dropTitle}>
                    {category ? "Drop an image or click to browse" : "Select a category above, then add an image"}
                  </span>
                  <span className={styles.dropSub}>One file — PNG, JPG, WebP</span>
                </button>
              ) : (
                <div className={styles.previewBlock}>
                  <div className={styles.previewThumbWrap}>
                    <img src={draftImage.previewUrl} alt="" className={styles.previewThumb} />
                  </div>
                  <div className={styles.previewMeta}>
                    <p className={styles.previewName} title={draftImage.file.name}>
                      {draftImage.file.name}
                    </p>
                    <p className={styles.previewSize}>{formatBytes(draftImage.file.size)}</p>
                    <label className={styles.optionalNameLabel} htmlFor="gallery-image-base-name">
                      <span>Optional file name</span>
                      <span className={styles.optionalHint}>
                        Stored as <code>your-name-UUID.webp</code>, or <code>category-UUID.webp</code> if empty.
                        Spaces are turned into dashes. Server always saves WebP (~max 200KB).
                      </span>
                      <input
                        id="gallery-image-base-name"
                        type="text"
                        className={styles.optionalNameInput}
                        value={imageBaseName}
                        onChange={(e) => setImageBaseName(normalizeOptionalBaseName(e.target.value))}
                        disabled={busy}
                        placeholder="e.g. lawn-after-spring"
                        maxLength={120}
                        autoComplete="off"
                      />
                    </label>
                    <code className={styles.previewPath}>{previewObjectPath}</code>
                    <div className={styles.previewActions}>
                      <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={() => !busy && fileRef.current?.click()}
                        disabled={busy}
                      >
                        Replace image
                      </button>
                      <button type="button" className={styles.btnGhost} onClick={clearImage} disabled={busy}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formBlock}>
              <div className={styles.fieldLabelRow}>
                <label className={styles.fieldLabel} htmlFor="gallery-upload-description">
                  Description
                </label>
                <span className={styles.requiredMark} aria-hidden>
                  Required
                </span>
              </div>
              <textarea
                id="gallery-upload-description"
                className={styles.descTextarea}
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={busy}
                placeholder="Describe this photo for the gallery (visible to visitors if you show captions)."
                maxLength={4000}
              />
              <p className={styles.fieldHint}>{description.trim().length} / 4000 characters</p>
            </div>

            <div className={styles.formBlock}>
              <label className={styles.fieldLabel} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={showOnWebsite}
                  onChange={(e) => setShowOnWebsite(e.target.checked)}
                  disabled={busy}
                  style={{ marginTop: 3 }}
                />
                <span>
                  Show on public website
                  <span className={styles.fieldHint} style={{ display: "block", marginTop: 6, fontWeight: 400 }}>
                    Uncheck to upload without showing on the gallery page or home carousels (you can enable later under Manage).
                  </span>
                </span>
              </label>
            </div>

            {busy ? (
              <div className={styles.progressBlock}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${bulkPct}%` }} />
                </div>
                <span className={styles.progressLabel}>Uploading… {bulkPct}%</span>
              </div>
            ) : null}

            <div className={styles.uploadActions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={runUpload}
                disabled={!canSubmit}
              >
                Upload
              </button>
              {!hasApiToken ? (
                <p className={styles.uploadHintMuted}>Sign in with a valid API session to enable upload.</p>
              ) : !canSubmit && !busy ? (
                <p className={styles.uploadHintMuted}>
                  Select a category, add an image, and enter a description to enable Upload.
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {recent.length > 0 ? (
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Recent (this session)</h2>
              <p className={styles.panelDesc}>Last uploads from this browser session.</p>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Category</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((row) => (
                    <tr key={`${row.id}-${row.at}`}>
                      <td>
                        <span className={styles.tdName}>{row.name}</span>
                        <span className={styles.tdSize}>{formatBytes(row.size)}</span>
                      </td>
                      <td>{GALLERY_CATEGORIES.find((c) => c.id === row.category)?.label || row.category}</td>
                      <td>
                        {row.publicUrl ? (
                          <a className={styles.pathLink} href={row.publicUrl} target="_blank" rel="noopener noreferrer">
                            Open file
                          </a>
                        ) : null}
                        <code className={styles.pathCell}>{row.path}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
