import api from "./apiClient";

const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY || "auth_token";

export const loginUser = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    // Response is an object with token property
    const token = res.data.token || res.data;
    if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(TOKEN_KEY, token);
    }
    // Return the full response data so login.jsx can check response.token
    return res.data;
};


export const logoutUser = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(TOKEN_KEY);
    }
};
