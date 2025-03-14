import { routes } from "@/config/routes";

import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const router = createBrowserRouter(routes);

createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
