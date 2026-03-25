export function StatCard({ icon: Icon, label, value, percent, updated }) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 flex flex-col gap-4">
      {/* Top */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg border border-[#334155] flex items-center justify-center">
            <Icon size={22} className="text-[#7c3aed]" />
          </div>
          <p className="text-[#9ca3af] text-sm font-medium">{label}</p>
        </div>
        <div className="flex flex-col items-center justify-center w-14 h-14 bg-green-500 rounded-xl text-white text-xs font-bold gap-0.5">
          <span>▲</span>
          <span>{percent}</span>
        </div>
      </div>

      <p className="text-[#f9fafb] text-3xl font-bold">{value}</p>

      <p className="text-[#9ca3af] text-xs border-t border-[#334155] pt-3">
        Updated : {updated}
      </p>
    </div>
  );
}
