import api from './apiClient';

// Helper function to get current user role
const getCurrentUserRole = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // Use the role with ROLE_ prefix for backend compatibility
                return user?.role || 'ROLE_EMPLOYEE';
            } catch (e) {
                console.error('Error parsing user from localStorage:', e);
            }
        }
    }
    return 'ROLE_EMPLOYEE';
};

export const getEmployees = async () => {
    try {
        const userRole = getCurrentUserRole();
        
        // Check for employee role (with or without ROLE_ prefix for backward compatibility)
        if (userRole === 'ROLE_EMPLOYEE' || userRole === 'EMPLOYEE') {
            // Employees can only see their own data
            const response = await api.get('/employees/me');
            return [response.data]; // Return as array for consistency
        } else {
            // Admin/HR can see all employees
            const response = await api.get('/employees');
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

export const getEmployee = async (id) => {
    try {
        const response = await api.get(`/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employee:', error);
        throw error;
    }
};

// Alias for consistency
export const getAllEmployees = getEmployees;

export const createEmployee = async (data) => {
    try {
        const response = await api.post('/employees', data);
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

export const updateEmployee = async (id, data) => {
    try {
        const response = await api.put(`/employees/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

export const deleteEmployee = async (id) => {
    try {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};

// Get employee by username
export const getEmployeeByUsername = async (username) => {
    try {
        const response = await api.get(`/employees/username/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employee by username:', error);
        throw error;
    }
};

// Get current employee's profile
export const getCurrentEmployee = async () => {
    try {
        const response = await api.get('/employees/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching current employee:', error);
        throw error;
    }
};
