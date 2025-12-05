import { useState, useEffect } from 'react';
import { getMyLeaveRequests } from '../../api/leaveService';
import { Card, Button } from '../../components/ui';
import { useToast } from '../../hooks/useToast';

export default function MyLeaveRequests() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const data = await getMyLeaveRequests();
                setLeaveRequests(data);
            } catch (error) {
                toast.error('Failed to fetch leave requests');
                console.error('Error fetching leave requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveRequests();
    }, [toast]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div>Loading leave requests...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Leave Requests</h1>
            <div className="grid gap-4">
                {leaveRequests.length === 0 ? (
                    <Card className="p-6">
                        <div className="text-center text-gray-500">No leave requests found</div>
                    </Card>
                ) : (
                    leaveRequests.map((request) => (
                        <Card key={request.id} className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg">{request.leaveType}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div>Start Date: {new Date(request.startDate).toLocaleDateString()}</div>
                                        <div>End Date: {new Date(request.endDate).toLocaleDateString()}</div>
                                        <div>Days: {Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)) + 1}</div>
                                        <div>Reason: {request.reason}</div>
                                        {request.approvedBy && (
                                            <div>Approved by: {request.approvedBy}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}