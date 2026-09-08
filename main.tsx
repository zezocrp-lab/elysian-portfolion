import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

/* Production ships prerendered markup, so adopt it rather than throwing it away
   and painting the same thing again. The dev server serves an empty root. */
if (root.firstChild) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
