import { useState } from "react";
import { sendNotification } from "../../api/notificationService";
import { Input, Button } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

export default function NotificationSend() {
    const [form, setForm] = useState({ to: "", subject: "", body: "" });
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendNotification(form);
            toast.success("Email sent successfully!");
            setForm({ to: "", subject: "", body: "" });
        } catch {
            toast.error("Failed to send email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Send Notification</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md mx-auto flex flex-col gap-4">
                <Input label="To (email)" name="to" value={form.to} onChange={handleChange} required />
                <Input label="Subject" name="subject" value={form.subject} onChange={handleChange} required />
                <Input label="Body" name="body" value={form.body} onChange={handleChange} required />
                <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Email"}
                </Button>
            </form>
        </div>
    );
}
