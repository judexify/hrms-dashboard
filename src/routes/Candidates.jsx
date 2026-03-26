import NavBar from "../components/NavBar";
import { useOutletContext } from "react-router-dom";

export default function Attendance() {
  const { onMenuClick } = useOutletContext();
  return <NavBar title="Candidaites" subtitle="All Candidate Records" fullName="Victor John" onMenuClick={onMenuClick} />;
}
