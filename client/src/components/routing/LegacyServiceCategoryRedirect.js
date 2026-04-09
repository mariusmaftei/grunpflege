import { Navigate, useLocation, useParams } from "react-router-dom";
import {
  getLocaleFromPathname,
  LEGACY_SERVICE_SLUG_REDIRECT,
  localizePath,
  PATH_LEISTUNGEN,
  pathServiceCategory,
} from "../../constants/paths";

export default function LegacyServiceCategoryRedirect() {
  const { category } = useParams();
  const { pathname } = useLocation();
  const locale = getLocaleFromPathname(pathname);
  const mapped = LEGACY_SERVICE_SLUG_REDIRECT[category];
  if (mapped) {
    return (
      <Navigate
        to={localizePath(pathServiceCategory(mapped), locale)}
        replace
      />
    );
  }
  return <Navigate to={localizePath(PATH_LEISTUNGEN, locale)} replace />;
}
