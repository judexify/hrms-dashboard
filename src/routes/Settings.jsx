import { useOutletContext } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ChevronDown, Moon, Sun } from "lucide-react";

const LANGUAGES = ["English", "French", "Spanish", "German", "Arabic"];

export default function Settings() {
  const { onMenuClick, darkMode, setDarkMode, language, setLanguage } =
    useOutletContext();

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <NavBar
        title="Settings"
        subtitle="All System Settings"
        fullName={localStorage.getItem("hrName") || "HR MANAGER"}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-8">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
          {/* Appearance */}
          <SettingRow
            title="Appearance"
            description="Customize how your theme looks on your device"
            control={
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />

          {/* Language */}
          <SettingRow
            title="Language"
            description="Select your language"
            control={
              <SelectControl
                value={language}
                onChange={setLanguage}
                options={LANGUAGES}
              />
            }
            last
          />
        </div>
      </div>
    </div>
  );
}

function SettingRow({ title, description, control, last = false }) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-6 ${!last ? "border-b border-[#334155]" : ""}`}
    >
      <div>
        <p className="text-[#f9fafb] text-sm font-bold">{title}</p>
        <p className="text-[#9ca3af] text-xs mt-1">{description}</p>
      </div>
      {control}
    </div>
  );
}

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode((p) => !p)}
      className="flex items-center gap-2 px-4 py-2 border border-[#334155] rounded-lg text-[#f9fafb] text-sm hover:border-[#7c3aed] transition-all min-w-[110px] justify-between"
    >
      <div className="flex items-center gap-2">
        {darkMode ? (
          <Moon size={14} className="text-[#a78bfa]" />
        ) : (
          <Sun size={14} className="text-yellow-400" />
        )}
        {darkMode ? "Dark" : "Light"}
      </div>
      <ChevronDown size={14} className="text-[#9ca3af]" />
    </button>
  );
}

function SelectControl({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-[#f9fafb] text-sm outline-none cursor-pointer hover:border-[#7c3aed] transition-all pr-8 min-w-[110px]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="text-[#9ca3af] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  );
}
