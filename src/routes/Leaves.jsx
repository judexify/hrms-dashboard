import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import NavBar from "../components/NavBar";
import supabase from "../services/supabase";

const statusDot = {
  approved: "bg-green-500",
  pending: "bg-yellow-500",
  rejected: "bg-red-500",
};

const SORT_OPTIONS = ["Newest First", "Oldest First"];

export default function Notifications() {
  const { onMenuClick } = useOutletContext();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("Newest First");
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    const fetchLeaves = async () => {
      const { data, error } = await supabase
        .from("leaves")
        .select(
          `
          id,
          type,
          start_date,
          end_date,
          days,
          status,
          employee,
          department,
          employees (
            name,
            avatar,
            department
          )
        `,
        )
        .order("start_date", { ascending: sort === "Oldest First" });

      if (!error) setLeaves(data);
      setLoading(false);
    };
    fetchLeaves();
  }, [sort]);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <NavBar
        title="Notifications"
        subtitle="Leave requests and updates"
        fullName="Victor John"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-8">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#334155]">
            <p className="text-[#f9fafb] text-base font-bold">Notifications</p>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort((p) => !p)}
                className="flex items-center gap-2 px-4 py-2 border border-[#334155] rounded-lg text-[#f9fafb] text-sm hover:border-[#7c3aed] transition-all"
              >
                {sort} <ChevronDown size={14} />
              </button>
              {showSort && (
                <div className="absolute right-0 top-10 bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden z-10 w-40 shadow-xl">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSort(opt);
                        setShowSort(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#0f172a] ${sort === opt ? "text-[#7c3aed]" : "text-[#f9fafb]"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notification Rows */}
          {loading ? (
            <p className="text-[#9ca3af] text-sm py-10 text-center">
              Loading...
            </p>
          ) : leaves.length === 0 ? (
            <p className="text-[#9ca3af] text-sm py-10 text-center">
              No notifications found.
            </p>
          ) : (
            leaves.map((leave) => (
              <NotificationRow key={leave.id} leave={leave} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationRow({ leave }) {
  const dot = statusDot[leave.status?.toLowerCase()] || "bg-[#334155]";
  // const isPending = leave.status?.toLowerCase() === "pending";

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] last:border-0 hover:bg-[#0f172a]/40 transition-colors">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leave.employees?.name}`}
            alt={leave.employees?.name}
            className="w-10 h-10 rounded-full bg-[#334155]"
          />
          {/* {isPending && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#7c3aed] rounded-full border-2 border-[#1e293b]" />
          )} */}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[#f9fafb] text-sm font-semibold">
              {leave.type} Request
            </p>
            <span className={`w-2 h-2 rounded-full ${dot}`} />
          </div>
          <p className="text-[#9ca3af] text-xs mt-0.5">
            @{leave.employees?.name} has applied for {leave.type?.toLowerCase()}{" "}
            — {leave.days} day{leave.days > 1 ? "s" : ""} ({leave.start_date} to{" "}
            {leave.end_date})
          </p>
        </div>
      </div>

      {/* Timestamp */}
      <p className="text-[#9ca3af] text-xs shrink-0 ml-6">{leave.start_date}</p>
    </div>
  );
}
