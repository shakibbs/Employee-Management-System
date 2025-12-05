export default function Input({ className, ...props }) {
    return (
        <input
            {...props}
            className={`w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
        />
    );
}
