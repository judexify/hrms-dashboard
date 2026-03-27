import { useState, useEffect } from "react";
import supabase from "../services/supabase";
import NavBar from "../components/NavBar";
import "./index.css";
import { Users, Briefcase, CalendarCheck, FolderKanban } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { MyCalendar } from "../components/MyCalendar";
import AttendanceChart from "../components/AttendanceChart.jsx";
// import AttendanceOverview from "../components/AttendanceOverview.jsx";
import { useOutletContext } from "react-router-dom";
import {
  useEmployee,
  useAttendance,
  useCandidates,
} from "../context/HRContext.js";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export default function DashBoard() {
  const { onMenuClick } = useOutletContext();
  const [hrName, setHrName] = useState(
    () => localStorage.getItem("hrName") || "",
  );
  const { employee } = useEmployee();
  const { attendanceCount } = useAttendance();
  const { candidates } = useCandidates();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("hr_profile")
          .select("name")
          .eq("id", session.user.id)
          .single();
        if (data) {
          setHrName(data.name);
          localStorage.setItem("hrName", data.name);
        }
      }
    };
    fetchProfile();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const totalEmployees = employee.length;

  const stats = [
    {
      icon: Users,
      label: "Total Employee",
      value: totalEmployees,
      percent: "12%",
      updated: today,
    },
    {
      icon: Briefcase,
      label: "Total Applicant",
      value: candidates.length,
      percent: "12%",
      updated: today,
    },
    {
      icon: CalendarCheck,
      label: "Total Attendance",
      value: attendanceCount,
      percent: "12%",
      updated: "Every Saturday",
    },
    {
      icon: FolderKanban,
      label: "Total Project",
      value: "-",
      percent: "-",
      updated: "🚫",
    },
  ];

  return (
    <>
      <NavBar
        title={`Hello ${hrName.split(" ")[0]} 🤝`}
        subtitle={getGreeting()}
        fullName={`${hrName}`}
        onMenuClick={onMenuClick}
      />
      <div className="p-4 md:p-8">
        {/* Stats + Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-5 lg:col-span-2">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
          {/* Calendar — full width on mobile, right column on desktop */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <MyCalendar />
          </div>
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
          <div className="lg:col-span-2">
            <AttendanceChart />
          </div>
          <div>{/* future content */}</div>
        </div>
      </div>

      {/* Attendance Overview */}
      {/* <div className="px-4 md:px-8 pb-8 overflow-x-auto">
       
        <AttendanceOverview 
        arrayofHeader={["Employee Name", "Department", "Check In Time", "Status"]}
         showViewButton={true} limit={7} />
      </div> */}
    </>
  );
}
