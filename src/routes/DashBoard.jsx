import { useState, useEffect } from "react";
import supabase from "../services/supabase";
import NavBar from "../components/NavBar";
import "./index.css";
import { Users, Briefcase, CalendarCheck, FolderKanban } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { MyCalendar } from "../components/MyCalendar";
import AttendanceChart from "../components/AttendanceChart.jsx";
import AttendanceOverview from "../components/AttendanceOverview.jsx";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export default function DashBoard() {
  const [hrName, setHrName] = useState(
    () => localStorage.getItem("hrName") || "",
  );

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

  const stats = [
    {
      icon: Users,
      label: "Total Employee",
      value: "560",
      percent: "12%",
      updated: today,
    },
    {
      icon: Briefcase,
      label: "Total Applicant",
      value: "1050",
      percent: "12%",
      updated: today,
    },
    {
      icon: CalendarCheck,
      label: "Total Attendance",
      value: "470",
      percent: "12%",
      updated: today,
    },
    {
      icon: FolderKanban,
      label: "Total Project",
      value: "250",
      percent: "12%",
      updated: today,
    },
  ];

  return (
    <>
      <NavBar
        title={`Hello ${hrName.split(" ")[0]} 🤝`}
        subtitle={getGreeting()}
        fullName={`${hrName}`}
      />
      <div className="p-8">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 grid grid-cols-2 gap-5">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
          <MyCalendar />
        </div>
        <div className="grid grid-cols-3 gap-5 mt-5">
          <div className="col-span-2">{/* <AttendanceChart /> */}</div>
          <div>{/* your future content here */}</div>
        </div>
      </div>
      <AttendanceOverview />
    </>
  );
}
