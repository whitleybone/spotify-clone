import React from "react";
import ReactDOM from "react-dom/client"; // Import the correct method for React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Create the root and render the app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);