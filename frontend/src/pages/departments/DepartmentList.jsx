import { useEffect, useState } from "react";
import { getAllDepartments, deleteDepartment } from "../../api/departmentService";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";

export default function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const data = await getAllDepartments();
            // Handle case where data might not be an array
            const departmentsArray = Array.isArray(data) ? data : [];
            setDepartments(departmentsArray);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error("Failed to fetch departments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        setDeletingId(id);
        try {
            await deleteDepartment(id);
            toast.success("Department deleted successfully!");
            fetchDepartments();
        } catch (error) {
            toast.error(error.message || "Failed to delete department.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading departments...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Departments</h1>
            <button
                onClick={() => navigate("/departments/add")}
                className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
            >
                Add Department
            </button>
            
            {departments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                    <p className="text-gray-500 text-sm mb-6">Get started by creating your first department</p>
                    <button
                        onClick={() => navigate("/departments/add")}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                    >
                        Create Department
                    </button>
                </div>
            ) : (
                <table className="w-full border-collapse border">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">#</th>
                        <th className="border p-2">Department Name</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {departments.map((d, idx) => (
                        <tr key={d.id}>
                            <td className="border p-2">{idx + 1}</td>
                            <td className="border p-2">{d.name}</td>
                            <td className="border p-2 space-x-2">
                                <button
                                    onClick={() => navigate(`/departments/${d.id}/edit`)}
                                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(d.id)}
                                    disabled={deletingId === d.id}
                                    className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                                >
                                    {deletingId === d.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
