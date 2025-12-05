import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./hooks/useToast";
import "./styles/globals.css"; // Tailwind CSS

// Get the root container
const container = document.getElementById("root");

// Create a root
const root = ReactDOM.createRoot(container);

// Render the app
root.render(
    <React.StrictMode>
        <AuthProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </AuthProvider>
    </React.StrictMode>
);
