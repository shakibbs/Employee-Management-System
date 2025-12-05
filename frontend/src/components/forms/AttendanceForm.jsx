import { Input, Button, Select } from '../ui';
import { useState, useEffect, useCallback } from 'react';

export default function AttendanceForm({ initialData = {}, onSubmit, loading }) {
    const [form, setForm] = useState({
        employeeId: '',
        checkIn: '',
        checkOut: '',
        ...initialData,
    });

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setForm(prevForm => ({ ...prevForm, ...initialData }));
        }
    }, [JSON.stringify(initialData)]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    label="Employee ID (Required)"
                    name="employeeId"
                    type="number"
                    value={form.employeeId}
                    onChange={handleChange}
                    required
                    placeholder="Enter employee ID"
                    autoComplete="off"
                />
                <Input
                    label="Check In Time (Required)"
                    name="checkIn"
                    type="datetime-local"
                    value={form.checkIn}
                    onChange={handleChange}
                    required
                    placeholder="Select check-in time"
                    autoComplete="off"
                />
                <Input
                    label="Check Out Time (Optional)"
                    name="checkOut"
                    type="datetime-local"
                    value={form.checkOut}
                    onChange={handleChange}
                    placeholder="Select check-out time"
                    autoComplete="off"
                />
            </div>
            <div className="flex justify-end pt-6">
                <Button
                    type="submit"
                    className="px-8 py-3 text-lg font-semibold"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Attendance'}
                </Button>
            </div>
        </form>
    );
}
