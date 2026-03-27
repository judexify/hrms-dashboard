import { useEffect, useState } from "react";
import supabase from "../services/supabase";
import { HRContext } from "./HRContext.js";

export default function EmployeeProvider({ children }) {
  const [employee, setEmployee] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    const fetchEmployee = async () => {
      const { data, error } = await supabase.from("employees").select(`
        id, name, role, avatar, status, title, department, employment_type
      `);
      if (!error) setEmployee(data);
    };

    const fetchCandidates = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select(
          `
          id, name, applied_for, applied_date, email, mobile, CV, status
          `,
        )
        .order("applied_date", { ascending: false });
      console.log(data);
      if (!error) setCandidates(data);
    };

    const fetchAttendanceCount = async () => {
      const { count } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true });

      if (count !== null) setAttendanceCount(count);
    };

    const fetchAll = async () => {
      await Promise.all([
        fetchEmployee(),
        fetchCandidates(),
        fetchAttendanceCount(),
      ]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  return (
    <HRContext.Provider
      value={{
        employee,
        setEmployee,
        loading,
        attendanceCount,
        candidates,
        setCandidates,
      }}
    >
      {children}
    </HRContext.Provider>
  );
}
