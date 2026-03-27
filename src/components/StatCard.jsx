export function StatCard({ icon: Icon, label, value, percent, updated }) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 md:p-5 flex flex-col gap-3 md:gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg border border-[#334155] flex items-center justify-center shrink-0">
            <Icon size={18} className="text-[#7c3aed]" />
          </div>
          <p className="text-[#9ca3af] text-xs md:text-sm font-medium leading-tight">
            {label}
          </p>
        </div>
        {/* <div
          className="flex flex-col items-center justify-center 
  w-8 h-8 md:w-12 md:h-12 
  text-green-500 text-[10px] md:text-xs font-bold gap-0 shrink-0"
        >
          <span className="text-[10px] md:text-xs">▲</span>
          <span>{percent}</span>
        </div> */}
      </div>
      <p className="text-[#f9fafb] text-2xl md:text-3xl font-bold">{value}</p>
      <p className="text-[#9ca3af] text-xs border-t border-[#334155] pt-3">
        Updated : {updated}
      </p>
    </div>
  );
}
