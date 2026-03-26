import {
  Eye,
  Pencil,
  Trash2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import AddButton from "../components/AddButton";
import { useEffect, useState } from "react";
import supabase from "../services/supabase";
import MultiStep from "../components/MultiStepForm";
import { toast } from "react-hot-toast";

const columns = [
  "Employee ID",
  "Employee Name",
  "Department",
  "Designation",
  "Type",
  "Status",
  "Action",
];
import { useOutletContext } from "react-router-dom";

const statusMap = {
  contract: "bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40",
  permanent: "bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40",
};

const statusStyle = (status) =>
  statusMap[status?.toLowerCase()] || "bg-[#334155] text-[#9ca3af]";

export default function Employees() {
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    role: "",
    department: "",
    employment_type: "",
    status: "",
  });
  const { onMenuClick } = useOutletContext();

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleNext() {
    return setStep(2);
  }
  function handleBack() {
    return setStep(1);
  }
  async function handleSubmit() {
    const { error } = await supabase.from("employees").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        title: formData.title,
        role: formData.role,
        department: formData.department,
        employment_type: formData.employment_type,
        status: formData.status,
      },
    ]);

    if (error) {
      toast.error("Failed to add employee. Please try again.");
      console.error("Error adding employee:", error);
      return;
    }

    // refresh the table
    const { data } = await supabase.from("employees").select(`
    id, name, role, avatar, status, title, department, employment_type
  `);
    if (data) setEmployee(data);
    toast.success("Employee added successfully!");

    // close modal and reset
    handleCloseModalAndReset(setShowModal, setStep, setFormData);
  }

  function handleCloseModalAndReset(setShowModal, setStep, setFormData) {
    setShowModal(false);
    setStep(1);
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      role: "",
      department: "",
      employment_type: "",
      status: "",
    });
  }

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
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-8">
        {/* Toolbar */}
        <ToolBar
          query={query}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
        />

        {/* {TableGrid(loading, displayed)} */}
        <TableGrid loading={loading} displayed={displayed} />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5">
          {/* Rows per page */}
          <RowsPerView
            setPerPage={setPerPage}
            setCurrentPage={setCurrentPage}
            employee={employee}
          />

          {/* Page info + controls */}
          <Pagination
            start={start}
            perPage={perPage}
            employee={employee}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </div>

      {showModal && (
        <MultiStep
          onClose={() => setShowModal(false)}
          step={step}
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function ToolBar({ query, handleInputChange, setShowModal }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
      {/* Search */}
      <div className="flex items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-2.5 w-full sm:w-72">
        <SearchBar query={query} handleInputChange={handleInputChange} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <AddButton
          buttonText={"Add New Employee"}
          onClick={() => setShowModal(true)}
        />
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#334155] text-[#f9fafb] text-sm rounded-lg hover:border-[#7c3aed] transition-all">
          <SlidersHorizontal size={16} />
          Filter
        </button>
      </div>
    </div>
  );
}

function TableGrid({ loading, displayed }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[750px]">
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
              No employees found.
            </p>
          ) : (
            displayed.map((emp, i) => (
              <div
                key={emp.id}
                className={`grid grid-cols-[1fr_2fr_1.5fr_2fr_1fr_1fr_1fr] px-6 py-4 items-center border-b border-[#334155] last:border-0 transition-colors hover:bg-[#0f172a]/40 ${i % 2 === 1 ? "bg-[#0f172a]/20" : ""}`}
              >
                <p className="text-[#f9fafb] text-sm">{emp.id}</p>
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
                <p className="text-[#f9fafb] text-sm">{emp.department}</p>
                <p className="text-[#f9fafb] text-sm">{emp.title}</p>
                <p className="text-[#f9fafb] text-sm">{emp.employment_type}</p>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold w-fit ${statusStyle(emp.status)}`}
                >
                  {emp.status}
                </span>
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
      </div>
    </div>
  );
}

function RowsPerView({ setPerPage, setCurrentPage, employee }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#9ca3af] text-sm">Showing</span>
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
    </div>
  );
}

function Pagination({
  start,
  perPage,
  employee,
  setCurrentPage,
  totalPages,
  currentPage,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[#9ca3af] text-sm">
        Showing {start + 1} to {Math.min(start + perPage, employee.length)} of{" "}
        {employee.length} members
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#334155] text-[#9ca3af] hover:text-white transition-all"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#334155] text-[#9ca3af] hover:text-white transition-all"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
