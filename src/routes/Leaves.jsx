import NavBar from "../components/NavBar";
import { useOutletContext } from "react-router-dom";

export default function Attendance() {
  const { onMenuClick } = useOutletContext();
  return <NavBar title="Notifications" subtitle="All Notifications" fullName="Victor John" onMenuClick={onMenuClick} />;
}
