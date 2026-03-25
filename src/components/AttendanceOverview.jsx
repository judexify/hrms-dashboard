import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

export default function AttendanceOverview() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select(
          `
          id,
          check_in,
          status,
          department,
          employees (
            name
          )
        `,
        )
        .order("check_in", { ascending: true })
        .limit(7);

      if (!error) setRecords(data);
      setLoading(false);
    };
    fetchAttendance();
  }, []);

  const statusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "on time":
        return "bg-green-800/40 text-green-400 border border-green-700";
      case "late":
        return "bg-orange-800/40 text-orange-400 border border-orange-700";
      case "absent":
        return "bg-red-800/40 text-red-400 border border-red-700";
      default:
        return "bg-[#334155] text-[#9ca3af]";
    }
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 md:p-6 mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[#f9fafb] text-base font-bold">
          Attendance Overview
        </p>
        <button
          onClick={() => navigate("/attendance")}
          className="px-4 py-2 text-sm text-[#f9fafb] border border-[#334155] rounded-lg hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
        >
          View
        </button>
      </div>

      {/* Scrollable table wrapper on mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Table Header */}
          <div className="grid grid-cols-4 pb-3 border-b border-[#334155]">
            {["Employee Name", "Department", "Check In Time", "Status"].map(
              (h) => (
                <p key={h} className="text-[#9ca3af] text-sm">
                  {h}
                </p>
              ),
            )}
          </div>

          {/* Rows */}
          {loading ? (
            <p className="text-[#9ca3af] text-sm py-6 text-center">
              Loading...
            </p>
          ) : records.length === 0 ? (
            <p className="text-[#9ca3af] text-sm py-6 text-center">
              No attendance records found.
            </p>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="grid grid-cols-4 items-center py-4 border-b border-[#334155] last:border-0"
              >
                <div className="flex flex-col items-start gap-1">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.employees?.name}`}
                    alt={record.employees?.name}
                    className="w-10 h-10 rounded-full object-cover bg-[#334155]"
                  />
                  <p className="text-[#f9fafb] text-sm font-medium">
                    {record.employees?.name}
                  </p>
                </div>
                <p className="text-[#f9fafb] text-sm">{record.department}</p>
                <p className="text-[#f9fafb] text-sm">
                  {record.check_in || "—"}
                </p>
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold w-fit ${statusStyle(record.status)}`}
                >
                  {record.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
