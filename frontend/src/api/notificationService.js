import api from './apiClient';

// Helper function to get current user role
const getCurrentUserRole = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user?.role || 'ROLE_EMPLOYEE';
            } catch (e) {
                console.error('Error parsing user from localStorage:', e);
            }
        }
    }
    return 'ROLE_EMPLOYEE';
};

// Get all notification/email logs
export const getNotifications = async () => {
    const userRole = getCurrentUserRole();
    
    // Check for employee role (with or without ROLE_ prefix for backward compatibility)
    if (userRole === 'ROLE_EMPLOYEE' || userRole === 'EMPLOYEE') {
        // Employees use the my-notifications endpoint
        return (await api.get('/notifications/my-notifications')).data;
    } else {
        // Admin/HR can see all notifications
        return (await api.get('/notifications')).data;
    }
};

// Send email notification
export const sendNotification = async (data) => (await api.post('/notifications', data)).data;

// Get notification by ID
export const getNotification = async (id) => (await api.get(`/notifications/${id}`)).data;

// Delete notification
export const deleteNotification = async (id) => (await api.delete(`/notifications/${id}`)).data;
