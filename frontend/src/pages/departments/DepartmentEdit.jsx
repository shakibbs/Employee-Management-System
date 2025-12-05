import { useNavigate, useParams } from 'react-router-dom';
import { getDepartment, updateDepartment } from '../../api/departmentService';
import DepartmentForm from '../../components/forms/DepartmentForm';
import { useToast } from '../../hooks/useToast';
import { useState, useEffect } from 'react';

export default function DepartmentEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const data = await getDepartment(id);
                setDepartment(data);
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch department.';
                const errorType = error.response?.data?.type;
                
                if (errorType === 'NOT_FOUND') {
                    toast.error(errorMessage);
                } else {
                    toast.error('Failed to fetch department. Please try again.');
                }
            }
        };
        
        fetchDepartment();
    }, [id, toast]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await updateDepartment(id, formData);
            toast.success('Department updated successfully!');
            navigate('/departments');
        } catch (error) {
            // Handle specific error messages from backend
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update department.';
            const errorType = error.response?.data?.type;
            
            if (errorType === 'VALIDATION_ERROR') {
                toast.error(errorMessage);
            } else if (errorType === 'NOT_FOUND') {
                toast.error(errorMessage);
            } else {
                toast.error('Failed to update department. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!department) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit Department</h1>
            <DepartmentForm initialData={department} onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
