import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./global.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { LoginInfoProvider } from "./context/LoginInfoContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginInfoProvider>
      <App />
    </LoginInfoProvider>
  </BrowserRouter>
);
