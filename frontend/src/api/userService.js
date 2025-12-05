import api from './apiClient';

// Helper function to get current user role
const getCurrentUserRole = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        const userStr = localStorage.getItem('user');
        console.log('Raw user string from localStorage:', userStr); // Debug log
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                console.log('Parsed user object:', user); // Debug log
                console.log('User role:', user?.role); // Debug log
                // Use the role with ROLE_ prefix for backend compatibility
                return user?.role || 'ROLE_EMPLOYEE';
            } catch (e) {
                console.error('Error parsing user from localStorage:', e);
            }
        }
    }
    return 'ROLE_EMPLOYEE';
};

// Get all users
export const getUsers = async () => {
    try {
        const userRole = getCurrentUserRole();
        console.log('Current user role in getUsers:', userRole); // Debug log
        
        // Check for both ROLE_ADMIN and ADMIN (for backward compatibility)
        if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
            // Only Admin can see all users
            const response = await api.get('/users');
            return response.data;
        } else {
            // Non-admin users shouldn't access user list
            console.error('Access denied - User role:', userRole);
            throw new Error('Access denied: Admin privileges required');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Alias for consistency
export const getAllUsers = getUsers;

// Get single user
export const getUser = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Create new user
export const createUser = async (data) => {
    try {
        const response = await api.post('/users/create', data);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Update existing user
export const updateUser = async (id, data) => {
    try {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete user
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
