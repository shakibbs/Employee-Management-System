import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser } from '../../api/userService';
import UserForm from '../../components/forms/UserForm';
import { useToast } from '../../hooks/useToast';
import { useState, useEffect } from 'react';

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    useEffect(() => {
        getUser(id)
            .then(setUser)
            .catch(() => toast.error('Failed to fetch user.'));
    }, [id]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await updateUser(id, formData);
            toast.success('User updated successfully!');
            navigate('/users');
        } catch {
            toast.error('Failed to update user.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit User</h1>
            <UserForm initialData={user} onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
