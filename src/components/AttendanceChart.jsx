import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", present: 60, late: 0, absent: 0 },
  { day: "Tue", present: 60, late: 20, absent: 0 },
  { day: "Wed", present: 60, late: 30, absent: 5 },
  { day: "Thu", present: 30, late: 0, absent: 0 },
  { day: "Fri", present: 60, late: 20, absent: 0 },
  { day: "Sat", present: 60, late: 25, absent: 0 },
  { day: "Sun", present: 60, late: 30, absent: 5 },
];

export default function AttendanceChart() {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 md:p-5 mt-5">
      <p className="text-[#f9fafb] text-base font-bold mb-6">
        Attendance Chart
      </p>

      {/* Scrollable on very small screens */}
      <div className="overflow-x-auto">
        <div className="min-w-[300px]">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} barSize={16} barGap={2}>
              <CartesianGrid
                vertical={false}
                stroke="#334155"
                strokeDasharray="0"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                width={35}
              />
              <Tooltip
                cursor={{ fill: "rgba(124,58,237,0.05)" }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Bar
                dataKey="present"
                stackId="a"
                fill="#3b82f6"
                radius={[0, 0, 4, 4]}
              />
              <Bar dataKey="late" stackId="a" fill="#eab308" />
              <Bar
                dataKey="absent"
                stackId="a"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4">
        {[
          { color: "#3b82f6", label: "Present" },
          { color: "#eab308", label: "Late" },
          { color: "#ef4444", label: "Absent" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-[#9ca3af] text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
