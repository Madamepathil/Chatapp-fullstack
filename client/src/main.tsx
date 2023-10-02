import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ChatContextProvider from "./context/chatContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChatContextProvider>
    <App />
  </ChatContextProvider>
);
