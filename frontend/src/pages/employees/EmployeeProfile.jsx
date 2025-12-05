import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getCurrentEmployee } from '../../api/employeeService';
import { Card, Input } from '../../components/ui';
import { useToast } from '../../hooks/useToast';

export default function EmployeeProfile() {
    const { user } = useContext(AuthContext);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const data = await getCurrentEmployee();
                setEmployee(data);
            } catch (error) {
                toast.error('Failed to fetch employee data');
                console.error('Error fetching employee:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.username) {
            fetchEmployeeData();
        }
    }, [user?.username, toast]);

    if (loading) return <div>Loading profile...</div>;

    if (!employee) return <div>No employee data found</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            <Card className="max-w-2xl mx-auto">
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <Input value={employee.firstName} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <Input value={employee.lastName} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Input value={employee.email} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                            <Input value={employee.position || 'N/A'} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                            <Input value={employee.salary ? `$${employee.salary}` : 'N/A'} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <Input value={employee.department?.name || 'N/A'} disabled />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department Description</label>
                            <Input
                                value={employee.department?.description || 'No description available'}
                                disabled
                                className="min-h-[80px] resize-none"
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}