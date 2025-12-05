import { Input, Button } from '../ui';
import { useState, useEffect, useCallback } from 'react';

export default function DepartmentForm({ initialData = {}, onSubmit, loading }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        ...initialData,
    });

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setForm(prevForm => ({ ...prevForm, ...initialData }));
        }
    }, [initialData.id, initialData.name, initialData.description]);

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
            <div className="space-y-6">
                <Input
                    label="Department Name (Required)"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter unique department name"
                    className="text-lg"
                    autoComplete="organization"
                />
                <Input
                    label="Department Description (Optional)"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter department description"
                    className="text-lg"
                    autoComplete="organization"
                />
                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        className="px-8 py-3 text-lg font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Department'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
