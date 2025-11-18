import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);

const MOBILE_WIDTH = 414;
const MOBILE_HEIGHT = 896;

root.render(
  <React.StrictMode>
    <div
      className="relative overflow-y-auto shadow-2xl bg-white"
      style={{
        width: "100%",
        height: "100%",
        maxWidth: `${MOBILE_WIDTH}px`,
        maxHeight: `${MOBILE_HEIGHT}px`,
        border: "1px solid #e2e8f0",
        borderRadius: "1rem",
      }}
    >
      <App />
    </div>
  </React.StrictMode>
);