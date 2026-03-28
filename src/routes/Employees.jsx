import {
  Eye,
  Pencil,
  Trash2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import supabase from "../services/supabase";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import AddButton from "../components/AddButton";
import { useState } from "react";
import MultiStep from "../components/MultiStepForm";
import { useEmployee } from "../context/HRContext.js";

const columns = [
  "Employee ID",
  "Employee Name",
  "Department",
  "Designation",
  "Type",
  "Status",
  "Action",
];

const statusMap = {
  contract: "bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40",
  permanent: "bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40",
};

const statusStyle = (status) =>
  statusMap[status?.toLowerCase()] || "bg-[#334155] text-[#9ca3af]";

export default function Employees() {
  const { employee, setEmployee, loading } = useEmployee();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  // prettier-ignore
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", location: "",  title: "", 
    role: "", department: "",employment_type: "", status: "",
  });

  const { onMenuClick } = useOutletContext();
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const departments = employee
    .map((emp) => emp.department)
    .filter(Boolean)
    .filter((dept, index, self) => self.indexOf(dept) === index);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleNext() {
    return setStep(2);
  }
  function handleBack() {
    return setStep(1);
  }

  async function handleDelete(id, name) {
    if (!id) return;

    const { data: profile } = await supabase
      .from("hr_profile")
      .select("name")
      .eq("name", name)
      .single();

    if (profile) {
      toast.error("Cannot delete an HR account.");
      return;
    }

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Delete this employee?</p>
          <p className="text-xs text-gray-400">This action cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const { error } = await supabase
                  .from("employees")
                  .delete()
                  .eq("id", id);

                if (error) {
                  toast.error("Failed to delete employee.");
                  return;
                }

                setEmployee((prev) => prev.filter((emp) => emp.id !== id));
                toast.success("Employee deleted successfully!");
              }}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
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

  // useEffect(() => {
  //   const fetchEmployee = async () => {
  //     const { data, error } = await supabase.from("employees").select(
  //       `
  //       id,
  //       name,
  //       role,
  //       avatar,
  //       status,
  //       title,
  //        department,
  //        employment_type
  //       `,
  //     );

  //     console.log("data:", data);
  //     console.log("error:", error);

  //     if (!error) setEmployee(data);
  //     setLoading(false);
  //   };

  //   fetchEmployee();
  // }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const data = employee.filter((emp) => {
    const matchesQuery = emp.name.toLowerCase().includes(query.toLowerCase());
    const matchesDept =
      selectedDepartments.length === 0 ||
      selectedDepartments.includes(emp.department);

    return matchesQuery && matchesDept;
  });
  const totalPages = Math.ceil(data.length / perPage);
  const start = (currentPage - 1) * perPage;
  const displayed = data.slice(start, start + perPage);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <NavBar
        title="All Employees"
        subtitle="Manage your employees"
        fullName={localStorage.getItem("hrName") || "HR MANAGER"}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-8">
        {/* Toolbar */}
        <ToolBar
          query={query}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          setShowFilter={setShowFilter}
          setShowTool={true}
        />

        {/* // Table grid */}
        <TableGrid
          loading={loading}
          displayed={displayed}
          onHandleTrash={handleDelete}
        />

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

      {showFilter && (
        <FilterModal
          onClose={() => setShowFilter(false)}
          onApply={() => {
            setCurrentPage(1);
            setShowFilter(false);
          }}
          departments={departments}
          selectedDepartments={selectedDepartments}
          setSelectedDepartments={setSelectedDepartments}
        />
      )}
    </div>
  );
}

export function ToolBar({
  query,
  handleInputChange,
  setShowModal,
  setShowFilter,
  setShowTool = false,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
      {/* Search */}
      <div className="flex items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-2.5 w-full sm:w-72">
        <SearchBar query={query} handleInputChange={handleInputChange} />
      </div>

      {/* Actions */}

      {setShowTool && (
        <div className="flex items-center gap-3">
          <AddButton
            buttonText={"Add New Employee"}
            onClick={() => setShowModal(true)}
          />
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#334155] text-[#f9fafb] text-sm rounded-lg hover:border-[#7c3aed] transition-all"
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>
      )}
    </div>
  );
}

function TableGrid({ loading, displayed, onHandleTrash }) {
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
                  <button
                    onClick={() => onHandleTrash(emp.id, emp.name)}
                    className="text-[#9ca3af] hover:text-red-400 transition-colors"
                  >
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

export function RowsPerView({ setPerPage, setCurrentPage }) {
  const options = [5, 10, 20, 50, 100];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[#9ca3af] text-sm">Showing</span>
      <select
        onChange={(e) => {
          setPerPage(Number(e.target.value));
          if (setCurrentPage) setCurrentPage(1);
        }}
        className="bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-1.5 text-[#f9fafb] text-sm outline-none cursor-pointer hover:border-[#7c3aed] transition-all"
      >
        {options.map((n) => (
          <option key={n} value={n} className="bg-[#1e293b]">
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Pagination({
  start,
  perPage,
  employee,
  setCurrentPage,
  totalPages,
  currentPage,
}) {
  const total = employee?.length || 0;

  if (total === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[#9ca3af] text-sm">
        {total > 0 ? (
          <>
            Showing {start + 1} to {Math.min(start + perPage, total)} of {total}{" "}
            members
          </>
        ) : (
          "Loading records..."
        )}
      </span>

      <div className="flex items-center gap-1">
        {/* 2. Disable Previous if on Page 1 */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#334155] text-[#9ca3af] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
        </button>

        {/* 3. Page Numbers */}
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

        {/* 4. Disable Next if on Last Page */}
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#334155] text-[#9ca3af] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function FilterModal({
  onClose,
  onApply,
  departments = [],
  selectedDepartments,
  setSelectedDepartments,
}) {
  function handleDeptChange(dept) {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  }
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 w-full max-w-md shadow-2xl">
          {/* Title */}
          <p className="text-[#f9fafb] text-lg font-bold mb-5">Filter</p>

          {/* Department */}
          <p className="text-[#f9fafb] text-sm font-semibold mb-3">
            Department
          </p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {departments.map((dept) => (
              <label
                key={dept}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  value={dept}
                  checked={selectedDepartments.includes(dept)}
                  onChange={() => handleDeptChange(dept)}
                  className="w-4 h-4 accent-[#7c3aed] cursor-pointer"
                />
                <span className="text-[#f9fafb] text-sm group-hover:text-[#a78bfa] transition-colors">
                  {dept}
                </span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#334155] text-[#f9fafb] text-sm font-semibold hover:border-[#7c3aed] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onApply}
              className="flex-1 py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold transition-all shadow-lg shadow-[#7c3aed]/20"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
