import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import language files
import commonDE from "./locales/de/common.json";
import homeDE from "./locales/de/home.json";
import galleryDE from "./locales/de/gallery.json";
import contactDE from "./locales/de/contact.json";
import servicesDE from "./locales/de/services.json";
import commonEN from "./locales/en/common.json";
import homeEN from "./locales/en/home.json";
import galleryEN from "./locales/en/gallery.json";
import contactEN from "./locales/en/contact.json";
import servicesEN from "./locales/en/services.json";

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "de";
  const pathname = window.location.pathname;
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "de";
};

// Initialize i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      de: {
        common: commonDE,
        home: homeDE,
        gallery: galleryDE,
        contact: contactDE,
        services: servicesDE,
      },
      en: {
        common: commonEN,
        home: homeEN,
        gallery: galleryEN,
        contact: contactEN,
        services: servicesEN,
      },
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    ns: ["common", "home", "gallery", "contact", "services"],
    defaultNS: "common",
  });

export default i18n;
