import { useState, useEffect } from "react";
import { MapPin, Briefcase, Plus, Search } from "lucide-react";
import NavBar from "../components/NavBar";
import { useOutletContext } from "react-router-dom";
import supabase from "../services/supabase";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  active: {
    dot: "bg-red-500",
    label: "Active Jobs",
    border: "border-[#334155]",
  },
  inactive: {
    dot: "bg-yellow-500",
    label: "Inactive Jobs",
    border: "border-[#334155]",
  },
  completed: {
    dot: "bg-green-500",
    label: "Completed Jobs",
    border: "border-[#334155]",
  },
};

export default function Jobs() {
  const { onMenuClick } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    salary: "",
    salary_period: "",
    status: "",
    tags: "",
    description: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, title, department, tags, location, salary, salary_period, status, posted_date, applicants, description, hired_candidate, completed_date",
        )
        .order("posted_date", { ascending: false });

      if (!error) setJobs(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async () => {
    const { error } = await supabase.from("jobs").insert([
      {
        id: `job_${Date.now()}`,
        title: formData.title,
        department: formData.department,
        location: formData.location,
        salary: Number(formData.salary),
        salary_period: formData.salary_period,
        status: formData.status,
        tags: formData.tags.split(",").map((t) => t.trim()),
        description: formData.description,
        posted_date: new Date().toISOString().split("T")[0],
        applicants: 0,
      },
    ]);

    if (error) {
      toast.error("Failed to add job.");
      return;
    }

    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("posted_date", { ascending: false });
    if (data) setJobs(data);

    toast.success("Job added successfully!");
    setShowModal(false);
    setFormData({
      title: "",
      department: "",
      location: "",
      salary: "",
      salary_period: "",
      status: "",
      tags: "",
      description: "",
    });
  };

  const filtered = query
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(query.toLowerCase()) ||
          j.department.toLowerCase().includes(query.toLowerCase()),
      )
    : jobs;

  const grouped = {
    active: filtered.filter((j) => j.status === "active"),
    inactive: filtered.filter((j) => j.status === "inactive"),
    completed: filtered.filter((j) => j.status === "completed"),
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <NavBar
        title="Jobs"
        subtitle="Manage job listings"
        fullName="Victor John"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-2.5 w-full sm:w-80">
            <Search size={16} className="text-[#9ca3af] shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-[#f9fafb] text-sm outline-none w-full placeholder-[#9ca3af]"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-[#7c3aed]/20"
          >
            <Plus size={16} /> Add New Job
          </button>
        </div>

        {/* Columns */}
        {loading ? (
          <p className="text-[#9ca3af] text-sm text-center py-12">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(grouped).map(([status, jobList]) => (
              <JobColumn key={status} status={status} jobs={jobList} />
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <AddJobModal
          onClose={() => setShowModal(false)}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function JobColumn({ status, jobs }) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 flex flex-col gap-4">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-3 h-3 rounded-full ${config.dot}`} />
        <p className="text-[#f9fafb] text-base font-bold">{config.label}</p>
      </div>

      {/* Job Cards */}
      {jobs.length === 0 ? (
        <p className="text-[#9ca3af] text-sm text-center py-6">
          No jobs found.
        </p>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 flex flex-col gap-3 hover:border-[#7c3aed]/50 transition-all">
      {/* Title Row */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#1e293b] border border-[#334155] flex items-center justify-center shrink-0">
          <Briefcase size={18} className="text-[#9ca3af]" />
        </div>
        <div>
          <p className="text-[#f9fafb] text-sm font-bold">{job.title}</p>
          <p className="text-[#9ca3af] text-xs mt-0.5">{job.department}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {job.tags?.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-[#7c3aed] text-white text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Location + Salary */}
      <div className="flex items-center justify-between pt-1 border-t border-[#334155]">
        <div className="flex items-center gap-1.5 text-[#9ca3af] text-xs">
          <MapPin size={13} />
          {job.location}
        </div>
        <p className="text-[#f9fafb] text-sm font-bold">
          ${job.salary?.toLocaleString()}
          <span className="text-[#9ca3af] font-normal text-xs">
            /{job.salary_period}
          </span>
        </p>
      </div>
    </div>
  );
}

function AddJobModal({ onClose, formData, onChange, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-lg mx-4 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#334155]">
          <div>
            <h2 className="text-[#f9fafb] text-lg font-semibold">
              Add New Job
            </h2>
            <p className="text-[#9ca3af] text-sm mt-0.5">
              Fill in the job details
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-4 space-y-4">
          <Field
            label="Job Title"
            name="title"
            type="text"
            placeholder="e.g. Frontend Developer"
            value={formData.title}
            onChange={onChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Department"
              name="department"
              value={formData.department}
              onChange={onChange}
              options={[
                "Design",
                "Engineering",
                "Marketing",
                "Sales",
                "Product",
                "Finance",
                "IT",
                "Analytics",
                "Operations",
                "Support",
                "Full Stack",
                "Data Science",
                "Infrastructure",
                "Quality Assurance",
                "Cybersecurity",
                "HR",
                "Digital Marketing",
                "Customer Support",
                "Documentation",
              ]}
            />
            <Field
              label="Location"
              name="location"
              type="text"
              placeholder="e.g. New York, USA"
              value={formData.location}
              onChange={onChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Salary"
              name="salary"
              type="number"
              placeholder="e.g. 50000"
              value={formData.salary}
              onChange={onChange}
            />
            <SelectField
              label="Salary Period"
              name="salary_period"
              value={formData.salary_period}
              onChange={onChange}
              options={["Month", "Year"]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={onChange}
              options={["active", "inactive"]}
            />
            <Field
              label="Tags (comma separated)"
              name="tags"
              type="text"
              placeholder="e.g. Remote, Full Time"
              value={formData.tags}
              onChange={onChange}
            />
          </div>

          <Field
            label="Description"
            name="description"
            type="text"
            placeholder="Brief job description"
            value={formData.description}
            onChange={onChange}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#334155]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-[#9ca3af] border border-[#334155] rounded-lg hover:text-[#f9fafb] hover:border-[#9ca3af] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2.5 text-sm font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg transition-all shadow-lg shadow-[#7c3aed]/30"
          >
            Add Job
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#f9fafb] text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-[#f9fafb] placeholder-[#475569] text-sm outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#f9fafb] text-sm font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-[#f9fafb] text-sm outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all cursor-pointer"
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
