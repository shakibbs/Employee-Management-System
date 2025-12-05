import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = "info", duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    };

    const toast = {
        success: (msg) => showToast(msg, "success"),
        error: (msg) => showToast(msg, "error"),
        info: (msg) => showToast(msg, "info"),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast container */}
            <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`px-4 py-2 rounded shadow text-white ${
                            t.type === "success"
                                ? "bg-green-500"
                                : t.type === "error"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                        }`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
