import { useNavigate } from 'react-router-dom';
import { createDepartment } from '../../api/departmentService';
import DepartmentForm from '../../components/forms/DepartmentForm';
import { useToast } from '../../hooks/useToast';
import { useState } from 'react';

export default function DepartmentAdd() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await createDepartment(formData);
            toast.success('Department created successfully!');
            navigate('/departments');
        } catch (error) {
            // Handle specific error messages from backend
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create department.';
            const errorType = error.response?.data?.type;
            
            if (errorType === 'VALIDATION_ERROR') {
                toast.error(errorMessage);
            } else {
                toast.error('Failed to create department. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Add Department</h1>
            <DepartmentForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
