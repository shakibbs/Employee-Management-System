import api from './apiClient';

// Create leave request
export const createLeaveRequest = async (data) => {
    try {
        const response = await api.post('/leaves/request', data);
        return response.data;
    } catch (error) {
        console.error('Error creating leave request:', error);
        throw error;
    }
};

// Get employee's own leave requests
export const getMyLeaveRequests = async () => {
    try {
        const response = await api.get('/leaves/my-requests');
        return response.data;
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        throw error;
    }
};

// Get all leave requests (for Admin/HR)
export const getAllLeaveRequests = async () => {
    try {
        const response = await api.get('/leaves');
        return response.data;
    } catch (error) {
        console.error('Error fetching all leave requests:', error);
        throw error;
    }
};

// Approve leave request (for Admin/HR)
export const approveLeaveRequest = async (id) => {
    try {
        const response = await api.put(`/leaves/approve/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error approving leave request:', error);
        throw error;
    }
};

// Reject leave request (for Admin/HR)
export const rejectLeaveRequest = async (id) => {
    try {
        const response = await api.put(`/leaves/reject/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting leave request:', error);
        throw error;
    }
};

// Get pending leave requests (for Admin/HR)
export const getPendingLeaveRequests = async () => {
    try {
        const response = await api.get('/leaves/pending');
        return response.data;
    } catch (error) {
        console.error('Error fetching pending leave requests:', error);
        throw error;
    }
};

// Alias for getPendingLeaveRequests to match attendanceService
export const getLeaveRequests = getPendingLeaveRequests;