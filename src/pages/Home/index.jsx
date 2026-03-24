import Sidebar from "./SideBar";
import MainContent from "./MainContent";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <MainContent />
    </div>
  );
}
