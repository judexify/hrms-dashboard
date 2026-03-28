import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import EmployeeProvider from "../../context/HRContext.jsx";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("English");

  return (
    <EmployeeProvider>
      <div className="flex min-h-screen bg-[#0f172a]">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
          <Outlet
            context={{
              onMenuClick: () => setSidebarOpen(true),
              darkMode,
              setDarkMode,
              language,
              setLanguage,
            }}
          />
        </div>
      </div>
    </EmployeeProvider>
  );
}
