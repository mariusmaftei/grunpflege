import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./components/layout/RootLayout/RootLayout";
import Home from "./pages/home";
import "./styles/global.css";
import LoadingSpinner from "./components/UI/LoadingSpinner/LoadingSpinner";
import ServicesLayout from "./pages/services/ServicesLayout";
import LegacyServiceCategoryRedirect from "./components/routing/LegacyServiceCategoryRedirect";
import { PATH_GALERIE, PATH_KONTAKT, PATH_LEISTUNGEN } from "./constants/paths";

const GalleryPage = lazy(() => import("./pages/gallery/gallery"));
const ContactPage = lazy(() => import("./pages/contact/contact"));
const ServicesPage = lazy(() => import("./pages/services/services"));
const ServiceCategoryPage = lazy(
  () => import("./pages/services/service-category"),
);

const servicesNested = [
  { index: true, element: <ServicesPage /> },
  { path: ":category", element: <ServiceCategoryPage /> },
];

const galleryElement = (
  <Suspense fallback={<LoadingSpinner />}>
    <GalleryPage />
  </Suspense>
);

const contactElement = (
  <Suspense fallback={<LoadingSpinner />}>
    <ContactPage />
  </Suspense>
);

function localeRouteGroup(isEn) {
  const toLeistungen = isEn ? `/en${PATH_LEISTUNGEN}` : PATH_LEISTUNGEN;
  const toGalerie = isEn ? `/en${PATH_GALERIE}` : PATH_GALERIE;
  const toKontakt = isEn ? `/en${PATH_KONTAKT}` : PATH_KONTAKT;

  return [
    { index: true, element: <Home /> },
    {
      path: "leistungen",
      element: <ServicesLayout />,
      children: servicesNested,
    },
    { path: "galerie", element: galleryElement },
    { path: "kontakt", element: contactElement },
    { path: "services", element: <Navigate to={toLeistungen} replace /> },
    {
      path: "services/:category",
      element: <LegacyServiceCategoryRedirect />,
    },
    { path: "gallery", element: <Navigate to={toGalerie} replace /> },
    { path: "contact", element: <Navigate to={toKontakt} replace /> },
  ];
}

const route = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      ...localeRouteGroup(false),
      { path: "en", children: localeRouteGroup(true) },
    ],
  },
]);

function App() {
  return <RouterProvider router={route} />;
}

export default App;
