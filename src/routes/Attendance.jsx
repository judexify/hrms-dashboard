import NavBar from "../components/NavBar";
import { useOutletContext, useNavigate } from "react-router-dom";
import { ToolBar, RowsPerView, Pagination } from "./Employees";
import { useState, useEffect } from "react";
import supabase from "../services/supabase";

export default function Attendance() {
  const { onMenuClick } = useOutletContext();
  const [employeeAtt, setEmployeeAtt] = useState([]);
  const [perPage, setPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

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
          { count: "exact" },
        )
        .order("check_in", { ascending: true });

      console.log("data:", data);
      console.log("error :", error);

      if (!error) setEmployeeAtt(data);

      setLoading(false);
    };

    fetchAttendance();
  }, []);

  function handleInputChange(e) {
    setQuery(e.target.value);
    setCurrentPage(1);
  }

  console.log(employeeAtt);

  const filtered = query
    ? employeeAtt.filter((att) =>
        att.employees?.name?.toLowerCase().includes(query.toLowerCase()),
      )
    : employeeAtt;

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const attendanceArr = filtered.slice(start, start + perPage);

  return (
    <div>
      <NavBar
        title="Attendance"
        subtitle="All Employee Attendance"
        fullName="Jude Oluwadunsi"
        onMenuClick={onMenuClick}
      />
      <div className="p-4 md:p-8">
        <ToolBar query={query} handleInputChange={handleInputChange} />
        <AttendanceOverview
          arrayofHeader={[
            "Employee Name",
            "Department",
            "Check In Time",
            "Status",
          ]}
          loading={loading}
          attendanceArr={attendanceArr}
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5">
          <RowsPerView
            setPerPage={setPerPage}
            setCurrentPage={setCurrentPage}
          />
          <Pagination
            start={(currentPage - 1) * perPage}
            perPage={perPage}
            employee={{ length: filtered.length }}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}

const statusMap = {
  "on time": "bg-green-800/40 text-green-400 border border-green-700",
  late: "bg-orange-800/40 text-orange-400 border border-orange-700",
  absent: "bg-red-800/40 text-red-400 border border-red-700",
};

const statusStyle = (status) =>
  statusMap[status?.toLowerCase()] || "bg-[#334155] text-[#9ca3af]";

export function AttendanceOverview({
  arrayofHeader,
  showViewButton = false,
  loading,
  attendanceArr,
  ShowTableHeader = false,
  renderRow,
  emptyMessage,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 md:p-6 mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {ShowTableHeader && (
          <p className="text-[#f9fafb] text-base font-bold">
            Attendance Overview
          </p>
        )}
        {showViewButton && (
          <button
            onClick={() => navigate("/attendance")}
            className="px-4 py-2 text-sm text-[#f9fafb] border border-[#334155] rounded-lg hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
          >
            View
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Table Header */}
          <div
            className={`grid grid-cols-${arrayofHeader.length} pb-3 border-b border-[#334155]`}
          >
            {arrayofHeader.map((h) => (
              <p key={h} className="text-[#9ca3af] text-sm">
                {h}
              </p>
            ))}
          </div>
          <Rows
            loading={loading}
            attendanceArr={attendanceArr}
            renderRow={renderRow}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>
    </div>
  );
}

function Rows({
  loading,
  attendanceArr,
  renderRow,
  emptyMessage = "No attendance records found.",
}) {
  return (
    <>
      {loading ? (
        <p className="text-[#9ca3af] text-sm py-6 text-center">Loading...</p>
      ) : attendanceArr.length === 0 ? (
        <p className="text-[#9ca3af] text-sm py-6 text-center">
          {emptyMessage}
        </p>
      ) : (
        attendanceArr.map((att) =>
          renderRow ? (
            renderRow(att)
          ) : (
            <div
              key={att.id}
              className="grid grid-cols-4 items-center py-4 border-b border-[#334155] last:border-0"
            >
              <div className="flex flex-col items-start gap-1">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${att.employees?.name}`}
                  alt={att.employees?.name}
                  className="w-10 h-10 rounded-full object-cover bg-[#334155]"
                />
                <p className="text-[#f9fafb] text-sm font-medium">
                  {att.employees?.name}
                </p>
              </div>
              <p className="text-[#f9fafb] text-sm">{att.department}</p>
              <p className="text-[#f9fafb] text-sm">{att.check_in || "—"}</p>
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold w-fit ${statusStyle(att.status)}`}
              >
                {att.status}
              </span>
            </div>
          ),
        )
      )}
    </>
  );
}
