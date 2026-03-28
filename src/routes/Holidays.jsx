import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Search } from "lucide-react";
import NavBar from "../components/NavBar";
import supabase from "../services/supabase";

export default function Holidays() {
  const { onMenuClick } = useOutletContext();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchHolidays = async () => {
      const { data, error } = await supabase
        .from("holidays")
        .select("id, name, date, day, type")
        .order("date", { ascending: true });

      if (!error) setHolidays(data);
      setLoading(false);
    };
    fetchHolidays();
  }, []);

  const filtered = query
    ? holidays.filter(
        (h) =>
          h.name.toLowerCase().includes(query.toLowerCase()) ||
          h.day.toLowerCase().includes(query.toLowerCase()) ||
          h.type.toLowerCase().includes(query.toLowerCase()),
      )
    : holidays;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <NavBar
        title="Holidays"
        subtitle="Company Holidays"
        fullName="Jude Oluwadunsi"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-8">
        {/* Search */}
        <div className="flex items-center gap-3 bg-transparent border border-[#334155] rounded-lg px-4 py-2.5 w-full sm:w-80 mb-8">
          <Search size={16} className="text-[#9ca3af] shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-[#f9fafb] text-sm outline-none w-full placeholder-[#9ca3af]"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 px-4 pb-3 border-b border-[#334155]">
            {["Date", "Day", "Holiday Name"].map((h) => (
              <p key={h} className="text-[#9ca3af] text-sm">
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <p className="text-[#9ca3af] text-sm py-10 text-center">
              Loading...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-[#9ca3af] text-sm py-10 text-center">
              No holidays found.
            </p>
          ) : (
            filtered.map((holiday) => (
              <div
                key={holiday.id}
                className="grid grid-cols-3 px-4 py-5 border-b border-[#334155] last:border-0 hover:bg-[#1e293b]/40 transition-colors group"
              >
                {/* Date with left accent bar */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-1 h-8 rounded-full shrink-0 ${
                      holiday.type === "Public Holiday"
                        ? "bg-[#7c3aed]"
                        : "bg-[#334155]"
                    }`}
                  />
                  <p className="text-[#f9fafb] text-sm font-medium">
                    {formatDate(holiday.date)}
                  </p>
                </div>

                <p className="text-[#f9fafb] text-sm flex items-center">
                  {holiday.day}
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-[#f9fafb] text-sm font-medium">
                    {holiday.name}
                  </p>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium hidden group-hover:inline-block ${
                      holiday.type === "Public Holiday"
                        ? "bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30"
                        : "bg-[#334155] text-[#9ca3af]"
                    }`}
                  >
                    {holiday.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
