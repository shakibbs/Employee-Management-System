import { useState, useEffect } from "react";
import { getAttendanceRecords } from "../../api/attendanceService";
import { Card, Button, Input, Select } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

export default function AttendanceList() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState(""); // present/absent/leave
    const [searchName, setSearchName] = useState("");
    const toast = useToast();


    const fetchRecords = async () => {
        setLoading(true);
        try {
            const data = await getAttendanceRecords();
            // Handle case where data might not be an array
            const recordsArray = Array.isArray(data) ? data : [];
            setRecords(recordsArray);
        } catch (err) {
            toast.error("Failed to fetch attendance records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const filteredRecords = records.filter((r) => {
        const matchesStatus = filterStatus ? r.status === filterStatus : true;
        const matchesName = searchName
            ? r.userName.toLowerCase().includes(searchName.toLowerCase())
            : true;
        return matchesStatus && matchesName;
    });

    if (loading) return <div>Loading attendance records...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Attendance Records</h1>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <Input
                    placeholder="Search by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <Select
                    label="Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                        { label: "All", value: "" },
                        { label: "Present", value: "present" },
                        { label: "Absent", value: "absent" },
                        { label: "Leave", value: "leave" },
                    ]}
                />
            </div>

            <div className="grid gap-4">
                {filteredRecords.length === 0 && <div>No attendance records found.</div>}

                {filteredRecords.map((record) => (
                    <Card key={record.id} className="flex justify-between items-center">
                        <div>
                            <div className="font-semibold">{record.userName}</div>
                            <div className="text-sm text-gray-600">Date: {record.date}</div>
                            <div className="text-sm text-gray-500">Status: {record.status}</div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
