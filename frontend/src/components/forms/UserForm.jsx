import { Input, Button, Select } from '../ui';
import { useState, useEffect, useCallback } from 'react';

export default function UserForm({ initialData = {}, onSubmit, loading }) {
    const [form, setForm] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        role: 'USER',
        phone: '',
        address: '',
        ...initialData,
    });

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setForm(prevForm => ({ ...prevForm, ...initialData }));
        }
    }, [JSON.stringify(initialData)]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Input label="Username (Required)" name="username" value={form.username} onChange={handleChange} required placeholder="Enter unique username" autoComplete="username" />
                    <Input label="Full Name (Required)" name="name" value={form.name} onChange={handleChange} required placeholder="Enter full name" autoComplete="name" />
                    <Input label="Email Address (Required)" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter unique email" autoComplete="email" />
                </div>
                <div className="space-y-4">
                    <Input label="Phone Number (Required)" name="phone" value={form.phone} onChange={handleChange} required placeholder="Enter phone number" autoComplete="tel" />
                    <Input label="Address (Optional)" name="address" value={form.address} onChange={handleChange} placeholder="Enter address" autoComplete="street-address" />
                    {!initialData.id && <Input label="Password (Required)" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Enter password" autoComplete="new-password" />}
                </div>
            </div>
            <Select
                label="User Role (Required)"
                name="role"
                value={form.role}
                onChange={handleChange}
                options={[
                    { label: 'Admin', value: 'ADMIN' },
                    { label: 'HR', value: 'HR' },
                    { label: 'User', value: 'USER' },
                ]}
            />
            <Button type="submit" className="mt-4" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
            </Button>
        </form>
    );
}
