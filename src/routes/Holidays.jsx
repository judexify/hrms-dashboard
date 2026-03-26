import NavBar from "../components/NavBar";
import { useOutletContext } from "react-router-dom";

export default function Attendance() {
  const { onMenuClick } = useOutletContext();
  return <NavBar title="Holidays" subtitle="Company Holidays" fullName="Victor John" onMenuClick={onMenuClick} />;
}
