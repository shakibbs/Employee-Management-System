export default function Toast({ message, type = "info" }) {
    const bgColor =
        type === "success" ? "bg-green-500" :
            type === "error" ? "bg-red-500" :
                "bg-blue-500";

    return (
        <div className={`px-4 py-2 rounded shadow text-white ${bgColor}`}>
            {message}
        </div>
    );
}
