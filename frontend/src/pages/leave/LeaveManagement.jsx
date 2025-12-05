import { useState, useEffect } from "react";
import { getAllLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from "../../api/leaveService";
import { Card, Button } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

export default function LeaveManagement() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id of request being processed
    const toast = useToast();

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await getAllLeaveRequests();
            setRequests(data);
        } catch (err) {
            toast.error("Failed to fetch leave requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await approveLeaveRequest(id);
            toast.success("Leave approved successfully!");
            fetchRequests();
        } catch {
            toast.error("Failed to approve leave.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        setActionLoading(id);
        try {
            await rejectLeaveRequest(id);
            toast.success("Leave rejected successfully!");
            fetchRequests();
        } catch {
            toast.error("Failed to reject leave.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div>Loading leave requests...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Leave Management</h1>
            <div className="grid gap-4">
                {requests.length === 0 && <div>No leave requests found.</div>}
                {requests.map((req) => (
                    <Card key={req.id} className="flex justify-between items-center">
                        <div>
                            <div className="font-semibold">{req.employee?.firstName} {req.employee?.lastName}</div>
                            <div className="text-sm text-gray-600">
                                {req.startDate} to {req.endDate} | {req.reason}
                            </div>
                            <div className="text-sm text-gray-500">Status: {req.status}</div>
                        </div>
                        {req.status === "PENDING" && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleApprove(req.id)}
                                    disabled={actionLoading === req.id}
                                >
                                    {actionLoading === req.id ? "Processing..." : "Approve"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleReject(req.id)}
                                    disabled={actionLoading === req.id}
                                >
                                    {actionLoading === req.id ? "Processing..." : "Reject"}
                                </Button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}