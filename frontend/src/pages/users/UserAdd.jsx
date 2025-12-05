import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/userService';
import UserForm from '../../components/forms/UserForm';
import { useToast } from '../../hooks/useToast';
import { useState } from 'react';

export default function UserAdd() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await createUser(formData);
            toast.success('User created successfully!');
            navigate('/users');
        } catch {
            toast.error('Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Add User</h1>
            <UserForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
