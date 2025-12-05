import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { loginUser } from "../../api/authService";

export default function Login() {
    const { login, logout } = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginUser(form.username, form.password);
            if (response?.token) {
                const userData = login(response.token);
                
                // Check if the user has ADMIN or HR role (use originalRole from token)
                if (userData?.originalRole === 'ADMIN' || userData?.originalRole === 'HR') {
                    toast.success("Login successful!");
                    setTimeout(() => {
                        navigate("/");
                    }, 500);
                } else {
                    toast.error("This login is for administrators only. Please use the employee login.");
                    // Logout the user immediately
                    logout();
                }
            } else {
                toast.error("Login failed: No token received");
            }
        } catch (err) {
            toast.error(err.message || "Invalid credentials!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full">
                <div className="bg-white p-6 rounded shadow mb-4">
                    <h1 className="text-2xl font-bold text-center mb-4 text-indigo-600">Admin Portal</h1>
                    <p className="text-center text-gray-600 mb-6">Login to access the administrative dashboard</p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                        >
                            {loading ? "Logging in..." : "Login as Administrator"}
                        </button>
                    </form>
                </div>
                
                <div className="bg-white p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-600">
                        Are you an employee?{" "}
                        <button
                            onClick={() => navigate("/employee-login")}
                            className="text-indigo-600 hover:underline font-medium"
                        >
                            Employee Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
