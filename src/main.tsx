import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "@/layouts/app-layout";
import LandingPage from "@/pages/landing-page";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<AppLayout />}>
          <Route
            index
            element={<LandingPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
