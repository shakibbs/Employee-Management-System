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

// Get dashboard data
export const getDashboardData = async () => {
    try {
        const userRole = getCurrentUserRole();
        
        // Check for both ROLE_ADMIN/ROLE_HR and ADMIN/HR (for backward compatibility)
        if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN' ||
            userRole === 'ROLE_HR' || userRole === 'HR') {
            // Admin/HR can see full dashboard analytics
            const response = await api.get('/analytics/dashboard');
            return response.data;
        } else {
            // Employees get limited dashboard data
            // Return basic structure that the frontend can handle
            return {
                employeeCount: 1, // Only themselves
                departmentCount: 1, // Their department
                attendanceStats: { present: 0, absent: 0, leave: 0 },
                recentEmployees: [],
                recentAttendance: []
            };
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};

// Get employee demographics
export const getEmployeeDemographics = async () => {
    try {
        const userRole = getCurrentUserRole();
        
        // Check for both ROLE_ADMIN/ROLE_HR and ADMIN/HR (for backward compatibility)
        if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN' ||
            userRole === 'ROLE_HR' || userRole === 'HR') {
            const response = await api.get('/analytics/departments');
            return response.data;
        } else {
            // Employees don't have access to demographics
            throw new Error('Access denied: Admin/HR privileges required');
        }
    } catch (error) {
        console.error('Error fetching employee demographics:', error);
        throw error;
    }
};

// Get attendance trends
export const getAttendanceTrends = async () => {
    try {
        const userRole = getCurrentUserRole();
        
        // Check for both ROLE_ADMIN/ROLE_HR and ADMIN/HR (for backward compatibility)
        if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN' ||
            userRole === 'ROLE_HR' || userRole === 'HR') {
            const response = await api.get('/analytics/attendance');
            return response.data;
        } else {
            // Employees don't have access to attendance trends
            throw new Error('Access denied: Admin/HR privileges required');
        }
    } catch (error) {
        console.error('Error fetching attendance trends:', error);
        throw error;
    }
};

// Get payroll summary
export const getPayrollSummary = async () => {
    try {
        const userRole = getCurrentUserRole();
        
        // Check for both ROLE_ADMIN/ROLE_HR and ADMIN/HR (for backward compatibility)
        if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN' ||
            userRole === 'ROLE_HR' || userRole === 'HR') {
            const response = await api.get('/analytics/payroll');
            return response.data;
        } else {
            // Employees don't have access to payroll data
            throw new Error('Access denied: Admin/HR privileges required');
        }
    } catch (error) {
        console.error('Error fetching payroll summary:', error);
        throw error;
    }
};