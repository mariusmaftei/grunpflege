import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AccessDeniedPage from "./pages/AccessDeniedPage/AccessDeniedPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import AdminLayout from "./layout/AdminLayout";
import GalleryUploadPage from "./pages/GalleryUploadPage/GalleryUploadPage";
import GalleryManagePage from "./pages/GalleryManagePage/GalleryManagePage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="gallery/upload" replace />} />
          <Route path="gallery/upload" element={<GalleryUploadPage />} />
          <Route path="gallery/manage" element={<GalleryManagePage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
