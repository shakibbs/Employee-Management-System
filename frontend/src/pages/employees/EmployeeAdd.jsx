import { useNavigate } from 'react-router-dom';
import { createEmployee } from '../../api/employeeService';
import EmployeeForm from '../../components/forms/EmployeeForm';
import { useToast } from '../../hooks/useToast';
import { useState } from 'react';

export default function EmployeeAdd() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await createEmployee(formData);
            toast.success('Employee created successfully!');
            navigate('/employees');
        } catch (err) {
            toast.error('Failed to create employee.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Add Employee</h1>
            <EmployeeForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
