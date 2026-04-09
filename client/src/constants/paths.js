export const PATH_LEISTUNGEN = "/leistungen";
export const PATH_KONTAKT = "/kontakt";
export const PATH_GALERIE = "/galerie";

export function pathServiceCategory(slug) {
  return `${PATH_LEISTUNGEN}/${slug}`;
}

export function getLocaleFromPathname(pathname) {
  if (!pathname) return "de";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "de";
}

export function localizePath(path, locale) {
  const p =
    !path || path === "/"
      ? "/"
      : path.startsWith("/")
        ? path
        : `/${path}`;
  if (locale === "en") {
    if (p === "/") return "/en";
    return `/en${p}`;
  }
  return p;
}

export function switchPathLocale(pathname, targetLocale) {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const bare = isEn ? pathname.slice(3) || "/" : pathname;
  if (targetLocale === "en") {
    if (bare === "/") return "/en";
    return `/en${bare === "/" ? "" : bare}`;
  }
  return bare;
}

export const LEGACY_SERVICE_SLUG_REDIRECT = {
  "lawn-care": "rasenpflege",
  "tree-trimming": "baumpflege",
  planting: "pflanzung",
  irrigation: "bewaesserung",
  landscaping: "landschaftsbau",
  "seasonal-cleaning": "saisonpflege",
};
