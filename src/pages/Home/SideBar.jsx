import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Clock,
  DollarSign,
  Briefcase,
  UserSearch,
  CalendarOff,
  CalendarDays,
  Settings,
  Sun,
  Moon,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "All Employees", icon: Users },
  { to: "/attendance", label: "Attendance", icon: Clock },
  { to: "/payroll", label: "Payroll", icon: DollarSign },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/candidates", label: "Candidates", icon: UserSearch },
  { to: "/leaves", label: "Leaves", icon: CalendarOff },
  { to: "/holidays", label: "Holidays", icon: CalendarDays },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function SideBar({ darkMode, setDarkMode }) {
  return (
    <div className="flex flex-col h-screen w-64 bg-[#0f172a] border-r border-[#1e293b] fixed left-0 top-0">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-10 h-10 rounded-full bg-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#7c3aed]/40">
          <span className="text-white text-base font-bold">∞</span>
        </div>
        <span className="text-[#f9fafb] text-xl font-bold tracking-wide">
          HRMS
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3 flex-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/30"
                  : "text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[#1e293b]"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Dark/Light Toggle */}
      <div className="px-4 py-6">
        <div className="flex rounded-lg overflow-hidden border border-[#334155]">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
              !darkMode ? "bg-[#1e293b] text-[#f9fafb]" : "text-[#9ca3af]"
            }`}
          >
            <Sun size={15} /> Light
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
              darkMode ? "bg-[#7c3aed] text-white" : "text-[#9ca3af]"
            }`}
          >
            <Moon size={15} /> Dark
          </button>
        </div>
      </div>
    </div>
  );
}
