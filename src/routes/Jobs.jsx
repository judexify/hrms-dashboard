import NavBar from "../components/NavBar";
import { useOutletContext } from "react-router-dom";

export default function Attendance() {
  const { onMenuClick } = useOutletContext();
  return <NavBar title="Jobs" subtitle="Show All Jobs" fullName="Victor John" onMenuClick={onMenuClick} />;
}
