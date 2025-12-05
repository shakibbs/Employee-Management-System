import { useNavigate, useParams } from 'react-router-dom';
import { getEmployee, updateEmployee } from '../../api/employeeService';
import EmployeeForm from '../../components/forms/EmployeeForm';
import { useToast } from '../../hooks/useToast';
import { useState, useEffect } from 'react';

export default function EmployeeEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const empData = await getEmployee(id);
                // Convert department object to departmentId for the form
                const formattedData = {
                    ...empData,
                    departmentId: empData.department?.id || ''
                };
                setEmployee(formattedData);
            } catch (error) {
                toast.error('Failed to fetch employee.');
            }
        };
        
        fetchEmployee();
    }, [id, toast]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await updateEmployee(id, formData);
            toast.success('Employee updated successfully!');
            navigate('/employees');
        } catch (err) {
            toast.error('Failed to update employee.');
        } finally {
            setLoading(false);
        }
    };

    if (!employee) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
            <EmployeeForm initialData={employee} onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
