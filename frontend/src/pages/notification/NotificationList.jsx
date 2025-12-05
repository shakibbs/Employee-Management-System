import { useState, useEffect } from "react";
import { getNotifications, deleteNotification } from "../../api/notificationService";
import { Card, Button } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

export default function NotificationList() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id being deleted
    const toast = useToast();


    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch {
            toast.error("Failed to fetch notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleDelete = async (id) => {
        setActionLoading(id);
        try {
            await deleteNotification(id);
            toast.success("Notification deleted successfully!");
            fetchNotifications();
        } catch {
            toast.error("Failed to delete notification.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div>Loading notifications...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Sent Notifications</h1>
            <div className="grid gap-4">
                {notifications.length === 0 && <div>No notifications found.</div>}
                {notifications.map((n) => (
                    <Card key={n.id} className="flex justify-between items-center">
                        <div>
                            <div className="font-semibold">{n.subject}</div>
                            <div className="text-sm text-gray-600">{n.body}</div>
                            <div className="text-sm text-gray-500">Sent to: {n.to}</div>
                            <div className="text-sm text-gray-400">Date: {n.date}</div>
                        </div>
                        <Button
                            variant="destructive"
                            size="small"
                            onClick={() => handleDelete(n.id)}
                            disabled={actionLoading === n.id}
                        >
                            {actionLoading === n.id ? "Deleting..." : "Delete"}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
