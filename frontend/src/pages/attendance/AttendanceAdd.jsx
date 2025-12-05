import { useNavigate } from 'react-router-dom';
import { markAttendance } from '../../api/attendanceService';
import AttendanceForm from '../../components/forms/AttendanceForm';
import { useToast } from '../../hooks/useToast';
import { useState } from 'react';

export default function AttendanceAdd() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await markAttendance(formData);
            toast.success('Attendance marked successfully!');
            navigate('/attendance');
        } catch {
            toast.error('Failed to mark attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Add Attendance</h1>
            <AttendanceForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
