import { Input, Button, Select } from '../ui';
import { useState, useEffect, useCallback } from 'react';
import { getDepartments, getDepartment } from '../../api/departmentService';

export default function EmployeeForm({ initialData = {}, onSubmit, loading }) {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        salary: '',
        departmentId: '',
        password: '',
        role: 'EMPLOYEE',
        ...initialData,
    });
    
    const [departments, setDepartments] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setForm(prevForm => ({ ...prevForm, ...initialData }));
        }
    }, [JSON.stringify(initialData)]);

    useEffect(() => {
        const fetchDepartments = async () => {
            setLoadingDepartments(true);
            try {
                const data = await getDepartments();
                setDepartments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching departments:', error);
                // Don't show toast for this as it might be expected in some cases
                setDepartments([]);
            } finally {
                setLoadingDepartments(false);
            }
        };
        
        fetchDepartments();
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate department if selected
        if (form.departmentId) {
            try {
                await getDepartment(form.departmentId);
            } catch (error) {
                alert('Selected department not found. Please select a valid department.');
                return;
            }
        }
        
        // Convert departmentId to department object for backend
        const submitData = {
            ...form,
            department: form.departmentId ? { id: parseInt(form.departmentId) } : null
        };
        // Remove departmentId as it's not needed in the final submission
        delete submitData.departmentId;
        
        // For updates, if password is empty, remove it from submission
        // This prevents accidentally clearing the password
        if (initialData.id && (!submitData.password || submitData.password.trim() === '')) {
            delete submitData.password;
        }
        
        // For new employees, ensure password is provided
        if (!initialData.id && (!submitData.password || submitData.password.trim() === '')) {
            alert('Password is required for new employees');
            return;
        }
        
        onSubmit(submitData);
    };

    return (
        <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Input label="First Name (Required)" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="Enter first name" autoComplete="given-name" />
                    <Input label="Last Name (Required)" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Enter last name" autoComplete="family-name" />
                    <Input label="Email Address (Required)" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter unique email" autoComplete="email" />
                </div>
                <div className="space-y-4">
                    <Input label="Position (Optional)" name="position" value={form.position} onChange={handleChange} placeholder="Enter job position" autoComplete="organization-title" />
                    <Input label="Salary (Optional)" name="salary" type="number" step="0.01" value={form.salary} onChange={handleChange} placeholder="Enter salary amount" autoComplete="off" />
                    {!initialData.id ? (
                        <Input label="Password (Required)" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Enter password" autoComplete="new-password" />
                    ) : (
                        <Input label="Password (Optional - leave blank to keep current)" name="password" type="password" value={form.password || ''} onChange={handleChange} placeholder="Enter new password or leave blank" autoComplete="new-password" />
                    )}
                    {!initialData.id ? (
                        <Select
                            label="Role (Required)"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            options={[
                                { label: 'Employee', value: 'EMPLOYEE' },
                                { label: 'HR', value: 'HR' },
                                { label: 'Admin', value: 'ADMIN' }
                            ]}
                            placeholder="Select role"
                        />
                    ) : (
                        <Select
                            label="Role (Required)"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            options={[
                                { label: 'Employee', value: 'EMPLOYEE' },
                                { label: 'HR', value: 'HR' },
                                { label: 'Admin', value: 'ADMIN' }
                            ]}
                            placeholder="Select role"
                        />
                    )}
                    <Select
                        label="Department (Optional)"
                        name="departmentId"
                        value={form.departmentId}
                        onChange={handleChange}
                        loading={loadingDepartments ? 'true' : undefined}
                        options={departments.map(dept => ({
                            label: dept.name,
                            value: dept.id.toString()
                        }))}
                        placeholder="Select department"
                    />
                </div>
            </div>
            <Button type="submit" size="small" className="mt-4" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
            </Button>
        </form>
    );
}
