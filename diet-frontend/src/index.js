import React from "react";
import ReactDOM from "react-dom/client";  // Note the use of "react-dom/client"
import App from "./App";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // Get root element
root.render(
    <App />
);
