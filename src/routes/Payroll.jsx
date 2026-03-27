import NavBar from "../components/NavBar";
import { useOutletContext } from "react-router-dom";
import { RowsPerView, Pagination } from "./Employees";
import { AttendanceOverview } from "./Attendance";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import SearchBar from "../components/SearchBar";
import supabase from "../services/supabase";

const statusMap = {
  completed: "bg-green-800/40 text-green-400 border border-green-700",
  pending: "bg-yellow-800/40 text-yellow-400 border border-yellow-700",
};
const statusStyle = (status) =>
  statusMap[status?.toLowerCase()] || "bg-[#334155] text-[#9ca3af]";

// const formatCurrency = (val) =>
//   val ? `$${Number(val).toLocaleString()}` : "—";

// const salaryPerMonth = (ctc) => `$${Math.round(ctc / 12).toLocaleString()}`;

// const mockData = [
//   {
//     id: 1,
//     name: "Leasie Watson",
//     ctc: 50000,
//     deduction: null,
//     status: "Completed",
//   },
//   {
//     id: 2,
//     name: "Darlene Robertson",
//     ctc: 60000,
//     deduction: 500,
//     status: "Completed",
//   },
//   {
//     id: 3,
//     name: "Leslie Alexander",
//     ctc: 55000,
//     deduction: 300,
//     status: "Completed",
//   },
//   {
//     id: 4,
//     name: "Leasie Watson",
//     ctc: 70000,
//     deduction: null,
//     status: "Pending",
//   },
//   {
//     id: 5,
//     name: "Jacob Jones",
//     ctc: 65000,
//     deduction: null,
//     status: "Pending",
//   },
// ];

export default function Payroll() {
  const { onMenuClick } = useOutletContext();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    const fetchPayroll = async () => {
      const { data, error } = await supabase.from("payroll").select(`
        id,
        employee_id,
        monthly,
        annual,
        transaction,
        deduction,
        employees (
          name,
          department
        )
      `);

      console.log("payroll data:", data);
      console.log("payroll error:", error);

      if (!error) setPayroll(data);
      setLoading(false);
    };
    fetchPayroll();
  }, []);

  function handleInputChange(e) {
    setQuery(e.target.value);
    setCurrentPage(1);
  }

  const filtered = query
    ? payroll.filter((p) =>
        p.employees?.name.toLowerCase().includes(query.toLowerCase()),
      )
    : payroll;

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const displayed = filtered.slice(start, start + perPage);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <NavBar
        title="Payroll"
        subtitle="All Employee Payroll Records"
        fullName="Victor John"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-2.5 w-full sm:w-72">
            <SearchBar query={query} handleInputChange={handleInputChange} />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-[#7c3aed]/20">
            <Download size={16} /> Export
          </button>
        </div>

        {/* Table */}
        <AttendanceOverview
          arrayofHeader={[
            "Employee Name",
            "CTC-Annual",
            "Salary Per Month",
            "Deduction",
            "Status",
          ]}
          loading={loading}
          attendanceArr={displayed}
          emptyMessage="No payroll records found."
          renderRow={(emp) => (
            <div
              key={emp.id}
              className="grid grid-cols-5 items-center py-4 border-b border-[#334155] last:border-0 hover:bg-[#0f172a]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.employees?.name}`}
                  alt={emp.employees?.name}
                  className="w-9 h-9 rounded-full bg-[#334155]"
                />
                <p className="text-[#f9fafb] text-sm font-medium">
                  {emp.employees?.name}
                </p>
              </div>
              <p className="text-[#f9fafb] text-sm">{emp.annual}</p>
              <p className="text-[#f9fafb] text-sm">{emp.monthly}</p>
              <p className="text-[#f9fafb] text-sm">{emp.deduction}</p>
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold w-fit ${statusStyle(emp.transaction)}`}
              >
                {emp.transaction}
              </span>
            </div>
          )}
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5">
          <RowsPerView
            setPerPage={setPerPage}
            setCurrentPage={setCurrentPage}
            employee={payroll}
          />
          <Pagination
            start={start}
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
