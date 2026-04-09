import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocaleFromPathname } from "../../constants/paths";

export default function I18nLocaleSync() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const lng = getLocaleFromPathname(pathname);
    if (i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
    try {
      localStorage.setItem("language", lng);
    } catch {
      /* ignore */
    }
  }, [pathname, i18n]);

  return null;
}
