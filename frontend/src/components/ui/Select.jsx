export default function Select({ className, options = [], ...props }) {
    return (
        <select
            {...props}
            className={`w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
        >
            <option value="">{props.placeholder || 'Select an option'}</option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
