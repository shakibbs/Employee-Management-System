import api from './apiClient';

// Get all departments
export const getDepartments = async () => {
    try {
        const response = await api.get('/departments');
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

// Get single department
export const getDepartment = async (id) => {
    try {
        const response = await api.get(`/departments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching department:', error);
        throw error;
    }
};

// Create new department
export const createDepartment = async (data) => {
    try {
        const response = await api.post('/departments', data);
        return response.data;
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

// Update department
export const updateDepartment = async (id, data) => {
    try {
        const response = await api.put(`/departments/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating department:', error);
        throw error;
    }
};

// Delete department
export const deleteDepartment = async (id) => {
    try {
        const response = await api.delete(`/departments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
};

// Alias for consistency
export const getAllDepartments = getDepartments;
