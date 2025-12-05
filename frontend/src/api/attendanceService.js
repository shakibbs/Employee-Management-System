import api from './apiClient';

// Get all attendance records
export const getAttendanceRecords = async () => (await api.get('/attendance')).data;

// Get attendance by user
export const getAttendanceByUser = async (userId) => (await api.get(`/attendance/user/${userId}`)).data;

// Mark attendance
export const markAttendance = async (data) => (await api.post('/attendance', data)).data;

// Mark attendance for current user
export const markAttendanceForCurrentUser = async (type) => (await api.post('/attendance/mark', { type })).data;

// Get leave requests
export const getLeaveRequests = async () => (await api.get('/leaves/pending')).data;

// Approve leave request
export const approveLeave = async (leaveId) => (await api.put(`/leaves/${leaveId}/approve`)).data;

// Reject leave request
export const rejectLeave = async (leaveId) => (await api.put(`/leaves/${leaveId}/reject`)).data;

// Get attendance by employee username
export const getAttendanceByEmployee = async (username) => {
    try {
        const response = await api.get(`/attendance/employee/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance by employee:', error);
        throw error;
    }
};

// Get current employee's attendance
export const getMyAttendance = async () => {
    try {
        const response = await api.get('/attendance/my-attendance');
        return response.data;
    } catch (error) {
        console.error('Error fetching my attendance:', error);
        // Add more detailed error information
        if (error.response?.status === 403) {
            console.error('Access forbidden - checking authentication status');
            console.error('User token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing');
            console.error('Error details:', error.response.data);
        }
        throw error;
    }
};
