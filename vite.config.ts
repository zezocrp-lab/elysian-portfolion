import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

/* The page runs on Preact through preact/compat. The source is still written
   as React and imports from "react" — the aliases below and in the preset make
   that resolve to compat, so no component has to know. Swapping back to React
   is a change to this file and tsconfig.json, not to the components.
   The preset covers react, react-dom, react-dom/test-utils and
   react/jsx-runtime, but not the client entry, which main.tsx uses. */
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  resolve: {
    alias: {
      "react-dom/client": "preact/compat/client",
    },
  },
});
