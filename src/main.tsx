import { Provider } from "./components/ui/provider";
import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
);
