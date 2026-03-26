import { useEffect, useState } from "react";
import supabase from "../services/supabase";
import { HRContext } from "./HRContext.js";

export default function EmployeeProvider({ children }) {
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    const fetchEmployee = async () => {
      const { data, error } = await supabase.from("employees").select(`
        id, name, role, avatar, status, title, department, employment_type
      `);
      if (!error) setEmployee(data);
      setLoading(false);
    };

    const fetchAttendanceCount = async () => {
      const { count } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true });
      if (count !== null) setAttendanceCount(count);
    };

    fetchEmployee();
    fetchAttendanceCount();
  }, []);

  return (
    <HRContext.Provider
      value={{ employee, setEmployee, loading, attendanceCount }}
    >
      {children}
    </HRContext.Provider>
  );
}
