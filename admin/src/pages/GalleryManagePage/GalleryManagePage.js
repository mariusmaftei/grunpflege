import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchGalleryImages,
  galleryImagePublicUrl,
  patchGalleryImage,
  deleteGalleryImageFromApi,
  replaceGalleryImageFile,
} from "../../services/api";
import { GALLERY_CATEGORIES } from "../../services/galleryService";
import styles from "../AdminPage/AdminPage.module.css";

function formatBytes(n) {
  if (n == null || typeof n !== "number") return "—";
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

export default function GalleryManagePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    description: "",
    title: "",
    alt: "",
    sortOrder: 0,
    isPublished: true,
  });
  const [deleteRow, setDeleteRow] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toggleBusyId, setToggleBusyId] = useState(null);
  const replaceRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGalleryImages();
      const list = Array.isArray(data.images) ? data.images : [];
      setImages(list);
      return list;
    } catch (e) {
      setToast(e?.message || "Failed to load gallery");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const openEdit = (row) => {
    setEditRow(row);
    setForm({
      description: row.description || "",
      title: row.title || "",
      alt: row.alt || "",
      sortOrder: typeof row.sortOrder === "number" ? row.sortOrder : 0,
      isPublished: row.isPublished !== false,
    });
  };

  const saveEdit = async () => {
    if (!editRow) return;
    const desc = String(form.description).trim();
    if (!desc) {
      setToast("Description is required.");
      return;
    }
    setBusy(true);
    try {
      await patchGalleryImage(editRow.id, {
        description: desc,
        title: String(form.title).trim(),
        alt: String(form.alt).trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isPublished: Boolean(form.isPublished),
      });
      setToast("Saved.");
      setEditRow(null);
      await load();
    } catch (e) {
      setToast(e?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const runDelete = async () => {
    if (!deleteRow) return;
    setBusy(true);
    try {
      await deleteGalleryImageFromApi(deleteRow.id);
      setToast("Deleted.");
      setDeleteRow(null);
      if (editRow?.id === deleteRow.id) setEditRow(null);
      await load();
    } catch (e) {
      setToast(e?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const onPickReplace = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editRow) return;
    if (!file.type.startsWith("image/")) {
      setToast("Choose an image file.");
      return;
    }
    setBusy(true);
    try {
      await replaceGalleryImageFile(editRow.id, file);
      setToast("Image replaced (WebP).");
      const list = await load();
      const id = editRow.id;
      const updated = list.find((x) => x.id === id);
      if (updated) setEditRow(updated);
    } catch (err) {
      setToast(err?.message || "Replace failed");
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (row) => {
    if (toggleBusyId) return;
    const id = row.id;
    const on = row.isPublished !== false;
    setToggleBusyId(id);
    try {
      await patchGalleryImage(id, { isPublished: !on });
      setToast(!on ? "Shown on website." : "Hidden from website.");
      const list = await load();
      if (editRow?.id === id) {
        const u = list.find((x) => x.id === id);
        if (u) {
          setEditRow(u);
          setForm((f) => ({ ...f, isPublished: u.isPublished !== false }));
        }
      }
    } catch (e) {
      setToast(e?.message || "Update failed");
    } finally {
      setToggleBusyId(null);
    }
  };

  const labelForCategory = (id) =>
    GALLERY_CATEGORIES.find((c) => c.id === id)?.label || id;

  const thumbUrl = (row) => {
    const p = row.thumbUrlPath || row.urlPath;
    return galleryImagePublicUrl(p);
  };

  return (
    <>
      <div className={styles.mainCol}>
        <header className={styles.topBar}>
          <div>
            <p className={styles.crumb}>Admin / Gallery / Manage</p>
            <h1 className={styles.pageTitle}>Manage gallery</h1>
            <p className={styles.pageLead}>
              Edit metadata, replace files, or delete. Turn off &quot;On website&quot; to hide an image from the gallery page and home carousels without deleting it.
            </p>
          </div>
        </header>

        {toast ? (
          <div className={styles.toast} role="status">
            {toast}
          </div>
        ) : null}

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>All images</h2>
            <p className={styles.panelDesc}>Newest first (same order as the API list).</p>
          </div>

          {loading ? (
            <p className={styles.panelDesc}>Loading…</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>On website</th>
                    <th>Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <img
                          src={thumbUrl(row)}
                          alt=""
                          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                        />
                      </td>
                      <td>{labelForCategory(row.category)}</td>
                      <td>
                        <span className={styles.tdName}>{(row.description || "").slice(0, 80)}</span>
                        {(row.description || "").length > 80 ? "…" : ""}
                      </td>
                      <td>
                        <label
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: toggleBusyId ? "wait" : "pointer",
                            userSelect: "none",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={row.isPublished !== false}
                            onChange={() => togglePublished(row)}
                            disabled={toggleBusyId !== null}
                            aria-label={
                              row.isPublished !== false
                                ? "Shown on public website; uncheck to hide"
                                : "Hidden from website; check to show"
                            }
                          />
                          <span>{row.isPublished !== false ? "On" : "Off"}</span>
                        </label>
                      </td>
                      <td>
                        <span className={styles.tdSize}>{formatBytes(row.size)}</span>
                      </td>
                      <td>
                        <div className={styles.tableRowActions}>
                          <button
                            type="button"
                            className={styles.btnGhost}
                            onClick={() => openEdit(row)}
                            disabled={busy}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.btnDanger}
                            onClick={() => setDeleteRow(row)}
                            disabled={busy}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {images.length === 0 ? (
                <p className={styles.panelDesc}>No images yet. Upload from the Upload tab.</p>
              ) : null}
            </div>
          )}
        </section>
      </div>

      {editRow ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => !busy && setEditRow(null)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-gallery-title"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 520 }}
          >
            <h2 id="edit-gallery-title" className={styles.modalTitle}>
              Edit image
            </h2>
            <p className={styles.modalLead}>
              {labelForCategory(editRow.category)} · {editRow.fileName}
            </p>
            <div className={styles.modalFormStack}>
              <div className={styles.modalFormField}>
                <label className={styles.fieldLabel} htmlFor="edit-desc">
                  Description
                </label>
                <textarea
                  id="edit-desc"
                  className={styles.descTextarea}
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  disabled={busy}
                  maxLength={4000}
                />
              </div>
              <div className={styles.modalFormField}>
                <label className={styles.fieldLabel} htmlFor="edit-title">
                  Title (optional)
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className={styles.optionalNameInput}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  disabled={busy}
                  maxLength={200}
                />
              </div>
              <div className={styles.modalFormField}>
                <label className={styles.fieldLabel} htmlFor="edit-alt">
                  Alt text (optional)
                </label>
                <input
                  id="edit-alt"
                  type="text"
                  className={styles.optionalNameInput}
                  value={form.alt}
                  onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
                  disabled={busy}
                  maxLength={500}
                />
              </div>
              <div className={styles.modalFormField}>
                <label className={styles.fieldLabel} htmlFor="edit-sort">
                  Sort order
                </label>
                <input
                  id="edit-sort"
                  type="number"
                  className={styles.optionalNameInput}
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  disabled={busy}
                  style={{ maxWidth: 120 }}
                />
              </div>
              <div className={styles.modalFormField}>
                <label className={styles.fieldLabel} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                    disabled={busy}
                    style={{ marginTop: 3 }}
                  />
                  <span>
                    Show on public website
                    <span className={styles.fieldHint} style={{ display: "block", marginTop: 6, fontWeight: 400 }}>
                      When off, visitors won&apos;t see this image on the gallery page or home carousels. It stays in the admin list.
                    </span>
                  </span>
                </label>
              </div>
              <div className={styles.modalFormField}>
                <span className={styles.fieldLabel}>Replace image file</span>
                <p className={styles.fieldHint}>
                  Upload a new PNG/JPG/WebP; server converts to WebP and overwrites current files.
                </p>
                <input
                  ref={replaceRef}
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={onPickReplace}
                />
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={() => replaceRef.current?.click()}
                  disabled={busy}
                >
                  Choose new image…
                </button>
              </div>
            </div>
            <div className={styles.modalFormActions}>
              <button type="button" className={styles.btnPrimary} onClick={saveEdit} disabled={busy}>
                Save changes
              </button>
              <button type="button" className={styles.btnGhost} onClick={() => setEditRow(null)} disabled={busy}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteRow ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => !busy && setDeleteRow(null)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-labelledby="del-gallery-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="del-gallery-title" className={styles.modalTitle}>
              Delete image?
            </h2>
            <p className={styles.modalLead}>
              This removes the image from storage and the database. It cannot be undone.
            </p>
            <p className={styles.modalBody}>
              <strong>{deleteRow.fileName}</strong>
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: "1.25rem" }}>
              <button type="button" className={styles.btnDangerFill} onClick={runDelete} disabled={busy}>
                Delete
              </button>
              <button type="button" className={styles.btnGhost} onClick={() => setDeleteRow(null)} disabled={busy}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
