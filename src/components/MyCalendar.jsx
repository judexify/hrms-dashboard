import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar } from "lucide-react";

export function MyCalendar() {
  const [collapsed, setCollapsed] = useState(false);
  const today = new Date();
  const [current, setCurrent] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prevMonth = () => {
    setCurrent((c) =>
      c.month === 0
        ? { month: 11, year: c.year - 1 }
        : { month: c.month - 1, year: c.year },
    );
  };

  const nextMonth = () => {
    setCurrent((c) =>
      c.month === 11
        ? { month: 0, year: c.year + 1 }
        : { month: c.month + 1, year: c.year },
    );
  };

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const daysInPrev = new Date(current.year, current.month, 0).getDate();

  const cells = [];

  // prev month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false });
  }
  // current month days
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, current: true });
  }
  // next month leading days
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, current: false });
  }

  const isToday = (day, isCurrent) =>
    isCurrent &&
    day === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#f9fafb] text-base font-bold">My Schedule</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0f172a] border border-[#334155] text-[#9ca3af] hover:text-white transition"
          >
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
          <div className="w-10 h-10 rounded-lg bg-[#7c3aed] flex items-center justify-center">
            <Calendar size={18} className="text-white" />
          </div>
        </div>
      </div>

      {/* Month Nav */}
      {!collapsed && (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-center text-[#9ca3af] hover:text-white transition"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-[#f9fafb] text-sm font-semibold">
              {monthNames[current.month]} {current.year}
            </p>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-center text-[#9ca3af] hover:text-white transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <p
                key={d}
                className="text-center text-[#9ca3af] text-xs font-medium py-1"
              >
                {d}
              </p>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7">
            {cells.map((cell, i) => (
              <div
                key={i}
                className={`flex items-center justify-center h-9 text-sm rounded-full transition-all cursor-pointer
              ${!cell.current ? "text-[#334155]" : "text-[#9ca3af] hover:text-white"}
              ${isToday(cell.day, cell.current) ? "bg-[#7c3aed] text-white font-bold" : ""}
            `}
              >
                {cell.day}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
