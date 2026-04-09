import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";

export default function ServicesLayout() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Outlet />
    </Suspense>
  );
}
