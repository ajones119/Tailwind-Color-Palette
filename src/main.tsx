import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ColorsProvider } from "./contexts/ColorsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorsProvider>
      <App />
    </ColorsProvider>
  </StrictMode>,
);
