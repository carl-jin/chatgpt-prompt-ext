import { App } from "./index/App";
import React from "react";
import ReactDOM from "react-dom/client";

const Root = document.createElement("div");
document.body.append(Root);

ReactDOM.createRoot(Root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
