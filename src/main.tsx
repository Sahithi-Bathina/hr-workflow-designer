import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";
// IMPORTANT: Correct package name for styles
import "@xyflow/react/dist/style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);