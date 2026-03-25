import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

import NavBar from "../../components/NavBar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
}
