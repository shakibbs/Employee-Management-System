import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { createLeaveRequest } from '../../api/leaveService';
import { Card, Input, Button, Select } from '../../components/ui';
import { useToast } from '../../hooks/useToast';

export default function LeaveRequestForm() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        reason: '',
        startDate: '',
        endDate: '',
        leaveType: 'SICK'
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await createLeaveRequest({
                reason: form.reason,
                startDate: form.startDate,
                endDate: form.endDate,
                type: form.leaveType
            });
            toast.success('Leave request submitted successfully!');
            navigate('/my-leave-requests');
        } catch (error) {
            toast.error('Failed to submit leave request');
            console.error('Error submitting leave request:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Request Leave</h1>
            <Card className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                        <Select
                            name="leaveType"
                            value={form.leaveType}
                            onChange={handleChange}
                            options={[
                                { label: 'Sick Leave', value: 'SICK' },
                                { label: 'Casual Leave', value: 'CASUAL' },
                                { label: 'Annual Leave', value: 'ANNUAL' }
                            ]}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <Input
                            name="startDate"
                            type="date"
                            value={form.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <Input
                            name="endDate"
                            type="date"
                            value={form.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter reason for leave request"
                        />
                    </div>
                    
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Submitting...' : 'Submit Leave Request'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}