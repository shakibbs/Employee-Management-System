import { useState, useEffect } from "react";
export default function useFetch(apiCall, deps = []) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await apiCall();
                setData(res);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, deps);

    return { data, loading, error };
}
