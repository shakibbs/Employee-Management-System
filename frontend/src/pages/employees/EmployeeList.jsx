import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../../api/employeeService";
import { Button, Card } from "../../components/ui";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const { user } = useContext(AuthContext);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await getEmployees();
            // Handle case where data might not be an array
            const employeesArray = Array.isArray(data) ? data : [];
            setEmployees(employeesArray);
        } catch {
            toast.error("Failed to fetch employees.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this employee?")) return;
        try {
            await deleteEmployee(id);
            toast.success("Employee deleted successfully!");
            fetchEmployees();
        } catch (err) {
            toast.error("Failed to delete employee!");
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-semibold">Employees</h1>
                <Button onClick={() => navigate("/employees/add")} size="small" className="text-xs py-0.5 px-2 h-7">Add Employee</Button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {employees.map((emp) => (
                        <Card key={emp.id} className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold">{emp.firstName} {emp.lastName}</div>
                                <div className="text-sm text-gray-600">{emp.email}</div>
                                <div className="text-sm text-gray-500">Department: {emp.department?.name || 'N/A'}</div>
                                <div className="text-sm text-gray-500">Position: {emp.position || 'N/A'}</div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => navigate(`/employees/${emp.id}/edit`)}>Edit</Button>
                                {(user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN') && (
                                    <Button variant="destructive" onClick={() => handleDelete(emp.id)}>Delete</Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
