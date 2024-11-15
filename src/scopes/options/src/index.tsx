import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.less";


chrome.runtime.onMessage.addListener(message => {
  if(message.command){
    window.command = message.command;
  }
})

const Root = document.createElement("div");
document.body.append(Root);

ReactDOM.createRoot(Root).render(<App />);
