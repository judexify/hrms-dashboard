import NavBar from "../components/NavBar";
import { useOutletContext } from "react-router-dom";
import { RowsPerView, Pagination } from "./Employees";
import { useState, useContext } from "react";
import SearchBar from "../components/SearchBar";
import { HRContext } from "../context/HRContext.js";

const statusMap = {
  selected: "bg-green-800/40 text-green-400 border border-green-700",
  "in progress": "bg-yellow-800/40 text-yellow-400 border border-yellow-700",
  rejected: "bg-red-800/40 text-red-400 border border-red-700",
};
const statusStyle = (status) =>
  statusMap[status?.toLowerCase()] || "bg-[#334155] text-[#9ca3af]";

const columns = [
  "Candidate Name",
  "Applied For",
  "Applied Date",
  "Email Address",
  "Mobile Number",
  "CV",
  "Status",
];

export default function Candidates() {
  const { onMenuClick } = useOutletContext();
  const { candidates, loading } = useContext(HRContext);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  function handleInputChange(e) {
    setQuery(e.target.value);
    setCurrentPage(1);
  }

  const filtered = query
    ? candidates.filter(
        (c) =>
          c.name?.toLowerCase().includes(query.toLowerCase()) ||
          c.applied_for?.toLowerCase().includes(query.toLowerCase()),
      )
    : candidates;

  console.log(filtered);
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const displayed = filtered.slice(start, start + perPage);
  console.log(displayed);
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <NavBar
        title="Candidates"
        subtitle="All Job Applicants"
        fullName="Victor John"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-8">
        {/* Search */}
        <div className="mb-6">
          <div className="flex items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-2.5 w-full sm:w-72">
            <SearchBar query={query} handleInputChange={handleInputChange} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1.5fr_1.2fr_2fr_1.5fr_1fr_1fr] px-6 py-4 border-b border-[#334155]">
                {columns.map((col) => (
                  <p key={col} className="text-[#9ca3af] text-sm">
                    {col}
                  </p>
                ))}
              </div>

              {/* Rows */}
              {loading ? (
                <p className="text-[#9ca3af] text-sm py-6 text-center">
                  Loading...
                </p>
              ) : displayed.length === 0 ? (
                <p className="text-[#9ca3af] text-sm py-6 text-center">
                  No candidates found.
                </p>
              ) : (
                displayed.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-[2fr_1.5fr_1.2fr_2fr_1.5fr_0.8fr_1fr] px-6 py-4 items-center border-b border-[#334155] last:border-0 hover:bg-[#0f172a]/40 transition-colors"
                  >
                    {/* Name + Avatar */}
                    <div className="flex items-center justify-center">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
                        alt={c.name}
                        className="w-9 h-9 rounded-full bg-[#334155] shrink-0"
                      />
                      <p className="text-[#f9fafb] text-sm font-medium">
                        {c.name}
                      </p>
                    </div>

                    {/* Applied For */}
                    <p className="text-[#f9fafb] text-sm">{c.applied_for}</p>

                    {/* Applied Date */}
                    <p className="text-[#f9fafb] text-sm">
                      {c.applied_date
                        ? new Date(c.applied_date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </p>

                    {/* Email */}
                    <p className="text-[#f9fafb] text-sm truncate">{c.email}</p>

                    {/* Mobile */}
                    <p className="text-[#f9fafb] text-sm">{c.mobile}</p>

                    {/* CV */}
                    <div>
                      {c.CV ? (
                        <a
                          href={c.CV}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 text-xs font-semibold rounded-lg border border-[#7c3aed]/40 text-[#a78bfa] hover:bg-[#7c3aed]/20 transition-all whitespace-nowrap w-fit sm:px-3 sm:py-1.5"
                        >
                          Check CV
                        </a>
                      ) : (
                        <span className="text-[#9ca3af] text-xs">—</span>
                      )}
                    </div>

                    {/* Status */}
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold w-fit ${statusStyle(c.status)}`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5">
          <RowsPerView
            setPerPage={setPerPage}
            setCurrentPage={setCurrentPage}
            employee={candidates}
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
