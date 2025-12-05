export default function Button({ children, className, variant = "primary", size = "medium", ...props }) {
    const baseClasses = "rounded-md hover:bg-indigo-700 transition duration-200 font-medium";
    
    const variantClasses = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
    };
    
    const sizeClasses = {
        small: "px-3 py-1.5 text-sm",
        medium: "px-6 py-3",
        large: "px-8 py-4 text-lg"
    };
    
    const widthClass = size === "small" ? "" : "w-full";
    
    return (
        <button
            {...props}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        >
            {children}
        </button>
    );
}
