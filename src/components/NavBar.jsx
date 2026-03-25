import "./index.css";
import { Bell, ChevronDown, User, LogOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import supabase from "../services/supabase";

export default function Header({ title, subtitle, fullName }) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("hrName");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-10 pointer-events-none backdrop-blur-sm bg-black/20" />
      )}
      <div className="flex items-center justify-between px-8 py-5 bg-[#0f172a] border-b border-[#1e293b]">
        {/* Left — Title & Subtitle */}
        <div>
          <h1 className="text-[#f9fafb] text-2xl font-bold">{title}</h1>
          <p className="text-[#9ca3af] text-sm">{subtitle}</p>
        </div>

        {/* Right — Notification & Profile */}
        <div className="flex items-center gap-3">
          {/* Bell */}
          <button className="w-11 h-11 flex items-center justify-center rounded-lg border border-[#334155] text-[#9ca3af] hover:text-[#f9fafb] hover:border-[#7c3aed] transition-all">
            <Bell size={18} />
          </button>

          {/* Profile */}
          <div className="relative z-20" ref={modalRef}>
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg border border-[#334155] hover:border-[#7c3aed] transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#7c3aed] flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {fullName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-[#f9fafb] text-sm font-semibold leading-none">
                  {fullName}
                </p>
                <p className="text-[#9ca3af] text-xs mt-0.5">HR Manager</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-[#9ca3af] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </div>

            {/* dropdown modal */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-[#334155] rounded-[10px] shadow-xl overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#f9fafb] hover:bg-[#7c3aed]/20 hover:text-[#7c3aed] transition-all"
                  onClick={() => setOpen(false)}
                >
                  <User size={16} />
                  My Profile
                </button>
                <div className="border-t border-[#334155]" />
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#f9fafb] hover:bg-red-500/10 hover:text-red-400 transition-all"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
