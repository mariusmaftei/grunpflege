import { useLocation } from "react-router-dom";
import {
  getLocaleFromPathname,
  localizePath,
} from "../constants/paths";

export function useLocalizedPath(path) {
  const { pathname } = useLocation();
  const locale = getLocaleFromPathname(pathname);
  return localizePath(path, locale);
}
