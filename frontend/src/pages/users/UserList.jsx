import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/userService";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            // Handle case where data might not be an array
            const usersArray = Array.isArray(data) ? data : [];
            setUsers(usersArray);
        } catch {
            toast.error("Failed to fetch users.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteUser(id);
            toast.success("User deleted successfully!");
            fetchUsers();
        } catch {
            toast.error("Failed to delete user.");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <button
                onClick={() => navigate("/users/add")}
                className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
            >
                Add User
            </button>
            <table className="w-full border-collapse border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">#</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u, idx) => (
                    <tr key={u.id}>
                        <td className="border p-2">{idx + 1}</td>
                        <td className="border p-2">{u.username}</td>
                        <td className="border p-2">{u.email}</td>
                        <td className="border p-2 space-x-2">
                            <button
                                onClick={() => navigate(`/users/${u.id}/edit`)}
                                className="bg-yellow-400 text-white px-2 py-1 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(u.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
