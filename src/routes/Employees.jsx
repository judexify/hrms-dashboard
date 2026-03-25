import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import AddButton from "../components/AddButton";
import { useEffect, useState } from "react";
import supabase from "../services/supabase";

const columns = [
  "Employee ID",
  "Employee Name",
  "Department",
  "Designation",
  "Type",
  "Status",
  "Action",
];

// const mockData = [
//   {
//     id: "789123456",
//     name: "Charlie Davis",
//     department: "Sales",
//     designation: "Sales Coordinator",
//     type: "Office",
//     status: "Contract",
//   },
//   {
//     id: "456789123",
//     name: "Cody Fisher",
//     department: "Design",
//     designation: "Sr. UI/UX Designer",
//     type: "Office",
//     status: "Permanent",
//   },
//   {
//     id: "345321231",
//     name: "Darlene Robertson",
//     department: "Design",
//     designation: "Lead UI/UX Designer",
//     type: "Office",
//     status: "Permanent",
//   },
//   {
//     id: "091233412",
//     name: "Devon Lane",
//     department: "Design",
//     designation: "UI/UX Designer",
//     type: "Remote",
//     status: "Permanent",
//   },
//   {
//     id: "654321789",
//     name: "Diana Wilson",
//     department: "Sales",
//     designation: "Sales Analyst",
//     type: "Remote",
//     status: "Permanent",
//   },
// ];

const statusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "contract":
      return "bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40";
    case "permanent":
      return "bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40";
    default:
      return "bg-[#334155] text-[#9ca3af]";
  }
};

export default function Employees() {
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      const { data, error } = await supabase.from("employees").select(
        `
        id,
        name,
        role,
        avatar,
        status,
        title,
         department,
         employment_type
        `,
      );

      console.log("data:", data);
      console.log("error:", error);

      if (!error) setEmployee(data);
      setLoading(false);
    };

    fetchEmployee();
  }, []);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };
  const filteredEmployees = employee.filter((emp) =>
    emp.name.toLowerCase().includes(query.toLowerCase()),
  );
  const data = query ? filteredEmployees : employee;
  const totalPages = Math.ceil(data.length / perPage);
  const start = (currentPage - 1) * perPage;
  const displayed = data.slice(start, start + perPage);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <NavBar
        title="All Employees"
        subtitle="Manage your employees"
        fullName="Victor John"
      />

      <div className="p-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          {/* Search */}
          <div className="flex items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-2.5 w-72">
            <SearchBar query={query} handleInputChange={handleInputChange} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <AddButton buttonText={"Add New Employee"} />
            <button className="flex items-center gap-2 px-4 py-2.5 border border-[#334155] text-[#f9fafb] text-sm rounded-lg hover:border-[#7c3aed] transition-all">
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_1.5fr_2fr_1fr_1fr_1fr] px-6 py-4 border-b border-[#334155]">
            {columns.map((col) => (
              <p key={col} className="text-[#7c3aed] text-sm font-medium">
                {col}
              </p>
            ))}
          </div>

          {/* Table Rows */}
          {loading ? (
            <p className="text-[#9ca3af] text-sm py-6 text-center">
              Loading...
            </p>
          ) : displayed.length === 0 ? (
            <p className="text-[#9ca3af] text-sm py-6 text-center">
              No attendance records found.
            </p>
          ) : (
            displayed.map((emp, i) => (
              <div
                key={emp.id}
                className={`grid grid-cols-[1fr_2fr_1.5fr_2fr_1fr_1fr_1fr] px-6 py-4 items-center border-b border-[#334155] last:border-0 transition-colors hover:bg-[#0f172a]/40 ${i % 2 === 1 ? "bg-[#0f172a]/20" : ""}`}
              >
                {/* ID */}
                <p className="text-[#f9fafb] text-sm">{emp.id}</p>

                {/* Name + Avatar */}
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`}
                    alt={emp.name}
                    className="w-9 h-9 rounded-full bg-[#334155]"
                  />
                  <p className="text-[#f9fafb] text-sm font-medium">
                    {emp.name}
                  </p>
                </div>

                {/* Department */}
                <p className="text-[#f9fafb] text-sm">{emp.department}</p>

                {/* Designation */}
                <p className="text-[#f9fafb] text-sm">{emp.title}</p>

                {/* Type */}
                <p className="text-[#f9fafb] text-sm">{emp.employment_type}</p>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold w-fit ${statusStyle(emp.status)}`}
                >
                  {emp.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="text-[#9ca3af] hover:text-[#7c3aed] transition-colors">
                    <Eye size={17} />
                  </button>
                  <button className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors">
                    <Pencil size={17} />
                  </button>
                  <button className="text-[#9ca3af] hover:text-red-400 transition-colors">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-[#9ca3af] text-sm">Showing</span>
            {/* <div className="flex items-center gap-1 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-1.5 cursor-pointer"> */}
            <select
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-1.5 text-[#f9fafb] text-sm outline-none cursor-pointer"
            >
              {Array.from(
                { length: Math.ceil(employee.length / 5) },
                (_, i) => (i + 1) * 5,
              ).map((n) => (
                <option key={n} value={n} className="bg-[#1e293b]">
                  {n}
                </option>
              ))}
            </select>
            {/* </div> */}
          </div>

          {/* Page info + controls */}
          <div className="flex items-center gap-3">
            <span className="text-[#9ca3af] text-sm">
              Showing {start + 1} to{" "}
              {Math.min(start + perPage, employee.length)} of {employee.length}{" "}
              members
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#334155] text-[#9ca3af] hover:text-white transition-all"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      page === currentPage
                        ? "bg-[#7c3aed] text-white border border-[#7c3aed]"
                        : "border border-[#334155] text-[#9ca3af] hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#334155] text-[#9ca3af] hover:text-white transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
