import NavBar from "../components/NavBar";
import { useOutletContext } from "react-router-dom";

export default function Attendance() {
  const { onMenuClick } = useOutletContext();
  return <NavBar title="Settings" subtitle="All System Settings" fullName="Victor John" onMenuClick={onMenuClick} />;
}
