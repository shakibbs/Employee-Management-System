import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY || "auth_token";

// Safely access localStorage
const getLocalStorage = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage;
    }
    return null;
};

// Parse JWT token
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null;
    }
};

// Check if token is expired
const isTokenExpired = (token) => {
    try {
        const decoded = parseJwt(token);
        if (!decoded || !decoded.exp) return true;
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth on mount
    useEffect(() => {
        const storage = getLocalStorage();
        if (storage) {
            const token = storage.getItem(TOKEN_KEY);
            if (token && !isTokenExpired(token)) {
                const decodedToken = parseJwt(token);
                if (decodedToken) {
                    let role = decodedToken?.role || 'EMPLOYEE';
                    // Backend sends role without ROLE_ prefix, but frontend expects it for consistency
                    // Store both formats for compatibility
                    const roleWithPrefix = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
                    const userData = {
                        token,
                        username: decodedToken?.sub,
                        role: roleWithPrefix, // Store with ROLE_ prefix for frontend checks
                        originalRole: role, // Store original role from backend
                        id: decodedToken?.userId || decodedToken?.id,
                        email: decodedToken?.email
                    };
                    setUser(userData);
                    setIsAuthenticated(true);
                    // Also store user data in localStorage for services that need it
                    storage.setItem('user', JSON.stringify(userData));
                } else {
                    storage.removeItem(TOKEN_KEY);
                    storage.removeItem('user');
                }
            } else if (token && isTokenExpired(token)) {
                storage.removeItem(TOKEN_KEY);
                storage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Auto logout if token expires
    useEffect(() => {
        if (!user?.token) return;

        const interval = setInterval(() => {
            if (isTokenExpired(user.token)) {
                logout();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [user]);

    const login = useCallback((token) => {
        const storage = getLocalStorage();
        if (storage) storage.setItem(TOKEN_KEY, token);

        const decodedToken = parseJwt(token);
        if (decodedToken) {
            let role = decodedToken?.role || 'EMPLOYEE';
            // Backend sends role without ROLE_ prefix, but frontend expects it for consistency
            // Store both formats for compatibility
            const roleWithPrefix = role.startsWith('ROLE_') ? role : `ROLE_${role}`;

            const userData = {
                token,
                username: decodedToken?.sub,
                role: roleWithPrefix, // Store with ROLE_ prefix for frontend checks
                originalRole: role, // Store original role from backend
                id: decodedToken?.userId || decodedToken?.id,
                email: decodedToken?.email
            };
            setUser(userData);
            setIsAuthenticated(true);
            
            // Also store user data in localStorage for services that need it
            storage.setItem('user', JSON.stringify(userData));
            
            return userData;
        } else {
            throw new Error('Invalid token format');
        }
    }, []);

    const logout = useCallback(() => {
        const storage = getLocalStorage();
        if (storage) {
            storage.removeItem(TOKEN_KEY);
            storage.removeItem('user');
        }
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const hasRole = useCallback((role) => user?.role === role, [user]);
    const hasAnyRole = useCallback((roles) => roles.includes(user?.role), [user]);
    const updateUser = useCallback((userData) => {
        if (user) setUser(prev => ({ ...prev, ...userData }));
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            logout,
            hasRole,
            hasAnyRole,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}
